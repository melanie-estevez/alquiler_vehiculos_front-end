import { api } from './api';

export const reservasService = {
  getAll: (params?: any) =>
    api.get('/reservas', { params }),

  getById: (id: string) =>
    api.get(`/reservas/${id}`),

  create: (data: {
    id_vehiculo: string;
    id_cliente: string;  
    fecha_inicio: string;
    dias: number;
    fecha_fin: string;
  }) =>
    api.post('/reservas', data),  

  update: (id: string, data: any) =>
    api.put(`/reservas/${id}`, data),

  remove: (id: string) =>
    api.delete(`/reservas/${id}`),
};
