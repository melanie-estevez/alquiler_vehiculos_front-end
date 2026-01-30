import {SucursalesService,type Sucursal, type CreateSucursalDto, type UpdateSucursalDto,} from "./sucursales.service";
import { api } from "./api";
jest.mock("./api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));
describe("SucursalesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("getAll retorna lista de sucursales", async () => {
    const mockSucursales: Sucursal[] = [
      {
        id_sucursal: "1",
        nombre: "Sucursal Centro",
        ciudad: "Quito",
        direccion: "Av. Principal",
        telefono: "0999999999",
      },
    ];
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        data: mockSucursales,
      },
    });
    const result = await SucursalesService.getAll();
    expect(result).toEqual(mockSucursales);
    expect(api.get).toHaveBeenCalledWith("/sucursales", { params: undefined });
  });
  it("getById obtiene una sucursal", async () => {
    const mockSucursal: Sucursal = {
      id_sucursal: "1",
      nombre: "Sucursal Norte",
      ciudad: "Guayaquil",
      direccion: "Calle 10",
      telefono: "0888888888",
    };
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        data: mockSucursal,
      },
    });
    const result = await SucursalesService.getById("1");
    expect(result).toEqual(mockSucursal);
    expect(api.get).toHaveBeenCalledWith("/sucursales/1");
  });
  it("create crea una sucursal", async () => {
    const dto: CreateSucursalDto = {
      nombre: "Sucursal Sur",
      ciudad: "Cuenca",
      direccion: "Av. Loja",
      telefono: "0777777777",
    };
    const mockSucursal: Sucursal = {
      id_sucursal: "2",
      ...dto,
    };
    (api.post as jest.Mock).mockResolvedValue({
      data: {
        data: mockSucursal,
      },
    });
    const result = await SucursalesService.create(dto);
    expect(result).toEqual(mockSucursal);
    expect(api.post).toHaveBeenCalledWith("/sucursales", dto);
  });
  it("update actualiza una sucursal", async () => {
    const dto: UpdateSucursalDto = {
      telefono: "0666666666",
    };
    const mockSucursal: Sucursal = {
      id_sucursal: "1",
      nombre: "Sucursal Centro",
      ciudad: "Quito",
      direccion: "Av. Principal",
      telefono: "0666666666",
    };
    (api.put as jest.Mock).mockResolvedValue({
      data: {
        data: mockSucursal,
      },
    });
    const result = await SucursalesService.update("1", dto);
    expect(result).toEqual(mockSucursal);
    expect(api.put).toHaveBeenCalledWith("/sucursales/1", dto);
  });
  it("remove elimina una sucursal", async () => {
    (api.delete as jest.Mock).mockResolvedValue({});
    await SucursalesService.remove("1");
    expect(api.delete).toHaveBeenCalledWith("/sucursales/1");
  });
});