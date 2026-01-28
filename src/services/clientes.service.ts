// src/services/clientes.service.ts
import { api } from "./api";

export type ClienteMe = {
  id_cliente: string;
  name: string;
  apellido: string;
  cedula: string;
  celular: string;
  fecha_nacimiento: string;
  licencia_conducir: boolean;
  ciudad: string;
};

export type ClienteCreateInput = {
  name: string;
  apellido: string;
  cedula: string;
  celular: string;
  fecha_nacimiento: string;
  licencia_conducir: boolean;
  ciudad: string;
};

export const clientesService = {
  async getMe(): Promise<ClienteMe> {
    const { data } = await api.get("/clientes/me");
    return data;
  },

  async createMe(input: ClienteCreateInput): Promise<ClienteMe> {
    const { data } = await api.post("/clientes/me", input);
    return data;
  },
};
