import { useEffect, useState } from "react";
import { VehiculosService, type Vehiculo } from "../../services/vehiculos.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RecommendedCars() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const loadCars = async () => {
    try {
      const data = await VehiculosService.getAll();
      setVehiculos(data.slice(0, 4)); // 4 recomendados
    } catch (error) {
      console.error("Error cargando recomendados", error);
    }
  };

  useEffect(() => {
    loadCars();
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

      // ✅ usamos el update normal (NO updateEstado)
      await VehiculosService.update(vehiculo.id_vehiculo, {
        estado: nextEstado,
      });

      await loadCars();
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

  // ✅ USER solo ve disponibles
  const visibleVehiculos = isAdmin
    ? vehiculos
    : vehiculos.filter((v) => v.estado === "DISPONIBLE");

  return (
    <section className="container my-5">
      <h3 className="mb-4">Recomendados</h3>

      <div className="row">
        {visibleVehiculos.map((v) => (
          <div key={v.id_vehiculo} className="col-md-3 mb-4">
            <div className="card h-100 shadow-sm border-dark">
              <div className="card-body d-flex flex-column">
                <h5>
                  {v.marca} {v.modelo}
                </h5>

                <p className="text-muted">
                  ${v.precio_diario} / día
                </p>

                <span className={`badge mb-2 ${getBadgeClass(v.estado)}`}>
                  {v.estado}
                </span>

                {/* 👑 ADMIN: cambia estado */}
                {isAdmin ? (
                  <button
                    className="btn btn-outline-dark mt-auto"
                    disabled={updatingId === v.id_vehiculo}
                    onClick={() => toggleEstado(v)}
                  >
                    {updatingId === v.id_vehiculo ? "Actualizando..." : "Cambiar estado"}
                  </button>
                ) : (
                  <button
                    className="btn btn-dark mt-auto"
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
    </section>
  );
}
