// src/hooks/useMantenimientos.ts
import { useEffect, useState } from "react";
import { mantenimientosService, type Mantenimiento } from "../services/mantenimientos.service";

export function useMantenimientos() {
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMantenimientos = async () => {
    try {
      setLoading(true);
      const data = await mantenimientosService.getAll();
      setMantenimientos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setMantenimientos([]);
    } finally {
      setLoading(false);
    }
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