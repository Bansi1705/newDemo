import { describe, test, expect, vi, beforeEach, type Mock } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import MonthlyReports from "./MonthlyReports";
import { Apiservice } from "../Services/ApiService";
import Toaster from "../Services/CommonService/ToasterHelper";

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

vi.mock("../Components/CommonComponents/Loader", () => ({
  default: () => <div data-testid="loader">Loader</div>,
}));

vi.mock("../Components/Header", () => ({
  default: () => <div>Header</div>,
}));

vi.mock("../Components/CommonComponents/ApprovalMenu", () => ({
  default: () => <div>Approval Menu</div>,
}));

describe("MonthlyReports", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders report data successfully", async () => {
    vi.mocked(Apiservice.get as Mock).mockResolvedValue({
      data: {
        january: {
          formStatus: "approved",
          commentCount: 2,
          nextApprover: {
            status: "pending",
            approverNames: ["John"],
          },
          pmFormApprovalWorkflow: [],
        },
      },
    });

    render(<MonthlyReports />);

    await waitFor(() => {
      expect(screen.getByText("Monthly Reports")).toBeInTheDocument();
    });

    expect(screen.getByText("January")).toBeInTheDocument();
  });

  test("shows toaster on api error", async () => {
    vi.mocked(Apiservice.get).mockRejectedValue(new Error());

    render(<MonthlyReports />);

    await waitFor(() => {
      expect(Toaster.error).toHaveBeenCalled();
    });
  });

  test("shows no data found when api returns empty object", async () => {
    vi.mocked(Apiservice.get as Mock).mockResolvedValue({
      data: {},
    });

    render(<MonthlyReports />);

    await waitFor(() => {
      expect(screen.getByText("No Data Found")).toBeInTheDocument();
    });
  });

  test("filters reports by form status", async () => {
    vi.mocked(Apiservice.get as Mock).mockResolvedValue({
      data: {
        january: {
          formStatus: "approved",
          commentCount: 2,
          nextApprover: {
            status: "pending",
            approverNames: ["John"],
          },
          pmFormApprovalWorkflow: [],
        },
        february: {
          formStatus: "pending",
          commentCount: 2,
          nextApprover: {
            status: "pending",
            approverNames: ["John"],
          },
          pmFormApprovalWorkflow: [],
        },
      },
    });
    render(<MonthlyReports />);

    await waitFor(() => {
      expect(screen.getByText("January")).toBeInTheDocument();
    });

    const menuContainer = screen.getByTestId("formStatus-menu");
    fireEvent.click(screen.getByRole("button", { name: /all form status/i }));
    const pendingStatus = within(menuContainer).getByText("Pending");

    fireEvent.click(pendingStatus);
    expect(screen.getByText("February")).toBeInTheDocument();

    expect(screen.queryByText("January")).not.toBeInTheDocument();
  });

  test("filters reports by status", async () => {
    vi.mocked(Apiservice.get as Mock).mockResolvedValue({
      data: {
        january: {
          formStatus: "approved",
          commentCount: 2,
          nextApprover: {
            status: "pending",
            approverNames: ["John"],
          },
          pmFormApprovalWorkflow: [],
        },
        february: {
          formStatus: "pending",
          commentCount: 2,
          nextApprover: {
            status: "approved",
            approverNames: ["John"],
          },
          pmFormApprovalWorkflow: [],
        },
      },
    });
    render(<MonthlyReports />);

    await waitFor(() => {
      expect(screen.getByText("January")).toBeInTheDocument();
    });

    const menuContainer = screen.getByTestId("status-menu");
    fireEvent.click(screen.getByRole("button", { name: /all status/i }));
    const pendingStatus = within(menuContainer).getByText(/approved/i);

    fireEvent.click(pendingStatus);

    expect(screen.queryByText("January")).not.toBeInTheDocument();
    expect(screen.getByText("February")).toBeInTheDocument();
  });
});
