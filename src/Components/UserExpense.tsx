import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { ExpenseData } from "../types";
import { ReactDatePicker } from "./CommonComponents/DatePicker";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Confirmation from "./CommonComponents/Confirmation";
import "./UserExpence.css";

type Props = {
  setShowExpenseForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserExpense = ({ setShowExpenseForm }: Props) => {
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [form, setForm] = useState<ExpenseData>({
    expenseId: Date.now(),
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

  const [editExpense, setEditExpense] = useState<ExpenseData | null>(null);
  const [deleteExpenseId, setDeleteExpenseId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<any>({});

  const categoryData: Record<string, string[]> = {
    Food: ["Lunch", "Dinner", "Snacks"],
    Travel: ["Bus", "Train", "Flight"],
    Office: ["Stationary", "Software"],
  };

  useEffect(() => {
    fetch("http://localhost:5000/UserExpenses")
      .then((res) => res.json())
      .then((data: ExpenseData[]) => setExpenses(data));
  }, []);

  const validate = () => {
    const newError: any = {};
    if (!form.expenseTitle.trim()) newError.expenseTitle = "Title required";
    if (!form.amount || form.amount <= 0) newError.amount = "Amount required";
    if (!form.expenseDate) newError.expenseDate = "Expense date required";
    if (!form.submissionDate)
      newError.submissionDate = "Submission date required";
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
          `http://localhost:5000/UserExpenses/${editExpense.expenseId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          },
        );
      } else {
        res = await fetch("http://localhost:5000/UserExpenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      const savedExpense = await res.json();

      setExpenses((prev) =>
        editExpense
          ? prev.map((exp) =>
              exp.expenseId === editExpense.expenseId ? savedExpense : exp,
            )
          : [...prev, savedExpense],
      );

      toast.success(editExpense ? "Expense Updated ✅" : "Expense Added ✅");

      setForm({
        expenseId: Date.now(),
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
    } catch {
      toast.error("Error saving expense ❌");
    }
  };

  const handleEdit = (expense: ExpenseData) => {
    setEditExpense(expense);
    setForm(expense);
  };

  const handleDelete = (id: number) => {
    setDeleteExpenseId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteExpenseId) return;
    await fetch(`http://localhost:5000/UserExpenses/${deleteExpenseId}`, {
      method: "DELETE",
    });
    setExpenses(expenses.filter((exp) => exp.expenseId !== deleteExpenseId));
    toast.success("Expense Deleted ✅");
    setDeleteExpenseId(null);
    setShowConfirm(false);
  };

  return (
    <div className="expense-form-data">
      <form className="expense-form" onSubmit={handleSubmit}>
        <input
          className="input-field"
          name="expenseTitle"
          placeholder="Title"
          value={form.expenseTitle}
          onChange={handleChange}
        />
        <input
          className="input-field"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <select
          className="input-field"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          {Object.keys(categoryData).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="input-field"
          name="subCategory"
          value={form.subCategory}
          onChange={handleChange}
        >
          <option value="">Select SubCategory</option>
          {categoryData[form.category]?.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          className="input-field"
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
        />
        <select
          className="input-field"
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
        >
          <option value="">Payment Method</option>
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
        </select>
        <input
          className="input-field"
          name="invoiceNumber"
          placeholder="Invoice No"
          value={form.invoiceNumber}
          onChange={handleChange}
        />
        <ReactDatePicker
          className="input-field"
          selectedDate={form.expenseDate}
          onChange={(d) => setForm({ ...form, expenseDate: d })}
        />
        <ReactDatePicker
          className="input-field"
          selectedDate={form.submissionDate}
          onChange={(d) => setForm({ ...form, submissionDate: d })}
        />
        <input
          className="input-field"
          name="employeeId"
          placeholder="Employee ID"
          value={form.employeeId}
          onChange={handleChange}
        />
        <input
          className="input-field"
          name="employeeName"
          placeholder="Employee Name"
          value={form.employeeName}
          onChange={handleChange}
        />
        <input
          className="input-field"
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
        />
        <input
          className="input-field"
          name="assignedTo"
          placeholder="Assigned To"
          value={form.assignedTo}
          onChange={handleChange}
        />
        <select
          className="input-field"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <div className="form-buttons">
          <button type="submit">{editExpense ? "Update" : "Save"}</button>
          <button type="button" onClick={() => setShowExpenseForm(false)}>
            Cancel
          </button>
        </div>
      </form>

      {expenses.length > 0 && (
        <div className="user-data">
          <h2>Expenses List</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Category</th>
                <th>SubCategory</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Expense Date</th>
                <th>Submission Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.expenseId}>
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
                    <button onClick={() => handleEdit(exp)}>
                      <CiEdit />
                    </button>
                    <button onClick={() => handleDelete(exp.expenseId)}>
                      <MdDeleteOutline />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showConfirm && (
            <Confirmation
              confirm={confirmDelete}
              cancel={() => setShowConfirm(false)}
              message="Delete this expense?"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UserExpense;