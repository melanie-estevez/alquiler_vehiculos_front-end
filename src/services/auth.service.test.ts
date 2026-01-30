import {saveToken,getToken,clearToken,loginApi,registerApi,} from "./auth.service";
import { api } from "./api";

jest.mock("./api", () => ({
  api: {
    post: jest.fn(),
  },
}));
describe("auth.service", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });
  it("saveToken guarda token", () => {
    saveToken("abc");
    expect(getToken()).toBe("abc");
  });
  it("clearToken elimina token", () => {
    saveToken("abc");
    clearToken();
    expect(getToken()).toBeNull();
  });
  it("loginApi guarda y retorna token", async () => {
    (api.post as jest.Mock).mockResolvedValue({
      data: {
        data: { access_token: "token123" },
      },
    });
    const token = await loginApi({
      email: "test@test.com",
      password: "123",
    });
    expect(token).toBe("token123");
    expect(getToken()).toBe("token123");
    expect(api.post).toHaveBeenCalledWith("/auth/login", {
      email: "test@test.com",
      password: "123",
    });
  });
  it("registerApi hace login si register no devuelve token", async () => {
    (api.post as jest.Mock)
      .mockResolvedValueOnce({
        data: { data: {} },
      })
      .mockResolvedValueOnce({
        data: {
          data: { access_token: "login-token" },
        },
      });
    const token = await registerApi({
      email: "new@test.com",
      password: "123",
    });
    expect(token).toBe("login-token");
    expect(getToken()).toBe("login-token");
    expect(api.post).toHaveBeenNthCalledWith(1,"/auth/register",expect.any(Object));
    expect(api.post).toHaveBeenNthCalledWith(2,"/auth/login",expect.any(Object));
  });
  it("registerApi guarda token si backend lo devuelve", async () => {
    (api.post as jest.Mock).mockResolvedValue({
      data: {
        data: { access_token: "register-token" },
      },
    });
    const token = await registerApi({
      email: "new@test.com",
      password: "123",
    });
    expect(token).toBe("register-token");
    expect(getToken()).toBe("register-token");
  });
});