import { useEffect, useState } from "react";
import { VehiculosService, type Vehiculo } from "../../services/vehiculos.service";
import { useNavigate } from "react-router-dom";

export default function RecommendedCars() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCars = async () => {
      const data = await VehiculosService.getAll();
      setVehiculos(data.slice(0, 4)); // solo 4 recomendados
    };

    loadCars();
  }, []);

  const handleReservar = (vehiculo: Vehiculo) => {
    navigate(`/reservas/create?id_vehiculo=${vehiculo.id_vehiculo}`);
  };

  return (
    <section className="container my-5">
      <h3 className="mb-4">Recomendados</h3>

      <div className="row">
        {vehiculos.map((v) => (
          <div key={v.id_vehiculo} className="col-md-3 mb-4">
            <div className="card h-100 shadow-sm border-dark">
              <div className="card-body d-flex flex-column">
                <h5>{v.marca} {v.modelo}</h5>

                <p className="text-muted">
                  ${v.precio_diario} / día
                </p>

                <span
                  className={`badge mb-2 ${
                    v.estado === "DISPONIBLE"
                      ? "bg-success"
                      : "bg-secondary"
                  }`}
                >
                  {v.estado}
                </span>

                <button
                  className="btn btn-dark mt-auto"
                  disabled={v.estado !== "DISPONIBLE"}
                  onClick={() => handleReservar(v)}
                >
                  Reservar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
