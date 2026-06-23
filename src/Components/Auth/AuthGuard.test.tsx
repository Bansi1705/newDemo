import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, beforeEach } from "vitest";
import { AuthGuard } from "./AuthGuard";

describe("AuthGuard", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test("renders children when user is authenticated", () => {
    sessionStorage.setItem("LoginUser", "test-user");

    render(
      <MemoryRouter>
        <AuthGuard>
          <div>Dashboard</div>
        </AuthGuard>
      </MemoryRouter>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("redirects when route is protected and user is not authenticated", () => {
    render(
      <MemoryRouter>
        <AuthGuard>
          <div>Dashboard</div>
        </AuthGuard>
      </MemoryRouter>,
    );

    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  test("Authenticated user redirected to home page", () => {
    sessionStorage.setItem("LoginUser", "test-user");

    render(
      <MemoryRouter>
        <AuthGuard required={false}>
          <div>Login Page</div>
        </AuthGuard>
      </MemoryRouter>,
    );

    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });
});
