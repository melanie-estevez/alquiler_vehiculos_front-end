import { useReservas } from "../../hooks/useReservas";
import { reservasService } from "../../services/reservas.service";

export default function ReservasPage() {
  const { reservas, loading, reload } = useReservas();

  const handleConfirmar = async (id: string) => {
    try {
      await reservasService.update(id, {
        estado: "confirmado",
      });
      reload();
    } catch (error) {
      console.error("Error confirmando reserva", error);
    }
  };

  const handleCancelar = async (id: string) => {
    try {
      await reservasService.update(id, {
        estado: "cancelado",
      });
      reload();
    } catch (error) {
      console.error("Error cancelando reserva", error);
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <h2 className="mb-4 text-dark">Gestión de Reservas</h2>

      {loading && <p>Cargando reservas...</p>}

      {!loading && reservas.length === 0 && (
        <p>No hay reservas registradas</p>
      )}

      {!loading && reservas.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Vehículo</th>
                <th>Placa</th>
                <th>Inicio</th>
                <th>Días</th>
                <th>Fin</th>
                <th>Estado</th>
                <th style={{ width: 180 }}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {reservas.map((r) => (
                <tr key={r.id_reserva}>
                  <td>
                    {r.vehiculo.marca} {r.vehiculo.modelo}
                  </td>
                  <td>{r.vehiculo.placa}</td>
                  <td>{r.fecha_inicio}</td>
                  <td>{r.dias}</td>
                  <td>{r.fecha_fin}</td>
                  <td>
                    <span
                      className={`badge ${
                        r.estado === "pendiente"
                          ? "bg-warning text-dark"
                          : r.estado === "confirmado"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {r.estado}
                    </span>
                  </td>
                  <td>
                    {r.estado === "pendiente" ? (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-dark"
                          onClick={() => handleConfirmar(r.id_reserva)}
                        >
                          Confirmar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-dark"
                          onClick={() => handleCancelar(r.id_reserva)}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted small">
                        Sin acciones
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
