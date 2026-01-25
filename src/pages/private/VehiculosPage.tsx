import { useState } from "react";
import { useVehiculos } from "../../hooks/useVehiculos";
import { VehiculosTable } from "../../components/vehiculos/VehiculosTable";
import { VehiculoFormModal } from "../../components/vehiculos/VehiculoFormModal";
import { type Vehiculo } from "../../services/vehiculos.service";

export default function VehiculosPage() {
  const {
    vehiculos,
    loading,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo,
  } = useVehiculos();

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Vehiculo | null>(null);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Vehículos</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelected(null);
            setShowModal(true);
          }}
        >
          + Nuevo vehículo
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <VehiculosTable
          vehiculos={vehiculos}
          onEdit={(v) => {
            setSelected(v);
            setShowModal(true);
          }}
          onDelete={deleteVehiculo}
        />
      )}

      <VehiculoFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        vehiculo={selected}
        onCreate={createVehiculo}
        onUpdate={updateVehiculo}
      />
    </div>
  );
}
