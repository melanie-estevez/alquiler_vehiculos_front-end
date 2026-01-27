import { useState } from "react";
import { useVehiculos } from "../../hooks/useVehiculos";
import { VehiculosTable } from "../../components/vehiculos/VehiculosTable";
import { VehiculoFormModal } from "../../components/vehiculos/VehiculoFormModal";
import { useAuth } from "../../context/AuthContext";
import { type Vehiculo, VehiculosService } from "../../services/vehiculos.service";

export default function VehiculosPage() {
  const {
    vehiculos,
    loading,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo,
    reload,
  } = useVehiculos();

  const { isAdmin } = useAuth();

  const [selected, setSelected] = useState<Vehiculo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ✅ USER solo ve DISPONIBLE
  const visibleVehiculos = isAdmin
    ? vehiculos
    : vehiculos.filter((v) => v.estado === "DISPONIBLE");

  const toggleEstado = async (vehiculo: Vehiculo) => {
    try {
      setUpdatingId(vehiculo.id_vehiculo);

      const nextEstado =
        vehiculo.estado === "DISPONIBLE"
          ? "MANTENIMIENTO"
          : vehiculo.estado === "MANTENIMIENTO"
          ? "RENTADO"
          : "DISPONIBLE";

      // ✅ NO existe updateEstado, usamos update normal
      await VehiculosService.update(vehiculo.id_vehiculo, { estado: nextEstado });

      await reload();
    } catch (e) {
      console.error("Error cambiando estado", e);
      alert("No se pudo cambiar el estado");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Vehículos</h2>

        {isAdmin && (
          <button
            className="btn btn-dark"
            onClick={() => {
              setSelected(null);
              setShowModal(true);
            }}
          >
            + Nuevo vehículo
          </button>
        )}
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <VehiculosTable
          vehiculos={visibleVehiculos}
          isAdmin={isAdmin}
          updatingId={updatingId}
          onToggleEstado={isAdmin ? toggleEstado : undefined}
          onEdit={
            isAdmin
              ? (v) => {
                  setSelected(v);
                  setShowModal(true);
                }
              : undefined
          }
          onDelete={isAdmin ? deleteVehiculo : undefined}
        />
      )}

      {isAdmin && (
        <VehiculoFormModal
          show={showModal}
          onClose={() => setShowModal(false)}
          vehiculo={selected}
          onCreate={createVehiculo}
          onUpdate={updateVehiculo}
        />
      )}
    </div>
  );
}
