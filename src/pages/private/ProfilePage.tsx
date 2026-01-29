import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="container mt-5 pt-4">
      <h2 className="mb-3">Perfil</h2>

      <div className="card border-dark">
        <div className="card-body">
          <p className="mb-1">
            <b>Email:</b> {user?.email}
          </p>
          <p className="mb-0">
            <b>Rol:</b> {isAdmin ? "admin" : "user"}
          </p>
        </div>
      </div>
    </div>
  );
}