import { mantenimientosService, type Mantenimiento } from "./mantenimientos.service";
import { api } from "./api";
jest.mock("./api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));
describe("mantenimientosService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("getAll retorna lista de mantenimientos", async () => {
    const mockData: Mantenimiento[] = [
      {
        id_mantenimiento: "1",
        id_vehiculo: "veh1",
        fecha_revision: "2024-01-01",
        estado_revision: "pendiente",
        requiere_mantenimiento: true,
      },
    ];
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        data: mockData,
      },
    });
    const result = await mantenimientosService.getAll();
    expect(result).toEqual(mockData);
    expect(api.get).toHaveBeenCalledWith("/mantenimientos", { params: undefined });
  });
  it("getAll recibe params", async () => {
    (api.get as jest.Mock).mockResolvedValue({
      data: { data: [] },
    });
    const params = { estado_revision: "pendiente" };
    await mantenimientosService.getAll(params);
    expect(api.get).toHaveBeenCalledWith("/mantenimientos", { params });
  });
  it("create crea un mantenimiento", async () => {
    const payload = {
      id_vehiculo: "veh1",
      fecha_revision: "2024-01-01",
    };
    const mockResponse: Mantenimiento = {
      id_mantenimiento: "1",
      id_vehiculo: "veh1",
      fecha_revision: "2024-01-01",
      estado_revision: "pendiente",
      requiere_mantenimiento: false,
    };
    (api.post as jest.Mock).mockResolvedValue({
      data: {
        data: mockResponse,
      },
    });
    const result = await mantenimientosService.create(payload);
    expect(result).toEqual(mockResponse);
    expect(api.post).toHaveBeenCalledWith("/mantenimientos", payload);
  });
  it("update actualiza un mantenimiento", async () => {
    const payload = { estado_revision: "aprobado" };
    const mockResponse: Mantenimiento = {
      id_mantenimiento: "1",
      id_vehiculo: "veh1",
      fecha_revision: "2024-01-01",
      estado_revision: "aprobado",
      requiere_mantenimiento: false,
    };
    (api.put as jest.Mock).mockResolvedValue({
      data: {
        data: mockResponse,
      },
    });
    const result = await mantenimientosService.update("1", payload);
    expect(result).toEqual(mockResponse);
    expect(api.put).toHaveBeenCalledWith("/mantenimientos/1", payload);
  });
  it("remove elimina un mantenimiento", async () => {
    (api.delete as jest.Mock).mockResolvedValue({});
    await mantenimientosService.remove("1");
    expect(api.delete).toHaveBeenCalledWith("/mantenimientos/1");
  });
});