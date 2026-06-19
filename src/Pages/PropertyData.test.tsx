import { describe, test, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import PropertyData from "./PropertyData";
import { Apiservice } from "../Services/ApiService";
import Toaster from "../Services/CommonService/ToasterHelper";
import { MemoryRouter } from "react-router-dom";

vi.mock("../Services/ApiService", () => ({
  Apiservice: {
    get: vi.fn(),
  },
}));

vi.mock("../Services/CommonService/ToasterHelper", () => ({
  default: {
    error: vi.fn(),
  },
}));

const renderPropertyPage = () =>
  render(
    <MemoryRouter>
      <PropertyData />
    </MemoryRouter>,
  );

const mockPropertDataRes = {
  data: [
    {
      propertyName: "Property A",
      data: {
        dashboardData: {
          rooms: {
            categoryName: "Rooms",
            departmentTotalBudget: 10,
            ab: 500,
            ttm: 25,
          },
          categories: {
            category1: [
              {
                categoryName: "Food",
                departmentTotalBudget: 200,
                ab: 100,
                ttm: 50,
              },
            ],
          },
        },
      },
    },
  ],
};

describe("PropertyData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("shows spinner while data loading", async () => {
    (Apiservice.get as Mock).mockResolvedValue({
      data: {},
    });
    renderPropertyPage();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("fetches and displays property data", async () => {
    (Apiservice.get as Mock).mockResolvedValue(mockPropertDataRes);

    renderPropertyPage();

    expect(await screen.findByText("Property A")).toBeInTheDocument();

    expect(screen.getByText("Rooms")).toBeInTheDocument();
    expect(screen.getByText("Food")).toBeInTheDocument();
  });

  test("shows toaster error when api fails", async () => {
    (Apiservice.get as Mock).mockRejectedValue(new Error("API Error"));

    renderPropertyPage();

    await waitFor(() => {
      expect(Toaster.error).toHaveBeenCalled();
    });
  });
});
