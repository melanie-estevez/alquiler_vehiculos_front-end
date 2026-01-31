
import { api } from "./api";
import { pickItem, pickList } from "./http";

export type Mantenimiento = {
  id_mantenimiento: string;
  id_vehiculo: string;

  fecha_revision: string;
  estado_revision: "pendiente" | "aprobado" | "rechazado";

  requiere_mantenimiento: boolean;

  estado_mantenimiento?: "pendiente" | "en_proceso" | "finalizado";
  fecha_mantenimiento?: string;
  costo?: number;

  observaciones?: string;

  vehiculo?: {
    id_vehiculo: string;
    marca: string;
    modelo: string;
    placa: string;
  };
};

export const mantenimientosService = {
  async getAll(params?: any): Promise<Mantenimiento[]> {
    const res = await api.get("/mantenimientos", { params });
    return pickList<Mantenimiento>(res);
  },

  async create(payload: any): Promise<Mantenimiento> {
    const res = await api.post("/mantenimientos", payload);
    return pickItem<Mantenimiento>(res);
  },

  async update(id_mantenimiento: string, payload: any): Promise<Mantenimiento> {
    const res = await api.put(`/mantenimientos/${id_mantenimiento}`, payload);
    return pickItem<Mantenimiento>(res);
  },

  async remove(id_mantenimiento: string): Promise<void> {
    await api.delete(`/mantenimientos/${id_mantenimiento}`);
  },
};