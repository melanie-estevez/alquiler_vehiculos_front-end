import { api } from "./api";

export interface Mantenimiento {
  id_mantenimiento: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  vehiculo: {
    id_vehiculo: string;
    marca: string;
    modelo: string;
    placa: string;
  };
}

export interface CreateMantenimientoDto {
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  id_vehiculo: string;
}

export const mantenimientosService = {
  getAll: async () => {
    const res = await api.get("/mantenimientos");
    return res.data.data.items;
  },

  create: async (payload: CreateMantenimientoDto) => {
    const res = await api.post("/mantenimientos", payload);
    return res.data.data;
  },

  update: async (id: string, payload: Partial<CreateMantenimientoDto>) => {
    const res = await api.put(`/mantenimientos/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: string) => {
    await api.delete(`/mantenimientos/${id}`);
  },
};
