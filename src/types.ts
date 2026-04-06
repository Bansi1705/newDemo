export interface User {
  id?: number; 
  name: string;
  age: number;
  birthdate:string;
}

export interface ExpenseData {
  expenseId: number;
  expenseTitle: string;
  description: string;
  category: string;
  subCategory: string;
  amount: number;
  paymentMethod: string;
  invoiceNumber: string;
  expenseDate: Date | null;
  submissionDate: Date | null;
  employeeId: string;
  employeeName: string;
  department: string;
  assignedTo: string;
  status: "Pending" | "Approved" | "Rejected";
}