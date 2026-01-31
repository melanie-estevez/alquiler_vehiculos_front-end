import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await register({ email, password });
      navigate("/", { replace: true });
    } catch (err: any) {
      alert("No se pudo registrar: La contraseña debe tener una longitud mínima de 6 caracteres." );
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="auth-wrap">
      <div className="auth-card">
        
      
        <div className="auth-image"></div>

        
        <div className="auth-form-wrap">
          <div className="auth-head">
            <h2 className="auth-title">Crear cuenta</h2>
            
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">Correo electrónico</label>
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Contraseña</label>
              <input
                className="auth-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="auth-btn" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <div className="auth-foot">
            <span>¿Ya tienes cuenta?</span>{" "}
            <span
              className="auth-link"
              onClick={() => navigate("/auth/login")}
            >
              Iniciar sesión
            </span>
          </div>
        </div>
      </div>
    </div>
  );

}
