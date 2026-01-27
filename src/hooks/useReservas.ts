import { useEffect, useState } from "react";
import { reservasService } from "../services/reservas.service";

export interface Reserva {
  id_reserva: string;
  fecha_inicio: string;
  fecha_fin: string;
  dias: number;
  estado: "pendiente" | "confirmado" | "cancelado";
  vehiculo: {
    id_vehiculo: string;
    marca: string;
    modelo: string;
    placa: string;
  };
}

export function useReservas(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReservas = async () => {
    try {
      setLoading(true);

      const res = await reservasService.getAll(params);

      // 📌 Tu backend responde:
      // data.data.items
      setReservas(res.data.data.items);
    } catch (error) {
      console.error("Error cargando reservas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  return {
    reservas,
    loading,
    reload: fetchReservas, 
  };
}
