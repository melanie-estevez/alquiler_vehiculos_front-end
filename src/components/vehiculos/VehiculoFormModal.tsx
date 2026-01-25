import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
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
  onCreate: (data: CreateVehiculoDto) => void;
  onUpdate: (id: string, data: UpdateVehiculoDto) => void;
}

export function VehiculoFormModal({
  show,
  onClose,
  vehiculo,
  onCreate,
  onUpdate,
}: Props) {
  const { sucursales } = useSucursales();

  const [form, setForm] = useState<CreateVehiculoDto>({
    marca: "",
    modelo: "",
    anio: new Date().getFullYear(),
    placa: "",
    precio_diario: 0,
    id_sucursal: "",
  });

  useEffect(() => {
    if (vehiculo) {
      setForm({
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        anio: vehiculo.anio,
        placa: vehiculo.placa,
        precio_diario: vehiculo.precio_diario,
        id_sucursal: vehiculo.sucursal?.id_sucursal || "",
      });
    }
  }, [vehiculo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (vehiculo) {
      onUpdate(vehiculo.id_vehiculo, form);
    } else {
      onCreate(form);
    }
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {vehiculo ? "Editar vehículo" : "Nuevo vehículo"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-2">
          <input
            className="form-control"
            name="marca"
            placeholder="Marca"
            value={form.marca}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <input
            className="form-control"
            name="modelo"
            placeholder="Modelo"
            value={form.modelo}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <input
            className="form-control"
            type="number"
            name="anio"
            placeholder="Año"
            value={form.anio}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <input
            className="form-control"
            name="placa"
            placeholder="Placa"
            value={form.placa}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <input
            className="form-control"
            type="number"
            name="precio_diario"
            placeholder="Precio diario"
            value={form.precio_diario}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <select
            className="form-select"
            name="id_sucursal"
            value={form.id_sucursal}
            onChange={handleChange}
          >
            <option value="">Seleccione sucursal</option>
            {sucursales.map((s) => (
              <option key={s.id_sucursal} value={s.id_sucursal}>
                {s.nombre} - {s.ciudad}
              </option>
            ))}
          </select>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
