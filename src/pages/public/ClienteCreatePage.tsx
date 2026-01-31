import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { clientesService, type CreateClienteDto, type ClienteMe } from "../../services/clientes.service";

function getBackendMessage(err: any): string {
  const msg =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Error desconocido";
  return typeof msg === "string" ? msg : JSON.stringify(msg);
}

export default function ClienteCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, ready } = useAuth();

  const qs = new URLSearchParams(location.search);
  const next = qs.get("next") || "/mis-reservas";

  const [existing, setExisting] = useState<ClienteMe | null>(null);
  const [checking, setChecking] = useState(true);

  const [form, setForm] = useState<CreateClienteDto>({
    name: "",
    apellido: "",
    cedula: "",
    email: user?.email || "",
    celular: "",
    fecha_nacimiento: "",
    licencia_conducir: false,
    ciudad: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ready) return;

    if (!user) {
      navigate("/auth/login", { replace: true });
      return;
    }

    const run = async () => {
      try {
        setChecking(true);
        const c = await clientesService.getCliente(); // ✅ null si 404
        if (c) {
          setExisting(c);
          navigate(next, { replace: true });
          return;
        }
        setExisting(null);
      } catch (err) {
        console.error(err);
        setExisting(null);
      } finally {
        setChecking(false);
      }
    };

    run();
  }, [ready, user, navigate, next]);

  useEffect(() => {
    if (user?.email) {
      setForm((p) => ({ ...p, email: user.email || "" }));
    }
  }, [user?.email]);

  const onChange = <K extends keyof CreateClienteDto>(k: K, v: CreateClienteDto[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  const submit = async () => {
    if (!form.name.trim()) return alert("Nombre es obligatorio");
    if (!form.apellido.trim()) return alert("Apellido es obligatorio");
    if (!form.cedula.trim()) return alert("Cédula es obligatoria");
    if (!form.email.trim()) return alert("Email es obligatorio");
    if (!form.celular.trim()) return alert("Celular es obligatorio");
    if (!form.fecha_nacimiento.trim()) return alert("Fecha nacimiento es obligatoria");
    if (!form.ciudad.trim()) return alert("Ciudad es obligatoria");

    try {
      setSaving(true);

      await clientesService.createMe({
        ...form,
        licencia_conducir: Boolean(form.licencia_conducir),
      });

      alert("Cliente creado correctamente");
      navigate(next, { replace: true });
    } catch (err: any) {
      console.error("Error creando cliente:", err);
      alert(" No se pudo crear el cliente: " + getBackendMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (checking) {
    return (
      <div className="container mt-5 pt-4">
        <p>Cargando...</p>
      </div>
    );
  }

  if (existing) {
    return (
      <div className="container mt-5 pt-4" style={{ maxWidth: 720 }}>
        <div className="alert alert-success">
          Ya tienes cliente creado. <Link to={next}>Continuar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-4" style={{ maxWidth: 720 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Crear Cliente</h2>
        <Link className="btn btn-outline-dark" to={next}>
          Volver
        </Link>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Nombre</label>
              <input className="form-control" value={form.name} onChange={(e) => onChange("name", e.target.value)} />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Apellido</label>
              <input className="form-control" value={form.apellido} onChange={(e) => onChange("apellido", e.target.value)} />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Cédula</label>
              <input className="form-control" value={form.cedula} onChange={(e) => onChange("cedula", e.target.value)} />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Celular</label>
              <input className="form-control" value={form.celular} onChange={(e) => onChange("celular", e.target.value)} />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Email</label>
              <input className="form-control" value={form.email} readOnly />
              <div className="text-muted small">Se toma del usuario logueado.</div>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Fecha nacimiento</label>
              <input
                type="date"
                className="form-control"
                value={form.fecha_nacimiento}
                onChange={(e) => onChange("fecha_nacimiento", e.target.value)}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Ciudad</label>
              <input className="form-control" value={form.ciudad} onChange={(e) => onChange("ciudad", e.target.value)} />
            </div>

            <div className="col-12 col-md-6 d-flex align-items-center gap-2 pt-4">
              <input
                id="lic"
                type="checkbox"
                checked={form.licencia_conducir}
                onChange={(e) => onChange("licencia_conducir", e.target.checked)}
              />
              <label htmlFor="lic" className="form-label mb-0">
                ¿Tiene licencia de conducir?
              </label>
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-dark" onClick={submit} disabled={saving}>
              {saving ? "Guardando..." : "Guardar cliente"}
            </button>

            <Link className="btn btn-outline-dark" to={next}>
              Cancelar
            </Link>
          </div>
        </div>
      </div>

      <p className="text-muted small mt-3 mb-0">
        * Esto crea tu cliente en <b>/clientes/me</b>. Sin cliente no podrás reservar.
      </p>
    </div>
  );
}