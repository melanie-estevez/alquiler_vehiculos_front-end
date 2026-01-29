import { useEffect, useMemo, useState } from "react";
import { useMantenimientos } from "../../hooks/useMantenimientos";
import { mantenimientosService, type Mantenimiento } from "../../services/mantenimientos.service";
import { VehiculosService, type Vehiculo } from "../../services/vehiculos.service";

type EstadoRevision = "" | "pendiente" | "aprobado" | "rechazado";
type EstadoMantenimiento = "" | "pendiente" | "en_proceso" | "finalizado";

export default function MantenimientosPage() {
  const { mantenimientos, loading, refresh } = useMantenimientos();

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [showForm, setShowForm] = useState(false);

  // ✅ MODO EDICIÓN
  const [editing, setEditing] = useState<Mantenimiento | null>(null);

  const [idVehiculo, setIdVehiculo] = useState("");
  const [fechaRevision, setFechaRevision] = useState("");
  const [estadoRevision, setEstadoRevision] = useState<EstadoRevision>("");
  const [requiereMantenimiento, setRequiereMantenimiento] = useState(false);
  const [estadoMantenimiento, setEstadoMantenimiento] = useState<EstadoMantenimiento>("");
  const [fechaMantenimiento, setFechaMantenimiento] = useState("");
  const [costo, setCosto] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadVehiculos = async () => {
      try {
        const data: any = await VehiculosService.getAll();
        const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
        setVehiculos(list);
      } catch (e) {
        console.error(e);
        setVehiculos([]);
      }
    };
    loadVehiculos();
  }, []);

  const vehiculosList = useMemo(() => (Array.isArray(vehiculos) ? vehiculos : []), [vehiculos]);

  const resetForm = () => {
    setEditing(null);
    setIdVehiculo("");
    setFechaRevision("");
    setEstadoRevision("");
    setRequiereMantenimiento(false);
    setEstadoMantenimiento("");
    setFechaMantenimiento("");
    setCosto("");
    setObservaciones("");
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (m: Mantenimiento) => {
    setEditing(m);

    setIdVehiculo(m.id_vehiculo || m.vehiculo?.id_vehiculo || "");
    setFechaRevision(m.fecha_revision || "");
    setEstadoRevision((m.estado_revision as EstadoRevision) || "");
    setRequiereMantenimiento(Boolean(m.requiere_mantenimiento));
    setEstadoMantenimiento((m.estado_mantenimiento as EstadoMantenimiento) || "");
    setFechaMantenimiento(m.fecha_mantenimiento || "");
    setCosto(m.costo != null ? String(m.costo) : "");
    setObservaciones(m.observaciones || "");

    setShowForm(true);
  };

  const buildPayload = () => {
    const payload: any = {
      id_vehiculo: idVehiculo,
      fecha_revision: fechaRevision,
      estado_revision: estadoRevision,
      requiere_mantenimiento: requiereMantenimiento,
      observaciones: observaciones.trim() || undefined,
    };

    if (requiereMantenimiento) {
      payload.estado_mantenimiento = estadoMantenimiento || "pendiente";
      payload.fecha_mantenimiento = fechaMantenimiento || undefined;
      payload.costo = costo ? Number(costo) : 0;
    }

    return payload;
  };

  const handleSave = async () => {
    if (!idVehiculo) return alert("Selecciona un vehículo");
    if (!fechaRevision) return alert("Ingresa fecha de revisión");
    if (!estadoRevision) return alert("Selecciona estado de revisión");

    try {
      setSaving(true);

      const payload = buildPayload();

      if (editing) {
        await mantenimientosService.update(editing.id_mantenimiento, payload);
        alert("✅ Mantenimiento actualizado");
      } else {
        await mantenimientosService.create(payload);
        alert("✅ Mantenimiento creado");
      }

      setShowForm(false);
      resetForm();
      refresh();
    } catch (error) {
      console.error("Error guardando mantenimiento", error);
      alert("Error al guardar mantenimiento");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = confirm("¿Seguro que quieres eliminar este mantenimiento?");
    if (!ok) return;

    try {
      await mantenimientosService.remove(id);
      refresh();
    } catch (error) {
      console.error("Error eliminando mantenimiento", error);
      alert("No se pudo eliminar el mantenimiento");
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mantenimientos</h2>

        <button className="btn btn-dark" onClick={() => (showForm ? (setShowForm(false), resetForm()) : openCreate())}>
          {showForm ? "Cancelar" : "Nuevo mantenimiento"}
        </button>
      </div>

      {showForm && (
        <div className="card border-dark mb-4">
          <div className="card-body">
            <h5 className="mb-3">{editing ? "Editar mantenimiento" : "Registrar mantenimiento"}</h5>

            <div className="mb-2">
              <label className="form-label">Vehículo</label>
              <select className="form-select" value={idVehiculo} onChange={(e) => setIdVehiculo(e.target.value)}>
                <option value="">Seleccione un vehículo</option>
                {vehiculosList.map((v) => (
                  <option key={v.id_vehiculo} value={v.id_vehiculo}>
                    {v.marca} {v.modelo} - {v.placa}
                  </option>
                ))}
              </select>
            </div>

            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label">Fecha revisión</label>
                <input type="date" className="form-control" value={fechaRevision} onChange={(e) => setFechaRevision(e.target.value)} />
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label">Estado revisión</label>
                <select className="form-select" value={estadoRevision} onChange={(e) => setEstadoRevision(e.target.value as EstadoRevision)}>
                  <option value="">Seleccione</option>
                  <option value="pendiente">pendiente</option>
                  <option value="aprobado">aprobado</option>
                  <option value="rechazado">rechazado</option>
                </select>
              </div>
            </div>

            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                checked={requiereMantenimiento}
                onChange={(e) => setRequiereMantenimiento(e.target.checked)}
                id="reqMant"
              />
              <label className="form-check-label" htmlFor="reqMant">
                Requiere mantenimiento
              </label>
            </div>

            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label">Fecha mantenimiento</label>
                <input
                  type="date"
                  className="form-control"
                  value={fechaMantenimiento}
                  onChange={(e) => setFechaMantenimiento(e.target.value)}
                  disabled={!requiereMantenimiento}
                />
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label">Costo</label>
                <input
                  type="number"
                  className="form-control"
                  value={costo}
                  onChange={(e) => setCosto(e.target.value)}
                  placeholder="0"
                  disabled={!requiereMantenimiento}
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label">Estado mantenimiento</label>
              <select
                className="form-select"
                value={estadoMantenimiento}
                onChange={(e) => setEstadoMantenimiento(e.target.value as EstadoMantenimiento)}
                disabled={!requiereMantenimiento}
              >
                <option value="">(auto) pendiente</option>
                <option value="pendiente">pendiente</option>
                <option value="en_proceso">en_proceso</option>
                <option value="finalizado">finalizado</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="form-label">Observaciones</label>
              <textarea className="form-control" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={3} />
            </div>

            <button className="btn btn-dark mt-3" onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : editing ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </div>
      )}

      {loading && <p>Cargando...</p>}

      {!loading && mantenimientos.length === 0 && <p>No hay mantenimientos registrados</p>}

      {!loading && mantenimientos.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Vehículo</th>
                <th>Placa</th>
                <th>Fecha revisión</th>
                <th>Estado revisión</th>
                <th>Requiere</th>
                <th>Observaciones</th>
                <th style={{ width: 180 }}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {mantenimientos.map((m: any) => (
                <tr key={m.id_mantenimiento}>
                  <td>{m.vehiculo?.marca} {m.vehiculo?.modelo}</td>
                  <td>{m.vehiculo?.placa}</td>
                  <td>{m.fecha_revision}</td>
                  <td>{m.estado_revision}</td>
                  <td>
                    <span className={`badge ${m.requiere_mantenimiento ? "bg-danger" : "bg-success"}`}>
                      {m.requiere_mantenimiento ? "Sí" : "No"}
                    </span>
                  </td>
                  <td>{m.observaciones ?? "-"}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-secondary" onClick={() => openEdit(m)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(m.id_mantenimiento)}>
                        Eliminar
                      </button>
                    </div>
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
