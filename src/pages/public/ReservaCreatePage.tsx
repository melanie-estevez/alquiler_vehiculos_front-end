import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VehiculosService, type Vehiculo } from "../../services/vehiculos.service";
import { reservasService } from "../../services/reservas.service";
import { clientesService, type ClienteMe } from "../../services/clientes.service";
import { useAuth } from "../../context/AuthContext";

export default function ReservaCreatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, ready } = useAuth();

  const vehiculoId = id;

  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [cliente, setCliente] = useState<ClienteMe | null>(null);

  const [dias, setDias] = useState(1);
  const [loading, setLoading] = useState(false);

  const fechaInicio = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  const fechaFinStr = useMemo(() => {
    const f = new Date(fechaInicio);
    f.setDate(f.getDate() + dias);
    return f.toISOString().split("T")[0];
  }, [fechaInicio, dias]);

  useEffect(() => {
    if (!ready) return;

    // si no estás logueado -> login
    if (!user) {
      navigate("/auth/login", { replace: true });
      return;
    }

    if (!vehiculoId) return;

    const run = async () => {
      try {
        const v = await VehiculosService.getById(vehiculoId);
        setVehiculo(v);

        const c = await clientesService.getCliente();
        setCliente(c);
      } catch (err) {
        console.error(err);
        navigate(`/cliente/create?next=/reservar/${vehiculoId}`, { replace: true });
      }
    };

    run();
  }, [vehiculoId, user, navigate, ready]);

  if (!vehiculoId) {
    return <p className="mt-5 text-center">ID de vehículo inválido.</p>;
  }

  if (!vehiculo) {
    return <p className="mt-5 text-center">Cargando vehículo...</p>;
  }

  const handleReservar = async () => {
    try {
      if (!cliente) {
        navigate(`/cliente/create?next=/reservar/${vehiculoId}`, { replace: true });
        return;
      }

      // Opcional: si no está disponible, no dejes reservar
      if (vehiculo.estado !== "DISPONIBLE") {
        alert("❌ Este vehículo no está disponible para reservar.");
        return;
      }

      setLoading(true);

      await reservasService.create({
        id_vehiculo: vehiculo.id_vehiculo,
        id_cliente: cliente.id_cliente,
        fecha_inicio: fechaInicio,
        dias,
        fecha_fin: fechaFinStr,
      });

      alert("✅ Reserva creada");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error al crear reserva", error);
      alert("❌ Error al crear reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <h2 className="mb-3">Reservar vehículo</h2>

      <div className="card border-dark">
        <div className="card-body">
          <p className="mb-1">
            <b>Vehículo:</b> {vehiculo.marca} {vehiculo.modelo}
          </p>
          <p className="mb-1">
            <b>Placa:</b> {vehiculo.placa}
          </p>
          <p className="mb-1">
            <b>Estado:</b> {vehiculo.estado}
          </p>

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
              <b>Inicio:</b> {fechaInicio}
            </p>
            <p className="mb-0">
              <b>Fin:</b> {fechaFinStr}
            </p>
          </div>

          <button
            className="btn btn-dark w-100 mt-4"
            onClick={handleReservar}
            disabled={loading}
          >
            {loading ? "Reservando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
