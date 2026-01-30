import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { facturasService, type Factura } from "../../services/facturas.service";
import { pagosService } from "../../services/pagos.service";
import { useAuth } from "../../context/AuthContext";

function backendMsg(err: any) {
  const m = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Error";
  return Array.isArray(m) ? m.join(", ") : String(m);
}

export default function PagarFacturaPage() {
  const { idFactura } = useParams<{ idFactura: string }>();
  const [sp] = useSearchParams();
  const idReserva = sp.get("reserva") || undefined;

  const navigate = useNavigate();
  const { user, ready } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [factura, setFactura] = useState<Factura | null>(null);
  const [metodo, setMetodo] = useState("TARJETA");

  const total = useMemo(() => Number(factura?.total ?? 0), [factura?.total]);

  useEffect(() => {
    if (!ready) return;

    if (!user) {
      navigate(`/auth/login?next=/pagar/${idFactura ?? ""}`, { replace: true });
      return;
    }

    if (!idFactura) {
      navigate("/mis-reservas", { replace: true });
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const f = await facturasService.getOne(idFactura);
        setFactura(f);
      } catch (e) {
        alert("No se pudo cargar la factura: " + backendMsg(e));
        navigate("/mis-reservas", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [ready, user, idFactura, navigate]);

  const pagar = async () => {
    if (!factura?.id_factura) return;

    try {
      setSaving(true);

      await pagosService.create({
        id_factura: factura.id_factura,
        metodo,
        estado: "Completado",
        fecha_pago: new Date().toISOString(),
        id_reserva: idReserva,
      });

      alert("Pago realizado. Tu reserva fue confirmada.");
      navigate("/mis-reservas", { replace: true });
    } catch (e) {
      alert("No se pudo pagar: " + backendMsg(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 pt-4">
        <p>Cargando pago...</p>
      </div>
    );
  }

  if (!factura) return null;

  return (
    <div className="container mt-5 pt-4" style={{ maxWidth: 720 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Pagar factura</h2>
        <Link className="btn btn-outline-dark" to="/mis-reservas">
          Volver
        </Link>
      </div>

      <div className="card border-dark">
        <div className="card-body">
          <div className="mb-2">
            Factura: <b>#{factura.id_factura}</b>
          </div>
          <div className="mb-2">
            Estado: <b>{factura.estado}</b>
          </div>
          <div className="fs-4 mb-3">
            Total a pagar: <b>${total.toFixed(2)}</b>
          </div>

          <label className="form-label">Método de pago</label>
          <select className="form-select" value={metodo} onChange={(e) => setMetodo(e.target.value)}>
            <option value="TARJETA">Tarjeta</option>
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="EFECTIVO">Efectivo</option>
          </select>

          <button className="btn btn-dark w-100 mt-4" onClick={pagar} disabled={saving}>
            {saving ? "Pagando..." : "Confirmar pago"}
          </button>
        </div>
      </div>
    </div>
  );
}
