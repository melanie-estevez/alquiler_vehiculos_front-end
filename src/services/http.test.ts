import { pickList, pickItem } from "./http";
describe("http utils", () => {
  describe("pickList", () => {
    it("retorna el array si raw ya lo es", () => {
      const raw = [1, 2, 3];
      const result = pickList(raw);
      expect(result).toEqual([1, 2, 3]);
    });
    it("retorna data.data.items", () => {
      const raw = {
        data: {
          data: {
            items: ["a", "b"],
          },
        },
      };
      const result = pickList(raw);
      expect(result).toEqual(["a", "b"]);
    });
    it("retorna data.items", () => {
      const raw = {
        data: {
          items: ["x", "y"],
        },
      };
      const result = pickList(raw);
      expect(result).toEqual(["x", "y"]);
    });
    it("retorna data.data cuando es array", () => {
      const raw = {
        data: {
          data: [10, 20],
        },
      };
      const result = pickList(raw);
      expect(result).toEqual([10, 20]);
    });
    it("retorna data.results", () => {
      const raw = {
        data: {
          results: ["r1", "r2"],
        },
      };
      const result = pickList(raw);
      expect(result).toEqual(["r1", "r2"]);
    });
    it("retorna [] si no encuentra un array", () => {
      const raw = {
        data: {
          data: { foo: "bar" },
        },
      };
      const result = pickList(raw);
      expect(result).toEqual([]);
    });
  });
  describe("pickItem", () => {
    it("retorna data.data si existe", () => {
      const raw = {
        data: {
          data: { id: 1, name: "Juan" },
        },
      };
      const result = pickItem(raw);
      expect(result).toEqual({ id: 1, name: "Juan" });
    });
    it("retorna data si data.data no existe", () => {
      const raw = {
        data: { id: 2, name: "Ana" },
      };
      const result = pickItem(raw);
      expect(result).toEqual({ id: 2, name: "Ana" });
    });
    it("retorna raw si no hay data", () => {
      const raw = { hello: "world" };
      const result = pickItem(raw);
      expect(result).toEqual({ hello: "world" });
    });
  });
});