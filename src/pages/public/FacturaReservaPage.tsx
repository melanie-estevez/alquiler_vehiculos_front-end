import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { clientesService, type ClienteMe } from "../../services/clientes.service";
import { reservasService, type Reserva } from "../../services/reservas.service";
import { facturasService, type Factura } from "../../services/facturas.service";

function backendMsg(err: any) {
  const m = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Error";
  return Array.isArray(m) ? m.join(", ") : String(m);
}

function isUuid(x: any) {
  return (
    typeof x === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(x)
  );
}

export default function FacturaReservaPage() {
  const params = useParams();
  const idReserva: string | undefined = (params as any).idReserva || (params as any).id || (params as any).id_reserva;

  const navigate = useNavigate();
  const { user, ready } = useAuth();

  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState<ClienteMe | null>(null);
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [factura, setFactura] = useState<Factura | null>(null);

  const total = useMemo(() => Number(factura?.total ?? 0), [factura?.total]);

  useEffect(() => {
    if (!ready) return;

    if (!user) {
      navigate(`/auth/login?next=/factura/reserva/${idReserva ?? ""}`, { replace: true });
      return;
    }

    if (!idReserva || !isUuid(idReserva)) {
      navigate("/carros", { replace: true });
      return;
    }

    const load = async () => {
      try {
        setLoading(true);

        const c = await clientesService.getCliente(true);
        if (!c) {
          navigate(`/profile?required=1&next=/factura/reserva/${idReserva}`, { replace: true });
          return;
        }
        setCliente(c);

        const r = await reservasService.getOne(idReserva);
        setReserva(r);

        const f = await facturasService.getByReserva(idReserva);
        setFactura(f);
      } catch (err) {
        alert("No se pudo cargar la factura: " + backendMsg(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [ready, user, idReserva, navigate]);

  if (loading) {
    return (
      <div className="container mt-5 pt-4">
        <p>Cargando factura...</p>
      </div>
    );
  }

  if (!cliente || !reserva || !factura) {
    return (
      <div className="container mt-5 pt-4">
        <p>No se encontró la factura.</p>
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-dark" to="/carros">
            Volver
          </Link>
          <Link className="btn btn-dark" to={`/profile?required=1&next=/factura/reserva/${idReserva ?? ""}`}>
            Ir a Perfil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-4" style={{ maxWidth: 980 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Factura</h2>
        <Link className="btn btn-outline-dark" to="/mis-reservas">
          Mis reservas
        </Link>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-6">
              <div className="fw-semibold">Cliente</div>
              <div>
                {cliente.name} {cliente.apellido}
              </div>
              <div className="text-muted small">{cliente.email}</div>
            </div>

            <div className="col-md-6">
              <div className="fw-semibold">Reserva</div>
              <div className="text-muted small">ID: {reserva.id_reserva}</div>
              <div>
                Estado: <b>{reserva.estado}</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-dark">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <div>
              <div className="fw-semibold">Factura #{factura.id_factura}</div>
              <div className="text-muted small">Estado: {factura.estado}</div>
            </div>

            <div className="text-end">
              <div>
                Subtotal: <b>${Number(factura.subtotal ?? 0).toFixed(2)}</b>
              </div>
              <div>
                IVA: <b>${Number(factura.iva ?? 0).toFixed(2)}</b>
              </div>
              <div className="fs-5">
                Total: <b>${total.toFixed(2)}</b>
              </div>
            </div>
          </div>

          <hr />

          <div className="mt-3 d-flex gap-2">
            <Link className="btn btn-dark" to={`/pagar/${factura.id_factura}?reserva=${reserva.id_reserva}`}>
              Pagar
            </Link>
            <Link className="btn btn-outline-dark" to="/carros">
              Seguir viendo carros
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
