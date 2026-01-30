import { reservasService, type Reserva, type CreateReservaDto, type UpdateReservaDto } from "./reservas.service";
import { api } from "./api";
jest.mock("./api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));
describe("reservasService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("getAll llama al endpoint con params", async () => {
    const mockReservas: Reserva[] = [
      {
        id_reserva: "1",
        id_vehiculo: "veh1",
        id_cliente: "cli1",
        fecha_inicio: "2024-01-01",
        dias: 3,
        fecha_fin: "2024-01-04",
        estado: "activa",
      },
    ];
    (api.get as jest.Mock).mockResolvedValue(mockReservas);
    const params = { estado: "activa" };
    const result = await reservasService.getAll(params);
    expect(result).toEqual(mockReservas);
    expect(api.get).toHaveBeenCalledWith("/reservas", { params });
  });
  it("getById obtiene una reserva por id", async () => {
    const mockReserva: Reserva = {
      id_reserva: "1",
      id_vehiculo: "veh1",
      id_cliente: "cli1",
      fecha_inicio: "2024-01-01",
      dias: 3,
      fecha_fin: "2024-01-04",
    };
    (api.get as jest.Mock).mockResolvedValue(mockReserva);
    const result = await reservasService.getById("1");
    expect(result).toEqual(mockReserva);
    expect(api.get).toHaveBeenCalledWith("/reservas/1");
  });
  it("create crea una reserva", async () => {
    const dto: CreateReservaDto = {
      id_vehiculo: "veh1",
      id_cliente: "cli1",
      fecha_inicio: "2024-01-01",
      dias: 3,
      fecha_fin: "2024-01-04",
    };
    const mockReserva: Reserva = {
      id_reserva: "1",
      ...dto,
    };
    (api.post as jest.Mock).mockResolvedValue(mockReserva);
    const result = await reservasService.create(dto);
    expect(result).toEqual(mockReserva);
    expect(api.post).toHaveBeenCalledWith("/reservas", dto);
  });
  it("update actualiza una reserva", async () => {
    const dto: UpdateReservaDto = {
      dias: 5,
      estado: "modificada",
    };
    const mockReserva: Reserva = {
      id_reserva: "1",
      id_vehiculo: "veh1",
      id_cliente: "cli1",
      fecha_inicio: "2024-01-01",
      dias: 5,
      fecha_fin: "2024-01-06",
      estado: "modificada",
    };
    (api.put as jest.Mock).mockResolvedValue(mockReserva);
    const result = await reservasService.update("1", dto);
    expect(result).toEqual(mockReserva);
    expect(api.put).toHaveBeenCalledWith("/reservas/1", dto);
  });
  it("remove elimina una reserva", async () => {
    (api.delete as jest.Mock).mockResolvedValue({});
    await reservasService.remove("1");
    expect(api.delete).toHaveBeenCalledWith("/reservas/1");
  });
});