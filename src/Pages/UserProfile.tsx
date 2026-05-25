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
    designation: "",
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
    profileImage: null,
    createdBy: "",
    updatedBy: "",
  };

  const [userData, setUserData] = useState<UserProfile[]>([]);
  const [formData, setFormData] = useState<UserProfile>(initialState);
  const [imagePreView, setImagePreView] = useState<File | string | null>(null);
  const [showPreView, setShowPreView] = useState<boolean>(false);
  const [error, setError] = useState<Record<string, string>>({});
  const [editId, setEditId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
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

    if (!formData.status.trim()) {
      newError.status = CONSTANT.VALIDATION.STATUS;
    }

    if (!formData.profileImage?.trim()) {
      newError.status = CONSTANT.VALIDATION.PROFILEIMAGE;
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      console.log("Form Validation Failed");
      return;
    }

    let updatedData;
    if (editId !== null) {
      updatedData = userData.map((item) =>
        item.employeeId == editId ? formData : item,
      );
      toast.success(CONSTANT.SUCCESS.UPDATE);
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

  const handleShowPreview = (image: File | string) => {
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

  useEffect(() => {
    if (!editId) return;
    const editData = userData.find((item) => item.employeeId === editId);
    if (editData) {
      setFormData(editData);
    }
  }, [editId, userData]);

  const handleEdit = (id: string) => {
    setEditId(id);
  };

  const handleDelete = (id: string) => {
    const filteredUser = userData.filter((item) => item.employeeId !== id);
    setUserData(filteredUser);
    localStorage.setItem("UserProfiles", JSON.stringify(filteredUser));
    toast.success(CONSTANT.SUCCESS.DELETE);
  };

  return (
    <>
      <Header />

      <div className="userProfile-form-data">
        <form className="userProfile-form" onSubmit={handleSubmit}>
          <h2 className="userProfile-title">Add New User</h2>

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
                phoneNumber: COMMON_SERVICES.formtePhoneNumber(e.target.value),
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

            {error.gender && <p className="error">{error.gender}</p>}
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
          />

          {error.dateOfBirth && (
            <span className="error">{error.dateOfBirth}</span>
          )}

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

          <InputField
            label="Designation"
            required={true}
            type="text"
            name="designation"
            id="designation"
            placeholder="Designation"
            value={formData.designation}
            onChange={handleChange}
            error={error.designation}
            classname="input-field"
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

          <InputField
            label="Password"
            required={true}
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            error={error.password}
            classname="input-field"
          />

          <InputField
            label="Confirm Password"
            required={true}
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={error.confirmPassword}
            classname="input-field"
          />

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

          {error.status && <span className="error">{error.status}</span>}

          <FileUpload
            label="Upload Image"
            accept="image/*"
            required={true}
            onFileSelect={(file) => {
              if (!file) return;

              const reader = new FileReader();

              reader.onloadend = () => {
                setFormData((prev) => ({
                  ...prev,
                  profileImage: reader.result as string,
                }));
              };

              reader.readAsDataURL(file);
            }}
          />

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
            <Buttons label="Add User" type="submit" className="submit-btn" />

            <Buttons
              label="Cancel"
              type="button"
              onClick={resetForm}
              className="cancel-btn"
            />
          </div>
        </form>

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
                      {user.profileImage && (
                        <div className="imagePreviewIcon">
                          <MdOutlinePreview
                            size={30}
                            onClick={() => handleShowPreview(user.profileImage)}
                          />
                        </div>
                      )}
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
    </>
  );
}

export default UserProfile;
