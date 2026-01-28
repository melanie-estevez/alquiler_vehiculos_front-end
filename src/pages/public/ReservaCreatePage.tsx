// src/pages/public/ReservaCreatePage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VehiculosService } from "../../services/vehiculos.service";
import { reservasService } from "../../services/reservas.service";
import { clientesService, type ClienteMe } from "../../services/clientes.service";
import { useAuth } from "../../context/AuthContext";

export default function ReservaCreatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const vehiculoId = id;

  const [vehiculo, setVehiculo] = useState<any>(null);
  const [cliente, setCliente] = useState<ClienteMe | null>(null);

  const [dias, setDias] = useState(1);
  const [loading, setLoading] = useState(false);

  const fechaInicio = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // si no estás logueado, login
    if (!user) {
      navigate("/auth/login", { replace: true });
      return;
    }

    if (!vehiculoId) return;

    const run = async () => {
      try {
        // 1) cargar vehiculo
        const v = await VehiculosService.getById(vehiculoId);
        setVehiculo(v);

        // 2) intentar traer cliente
        const c = await clientesService.getMe();
        setCliente(c);
      } catch (err: any) {
        // si no hay cliente, mandamos a crear
        // (tu backend normalmente devuelve 404/401 dependiendo implementación)
        console.error(err);
        navigate(`/cliente/create?next=/reservar/${vehiculoId}`, { replace: true });
      }
    };

    run();
  }, [vehiculoId, user, navigate]);

  if (!vehiculo) return <p className="mt-5 text-center">Cargando vehículo...</p>;

  const fechaFin = new Date(fechaInicio);
  fechaFin.setDate(fechaFin.getDate() + dias);

  const handleReservar = async () => {
    try {
      if (!cliente) {
        navigate(`/cliente/create?next=/reservar/${vehiculoId}`, { replace: true });
        return;
      }

      setLoading(true);

      await reservasService.create({
        id_vehiculo: vehiculo.id_vehiculo,
        id_cliente: cliente.id_cliente,
        fecha_inicio: fechaInicio,
        dias,
        fecha_fin: fechaFin.toISOString().split("T")[0],
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

          <div className="mt-3">
            <label className="form-label">Días</label>
            <input
              type="number"
              min={1}
              value={dias}
              onChange={(e) => setDias(Number(e.target.value))}
              className="form-control"
            />
          </div>

          <div className="mt-3">
            <p className="mb-1">
              <b>Inicio:</b> {fechaInicio}
            </p>
            <p className="mb-0">
              <b>Fin:</b> {fechaFin.toISOString().split("T")[0]}
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
