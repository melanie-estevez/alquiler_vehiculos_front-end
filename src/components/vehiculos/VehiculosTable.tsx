import { useMemo } from "react";
import { type Vehiculo } from "../../services/vehiculos.service";
import { API_BASE_URL } from "../../services/api";

interface Props {
  vehiculos: Vehiculo[] | any;
  isAdmin?: boolean;
  updatingId?: string | null;
  onEdit?: (v: Vehiculo) => void;
  onDelete?: (id: string) => void;
  onToggleEstado?: (id: string) => void;
}

const imageUrl = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};

export function VehiculosTable({
  vehiculos: vehiculosRaw,
  isAdmin = false,
  updatingId = null,
  onEdit,
  onDelete,
  onToggleEstado,
}: Props) {
  const vehiculos = useMemo(() => {
    const v: any = vehiculosRaw;
    if (Array.isArray(v)) return v as Vehiculo[];
    if (v && Array.isArray(v.items)) return v.items as Vehiculo[];
    return [];
  }, [vehiculosRaw]);

  const getBadgeClass = (estado: string) => {
    switch (estado) {
      case "DISPONIBLE":
        return "bg-success";
      case "MANTENIMIENTO":
        return "bg-warning text-dark";
      case "RENTADO":
        return "bg-danger";
      case "BAJA":
        return "bg-secondary";
      default:
        return "bg-secondary";
    }
  };

  if (vehiculos.length === 0) {
    return <p className="text-muted">No hay vehículos para mostrar.</p>;
  }

  return (
    <table className="table table-striped align-middle">
      <thead>
        <tr>
          <th style={{ width: 90 }}>Imagen</th>
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
        {vehiculos.map((v) => {
          const src = imageUrl((v as any).imagen_url);
          return (
            <tr key={`${v.id_vehiculo}-${v.placa}`}>
              <td>
                {src ? (
                  <img
                    src={src}
                    alt={`${v.marca} ${v.modelo}`}
                    style={{
                      width: 72,
                      height: 48,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 72,
                      height: 48,
                      borderRadius: 6,
                      background: "#e9ecef",
                    }}
                  />
                )}
              </td>
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
                        onClick={() => onToggleEstado(v.id_vehiculo)}
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
          );
        })}
      </tbody>
    </table>
  );
}
