import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { Otp } from "./Otp";

describe("Otp Component", () => {
  test("calls setOtpValue on input change", () => {
    const mockSetOtpValue = vi.fn();
    render(
      <Otp otpValue="" setOtpValue={mockSetOtpValue} className="test-class" />,
    );
    const otpInput = screen.getByPlaceholderText(
      "Enter OTP",
    ) as HTMLInputElement;

    fireEvent.change(otpInput, {
      target: {
        value: "123456",
      },
    });
    expect(mockSetOtpValue).toHaveBeenCalledWith("123456");
  });

  test("shows provided value", () => {
    render(
      <Otp otpValue="654321" setOtpValue={vi.fn()} className="test-class" />,
    );

    const otpInput = screen.getByPlaceholderText(
      "Enter OTP",
    ) as HTMLInputElement;
    expect(otpInput.value).toBe("654321");
  });
});
