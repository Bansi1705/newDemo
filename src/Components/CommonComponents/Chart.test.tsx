import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import CommonChart from "./Chart";

const options = {
  chart: {
    id: "test-chart",
  },
};

const series = [
  {
    name: "Sales",
    data: [10, 20, 30],
  },
];

describe("Chart Common Component", () => {
  test("Chart Renders", () => {
    render(<CommonChart options={options} series={series} type="bar" />);

    expect(screen.getByTestId("common-charts")).toBeInTheDocument();
  });
});
