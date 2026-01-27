export interface Vehiculo {
  id_vehiculo: string;
  marca: string;
  modelo: string;
  placa: string;
  precio_dia: number;
  estado: "DISPONIBLE" | "RESERVADO" | "MANTENIMIENTO";
}

export interface Mantenimiento {
  id_mantenimiento: string;
  id_vehiculo: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
}
