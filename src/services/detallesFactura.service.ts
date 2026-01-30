// src/services/detallesFactura.service.ts
import { api } from "./api";
import { pickList, pickItem } from "./http";

export type DetalleFactura = {
  id_detalle: string;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  total: number;
  factura?: { id_factura: string };
};

export type CreateDetalleFacturaDto = {
  id_factura: string;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
};

export const detallesFacturaService = {
  async getAll(params?: { page?: number; limit?: number; search?: string }) {
    const res = await api.get("/detallesfactura", { params });
    return pickList<DetalleFactura>(res);
  },

  // ✅ Como el backend no tiene /factura/:id, filtramos con search (sirve porque busca por factura.id_factura)
  async getByFactura(id_factura: string) {
    const res = await api.get("/detallesfactura", {
      params: { page: 1, limit: 100, search: id_factura },
    });
    return pickList<DetalleFactura>(res);
  },

  async getOne(id_detalle: string) {
    const res = await api.get(`/detallesfactura/${id_detalle}`);
    return pickItem<DetalleFactura>(res);
  },

  async create(dto: CreateDetalleFacturaDto) {
    const res = await api.post("/detallesfactura", dto);
    return pickItem<DetalleFactura>(res);
  },
};
