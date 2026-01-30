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
    <div className="container mt-5 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Pagos</h2>
        <button className="btn btn-outline-dark" onClick={load}>
          Recargar
        </button>
      </div>

      {loading && <p>Cargando...</p>}

      {!loading && pagos.length === 0 && <p>No hay pagos registrados.</p>}

      {!loading && pagos.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
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
                  <td>{money(p.monto)}</td>
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
  );
}
