import { useEffect, useState } from "react";
import {
  SucursalesService,
  type Sucursal,
  type CreateSucursalDto,
  type UpdateSucursalDto,
} from "../services/sucursales.service";

export function useSucursales() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSucursales = async () => {
    setLoading(true);
    try {
      const items = await SucursalesService.getAll();
      setSucursales(items);
    } finally {
      setLoading(false);
    }
  };

  const createSucursal = async (payload: CreateSucursalDto) => {
    await SucursalesService.create(payload);
    fetchSucursales();
  };

  const updateSucursal = async (
    id_sucursal: string,
    payload: UpdateSucursalDto
  ) => {
    await SucursalesService.update(id_sucursal, payload);
    fetchSucursales();
  };

  const deleteSucursal = async (id_sucursal: string) => {
    await SucursalesService.remove(id_sucursal);
    fetchSucursales();
  };

  useEffect(() => {
    fetchSucursales();
  }, []);

  return {
    sucursales,
    loading,
    createSucursal,
    updateSucursal,
    deleteSucursal,
  };
}
