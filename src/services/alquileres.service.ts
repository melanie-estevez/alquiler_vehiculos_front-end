// src/services/alquileres.service.ts
import { api } from "./api";
import { pickItem, pickList } from "./http";

export type Alquiler = {
  id_alquiler: string;
  id_reserva: string;

  fecha_entrega: string;     // ISO date string
  fecha_devolucion: string;  // ISO date string

  km_inicial: string; // tu back lo maneja como string numérico
  km_final: string;

  estado: string; // "ENTREGADO" / "FINALIZADO" o lo que uses
};

export type CreateAlquilerDto = {
  id_reserva: string;
  fecha_entrega: string;
  fecha_devolucion: string;
  km_inicial: string;
  km_final: string;
  estado: string;
};

export type UpdateAlquilerDto = Partial<CreateAlquilerDto>;

export const alquileresService = {
  async getAll(params?: { page?: number; limit?: number; search?: string; searchField?: string }): Promise<Alquiler[]> {
    const res = await api.get("/alquiler", { params });
    return pickList<Alquiler>(res);
  },

  async getById(id_alquiler: string): Promise<Alquiler> {
    const res = await api.get(`/alquiler/${id_alquiler}`);
    return pickItem<Alquiler>(res);
  },

  // ✅ si NO existe endpoint /alquiler/reserva/:id entonces filtramos con query
  async getByReserva(id_reserva: string): Promise<Alquiler | null> {
    const res = await api.get("/alquiler", {
      params: { search: id_reserva, searchField: "id_reserva", limit: 50, page: 1 },
    });
    const list = pickList<Alquiler>(res);
    return list.find((a) => a.id_reserva === id_reserva) ?? null;
  },

  async create(dto: CreateAlquilerDto): Promise<Alquiler> {
    const res = await api.post("/alquiler", dto);
    return pickItem<Alquiler>(res);
  },

  async update(id_alquiler: string, dto: UpdateAlquilerDto): Promise<Alquiler> {
    const res = await api.put(`/alquiler/${id_alquiler}`, dto);
    return pickItem<Alquiler>(res);
  },
};