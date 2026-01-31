import { useMemo, useState } from "react";
import { useVehiculos } from "../../hooks/useVehiculos";
import { useAuth } from "../../context/AuthContext";
import type { Vehiculo } from "../../services/vehiculos.service";
import { VehiculosService } from "../../services/vehiculos.service";
import VehiculoFormModal from "../../components/vehiculos/VehiculoFormModal";
import { VehiculosCatalog } from "../../components/vehiculos/VehiculosCatalog";

type SortKey = "precio_asc" | "precio_desc" | "anio_desc" | "marca_asc";

export default function CarrosPage() {
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

  const [q, setQ] = useState("");
  const [estado, setEstado] = useState<string>("ALL");
  const [sucursal, setSucursal] = useState<string>("ALL");
  const [sort, setSort] = useState<SortKey>("precio_asc");

  const vehiculos = useMemo(() => {
    const v: any = vehiculosRaw as any;
    if (Array.isArray(v)) return v as Vehiculo[];
    if (v && Array.isArray(v.items)) return v.items as Vehiculo[];
    return [];
  }, [vehiculosRaw]);

  const ESTADOS = ["DISPONIBLE", "MANTENIMIENTO", "RENTADO", "BAJA"] as const;

  const toggleEstado = async (vehiculoId: string) => {
    try {
      setUpdatingId(vehiculoId);

      const current = vehiculos.find((x) => x.id_vehiculo === vehiculoId);
      if (!current) return;

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
      console.error(e);
      alert("No se pudo cambiar el estado");
    } finally {
      setUpdatingId(null);
    }
  };

  const sucursalesOptions = useMemo(() => {
    const map = new Map<string, string>();
    vehiculos.forEach((v) => {
      const id = v.sucursal?.id_sucursal || (v as any).id_sucursal;
      const name = v.sucursal?.nombre;
      if (id && name) map.set(id, name);
    });
    return Array.from(map.entries()).map(([id, nombre]) => ({ id, nombre }));
  }, [vehiculos]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    let list = isAdmin ? vehiculos : vehiculos.filter((v) => v.estado === "DISPONIBLE");

    if (estado !== "ALL") list = list.filter((v) => v.estado === estado);

    if (sucursal !== "ALL") {
      list = list.filter(
        (v) =>
          v.sucursal?.id_sucursal === sucursal || (v as any).id_sucursal === sucursal,
      );
    }

    if (query) {
      list = list.filter((v) => {
        const text = `${v.marca} ${v.modelo} ${v.placa}`.toLowerCase();
        return text.includes(query);
      });
    }

    const sorted = [...list];
    sorted.sort((a, b) => {
      switch (sort) {
        case "precio_asc":
          return (a.precio_diario ?? 0) - (b.precio_diario ?? 0);
        case "precio_desc":
          return (b.precio_diario ?? 0) - (a.precio_diario ?? 0);
        case "anio_desc":
          return (b.anio ?? 0) - (a.anio ?? 0);
        case "marca_asc":
          return `${a.marca} ${a.modelo}`.localeCompare(`${b.marca} ${b.modelo}`);
        default:
          return 0;
      }
    });

    return sorted;
  }, [vehiculos, isAdmin, estado, sucursal, q, sort]);

  const chipStyle: React.CSSProperties = {
    background: "#f8f9fa",
    border: "1px solid #e9ecef",
    color: "#111",
  };

  const inputStyle: React.CSSProperties = {
    borderRadius: 12,
    border: "1px solid #dee2e6",
    background: "#fff",
  };

  return (
    <div
      className="container-fluid px-3 px-md-4 py-4"
      style={{ background: "#f4f5f7" }} // gris neutro, nada azul/verde
    >
      {/* HERO sobrio */}
      <div
        className="rounded-4 p-4 p-md-5 mb-4 border"
        style={{
          background: "#ffffff",
          borderColor: "#e9ecef",
          boxShadow: "0 .5rem 1.25rem rgba(0,0,0,.06)",
        }}
      >
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-4">
          <div style={{ maxWidth: 820 }}>
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill"
              style={{ background: "#111", color: "#fff" }}
            >
              <span className="fw-semibold" style={{ fontSize: 13 }}>
                Catálogo
              </span>
              <span style={{ opacity: 0.85, fontSize: 13 }}>Alquiler de vehículos</span>
            </div>

            <h1 className="mt-3 mb-2 fw-bold" style={{ color: "#111", letterSpacing: -0.6 }}>
              Encuentra tu carro ideal
            </h1>

            <p className="mb-0" style={{ color: "#6c757d", fontSize: 16, lineHeight: 1.6 }}>
              Explora modelos disponibles, compara precios por día y filtra por sucursal.
              {isAdmin
                ? " Como admin, puedes gestionar estado, editar y eliminar."
                : " Solo verás los vehículos disponibles."}
            </p>
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
                + Nuevo vehículo
              </button>

              <button
                className="btn btn-outline-dark btn-lg rounded-3"
                onClick={reload}
              >
                Refrescar
              </button>
            </div>
          )}
        </div>

        {/* TOOLBAR (filtros) */}
        <div className="mt-4">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-lg-5">
              <label className="form-label fw-semibold" style={{ color: "#111" }}>
                Buscar
              </label>
              <input
                className="form-control form-control-lg"
                style={inputStyle}
                placeholder="Marca, modelo o placa…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-2">
              <label className="form-label fw-semibold" style={{ color: "#111" }}>
                Estado
              </label>
              <select
                className="form-select form-select-lg"
                style={inputStyle}
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="ALL">Todos</option>
                <option value="DISPONIBLE">DISPONIBLE</option>
                <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                <option value="RENTADO">RENTADO</option>
                <option value="BAJA">BAJA</option>
              </select>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label fw-semibold" style={{ color: "#111" }}>
                Sucursal
              </label>
              <select
                className="form-select form-select-lg"
                style={inputStyle}
                value={sucursal}
                onChange={(e) => setSucursal(e.target.value)}
              >
                <option value="ALL">Todas</option>
                {sucursalesOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-lg-2">
              <label className="form-label fw-semibold" style={{ color: "#111" }}>
                Ordenar
              </label>
              <select
                className="form-select form-select-lg"
                style={inputStyle}
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
              >
                <option value="precio_asc">Precio ↑</option>
                <option value="precio_desc">Precio ↓</option>
                <option value="anio_desc">Año ↓</option>
                <option value="marca_asc">Marca A–Z</option>
              </select>
            </div>
          </div>

          {/* chips sobrios */}
          <div className="d-flex flex-wrap gap-2 mt-3">
            <span className="badge rounded-pill px-3 py-2" style={chipStyle}>
              Mostrando <span className="fw-semibold">{filtered.length}</span> vehículos
            </span>

            {q.trim() && (
              <button
                className="btn btn-sm btn-outline-secondary rounded-pill"
                onClick={() => setQ("")}
              >
                Limpiar búsqueda
              </button>
            )}

            {(estado !== "ALL" || sucursal !== "ALL") && (
              <button
                className="btn btn-sm btn-outline-secondary rounded-pill"
                onClick={() => {
                  setEstado("ALL");
                  setSucursal("ALL");
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      
      {loading ? (
        <div className="text-muted">Cargando…</div>
      ) : (
        <VehiculosCatalog
          vehiculos={filtered}
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
