import { useEffect, useState } from "react";
import { VehiculosService, type Vehiculo } from "../../services/vehiculos.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function CarrosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const loadVehiculos = async () => {
    try {
      setLoading(true);
      const data = await VehiculosService.getAll();
      setVehiculos(data);
    } catch (error) {
      console.error("Error cargando vehículos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehiculos();
  }, []);

  const handleReservar = (vehiculoId: string) => {
    navigate(`/reservar/${vehiculoId}`);
  };

  const toggleEstado = async (vehiculo: Vehiculo) => {
    try {
      setUpdatingId(vehiculo.id_vehiculo);

      const nextEstado =
        vehiculo.estado === "DISPONIBLE"
          ? "MANTENIMIENTO"
          : vehiculo.estado === "MANTENIMIENTO"
          ? "RENTADO"
          : "DISPONIBLE";

      await VehiculosService.update(vehiculo.id_vehiculo, { estado: nextEstado });

      await loadVehiculos();
    } catch (error) {
      console.error("Error cambiando estado", error);
      alert("No se pudo cambiar el estado");
    } finally {
      setUpdatingId(null);
    }
  };

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

  // ✅ USER solo ve DISPONIBLE / ADMIN ve todo
  const visibleVehiculos = isAdmin
    ? vehiculos
    : vehiculos.filter((v) => v.estado === "DISPONIBLE");

  return (
    <div className="container mt-5 pt-4">
      <h2 className="mb-4 text-dark">Todos los vehículos</h2>

      {loading && <p>Cargando vehículos...</p>}

      {!loading && visibleVehiculos.length === 0 && (
        <p>No hay vehículos disponibles</p>
      )}

      <div className="row">
        {visibleVehiculos.map((v) => (
          <div key={v.id_vehiculo} className="col-md-3 mb-4">
            <div className="card h-100 border-dark shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                  {v.marca} {v.modelo}
                </h5>

                <p className="text-muted mb-1">Año: {v.anio}</p>

                <p className="fw-bold mb-1">${v.precio_diario} / día</p>

                {v.sucursal && (
                  <p className="text-muted small mb-2">{v.sucursal.ciudad}</p>
                )}

                <span className={`badge align-self-start mb-3 ${getBadgeClass(v.estado)}`}>
                  {v.estado}
                </span>

                {/* 👑 ADMIN: cambia estado / USER: reservar */}
                {isAdmin ? (
                  <button
                    className="btn btn-outline-dark w-100 mt-auto"
                    onClick={() => toggleEstado(v)}
                    disabled={updatingId === v.id_vehiculo}
                  >
                    {updatingId === v.id_vehiculo ? "Cambiando..." : "Cambiar estado"}
                  </button>
                ) : (
                  <button
                    className="btn btn-dark w-100 mt-auto"
                    disabled={v.estado !== "DISPONIBLE"}
                    onClick={() => handleReservar(v.id_vehiculo)}
                  >
                    Reservar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
