import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      alert("❌ No se pudo iniciar sesión: " + backendMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 pt-5" style={{ maxWidth: 520 }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="form-control mb-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-dark w-100" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}