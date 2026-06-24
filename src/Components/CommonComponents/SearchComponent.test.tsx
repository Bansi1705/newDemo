import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { SearchBar } from "./SearchComponent";

describe("Search Input Component Testing", () => {
  test("Search Input Renders", () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
  });

  test("calls onChange when user types", () => {
    const handleSerchInputChange = vi.fn();
    render(
      <SearchBar
        searchTerm=""
        searchPlaceholder="Search"
        searchOnChange={handleSerchInputChange}
        searchClssName="search-input"
      />,
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, {
      target: { value: "Test User" },
    });
    expect(handleSerchInputChange).toHaveBeenCalled();
  });
});
