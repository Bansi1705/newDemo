import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import ApprovalMenu from "./ApprovalMenu";
const mockProps = {
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
    render(<ApprovalMenu {...mockProps} />);
    fireEvent.click(screen.getByText("John/ Mike"));
  });

  test("renders approver names", () => {
    expect(screen.getByText("John/ Mike")).toBeInTheDocument();
  });

  test("opens menu on click", () => {
    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  test("shows first character avatar", () => {
    expect(screen.getByText("J")).toBeInTheDocument();
  });
});
