import { useMemo, useState } from "react";
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

  const total = useMemo(
    () => (Array.isArray(sucursales) ? sucursales.length : 0),
    [sucursales],
  );

  return (
    <div
      className="container-fluid px-3 px-md-4 py-4"
      style={{ background: "#f4f5f7" }}
    >
  
      <div
        className="rounded-4 p-4 p-md-5 mb-4 border"
        style={{
          background: "#ffffff",
          borderColor: "#e9ecef",
          boxShadow: "0 .5rem 1.25rem rgba(0,0,0,.06)",
        }}
      >
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-4">
          <div style={{ maxWidth: 900 }}>
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill"
              style={{ background: "#111", color: "#fff" }}
            >
              <span className="fw-semibold" style={{ fontSize: 13 }}>
                Sucursales
              </span>
              <span style={{ opacity: 0.85, fontSize: 13 }}>
                Gestión y ubicación
              </span>
            </div>

            <h1
              className="mt-3 mb-2 fw-bold"
              style={{ color: "#111", letterSpacing: -0.6 }}
            >
              Administración de sucursales
            </h1>

            <p
              className="mb-0"
              style={{ color: "#6c757d", fontSize: 16, lineHeight: 1.6 }}
            >
              {isAdmin
                ? "Crea, edita y elimina sucursales para organizar vehículos por ciudad y sede."
                : "Consulta las sucursales disponibles."}
            </p>

            <div className="d-flex flex-wrap gap-2 mt-3">
              <span
                className="badge rounded-pill px-3 py-2"
                style={{
                  background: "#f8f9fa",
                  border: "1px solid #e9ecef",
                  color: "#111",
                }}
              >
                Total: <span className="fw-semibold">{total}</span>
              </span>
            </div>
          </div>

          {isAdmin && (
            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn btn-dark btn-lg rounded-3"
                onClick={() => {
                  setSelected(null);
                  setShowModal(true);
                }}
              >
                + Nueva sucursal
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className="rounded-4 border p-3 p-md-4"
        style={{
          background: "#ffffff",
          borderColor: "#e9ecef",
          boxShadow: "0 .25rem .75rem rgba(0,0,0,.06)",
        }}
      >
        {loading ? (
          <div
            className="d-flex align-items-center justify-content-center py-5"
            style={{ minHeight: 220 }}
          >
            <div className="spinner-border text-dark" role="status" />
            <span className="ms-3 text-muted">Cargando sucursales…</span>
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
