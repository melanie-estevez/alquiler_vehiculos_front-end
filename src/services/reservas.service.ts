import { api } from "./api";
import { unwrapSuccess, type SuccessResponse } from "./httpSuccess";

export type Reserva = {
  id_reserva: string;
  fecha_inicio: string;
  fecha_fin: string;
  dias: number;
  estado: string;
  total: number;
  vehiculo?: any;
  cliente?: any;
};

export type Paged<T> = {
  items: T[];
  meta?: any;
  links?: any;
};

export type CreateReservaDto = {
  id_vehiculo: string;
  fecha_inicio: string;
  fecha_fin: string;
  dias: number;
};

export type UpdateReservaDto = Partial<Pick<Reserva, "estado" | "fecha_inicio" | "fecha_fin" | "dias">>;

function pickItems<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (data?.items && Array.isArray(data.items)) return data.items;
  return [];
}

export const reservasService = {
  async getAll(params?: any): Promise<Paged<Reserva>> {
    const res = await api.get<SuccessResponse<any>>("/reservas", { params });
    return unwrapSuccess(res);
  },

  async getMine(params?: any): Promise<Paged<Reserva>> {
    const res = await api.get<SuccessResponse<any>>("/reservas/me", { params });
    return unwrapSuccess(res);
  },

  async getAllItems(params?: any): Promise<Reserva[]> {
    const data = await this.getAll(params);
    return pickItems<Reserva>(data);
  },

  async getMineItems(params?: any): Promise<Reserva[]> {
    const data = await this.getMine(params);
    return pickItems<Reserva>(data);
  },

  async getOne(id: string): Promise<Reserva> {
    const res = await api.get<SuccessResponse<Reserva>>(`/reservas/${id}`);
    return unwrapSuccess(res);
  },

  async create(dto: CreateReservaDto): Promise<Reserva> {
    const res = await api.post<SuccessResponse<Reserva>>("/reservas", dto);
    return unwrapSuccess(res);
  },

  async update(id: string, dto: UpdateReservaDto): Promise<Reserva> {
    const res = await api.put<SuccessResponse<Reserva>>(`/reservas/${id}`, dto);
    return unwrapSuccess(res);
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/reservas/${id}`);
  },
};
