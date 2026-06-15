import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Pagination from "./Pagination";

describe("Pagination Component", () => {
  test("renders current page and total pages", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
  });

  test("calls onPageChange when next button is clicked", () => {
    const mockOnPageChange = vi.fn();

    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  test("calls onPageChange when previous button is clicked", () => {
    const mockOnPageChange = vi.fn();

    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Previous" }));

    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  test("previous button is disabled on first page", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Previous" }),
    ).toBeDisabled();
  });

  test("next button is disabled on last page", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Next" }),
    ).toBeDisabled();
  });
});