import { useEffect, useMemo, useState } from "react";
import { reservasService, type Reserva } from "../../services/reservas.service";

function badge(estado: string) {
  const e = String(estado || "").toLowerCase();
  if (e === "pendiente") return { cls: "text-dark", style: { background: "#dee2e6" } };
  if (e === "confirmado" || e === "confirmada")
    return { cls: "text-white", style: { background: "#146c43" } }; // verde oscuro
  if (e === "cancelado" || e === "cancelada")
    return { cls: "text-white", style: { background: "#6c757d" } };
  return { cls: "text-white", style: { background: "#6c757d" } };
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
      const items = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
        ? data
        : [];
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

  const inputStyle: React.CSSProperties = {
    borderRadius: 12,
    border: "1px solid #dee2e6",
    background: "#fff",
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-4" style={{ background: "#f4f5f7" }}>
  
      <div
        className="rounded-4 p-4 p-md-5 mb-4 border"
        style={{
          background: "#fff",
          borderColor: "#e9ecef",
          boxShadow: "0 .5rem 1.25rem rgba(0,0,0,.06)",
        }}
      >
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
          <div>
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill"
              style={{ background: "#111", color: "#fff" }}
            >
              <span className="fw-semibold" style={{ fontSize: 13 }}>
                Reservas
              </span>
              <span style={{ opacity: 0.85, fontSize: 13 }}>Historial y estados</span>
            </div>

            <h1 className="mt-3 mb-2 fw-bold" style={{ color: "#111", letterSpacing: -0.6 }}>
              Reservas registradas
            </h1>

            <p className="mb-0" style={{ color: "#6c757d", fontSize: 16 }}>
              Busca por placa y revisa el estado y total de cada reserva.
            </p>
          </div>

          <div className="d-flex gap-2 flex-wrap align-items-end">
            <div style={{ minWidth: 260 }}>
              <label className="form-label fw-semibold" style={{ color: "#111" }}>
                Buscar por placa
              </label>
              <input
                className="form-control form-control-lg"
                style={inputStyle}
                placeholder="Ej: PBA-1234"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button className="btn btn-outline-dark btn-lg rounded-3" onClick={load}>
              Recargar
            </button>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mt-3">
          <span
            className="badge rounded-pill px-3 py-2"
            style={{ background: "#f8f9fa", border: "1px solid #e9ecef", color: "#111" }}
          >
            Total: <span className="fw-semibold">{reservas.length}</span>
          </span>
        </div>
      </div>

      <div
        className="rounded-4 border p-3 p-md-4"
        style={{
          background: "#fff",
          borderColor: "#e9ecef",
          boxShadow: "0 .25rem .75rem rgba(0,0,0,.06)",
        }}
      >
        {loading && (
          <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: 220 }}>
            <div className="spinner-border text-dark" role="status" />
            <span className="ms-3 text-muted">Cargando reservas…</span>
          </div>
        )}

        {!loading && reservas.length === 0 && (
          <div className="p-4 rounded-4 border bg-light text-center">
            <div className="fw-bold text-dark mb-1">No hay reservas registradas</div>
            <div className="text-muted">Intenta otra búsqueda.</div>
          </div>
        )}

        {!loading && reservas.length > 0 && (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
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
                {reservas.map((r) => {
                  const b = badge(String(r.estado ?? ""));
                  return (
                    <tr key={r.id_reserva}>
                      <td>
                        {r.cliente
                          ? `${r.cliente.name ?? ""} ${r.cliente.apellido ?? ""}`.trim()
                          : "-"}
                      </td>
                      <td>
                        {r.vehiculo
                          ? `${r.vehiculo.marca ?? ""} ${r.vehiculo.modelo ?? ""}`.trim()
                          : "-"}
                      </td>
                      <td className="fw-semibold">{r.vehiculo?.placa ?? "-"}</td>
                      <td>{String(r.fecha_inicio ?? "")}</td>
                      <td>{r.dias}</td>
                      <td>{String(r.fecha_fin ?? "")}</td>
                      <td className="fw-semibold">{money(r.total)}</td>
                      <td>
                        <span className={`badge ${b.cls}`} style={{ ...b.style, borderRadius: 999, padding: "8px 12px" }}>
                          {String(r.estado ?? "")}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
