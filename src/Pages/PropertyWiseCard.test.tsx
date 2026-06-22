import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, vi, type Mock } from "vitest";
import PropertyWiseCard from "./PropertWiseCard";
import { Apiservice } from "../Services/ApiService";

vi.mock("../Services/ApiService", () => ({
  Apiservice: {
    get: vi.fn(),
  },
}));

vi.mock("../Components/CommonComponents/DatePicker", () => ({
  ReactDatePicker: ({ onChange }: any) => (
    <button
      data-testid="date-picker"
      onClick={() => onChange(new Date("2026-06-22"))}
    >
      Select Date
    </button>
  ),
}));

const renderPropertyWisePage = () =>
  render(
    <MemoryRouter>
      <PropertyWiseCard />
    </MemoryRouter>,
  );

const mockPropertyWiseDataRes = {
  data: {
    content: [
      {
        property: { propertyName: "Hotel A" },
        date: "2026-06-22",
        time: "08:00",
        temperature: "25",
        phLevel: "7",
        waterFlowRate: "100",
        chlorine: "2",
        createdByUser: { name: "John" },
        createdAt: "2026-06-22",
      },
      {
        property: { propertyName: "Hotel B" },
        date: "2026-06-23",
        time: "10:00",
        temperature: "28",
        phLevel: "7.5",
        waterFlowRate: "110",
        chlorine: "3",
        createdByUser: { name: "Mike" },
        createdAt: "2026-06-22",
      },
    ],
    totalElements: 2,
    totalPages: 1,
  },
};

const getPropertyWiseData = () =>
  (Apiservice.get as Mock).mockResolvedValue(mockPropertyWiseDataRes);

describe("Property Wise Card Testing", () => {
  test("Property wise Data Load", async () => {
    getPropertyWiseData();
    renderPropertyWisePage();
    expect(await screen.findByText("Hotel A")).toBeInTheDocument();
  });

  test("filters cards by selected time", async () => {
    getPropertyWiseData();
    renderPropertyWisePage();
    expect(await screen.findByText("08:00")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /all time/i }));
    fireEvent.click(screen.getByText("8 AM"));

    expect(screen.getByText("08:00")).toBeInTheDocument();
    expect(screen.queryByText("10:00")).not.toBeInTheDocument();
  });

  test("filters cards by selectde property", async () => {
    getPropertyWiseData();
    renderPropertyWisePage();
    expect(await screen.findByText("Hotel A")).toBeInTheDocument();
    expect(screen.getByText("Hotel B")).toBeInTheDocument();

    const propertyMenu = screen.getByTestId("propertyFilterMenu");
    fireEvent.click(screen.getByRole("button", { name: /all property/i }));
    fireEvent.click(within(propertyMenu).getByText("Hotel A"));

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.queryByText("Hotel B")).not.toBeInTheDocument();
  });

  test("filters cards by selectde date", async () => {
    getPropertyWiseData();
    renderPropertyWisePage();

    expect(await screen.findByText("John")).toBeInTheDocument();
    expect(screen.getByText("Mike")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("date-picker"));
    await waitFor(() =>
      expect(screen.queryByText("Mike")).not.toBeInTheDocument(),
    );
  });
});
