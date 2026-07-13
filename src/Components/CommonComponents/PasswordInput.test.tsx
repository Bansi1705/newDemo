import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import PasswordInput from "./PasswordInput";

function TestWrapper() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <PasswordInput
      showPassword={showPassword}
      setShowPassword={setShowPassword}
    />
  );
}

describe("PasswordInput", () => {
  test("toggles password visibility", () => {
    render(<TestWrapper />);

    const passwordInput = screen.getByPlaceholderText(
      "********"
    ) as HTMLInputElement;

    expect(passwordInput.type).toBe("password");

    const toggleButton = screen.getByLabelText(
      "toggle password visibility"
    );

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("text");
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("password");
  });
});