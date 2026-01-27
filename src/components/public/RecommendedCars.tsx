import { useEffect, useState } from "react";
import { VehiculosService, type Vehiculo } from "../../services/vehiculos.service";

export default function RecommendedCars() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVehiculos = async () => {
      try {
        const data = await VehiculosService.getAll();

        // solo disponibles y solo 4
        const recomendados = data
          .filter(v => v.estado === "DISPONIBLE")
          .slice(0, 4);

        setVehiculos(recomendados);
      } catch (error) {
        console.error("Error cargando vehículos recomendados", error);
      } finally {
        setLoading(false);
      }
    };

    loadVehiculos();
  }, []);

  return (
    <section className="container my-5">
      <h3 className="mb-4 text-dark">Carros recomendados</h3>

      {loading && <p>Cargando...</p>}

      <div className="row">
        {vehiculos.map((v) => (
          <div key={v.id_vehiculo} className="col-md-3 mb-4">
            <div className="card h-100 border-dark shadow-sm">
              <div className="card-body">
                <h5 className="card-title">
                  {v.marca} {v.modelo}
                </h5>

                <p className="text-muted">
                  Año {v.anio}
                </p>

                <p className="fw-bold">
                  ${v.precio_diario} / día
                </p>

                {v.sucursal && (
                  <p className="small text-muted">
                    {v.sucursal.ciudad}
                  </p>
                )}

                <button className="btn btn-dark w-100">
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
