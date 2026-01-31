import { useEffect, useMemo, useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import {
  type CreateVehiculoDto,
  type UpdateVehiculoDto,
  type Vehiculo,
  VehiculosService,
} from "../../services/vehiculos.service";
import { useSucursales } from "../../hooks/useSucursales";
import { API_BASE_URL } from "../../services/api";

interface Props {
  show: boolean;
  onClose: () => void;
  vehiculo: Vehiculo | null;
  onCreate: (data: CreateVehiculoDto) => Promise<void>;
  onUpdate: (id: string, data: UpdateVehiculoDto) => Promise<void>;
  onAfterSave?: () => Promise<void> | void;
}

const imageUrl = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};

export default function VehiculoFormModal({
  show,
  onClose,
  vehiculo,
  onCreate,
  onUpdate,
  onAfterSave,
}: Props) {
  const { sucursales } = useSucursales();

  const listSucursales = useMemo(
    () => (Array.isArray(sucursales) ? sucursales : []),
    [sucursales],
  );

  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    anio: "",
    placa: "",
    precio_diario: "",
    id_sucursal: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Imagen
  const [file, setFile] = useState<File | null>(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [linkImg, setLinkImg] = useState<string>("");

  // Preview local para archivo
  const [localPreview, setLocalPreview] = useState<string>("");

  const disabledAll = saving || uploadingImg;

  const inputStyle: React.CSSProperties = {
    borderRadius: 12,
    border: "1px solid #dee2e6",
    background: "#fff",
    padding: "12px 14px",
  };

  const labelStyle: React.CSSProperties = {
    color: "#111",
    fontWeight: 700,
    fontSize: 13,
    marginBottom: 6,
  };

  useEffect(() => {
    if (vehiculo) {
      setForm({
        marca: vehiculo.marca ?? "",
        modelo: vehiculo.modelo ?? "",
        anio: String(vehiculo.anio ?? ""),
        placa: vehiculo.placa ?? "",
        precio_diario: String(vehiculo.precio_diario ?? ""),
        id_sucursal:
          vehiculo.sucursal?.id_sucursal || (vehiculo as any).id_sucursal || "",
      });
      setLinkImg((vehiculo.imagen_url as any) || "");
    } else {
      setForm({
        marca: "",
        modelo: "",
        anio: "",
        placa: "",
        precio_diario: "",
        id_sucursal: "",
      });
      setLinkImg("");
    }

    setFile(null);
    setLocalPreview("");
    setError(null);
  }, [vehiculo, show]);

  // liberar objectURL
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePickFile = (f: File | null) => {
    setFile(f);
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(f ? URL.createObjectURL(f) : "");
  };

  const currentImg =
    localPreview ||
    (linkImg?.startsWith("http") ? linkImg : imageUrl(linkImg)) ||
    imageUrl(vehiculo?.imagen_url);

  const validate = (payload: CreateVehiculoDto) => {
    if (!payload.marca?.trim()) return "Marca obligatoria";
    if (!payload.modelo?.trim()) return "Modelo obligatorio";
    if (!payload.placa?.trim()) return "Placa obligatoria";
    if (!payload.anio || isNaN(payload.anio)) return "Año inválido";
    if (payload.precio_diario == null || isNaN(payload.precio_diario))
      return "Precio diario inválido";
    return "";
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setSaving(true);

      const payload: CreateVehiculoDto = {
        marca: form.marca.trim(),
        modelo: form.modelo.trim(),
        placa: form.placa.trim(),
        anio: Number(form.anio),
        precio_diario: Number(form.precio_diario),
        id_sucursal: form.id_sucursal ? form.id_sucursal : undefined,
      };

      const v = validate(payload);
      if (v) {
        setError(v);
        return;
      }

      // 1) guardar vehículo (create/update)
      if (vehiculo) {
        const update: UpdateVehiculoDto = { ...payload };
        await onUpdate(vehiculo.id_vehiculo, update);
      } else {
        await onCreate(payload);
      }

      // 2) refrescar para tener el id (si creaste)
      if (onAfterSave) await onAfterSave();

      // 3) si es edición, aplicar imagen inmediatamente
      //    (si es creación, se aplica luego al editar, a menos que tu hook devuelva el ID creado)
      if (vehiculo?.id_vehiculo) {
        // Si el usuario eligió archivo, subimos
        if (file) {
          setUploadingImg(true);
          await VehiculosService.uploadImagen(vehiculo.id_vehiculo, file);
          handlePickFile(null);
        }

        // Si escribió link http, guardamos link
        if (linkImg && linkImg.startsWith("http")) {
          setUploadingImg(true);
          await VehiculosService.updateImagenUrl(vehiculo.id_vehiculo, linkImg);
        }
      }

      if (onAfterSave) await onAfterSave();
      onClose();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el vehículo.");
    } finally {
      setSaving(false);
      setUploadingImg(false);
    }
  };

  const handleUploadImagen = async () => {
    if (!vehiculo?.id_vehiculo) {
      setError("Primero guarda el vehículo y luego sube la imagen.");
      return;
    }
    if (!file) {
      setError("Selecciona una imagen primero.");
      return;
    }

    try {
      setError(null);
      setUploadingImg(true);
      await VehiculosService.uploadImagen(vehiculo.id_vehiculo, file);
      handlePickFile(null);
      if (onAfterSave) await onAfterSave();
    } catch (err) {
      console.error(err);
      setError("No se pudo subir la imagen.");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleApplyLink = async () => {
    if (!vehiculo?.id_vehiculo) {
      setError("Primero guarda el vehículo y luego aplica el link.");
      return;
    }
    if (!linkImg || !linkImg.startsWith("http")) {
      setError("Ingresa un link válido (https://...)");
      return;
    }

    try {
      setError(null);
      setUploadingImg(true);
      await VehiculosService.updateImagenUrl(vehiculo.id_vehiculo, linkImg);
      if (onAfterSave) await onAfterSave();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el link de imagen.");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleRemoveImagen = async () => {
    try {
      setError(null);
      handlePickFile(null);
      setLinkImg("");

      if (!vehiculo?.id_vehiculo) return;

      setUploadingImg(true);
      await VehiculosService.updateImagenUrl(vehiculo.id_vehiculo, null);
      if (onAfterSave) await onAfterSave();
    } catch (err) {
      console.error(err);
      setError("No se pudo quitar la imagen.");
    } finally {
      setUploadingImg(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      backdrop="static"
      centered
      size="lg"
      contentClassName="border-0"
    >
      <Modal.Header
        closeButton
        style={{
          borderBottom: "1px solid #eee",
          background: "#fff",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <Modal.Title className="fw-bold" style={{ color: "#111" }}>
          {vehiculo ? "Editar vehículo" : "Nuevo vehículo"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ background: "#fff" }}>
        {error && (
          <Alert variant="danger" className="rounded-4">
            {error}
          </Alert>
        )}

        {/* Layout 2 columnas */}
        <div className="row g-4">
          {/* Col izquierda: Imagen */}
          <div className="col-12 col-lg-5">
            <div
              className="rounded-4 border p-3"
              style={{
                borderColor: "#e9ecef",
                background: "#f8f9fa",
              }}
            >
              <div style={labelStyle}>Imagen del vehículo</div>

              <div
                className="rounded-4 overflow-hidden border mb-3"
                style={{
                  borderColor: "#e9ecef",
                  background: "#111",
                  height: 220,
                }}
              >
                {currentImg ? (
                  <img
                    src={currentImg}
                    alt="Vehículo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "";
                    }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center h-100"
                    style={{ color: "rgba(255,255,255,.65)" }}
                  >
                    Sin imagen
                  </div>
                )}
              </div>

              {/* Link */}
              <label className="form-label" style={labelStyle}>
                Link de imagen
              </label>
              <input
                className="form-control"
                style={inputStyle}
                placeholder="https://..."
                value={linkImg}
                onChange={(e) => setLinkImg(e.target.value)}
                disabled={disabledAll}
              />
              <div className="d-flex gap-2 mt-2 flex-wrap">
                <Button
                  variant="outline-dark"
                  className="rounded-3"
                  onClick={handleApplyLink}
                  disabled={disabledAll || !vehiculo}
                  title={vehiculo ? "" : "Guarda primero el vehículo"}
                >
                  Aplicar link
                </Button>
                <Button
                  variant="outline-secondary"
                  className="rounded-3"
                  onClick={handleRemoveImagen}
                  disabled={disabledAll}
                >
                  Quitar
                </Button>
              </div>

              {/* Archivo */}
              <div className="mt-3">
                <label className="form-label" style={labelStyle}>
                  Subir archivo
                </label>
                <input
                  className="form-control"
                  style={{ ...inputStyle, padding: 10 }}
                  type="file"
                  accept="image/*"
                  disabled={disabledAll}
                  onChange={(e) => handlePickFile(e.target.files?.[0] ?? null)}
                />

                <div className="d-grid mt-2">
                  <Button
                    variant="dark"
                    className="rounded-3"
                    onClick={handleUploadImagen}
                    disabled={disabledAll || !vehiculo || !file}
                    title={vehiculo ? "" : "Guarda primero el vehículo"}
                  >
                    {uploadingImg ? "Subiendo..." : "Subir imagen"}
                  </Button>
                </div>

                <div className="text-muted small mt-2" style={{ lineHeight: 1.4 }}>
                  {vehiculo
                    ? "Puedes aplicar link o subir archivo. Se guardará en el vehículo."
                    : "Primero guarda el vehículo. Luego podrás aplicar link o subir archivo."}
                </div>
              </div>
            </div>
          </div>

          {/* Col derecha: Form */}
          <div className="col-12 col-lg-7">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" style={labelStyle}>
                  Marca
                </label>
                <input
                  className="form-control"
                  style={inputStyle}
                  name="marca"
                  placeholder="Ej: Toyota"
                  value={form.marca}
                  onChange={handleChange}
                  disabled={disabledAll}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" style={labelStyle}>
                  Modelo
                </label>
                <input
                  className="form-control"
                  style={inputStyle}
                  name="modelo"
                  placeholder="Ej: Corolla"
                  value={form.modelo}
                  onChange={handleChange}
                  disabled={disabledAll}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" style={labelStyle}>
                  Año
                </label>
                <input
                  className="form-control"
                  style={inputStyle}
                  type="number"
                  name="anio"
                  placeholder="Ej: 2024"
                  value={form.anio}
                  onChange={handleChange}
                  disabled={disabledAll}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" style={labelStyle}>
                  Placa
                </label>
                <input
                  className="form-control"
                  style={inputStyle}
                  name="placa"
                  placeholder="Ej: PBA-1234"
                  value={form.placa}
                  onChange={handleChange}
                  disabled={disabledAll}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" style={labelStyle}>
                  Precio diario
                </label>
                <input
                  className="form-control"
                  style={inputStyle}
                  type="number"
                  name="precio_diario"
                  placeholder="Ej: 35"
                  value={form.precio_diario}
                  onChange={handleChange}
                  disabled={disabledAll}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" style={labelStyle}>
                  Sucursal
                </label>
                <select
                  className="form-select"
                  style={{ ...inputStyle, padding: "12px 14px" }}
                  name="id_sucursal"
                  value={form.id_sucursal}
                  onChange={handleChange}
                  disabled={disabledAll}
                >
                  <option value="">Sin sucursal</option>
                  {listSucursales.map((s: any) => (
                    <option key={s.id_sucursal} value={s.id_sucursal}>
                      {s.nombre} - {s.ciudad}
                    </option>
                  ))}
                </select>
              </div>

              {/* NOTE */}
              <div className="col-12">
                <div
                  className="rounded-4 border p-3"
                  style={{
                    borderColor: "#e9ecef",
                    background: "#f8f9fa",
                    color: "#6c757d",
                  }}
                >
                  <div className="fw-bold text-dark mb-1">Tip</div>
                  <div className="small">
                    Para subir imagen desde archivo o aplicar link, primero guarda el vehículo
                    (si es nuevo) y luego edítalo.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer
        style={{
          borderTop: "1px solid #eee",
          background: "#fff",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <Button
          variant="outline-secondary"
          className="rounded-3"
          onClick={onClose}
          disabled={disabledAll}
        >
          Cancelar
        </Button>

        <Button
          variant="dark"
          className="rounded-3 px-4"
          onClick={handleSubmit}
          disabled={disabledAll}
        >
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
