// src/pages/private/AlquileresPage.tsx
import { useEffect, useMemo, useState } from "react";
import { alquileresService, type Alquiler } from "../../services/alquileres.service";

export default function AlquileresPage() {
  const [alquileres, setAlquileres] = useState<Alquiler[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchReserva, setSearchReserva] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const data = await alquileresService.getAll({ page: 1, limit: 100 });
      setAlquileres(data);
    } catch (e) {
      console.error(e);
      setAlquileres([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = searchReserva.trim();
    if (!s) return alquileres;
    return alquileres.filter((a) => a.id_reserva.includes(s));
  }, [alquileres, searchReserva]);

  const marcarDevuelto = async (a: Alquiler) => {
    const kmFinal = prompt("Km final:", a.km_final || "");
    if (kmFinal == null) return;

    const fechaDev = prompt("Fecha devolución (YYYY-MM-DD):", a.fecha_devolucion?.slice(0, 10) || "");
    if (fechaDev == null) return;

    try {
      await alquileresService.update(a.id_alquiler, {
        km_final: kmFinal,
        fecha_devolucion: fechaDev,
        estado: "FINALIZADO",
      });
      await load();
      alert("✅ Alquiler actualizado a FINALIZADO");
    } catch (e) {
      console.error(e);
      alert("❌ No se pudo actualizar alquiler");
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
        <h2 className="mb-0">Alquileres (Admin)</h2>

        <div className="d-flex gap-2">
          <input
            className="form-control"
            style={{ minWidth: 280 }}
            value={searchReserva}
            onChange={(e) => setSearchReserva(e.target.value)}
            placeholder="Filtrar por id_reserva..."
          />
          <button className="btn btn-outline-dark" onClick={load}>
            Recargar
          </button>
        </div>
      </div>

      {loading && <p>Cargando...</p>}

      {!loading && filtered.length === 0 && <p>No hay alquileres</p>}

      {!loading && filtered.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>id_reserva</th>
                <th>Entrega</th>
                <th>Devolución</th>
                <th>Km inicial</th>
                <th>Km final</th>
                <th>Estado</th>
                <th style={{ width: 180 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id_alquiler}>
                  <td className="small">{a.id_reserva}</td>
                  <td>{a.fecha_entrega}</td>
                  <td>{a.fecha_devolucion}</td>
                  <td>{a.km_inicial}</td>
                  <td>{a.km_final}</td>
                  <td>{a.estado}</td>
                  <td>
                    {a.estado !== "FINALIZADO" ? (
                      <button className="btn btn-sm btn-dark" onClick={() => marcarDevuelto(a)}>
                        Marcar devolución
                      </button>
                    ) : (
                      <span className="text-muted small">Finalizado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-muted small mb-0">
            * Entrega (crear alquiler) lo hacemos desde Reservas confirmadas (siguiente).
          </p>
        </div>
      )}
    </div>
  );
}