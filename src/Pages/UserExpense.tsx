import React, { useEffect, useState } from "react";
import type { ApiResponse, ExpenseData } from "../Interface/types";
import { ReactDatePicker } from "../Components/CommonComponents/DatePicker";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Confirmation from "../Components/CommonComponents/Confirmation";
import "../Styles/UserExpence.css";
import { Buttons } from "../Components/CommonComponents/Buttons";
import InputField from "../Components/CommonComponents/InputFeild";
import { DropDown } from "../Components/CommonComponents/DropDown";
import { SearchBar } from "../Components/CommonComponents/SearchComponent";
import Header from "../Components/Header";
import { Apiservice } from "../Services/ApiService";
import Pagination from "../Components/CommonComponents/Pagination";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Toaster from "../Services/CommonService/ToasterHelper";
import { CONSTANT } from "../Services/Constant";
interface StatusChangeData {
  id: number | string;
  newStatus: string;
  showConfirm: boolean;
}

const UserExpense = () => {
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [form, setForm] = useState<ExpenseData>({
    id: new Date().getTime(),
    expenseTitle: "",
    description: "",
    category: "",
    subCategory: "",
    amount: 0,
    paymentMethod: "",
    invoiceNumber: "",
    expenseDate: null,
    submissionDate: null,
    employeeId: "",
    employeeName: "",
    department: "",
    assignedTo: "",
    status: "Pending",
  });

  const [statusChangeData, setStatusChangeData] =
    useState<StatusChangeData | null>(null);

  const [editExpense, setEditExpense] = useState<ExpenseData | null>(null);
  const [deleteExpenseId, setDeleteExpenseId] = useState<number | undefined>(
    undefined,
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const categoryData: Record<string, string[]> = {
    Food: ["Lunch", "Dinner", "Snacks"],
    Travel: ["Bus", "Train", "Flight"],
    Office: ["Stationary", "Software"],
  };

  const paymentMethods = ["Cash", "UPI", "Card"];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response: ApiResponse<ExpenseData[]> =
          await Apiservice.get("/UserExpenses");
        setExpenses(response.data);
      } catch {
        Toaster.error(CONSTANT.TOAST_ERROR_MSG.COMMON);
      }
    };

    fetchUser();
  }, []);

  const validate = () => {
    const newError: Record<string, string> = {};
    if (!form.expenseTitle.trim()) newError.expenseTitle = "Title required";
    if (!form.description.trim()) newError.description = "Description required";
    if (!form.category.trim()) newError.category = "Category required";
    if (!form.subCategory.trim()) newError.subCategory = "SubCategory required";
    if (!form.amount || form.amount <= 0) newError.amount = "Amount required";
    if (!form.paymentMethod.trim())
      newError.paymentMethod = "Payment method required";
    if (!form.invoiceNumber.trim())
      newError.invoiceNumber = "Invoice number required";
    if (!form.expenseDate) newError.expenseDate = "Expense date required";
    if (!form.submissionDate)
      newError.submissionDate = "Submission date required";
    if (!form.employeeId.trim()) newError.employeeId = "Employee ID required";
    if (!form.employeeName.trim())
      newError.employeeName = "Employee Name required";
    if (!form.department.trim()) newError.department = "Department required";
    if (!form.assignedTo.trim()) newError.assignedTo = "Assigned To required";
    if (!form.status.trim()) newError.status = "Status required";

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "amount" ? Number(value) : value });
    setError({ ...error, [name]: "" });
  };

  const resetForm = () => {
    setForm({
      id: Date.now(),
      expenseTitle: "",
      description: "",
      category: "",
      subCategory: "",
      amount: 0,
      paymentMethod: "",
      invoiceNumber: "",
      expenseDate: null,
      submissionDate: null,
      employeeId: "",
      employeeName: "",
      department: "",
      assignedTo: "",
      status: "Pending",
    });
    setEditExpense(null);
    setError({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("submit clicked");
    e.preventDefault();

    if (!validate()) return;
    const payload = {
      ...form,
      expenseDate: form.expenseDate ? form.expenseDate.toISOString() : null,
      submissionDate: form.submissionDate
        ? form.submissionDate.toISOString()
        : null,
    };

    let savedExpense: ExpenseData;
    try {
      if (editExpense) {
        const res: ApiResponse<ExpenseData> = await Apiservice.put(
          `/UserExpenses/${editExpense.id}`,
          payload,
        );
        savedExpense = res.data;
        Toaster.success(CONSTANT.TOAST_SUCCESS_MSG.UPDATE);
      } else {
        const res: ApiResponse<ExpenseData> = await Apiservice.post(
          "/UserExpenses",
          payload,
        );
        savedExpense = res.data;
        Toaster.success(CONSTANT.TOAST_SUCCESS_MSG.CREATE);
      }

      setExpenses((prev) =>
        editExpense
          ? prev.map((exp) => (exp.id === editExpense.id ? savedExpense : exp))
          : [...prev, savedExpense],
      );
    } catch (error) {
      Toaster.error(
        `Error saving expense: ${error instanceof Error ? error.message : "Unknown error"} `,
      );
    }
    resetForm();
  };

  const handleEdit = (expense: ExpenseData) => {
    setEditExpense(expense);
    setForm({
      ...expense,
      expenseDate: expense.expenseDate ? new Date(expense.expenseDate) : null,
      submissionDate: expense.submissionDate
        ? new Date(expense.submissionDate)
        : null,
    });
  };

  const handleDelete = (id: number | undefined) => {
    setDeleteExpenseId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (!deleteExpenseId) return;
    try {
      Apiservice.delete<ApiResponse<ExpenseData>>(
        `/UserExpenses/${deleteExpenseId}`,
      ).then(() => {
        setExpenses((prev) => prev.filter((exp) => exp.id !== deleteExpenseId));
        setShowConfirm(false);
      });
    } catch {
      Toaster.error(CONSTANT.TOAST_ERROR_MSG.COMMON);
    }
    setDeleteExpenseId(undefined);
    setShowConfirm(false);
  };

  const filteredExpenses = expenses.filter(
    (exp) =>
      exp.employeeName &&
      exp.employeeName.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  const totalPages = Math.ceil(filteredExpenses.length / 5);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const lastIndex = currentPage * itemsPerPage;
  const startIndex = lastIndex - itemsPerPage;
  const currentRecords = filteredExpenses.slice(startIndex, lastIndex);

  const handleStatusChange = (id: number, newStatus: string) => {
    const current = expenses.find((exp) => exp.id === id);
    if (
      (current?.status === "Approved" || current?.status === "Rejected") &&
      newStatus === "Pending"
    ) {
      Toaster.error("Cannot change back to Pending status");
      return;
    }
    setStatusChangeData({ id, newStatus, showConfirm: true });
  };

  const confirmStatusChange = async () => {
    if (!statusChangeData) return;

    const currentExpense = expenses.find(
      (exp) => exp.id === statusChangeData.id,
    );

    if (!currentExpense) return;

    try {
      const res: ApiResponse<ExpenseData> = await Apiservice.put(
        `/UserExpenses/${statusChangeData.id}`,
        {
          ...currentExpense,
          status: statusChangeData.newStatus,
        },
      );

      const updatedExpense: ExpenseData = res.data;

      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === statusChangeData.id ? updatedExpense : exp,
        ),
      );
    } catch {
      Toaster.error(CONSTANT.TOAST_ERROR_MSG.COMMON);
    }

    setStatusChangeData(null);
  };
  const statusChange = [
    { value: "Pending", label: "Pending", color: "#ffc107" },
    { value: "Approved", label: "Approved", color: "#28a745" },
    { value: "Rejected", label: "Rejected", color: "#dc3545" },
  ];

  return (
    <>
      <Header />
      <div className="expense-form-data">
        <form className="expense-form" onSubmit={handleSubmit}>
          <h2 className="expense-title">
            {editExpense ? "Edit Expense" : "Add New Expense"}
          </h2>
          <InputField
            type="text"
            name="expenseTitle"
            id="expenseTitle"
            placeholder="Title"
            value={form.expenseTitle}
            onChange={handleChange}
            error={error.expenseTitle}
            classname="input-field"
          />

          <InputField
            type="text"
            name="description"
            id="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            classname="input-field"
            error={error.description}
          />

          <DropDown
            selectName="category"
            selectValue={form.category}
            dropDownChange={handleChange}
            optionsLabel={Object.keys(categoryData)}
            selectClasName="input-field"
            placeholder="Select Category"
            error={error.category}
          />

          <DropDown
            selectName="subCategory"
            selectValue={form.subCategory}
            dropDownChange={handleChange}
            optionsLabel={categoryData[form.category] || []}
            selectClasName="input-field"
            placeholder="Select SubCategory"
            error={error.subCategory}
          />
          {error.subCategory && (
            <span className="error">{error.subCategory}</span>
          )}

          <InputField
            type="number"
            name="amount"
            id="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            error={error.amount}
            classname="input-field"
          />

          <DropDown
            selectName="paymentMethod"
            selectValue={form.paymentMethod}
            dropDownChange={handleChange}
            optionsLabel={paymentMethods}
            selectClasName="input-field"
            placeholder="Payment Method"
            error={error.paymentMethod}
          />

          <InputField
            type="text"
            name="invoiceNumber"
            id="invoiceNumber"
            placeholder="Invoice No"
            value={form.invoiceNumber}
            onChange={handleChange}
            error={error.invoiceNumber}
            classname="input-field"
          />

          <ReactDatePicker
            selectedDate={form.expenseDate}
            onChange={(d) => setForm({ ...form, expenseDate: d })}
            placeholder="Select Expense Date"
            className="input-field"
          />
          {error.expenseDate && (
            <span className="error">{error.expenseDate}</span>
          )}

          <ReactDatePicker
            selectedDate={form.submissionDate}
            onChange={(d) => setForm({ ...form, submissionDate: d })}
            placeholder="Select Submission Date"
            className="input-field"
          />
          {error.submissionDate && (
            <span className="error">{error.submissionDate}</span>
          )}

          <InputField
            type="text"
            name="employeeId"
            id="employeeId"
            placeholder="Employee ID"
            value={form.employeeId}
            onChange={handleChange}
            error={error.employeeId}
            classname="input-field"
          />

          <InputField
            type="text"
            name="employeeName"
            id="employeeName"
            placeholder="Employee Name"
            value={form.employeeName}
            onChange={handleChange}
            error={error.employeeName}
            classname="input-field"
          />
          <InputField
            type="text"
            name="department"
            id="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            error={error.department}
            classname="input-field"
          />
          <InputField
            type="text"
            name="assignedTo"
            id="assignedTo"
            placeholder="Assigned To"
            value={form.assignedTo}
            onChange={handleChange}
            error={error.assignedTo}
            classname="input-field"
          />
          <DropDown
            selectName="status"
            selectValue={form.status}
            dropDownChange={handleChange}
            optionsLabel={["Pending", "Approved", "Rejected"]}
            selectClasName="input-field"
            error={error.status}
          />
          {error.status && <span className="error">{error.status}</span>}
          <div className="form-buttons flex gap-4 mt-4">
            <Buttons
              label={editExpense ? "Update" : "Save"}
              type="submit"
              className="submit-btn cursor-pointer bg-blue-600 text-white p-2 rounded hover:bg-blue-800 transition-colors"
            />
            <Buttons
              label="Cancel"
              type="button"
              onClick={resetForm}
              className="cancel-btn cursor-pointer bg-gray-600 text-white p-2 rounded hover:bg-gray-800 transition-colors"
            />
          </div>
        </form>

        {expenses.length > 0 && (
          <div className="expense-user-data">
            <h2 className="expense-table-title">Expenses List</h2>
            <div className="search-wrapper">
              <SearchBar
                searchTerm={searchTerm}
                searchPlaceholder="Search by employee name"
                searchOnChange={(e) => setSearchTerm(e.target.value)}
                searchClssName="search-input"
              />
            </div>
            <table className="expense-data-table">
              <thead>
                <tr>
                  {CONSTANT.USER_EXPENSE_TABLE_HEADER.map((head) => (
                    <th key={head.key}>{head.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentRecords.length > 0 ? (
                  currentRecords.map((exp) => (
                    <tr key={exp.id}>
                      <td>{exp.employeeName}</td>
                      <td>{exp.category}</td>
                      <td>{exp.subCategory}</td>
                      <td>{exp.amount}</td>
                      <td>{exp.paymentMethod}</td>
                      <td>
                        {exp.expenseDate
                          ? new Date(exp.expenseDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        {exp.submissionDate
                          ? new Date(exp.submissionDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <select
                          value={exp.status}
                          onChange={(e) =>
                            handleStatusChange(exp.id ?? 0, e.target.value)
                          }
                          className={`status-dropdown-${exp.status.toLowerCase()} `}
                        >
                          {statusChange.map((status) => (
                            <option
                              key={status.value}
                              value={status.value}
                              style={{ backgroundColor: status.color }}
                            >
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <Menu as="div" className="relative text-left flex">
                          <MenuButton className="bg-blue-500 px-3 py-2 rounded cursor-pointer">
                            Actions
                          </MenuButton>
                          <MenuItems className="absolute right-0 mb-2 w-40 bg-white border rounded shadow-lg z-50">
                            <MenuItem>
                              {() => (
                                <Buttons
                                  onClick={() => handleEdit(exp)}
                                  label={
                                    <>
                                      <CiEdit />
                                      Edit
                                    </>
                                  }
                                  className="edit-btn"
                                />
                              )}
                            </MenuItem>
                            <MenuItem>
                              {() => (
                                <Buttons
                                  onClick={() => handleDelete(exp.id)}
                                  label={
                                    <>
                                      <MdDeleteOutline />
                                      Delete
                                    </>
                                  }
                                  className="delete-btn"
                                />
                              )}
                            </MenuItem>
                          </MenuItems>
                        </Menu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="no-data">
                      `No expenses found for ${searchTerm}`
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />

            {showConfirm && (
              <Confirmation
                type="delete"
                confirm={confirmDelete}
                cancel={() => setShowConfirm(false)}
                message="Delete this expense?"
              />
            )}

            {statusChangeData?.showConfirm && (
              <Confirmation
                type="edit"
                confirm={confirmStatusChange}
                cancel={() => setStatusChangeData(null)}
                message={`Change status to "${statusChangeData.newStatus}"?`}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default UserExpense;
