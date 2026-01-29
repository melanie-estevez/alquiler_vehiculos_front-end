// src/components/sucursales/SucursalFormModal.tsx
import { useEffect, useMemo, useState } from "react";
import type { Sucursal } from "../../services/sucursales.service";

type Form = {
  nombre: string;
  ciudad: string;
  direccion: string;
  telefono: string;
};

interface Props {
  show: boolean;
  onClose: () => void;
  sucursal: Sucursal | null;
  onCreate: (dto: Form) => Promise<any>;
  onUpdate: (id: string, dto: Form) => Promise<any>;
}

export function SucursalFormModal({ show, onClose, sucursal, onCreate, onUpdate }: Props) {
  const isEdit = !!sucursal;

  const initial: Form = useMemo(
    () => ({
      nombre: sucursal?.nombre ?? "",
      ciudad: sucursal?.ciudad ?? "",
      direccion: sucursal?.direccion ?? "",
      telefono: sucursal?.telefono ?? "",
    }),
    [sucursal]
  );

  const [form, setForm] = useState<Form>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(initial);
    setError(null);
  }, [initial, show]);

  if (!show) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setSaving(true);

      if (!form.nombre || !form.ciudad || !form.direccion || !form.telefono) {
        setError("Completa todos los campos.");
        return;
      }

      if (isEdit && sucursal) await onUpdate(sucursal.id_sucursal, form);
      else await onCreate(form);

      onClose();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar la sucursal.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isEdit ? "Editar sucursal" : "Nueva sucursal"}</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input name="nombre" className="form-control" value={form.nombre} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Ciudad</label>
                <select name="ciudad" className="form-select" value={form.ciudad} onChange={handleChange}>
                  <option value="">Seleccione...</option>
                  <option value="Quito">Quito</option>
                  <option value="Guayaquil">Guayaquil</option>
                  <option value="Cuenca">Cuenca</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Dirección</label>
                <input name="direccion" className="form-control" value={form.direccion} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Teléfono</label>
                <input name="telefono" className="form-control" value={form.telefono} onChange={handleChange} />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-dark" onClick={onClose} disabled={saving}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-dark" disabled={saving}>
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
