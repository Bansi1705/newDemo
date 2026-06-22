import { describe, test, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import PropertyCard from "./PropertyCard";
import { Apiservice } from "../Services/ApiService";
import Toaster from "../Services/CommonService/ToasterHelper";
import { MemoryRouter } from "react-router-dom";

vi.mock("../Services/ApiService", () => ({
  Apiservice: {
    get: vi.fn(),
  },
}));

const mockPropertyCardRes = {
  data: {
    content: [
      {
        date: "2026-06-22",
        time: "10:00 AM",
        temperature: "25",
        phLevel: "7",
        waterFlowRate: "100",
        chlorine: "5",
        createdAt: "2026-06-22T10:00:00",
        property: {
          propertyName: "Property A",
        },
        createdByUser: {
          name: "Radha",
        },
      },
    ],
  },
};

const getResData = () =>
  (Apiservice.get as Mock).mockResolvedValue(mockPropertyCardRes);

const renderPropertyCardPage = () =>
  render(
    <MemoryRouter>
      <PropertyCard />
    </MemoryRouter>,
  );

vi.mock("../Services/CommonService/ToasterHelper", () => ({
  default: {
    error: vi.fn(),
  },
}));

describe("PropertyCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders property data successfully", async () => {
    getResData();
    renderPropertyCardPage();
    await waitFor(() => {
      expect(screen.getByText("Property A")).toBeInTheDocument();
    });

    expect(screen.getByText("2026-06-22")).toBeInTheDocument();
    expect(screen.getByText("10:00 AM")).toBeInTheDocument();
    expect(screen.getByText("Radha")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("shows loader initially", () => {
    (Apiservice.get as Mock).mockReturnValue({ data: {} });
    renderPropertyCardPage();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("shows error toast when api fails", async () => {
    (Apiservice.get as Mock).mockRejectedValue(new Error("API Error"));
    renderPropertyCardPage();
    await waitFor(() => {
      expect(Toaster.error).toHaveBeenCalled();
    });
  });

  test("renders default user name when createdByUser is missing", async () => {
    (Apiservice.get as Mock).mockResolvedValue({
      data: {
        content: [
          {
            date: "2026-06-22",
            time: "10:00 AM",
            temperature: "25",
            phLevel: "7",
            waterFlowRate: "100",
            chlorine: "5",
            createdAt: "2026-06-22T10:00:00",
            property: {
              propertyName: "Property A",
            },
            createdByUser: null,
          },
        ],
      },
    });

    renderPropertyCardPage();

    expect(await screen.findByText("No User")).toBeInTheDocument();
  });
});
