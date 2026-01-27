import { useState } from "react";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  loading?: boolean;
}

export default function MantenimientoFormModal({
  show,
  onClose,
  onSave,
  loading,
}: Props) {
  const [idVehiculo, setIdVehiculo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  if (!show) return null;

  const handleSubmit = () => {
    onSave({
      id_vehiculo: idVehiculo,
      descripcion,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    });
  };

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog">
          <div className="modal-content border-dark">
            <div className="modal-header">
              <h5 className="modal-title">Nuevo mantenimiento</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <input
                className="form-control mb-2"
                placeholder="ID Vehículo"
                value={idVehiculo}
                onChange={(e) => setIdVehiculo(e.target.value)}
              />

              <input
                className="form-control mb-2"
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />

              <input
                type="date"
                className="form-control mb-2"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />

              <input
                type="date"
                className="form-control"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline-dark" onClick={onClose}>
                Cancelar
              </button>

              <button
                className="btn btn-dark"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" />
    </>
  );
}
