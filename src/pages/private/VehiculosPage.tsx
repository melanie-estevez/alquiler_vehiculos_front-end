import { useMemo, useState } from "react";
import { useVehiculos } from "../../hooks/useVehiculos";
import VehiculoFormModal from "../../components/vehiculos/VehiculoFormModal";
import { useAuth } from "../../context/AuthContext";
import type { Vehiculo } from "../../services/vehiculos.service";
import { VehiculosService } from "../../services/vehiculos.service";
import { VehiculosCatalog } from "../../components/vehiculos/VehiculosCatalog";

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

  const vehiculos = useMemo(() => {
    const v: any = vehiculosRaw as any;
    if (Array.isArray(v)) return v as Vehiculo[];
    if (v && Array.isArray(v.items)) return v.items as Vehiculo[];
    return [];
  }, [vehiculosRaw]);

  const visibleVehiculos = isAdmin
    ? vehiculos
    : vehiculos.filter((v) => v.estado === "DISPONIBLE");

  const ESTADOS = ["DISPONIBLE", "MANTENIMIENTO", "RENTADO", "BAJA"] as const;

  const toggleEstado = async (vehiculoId: string) => {
    try {
      setUpdatingId(vehiculoId);

      const current = vehiculos.find((x) => x.id_vehiculo === vehiculoId);
      if (!current) {
        alert("Vehículo no encontrado");
        return;
      }

      const idx = ESTADOS.indexOf(current.estado as any);
      const nextEstado = ESTADOS[(idx + 1) % ESTADOS.length];


      const payload: any = {
        estado: nextEstado,
        marca: current.marca,
        modelo: current.modelo,
        placa: current.placa,
        anio: current.anio,
        precio_diario: current.precio_diario,
        id_sucursal:
          (current as any).id_sucursal || current.sucursal?.id_sucursal || undefined,
      };

      await VehiculosService.update(vehiculoId, payload);
      await reload();
    } catch (e) {
      console.error("Error cambiando estado", e);
      alert("No se pudo cambiar el estado");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container py-4">
    
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
        <div>
          <h2 className="mb-1">Catálogo de Vehículos</h2>
          <div className="text-muted">
            {isAdmin
              ? "Admin: gestiona vehículos, estado e imágenes."
              : "Explora los vehículos disponibles para alquilar."}
          </div>
        </div>

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
        <div className="text-muted">Cargando...</div>
      ) : (
        <VehiculosCatalog
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
          onAfterSave={reload}
        />
      )}
    </div>
  );
}
