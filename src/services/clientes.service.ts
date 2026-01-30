import { api } from "./api";

export type ClienteMe = {
  id: string;
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
  email: string;
  celular: string;
  fecha_nacimiento: string;
  licencia_conducir: boolean;
  ciudad: string;
};

type SuccessResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

let cacheMe: ClienteMe | null | undefined = undefined;

function normalizeCliente(raw: any): ClienteMe {
  const id = raw?.id ?? raw?.id_cliente ?? raw?.idCliente;
  return {
    id: String(id),
    name: raw?.name ?? "",
    apellido: raw?.apellido ?? "",
    cedula: raw?.cedula ?? "",
    email: raw?.email ?? "",
    celular: raw?.celular ?? "",
    fecha_nacimiento: raw?.fecha_nacimiento ?? "",
    licencia_conducir: Boolean(raw?.licencia_conducir),
    ciudad: raw?.ciudad ?? "",
  };
}

export const clientesService = {
  clearCache() {
    cacheMe = undefined;
  },

  async getCliente(force = false): Promise<ClienteMe | null> {
    if (!force && cacheMe !== undefined) return cacheMe;

    try {
      const res = await api.get<SuccessResponse<any>>("/clientes/me");
      cacheMe = normalizeCliente(res.data.data);
      return cacheMe;
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        cacheMe = null;
        return null;
      }
      throw err;
    }
  },

  async createMe(dto: CreateClienteDto): Promise<ClienteMe> {
    const res = await api.post<SuccessResponse<any>>("/clientes/me", dto);
    cacheMe = normalizeCliente(res.data.data);
    return cacheMe;
  },

  async updateMe(dto: Partial<CreateClienteDto>): Promise<ClienteMe> {
    const me = await this.getCliente(true);
    if (!me?.id) throw new Error("No existe cliente para actualizar. Primero crea el cliente.");

    const res = await api.put<SuccessResponse<any>>(`/clientes/${me.id}`, dto);
    cacheMe = normalizeCliente(res.data.data);
    return cacheMe;
  },

  async getOne(id: string): Promise<ClienteMe> {
    const res = await api.get<SuccessResponse<any>>(`/clientes/${id}`);
    return normalizeCliente(res.data.data);
  },
};