import { api } from "./api";
import { pickItem, pickList } from "./http";

export type Vehiculo = {
  id_vehiculo: string;
  marca: string;
  modelo: string;
  anio: number;
  placa: string;
  precio_diario: number;
  estado: "DISPONIBLE" | "MANTENIMIENTO" | "RENTADO";
  sucursal?: {
    id_sucursal: string;
    nombre: string;
    ciudad: string;
  } | null;

  id_sucursal?: string | null;
  imagen_url?: string | null;
};

export type CreateVehiculoDto = {
  marca: string;
  modelo: string;
  anio: number;
  placa: string;
  precio_diario: number;
  id_sucursal?: string;
  imagen_url?: string | null;
};

export type UpdateVehiculoDto = Partial<CreateVehiculoDto> & {
  estado?: Vehiculo["estado"];
};

export const VehiculosService = {
  async getAll(params?: any): Promise<Vehiculo[]> {
    const res = await api.get("/vehiculos", { params });
    return pickList<Vehiculo>(res);
  },

  async getById(id: string): Promise<Vehiculo> {
    const res = await api.get(`/vehiculos/${id}`);
    return pickItem<Vehiculo>(res);
  },

  async create(payload: CreateVehiculoDto): Promise<Vehiculo> {
    const res = await api.post("/vehiculos", payload);
    return pickItem<Vehiculo>(res);
  },

  async update(id: string, payload: UpdateVehiculoDto): Promise<Vehiculo> {
    const res = await api.put(`/vehiculos/${id}`, payload);
    return pickItem<Vehiculo>(res);
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/vehiculos/${id}`);
  },
};