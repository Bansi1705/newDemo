import type { JSX } from "react";

export interface User {
  id?: number;
  name: string;
  age: number;
  birthdate: string;
  uploadFile: File | string | null;
}
export interface ExpenseData {
  id?: number;
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
export interface LoginData {
  email: string;
  password: string;
}
export interface OtpProps {
  otpValue: string;
  setOtpValue: (value: string) => void;
}
export interface buttonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  label: string | JSX.Element;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}
export interface inputProps {
  type: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  classname?: string;
  id?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

export interface dropdownOption {
  selectName: string;
  selectValue: string;
  disabled?: boolean;
  selectClasName?: string;
  dropDownChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  optionsLabel?: string[];
  error?: string;
  placeholder?: string;
}

export interface searchBarProps {
  searchTerm?: string;
  searchPlaceholder?: string;
  searchOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchClssName?: string;
}

export interface paginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface ApiResponse<T> {
  status?: number;
  message?: string;
  data: T;
  success?: boolean;
}
export interface tableData {
  categoryName: string;
  actualMTD: number;
  budgetMTD: number;
  variance: number;
  commentCount: number;
  budgetMTH: number;
  varianceMTH: number;
  forecastMTH: number;
  isHeader: boolean;
  categoryTitle: string;
  categories: {
    sourceOfRevenue: tableData[];
    departmentExpenses: tableData[];
    departmentProfit: tableData[];
    generalExpenses: tableData[];
  };
}
export interface RoomDataInterface {
  isoDate: string;
  roomsCount: number;
  roomNumber: number;
  note: string | null;
  createdBy: number | null;
  modifiedBy: number | null;
  createdAt: string | null;
  subArray: RoomDataInterface[];
}
