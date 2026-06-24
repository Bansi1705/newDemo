import { fireEvent, render, screen } from "@testing-library/react";
import { describe, vi } from "vitest";
import Confirmation, { type confirmationProps } from "./Confirmation";

const mockConfirmFunction = vi.fn();
const mockconfirmCancelFunction = vi.fn();
const mockConfirmationProps: confirmationProps = {
  message: "Hello",
  confirm: mockConfirmFunction,
  cancel: mockconfirmCancelFunction,
  type: "delete",
};

describe("confirmation Model component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("When type changes button label changes", () => {
    const { rerender } = render(
      <Confirmation {...mockConfirmationProps} type="Logout" />,
    );
    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();

    rerender(<Confirmation {...mockConfirmationProps} type="edit" />);
    expect(screen.getByRole("button", { name: "Yes" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "No" })).toBeInTheDocument();
  });

  test("Confirmation Model handler function called", () => {
    render(<Confirmation {...mockConfirmationProps} />);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Delete"));
    expect(mockConfirmFunction).toHaveBeenCalled();
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockconfirmCancelFunction).toHaveBeenCalled();
  });
});
