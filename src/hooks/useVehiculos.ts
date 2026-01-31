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
    try {
      const data: any = await VehiculosService.getAll();

      const list = Array.isArray(data)
        ? (data as Vehiculo[])
        : Array.isArray(data?.items)
        ? (data.items as Vehiculo[])
        : [];

      setVehiculos(list);
    } catch (e) {
      console.error("Error cargando vehículos", e);
      setVehiculos([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ AHORA DEVUELVE EL VEHICULO CREADO
  const createVehiculo = async (
    payload: CreateVehiculoDto,
  ): Promise<Vehiculo> => {
    const created = await VehiculosService.create(payload);
    await fetchVehiculos();
    return created;
  };

  // ✅ AHORA DEVUELVE EL VEHICULO ACTUALIZADO
  const updateVehiculo = async (
    id: string,
    payload: UpdateVehiculoDto,
  ): Promise<Vehiculo> => {
    const updated = await VehiculosService.update(id, payload);
    await fetchVehiculos();
    return updated;
  };

  const deleteVehiculo = async (id: string) => {
    await VehiculosService.remove(id);
    await fetchVehiculos();
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
    reload: fetchVehiculos,
  };
}
