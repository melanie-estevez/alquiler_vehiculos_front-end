import { useMemo, useState } from "react";
import { useVehiculos } from "../../hooks/useVehiculos";
import { VehiculosTable } from "../../components/vehiculos/VehiculosTable";
import VehiculoFormModal from "../../components/vehiculos/VehiculoFormModal";
import { useAuth } from "../../context/AuthContext";
import type { Vehiculo } from "../../services/vehiculos.service";
import { VehiculosService } from "../../services/vehiculos.service";

export default function VehiculosPage() {
  const {
    vehiculos: vehiculosRaw,
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

  // ✅ BLINDAJE: vehiculos puede venir como array o como {items:[]}
  const vehiculos = useMemo(() => {
    const v: any = vehiculosRaw as any;
    if (Array.isArray(v)) return v as Vehiculo[];
    if (v && Array.isArray(v.items)) return v.items as Vehiculo[];
    return [];
  }, [vehiculosRaw]);

  // ✅ USER solo ve DISPONIBLE
  const visibleVehiculos = isAdmin
    ? vehiculos
    : vehiculos.filter((v) => v.estado === "DISPONIBLE");

  // ✅ FIX: ahora recibimos SOLO el ID para evitar “cascada”
  const toggleEstado = async (vehiculoId: string) => {
    try {
      setUpdatingId(vehiculoId);

      const current = vehiculos.find((x) => x.id_vehiculo === vehiculoId);
      if (!current) {
        alert("Vehículo no encontrado");
        return;
      }

      const nextEstado =
        current.estado === "DISPONIBLE"
          ? "MANTENIMIENTO"
          : current.estado === "MANTENIMIENTO"
          ? "RENTADO"
          : "DISPONIBLE";

      // ✅ Backend exige precio_diario aunque solo cambies estado
      await VehiculosService.update(vehiculoId, {
        estado: nextEstado,
        precio_diario: current.precio_diario,
      } as any);

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
          vehiculos={visibleVehiculos} // ✅ ya es array seguro
          isAdmin={isAdmin}
          updatingId={updatingId}
          onToggleEstado={isAdmin ? toggleEstado : undefined} // ✅ ahora por ID
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
