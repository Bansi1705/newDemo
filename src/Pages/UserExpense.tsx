import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { ExpenseData } from "../types";
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

type Props = {
  setShowExpenseForm: React.Dispatch<React.SetStateAction<boolean>>;
};

interface StatusChangeData {
  id: number | string;
  newStatus: string;
  showConfirm: boolean;
}

const UserExpense = ({ setShowExpenseForm }: Props) => {
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [form, setForm] = useState<ExpenseData>({
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

  const [statusChangeData, setStatusChangeData] =
    useState<StatusChangeData | null>(null);

  const [editExpense, setEditExpense] = useState<ExpenseData | null>(null);
  const [deleteExpenseId, setDeleteExpenseId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");

  const categoryData: Record<string, string[]> = {
    Food: ["Lunch", "Dinner", "Snacks"],
    Travel: ["Bus", "Train", "Flight"],
    Office: ["Stationary", "Software"],
  };

  const paymentMethods = ["Cash", "UPI", "Card"];

  useEffect(() => {
    fetch("http://localhost:5000/UserExpenses")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch expenses");
        return res.json();
      })
      .then((data: ExpenseData[]) => setExpenses(data))
      .catch((error) => {
        toast.error(`Error loading expenses: ${error.message}`);
      });
  }, []);

  const validate = () => {
    const newError: any = {};
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      let res;
      if (editExpense) {
        res = await fetch(
          `http://localhost:5000/UserExpenses/${editExpense.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...form,
              expenseDate: form.expenseDate?.toISOString(),
              submissionDate: form.submissionDate?.toISOString(),
            }),
          },
        );
      } else {
        res = await fetch("http://localhost:5000/UserExpenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            expenseDate: form.expenseDate?.toISOString(),
            submissionDate: form.submissionDate?.toISOString(),
          }),
        });
      }

      const savedExpense = await res.json();

      setExpenses((prev) =>
        editExpense
          ? prev.map((exp) => (exp.id === editExpense.id ? savedExpense : exp))
          : [...prev, savedExpense],
      );

      toast.success(editExpense ? "Expense Updated ✅" : "Expense Added ✅");

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
    } catch (error) {
      toast.error(
        `Error saving expense: ${error instanceof Error ? error.message : "Unknown error"} ❌`,
      );
    }
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

  const handleDelete = (id: number) => {
    setDeleteExpenseId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteExpenseId) return;
    try {
      const res = await fetch(
        `http://localhost:5000/UserExpenses/${deleteExpenseId}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error("Delete failed");

      setExpenses(expenses.filter((exp) => exp.id !== deleteExpenseId));
      toast.success("Expense Deleted ✅");
    } catch (error) {
      toast.error(
        `Error deleting expense: ${error instanceof Error ? error.message : "Unknown error"} `,
      );
    }
    setDeleteExpenseId(null);
    setShowConfirm(false);
  };

  const filteredExpenses = expenses.filter(
    (exp) =>
      exp.employeeName &&
      exp.employeeName.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  const handleStatusChange = (id: number, newStatus: string) => {
    const current = expenses.find((exp) => exp.id === id);
    if (
      (current?.status === "Approved" || current?.status === "Rejected") &&
      newStatus === "Pending"
    ) {
      toast.error("Cannot change back to Pending status");
      return;
    }
    setStatusChangeData({ id, newStatus, showConfirm: true });
  };

  const confirmStatusChange = async () => {
    if (!statusChangeData) return;

    try {
      const res = await fetch(
        `http://localhost:5000/UserExpenses/${statusChangeData.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: statusChangeData.newStatus }),
        },
      );
      if (!res.ok) throw new Error("Status update failed");
      const updated = await res.json();
      setExpenses((prev) =>
        prev.map((exp) => (exp.id == statusChangeData.id ? updated : exp)),
      );
      toast.success("Status Updated ✅");
    } catch (error) {
      toast.error(
        `Error updating status: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
    setStatusChangeData(null);
  };

  const statusChange = [
    { value: "Pending", label: "Pending", color: "#ffc107" },
    { value: "Approved", label: "Approved", color: "#28a745" },
    { value: "Rejected", label: "Rejected", color: "#dc3545" },
  ];

  const headings = [
    { key: "employeeName", label: "Employee Name" },
    { key: "category", label: "Category" },
    { key: "subCategory", label: "SubCategory" },
    { key: "amount", label: "Amount" },
    { key: "paymentMethod", label: "Payment Method" },
    { key: "expenseDate", label: "Expense Date" },
    { key: "submissionDate", label: "Submission Date" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <>
      <Header />
      <div className="expense-form-data">

        <form className="expense-form" onSubmit={handleSubmit}>
          <h2 className="expense-title">{editExpense ? "Edit Expense" : "Add New Expense"}</h2>
          <InputField
            type="text"
            name="expenseTitle"
            placeholder="Title"
            value={form.expenseTitle}
            onChange={handleChange}
            error={error.expenseTitle}
            classname="input-field"
          />

          <InputField
            type="text"
            name="description"
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
          />
          {error.expenseDate && (
            <span className="error">{error.expenseDate}</span>
          )}

          <ReactDatePicker
            selectedDate={form.submissionDate}
            onChange={(d) => setForm({ ...form, submissionDate: d })}
            placeholder="Select Submission Date"
          />
          {error.submissionDate && (
            <span className="error">{error.submissionDate}</span>
          )}

          <InputField
            type="text"
            name="employeeId"
            placeholder="Employee ID"
            value={form.employeeId}
            onChange={handleChange}
            error={error.employeeId}
            classname="input-field"
          />

          <InputField
            type="text"
            name="employeeName"
            placeholder="Employee Name"
            value={form.employeeName}
            onChange={handleChange}
            error={error.employeeName}
            classname="input-field"
          />
          <InputField
            type="text"
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            error={error.department}
            classname="input-field"
          />
          <InputField
            type="text"
            name="assignedTo"
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
          <div className="form-buttons">
            <Buttons
              type="submit"
              label={editExpense ? "Update" : "Save"}
              className="submit-btn"
            />
            <Buttons
              type="button"
              label="Cancel"
              className="cancel-btn"
              onClick={() => setShowExpenseForm(false)}
            />
          </div>
        </form>

        {expenses.length > 0 && (
          <div className="expense-user-data">
            <h2>Expenses List</h2>
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
                  {headings.map((heading) => (
                    <th key={heading.key}>{heading.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((exp) => (
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
                            handleStatusChange(exp.id, e.target.value)
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
                        <Buttons
                          onClick={() => handleDelete(exp.id)}
                          label={<MdDeleteOutline />}
                          className="delete-btn"
                        />

                        <Buttons
                          onClick={() => handleEdit(exp)}
                          label={<CiEdit />}
                          className="edit-btn"
                        />
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

            {showConfirm && (
              <Confirmation
                confirm={confirmDelete}
                cancel={() => setShowConfirm(false)}
                message="Delete this expense?"
              />
            )}

            {statusChangeData?.showConfirm && (
              <Confirmation
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
