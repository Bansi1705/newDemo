import { useEffect, useState } from "react";
import type { UserProfile } from "../Interface/types";
import InputField from "../Components/CommonComponents/InputFeild";
import { DropDown } from "../Components/CommonComponents/DropDown";
import { ReactDatePicker } from "../Components/CommonComponents/DatePicker";
import { Buttons } from "../Components/CommonComponents/Buttons";
import Header from "../Components/Header";
import "../Styles/UserProfile.css";
import FileUpload from "../Components/CommonComponents/FileUpload";
import { CONSTANT } from "../Services/Constant";
import { COMMON_SERVICES } from "../Services/CommonService/CommonServices";
import { MdDeleteOutline, MdOutlinePreview } from "react-icons/md";
import FilePreview from "../Components/CommonComponents/FilePreview";
import { toast } from "react-toastify";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { CiEdit } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa6";
import Confirmation from "../Components/CommonComponents/Confirmation";
import PasswordInput from "../Components/CommonComponents/PasswordInput";

function UserProfile() {
  const initialState: UserProfile = {
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    alternatePhoneNumber: "",
    gender: "",
    dateOfBirth: null,

    companyName: "",
    department: "",
    designation: "Intern",
    employeeId: "",

    address: [
      {
        country: "",
        state: "",
        city: "",
        district: "",
        zipcode: "",
      },
    ],

    username: "",
    password: "",
    confirmPassword: "",

    website: "",
    description: "",
    notes: "",
    status: "Active",
    profileImage: [],
    createdBy: "",
    updatedBy: "",
  };

  const [userData, setUserData] = useState<UserProfile[]>([]);
  const [formData, setFormData] = useState<UserProfile>(initialState);
  const [imagePreView, setImagePreView] = useState<string[] | null>(null);
  const [showPreView, setShowPreView] = useState<boolean>(false);
  const [error, setError] = useState<Record<string, string>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [deletId, setDeleteId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [confirmMsg, setConfirmMsg] = useState<string>("");
  const [addUser, setAddUser] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    const updatedValue =
      name === "password" || name === "confirmPassword"
        ? value.slice(0, 6)
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    if (name === "employeeId") {
      setError((prev) => ({
        ...prev,
        employeeId: userData.find((id) => value === id.employeeId)
          ? "Enter Unique Id"
          : "",
      }));
    }

    if (name === "password") {
      setError((prev) => ({
        ...prev,

        password:
          updatedValue.trim() === ""
            ? CONSTANT.VALIDATION.PASSWORD
            : updatedValue.length < 6
              ? "Password must be at least 6 characters"
              : "",

        confirmPassword:
          formData.confirmPassword && updatedValue !== formData.confirmPassword
            ? "Passwords do not match"
            : "",
      }));

      return;
    }

    if (name === "confirmPassword") {
      setError((prev) => ({
        ...prev,

        confirmPassword:
          updatedValue.trim() === ""
            ? CONSTANT.VALIDATION.CONFIRMPASSWORD
            : updatedValue !== formData.password
              ? "Passwords do not match"
              : "",
      }));

      return;
    }

    if (isSubmitted) {
      setError((prev) => ({
        ...prev,

        [name]:
          updatedValue.trim() === ""
            ? CONSTANT.VALIDATION[
                name.toUpperCase() as keyof typeof CONSTANT.VALIDATION
              ]
            : "",
      }));
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      address: [
        {
          ...prev.address[0],
          [name]: name === "zipcode" ? value.slice(0, 6) : value,
        },
      ],
    }));

    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newError: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newError.firstName = CONSTANT.VALIDATION.FIRSTNAME;
    }

    if (!formData.lastName.trim()) {
      newError.lastName = CONSTANT.VALIDATION.LASTNAME;
    }

    if (!formData.fullName.trim()) {
      newError.fullName = CONSTANT.VALIDATION.FULLNAME;
    }

    if (!formData.email.trim()) {
      newError.email = CONSTANT.VALIDATION.EMAIL;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newError.email = "Invalid Email Address";
    }

    if (!formData.phoneNumber.trim()) {
      newError.phoneNumber = CONSTANT.VALIDATION.PHONENUMBER;
    }

    if (!formData.gender) {
      newError.gender = CONSTANT.VALIDATION.GENDER;
    }

    if (!formData.dateOfBirth) {
      newError.dateOfBirth = CONSTANT.VALIDATION.DATEOFBIRTH;
    }

    const today = new Date();
    const minAgeDate = new Date(
      today.getFullYear() - 14,
      today.getMonth(),
      today.getDate(),
    );

    if (formData.dateOfBirth && formData.dateOfBirth > minAgeDate) {
      newError.dateOfBirth = "User must be at least 14 years old";
    }

    if (!formData.companyName.trim()) {
      newError.companyName = CONSTANT.VALIDATION.COMPANYNAME;
    }

    if (!formData.department.trim()) {
      newError.department = CONSTANT.VALIDATION.DEPARTMENT;
    }

    if (!formData.designation.trim()) {
      newError.designation = CONSTANT.VALIDATION.DESIGNATION;
    }

    if (!formData.employeeId.trim()) {
      newError.employeeId = CONSTANT.VALIDATION.EMPLOYEEID;
    }

    if (!formData.username.trim()) {
      newError.username = CONSTANT.VALIDATION.USERNAME;
    }

    if (!formData.password.trim()) {
      newError.password = CONSTANT.VALIDATION.PASSWORD;
    } else if (formData.password.length < 6) {
      newError.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newError.confirmPassword = CONSTANT.VALIDATION.CONFIRMPASSWORD;
    } else if (formData.password !== formData.confirmPassword) {
      newError.confirmPassword = "Passwords do not match";
    }

    if (!formData.website.trim()) {
      newError.website = CONSTANT.VALIDATION.WEBSITE;
    } else if (
      !/^(https?:\/\/)?([a-z\d]([a-z\d-]*[a-z\d])*\.)+[a-z]{2,}(\/.*)?$/i.test(
        formData.website,
      )
    ) {
      newError.website = "Enter proper website";
    }

    if (!formData.description.trim()) {
      newError.description = CONSTANT.VALIDATION.DESCRIPTION;
    }

    if (!formData.notes.trim()) {
      newError.notes = CONSTANT.VALIDATION.NOTES;
    }

    if (formData.profileImage?.length == 0) {
      newError.profileImage = CONSTANT.VALIDATION.PROFILEIMAGE;
    }

    if (!formData.createdBy.trim()) {
      newError.createdBy = CONSTANT.VALIDATION.CREATEDBY;
    }

    if (!formData.updatedBy.trim()) {
      newError.updatedBy = CONSTANT.VALIDATION.UPDATEDBY;
    }

    if (!formData.address[0].country.trim()) {
      newError.country = CONSTANT.VALIDATION.COUNTRY;
    }

    if (!formData.address[0].state.trim()) {
      newError.state = CONSTANT.VALIDATION.STATE;
    }

    if (!formData.address[0].city.trim()) {
      newError.city = CONSTANT.VALIDATION.CITY;
    }

    if (!formData.address[0].district.trim()) {
      newError.district = CONSTANT.VALIDATION.DISTRICT;
    }

    if (!formData.address[0].zipcode.trim()) {
      newError.zipcode = CONSTANT.VALIDATION.ZIPCODE;
    } else if (formData.address[0].zipcode.length > 6) {
      newError.zipcode = "ZipCode Must be 6 digit";
    }

    setError(newError);

    console.log("Validation Errors:", newError);

    return Object.keys(newError).length === 0;
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validate()) {
      console.log("Form Validation Failed");
      return;
    }

    let updatedData;
    if (editId !== null) {
      setShowConfirm(true);
      return;
    } else {
      updatedData = [...userData, formData];
      toast.success(CONSTANT.SUCCESS.CREATE);
    }

    setUserData(updatedData);
    localStorage.setItem("UserProfiles", JSON.stringify(updatedData));
    setEditId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData(initialState);
    setError({});
    setAddUser(false);
    setIsSubmitted(false);
  };

  const statusOptions = [
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
  ];

  const userProfileTableHeader = [
    { key: "srNo", label: "Sr No" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "alternatePhoneNumber", label: "Alternate Phone Number" },
    { key: "gender", label: "Gender" },
    { key: "dateOfBirth", label: "Birth Date" },
    { key: "companyName", label: "Company Name" },
    { key: "department", label: "Department" },
    { key: "designation", label: "Designation" },
    { key: "employeeId", label: "Employee Id" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "country", label: "Country" },
    { key: "zipcode", label: "Zipcode" },
    { key: "district", label: "District" },
    { key: "username", label: "Username" },
    { key: "website", label: "Website" },
    { key: "status", label: "Status" },
    { key: "profileImage", label: "Profile Image" },
    { key: "description", label: "Description" },
    { key: "notes", label: "Notes" },
    { key: "createdBy", label: "Created By" },
    { key: "updatedBy", label: "Updated By" },
    { key: "operations", label: "Operations" },
  ];

  const handleShowPreview = (image: string[]) => {
    setShowPreView(true);
    setImagePreView(image);
  };
  const handleClosePreview = () => {
    setShowPreView(false);
    setImagePreView(null);
  };

  useEffect(() => {
    const storedData = localStorage.getItem("UserProfiles");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  const handleEdit = (id: string) => {
    resetForm();
    setAddUser(true);
    const editData = userData.find((item) => item.employeeId === id);
    const name = COMMON_SERVICES.formatText(editData?.fullName);
    if (editData) {
      setFormData(editData);
    }
    setEditId(id);
    setConfirmMsg(`Do You Really Want To Edit ${name} User ??`);
  };

  const handleDelete = (id: string) => {
    const data = userData.find((user) => user.employeeId == id);
    const name = COMMON_SERVICES.formatText(data?.fullName);
    setConfirmMsg(`Do You Want To Delete ${name} User`);
    setShowConfirm(true);
    setDeleteId(id);
  };

  const handleConfirm = () => {
    if (deletId) {
      const filteredUser = userData.filter(
        (item) => item.employeeId !== deletId,
      );
      setUserData(filteredUser);
      localStorage.setItem("UserProfiles", JSON.stringify(filteredUser));
      toast.success(CONSTANT.SUCCESS.DELETE);
      setDeleteId(null);
    } else if (editId) {
      const updatedUser = userData.map((user) => {
        return user.employeeId == editId ? formData : user;
      });

      setUserData(updatedUser);
      localStorage.setItem("UserProfiles", JSON.stringify(updatedUser));
      toast.success(CONSTANT.SUCCESS.UPDATE);
      setEditId(null);
      resetForm();
    }

    setShowConfirm(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setEditId(null);
    setDeleteId(null);
    resetForm();
  };

  const designationType: string[] = [
    "Intern",
    "Trainee",
    "Team Lead",
    "Manager",
    "Senior Manager",
    "Project Manager",
    "Business Analyst",
    "Software Developer",
    "Senior Software Developer",
    "QA Engineer",
    "UI/UX Designer",
    "HR Executive",
    "Accountant",
    "Administrator",
    "Director",
    "Vice President",
    "CEO",
  ];
  return (
    <>
      <Header />

      <div className="userProfile-form-data">
        <div className="flex align-center justify-between">
          <h1 className="userProfile-title">User Records</h1>
          <Buttons
            label="Add User"
            onClick={() => {
              if (addUser) {
                resetForm();
              } else {
                setAddUser(true);
              }
            }}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 transition-colors whitespace-nowrap my-auto"
          />
        </div>

        {addUser && (
          <form className="userProfile-form">
            <h3 className="userProfile-title">
              {!editId ? "Add New User" : "Edit user"}
            </h3>

            <InputField
              label="First Name"
              required={true}
              type="text"
              name="firstName"
              id="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              error={error.firstName}
              classname="input-field"
            />

            <InputField
              label="Last Name"
              required={true}
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              error={error.lastName}
              classname="input-field"
            />

            <InputField
              label="Full Name"
              required={true}
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              error={error.fullName}
              classname="input-field"
            />

            <InputField
              label="Email"
              required={true}
              type="email"
              name="email"
              id="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              error={error.email}
              classname="input-field"
            />

            <InputField
              label="Phone Number"
              required={true}
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              placeholder="+1-212-456-7890"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  phoneNumber: COMMON_SERVICES.formtePhoneNumber(
                    e.target.value,
                  ),
                }))
              }
              error={error.phoneNumber}
              classname="input-field"
            />

            <InputField
              label="Alternate Phone Number"
              type="tel"
              name="alternatePhoneNumber"
              id="alternatePhoneNumber"
              placeholder="+1-212-456-7890"
              value={formData.alternatePhoneNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  alternatePhoneNumber: COMMON_SERVICES.formtePhoneNumber(
                    e.target.value,
                  ),
                }))
              }
              error={error.alternatePhoneNumber}
              classname="input-field"
            />

            <div className="gender-section">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                />
                Male
              </label>

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                />
                Female
              </label>

              {error.gender && <p className="error-message">{error.gender}</p>}
            </div>

            <ReactDatePicker
              selectedDate={formData.dateOfBirth}
              className="w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              onChange={(d) => {
                setFormData({
                  ...formData,
                  dateOfBirth: d,
                });

                setError((prev) => ({
                  ...prev,
                  dateOfBirth: "",
                }));
              }}
              placeholder="Select Birth Date"
              error={error.dateOfBirth}
            />

            <InputField
              label="Company Name"
              required={true}
              type="text"
              name="companyName"
              id="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              error={error.companyName}
              classname="input-field"
            />

            <InputField
              label="Department"
              required={true}
              type="text"
              name="department"
              id="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              error={error.department}
              classname="input-field"
            />

            <DropDown
              optionsLabel={designationType.map((i) => i)}
              selectClasName="input-field"
              selectValue={formData.designation}
              dropDownChange={handleChange}
              selectName="designation"
              label="Designation"
              required={true}
            />

            <InputField
              label="Employee ID"
              required={true}
              type="text"
              name="employeeId"
              id="employeeId"
              placeholder="Employee ID"
              value={formData.employeeId}
              onChange={handleChange}
              error={error.employeeId}
              classname="input-field"
            />

            <InputField
              label="Username"
              required={true}
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              error={error.username}
              classname="input-field"
            />

            <PasswordInput
              name="password"
              value={formData.password}
              handleChange={handleChange}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              label="Password"
              required={true}
              classname="input-field"
            />
            {error.password && (
              <span className="error-message">{error.password}</span>
            )}

            <PasswordInput
              name="confirmPassword"
              value={formData.confirmPassword}
              handleChange={handleChange}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              label="Confirmation Password"
              required={true}
              classname="input-field"
            />
            {error.confirmPassword && (
              <span className="error-message">{error.confirmPassword}</span>
            )}
            <InputField
              label="Website"
              required={true}
              type="text"
              name="website"
              id="website"
              placeholder="Website"
              value={formData.website}
              onChange={handleChange}
              error={error.website}
              classname="input-field"
            />

            <InputField
              label="Description"
              required={true}
              type="text"
              name="description"
              id="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              error={error.description}
              classname="input-field"
            />

            <InputField
              label="Notes"
              required={true}
              type="text"
              name="notes"
              id="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
              error={error.notes}
              classname="input-field"
            />

            <DropDown
              optionsLabel={statusOptions.map((i) => i.label)}
              selectClasName="input-field"
              selectValue={formData.status}
              dropDownChange={handleChange}
              selectName="status"
              label="Status"
              required={true}
            />

            <FileUpload
              label="Upload Image"
              accept="*/*"
              required={true}
              multipleFile={true}
              onFileSelect={(file) => {
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => {
                  setFormData((prev) => ({
                    ...prev,
                    profileImage: editId
                      ? [reader.result as string]
                      : [...prev.profileImage, reader.result as string],
                  }));
                };

                reader.readAsDataURL(file);
              }}
            />

            {error.profileImage && (
              <span className="error-message">{error.profileImage}</span>
            )}

            <InputField
              label="Created By"
              required={true}
              type="text"
              name="createdBy"
              id="createdBy"
              placeholder="Created By"
              value={formData.createdBy}
              onChange={handleChange}
              error={error.createdBy}
              classname="input-field"
            />

            <InputField
              label="Updated By"
              required={true}
              type="text"
              name="updatedBy"
              id="updatedBy"
              placeholder="Updated By"
              value={formData.updatedBy}
              onChange={handleChange}
              error={error.updatedBy}
              classname="input-field"
            />

            <InputField
              label="Country"
              required={true}
              type="text"
              name="country"
              id="country"
              placeholder="Country"
              value={formData.address[0].country}
              onChange={handleAddressChange}
              error={error.country}
              classname="input-field"
            />

            <InputField
              label="State"
              required={true}
              type="text"
              name="state"
              id="state"
              placeholder="State"
              value={formData.address[0].state}
              onChange={handleAddressChange}
              error={error.state}
              classname="input-field"
            />

            <InputField
              label="City"
              required={true}
              type="text"
              name="city"
              id="city"
              placeholder="City"
              value={formData.address[0].city}
              onChange={handleAddressChange}
              error={error.city}
              classname="input-field"
            />

            <InputField
              label="District"
              required={true}
              type="text"
              name="district"
              id="district"
              placeholder="District"
              value={formData.address[0].district}
              onChange={handleAddressChange}
              error={error.district}
              classname="input-field"
            />

            <InputField
              label="Zipcode"
              required={true}
              type="text"
              name="zipcode"
              id="zipcode"
              placeholder="Zipcode"
              value={formData.address[0].zipcode}
              onChange={handleAddressChange}
              error={error.zipcode}
              classname="input-field"
            />

            <div className="form-buttons flex gap-4 mt-4">
              <Buttons
                label={!editId ? "Add User" : "Edit User"}
                className="submit-btn"
                onClick={handleSubmit}
              />

              <Buttons
                label="Cancel"
                type="button"
                onClick={resetForm}
                className="cancel-btn"
              />
            </div>
          </form>
        )}

        <div className="main-userProfileDiv">
          <table className="userProfileTable">
            <thead>
              <tr>
                {userProfileTableHeader.map((head) => (
                  <th>{head.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {userData.length === 0 ? (
                <tr>
                  <td
                    colSpan={userProfileTableHeader.length}
                    className="text-center"
                  >
                    No Data Found
                  </td>
                </tr>
              ) : (
                userData.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{COMMON_SERVICES.formatText(user.firstName)}</td>
                    <td>{COMMON_SERVICES.formatText(user.lastName)}</td>
                    <td>{COMMON_SERVICES.formatText(user.fullName)}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>
                      {user.alternatePhoneNumber.length === 0
                        ? "-"
                        : user.alternatePhoneNumber}
                    </td>
                    <td>{user.gender}</td>
                    <td>
                      {user.dateOfBirth
                        ? COMMON_SERVICES.formatCreateDate(
                            new Date(user.dateOfBirth)
                              .toISOString()
                              .split("T")[0],
                          )
                        : "-"}
                    </td>
                    <td>{COMMON_SERVICES.formatText(user.companyName)}</td>
                    <td>{COMMON_SERVICES.formatText(user.department)}</td>
                    <td>{COMMON_SERVICES.formatText(user.designation)}</td>
                    <td>{user.employeeId}</td>
                    <td>{COMMON_SERVICES.formatText(user.address[0].city)}</td>
                    <td>{COMMON_SERVICES.formatText(user.address[0].state)}</td>
                    <td>
                      {COMMON_SERVICES.formatText(user.address[0].country)}
                    </td>
                    <td>
                      {COMMON_SERVICES.formatText(user.address[0].zipcode)}
                    </td>
                    <td>
                      {COMMON_SERVICES.formatText(user.address[0].district)}
                    </td>
                    <td>{COMMON_SERVICES.formatText(user.username)}</td>
                    <td>{COMMON_SERVICES.formatText(user.website)}</td>
                    <td>{user.status}</td>
                    <td>
                      <div className="imagePreviewIcon">
                        <MdOutlinePreview
                          size={30}
                          onClick={() => handleShowPreview(user.profileImage)}
                        />
                      </div>
                    </td>
                    <td>{COMMON_SERVICES.formatText(user.description)}</td>
                    <td>{COMMON_SERVICES.formatText(user.notes)}</td>
                    <td>{COMMON_SERVICES.formatText(user.createdBy)}</td>
                    <td>{COMMON_SERVICES.formatText(user.updatedBy)}</td>
                    <td className="action-buttons">
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <MenuButton className="inline-flex items-center rounded bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
                          Actions
                          <FaChevronDown />
                        </MenuButton>
                        <MenuItems className="absolute bottom-full right-0 mb-2 w-40 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg z-50">
                          <MenuItem>
                            {() => (
                              <Buttons
                                onClick={() => handleEdit(user.employeeId)}
                                label={
                                  <>
                                    <CiEdit />
                                    Edit
                                  </>
                                }
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              />
                            )}
                          </MenuItem>

                          <MenuItem>
                            {() => (
                              <Buttons
                                onClick={() => handleDelete(user.employeeId)}
                                label={
                                  <>
                                    <MdDeleteOutline />
                                    Delete
                                  </>
                                }
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              />
                            )}
                          </MenuItem>
                        </MenuItems>
                      </Menu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {showPreView && (
            <FilePreview file={imagePreView} onClose={handleClosePreview} />
          )}
        </div>
      </div>
      {showConfirm && (
        <Confirmation
          confirm={handleConfirm}
          cancel={handleCancel}
          type={editId ? "edit" : "delete"}
          message={confirmMsg}
        />
      )}
    </>
  );
}

export default UserProfile;
