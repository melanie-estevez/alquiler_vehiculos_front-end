import { type Vehiculo } from "../../services/vehiculos.service";
import { API_BASE_URL } from "../../services/api";

interface Props {
  vehiculos: Vehiculo[];
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

const badgeClass = (estado: string) => {
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

export function VehiculosCards({
  vehiculos,
  isAdmin = false,
  updatingId,
  onEdit,
  onDelete,
  onToggleEstado,
}: Props) {
  if (vehiculos.length === 0) {
    return <p className="text-muted">No hay vehículos disponibles.</p>;
  }

  return (
    <div className="row g-4">
      {vehiculos.map((v) => {
        const src = imageUrl(v.imagen_url);

        return (
          <div key={v.id_vehiculo} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">

              
              <div
                style={{
                  height: 220,
                  overflow: "hidden",
                  background: "#f1f3f5",
                }}
              >
                {src ? (
                  <img
                    src={src}
                    alt={`${v.marca} ${v.modelo}`}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                    Sin imagen
                  </div>
                )}
              </div>

              <div className="card-body d-flex flex-column">
                
                <h5 className="card-title mb-1">
                  {v.marca} {v.modelo}
                </h5>

                <small className="text-muted mb-2">
                  Año {v.anio} · Placa {v.placa}
                </small>

                
                <h4 className="fw-bold text-dark mb-2">
                  ${v.precio_diario}
                  <small className="text-muted fs-6"> / día</small>
                </h4>

               
                <span className={`badge ${badgeClass(v.estado)} align-self-start mb-3`}>
                  {v.estado}
                </span>

              
                <p className="text-muted mb-3">
                  <i className="bi bi-geo-alt me-1"></i>
                  {v.sucursal?.nombre || "Sin sucursal"}
                </p>

                {isAdmin && (
                  <div className="mt-auto d-flex gap-2 flex-wrap">
                    {onToggleEstado && (
                      <button
                        className="btn btn-outline-dark btn-sm"
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
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => onEdit(v)}
                      >
                        Editar
                      </button>
                    )}

                    {onDelete && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => onDelete(v.id_vehiculo)}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
