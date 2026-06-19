import { describe, test, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserExpense from "./UserExpense";
import { Apiservice } from "../Services/ApiService";
import { MemoryRouter } from "react-router-dom";

vi.mock("../Services/ApiService", () => ({
  Apiservice: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const renderUserExpense = () =>
  render(
    <MemoryRouter>
      <UserExpense />
    </MemoryRouter>,
  );

vi.mock("../Components/CommonComponents/DatePicker", () => ({
  ReactDatePicker: ({ onChange }: any) => (
    <input
      data-testid="datepicker"
      onChange={() => onChange(new Date("2026-06-19"))}
    />
  ),
}));

const MockUserExpenseRes = {
  data: [
    {
      id: 1,
      expenseTitle: "Lunch",
      description: "Team lunch",
      category: "Food",
      subCategory: "Lunch",
      amount: 500,
      paymentMethod: "Cash",
      invoiceNumber: "INV001",
      expenseDate: "2026-06-18",
      submissionDate: "2026-06-18",
      employeeId: "EMP001",
      employeeName: "Bansi",
      department: "IT",
      assignedTo: "Manager",
      status: "Pending",
    },
  ],
};

const getUserExpenseData = () =>
  (Apiservice.get as Mock).mockResolvedValue(MockUserExpenseRes);

describe("UserExpense Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders Add New Expense heading", async () => {
    (Apiservice.get as Mock).mockResolvedValue({
      data: [],
    });
    renderUserExpense();
    expect(
      screen.getByRole("heading", { name: /add new expense/i }),
    ).toBeInTheDocument();
  });

  test("fetches expense data and displays table", async () => {
    getUserExpenseData();
    renderUserExpense();
    expect(await screen.findByText("Bansi")).toBeInTheDocument();
  });

  test("shows validation errors on empty submit", async () => {
    (Apiservice.get as Mock).mockResolvedValue({
      data: [],
    });
    renderUserExpense();
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(await screen.findByText(/title required/i)).toBeInTheDocument();
  });

  test("search filters expense records", async () => {
    getUserExpenseData();
    renderUserExpense();
    const search = await screen.findByPlaceholderText(
      /search by employee name/i,
    );

    fireEvent.change(search, {
      target: { value: "xyz" },
    });

    expect(await screen.findByText(/no expenses found/i)).toBeInTheDocument();
  });

  test("should create a new user expense", async () => {
    renderUserExpense();
    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "Lunch" },
    });

    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Food expense" },
    });

    fireEvent.change(screen.getByPlaceholderText("Amount"), {
      target: { value: "100" },
    });

    fireEvent.change(screen.getByPlaceholderText("Invoice No"), {
      target: { value: "INV001" },
    });

    fireEvent.change(screen.getByPlaceholderText("Employee ID"), {
      target: { value: "EMP001" },
    });

    fireEvent.change(screen.getByPlaceholderText("Employee Name"), {
      target: { value: "Bansi" },
    });

    fireEvent.change(screen.getByPlaceholderText("Department"), {
      target: { value: "IT" },
    });

    fireEvent.change(screen.getByPlaceholderText("Assigned To"), {
      target: { value: "Manager" },
    });

    const dropdowns = screen.getAllByRole("combobox");

    fireEvent.change(dropdowns[0], {
      target: { value: "Food" },
    });

    fireEvent.change(dropdowns[1], {
      target: { value: "Lunch" },
    });

    fireEvent.change(dropdowns[2], {
      target: { value: "Cash" },
    });

    const dates = screen.getAllByTestId("datepicker");

    fireEvent.change(dates[0], {
      target: { value: "2026-06-19" },
    });

    fireEvent.change(dates[1], {
      target: { value: "2026-06-19" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(Apiservice.post).toHaveBeenCalledTimes(1);
    });

    expect(Apiservice.post).toHaveBeenCalledWith(
      "/UserExpenses",
      expect.objectContaining({
        expenseTitle: "Lunch",
        description: "Food expense",
        category: "Food",
        subCategory: "Lunch",
        amount: 100,
        paymentMethod: "Cash",
        invoiceNumber: "INV001",
        employeeId: "EMP001",
        employeeName: "Bansi",
        department: "IT",
        assignedTo: "Manager",
        status: "Pending",
      }),
    );
  });

  test("should update expense using put api", async () => {
    getUserExpenseData();

    renderUserExpense();

    await screen.findByText("Bansi");
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));

    fireEvent.click(screen.getByText(/edit/i));

    const titleInput = screen.getByPlaceholderText("Title");

    fireEvent.change(titleInput, {
      target: { value: "Updated Lunch" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(Apiservice.put).toHaveBeenCalledTimes(1);
    });

    expect(Apiservice.put).toHaveBeenCalledWith(
      "/UserExpenses/1",
      expect.objectContaining({
        expenseTitle: "Updated Lunch",
      }),
    );
  });

  test("should delete expense using delete api", async () => {
    getUserExpenseData();

    renderUserExpense();

    await screen.findByText("Bansi");
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));

    fireEvent.click(screen.getByText(/delete/i));

    fireEvent.click(screen.getByTestId("confirm-delete-btn"));

    await waitFor(() => {
      expect(Apiservice.delete).toHaveBeenCalledWith("/UserExpenses/1");
    });
  });

  test("update status from table drop down", async () => {
    getUserExpenseData();
    renderUserExpense();

    await screen.findByText("Bansi");
    const dropdowns = screen.getAllByRole("combobox");

    const tableStatusDropdown = dropdowns[4];

    fireEvent.change(tableStatusDropdown, {
      target: { value: "Approved" },
    });

    const confirmBtn = await screen.findByText(/yes/i);

    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(Apiservice.put).toHaveBeenCalledWith(
        "/UserExpenses/1",
        expect.objectContaining({
          status: "Approved",
        }),
      );
    });
  });
});
