// src/pages/private/DashboardHome.tsx
import { useAuth } from "../../context/AuthContext";

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>

      <div className="alert alert-info">
        Bienvenido{" "}
        <strong>{user?.email}</strong>
      </div>

      <p>
        Desde aquí podrás administrar sucursales, vehículos, reservas y
        mantenimientos.
      </p>

      <div className="d-flex gap-3 mt-4">
        <a href="/admin/sucursales" className="btn btn-outline-dark">
          Sucursales
        </a>

        <a href="/admin/vehiculos" className="btn btn-outline-dark">
          Vehículos
        </a>

        <a href="/admin/reservas" className="btn btn-outline-dark">
          Reservas
        </a>

        <a href="/admin/mantenimientos" className="btn btn-outline-dark">
          Mantenimientos
        </a>
      </div>
    </div>
  );
}
