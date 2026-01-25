import { useEffect, useState } from "react";
import {
  VehiculosService,
  type Vehiculo,
  type CreateVehiculoDto,
  type UpdateVehiculoDto,
} from "../services/vehiculos.service";

export function useVehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVehiculos = async () => {
    setLoading(true);
    const data = await VehiculosService.getAll();
    setVehiculos(data);
    setLoading(false);
  };

  const createVehiculo = async (payload: CreateVehiculoDto) => {
    await VehiculosService.create(payload);
    fetchVehiculos();
  };

  const updateVehiculo = async (
    id: string,
    payload: UpdateVehiculoDto
  ) => {
    await VehiculosService.update(id, payload);
    fetchVehiculos();
  };

  const deleteVehiculo = async (id: string) => {
    await VehiculosService.remove(id);
    fetchVehiculos();
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);

  return {
    vehiculos,
    loading,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo,
  };
}
