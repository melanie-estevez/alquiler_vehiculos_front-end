import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clientesService } from "../../services/clientes.service";

export default function ClienteCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const next = searchParams.get("next"); 

  const [formData, setFormData] = useState({
    name: "",
    apellido: "",
    cedula: "",
    celular: "",
    fecha_nacimiento: "",
    licencia_conducir: false,
    ciudad: "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      await clientesService.createMe(formData);
      alert(" Cliente creado");


      if (next) navigate(next, { replace: true });
      else navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Error al crear cliente");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <h2 className="text-center mb-4">Crear Cliente</h2>

      <form onSubmit={handleSubmit} className="shadow p-4 bg-light rounded">
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mt-3">
          <label>Apellido:</label>
          <input
            type="text"
            name="apellido"
            className="form-control"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mt-3">
          <label>Cédula:</label>
          <input
            type="text"
            name="cedula"
            className="form-control"
            value={formData.cedula}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mt-3">
          <label>Celular:</label>
          <input
            type="text"
            name="celular"
            className="form-control"
            value={formData.celular}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mt-3">
          <label>Fecha de Nacimiento:</label>
          <input
            type="date"
            name="fecha_nacimiento"
            className="form-control"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-check mt-3">
          <input
            type="checkbox"
            name="licencia_conducir"
            className="form-check-input"
            checked={formData.licencia_conducir}
            onChange={handleChange}
          />
          <label className="form-check-label">Licencia de conducir</label>
        </div>

        <div className="form-group mt-3">
          <label>Ciudad:</label>
          <input
            type="text"
            name="ciudad"
            className="form-control"
            value={formData.ciudad}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-dark w-100 mt-4" disabled={saving}>
          {saving ? "Guardando..." : "Guardar Cliente"}
        </button>
      </form>
    </div>
  );
}