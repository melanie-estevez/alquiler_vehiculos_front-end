import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useMisReservas } from "../../hooks/useReservas";
import { reservasService, type Reserva } from "../../services/reservas.service";

function badge(estado: string) {
  const e = String(estado || "").toLowerCase();
  if (e === "pendiente") return "bg-warning text-dark";
  if (e === "confirmado") return "bg-success";
  if (e === "cancelado") return "bg-secondary";
  return "bg-secondary";
}

function backendMsg(err: any) {
  const m = err?.response?.data?.message || err?.message || "Error";
  return Array.isArray(m) ? m.join(", ") : String(m);
}

export default function MisReservasPage() {
  const navigate = useNavigate();
  const { user, ready } = useAuth();

  const { reservas, loading, reload } = useMisReservas({ page: 1, limit: 100 });

  useEffect(() => {
    if (!ready) return;
    if (!user) navigate("/auth/login", { replace: true });
  }, [ready, user, navigate]);

  const cancelar = async (r: Reserva) => {
    if (String(r.estado || "").toLowerCase() !== "pendiente") return;

    const ok = confirm("¿Cancelar esta reserva?");
    if (!ok) return;

    try {
      await reservasService.update(r.id_reserva, { estado: "cancelado" });
      await reload();
      alert("Reserva cancelada");
    } catch (e) {
      alert("No se pudo cancelar: " + backendMsg(e));
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
        <h2 className="mb-0">Mis Reservas</h2>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-dark" onClick={reload}>
            Recargar
          </button>
          <Link className="btn btn-dark" to="/carros">
            Reservar un carro
          </Link>
        </div>
      </div>

      {loading && <p>Cargando...</p>}

      {!loading && reservas.length === 0 && <p>No tienes reservas aún.</p>}

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
                <th>Total</th>
                <th>Estado</th>
                <th style={{ width: 320 }}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {reservas.map((r) => (
                <tr key={r.id_reserva}>
                  <td>{r.vehiculo ? `${r.vehiculo.marca} ${r.vehiculo.modelo}` : "-"}</td>
                  <td>{r.vehiculo?.placa ?? "-"}</td>
                  <td>{r.fecha_inicio}</td>
                  <td>{r.dias}</td>
                  <td>{r.fecha_fin}</td>
                  <td>${Number(r.total ?? 0).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${badge(r.estado)}`}>{String(r.estado || "")}</span>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      <Link className="btn btn-sm btn-outline-dark" to={`/factura/reserva/${r.id_reserva}`}>
                        Ver factura / pagar
                      </Link>

                      <Link className="btn btn-sm btn-outline-secondary" to={`/reserva/${r.id_reserva}/timeline`}>
                        Timeline
                      </Link>

                      {String(r.estado || "").toLowerCase() === "pendiente" ? (
                        <button className="btn btn-sm btn-dark" onClick={() => cancelar(r)}>
                          Cancelar
                        </button>
                      ) : (
                        <span className="text-muted small align-self-center">Sin acciones</span>
                      )}
                    </div>
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
