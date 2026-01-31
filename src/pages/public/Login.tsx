import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function backendMsg(err: any) {
  const m = err?.response?.data?.message || err?.message || "Error";
  return Array.isArray(m) ? m.join(", ") : String(m);
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await login({ email, password });
      navigate("/", { replace: true });
    } catch (err) {
      alert("No se pudo iniciar sesión: " + backendMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card auth-split">
        
       
        <div className="auth-image" />

       
        <div className="auth-form-wrap">
          <h2 className="auth-title">Iniciar sesión</h2>


          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Correo</label>
              <input
                className="auth-input"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Contraseña</label>
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="auth-btn" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <div className="auth-foot">
              <span>¿No tienes cuenta?</span>{" "}
              <Link to="/auth/register" className="auth-link">
                Crear cuenta
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );

}
