import { type Vehiculo } from "../../services/vehiculos.service";

interface Props {
  vehiculos: Vehiculo[];
  onEdit?: (v: Vehiculo) => void;
  onDelete?: (id: string) => void;
}

export function VehiculosTable({ vehiculos, onEdit, onDelete }: Props) {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Año</th>
          <th>Precio/día</th>
          <th>Sucursal</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {vehiculos.map((v) => (
          <tr key={v.id_vehiculo}>
            <td>{v.marca}</td>
            <td>{v.modelo}</td>
            <td>{v.anio}</td>
            <td>${v.precio_diario}</td>
            <td>{v.sucursal?.nombre || "-"}</td>
            <td>
              {onEdit && (
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => onEdit(v)}
                >
                  Editar
                </button>
              )}

              {onDelete && (
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(v.id_vehiculo)}
                >
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
