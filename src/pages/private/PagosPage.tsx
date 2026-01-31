import { useEffect, useState } from "react";
import { pagosService, type Pago } from "../../services/pagos.service";

function money(n: any) {
  return `$${Number(n ?? 0).toFixed(2)}`;
}

export default function PagosPage() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const items = await pagosService.getAll({ page: 1, limit: 100 });
      setPagos(items);
    } catch {
      setPagos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
        <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
          <div>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill" style={{ background: "#111", color: "#fff" }}>
              <span className="fw-semibold" style={{ fontSize: 13 }}>Pagos</span>
              <span style={{ opacity: .85, fontSize: 13 }}>Registro</span>
            </div>

            <h1 className="mt-3 mb-2 fw-bold" style={{ color: "#111", letterSpacing: -0.6 }}>Pagos</h1>
            <p className="mb-0 text-muted">Consulta pagos y montos registrados.</p>
          </div>

          <button className="btn btn-outline-dark btn-lg rounded-3" onClick={load}>
            Recargar
          </button>
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
            <span className="ms-3 text-muted">Cargando pagos…</span>
          </div>
        )}

        {!loading && pagos.length === 0 && (
          <div className="p-4 rounded-4 border bg-light text-center">
            <div className="fw-bold text-dark mb-1">No hay pagos registrados</div>
            <div className="text-muted">Cuando existan pagos, aparecerán aquí.</div>
          </div>
        )}

        {!loading && pagos.length > 0 && (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Factura</th>
                  <th>Reserva</th>
                  <th>Monto</th>
                  <th>Método</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((p) => (
                  <tr key={p.id_pago}>
                    <td>{p.factura?.id_factura ?? "-"}</td>
                    <td>{p.reserva?.id_reserva ?? "-"}</td>
                    <td className="fw-semibold">{money(p.monto)}</td>
                    <td>{p.metodo}</td>
                    <td>{p.estado}</td>
                    <td>{p.fecha_pago}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
