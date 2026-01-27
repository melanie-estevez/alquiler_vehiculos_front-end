import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  VehiculosService,
  type Vehiculo,
} from "../../services/vehiculos.service";

export default function CarrosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadVehiculos = async () => {
      try {
        const data = await VehiculosService.getAll();
        setVehiculos(data);
      } catch (error) {
        console.error("Error cargando vehículos", error);
      } finally {
        setLoading(false);
      }
    };

    loadVehiculos();
  }, []);

  const handleReservar = (vehiculoId: string) => {
    // 👉 SOLO NAVEGA
    navigate(`/reservar/${vehiculoId}`);
  };

  return (
    <div className="container mt-5 pt-4">
      <h2 className="mb-4 text-dark">Todos los vehículos</h2>

      {loading && <p>Cargando vehículos...</p>}

      {!loading && vehiculos.length === 0 && (
        <p>No hay vehículos disponibles</p>
      )}

      <div className="row">
        {vehiculos.map((v) => (
          <div key={v.id_vehiculo} className="col-md-3 mb-4">
            <div className="card h-100 border-dark shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                  {v.marca} {v.modelo}
                </h5>

                <p className="card-text text-muted">
                  Año: {v.anio}
                </p>

                <p className="card-text fw-bold">
                  ${v.precio_diario} / día
                </p>

                {v.sucursal && (
                  <p className="text-muted small">
                    {v.sucursal.ciudad}
                  </p>
                )}

                <span
                  className={`badge align-self-start ${
                    v.estado === "DISPONIBLE"
                      ? "bg-success"
                      : "bg-secondary"
                  }`}
                >
                  {v.estado}
                </span>

                <button
                  className="btn btn-dark w-100 mt-auto"
                  disabled={v.estado !== "DISPONIBLE"}
                  onClick={() => handleReservar(v.id_vehiculo)}
                >
                  Reservar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
