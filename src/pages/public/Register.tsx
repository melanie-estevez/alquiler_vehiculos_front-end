import { Alert, Button, Card, Form } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../services/auth.service";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await registerApi({ email, password });

    
      navigate("/auth/login", { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "No se pudo registrar. Revisa los datos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 mx-auto" style={{ maxWidth: 480 }}>
      <h3 className="mb-3">Registro</h3>

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
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" className="w-100" disabled={loading}>
          {loading ? "Registrando..." : "Crear cuenta"}
        </Button>
      </Form>
    </Card>
  );
}
