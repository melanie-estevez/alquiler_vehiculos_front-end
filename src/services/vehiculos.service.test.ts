import {VehiculosService, type Vehiculo, type CreateVehiculoDto, type UpdateVehiculoDto,} from "./vehiculos.service";
import { api } from "./api";
jest.mock("./api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));
describe("VehiculosService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("getAll retorna lista de vehículos", async () => {
    const mockVehiculos: Vehiculo[] = [
      {
        id_vehiculo: "1",
        marca: "Toyota",
        modelo: "Corolla",
        anio: 2022,
        placa: "ABC-123",
        precio_diario: 45,
        estado: "DISPONIBLE",
      },
    ];
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        data: mockVehiculos,
      },
    });
    const result = await VehiculosService.getAll();
    expect(result).toEqual(mockVehiculos);
    expect(api.get).toHaveBeenCalledWith("/vehiculos", { params: undefined });
  });
  it("getById retorna un vehículo", async () => {
    const mockVehiculo: Vehiculo = {
      id_vehiculo: "1",
      marca: "Kia",
      modelo: "Rio",
      anio: 2021,
      placa: "XYZ-999",
      precio_diario: 40,
      estado: "RENTADO",
      sucursal: {
        id_sucursal: "10",
        nombre: "Sucursal Norte",
        ciudad: "Quito",
      },
    };
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        data: mockVehiculo,
      },
    });
    const result = await VehiculosService.getById("1");
    expect(result).toEqual(mockVehiculo);
    expect(api.get).toHaveBeenCalledWith("/vehiculos/1");
  });
  it("create crea un vehículo", async () => {
    const dto: CreateVehiculoDto = {
      marca: "Hyundai",
      modelo: "Accent",
      anio: 2023,
      placa: "NEW-555",
      precio_diario: 50,
      id_sucursal: "2",
    };
    const mockVehiculo: Vehiculo = {
      id_vehiculo: "2",
      estado: "DISPONIBLE",
      ...dto,
    };
    (api.post as jest.Mock).mockResolvedValue({
      data: {
        data: mockVehiculo,
      },
    });
    const result = await VehiculosService.create(dto);
    expect(result).toEqual(mockVehiculo);
    expect(api.post).toHaveBeenCalledWith("/vehiculos", dto);
  });
  it("update actualiza un vehículo", async () => {
    const dto: UpdateVehiculoDto = {
      estado: "MANTENIMIENTO",
    };
    const mockVehiculo: Vehiculo = {
      id_vehiculo: "1",
      marca: "Toyota",
      modelo: "Yaris",
      anio: 2020,
      placa: "AAA-111",
      precio_diario: 38,
      estado: "MANTENIMIENTO",
    };
    (api.put as jest.Mock).mockResolvedValue({
      data: {
        data: mockVehiculo,
      },
    });
    const result = await VehiculosService.update("1", dto);
    expect(result).toEqual(mockVehiculo);
    expect(api.put).toHaveBeenCalledWith("/vehiculos/1", dto);
  });
  it("remove elimina un vehículo", async () => {
    (api.delete as jest.Mock).mockResolvedValue({});
    await VehiculosService.remove("1");
    expect(api.delete).toHaveBeenCalledWith("/vehiculos/1");
  });
});