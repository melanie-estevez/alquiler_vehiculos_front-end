// src/pages/private/AuditoriaReservaPage.tsx
import { useMemo, useState } from "react";
import { historialReservasService, type HistorialReserva } from "../../services/historialReservas.service";
import { historialUsuarioService, type HistorialUsuario } from "../../services/historialUsuario.service";

export default function AuditoriaReservaPage() {
  const [idReserva, setIdReserva] = useState("");
  const [loading, setLoading] = useState(false);

  const [histEstados, setHistEstados] = useState<HistorialReserva[]>([]);
  const [histAcciones, setHistAcciones] = useState<HistorialUsuario[]>([]);

  const buscar = async () => {
    const id = idReserva.trim();
    if (!id) {
      alert("Pon un id_reserva");
      return;
    }

    try {
      setLoading(true);

      // 1) cambios de estado (historial_reservas) filtrado por query
      const estados = await historialReservasService.getAll({
        search: id,
        searchField: "id_reserva",
        limit: 200,
        page: 1,
      });

      // 2) acciones por reserva (historial_usuario)
      const acciones = await historialUsuarioService.getByReserva(id);

      setHistEstados(estados);
      setHistAcciones(acciones);
    } catch (e) {
      console.error(e);
      alert("No se pudo cargar auditoría");
      setHistEstados([]);
      setHistAcciones([]);
    } finally {
      setLoading(false);
    }
  };

  const estadosOrdenados = useMemo(() => {
    return [...histEstados].sort((a, b) => (a.fecha > b.fecha ? -1 : 1));
  }, [histEstados]);

  const accionesOrdenadas = useMemo(() => {
    return [...histAcciones].sort((a, b) => (a.fecha > b.fecha ? -1 : 1));
  }, [histAcciones]);

  return (
    <div className="container mt-5 pt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
        <h2 className="mb-0">Auditoría de Reserva (Admin)</h2>

        <div className="d-flex gap-2">
          <input
            className="form-control"
            style={{ minWidth: 320 }}
            placeholder="Pega aquí el id_reserva..."
            value={idReserva}
            onChange={(e) => setIdReserva(e.target.value)}
          />
          <button className="btn btn-dark" onClick={buscar} disabled={loading}>
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </div>

      <div className="row g-3">
        {/* Cambios de estado */}
        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header fw-semibold">Historial de Estados</div>
            <div className="card-body">
              {loading ? (
                <p className="mb-0">Cargando...</p>
              ) : estadosOrdenados.length === 0 ? (
                <p className="mb-0 text-muted">Sin cambios de estado.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-bordered align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Anterior</th>
                        <th>Nuevo</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estadosOrdenados.map((h, idx) => (
                        <tr key={h.id_historial ?? idx}>
                          <td>{h.estado_anterior}</td>
                          <td>{h.estado_nuevo}</td>
                          <td className="small">{new Date(h.fecha).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header fw-semibold">Acciones (Timeline)</div>
            <div className="card-body">
              {loading ? (
                <p className="mb-0">Cargando...</p>
              ) : accionesOrdenadas.length === 0 ? (
                <p className="mb-0 text-muted">Sin acciones registradas.</p>
              ) : (
                <div className="list-group">
                  {accionesOrdenadas.map((a, idx) => (
                    <div key={a.id_historial_usuario ?? idx} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <div>
                          <div className="fw-semibold">{a.accion}</div>
                          <div className="text-muted small">Usuario: {a.id_usuario}</div>
                        </div>
                        <div className="text-muted small">{new Date(a.fecha).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="text-muted small mt-3 mb-0">
        * Usa esto para auditar cualquier reserva: confirmaciones, cancelaciones, factura/pago, entrega/devolución.
      </p>
    </div>
  );
}