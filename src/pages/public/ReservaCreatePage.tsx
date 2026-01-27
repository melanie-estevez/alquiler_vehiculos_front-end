import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { VehiculosService } from "../../services/vehiculos.service";
import { reservasService } from "../../services/reservas.service";
import { useAuth } from "../../hooks/useAuth";  

export default function ReservaCreatePage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { user } = useAuth(); 
  const vehiculoId = id || searchParams.get("id_vehiculo");

  const [vehiculo, setVehiculo] = useState<any>(null);
  const [dias, setDias] = useState(1);
  const [loading, setLoading] = useState(false);

  const fechaInicio = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!user?.id_cliente) {
      navigate("/cliente/create"); 
    }

    if (!vehiculoId) return;

    const loadVehiculo = async () => {
      const data = await VehiculosService.getById(vehiculoId);
      setVehiculo(data);
    };

    loadVehiculo();
  }, [vehiculoId, user, navigate]);

  if (!vehiculo) {
    return <p className="mt-5 text-center">Cargando vehículo...</p>;
  }

  const fechaFin = new Date(fechaInicio);
  fechaFin.setDate(fechaFin.getDate() + dias);

  const handleReservar = async () => {
    setLoading(true);

    try {
      if (!user?.id_cliente) {
        alert("Por favor, complete los datos del cliente antes de hacer la reserva.");
        navigate("/cliente/create");  
        return;
      }

      await reservasService.create({
        id_vehiculo: vehiculo.id_vehiculo,
        id_cliente: user.id_cliente, 
        fecha_inicio: fechaInicio,
        dias,
        fecha_fin: fechaFin.toISOString().split("T")[0],
      });

      alert("Reserva creada");
      navigate("/dashboard");  
    } catch (error) {
      console.error("Error al crear reserva", error);
      alert("Error al crear reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Reservar vehículo</h2>

      <p>
        {vehiculo.marca} {vehiculo.modelo}
      </p>
      <p>Placa: {vehiculo.placa}</p>

      <label>Días</label>
      <input
        type="number"
        min={1}
        value={dias}
        onChange={(e) => setDias(+e.target.value)}
        className="form-control mb-3"
      />

      <p>Inicio: {fechaInicio}</p>
      <p>Fin: {fechaFin.toISOString().split("T")[0]}</p>

      <button
        className="btn btn-dark w-100"
        onClick={handleReservar}
        disabled={loading}
      >
        {loading ? "Reservando..." : "Confirmar"}
      </button>
    </div>
  );
}
