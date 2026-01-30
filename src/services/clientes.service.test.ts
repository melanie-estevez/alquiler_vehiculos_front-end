import { clientesService } from "./clientes.service";
import { api } from "./api";

jest.mock("./api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe("clientesService", () => {
  it("debe obtener el cliente", async () => {
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        id_cliente: "1",
        name: "Juan",
        apellido: "Perez",
        cedula: "123",
        email: "test@test.com",
        celular: "099999999",
        fecha_nacimiento: "2000-01-01",
        licencia_conducir: true,
        ciudad: "Quito",
      },
    });
    const res = await clientesService.getCliente();
    expect(res).not.toBeNull();
    expect(res?.name).toBe("Juan");
  });
  it("debe crear un cliente", async () => {
    (api.post as jest.Mock).mockResolvedValue({
      data: {
        id_cliente: "1",
        name: "Juan",
      },
    });
    const res = await clientesService.create({
      name: "Juan",
      apellido: "Perez",
      cedula: "123",
      email: "test@test.com",
      celular: "099",
      fecha_nacimiento: "2000-01-01",
      licencia_conducir: true,
      ciudad: "Quito",
    });
    expect(res.name).toBe("Juan");
  });
});