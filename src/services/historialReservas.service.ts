
import { api } from "./api";
import { pickItem, pickList } from "./http";

export type HistorialReserva = {
  id_historial?: string;
  id_reserva: string;
  estado_anterior: string;
  estado_nuevo: string;
  fecha: string; 
};

export type CreateHistorialReservaDto = {
  id_reserva: string;
  estado_anterior: string;
  estado_nuevo: string;
  fecha: string;
};

export const historialReservasService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    searchField?: string;
  }): Promise<HistorialReserva[]> {
    const res = await api.get("/historial", { params });
    return pickList<HistorialReserva>(res);
  },

  async create(dto: CreateHistorialReservaDto): Promise<HistorialReserva> {
    const res = await api.post("/historial", dto);
    return pickItem<HistorialReserva>(res);
  },
};