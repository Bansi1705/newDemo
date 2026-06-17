import { fireEvent, render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, type Mock } from "vitest";
import Data from "./Data";
import { Apiservice } from "../Services/ApiService";
import { MemoryRouter } from "react-router-dom";
import type { HeaderProps } from "../Components/Header";
import { COMMON_SERVICES } from "../Services/CommonService/CommonServices";

vi.mock("../Services/ApiService", () => ({
  Apiservice: {
    get: vi.fn(),
  },
}));

vi.mock("../Components/Header", () => ({
  default: ({ searchTerm, setSearchTerm }: HeaderProps) => (
    <input
      data-testid="search-input"
      value={searchTerm}
      onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
    />
  ),
}));

const mockResponse = {
  data: {
    categories: {
      sourceOfRevenue: [
        {
          categoryName: "Revenue 1",
          actualMTD: 100,
          budgetMTD: 90,
          variance: 10,
          commentCount: 2,
          budgetMTH: 200,
          varianceMTH: 20,
          forecastMTH: 220,
        },
        {
          categoryName: "Apple",
          actualMTD: 100,
          budgetMTD: 90,
          variance: 10,
          commentCount: 2,
          budgetMTH: 200,
          varianceMTH: 20,
          forecastMTH: 220,
        },
      ],
      departmentExpenses: [],
      departmentProfit: [],
      generalExpenses: [],
    },

    row1: {
      categoryName: "Total Occupied Rooms",
      actualMTD: 120,
      budgetMTD: 100,
      variance: 20,
      commentCount: 1,
      budgetMTH: 300,
      varianceMTH: 30,
      forecastMTH: 330,
    },
  },
};

describe("Data Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(Apiservice.get as Mock).mockResolvedValue(mockResponse);
    render(
      <MemoryRouter>
        <Data />
      </MemoryRouter>,
    );
  });

  test("renders api data", async () => {
    expect(await screen.findByText("Revenue 1")).toBeInTheDocument();
  });

  test("Category name renders", async () => {
    expect(await screen.findByText("Source Of Revenue")).toBeInTheDocument();
  });

  test("serch by name", async () => {
    const searchInput = await screen.findByTestId("search-input");
    fireEvent.change(searchInput, {
      target: { value: "Rev" },
    });
    expect(await screen.findByText("Revenue 1")).toBeInTheDocument();
  });

  test("sort function called when table header clicked", async () => {
    const spyfn = vi.spyOn(COMMON_SERVICES, "sortData");
    fireEvent.click(await screen.findByText("Name"));
    expect(spyfn).toHaveBeenCalled();
  });
  
});
