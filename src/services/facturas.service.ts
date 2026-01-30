import { api } from "./api";
import { pickItem } from "./http";

export type EstadoFactura = "Pagado" | "Pendiente" | "Anulado";

export type DetalleFactura = {
  id_detalle: string;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  total: number;
};

export type Pago = {
  id_pago: string;
  metodo: string;
  monto: number;
  estado: string;
  fecha_pago: string;
};

export type Factura = {
  id_factura: string;
  fecha_emision: string;
  estado: EstadoFactura;
  subtotal: number;
  iva: number;
  total: number;
  reserva?: any;
  cliente?: any;
  detalles?: DetalleFactura[];
  pagos?: Pago[];
};

export const facturasService = {
  async getAll(params?: { page?: number; limit?: number; search?: string }): Promise<any> {
    const res = await api.get("/facturas", { params });
    return pickItem<any>(res);
  },

  async getOne(id_factura: string): Promise<Factura> {
    const res = await api.get(`/facturas/${id_factura}`);
    return pickItem<Factura>(res);
  },

  async getByReserva(idReserva: string): Promise<Factura> {
    const res = await api.get(`/facturas/reserva/${idReserva}`);
    return pickItem<Factura>(res);
  },
};
