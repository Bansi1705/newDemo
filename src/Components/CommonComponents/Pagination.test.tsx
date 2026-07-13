import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Pagination from "./Pagination";

const mockOnPageChange = vi.fn();
const renderPagination = () =>
  render(
    <Pagination
      currentPage={2}
      totalPages={5}
      onPageChange={mockOnPageChange}
    />,
  );
describe("Pagination Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls onPageChange when next and previous button is clicked", () => {
    renderPagination();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  test("Buttons disabled when current page same as next or previous", () => {
    const { rerender } = render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
    );
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    rerender(
      <Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />,
    );
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });
});