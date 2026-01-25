import { api } from "./api";

export interface Vehiculo {
  id_vehiculo: string;
  marca: string;
  modelo: string;
  anio: number;
  placa: string;
  precio_diario: number;
  estado: string;
  sucursal?: {
    id_sucursal: string;
    nombre: string;
    ciudad: string;
  };
}

export interface CreateVehiculoDto {
  marca: string;
  modelo: string;
  anio: number;
  placa: string;
  precio_diario: number;
  estado?: string;
  id_sucursal: string;
}

export interface UpdateVehiculoDto extends Partial<CreateVehiculoDto> {}

export const VehiculosService = {
  getAll: async (): Promise<Vehiculo[]> => {
    const res = await api.get("/vehiculos");
    return res.data.data.items;
  },

  getById: async (id: string): Promise<Vehiculo> => {
    const res = await api.get(`/vehiculos/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateVehiculoDto): Promise<Vehiculo> => {
    const res = await api.post("/vehiculos", payload);
    return res.data.data;
  },

  update: async (
    id: string,
    payload: UpdateVehiculoDto
  ): Promise<Vehiculo> => {
    const res = await api.put(`/vehiculos/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/vehiculos/${id}`);
  },
};
