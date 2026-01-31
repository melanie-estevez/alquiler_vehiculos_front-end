import { api } from "./api";
import { pickItem, pickList } from "./http";

export type Pago = {
  id_pago: string;
  monto: number;
  metodo: string;
  estado: string;
  fecha_pago: string;
  factura?: { id_factura: string };
  reserva?: { id_reserva: string };
};

export type CreatePagoDto = {
  id_factura: string;
  metodo: string;
};

export const pagosService = {
  async getAll(): Promise<Pago[]> {
    const res = await api.get("/pagos");
    return pickList<Pago>(res);
  },

  async getOne(id_pago: string): Promise<Pago> {
    const res = await api.get(`/pagos/${id_pago}`);
    return pickItem<Pago>(res);
  },

  async create(dto: CreatePagoDto): Promise<Pago> {
    const res = await api.post("/pagos", {
      id_factura: dto.id_factura,
      metodo: dto.metodo,
    });
    return pickItem<Pago>(res);
  },
};
