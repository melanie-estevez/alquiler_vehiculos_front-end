import { api } from "./api";

export interface Sucursal {
  id_sucursal: string;
  nombre: string;
  ciudad: string;
  direccion: string;
  telefono: string;
}

export interface CreateSucursalDto {
  nombre: string;
  ciudad: string;
  direccion: string;
  telefono: string;
}

export interface UpdateSucursalDto {
  nombre?: string;
  ciudad?: string;
  direccion?: string;
  telefono?: string;
}

export const SucursalesService = {
  getAll: async (): Promise<Sucursal[]> => {
    const res = await api.get("/sucursales");
    return res.data.data.items;
  },

  getById: async (id: string): Promise<Sucursal> => {
    const res = await api.get(`/sucursales/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateSucursalDto): Promise<Sucursal> => {
    const res = await api.post("/sucursales", payload);
    return res.data.data;
  },

  update: async (
    id: string,
    payload: UpdateSucursalDto
  ): Promise<Sucursal> => {
    const res = await api.put(`/sucursales/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/sucursales/${id}`);
  },
};
