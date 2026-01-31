import React, { useEffect, useMemo, useState } from "react";
import type {
  Vehiculo,
  CreateVehiculoDto,
  UpdateVehiculoDto,
} from "../../services/vehiculos.service";
import { VehiculosService } from "../../services/vehiculos.service";

type SucursalOption = { id: string; nombre: string };

interface Props {
  show: boolean;
  onClose: () => void;
  vehiculo: Vehiculo | null;

  // ✅ mismos tipos que usa el hook/service
  onCreate: (data: CreateVehiculoDto) => Promise<Vehiculo>;
  onUpdate: (id: string, data: UpdateVehiculoDto) => Promise<Vehiculo>;

  onAfterSave?: () => Promise<void> | void;
}

export default function VehiculoFormModal({
  show,
  onClose,
  vehiculo,
  onCreate,
  onUpdate,
  onAfterSave,
}: Props) {
  const isEdit = !!vehiculo;

  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");
  const [anio, setAnio] = useState<number>(new Date().getFullYear());
  const [precioDiario, setPrecioDiario] = useState<number>(0);

  // ✅ tipado real del estado
  const [estado, setEstado] = useState<Vehiculo["estado"]>("DISPONIBLE");
  const [idSucursal, setIdSucursal] = useState<string>("");

  const [file, setFile] = useState<File | null>(null);
  const [linkImg, setLinkImg] = useState<string>("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  const [sucursales, setSucursales] = useState<SucursalOption[]>([]);
  const [loadingSucursales, setLoadingSucursales] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadSucursales = async () => {
      try {
        setLoadingSucursales(true);
        const res: any = await (VehiculosService as any).getSucursales?.();
        const items: any[] = Array.isArray(res) ? res : res?.items ?? res ?? [];

        const parsed: SucursalOption[] = items
          .map((s) => ({
            id: String(s.id_sucursal ?? s.id ?? ""),
            nombre: String(s.nombre ?? s.name ?? ""),
          }))
          .filter((s) => s.id && s.nombre);

        if (mounted) setSucursales(parsed);
      } catch {
        if (mounted) setSucursales([]);
      } finally {
        if (mounted) setLoadingSucursales(false);
      }
    };

    loadSucursales();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!show) return;

    setError("");
    setFile(null);

    if (vehiculo) {
      setMarca(vehiculo.marca ?? "");
      setModelo(vehiculo.modelo ?? "");
      setPlaca(vehiculo.placa ?? "");
      setAnio(Number(vehiculo.anio ?? new Date().getFullYear()));
      setPrecioDiario(Number(vehiculo.precio_diario ?? 0));
      setEstado(vehiculo.estado ?? "DISPONIBLE");

      const sid =
        (vehiculo as any).id_sucursal ||
        vehiculo.sucursal?.id_sucursal ||
        (vehiculo as any).sucursal_id ||
        "";
      setIdSucursal(sid ? String(sid) : "");

      const currentImg =
        (vehiculo as any).imagen_url ||
        (vehiculo as any).imagenUrl ||
        (vehiculo as any).img_url ||
        "";
      setLinkImg(currentImg ? String(currentImg) : "");
    } else {
      setMarca("");
      setModelo("");
      setPlaca("");
      setAnio(new Date().getFullYear());
      setPrecioDiario(0);
      setEstado("DISPONIBLE");
      setIdSucursal("");
      setLinkImg("");
    }
  }, [show, vehiculo]);

  const canSubmit = useMemo(() => {
    if (!marca.trim()) return false;
    if (!modelo.trim()) return false;
    if (!placa.trim()) return false;
    if (!anio || Number.isNaN(anio)) return false;
    if (precioDiario === null || Number.isNaN(precioDiario)) return false;
    return true;
  }, [marca, modelo, placa, anio, precioDiario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!canSubmit) {
      setError("Completa los campos obligatorios.");
      return;
    }

    try {
      setSaving(true);

      if (vehiculo) {
        // ✅ UpdateVehiculoDto (partial) + estado
        const payload: UpdateVehiculoDto = {
          marca: marca.trim(),
          modelo: modelo.trim(),
          placa: placa.trim(),
          anio: Number(anio),
          precio_diario: Number(precioDiario),
          estado,
          id_sucursal: idSucursal || undefined,
        };

        const updated = await onUpdate(vehiculo.id_vehiculo, payload);

        const savedId = updated?.id_vehiculo || vehiculo.id_vehiculo;

        if (savedId && file) await VehiculosService.uploadImagen(savedId, file);

        const url = linkImg.trim();
        if (savedId && url && url.startsWith("http")) {
          await VehiculosService.updateImagenUrl(savedId, url);
        }
      } else {
        // ✅ CreateVehiculoDto NO lleva estado (según tu service)
        const payload: CreateVehiculoDto = {
          marca: marca.trim(),
          modelo: modelo.trim(),
          placa: placa.trim(),
          anio: Number(anio),
          precio_diario: Number(precioDiario),
          id_sucursal: idSucursal || undefined,
          imagen_url: linkImg.trim() || null,
        };

        const created = await onCreate(payload);
        const savedId = created?.id_vehiculo;

        if (savedId && file) await VehiculosService.uploadImagen(savedId, file);

        // si quieres forzar estado al crear, lo harías con update luego (si tu API lo permite),
        // pero por tipos tu CreateVehiculoDto no incluye estado.
      }

      if (onAfterSave) await onAfterSave();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "No se pudo guardar el vehículo.");
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      role="dialog"
      style={{ background: "rgba(0,0,0,.35)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content rounded-4">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              {isEdit ? "Editar vehículo" : "Nuevo vehículo"}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
              disabled={saving}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger py-2" role="alert">
                  {error}
                </div>
              )}

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Marca *</label>
                  <input
                    className="form-control"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    disabled={saving}
                    placeholder="Ej: Toyota"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Modelo *</label>
                  <input
                    className="form-control"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    disabled={saving}
                    placeholder="Ej: Corolla"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Placa *</label>
                  <input
                    className="form-control"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    disabled={saving}
                    placeholder="ABC-1234"
                  />
                </div>

                <div className="col-6 col-md-3">
                  <label className="form-label fw-semibold">Año *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={anio}
                    onChange={(e) => setAnio(Number(e.target.value))}
                    disabled={saving}
                    min={1900}
                    max={2100}
                  />
                </div>

                <div className="col-6 col-md-3">
                  <label className="form-label fw-semibold">Precio/día *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={precioDiario}
                    onChange={(e) => setPrecioDiario(Number(e.target.value))}
                    disabled={saving}
                    min={0}
                    step="0.01"
                  />
                </div>

                {isEdit && (
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Estado</label>
                    <select
                      className="form-select"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value as Vehiculo["estado"])}
                      disabled={saving}
                    >
                      <option value="DISPONIBLE">DISPONIBLE</option>
                      <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                      <option value="RENTADO">RENTADO</option>
                      <option value="BAJA">BAJA</option>
                    </select>
                  </div>
                )}

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Sucursal</label>
                  <select
                    className="form-select"
                    value={idSucursal}
                    onChange={(e) => setIdSucursal(e.target.value)}
                    disabled={saving || loadingSucursales}
                  >
                    <option value="">(Sin asignar)</option>
                    {sucursales.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                  {loadingSucursales && (
                    <div className="form-text">Cargando sucursales…</div>
                  )}
                </div>

                <hr className="my-2" />

                <div className="col-12">
                  <label className="form-label fw-semibold">Imagen (archivo)</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    disabled={saving}
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Imagen (URL)</label>
                  <input
                    className="form-control"
                    value={linkImg}
                    onChange={(e) => setLinkImg(e.target.value)}
                    disabled={saving}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={saving}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn btn-dark"
                disabled={saving || !canSubmit}
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
