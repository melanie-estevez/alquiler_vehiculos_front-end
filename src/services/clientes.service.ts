// src/services/clientes.service.ts
import { api } from "./api";
import { pickItem } from "./http";

export type ClienteMe = {
  id_cliente: string;
  name: string;
  apellido: string;
  cedula: string;
  email: string;
  celular: string;
  fecha_nacimiento: string;
  licencia_conducir: boolean;
  ciudad: string;
};

export type CreateClienteDto = {
  name: string;
  apellido: string;
  cedula: string;
  email: string; // ✅ requerido
  celular: string;
  fecha_nacimiento: string;
  licencia_conducir: boolean;
  ciudad: string;
};

export const clientesService = {
  async getCliente(): Promise<ClienteMe | null> {
    try {
      const res = await api.get("/clientes/me");
      return pickItem<ClienteMe>(res);
    } catch (err: any) {
      if (err?.response?.status === 404) return null; // normal si no existe aún
      throw err;
    }
  },

  async create(payload: CreateClienteDto): Promise<ClienteMe> {
    const res = await api.post("/clientes/me", payload); // ✅ FIX ENDPOINT
    return pickItem<ClienteMe>(res);
  },
};
