import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Loader from "./Loader";

describe("Loader Component", () => {
  test("renders spinner when loading is true", () => {
    render(<Loader loading={true} />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("renders spinner with default props", () => {
    render(<Loader />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });
});
