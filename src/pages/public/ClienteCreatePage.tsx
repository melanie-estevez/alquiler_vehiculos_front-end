import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ClienteCreatePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    apellido: "",
    cedula: "",
    celular: "",
    fecha_nacimiento: "",
    licencia_conducir: false,
    ciudad: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/api/clientes/me", { ...formData });
      alert("Cliente creado exitosamente");
      navigate("/reservas");  
    } catch (error) {
      alert("Error al crear cliente");
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Crear Cliente</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 bg-light rounded">
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            className="form-control"
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
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mt-3">
          <label>Licencia de conducir:</label>
          <input
            type="checkbox"
            name="licencia_conducir"
            className="form-check-input"
            onChange={(e) => setFormData({ ...formData, licencia_conducir: e.target.checked })}
          />
        </div>
        <div className="form-group mt-3">
          <label>Ciudad:</label>
          <input
            type="text"
            name="ciudad"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-4">
          Guardar Cliente
        </button>
      </form>
    </div>
  );
};

export default ClienteCreatePage;
