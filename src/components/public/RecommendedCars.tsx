import { useEffect, useState } from "react";
import { VehiculosService, type Vehiculo } from "../../services/vehiculos.service";
import { useNavigate } from "react-router-dom";

export default function RecommendedCars() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        const data = await VehiculosService.getAll();

        const list = Array.isArray(data) ? data : [];
        setVehiculos(list.slice(0, 4));
      } catch (e) {
        console.error("Error cargando recomendados", e);
        setVehiculos([]);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  if (loading) return <p>Cargando recomendados...</p>;
  if (vehiculos.length === 0) return <p>No hay vehículos recomendados</p>;

  return (
    <div className="row">
      {vehiculos.map((v) => (
        <div key={v.id_vehiculo} className="col-md-3 mb-3">
          <div className="card h-100 border-dark shadow-sm">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">
                {v.marca} {v.modelo}
              </h5>

              <p className="text-muted mb-1">Placa: {v.placa}</p>
              <p className="fw-bold mb-2">${v.precio_diario} / día</p>

              <button
                className="btn btn-dark mt-auto"
                onClick={() => navigate(`/reservar/${v.id_vehiculo}`)}
                disabled={v.estado !== "DISPONIBLE"}
              >
                Reservar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
