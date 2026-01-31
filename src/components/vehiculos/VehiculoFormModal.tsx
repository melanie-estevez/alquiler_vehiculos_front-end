
import { useEffect, useMemo, useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import {
  type CreateVehiculoDto,
  type UpdateVehiculoDto,
  type Vehiculo,
} from "../../services/vehiculos.service";
import { useSucursales } from "../../hooks/useSucursales";

interface Props {
  show: boolean;
  onClose: () => void;
  vehiculo: Vehiculo | null;
  onCreate: (data: CreateVehiculoDto) => Promise<void>;
  onUpdate: (id: string, data: UpdateVehiculoDto) => Promise<void>;
}

export default function VehiculoFormModal({ show, onClose, vehiculo, onCreate, onUpdate }: Props) {
  const { sucursales } = useSucursales();

  const listSucursales = useMemo(() => (Array.isArray(sucursales) ? sucursales : []), [sucursales]);

  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    anio: "",
    placa: "",
    precio_diario: "",
    id_sucursal: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (vehiculo) {
      setForm({
        marca: vehiculo.marca ?? "",
        modelo: vehiculo.modelo ?? "",
        anio: String(vehiculo.anio ?? ""),
        placa: vehiculo.placa ?? "",
        precio_diario: String(vehiculo.precio_diario ?? ""),
        id_sucursal: vehiculo.sucursal?.id_sucursal || (vehiculo as any).id_sucursal || "",
      });
    } else {
      setForm({
        marca: "",
        modelo: "",
        anio: "",
        placa: "",
        precio_diario: "",
        id_sucursal: "",
      });
    }
    setError(null);
  }, [vehiculo, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      setError(null);
      setSaving(true);

      const payload: CreateVehiculoDto = {
        marca: form.marca.trim(),
        modelo: form.modelo.trim(),
        placa: form.placa.trim(),
        anio: Number(form.anio),
        precio_diario: Number(form.precio_diario),
        id_sucursal: form.id_sucursal ? form.id_sucursal : undefined,
      };

      if (!payload.marca || !payload.modelo || !payload.placa || isNaN(payload.anio) || isNaN(payload.precio_diario)) {
        setError("Completa todos los campos correctamente");
        return;
      }

      if (vehiculo) {

        const update: UpdateVehiculoDto = { ...payload };
        await onUpdate(vehiculo.id_vehiculo, update);
      } else {
        await onCreate(payload);
      }

      onClose();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el vehículo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{vehiculo ? "Editar vehículo" : "Nuevo vehículo"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <input className="form-control mb-2" name="marca" placeholder="Marca" value={form.marca} onChange={handleChange} />
        <input className="form-control mb-2" name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleChange} />
        <input className="form-control mb-2" type="number" name="anio" placeholder="Año" value={form.anio} onChange={handleChange} />
        <input className="form-control mb-2" name="placa" placeholder="Placa" value={form.placa} onChange={handleChange} />
        <input className="form-control mb-2" type="number" name="precio_diario" placeholder="Precio diario" value={form.precio_diario} onChange={handleChange} />

        <select className="form-select" name="id_sucursal" value={form.id_sucursal} onChange={handleChange}>
          <option value="">Sin sucursal</option>
          {listSucursales.map((s) => (
            <option key={s.id_sucursal} value={s.id_sucursal}>
              {s.nombre} - {s.ciudad}
            </option>
          ))}
        </select>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="dark" onClick={handleSubmit} disabled={saving}>
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}