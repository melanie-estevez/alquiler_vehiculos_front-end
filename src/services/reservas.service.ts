import { api } from "./api";

export type Reserva = {
  id_reserva: string;
  id_vehiculo: string;
  id_cliente: string;
  fecha_inicio: string;
  dias: number;
  fecha_fin: string;
  estado?: string;
};

export type CreateReservaDto = {
  id_vehiculo: string;
  id_cliente: string;
  fecha_inicio: string;
  dias: number;
  fecha_fin: string;
};

export type UpdateReservaDto = Partial<CreateReservaDto> & { estado?: string };

export const reservasService = {
  getAll: async (params?: any): Promise<Reserva[]> => api.get("/reservas", { params }),
  getById: async (id: string): Promise<Reserva> => api.get(`/reservas/${id}`),
  create: async (dto: CreateReservaDto): Promise<Reserva> => api.post("/reservas", dto),
  update: async (id: string, dto: UpdateReservaDto): Promise<Reserva> =>
    api.put(`/reservas/${id}`, dto),
  remove: async (id: string): Promise<void> => {
    await api.delete(`/reservas/${id}`);
  },
};
