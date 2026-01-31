import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Vehiculo } from "../../services/vehiculos.service";
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
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};

const badgeClass = (estado: string) => {
  switch (estado) {
    case "DISPONIBLE":
      return "badge rounded-pill px-3 py-2 bg-success"; // verde (bootstrap)
    case "MANTENIMIENTO":
      return "badge rounded-pill px-3 py-2 bg-warning text-dark";
    case "RENTADO":
      return "badge rounded-pill px-3 py-2 bg-danger";
    case "BAJA":
      return "badge rounded-pill px-3 py-2 bg-secondary";
    default:
      return "badge rounded-pill px-3 py-2 bg-secondary";
  }
};

export function VehiculosCatalog({
  vehiculos: vehiculosRaw,
  isAdmin = false,
  updatingId = null,
  onEdit,
  onDelete,
  onToggleEstado,
}: Props) {
  const navigate = useNavigate();

  const vehiculos = useMemo(() => {
    const v: any = vehiculosRaw;
    if (Array.isArray(v)) return v as Vehiculo[];
    if (v && Array.isArray(v.items)) return v.items as Vehiculo[];
    return [];
  }, [vehiculosRaw]);

  if (vehiculos.length === 0) {
    return (
      <div className="rounded-4 border bg-white p-4" style={{ borderColor: "#e9ecef" }}>
        <div className="text-muted">No hay vehículos para mostrar.</div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      {/* ✅ estilo: gris/negro/blanco. Nada azul/verde claro */}
      <style>{`
        .car-card {
          border: 1px solid #e9ecef;
          border-radius: 18px;
          overflow: hidden;
          background: #fff;
          transition: transform .12s ease, box-shadow .12s ease;
          box-shadow: 0 .5rem 1.25rem rgba(0,0,0,.06);
        }
        .car-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 .8rem 1.4rem rgba(0,0,0,.09);
        }
        .car-img-wrap{
          background: #111;
          height: 230px;
          position: relative;
        }
        .car-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .car-img-fallback{
          width: 100%;
          height: 100%;
          display:flex;
          align-items:center;
          justify-content:center;
          color: rgba(255,255,255,.7);
          font-weight: 600;
        }
        .car-title{
          letter-spacing: -0.3px;
          color: #111;
        }
        .car-muted{
          color: #6c757d;
        }
        .car-price{
          font-size: 1.6rem;
          font-weight: 800;
          color: #111;
          letter-spacing: -0.4px;
        }
        /* ✅ verde más oscuro para DISPONIBLE */
        .bg-success{
          background-color:#0a6b3b !important;
        }
      `}</style>

      <div className="row g-4">
        {vehiculos.map((v) => {
          const src = imageUrl((v as any).imagen_url);
          const estado = String(v.estado ?? "");
          const disponible = estado === "DISPONIBLE";

          return (
            <div key={v.id_vehiculo} className="col-12 col-md-6 col-lg-4">
              <div className="car-card h-100">
                {/* Imagen grande */}
                <div className="car-img-wrap">
                  {src ? (
                    <img
                      src={src}
                      alt={`${v.marca} ${v.modelo}`}
                      className="car-img"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "";
                      }}
                    />
                  ) : (
                    <div className="car-img-fallback">Sin imagen</div>
                  )}

                  {/* Badge estado arriba */}
                  <div style={{ position: "absolute", top: 14, left: 14 }}>
                    <span className={badgeClass(estado)}>{estado}</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div>
                      <div className="fw-bold fs-4 car-title">
                        {v.marca} {v.modelo}
                      </div>
                      <div className="car-muted small">
                        Placa: <span className="fw-semibold text-dark">{v.placa}</span> • Año:{" "}
                        <span className="fw-semibold text-dark">{v.anio}</span>
                      </div>
                      <div className="car-muted small mt-1">
                        Sucursal:{" "}
                        <span className="text-dark fw-semibold">
                          {v.sucursal?.nombre || "Sin sucursal"}
                        </span>
                        {v.sucursal?.ciudad ? (
                          <span className="car-muted"> — {v.sucursal.ciudad}</span>
                        ) : null}
                      </div>
                    </div>

                    <div className="text-end">
                      <div className="car-muted small">Precio / día</div>
                      <div className="car-price">${Number(v.precio_diario ?? 0).toFixed(2)}</div>
                    </div>
                  </div>

                  {/* ✅ Acciones (IMPORTANTE: NO HAY "VER DETALLE") */}
                  <div className="mt-4">
                    {!isAdmin ? (
                      // ✅ USUARIO: SOLO RESERVAR
                      <button
                        className="btn btn-dark w-100 rounded-3 py-2"
                        disabled={!disponible}
                        onClick={() => navigate(`/reservar/${v.id_vehiculo}`)}
                      >
                        {disponible ? "Reservar" : "No disponible"}
                      </button>
                    ) : (
                      // ✅ ADMIN: gestionar
                      <div className="d-flex flex-wrap gap-2">
                        {onToggleEstado && (
                          <button
                            className="btn btn-outline-dark rounded-3"
                            disabled={updatingId === v.id_vehiculo}
                            onClick={() => onToggleEstado(v.id_vehiculo)}
                          >
                            {updatingId === v.id_vehiculo ? "Cambiando..." : "Cambiar estado"}
                          </button>
                        )}

                        {onEdit && (
                          <button
                            className="btn btn-dark rounded-3"
                            onClick={() => onEdit(v)}
                          >
                            Editar
                          </button>
                        )}

                        {onDelete && (
                          <button
                            className="btn btn-outline-danger rounded-3"
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
            </div>
          );
        })}
      </div>

      {/* Hint para admin */}
      {isAdmin && (
        <div className="text-muted small mt-4">
          * Como admin puedes editar, eliminar y cambiar estados. Los usuarios solo pueden reservar
          cuando está <b>DISPONIBLE</b>.
        </div>
      )}
    </div>
  );
}
