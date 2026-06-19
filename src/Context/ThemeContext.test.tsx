import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeContext";

const TestThemeContextComponent = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <p>{theme}</p>
      <button onClick={toggleTheme}>Toggle</button>
    </>
  );
};

describe("ThemeContext", () => {
  test("theme changes and localStorage updates", () => {
    render(
      <ThemeProvider>
        <TestThemeContextComponent />
      </ThemeProvider>,
    );

    expect(screen.getByText("light")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Toggle"));
    expect(screen.getByText("dark")).toBeInTheDocument();
    expect(localStorage.getItem("theme")).toBe("dark");
  });
});
