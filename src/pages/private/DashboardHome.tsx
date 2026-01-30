import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DashboardHome() {
  const { user, isAdmin } = useAuth(); 

  return (
    <div className="container mt-5 pt-4">
      <h2 className="mb-4 text-dark">Dashboard</h2>

      {isAdmin ? (
        <div className="d-flex flex-column gap-2">
          <Link className="btn btn-dark" to="/admin/sucursales">
            Gestionar Sucursales
          </Link>

          <Link className="btn btn-dark" to="/admin/vehiculos">
            Gestionar Vehículos
          </Link>

          <Link className="btn btn-dark" to="/admin/reservas">
            Gestionar Reservas
          </Link>

          <Link className="btn btn-dark" to="/admin/mantenimientos">
            Gestionar Mantenimientos
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          <Link className="btn btn-dark" to="/carros">
            Ver carros disponibles
          </Link>

          <Link className="btn btn-dark" to="/mis-reservas">
            Mis reservas
          </Link>
        </div>
      )}

      {!user && (
        <div className="alert alert-warning mt-3">
          Debes iniciar sesión para acceder al dashboard.
        </div>
      )}
    </div>
  );
}
