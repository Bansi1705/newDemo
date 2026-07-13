import type { JSX } from "react";

export interface User {
  id?: number;
  name: string;
  age: number;
  birthdate: string;
  uploadFile: {
    name:string;
    url:string;
  }[];
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
  userDevice?: string;
  userIp: string;
}
export interface OtpProps {
  otpValue: string;
  setOtpValue: (value: string) => void;
  className?:string;
}
export interface buttonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  label: string | JSX.Element;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  dataTestid?:string;
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
  label?: string;
  required?: boolean;
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
  label?: string;
  required?: boolean;
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

export interface PropertyDataInterface {
  propertyName: string;
  departmentTotalBudget: number;
  ab: number;
  ttm: number;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  alternatePhoneNumber: string;
  gender: string;
  dateOfBirth: Date | null;

  companyName: string;
  department: string;
  designation: string;
  employeeId: string;

  address: [
    {
      city: string;
      state: string;
      country: string;
      zipcode: string;
      district: string;
    },
  ];

  username: string;
  password: string;
  confirmPassword: string;

  website: string;
  description: string;
  notes: string;
  status: string;
  profileImage: {
    name: string;
    url: string;
  }[];
  createdBy: string;
  updatedBy: string;
}
