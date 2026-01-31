
import { api } from "./api";
import { pickItem, pickList } from "./http";

export type HistorialUsuario = {
  id_historial_usuario?: string;
  id_usuario: string;
  id_reserva: string;
  accion: string;
  fecha: string; 
};

export type CreateHistorialUsuarioDto = {
  id_usuario: string;
  id_reserva: string;
  accion: string;
  fecha: string;
};

export const historialUsuarioService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    searchField?: string;
  }): Promise<HistorialUsuario[]> {
    const res = await api.get("/historial_usuario", { params });
    return pickList<HistorialUsuario>(res);
  },

  async getByReserva(id_reserva: string): Promise<HistorialUsuario[]> {
    const res = await api.get(`/historial_usuario/reserva/${id_reserva}`);
    return pickList<HistorialUsuario>(res);
  },

  async create(dto: CreateHistorialUsuarioDto): Promise<HistorialUsuario> {
    const res = await api.post("/historial_usuario", dto);
    return pickItem<HistorialUsuario>(res);
  },
};