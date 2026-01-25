import { useEffect, useState } from "react";
import {
  type CreateSucursalDto,
  type UpdateSucursalDto,
  type Sucursal,
} from "../../services/sucursales.service";

interface Props {
  show: boolean;
  onClose: () => void;
  sucursal: Sucursal | null;
  onCreate: (data: CreateSucursalDto) => Promise<void>;
  onUpdate: (id: string, data: UpdateSucursalDto) => Promise<void>;
}

export function SucursalFormModal({
  show,
  onClose,
  sucursal,
  onCreate,
  onUpdate,
}: Props) {
  const [form, setForm] = useState<CreateSucursalDto>({
    nombre: "",
    ciudad: "Quito",
    direccion: "",
    telefono: "",
  });

  useEffect(() => {
    if (sucursal) {
      setForm({
        nombre: sucursal.nombre,
        ciudad: sucursal.ciudad,
        direccion: sucursal.direccion,
        telefono: sucursal.telefono,
      });
    }
  }, [sucursal]);

  if (!show) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (sucursal) {
      await onUpdate(sucursal.id_sucursal, form);
    } else {
      await onCreate(form);
    }

    onClose();
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50">
      <div className="modal-dialog">
        <form onSubmit={handleSubmit} className="modal-content p-3">
          <h5>{sucursal ? "Editar sucursal" : "Nueva sucursal"}</h5>

          <input
            className="form-control mb-2"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) =>
              setForm({ ...form, nombre: e.target.value })
            }
          />

          <input
            className="form-control mb-2"
            placeholder="Dirección"
            value={form.direccion}
            onChange={(e) =>
              setForm({ ...form, direccion: e.target.value })
            }
          />

          <button className="btn btn-primary">Guardar</button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={onClose}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
