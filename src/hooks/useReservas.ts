import { useEffect, useState } from "react";
import { reservasService, type Reserva } from "../services/reservas.service";

export function useReservas(params?: { page?: number; limit?: number; search?: string }) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReservas = async () => {
    try {
      setLoading(true);
      const items = await reservasService.getAllItems(params);
      setReservas(items);
    } catch {
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, [params?.page, params?.limit, params?.search]);

  return {
    reservas,
    loading,
    reload: fetchReservas,
  };
}

export function useMisReservas(params?: { page?: number; limit?: number }) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMine = async () => {
    try {
      setLoading(true);
      const items = await reservasService.getMineItems(params);
      setReservas(items);
    } catch {
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMine();
  }, [params?.page, params?.limit]);

  return { reservas, loading, reload: fetchMine };
}
