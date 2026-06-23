import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi, type Mock } from "vitest";
import PayRollData from "./PayRollData";
import { Apiservice } from "../Services/ApiService";
import { COMMON_SERVICES } from "../Services/CommonService/CommonServices";

vi.mock("../Services/ApiService", () => ({
  Apiservice: {
    get: vi.fn(),
  },
}));

const mockPayRollRes = {
  data: {
    data: {
      "Payroll & Related Expense": [
        {
          accountNumber: "1001",
          departmentType: "maintenance_department",
          categoryName: "Salaries",
          actualMTD: 50000,
          budgetMTD: 55000,
          variance: -5000,
          forecastMTH: 60000,
          budgetMTH: 65000,
          varianceMTH: -5000,
          commentCount: 2,
          comments: ["Initial Comment", "Second Comment"],
          subAccounts: [
            {
              accountNumber: "1001-1",
              departmentType: "maintenance_department",
              categoryName: "Technician Salary",
              actualMTD: 20000,
              budgetMTD: 22000,
              variance: -2000,
              forecastMTH: 25000,
              budgetMTH: 27000,
              varianceMTH: -2000,
              commentCount: 1,
              comments: ["Sub Account Comment"],
            },
          ],
        },
        {
          accountNumber: "1002",
          departmentType: "hr_department",
          categoryName: "Total Payroll & Related Expense (R & M Department)",
          actualMTD: 70000,
          budgetMTD: 75000,
          variance: -5000,
          forecastMTH: 85000,
          budgetMTH: 90000,
          varianceMTH: -5000,
          commentCount: 0,
          comments: [],
        },
      ],

      "Payroll Taxes & Other Benefits": [
        {
          accountNumber: "2001",
          departmentType: "finance_department",
          categoryName: "Employee Benefits",
          actualMTD: 10000,
          budgetMTD: 12000,
          variance: -2000,
          forecastMTH: 14000,
          budgetMTH: 15000,
          varianceMTH: -1000,
          commentCount: 1,
          comments: ["Benefit review pending"],
        },
      ],
    },
  },
};

const renderPayrollPage = () =>
  render(
    <MemoryRouter>
      <PayRollData />
    </MemoryRouter>,
  );

const getPayRollData = () =>
  (Apiservice.get as Mock).mockResolvedValue(mockPayRollRes);
describe("Pay roll data page test", () => {
  test("Pay Roll Data Page Rendres", async () => {
    getPayRollData();
    renderPayrollPage();
    expect(
      await screen.findByText("Payroll & Related Expense"),
    ).toBeInTheDocument();
    expect(screen.getByText("Employee Benefits")).toBeInTheDocument();
  });

  test("sort function called when table header clicked", async () => {
    getPayRollData();
    renderPayrollPage();
    const spyfn = vi.spyOn(COMMON_SERVICES, "sortData");
    fireEvent.click(await screen.findByText("Category Name"));
    expect(spyfn).toHaveBeenCalled();
  });

  test("Add Comment model Renders", async () => {
    getPayRollData();
    renderPayrollPage();
    expect(
      await screen.findByText("Payroll & Related Expense"),
    ).toBeInTheDocument();
    const commentIcons = screen.getAllByTestId("openAddCommentModelTest");

    fireEvent.click(commentIcons[0]);
    expect(screen.getByText("Add Comment")).toBeInTheDocument();
  });

  test("sub Account details show when click on expand btn", async () => {
    getPayRollData();
    renderPayrollPage();
    expect(
      await screen.findByText("Payroll & Related Expense"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("expand-btn"));
    expect(screen.getByTestId("sub-row")).toBeInTheDocument();
  });
});
