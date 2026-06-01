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
// import InfiniteScroll from "react-infinite-scroll-component";

function UserProfile() {
  const initialUserProfileState: UserProfile = {
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

  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [userProfileForm, setUserProfileForm] = useState<UserProfile>(
    initialUserProfileState,
  );
  const [userProfileImagePreView, setUserProfileImagePreView] = useState<
    { name: string; url: string }[] | null
  >(null);
  const [previewImageUserProfileId, setPreviewImageUserProfileId] = useState<
    string | null
  >(null);
  const [showUserProfileImagePreView, setShowUserProfileImagePreView] =
    useState<boolean>(false);
  const [userProfileFormAddEditError, setUserProfileFormAddEditError] = useState<
    Record<string, string>
  >({});
  const [editUserProfileId, setEditUserProfileId] = useState<string | null>(
    null,
  );
  const [deletingUserProfileId, setDeletingUserProfileId] = useState<
    string | null
  >(null);
  const [showConfirmModel, setShowConfirmModel] = useState<boolean>(false);
  const [confirmModelMsg, setConfirmModelMsg] = useState<string>("");
  const [IsEditAbleUser, setIsEditAbleUser] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isUserProfileFormSubmitted, setIsUserProfileFormSubmitted] =
    useState(false);
  const [searchUserProfileByName, setSearchUserProfileByName] =
    useState<string>("");

  const handleUserProfileFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    const updatedValue =
      name === "password" || name === "confirmPassword"
        ? value.slice(0, 6)
        : value;

    setUserProfileForm((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    if (name === "employeeId") {
      setUserProfileFormAddEditError((prev) => ({
        ...prev,
        employeeId: userProfiles.find(
          (u) => u.employeeId === value && u.employeeId !== editUserProfileId,
        )
          ? "Enter Unique Id"
          : "",
      }));
    }

    if (name === "password") {
      setUserProfileFormAddEditError((prev) => ({
        ...prev,

        password:
          updatedValue.trim() === ""
            ? CONSTANT.VALIDATION.PASSWORD
            : updatedValue.length < 6
              ? "Password must be at least 6 characters"
              : "",

        confirmPassword:
          userProfileForm.confirmPassword &&
          updatedValue !== userProfileForm.confirmPassword
            ? "Passwords do not match"
            : "",
      }));

      return;
    }

    if (name === "confirmPassword") {
      setUserProfileFormAddEditError((prev) => ({
        ...prev,

        confirmPassword:
          updatedValue.trim() === ""
            ? CONSTANT.VALIDATION.CONFIRMPASSWORD
            : updatedValue !== userProfileForm.password
              ? "Passwords do not match"
              : "",
      }));

      return;
    }

    if (isUserProfileFormSubmitted) {
      setUserProfileFormAddEditError((prev) => ({
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

  const handleUserProfileAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;

    setUserProfileForm((prev) => ({
      ...prev,
      address: [
        {
          ...prev.address[0],
          [name]: name === "zipcode" ? value.slice(0, 6) : value,
        },
      ],
    }));

    setUserProfileFormAddEditError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newError: Record<string, string> = {};

    if (!userProfileForm.firstName.trim()) {
      newError.firstName = CONSTANT.VALIDATION.FIRSTNAME;
    }

    if (!userProfileForm.lastName.trim()) {
      newError.lastName = CONSTANT.VALIDATION.LASTNAME;
    }

    if (!userProfileForm.fullName.trim()) {
      newError.fullName = CONSTANT.VALIDATION.FULLNAME;
    }

    if (!userProfileForm.email.trim()) {
      newError.email = CONSTANT.VALIDATION.EMAIL;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(userProfileForm.email)
    ) {
      newError.email = "Invalid Email Address";
    }

    if (!userProfileForm.phoneNumber.trim()) {
      newError.phoneNumber = CONSTANT.VALIDATION.PHONENUMBER;
    }

    if (!userProfileForm.gender) {
      newError.gender = CONSTANT.VALIDATION.GENDER;
    }

    if (!userProfileForm.dateOfBirth) {
      newError.dateOfBirth = CONSTANT.VALIDATION.DATEOFBIRTH;
    }

    const today = new Date();
    const minAgeDate = new Date(
      today.getFullYear() - 14,
      today.getMonth(),
      today.getDate(),
    );

    if (
      userProfileForm.dateOfBirth &&
      userProfileForm.dateOfBirth > minAgeDate
    ) {
      newError.dateOfBirth = "User must be at least 14 years old";
    }

    if (!userProfileForm.companyName.trim()) {
      newError.companyName = CONSTANT.VALIDATION.COMPANYNAME;
    }

    if (!userProfileForm.department.trim()) {
      newError.department = CONSTANT.VALIDATION.DEPARTMENT;
    }

    if (!userProfileForm.designation.trim()) {
      newError.designation = CONSTANT.VALIDATION.DESIGNATION;
    }

    if (!userProfileForm.employeeId.trim()) {
      newError.employeeId = CONSTANT.VALIDATION.EMPLOYEEID;
    }

    if (!userProfileForm.username.trim()) {
      newError.username = CONSTANT.VALIDATION.USERNAME;
    }

    if (!userProfileForm.password.trim()) {
      newError.password = CONSTANT.VALIDATION.PASSWORD;
    } else if (userProfileForm.password.length < 6) {
      newError.passwuserProfileFormord =
        "Password must be at least 6 characters";
    }

    if (!userProfileForm.confirmPassword.trim()) {
      newError.confirmPassword = CONSTANT.VALIDATION.CONFIRMPASSWORD;
    } else if (userProfileForm.password !== userProfileForm.confirmPassword) {
      newError.confirmPassword = "Passwords do not match";
    }

    if (!userProfileForm.website.trim()) {
      newError.website = CONSTANT.VALIDATION.WEBSITE;
    } else if (
      !/^(https?:\/\/)?([a-z\d]([a-z\d-]*[a-z\d])*\.)+[a-z]{2,}(\/.*)?$/i.test(
        userProfileForm.website,
      )
    ) {
      newError.website = "Enter proper website";
    }

    if (!userProfileForm.description.trim()) {
      newError.description = CONSTANT.VALIDATION.DESCRIPTION;
    }

    if (!userProfileForm.notes.trim()) {
      newError.notes = CONSTANT.VALIDATION.NOTES;
    }

    if (userProfileForm.profileImage?.length == 0) {
      newError.profileImage = CONSTANT.VALIDATION.PROFILEIMAGE;
    }

    if (!userProfileForm.createdBy.trim()) {
      newError.createdBy = CONSTANT.VALIDATION.CREATEDBY;
    }

    if (!userProfileForm.updatedBy.trim()) {
      newError.updatedBy = CONSTANT.VALIDATION.UPDATEDBY;
    }

    if (!userProfileForm.address[0].country.trim()) {
      newError.country = CONSTANT.VALIDATION.COUNTRY;
    }

    if (!userProfileForm.address[0].state.trim()) {
      newError.state = CONSTANT.VALIDATION.STATE;
    }

    if (!userProfileForm.address[0].city.trim()) {
      newError.city = CONSTANT.VALIDATION.CITY;
    }

    if (!userProfileForm.address[0].district.trim()) {
      newError.district = CONSTANT.VALIDATION.DISTRICT;
    }

    if (!userProfileForm.address[0].zipcode.trim()) {
      newError.zipcode = CONSTANT.VALIDATION.ZIPCODE;
    } else if (userProfileForm.address[0].zipcode.length > 6) {
      newError.zipcode = "ZipCode Must be 6 digit";
    }

    setUserProfileFormAddEditError(newError);

    console.log("Validation Errors:", newError);

    return Object.keys(newError).length === 0;
  };

  const handleUserProfileFormSubmit = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setIsUserProfileFormSubmitted(true);

    if (!validate()) {
      console.log("Form Validation Failed");
      return;
    }

    let updatedData;
    if (editUserProfileId !== null) {
      setShowConfirmModel(true);
      return;
    } else {
      updatedData = [...userProfiles, userProfileForm];
      toast.success(CONSTANT.SUCCESS.CREATE);
    }

    setUserProfiles(updatedData);
    localStorage.setItem("UserProfiles", JSON.stringify(updatedData));
    setEditUserProfileId(null);
    resetUserProfileForm();
  };

  const resetUserProfileForm = () => {
    setUserProfileForm(initialUserProfileState);
    setUserProfileFormAddEditError({});
    setIsEditAbleUser(false);
    setIsUserProfileFormSubmitted(false);
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

  const handleShowUserProfilePreview = (
    image: { name: string; url: string }[],
    id: string,
  ) => {
    setShowUserProfileImagePreView(true);
    setUserProfileImagePreView(image);
    setPreviewImageUserProfileId(id);
  };
  const handleClosePreview = () => {
    setShowUserProfileImagePreView(false);
    setUserProfileImagePreView(null);
  };

  useEffect(() => {
    const storedData = localStorage.getItem("UserProfiles");
    if (storedData) {
      setUserProfiles(JSON.parse(storedData));
    }
  }, []);

  const handleUserProfileEdit = (id: string) => {
    resetUserProfileForm();
    setIsEditAbleUser(true);
    const editData = userProfiles.find((item) => item.employeeId === id);
    const name = COMMON_SERVICES.formatText(editData?.fullName);
    if (editData) {
      setUserProfileForm(editData);
    }
    setEditUserProfileId(id);
    setConfirmModelMsg(`Do You Really Want To Edit ${name} User ??`);
  };

  const handleUserProfileDelete = (id: string) => {
    const data = userProfiles.find((user) => user.employeeId == id);
    const name = COMMON_SERVICES.formatText(data?.fullName);
    setConfirmModelMsg(`Do You Want To Delete ${name} User`);
    setShowConfirmModel(true);
    setDeletingUserProfileId(id);
  };

  const handleConfirmDeleteOrEdit = () => {
    if (deletingUserProfileId) {
      const filteredUser = userProfiles.filter(
        (item) => item.employeeId !== deletingUserProfileId,
      );
      setUserProfiles(filteredUser);
      localStorage.setItem("UserProfiles", JSON.stringify(filteredUser));
      toast.success(CONSTANT.SUCCESS.DELETE);
      setDeletingUserProfileId(null);
    } else if (editUserProfileId) {
      const updatedUser = userProfiles.map((user) => {
        return user.employeeId == editUserProfileId ? userProfileForm : user;
      });

      setUserProfiles(updatedUser);
      localStorage.setItem("UserProfiles", JSON.stringify(updatedUser));
      toast.success(CONSTANT.SUCCESS.UPDATE);
      setEditUserProfileId(null);
      resetUserProfileForm();
    }

    setShowConfirmModel(false);
  };

  const handleConfrimCancelDeleteOrEdit = () => {
    setShowConfirmModel(false);
    setEditUserProfileId(null);
    setDeletingUserProfileId(null);
    resetUserProfileForm();
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

  const handleRemoveFile = (index: number) => {
    const updatedUsers = userProfiles.map((user) =>
      user.employeeId === previewImageUserProfileId
        ? {
            ...user,
            profileImage: user.profileImage.filter((_, i) => i !== index),
          }
        : user,
    );

    setUserProfiles(updatedUsers);
    localStorage.setItem("UserProfiles", JSON.stringify(updatedUsers));

    setUserProfileImagePreView(
      (prev) => prev?.filter((_, i) => i !== index) ?? null,
    );
  };

  const filterByName = userProfiles.filter((user) =>
    user.firstName
      .toLowerCase()
      .includes(searchUserProfileByName.toLowerCase()),
  );

  // const [visibleCount, setVisibleCount] = useState(5);
  // const fetchMoreData = () => {
  //   setVisibleCount((prev) => prev + 5);
  // };
  const [visibleCount, setVisibleCount] = useState(5);

  const handleProfileListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollTop + clientHeight >= scrollHeight - 1) {
      setVisibleCount((prev) => prev + 3);
    }
  };
  const visibleUsers = filterByName.slice(0, visibleCount);

  return (
    <>
      <Header
        searchShow={true}
        search={searchUserProfileByName}
        setSearch={setSearchUserProfileByName}
      />

      <div className="userProfile-form-data">
        <div className="flex align-center justify-between">
          <h1 className="userProfile-title">User Records</h1>
          <Buttons
            label="Add User"
            onClick={() => {
              if (IsEditAbleUser) {
                resetUserProfileForm();
              } else {
                setIsEditAbleUser(true);
              }
            }}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 transition-colors whitespace-nowrap my-auto"
          />
        </div>

        {IsEditAbleUser && (
          <form className="userProfile-form">
            <h3 className="userProfile-title">
              {!editUserProfileId ? "Add New User" : "Edit user"}
            </h3>

            <InputField
              label="First Name"
              required={true}
              type="text"
              name="firstName"
              id="firstName"
              placeholder="First Name"
              value={userProfileForm.firstName}
              onChange={handleUserProfileFormChange}
              error={userProfileFormAddEditError.firstName}
              classname="input-field"
            />

            <InputField
              label="Last Name"
              required={true}
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Last Name"
              value={userProfileForm.lastName}
              onChange={handleUserProfileFormChange}
              error={userProfileFormAddEditError.lastName}
              classname="input-field"
            />

            <InputField
              label="Full Name"
              required={true}
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Full Name"
              value={userProfileForm.fullName}
              onChange={handleUserProfileFormChange}
              error={userProfileFormAddEditError.fullName}
              classname="input-field"
            />

            <InputField
              label="Email"
              required={true}
              type="email"
              name="email"
              id="email"
              placeholder="example@gmail.com"
              value={userProfileForm.email}
              onChange={handleUserProfileFormChange}
              error={userProfileFormAddEditError.email}
              classname="input-field"
            />

            <InputField
              label="Phone Number"
              required={true}
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              placeholder="+1-212-456-7890"
              value={userProfileForm.phoneNumber}
              onChange={(e) =>
                setUserProfileForm((prev) => ({
                  ...prev,
                  phoneNumber: COMMON_SERVICES.formtePhoneNumber(
                    e.target.value,
                  ),
                }))
              }
              error={userProfileFormAddEditError.phoneNumber}
              classname="input-field"
            />

            <InputField
              label="Alternate Phone Number"
              type="tel"
              name="alternatePhoneNumber"
              id="alternatePhoneNumber"
              placeholder="+1-212-456-7890"
              value={userProfileForm.alternatePhoneNumber}
              onChange={(e) =>
                setUserProfileForm((prev) => ({
                  ...prev,
                  alternatePhoneNumber: COMMON_SERVICES.formtePhoneNumber(
                    e.target.value,
                  ),
                }))
              }
              error={userProfileFormAddEditError.alternatePhoneNumber}
              classname="input-field"
            />

            <div className="gender-section">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={userProfileForm.gender === "male"}
                  onChange={handleUserProfileFormChange}
                />
                Male
              </label>

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={userProfileForm.gender === "female"}
                  onChange={handleUserProfileFormChange}
                />
                Female
              </label>

              {userProfileFormAddEditError.gender && (
                <p className="error-message">{userProfileFormAddEditError.gender}</p>
              )}
            </div>

            <ReactDatePicker
              selectedDate={userProfileForm.dateOfBirth}
              className="w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              onChange={(d) => {
                setUserProfileForm({
                  ...userProfileForm,
                  dateOfBirth: d,
                });

                setUserProfileFormAddEditError((prev) => ({
                  ...prev,
                  dateOfBirth: "",
                }));
              }}
              placeholder="Select Birth Date"
              error={userProfileFormAddEditError.dateOfBirth}
            />

            <InputField
              label="Company Name"
              required={true}
              type="text"
              name="companyName"
              id="companyName"
              placeholder="Company Name"
              value={userProfileForm.companyName}
              onChange={handleUserProfileFormChange}
              error={userProfileFormAddEditError.companyName}
              classname="input-field"
            />

            <InputField
              label="Department"
              required={true}
              type="text"
              name="department"
              id="department"
              placeholder="Department"
              value={userProfileForm.department}
              onChange={handleUserProfileFormChange}
              error={userProfileFormAddEditError.department}
              classname="input-field"
            />

            <DropDown
              optionsLabel={designationType.map((i) => i)}
              selectClasName="input-field"
              selectValue={userProfileForm.designation}
              dropDownChange={handleUserProfileFormChange}
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
              value={userProfileForm.employeeId}
              onChange={handleUserProfileFormChange}
              error={userProfileFormAddEditError.employeeId}
              classname="input-field"
            />

            <InputField
              label="Username"
              required={true}
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={userProfileForm.username}
              onChange={handleUserProfileFormChange}
              error={userProfileFormAddEditError.username}
              classname="input-field"
            />

            <PasswordInput
              name="password"
              value={userProfileForm.password}
              handleChange={handleUserProfileFormChange}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              label="Password"
              required={true}
              classname="input-field"
            />
            {userProfileFormAddEditError.password && (
              <span className="error-message">
                {userProfileFormAddEditError.password}
              </span>
            )}

            <PasswordInput
              name="confirmPassword"
              value={userProfileForm.confirmPassword}
              handleChange={handleUserProfileFormChange}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              label="Confirmation Password"
              required={true}
              classname="input-field"
            />
            {userProfileFormAddEditError.confirmPassword && (
              <span className="error-message">
                {userProfileFormAddEditError.confirmPassword}
              </span>
            )}
            <InputField
              label="Website"
              required={true}
              type="text"
              name="website"
              id="website"
              placeholder="Website"
              value={userProfileForm.website}
              onChange={handleUserProfileFormChange}
              error={userProfileFormAddEditError.website}
              classname="input-field"
            />

            <InputField
              label="Description"
              required={true}
              type="text"
              name="description"
              id="description"
              placeholder="Description"
              value={userProfileForm.description}
              onChange={handleUserProfileFormChange}
              error={userProfileFormAddEditError.description}
              classname="input-field"
            />

            <InputField
              label="Notes"
              required={true}
              type="text"
              name="notes"
              id="notes"
              placeholder="Notes"
              value={userProfileForm.notes}
              onChange={handleUserProfileFormChange}
              error={userProfileFormAddEditError.notes}
              classname="input-field"
            />

            <DropDown
              optionsLabel={statusOptions.map((i) => i.label)}
              selectClasName="input-field"
              selectValue={userProfileForm.status}
              dropDownChange={handleUserProfileFormChange}
              selectName="status"
              label="Status"
              required={true}
            />

            <FileUpload
              label="Upload Image"
              accept="image/*,.pdf,.xls,.xlsx,video/*"
              required={true}
              multipleFile={true}
              onFileSelect={(files) => {
                if (!files) return;

                const fileArray = Array.isArray(files) ? files : [files];

                fileArray.forEach((file) => {
                  const reader = new FileReader();

                  reader.onloadend = () => {
                    const fileData = {
                      name: file.name,
                      url: reader.result as string,
                    };

                    setUserProfileForm((prev) => ({
                      ...prev,
                      profileImage: [...prev.profileImage, fileData],
                    }));
                  };

                  reader.readAsDataURL(file);
                });
              }}
            />
            {userProfileForm.profileImage.map((file, index) => (
              <p key={index}>{file.name}</p>
            ))}

            {userProfileFormAddEditError.profileImage && (
              <span className="error-message">
                {userProfileFormAddEditError.profileImage}
              </span>
            )}

            <InputField
              label="Created By"
              required={true}
              type="text"
              name="createdBy"
              id="createdBy"
              placeholder="Created By"
              value={userProfileForm.createdBy}
              onChange={handleUserProfileFormChange}
              error={userProfileFormAddEditError.createdBy}
              classname="input-field"
            />

            <InputField
              label="Updated By"
              required={true}
              type="text"
              name="updatedBy"
              id="updatedBy"
              placeholder="Updated By"
              value={userProfileForm.updatedBy}
              onChange={handleUserProfileFormChange}
              error={userProfileFormAddEditError.updatedBy}
              classname="input-field"
            />

            <InputField
              label="Country"
              required={true}
              type="text"
              name="country"
              id="country"
              placeholder="Country"
              value={userProfileForm.address[0].country}
              onChange={handleUserProfileAddressChange}
              error={userProfileFormAddEditError.country}
              classname="input-field"
            />

            <InputField
              label="State"
              required={true}
              type="text"
              name="state"
              id="state"
              placeholder="State"
              value={userProfileForm.address[0].state}
              onChange={handleUserProfileAddressChange}
              error={userProfileFormAddEditError.state}
              classname="input-field"
            />

            <InputField
              label="City"
              required={true}
              type="text"
              name="city"
              id="city"
              placeholder="City"
              value={userProfileForm.address[0].city}
              onChange={handleUserProfileAddressChange}
              error={userProfileFormAddEditError.city}
              classname="input-field"
            />

            <InputField
              label="District"
              required={true}
              type="text"
              name="district"
              id="district"
              placeholder="District"
              value={userProfileForm.address[0].district}
              onChange={handleUserProfileAddressChange}
              error={userProfileFormAddEditError.district}
              classname="input-field"
            />

            <InputField
              label="Zipcode"
              required={true}
              type="text"
              name="zipcode"
              id="zipcode"
              placeholder="Zipcode"
              value={userProfileForm.address[0].zipcode}
              onChange={handleUserProfileAddressChange}
              error={userProfileFormAddEditError.zipcode}
              classname="input-field"
            />

            <div className="form-buttons flex gap-4 mt-4">
              <Buttons
                label={!editUserProfileId ? "Add User" : "Edit User"}
                className="submit-btn"
                onClick={handleUserProfileFormSubmit}
              />

              <Buttons
                label="Cancel"
                type="button"
                onClick={resetUserProfileForm}
                className="cancel-btn"
              />
            </div>
          </form>
        )}

        <div
          className="main-userProfileDiv"
          id="scrollableDiv"
          onScroll={handleProfileListScroll}
          style={{
            height: "380px",
            overflowY: "auto",
          }}
        >
          {/* <InfiniteScroll
            dataLength={visibleUsers.length}
            next={fetchMoreData}
            hasMore={visibleUsers.length < filterByName.length}
            loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
          > */}
          <table className="userProfileTable">
            <thead>
              <tr>
                {userProfileTableHeader.map((head) => (
                  <th key={head.key}>{head.label}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {userProfiles.length === 0 ? (
                <tr>
                  <td
                    colSpan={userProfileTableHeader.length}
                    className="text-center"
                  >
                    No Data Found
                  </td>
                </tr>
              ) : (
                visibleUsers.map((user, index) => (
                  <tr key={user.employeeId}>
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
                          onClick={() =>
                            handleShowUserProfilePreview(
                              user.profileImage,
                              user.employeeId,
                            )
                          }
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
                        <MenuButton className="inline-flex items-center rounded bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600">
                          Actions
                          <FaChevronDown />
                        </MenuButton>

                        <MenuItems className="absolute bottom-full right-0 mb-2 w-40 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg z-50">
                          <MenuItem>
                            {() => (
                              <Buttons
                                onClick={() =>
                                  handleUserProfileEdit(user.employeeId)
                                }
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
                                onClick={() =>
                                  handleUserProfileDelete(user.employeeId)
                                }
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
          {/* </InfiniteScroll> */}

          {showUserProfileImagePreView && (
            <FilePreview
              file={userProfileImagePreView}
              onClose={handleClosePreview}
              handleRemoveFile={handleRemoveFile}
            />
          )}
        </div>
      </div>
      {showConfirmModel && (
        <Confirmation
          confirm={handleConfirmDeleteOrEdit}
          cancel={handleConfrimCancelDeleteOrEdit}
          type={editUserProfileId ? "edit" : "delete"}
          message={confirmModelMsg}
        />
      )}
    </>
  );
}

export default UserProfile;
