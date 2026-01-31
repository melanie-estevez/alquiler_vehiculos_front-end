import { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useVehiculos } from "../../hooks/useVehiculos";
import { useAuth } from "../../context/AuthContext";
import type { Vehiculo } from "../../services/vehiculos.service";
import { API_BASE_URL } from "../../services/api";

const img = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};

export default function RecommendedCars() {
  const { vehiculos: vehiculosRaw, loading } = useVehiculos();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const vehiculos = useMemo(() => {
    const v: any = vehiculosRaw as any;
    if (Array.isArray(v)) return v as Vehiculo[];
    if (v && Array.isArray(v.items)) return v.items as Vehiculo[];
    return [];
  }, [vehiculosRaw]);

  const list = useMemo(() => {
    // Recomendados: solo los primeros 6 disponibles (ajusta si quieres)
    const disponibles = vehiculos.filter((x) => x.estado === "DISPONIBLE");
    return disponibles.slice(0, 6);
  }, [vehiculos]);

  if (loading) return <p>Cargando...</p>;
  if (list.length === 0) return <p className="text-muted">No hay vehículos recomendados.</p>;

  return (
    <div className="row g-4 mt-2">
      {list.map((v) => {
        const src = img((v as any).imagen_url);

        return (
          <div key={v.id_vehiculo} className="col-12 col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100 overflow-hidden">
              <div style={{ height: 200, background: "#111" }}>
                {src ? (
                  <img
                    src={src}
                    alt={`${v.marca} ${v.modelo}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center h-100"
                    style={{ color: "rgba(255,255,255,.7)" }}
                  >
                    Sin imagen
                  </div>
                )}
              </div>

              <div className="card-body">
                <div className="fw-bold fs-5">
                  {v.marca} {v.modelo}
                </div>
                <div className="text-muted small">Placa: {v.placa}</div>

                <div className="mt-3 d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted small">Precio / día</div>
                    <div className="fw-bold fs-4">${Number(v.precio_diario ?? 0).toFixed(2)}</div>
                  </div>

                  <span className="badge bg-success">DISPONIBLE</span>
                </div>
              </div>

              <div className="card-footer bg-white border-0 pt-0">
                {/* ✅ USUARIO: SOLO RESERVAR */}
                {!isAdmin && (
                  <button
                    className="btn btn-dark w-100"
                    onClick={() => navigate(`/reservar/${v.id_vehiculo}`)}
                  >
                    Reservar
                  </button>
                )}

                {/* ✅ ADMIN */}
                {isAdmin && (
                  <Link to="/admin/vehiculos" className="btn btn-outline-dark w-100">
                    Administrar vehículos
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
