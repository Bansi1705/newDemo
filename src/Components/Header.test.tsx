import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import Header from "./Header";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockToggleTheme = vi.fn();

vi.mock("../Context/ThemeContext", () => ({
  useTheme: () => ({
    theme: "light",
    toggleTheme: mockToggleTheme,
  }),
}));

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

    fireEvent.click(screen.getByTestId("theme-testing"));
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  test("when click on logout user navigate to login", () => {
    renderHome();

    fireEvent.click(screen.getByText("LogOut"));
    fireEvent.click(screen.getByText("Logout"));

    expect(sessionStorage.removeItem("LoginUser"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("while passing showSearchInput true it show a serch bar", () => {
    render(
      <MemoryRouter>
        <Header
          searchTerm={""}
          setSearchTerm={vi.fn()}
          showSearchInput={true}
        />
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText("Search....")).toBeInTheDocument();
  });

  test("navigate to home tab", () => {
    renderHome();
    fireEvent.click(screen.getByRole("tab", { name: "Home" }));
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });
});
