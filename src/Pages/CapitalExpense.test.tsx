import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi, type Mock } from "vitest";
import CapitalExpense from "./CapitalExpense";
import { Apiservice } from "../Services/ApiService";
import { COMMON_SERVICES } from "../Services/CommonService/CommonServices";
import type { HeaderProps } from "../Components/Header";

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
const renderCapitalExpense = () =>
  render(
    <MemoryRouter>
      <CapitalExpense />
    </MemoryRouter>,
  );

const mockCapExeRes = {
  data: {
    content: [
      {
        description: "Room Renovation",
        invoiceNumber: "INV001",
        property: {
          propertyName: "Hotel A",
        },
        postDate: "2026-06-22",
        invoiceDate: "2026-06-20",
        invoiceType: "Material",
        project: {
          projectName: "Project Alpha",
        },
        vendor: {
          vendorName: "ABC Vendor",
        },
        invoiceAmount: 5000,
        approvalStatus: "approved",
        expenseCommentCount: "2",
        approvedByUser: {
          name: "John",
        },
        expenseApprovalPersonList: [
          {
            approvalName: ["Manager"],
          },
        ],
      },
      {
        description: "Furniture Purchase",
        invoiceNumber: "INV002",
        property: {
          propertyName: "Hotel B",
        },
        postDate: "2026-06-23",
        invoiceDate: "2026-06-21",
        invoiceType: "Equipment",
        project: null,
        vendor: {
          vendorName: "XYZ Vendor",
        },
        invoiceAmount: 8000,
        approvalStatus: "pending",
        expenseCommentCount: "1",
        approvedByUser: null,
        expenseApprovalPersonList: [
          {
            approvalName: ["Director"],
          },
        ],
      },
    ],
  },
};

const getCapExeData = () =>
  (Apiservice.get as Mock).mockResolvedValue(mockCapExeRes);
describe("Capital Expense Page Testing", () => {
  test("Capital Expense Page Renders", async () => {
    getCapExeData();
    renderCapitalExpense();
    expect(await screen.findByText("Capital Expense")).toBeInTheDocument();
  });

  test("sort function called when table header clicked", async () => {
    getCapExeData();
    renderCapitalExpense();
    const spyfn = vi.spyOn(COMMON_SERVICES, "sortData");
    fireEvent.click(await screen.findByText("Property Name"));
    expect(spyfn).toHaveBeenCalled();
  });

  test("serch by Vendor Name", async () => {
    getCapExeData();
    renderCapitalExpense();
    const searchInput = await screen.findByTestId("search-input");
    fireEvent.change(searchInput, {
      target: { value: "XYZ" },
    });
    expect(await screen.findByText("XYZ Vendor")).toBeInTheDocument();
  });
});
