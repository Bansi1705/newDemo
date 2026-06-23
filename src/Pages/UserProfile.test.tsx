import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";
import UserProfilePage from "./UserProfile";
import Toaster from "../Services/CommonService/ToasterHelper";

const renderUserProfilePage = () =>
  render(
    <MemoryRouter>
      <UserProfilePage />
    </MemoryRouter>,
  );
const mockUserProfileData = [
  {
    address: [
      {
        country: "United States",
        state: "gujarati",
        city: "keshod",
        district: "junagadh",
        zipcode: "123432",
      },
    ],
    city: "keshod",
    country: "United States",
    district: "junagadh",
    state: "gujarati",
    zipcode: "123432",
    alternatePhoneNumber: "",
    companyName: "TECHROVER SOLUTIONS",
    confirmPassword: "123456",
    createdBy: "bansi",
    dateOfBirth: "2011-04-20T18:30:00.000Z",
    department: "development",
    description: "desc",
    designation: "Intern",
    email: "chudasamavrunda2@gmail.com",
    employeeId: "432",
    firstName: "CHUDASAMA",
    fullName: "CHUDASAMA Kishor",
    gender: "male",
    lastName: "Kishor",
    notes: "notes",
    password: "123456",
    phoneNumber: "+1(963) 885-7370",
    profileImage: [
      {
        name: "maaa.jpg",
        url: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA",
      },
      {
        name: "image.png",
        url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZ8",
      },
    ],

    status: "Active",
    updatedBy: "vrunda",
    username: "bansi.c",
    website: "www.abc",
  },
];
describe("User Profile Page Testing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("UserProfiles", JSON.stringify(mockUserProfileData));
    renderUserProfilePage();
  });
  test("User Profile Renders", () => {
    expect(
      screen.getByRole("heading", { name: "User Records" }),
    ).toBeInTheDocument();
  });
  test("fetches data from localStorage and displays it in table", () => {
    expect(screen.getByText("Chudasama")).toBeInTheDocument();
    expect(screen.getByText("Junagadh")).toBeInTheDocument();
  });

  test("shows add form on Add User click", () => {
    fireEvent.click(screen.getByText("Add User"));
    expect(screen.getByText("Add New User")).toBeInTheDocument();
  });

  test("shows validation errors when form submitted empty", () => {
    fireEvent.click(screen.getByText("Add User"));
    fireEvent.click(screen.getAllByText("Add User")[1]);
    expect(screen.getByText("First Name is required!")).toBeInTheDocument();
    expect(screen.getByText("Last Name is required!")).toBeInTheDocument();
    expect(screen.getByText("Full Name is required!")).toBeInTheDocument();
    expect(screen.getByText("Email is required!")).toBeInTheDocument();
    expect(screen.getByText("Phone Number is required!")).toBeInTheDocument();
    expect(screen.getByText("Gender is required!")).toBeInTheDocument();
    expect(screen.getByText("Date of Birth is required!")).toBeInTheDocument();
    expect(screen.getByText("Company Name is required!")).toBeInTheDocument();
    expect(screen.getByText("Department is required!")).toBeInTheDocument();
    expect(screen.getByText("Employee ID is required!")).toBeInTheDocument();
    expect(screen.getByText("Username is required!")).toBeInTheDocument();
    expect(screen.getByText("Password is required!")).toBeInTheDocument();
    expect(
      screen.getByText("Confirm Password is required!"),
    ).toBeInTheDocument();
    expect(screen.getByText("Website is required!")).toBeInTheDocument();
    expect(screen.getByText("Description is required!")).toBeInTheDocument();
    expect(screen.getByText("Notes are required!")).toBeInTheDocument();
    expect(screen.getByText("Profile Image is required!")).toBeInTheDocument();
    expect(screen.getByText("Created By is required!")).toBeInTheDocument();
    expect(screen.getByText("Updated By is required!")).toBeInTheDocument();
    expect(screen.getByText("Country is required!")).toBeInTheDocument();
    expect(screen.getByText("State is required!")).toBeInTheDocument();
    expect(screen.getByText("City is required!")).toBeInTheDocument();
    expect(screen.getByText("District is required!")).toBeInTheDocument();
    expect(screen.getByText("Zipcode is required!")).toBeInTheDocument();
  });

  test("When click on cancle button form is disappeare", () => {
    fireEvent.click(screen.getByText("Add User"));
    expect(screen.getByText("Add New User")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Add New User")).not.toBeInTheDocument();
  });

  test("Delete user profile", () => {
    fireEvent.click(screen.getByText("Actions"));
    fireEvent.click(screen.getByText(/delete/i));
    fireEvent.click(screen.getByText("Delete"));
    expect(screen.queryByText("Chudasama")).not.toBeInTheDocument();
  });

  test("Edit user profile", () => {
    fireEvent.click(screen.getByText("Actions"));
    fireEvent.click(screen.getByText(/edit/i));
    fireEvent.change(screen.getByDisplayValue("Kishor"), {
      target: { value: "Krishna" },
    });
    fireEvent.click(screen.getByRole("button", { name: /edit user/i }));
    fireEvent.click(screen.getByText("Yes"));
    expect(screen.getByText("Krishna")).toBeInTheDocument();
    expect(screen.queryByText("Kishor")).not.toBeInTheDocument();
  });

  test("file Preview Opened", () => {
    fireEvent.click(screen.getByTestId("testImagePreview"));
    expect(screen.getByText("maaa.jpg")).toBeInTheDocument();
  });

  test("Error if Phone number formate miss match", () => {
    fireEvent.click(screen.getByText("Add User"));
    fireEvent.change(screen.getAllByPlaceholderText("+1-212-456-7890")[0], {
      target: {
        value: "23456789",
      },
    });
    expect(Toaster.error("Please Enter a Number Which Start with +1"));
  });
});
