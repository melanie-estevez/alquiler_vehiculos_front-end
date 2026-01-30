import { api } from "./api";
import { pickItem, pickList } from "./http";

export type Sucursal = {
  id_sucursal: string;
  nombre: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  imagen_url?: string | null;
};

export type CreateSucursalDto = {
  nombre: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  imagen_url?: string | null;
};

export type UpdateSucursalDto = Partial<CreateSucursalDto>;

export const SucursalesService = {
  async getAll(params?: any): Promise<Sucursal[]> {
    const res = await api.get("/sucursales", { params });
    return pickList<Sucursal>(res);
  },

  async getById(id: string): Promise<Sucursal> {
    const res = await api.get(`/sucursales/${id}`);
    return pickItem<Sucursal>(res);
  },

  async create(payload: CreateSucursalDto): Promise<Sucursal> {
    const res = await api.post("/sucursales", payload);
    return pickItem<Sucursal>(res);
  },

  async update(id: string, payload: UpdateSucursalDto): Promise<Sucursal> {
    const res = await api.put(`/sucursales/${id}`, payload);
    return pickItem<Sucursal>(res);
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/sucursales/${id}`);
  },
};