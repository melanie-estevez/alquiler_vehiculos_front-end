import { useEffect, useState } from "react";
import { mantenimientosService, type Mantenimiento } from "../services/mantenimientos.service";

export function useMantenimientos() {
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMantenimientos = async () => {
    setLoading(true);
    const data = await mantenimientosService.getAll();
    setMantenimientos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMantenimientos();
  }, []);

  return {
    mantenimientos,
    loading,
    refresh: fetchMantenimientos,
  };
}
