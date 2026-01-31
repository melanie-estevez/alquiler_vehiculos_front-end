import { useState } from "react";
import { useSucursales } from "../../hooks/useSucursales";
import { SucursalesTable } from "../../components/sucursales/SucursalesTable";
import { SucursalFormModal } from "../../components/sucursales/SucursalFormModal";
import { useAuth } from "../../context/AuthContext";
import type { Sucursal } from "../../services/sucursales.service";

export default function SucursalesPage() {
  const { sucursales, loading, createSucursal, updateSucursal, deleteSucursal } =
    useSucursales();

  const { isAdmin } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Sucursal | null>(null);

  return (
    <div className="container my-5">
      <div className="page-head mb-4">
        <div>
          <h2 className="page-title m-0">Sucursales</h2>

        </div>

        {isAdmin && (
          <button
            className="btn btn-dark btn-elegant"
            onClick={() => {
              setSelected(null);
              setShowModal(true);
            }}
          >
            + Nueva sucursal
          </button>
        )}
      </div>

      <div className="content-card">
        {loading ? (
          <div className="loading-wrap">
            <div className="spinner-border text-dark" role="status" />
            <span className="ms-3 text-muted">Cargando sucursales...</span>
          </div>
        ) : (
          <SucursalesTable
            sucursales={sucursales}
            onEdit={
              isAdmin
                ? (s) => {
                    setSelected(s);
                    setShowModal(true);
                  }
                : undefined
            }
            onDelete={isAdmin ? deleteSucursal : undefined}
          />
        )}
      </div>


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