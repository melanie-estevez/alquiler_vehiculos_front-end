import { type Vehiculo } from "../../services/vehiculos.service";

interface Props {
  vehiculos: Vehiculo[];
  isAdmin?: boolean;
  updatingId?: string | null;

  onEdit?: (v: Vehiculo) => void;
  onDelete?: (id: string) => void;

  onToggleEstado?: (v: Vehiculo) => void;
}

export function VehiculosTable({
  vehiculos,
  isAdmin = false,
  updatingId = null,
  onEdit,
  onDelete,
  onToggleEstado,
}: Props) {
  const getBadgeClass = (estado: string) => {
    switch (estado) {
      case "DISPONIBLE":
        return "bg-success";
      case "MANTENIMIENTO":
        return "bg-warning text-dark";
      case "RENTADO":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <table className="table table-striped align-middle">
      <thead>
        <tr>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Año</th>
          <th>Placa</th>
          <th>Precio/día</th>
          <th>Sucursal</th>
          <th>Estado</th>
          {isAdmin && <th style={{ width: 260 }}>Acciones</th>}
        </tr>
      </thead>

      <tbody>
        {vehiculos.map((v) => (
          <tr key={v.id_vehiculo}>
            <td>{v.marca}</td>
            <td>{v.modelo}</td>
            <td>{v.anio}</td>
            <td>{v.placa}</td>
            <td>${v.precio_diario}</td>
            <td>{v.sucursal?.nombre || "-"}</td>
            <td>
              <span className={`badge ${getBadgeClass(v.estado)}`}>
                {v.estado}
              </span>
            </td>

            {isAdmin && (
              <td>
                <div className="d-flex gap-2 flex-wrap">
                  {onToggleEstado && (
                    <button
                      className="btn btn-sm btn-outline-dark"
                      disabled={updatingId === v.id_vehiculo}
                      onClick={() => onToggleEstado(v)}
                    >
                      {updatingId === v.id_vehiculo
                        ? "Cambiando..."
                        : "Cambiar estado"}
                    </button>
                  )}

                  {onEdit && (
                    <button
                      className="btn btn-sm btn-secondary"
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
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
