import { describe, test, expect } from "vitest";
import { Routing } from "./Routing";

describe("Routing", () => {
  test("should contain login route", () => {
    const route = Routing.routes.find((r) => r.path === "/");
    expect(route).toBeDefined();
  });

  test("should contain home route", () => {
    const route = Routing.routes.find((r) => r.path === "/home");
    expect(route).toBeDefined();
  });

  test("should contain edit user route", () => {
    const route = Routing.routes.find((r) => r.path === "/edit-user/:id");
    expect(route).toBeDefined();
  });

  test("should contain incident report route", () => {
    const route = Routing.routes.find((r) => r.path === "/incidentReport");
    expect(route).toBeDefined();
  });
});
