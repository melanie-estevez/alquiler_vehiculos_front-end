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

  const inputStyle: React.CSSProperties = {
    borderRadius: 12,
    border: "1px solid #dee2e6",
    background: "#fff",
  };

  const load = async () => {
    try {
      setLoading(true);
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
      alert("Error cargando perfil: " + backendMsg(err));
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
        email: user?.email || form.email,
        celular: form.celular.trim(),
        fecha_nacimiento: form.fecha_nacimiento,
        licencia_conducir: Boolean(form.licencia_conducir),
        ciudad: form.ciudad.trim(),
      };

      let updated: ClienteMe;

      if (!cliente) {
        updated = await clientesService.createMe(payload);
        alert("Cliente creado");
      } else {
        updated = await clientesService.updateMe(payload);
        alert("Perfil actualizado");
      }

      setCliente(updated);
      await load();

      if (next) navigate(next, { replace: true });
    } catch (err: any) {
      console.error(err);
      alert("No se pudo guardar: " + backendMsg(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid px-3 px-md-4 py-4" style={{ background: "#f4f5f7" }}>
        <div className="rounded-4 border bg-white p-4" style={{ boxShadow: "0 .25rem .75rem rgba(0,0,0,.06)" }}>
          <div className="d-flex align-items-center justify-content-center py-5">
            <div className="spinner-border text-dark" role="status" />
            <span className="ms-3 text-muted">Cargando perfil…</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 px-md-4 py-4" style={{ background: "#f4f5f7" }}>
      {/* HERO */}
      <div
        className="rounded-4 p-4 p-md-5 mb-4 border"
        style={{
          background: "#fff",
          borderColor: "#e9ecef",
          boxShadow: "0 .5rem 1.25rem rgba(0,0,0,.06)",
        }}
      >
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-3">
          <div style={{ maxWidth: 920 }}>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill" style={{ background: "#111", color: "#fff" }}>
              <span className="fw-semibold" style={{ fontSize: 13 }}>Perfil</span>
              <span style={{ opacity: .85, fontSize: 13 }}>Datos del cliente</span>
            </div>

            <h1 className="mt-3 mb-2 fw-bold" style={{ color: "#111", letterSpacing: -0.6 }}>
              Mi perfil
            </h1>

            <p className="mb-0" style={{ color: "#6c757d", fontSize: 16 }}>
              Mantén tus datos actualizados para poder reservar sin problemas.
            </p>
          </div>

          <button className="btn btn-outline-dark btn-lg rounded-3" onClick={load} disabled={saving}>
            Recargar
          </button>
        </div>
      </div>

      {required && !cliente && (
        <div className="container-fluid px-0 mb-3">
          <div className="alert alert-warning rounded-4 border">
            Para reservar debes <b>crear tu cliente</b> primero.
            {next && (
              <>
                {" "}Luego te devolveremos a: <code>{next}</code>
              </>
            )}
          </div>
        </div>
      )}

      <div className="row g-4">
        {/* card usuario */}
        <div className="col-12 col-lg-4">
          <div className="rounded-4 border bg-white p-4 h-100" style={{ boxShadow: "0 .25rem .75rem rgba(0,0,0,.06)" }}>
            <div className="fw-bold text-dark mb-1">Usuario</div>
            <div className="text-muted">{user?.email ?? "-"}</div>

            <hr />

            <div className="d-flex justify-content-between">
              <span className="text-muted">Estado</span>
              <span className="fw-semibold">{cliente ? "Cliente creado" : "Sin cliente"}</span>
            </div>

            {!cliente && (
              <div className="mt-3 alert alert-info rounded-4 mb-0">
                Aún no tienes cliente creado. Debes guardarlo para poder reservar.
                <div className="mt-2">
                  <Link to="/carros" className="btn btn-outline-dark btn-sm rounded-3">
                    Ir a carros
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* form */}
        <div className="col-12 col-lg-8">
          <div className="rounded-4 border bg-white p-4" style={{ boxShadow: "0 .25rem .75rem rgba(0,0,0,.06)" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="m-0 fw-bold text-dark">Datos</h4>
              <span className="text-muted small">Campos obligatorios para reservar</span>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Nombre</label>
                <input className="form-control" style={inputStyle} value={form.name} onChange={(e) => onChange("name", e.target.value)} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Apellido</label>
                <input className="form-control" style={inputStyle} value={form.apellido} onChange={(e) => onChange("apellido", e.target.value)} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Cédula</label>
                <input className="form-control" style={inputStyle} value={form.cedula} onChange={(e) => onChange("cedula", e.target.value)} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Celular</label>
                <input className="form-control" style={inputStyle} value={form.celular} onChange={(e) => onChange("celular", e.target.value)} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Email</label>
                <input className="form-control" style={{ ...inputStyle, background: "#f8f9fa" }} value={user?.email ?? form.email} readOnly />
                <div className="text-muted small">Se toma del usuario logueado.</div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Fecha nacimiento</label>
                <input type="date" className="form-control" style={inputStyle} value={form.fecha_nacimiento} onChange={(e) => onChange("fecha_nacimiento", e.target.value)} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Ciudad</label>
                <input className="form-control" style={inputStyle} value={form.ciudad} onChange={(e) => onChange("ciudad", e.target.value)} />
              </div>

              <div className="col-md-6 d-flex align-items-center gap-2 pt-4">
                <input type="checkbox" className="form-check-input" checked={form.licencia_conducir} onChange={(e) => onChange("licencia_conducir", e.target.checked)} />
                <span className="text-dark">Tiene licencia</span>
              </div>
            </div>

            <div className="mt-4 d-flex gap-2 flex-wrap">
              <button className="btn btn-dark btn-lg rounded-3" onClick={guardar} disabled={saving}>
                {saving ? "Guardando..." : cliente ? "Guardar cambios" : "Crear cliente"}
              </button>

              {next && (
                <button className="btn btn-outline-dark btn-lg rounded-3" onClick={() => navigate(next, { replace: true })} disabled={saving}>
                  Volver a reservar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
