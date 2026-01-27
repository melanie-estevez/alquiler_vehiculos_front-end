import { useEffect, useState } from "react";
import { VehiculosService, type Vehiculo } from "../../services/vehiculos.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RecommendedCars() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    const data = await VehiculosService.getAll();
    setVehiculos(data.slice(0, 4));
  };

  const handleReservar = (vehiculoId: string) => {
    navigate(`/reservar/${vehiculoId}`);
  };

  const toggleEstado = async (vehiculo: Vehiculo) => {
    const nextEstado =
      vehiculo.estado === "DISPONIBLE"
        ? "MANTENIMIENTO"
        : vehiculo.estado === "MANTENIMIENTO"
        ? "RENTADO"
        : "DISPONIBLE";

    await VehiculosService.updateEstado(
      vehiculo.id_vehiculo,
      nextEstado
    );

    loadCars();
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

  /* 🔍 FILTRO POR ROL */
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

                {/* 👑 ADMIN */}
                {isAdmin ? (
                  <button
                    className="btn btn-outline-dark mt-auto"
                    onClick={() => toggleEstado(v)}
                  >
                    Cambiar estado
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
