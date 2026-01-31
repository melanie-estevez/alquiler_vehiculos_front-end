
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { historialUsuarioService, type HistorialUsuario } from "../../services/historialUsuario.service";

export default function ReservaTimelinePage() {
  const { idReserva } = useParams<{ idReserva: string }>();

  const [items, setItems] = useState<HistorialUsuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idReserva) return;

    const run = async () => {
      try {
        setLoading(true);
        const data = await historialUsuarioService.getByReserva(idReserva);
        setItems(data);
      } catch (e) {
        console.error(e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [idReserva]);

  const ordered = useMemo(() => {
    return [...items].sort((a, b) => (a.fecha > b.fecha ? -1 : 1));
  }, [items]);

  return (
    <div className="container mt-5 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Timeline de Reserva</h2>
        <Link className="btn btn-outline-dark" to="/mis-reservas">
          Volver
        </Link>
      </div>

      {!idReserva && <p>Reserva inválida.</p>}

      {loading && <p>Cargando historial...</p>}

      {!loading && ordered.length === 0 && (
        <div className="alert alert-secondary mb-0">
          No hay acciones registradas todavía.
        </div>
      )}

      {!loading && ordered.length > 0 && (
        <div className="list-group">
          {ordered.map((h, idx) => (
            <div key={h.id_historial_usuario ?? idx} className="list-group-item">
              <div className="d-flex justify-content-between align-items-start gap-2">
                <div>
                  <div className="fw-semibold">{h.accion}</div>
                  <div className="text-muted small">Usuario: {h.id_usuario}</div>
                </div>
                <div className="text-muted small">{new Date(h.fecha).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}