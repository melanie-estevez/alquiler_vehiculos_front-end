import { useEffect, useMemo, useState } from "react";
import { reservasService, type Reserva } from "../../services/reservas.service";

function badge(estado: string) {
  const e = String(estado || "").toLowerCase();
  if (e === "pendiente") return "bg-warning text-dark";
  if (e === "confirmado" || e === "confirmada") return "bg-success";
  if (e === "cancelado" || e === "cancelada") return "bg-secondary";
  return "bg-secondary";
}

function money(n: any) {
  return `$${Number(n ?? 0).toFixed(2)}`;
}

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const params = useMemo(() => ({ page: 1, limit: 100, search }), [search]);

  const load = async () => {
    try {
      setLoading(true);
      const data = await reservasService.getAll(params);
      const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      setReservas(items);
    } catch {
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [search]);

  return (
    <div className="container mt-5 pt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
        <h2 className="mb-0">Reservas</h2>
        <div className="d-flex gap-2">
          <input
            className="form-control"
            placeholder="Buscar por placa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 260 }}
          />
          <button className="btn btn-outline-dark" onClick={load}>
            Recargar
          </button>
        </div>
      </div>

      {loading && <p>Cargando...</p>}

      {!loading && reservas.length === 0 && <p>No hay reservas registradas.</p>}

      {!loading && reservas.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Placa</th>
                <th>Inicio</th>
                <th>Días</th>
                <th>Fin</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r.id_reserva}>
                  <td>
                    {r.cliente
                      ? `${r.cliente.name ?? ""} ${r.cliente.apellido ?? ""}`.trim()
                      : "-"}
                  </td>
                  <td>{r.vehiculo ? `${r.vehiculo.marca ?? ""} ${r.vehiculo.modelo ?? ""}`.trim() : "-"}</td>
                  <td>{r.vehiculo?.placa ?? "-"}</td>
                  <td>{String(r.fecha_inicio ?? "")}</td>
                  <td>{r.dias}</td>
                  <td>{String(r.fecha_fin ?? "")}</td>
                  <td>{money(r.total)}</td>
                  <td>
                    <span className={`badge ${badge(r.estado)}`}>{String(r.estado ?? "")}</span>
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
