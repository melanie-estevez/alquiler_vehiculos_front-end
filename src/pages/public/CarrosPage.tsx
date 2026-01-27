import { useEffect, useState } from "react";
import { VehiculosService, type Vehiculo } from "../../services/vehiculos.service";
import { useNavigate } from "react-router-dom";

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
    navigate(`/reservar/${vehiculoId}`);
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

                <p className="text-muted mb-1">Año: {v.anio}</p>

                <p className="fw-bold mb-1">
                  ${v.precio_diario} / día
                </p>

                {v.sucursal && (
                  <p className="text-muted small">
                    {v.sucursal.ciudad}
                  </p>
                )}

                <span
                  className={`badge align-self-start mb-2 ${getBadgeClass(
                    v.estado
                  )}`}
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
