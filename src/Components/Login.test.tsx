import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";
import { vi } from "vitest";

const mockNavigateToHome = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigateToHome,
  };
});

describe("Login Page TestIng", () => {
  test("Login Render", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  });

  test("Empty Field Validation", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(screen.getByText("Email is required!")).toBeInTheDocument();
    expect(screen.getByText("Password is required!")).toBeInTheDocument();
  });

  test("Invalide Email Feild", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const emailInput = screen.getByPlaceholderText(
      "bansi@gmail.com",
    ) as HTMLInputElement;

    fireEvent.change(emailInput, {
      target: {
        name: "email",
        value: "test",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(screen.getByText("Invalid email format")).toBeInTheDocument();
  });

  test("Otp generated", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );
    fireEvent.click(screen.getByText("Generate Otp"));
    const generatedOtp = localStorage.getItem("loginOtp");

    expect(generatedOtp).not.toBeNull();
    expect(generatedOtp?.length).toBe(6);
  });

  test("After login Navigate To home Page", () => {
    localStorage.setItem("loginOtp", "123456");

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("bansi@gmail.com"), {
      target: {
        value: "bansi@gmail.com",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("********"), {
      target: {
        value: "123456",
      },
    });

    fireEvent.change(screen.getByLabelText(/otp/i), {
      target: {
        value: "123456",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /login/i,
      }),
    );

    expect(mockNavigateToHome).toHaveBeenCalledWith("/home");
  });
});
