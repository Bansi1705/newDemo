import { fireEvent, render, screen } from "@testing-library/react";
import { describe, vi } from "vitest";
import Confirmation from "./Confirmation";

describe("confirmation Model component", () => {
  test("Confirmation Model Renders", () => {
    render(
      <Confirmation
        message="Hello"
        type="delete"
        confirm={vi.fn()}
        cancel={vi.fn()}
      />,
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("When Click on confirm button function called", () => {
    const mockConfirmFunction = vi.fn();

    render(
      <Confirmation
        message="Hello"
        type="delete"
        confirm={mockConfirmFunction}
        cancel={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(mockConfirmFunction).toHaveBeenCalled();
  });

  test("When Click on cancle button for edit function called", () => {
    const mockConfirmFunction = vi.fn();

    render(
      <Confirmation
        message="Hello"
        type="edit"
        cancel={mockConfirmFunction}
        confirm={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "NO" }));
    expect(screen.getByRole("button", { name: "Yes" })).toBeInTheDocument();
    expect(mockConfirmFunction).toHaveBeenCalled();
  });

  test("When type is Logout than button text will Be Logout", () => {
    render(
      <Confirmation
        message="Hello"
        type="Logout"
        cancel={vi.fn()}
        confirm={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
});
