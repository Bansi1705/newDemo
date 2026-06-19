import { describe, test, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ApexChart from "./ApexChart";
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

const renderChart = () =>
  render(
    <MemoryRouter>
      <ApexChart />
    </MemoryRouter>,
  );

describe("ApexChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("shows spinner while data loading", async () => {
    (Apiservice.get as Mock).mockResolvedValue({
      data: {},
    });
    renderChart();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("shows toaster on api failure", async () => {
    (Apiservice.get as Mock).mockRejectedValue(new Error("API Error"));

    renderChart();
    await waitFor(() => {
      expect(Toaster.error).toHaveBeenCalled();
    });
  });

  test("data renders in chart or not", async () => {
    (Apiservice.get as Mock)
      .mockResolvedValueOnce({
        data: {
          distributionAnalysis: [
            {
              propertyName: "Property A",
              punchIns: 10,
              punchOuts: 5,
              total: 15,
              propertyId: 1,
            },
          ],
          occupancyStatistics: {
            checkInPercentage: 60,
            checkOutPercentage: 40,
            total: 100,
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          propertyWisePaymentDetails: {},
          totals: {
            totalInvoices: 0,
            totalInvoiceAmount: 0,
          },
        },
      });

    renderChart();

    await waitFor(() => {
      expect(screen.getByTestId("chart-data")).toBeInTheDocument();
    });
  });
});
