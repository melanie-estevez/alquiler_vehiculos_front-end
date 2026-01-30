import { useEffect, useState } from "react";
import { facturasService, type Factura } from "../../services/facturas.service";

function money(n: any) {
  return `$${Number(n || 0).toFixed(2)}`;
}

export default function FacturasPage() {
  const [items, setItems] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);

  const [openId, setOpenId] = useState<string | null>(null);
  const [openFactura, setOpenFactura] = useState<Factura | null>(null);
  const [loadingOpen, setLoadingOpen] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await facturasService.getAll({ page: 1, limit: 200 });
      setItems(data);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const abrir = async (id: string) => {
    try {
      setOpenId(id);
      setLoadingOpen(true);
      const f = await facturasService.getOne(id);
      setOpenFactura(f);
    } catch (e) {
      console.error(e);
      setOpenFactura(null);
    } finally {
      setLoadingOpen(false);
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Facturas (Admin)</h2>
        <button className="btn btn-outline-dark" onClick={load}>
          Recargar
        </button>
      </div>

      {loading && <p>Cargando...</p>}
      {!loading && items.length === 0 && <p>No hay facturas.</p>}

      {!loading && items.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Reserva</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Fecha</th>
                <th style={{ width: 120 }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {items.map((f) => (
                <tr key={f.id_factura}>
                  <td className="small">{f.id_factura}</td>
                  <td className="small">{f.reserva?.id_reserva ?? "-"}</td>
                  <td>{f.estado}</td>
                  <td>{money(f.total)}</td>
                  <td className="small">{new Date(f.fecha_emision).toLocaleString()}</td>
                  <td>
                    <button className="btn btn-sm btn-dark" onClick={() => abrir(f.id_factura)}>
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-muted small mb-0">
            * Esto cubre el “historial de factura”: detalles + pagos asociados.
          </p>
        </div>
      )}

      {openId && (
        <div className="card mt-3">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span className="fw-semibold">Detalle factura: {openId}</span>
            <button className="btn btn-sm btn-outline-dark" onClick={() => { setOpenId(null); setOpenFactura(null); }}>
              Cerrar
            </button>
          </div>

          <div className="card-body">
            {loadingOpen && <p>Cargando detalle...</p>}

            {!loadingOpen && !openFactura && <p>No se pudo cargar el detalle.</p>}

            {!loadingOpen && openFactura && (
              <>
                <div className="mb-2">
                  <span className="badge bg-dark me-2">{openFactura.estado}</span>
                  <span className="text-muted small">
                    Emisión: {new Date(openFactura.fecha_emision).toLocaleString()}
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="table table-sm table-bordered align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Descripción</th>
                        <th style={{ width: 90 }}>Cant.</th>
                        <th style={{ width: 140 }}>Precio</th>
                        <th style={{ width: 140 }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(openFactura.detalles || []).map((d: any) => (
                        <tr key={d.id_detalle}>
                          <td>{d.descripcion}</td>
                          <td>{d.cantidad}</td>
                          <td>{money(d.precio_unitario)}</td>
                          <td>{money(d.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h6 className="mt-3">Pagos</h6>
                {(openFactura.pagos || []).length === 0 ? (
                  <div className="alert alert-secondary mb-0">Sin pagos registrados.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Método</th>
                          <th>Monto</th>
                          <th>Estado</th>
                          <th>Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(openFactura.pagos || []).map((p: any) => (
                          <tr key={p.id_pago}>
                            <td className="small">{p.id_pago}</td>
                            <td>{p.metodo_pago}</td>
                            <td>{money(p.monto)}</td>
                            <td>{p.estado}</td>
                            <td className="small">{new Date(p.fecha_pago).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
