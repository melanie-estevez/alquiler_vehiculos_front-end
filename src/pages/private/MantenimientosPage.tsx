import { useEffect, useState } from "react";
import { useMantenimientos } from "../../hooks/useMantenimientos";
import { mantenimientosService } from "../../services/mantenimientos.service";
import {
  VehiculosService,
  type Vehiculo,
} from "../../services/vehiculos.service";

export default function MantenimientosPage() {
  const { mantenimientos, loading, refresh } = useMantenimientos();

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [idVehiculo, setIdVehiculo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [saving, setSaving] = useState(false);

  /* 🔹 CARGAR VEHÍCULOS */
  useEffect(() => {
    const loadVehiculos = async () => {
      const data = await VehiculosService.getAll();
      setVehiculos(data);
    };

    loadVehiculos();
  }, []);

  const handleCreate = async () => {
    if (!idVehiculo) {
      alert("Selecciona un vehículo");
      return;
    }

    try {
      setSaving(true);

      await mantenimientosService.create({
        id_vehiculo: idVehiculo,
        descripcion,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      });

      setIdVehiculo("");
      setDescripcion("");
      setFechaInicio("");
      setFechaFin("");
      setShowForm(false);

      refresh ();
    } catch (error) {
      console.error("Error creando mantenimiento", error);
      alert("Error al crear mantenimiento");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mantenimientos</h2>

        <button
          className="btn btn-dark"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancelar" : "Nuevo mantenimiento"}
        </button>
      </div>

      {/* 🔹 FORMULARIO */}
      {showForm && (
        <div className="card border-dark mb-4">
          <div className="card-body">
            <h5 className="mb-3">Registrar mantenimiento</h5>

            {/* SELECT VEHÍCULOS */}
            <div className="mb-2">
              <label className="form-label">Vehículo</label>
              <select
                className="form-select"
                value={idVehiculo}
                onChange={(e) => setIdVehiculo(e.target.value)}
              >
                <option value="">Seleccione un vehículo</option>

                {vehiculos.map((v) => (
                  <option key={v.id_vehiculo} value={v.id_vehiculo}>
                    {v.marca} {v.modelo} - {v.placa}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label className="form-label">Descripción</label>
              <input
                className="form-control"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label">Fecha inicio</label>
                <input
                  type="date"
                  className="form-control"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label">Fecha fin</label>
                <input
                  type="date"
                  className="form-control"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
            </div>

            <button
              className="btn btn-dark mt-3"
              onClick={handleCreate}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      )}

      {/* 🔹 TABLA */}
      {loading && <p>Cargando...</p>}

      {!loading && mantenimientos.length === 0 && (
        <p>No hay mantenimientos registrados</p>
      )}

      {!loading && mantenimientos.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Vehículo</th>
                <th>Placa</th>
                <th>Descripción</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {mantenimientos.map((m) => (
                <tr key={m.id_mantenimiento}>
                  <td>
                    {m.vehiculo.marca} {m.vehiculo.modelo}
                  </td>
                  <td>{m.vehiculo.placa}</td>
                  <td>{m.descripcion}</td>
                  <td>{m.fecha_inicio}</td>
                  <td>{m.fecha_fin}</td>
                  <td>
                    <span className="badge bg-secondary">
                      {m.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
