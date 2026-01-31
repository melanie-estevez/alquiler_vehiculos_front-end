import { useEffect, useMemo, useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import {
  type CreateVehiculoDto,
  type UpdateVehiculoDto,
  type Vehiculo,
  VehiculosService,
} from "../../services/vehiculos.service";
import { API_BASE_URL } from "../../services/api";
import { SucursalesService, type Sucursal } from "../../services/sucursales.service";

interface Props {
  show: boolean;
  onClose: () => void;
  vehiculo: Vehiculo | null;

  // OJO: tu hook useVehiculos YA devuelve Vehiculo (en tu proyecto)
  onCreate: (data: CreateVehiculoDto) => Promise<Vehiculo>;
  onUpdate: (id: string, data: UpdateVehiculoDto) => Promise<Vehiculo>;

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
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loadingSucursales, setLoadingSucursales] = useState(false);

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

  // ✅ cargar sucursales SIEMPRE que se abra el modal
  useEffect(() => {
    if (!show) return;

    let mounted = true;
    const load = async () => {
      setLoadingSucursales(true);
      try {
        const items = await SucursalesService.getAll();
        if (mounted) setSucursales(Array.isArray(items) ? items : []);
      } catch (e) {
        console.error("Error cargando sucursales", e);
        if (mounted) setSucursales([]);
      } finally {
        if (mounted) setLoadingSucursales(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [show]);

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

  // ✅ helper: aplica imagen por ID (funciona para CREAR y EDITAR)
  const applyImagen = async (idVehiculo: string) => {
    // archivo
    if (file) {
      await VehiculosService.uploadImagen(idVehiculo, file);
      handlePickFile(null);
    }

    // link
    if (linkImg && linkImg.startsWith("http")) {
      await VehiculosService.updateImagenUrl(idVehiculo, linkImg);
    }
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

      // 1) guardar vehículo (create/update) ✅ obteniendo el ID real
      let saved: Vehiculo;

      if (vehiculo) {
        const update: UpdateVehiculoDto = { ...payload };
        saved = await onUpdate(vehiculo.id_vehiculo, update);
      } else {
        saved = await onCreate(payload);
      }

      const savedId = saved?.id_vehiculo;
      if (!savedId) {
        setError("No se obtuvo el ID del vehículo. Revisa la respuesta del backend.");
        return;
      }

      // 2) aplicar imagen (archivo o link) INMEDIATO (sin tener que editar luego)
      setUploadingImg(true);
      await applyImagen(savedId);

      // 3) refrescar lista
      if (onAfterSave) await onAfterSave();

      onClose();
    } catch (err: any) {
      console.error(err);
      // TIP: si es 404, casi siempre es URL base mal (ver nota abajo)
      setError(err?.response?.data?.message || "No se pudo guardar el vehículo.");
    } finally {
      setSaving(false);
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

        <div className="row g-4">
          {/* Imagen */}
          <div className="col-12 col-lg-5">
            <div
              className="rounded-4 border p-3"
              style={{ borderColor: "#e9ecef", background: "#f8f9fa" }}
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
              </div>

              <div className="text-muted small mt-2">
                Ahora la imagen se guarda también cuando el vehículo es nuevo (sin editar después).
              </div>
            </div>
          </div>

          {/* Form */}
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
                  disabled={disabledAll || loadingSucursales}
                >
                  <option value="">
                    {loadingSucursales ? "Cargando sucursales..." : "Sin sucursal"}
                  </option>

                  {listSucursales.map((s) => (
                    <option key={s.id_sucursal} value={s.id_sucursal}>
                      {s.nombre} - {s.ciudad}
                    </option>
                  ))}
                </select>
              </div>

              {!loadingSucursales && listSucursales.length === 0 && (
                <div className="col-12">
                  <div className="text-danger small">
                    No se cargaron sucursales. Revisa que GET /sucursales responda y que VITE_API_URL sea correcto.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer style={{ borderTop: "1px solid #eee", background: "#fff" }}>
        <Button variant="outline-secondary" onClick={onClose} disabled={disabledAll}>
          Cancelar
        </Button>

        <Button variant="dark" onClick={handleSubmit} disabled={disabledAll}>
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
