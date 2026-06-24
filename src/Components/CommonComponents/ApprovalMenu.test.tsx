import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import ApprovalMenu from "./ApprovalMenu";
const mockApprovelMenuProps = {
  approverName: ["John", "Mike"],
  workflows: [
    {
      status: "approved",
      approvalUsers: [{ name: "John" }],
    },
    {
      status: "pending",
      approvalUsers: [{ name: "Mike" }],
    },
  ],
};
describe("ApprovalMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(<ApprovalMenu {...mockApprovelMenuProps} />);
    fireEvent.click(screen.getByText("John/ Mike"));
  });

  test("renders approver names", () => {
    expect(screen.getByText("John/ Mike")).toBeInTheDocument();
  });

  test("opens menu on click", () => {
    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("J")).toBeInTheDocument();
  });
});
