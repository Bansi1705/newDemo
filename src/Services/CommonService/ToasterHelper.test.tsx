import { describe, test, expect, vi, beforeEach } from "vitest";
import Toaster from "./ToasterHelper";
import { toast } from "react-toastify";

vi.mock("react-toastify", () => ({
  toast: vi.fn(),
}));

describe("Toaster Helper component testing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    toast.isActive = vi.fn().mockReturnValue(false);
  });

  test("success toast should be called", () => {
    Toaster.success("Data Saved");
    expect(toast).toHaveBeenCalled();
  });

  test("error toast should be called", () => {
    Toaster.error("Something went wrong");
    expect(toast).toHaveBeenCalled();
  });

  test("warning toast should be called", () => {
    Toaster.warning("Warning Message");
    expect(toast).toHaveBeenCalled();
  });

  test("info toast should be called", () => {
    Toaster.info("Information");
    expect(toast).toHaveBeenCalled();
  });

  test("toast should not be called if already active", () => {
    toast.isActive = vi.fn().mockReturnValue(true);
    Toaster.success("Data Saved");
    expect(toast).not.toHaveBeenCalled();
  });
});
