import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import Header from "./Header";
import { MemoryRouter } from "react-router-dom";

const mockNavigateToLogin = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigateToLogin,
  };
});

const renderHome = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );

describe("Header Component", () => {
  test("Header renders", () => {
    renderHome();

    expect(
      screen.getByRole("heading", { name: /userdetail/i }),
    ).toBeInTheDocument();
  });

  test("theme toggle renders", () => {
    renderHome();

    const toggleIcon = screen.getByTestId("theme-testing");
    fireEvent.click(toggleIcon);
    expect(localStorage.setItem("theme", "dark"));
    fireEvent.click(toggleIcon);
    expect(localStorage.setItem("theme", "light"));
  });

  test("when click on logout user navigate to login", () => {
    renderHome();

    fireEvent.click(screen.getByText("LogOut"));
    fireEvent.click(screen.getByText("Logout"));

    expect(mockNavigateToLogin).toHaveBeenCalled();
  });
});
