import { beforeEach, describe, expect, vi, type Mock } from "vitest";
import { Apiservice } from "../Services/ApiService";
import { fireEvent, render, screen } from "@testing-library/react";
import RoomData from "./RoomData";
import { MemoryRouter } from "react-router-dom";
import { COMMON_SERVICES } from "../Services/CommonService/CommonServices";

vi.mock("../Services/ApiService", () => ({
  Apiservice: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockRoomDataRes = {
  data: [
    {
      isoDate: "2026-04-03T00:00:00.000Z",
      formattedDate: "April 3, 2026",
      id: null,
      propertyId: null,
      date: "N/A",
      complimentaryRoom: "N/A",
      note: "parent",
      createdBy: null,
      modifiedBy: null,
      createdAt: null,
      updatedAt: null,
      softDelete: null,
      roomsCount: 1,
      isMain: true,
      isDeletable: true,
      isEditable: true,
      subArray: [
        {
          isoDate: "2026-04-04T00:00:00.000Z",
          formattedDate: "April 4, 2026",
          id: null,
          propertyId: null,
          date: "N/A",
          complimentaryRoom: "N/A",
          note: "sub",
          createdBy: null,
          modifiedBy: null,
          createdAt: null,
          updatedAt: null,
          softDelete: null,
          roomsCount: 2,
          isMain: true,
          isDeletable: true,
          isEditable: true,
        },
      ],
    },
    {
      isoDate: "2026-04-05T00:00:00.000Z",
      formattedDate: "April 5, 2026",
      id: null,
      propertyId: null,
      date: "N/A",
      complimentaryRoom: "N/A",
      note: "second",
      createdBy: null,
      modifiedBy: null,
      createdAt: null,
      updatedAt: null,
      softDelete: null,
      roomsCount: 1,
      isMain: true,
      isDeletable: true,
      isEditable: true,
      subArray: [],
    },
  ],
};

const renderRoomDataPage = () =>
  render(
    <MemoryRouter>
      <RoomData />
    </MemoryRouter>,
  );

const getroomData = () =>
  (Apiservice.get as Mock).mockResolvedValue(mockRoomDataRes);

describe("Room Data Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("Room Data show by api", async () => {
    getroomData();
    renderRoomDataPage();

    expect(await screen.findByText("2026-04-03")).toBeInTheDocument();
    expect(screen.getByText("parent")).toBeInTheDocument();
  });

  test("Room Data show sub array", async () => {
    getroomData();
    renderRoomDataPage();

    fireEvent.click(await screen.findByTestId("expand-btn"));
    expect(screen.getByTestId("sub-row")).toBeInTheDocument();
  });

  test("parent row single delete", async () => {
    getroomData();
    renderRoomDataPage();

    await screen.findByText("parent");
    const deleteButtons = screen.getAllByTestId("parentDltBtn");

    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByText("Delete"));

    expect(screen.queryByText("parent")).not.toBeInTheDocument();
    expect(screen.queryByText("sub")).not.toBeInTheDocument();
  });

  test("sub row single delete record", async () => {
    getroomData();
    renderRoomDataPage();

    fireEvent.click(await screen.findByTestId("expand-btn"));
    await screen.findByText("sub");
    fireEvent.click(screen.getByTestId("subDataDleBtn"));
    fireEvent.click(screen.getByText("Delete"));

    expect(screen.getByText("parent")).toBeInTheDocument();
    expect(screen.queryByText("sub")).not.toBeInTheDocument();
  });

  test("deletes multiple parent rows", async () => {
    getroomData();
    renderRoomDataPage();

    await screen.findByText("parent");

    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    fireEvent.click(screen.getByText("Delete Selected Item"));

    fireEvent.click(screen.getByText("Delete"));

    expect(screen.queryByText("parent")).not.toBeInTheDocument();
    expect(screen.queryByText("second")).not.toBeInTheDocument();
  });

  test("sort function called when table header clicked", async () => {
    getroomData();
    renderRoomDataPage();
    const spyfn = vi.spyOn(COMMON_SERVICES, "sortData");
    fireEvent.click(await screen.findByText("Created Date"));
    expect(spyfn).toHaveBeenCalled();
  });
});
