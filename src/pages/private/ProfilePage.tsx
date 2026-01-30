// src/pages/private/ProfilePage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  clientesService,
  type ClienteMe,
  type CreateClienteDto,
} from "../../services/clientes.service";

function backendMsg(err: any) {
  const m =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Error";
  return Array.isArray(m) ? m.join(", ") : String(m);
}

type FormState = {
  name: string;
  apellido: string;
  cedula: string;
  email: string;
  celular: string;
  fecha_nacimiento: string;
  licencia_conducir: boolean;
  ciudad: string;
};

const emptyForm: FormState = {
  name: "",
  apellido: "",
  cedula: "",
  email: "",
  celular: "",
  fecha_nacimiento: "",
  licencia_conducir: false,
  ciudad: "",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, ready } = useAuth();

  const qs = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const required = qs.get("required") === "1";
  const next = qs.get("next") || "";

  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState<ClienteMe | null>(null);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);

      // ✅ fuerza refresh por si antes hubo 404 cacheado
      const c = await clientesService.getCliente(true);
      setCliente(c);

      if (c) {
        setForm({
          name: c.name ?? "",
          apellido: c.apellido ?? "",
          cedula: c.cedula ?? "",
          email: user?.email ?? c.email ?? "",
          celular: c.celular ?? "",
          fecha_nacimiento: c.fecha_nacimiento ?? "",
          licencia_conducir: Boolean(c.licencia_conducir),
          ciudad: c.ciudad ?? "",
        });
      } else {
        setForm({ ...emptyForm, email: user?.email ?? "" });
      }
    } catch (err: any) {
      console.error(err);
      alert("❌ Error cargando perfil: " + backendMsg(err));
      setCliente(null);
      setForm({ ...emptyForm, email: user?.email ?? "" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ready) return;

    if (!user) {
      navigate("/auth/login", { replace: true });
      return;
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, user]);

  const onChange = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Nombre obligatorio";
    if (!form.apellido.trim()) return "Apellido obligatorio";
    if (!form.cedula.trim()) return "Cédula obligatoria";
    if (!form.celular.trim()) return "Celular obligatorio";
    if (!form.fecha_nacimiento.trim()) return "Fecha nacimiento obligatoria";
    if (!form.ciudad.trim()) return "Ciudad obligatoria";
    return "";
  };

  const guardar = async () => {
    const errMsg = validate();
    if (errMsg) return alert(errMsg);

    try {
      setSaving(true);

      const payload: CreateClienteDto = {
        name: form.name.trim(),
        apellido: form.apellido.trim(),
        cedula: form.cedula.trim(),
        email: user?.email || form.email, // ✅ SIEMPRE el del usuario logueado
        celular: form.celular.trim(),
        fecha_nacimiento: form.fecha_nacimiento,
        licencia_conducir: Boolean(form.licencia_conducir),
        ciudad: form.ciudad.trim(),
      };

      let updated: ClienteMe;

      if (!cliente) {
        // ✅ CREA (POST /clientes/me)
        updated = await clientesService.createMe(payload);
        alert("✅ Cliente creado");
      } else {
        // ✅ ACTUALIZA (PUT /clientes/:id) por clientesService.updateMe
        updated = await clientesService.updateMe(payload);
        alert("✅ Perfil actualizado");
      }

      setCliente(updated);
      await load();

      // ✅ si venías desde /reservar, vuelve
      if (next) {
        navigate(next, { replace: true });
      }
    } catch (err: any) {
      console.error(err);
      alert("❌ No se pudo guardar: " + backendMsg(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 pt-4">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-4" style={{ maxWidth: 920 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Mi Perfil</h2>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-dark" onClick={load} disabled={saving}>
            Recargar
          </button>
        </div>
      </div>

      {required && !cliente && (
        <div className="alert alert-warning">
          Para reservar debes <b>crear tu cliente</b> primero.
          {next && (
            <>
              {" "}
              Luego te devolveremos a: <code>{next}</code>
            </>
          )}
        </div>
      )}

      <div className="card mb-3">
        <div className="card-body d-flex justify-content-between">
          <div>
            <div className="fw-semibold">Usuario</div>
            <div className="text-muted">{user?.email ?? "-"}</div>
          </div>
          <div className="text-muted">{cliente ? "Cliente creado" : "Sin cliente creado"}</div>
        </div>
      </div>

      {!cliente && (
        <div className="alert alert-info">
          Aún no tienes cliente creado. Debes guardarlo para poder reservar.
          <div className="mt-2">
            <Link to="/carros" className="btn btn-outline-dark btn-sm">
              Ir a carros
            </Link>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Nombre</label>
              <input
                className="form-control"
                value={form.name}
                onChange={(e) => onChange("name", e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Apellido</label>
              <input
                className="form-control"
                value={form.apellido}
                onChange={(e) => onChange("apellido", e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Cédula</label>
              <input
                className="form-control"
                value={form.cedula}
                onChange={(e) => onChange("cedula", e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Celular</label>
              <input
                className="form-control"
                value={form.celular}
                onChange={(e) => onChange("celular", e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input className="form-control" value={user?.email ?? form.email} readOnly />
              <div className="text-muted small">Se toma del usuario logueado.</div>
            </div>

            <div className="col-md-6">
              <label className="form-label">Fecha nacimiento</label>
              <input
                type="date"
                className="form-control"
                value={form.fecha_nacimiento}
                onChange={(e) => onChange("fecha_nacimiento", e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Ciudad</label>
              <input
                className="form-control"
                value={form.ciudad}
                onChange={(e) => onChange("ciudad", e.target.value)}
              />
            </div>

            <div className="col-md-6 d-flex align-items-center gap-2 pt-4">
              <input
                type="checkbox"
                checked={form.licencia_conducir}
                onChange={(e) => onChange("licencia_conducir", e.target.checked)}
              />
              <span>Tiene licencia</span>
            </div>
          </div>

          <div className="mt-4 d-flex gap-2">
            <button className="btn btn-dark" onClick={guardar} disabled={saving}>
              {saving ? "Guardando..." : cliente ? "Guardar cambios" : "Crear cliente"}
            </button>

            {next && (
              <button
                className="btn btn-outline-dark"
                onClick={() => navigate(next, { replace: true })}
                disabled={saving}
              >
                Volver a reservar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
