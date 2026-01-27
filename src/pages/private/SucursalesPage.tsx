import { useState } from "react";
import { useSucursales } from "../../hooks/useSucursales";
import { SucursalesTable } from "../../components/sucursales/SucursalesTable";
import { SucursalFormModal } from "../../components/sucursales/SucursalFormModal";
import { useAuth } from "../../context/AuthContext";
import { type Sucursal } from "../../services/sucursales.service";

export default function SucursalesPage() {
  const {
    sucursales,
    loading,
    createSucursal,
    updateSucursal,
    deleteSucursal,
  } = useSucursales();

  const { isAdmin } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Sucursal | null>(null);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Sucursales</h2>

        {isAdmin && (
          <button
            className="btn btn-dark"
            onClick={() => {
              setSelected(null);
              setShowModal(true);
            }}
          >
            + Nueva sucursal
          </button>
        )}
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <SucursalesTable
          sucursales={sucursales}
          onEdit={isAdmin ? (s) => {
            setSelected(s);
            setShowModal(true);
          } : undefined}
          onDelete={isAdmin ? deleteSucursal : undefined}
        />
      )}

      {isAdmin && (
        <SucursalFormModal
          show={showModal}
          onClose={() => setShowModal(false)}
          sucursal={selected}
          onCreate={createSucursal}
          onUpdate={updateSucursal}
        />
      )}
    </div>
  );
}
