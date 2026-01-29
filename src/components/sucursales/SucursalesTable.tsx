// src/components/sucursales/SucursalesTable.tsx
import type { Sucursal } from "../../services/sucursales.service";

interface Props {
  sucursales: Sucursal[];
  onEdit?: (s: Sucursal) => void;
  onDelete?: (id: string) => void;
}

export function SucursalesTable({ sucursales, onEdit, onDelete }: Props) {
  const list = Array.isArray(sucursales) ? sucursales : [];

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Ciudad</th>
          <th>Dirección</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {list.map((s) => (
          <tr key={s.id_sucursal}>
            <td>{s.nombre}</td>
            <td>{s.ciudad}</td>
            <td>{s.direccion}</td>

            <td>
              {onEdit && (
                <button className="btn btn-sm btn-secondary me-2" onClick={() => onEdit(s)}>
                  Editar
                </button>
              )}

              {onDelete && (
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(s.id_sucursal)}>
                  Eliminar
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}