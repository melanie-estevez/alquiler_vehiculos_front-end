import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { VehiculosService, type Vehiculo } from "../../services/vehiculos.service";
import { reservasService } from "../../services/reservas.service";
import { clientesService, type ClienteMe } from "../../services/clientes.service";
import { historialUsuarioService } from "../../services/historialUsuario.service";
import { historialReservasService } from "../../services/historialReservas.service";
import { useAuth } from "../../context/AuthContext";

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function backendMsg(err: any) {
  const m = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Error";
  return Array.isArray(m) ? m.join(", ") : String(m);
}

export default function ReservaCreatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, ready } = useAuth();

  const vehiculoId = id;

  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [cliente, setCliente] = useState<ClienteMe | null>(null);

  const [fechaInicio, setFechaInicio] = useState("");
  const [dias, setDias] = useState(1);
  const [loading, setLoading] = useState(false);

  const fechaFin = useMemo(() => {
    if (!fechaInicio) return "";
    return addDays(fechaInicio, dias);
  }, [fechaInicio, dias]);

  useEffect(() => {
    if (!ready) return;

    if (!user) {
      navigate("/auth/login", { replace: true });
      return;
    }

    if (!vehiculoId) return;

    const run = async () => {
      try {
        const v = await VehiculosService.getById(vehiculoId);
        setVehiculo(v);

        const c = await clientesService.getCliente(true);
        setCliente(c);
      } catch (err) {
        console.error(err);
      }
    };

    run();
  }, [vehiculoId, user, navigate, ready]);

  useEffect(() => {
    if (!fechaInicio) setFechaInicio(new Date().toISOString().slice(0, 10));
  }, [fechaInicio]);

  if (!vehiculoId) return <p className="mt-5 text-center">ID de vehículo inválido.</p>;
  if (!vehiculo) return <p className="mt-5 text-center">Cargando vehículo...</p>;

  const goCrearCliente = () => {
    navigate(`/profile?required=1&next=/reservar/${vehiculoId}`, { replace: true });
  };

  const handleReservar = async () => {
    try {
      if (!cliente) {
        goCrearCliente();
        return;
      }

      if (vehiculo.estado !== "DISPONIBLE") {
        alert("Este vehículo no está disponible para reservar.");
        return;
      }

      if (!fechaInicio) {
        alert("Selecciona una fecha de inicio.");
        return;
      }

      setLoading(true);

      const payload = {
        id_vehiculo: vehiculo.id_vehiculo,
        fecha_inicio: fechaInicio,
        dias,
        fecha_fin: fechaFin,
      };

      const created = await reservasService.create(payload);

      if (user?.id) {
        const now = new Date().toISOString();
        await Promise.allSettled([
          historialUsuarioService.create({
            id_usuario: user.id,
            id_reserva: created.id_reserva,
            accion: "Reserva creada (pendiente)",
            fecha: now,
          }),
          historialReservasService.create({
            id_reserva: created.id_reserva,
            estado_anterior: "N/A",
            estado_nuevo: "pendiente",
            fecha: now,
          }),
        ]);
      }

      navigate(`/factura/reserva/${created.id_reserva}`, { replace: true });
    } catch (error) {
      console.error(error);
      alert("Error al crear reserva: " + backendMsg(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 pt-4" style={{ maxWidth: 900 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Crear Reserva</h2>
        <Link className="btn btn-outline-dark" to="/carros">
          Volver
        </Link>
      </div>

      {!cliente && (
        <div className="alert alert-warning">
          Primero completa tu perfil de cliente para poder reservar.{" "}
          <button className="btn btn-dark btn-sm ms-2" onClick={goCrearCliente}>
            Completar perfil
          </button>
        </div>
      )}

      <div className="card border-dark">
        <div className="card-body">
          <p className="mb-1">
            <b>Vehículo:</b> {vehiculo.marca} {vehiculo.modelo}
          </p>
          <p className="mb-1">
            <b>Placa:</b> {vehiculo.placa}
          </p>
          <p className="mb-1">
            <b>Precio diario:</b> ${Number(vehiculo.precio_diario || 0).toFixed(2)}
          </p>
          <p className="mb-1">
            <b>Estado:</b> {vehiculo.estado}
          </p>

          <div className="mt-3">
            <label className="form-label">Fecha inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="mt-3">
            <label className="form-label">Días</label>
            <input
              type="number"
              min={1}
              value={dias}
              onChange={(e) => setDias(Math.max(1, Number(e.target.value)))}
              className="form-control"
            />
          </div>

          <div className="mt-3">
            <p className="mb-1">
              <b>Fin (calculada):</b> {fechaFin || "-"}
            </p>
          </div>

          <button
            className="btn btn-dark w-100 mt-4"
            onClick={handleReservar}
            disabled={loading || !cliente}
          >
            {loading ? "Reservando..." : "Crear reserva"}
          </button>
        </div>
      </div>
    </div>
  );
}
