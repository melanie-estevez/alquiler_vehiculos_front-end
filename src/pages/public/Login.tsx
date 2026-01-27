import { Alert, Button, Card, Form } from "react-bootstrap";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginApi } from "../../services/auth.service";

type LocationState = {
  from?: string;
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await loginApi({ email, password });

   
      navigate(state.from || "/dashboard", { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Credenciales inválidas o error del servidor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 mx-auto" style={{ maxWidth: 480 }}>
      <h3 className="mb-3">Login</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" className="w-100" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </Form>
    </Card>
  );
}
