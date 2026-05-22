import { useState } from "react";
import type { UserProfile } from "../Interface/types";
import InputField from "../Components/CommonComponents/InputFeild";
import { DropDown } from "../Components/CommonComponents/DropDown";
import { ReactDatePicker } from "../Components/CommonComponents/DatePicker";
import { Buttons } from "../Components/CommonComponents/Buttons";
import Header from "../Components/Header";
import "../Styles/UserProfile.css";
import FileUpload from "../Components/CommonComponents/FileUpload";
import { CONSTANT } from "../Services/Constant";

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

    // Company Details
    companyName: "",
    department: "",
    designation: "",
    employeeId: "",

    // Address Details
    address: [
      {
        country: "",
        state: "",
        city: "",
        district: "",
        zipcode: "",
      },
    ],

    // Account Details
    username: "",
    password: "",
    confirmPassword: "",

    // Other Details
    website: "",
    description: "",
    notes: "",
    status: "",
    profileImage: null,
    createdBy: "",
    updatedBy: "",
  };

  const [userData, setUserData] = useState<UserProfile>(initialState);

  const [error, setError] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
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

    setUserData((prev) => ({
      ...prev,
      address: [
        {
          ...prev.address[0],
          [name]: value,
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

    if (!userData.firstName.trim()) {
      newError.firstName = CONSTANT.VALIDATION.FIRSTNAME;
    }

    if (!userData.lastName.trim()) {
      newError.lastName = CONSTANT.VALIDATION.LASTNAME;
    }

    if (!userData.fullName.trim()) {
      newError.fullName = CONSTANT.VALIDATION.FULLNAME;
    }

    if (!userData.email.trim()) {
      newError.email = CONSTANT.VALIDATION.EMAIL;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(userData.email)
    ) {
      newError.email = "Invalid Email Address";
    }

    if (!userData.phoneNumber.trim()) {
      newError.phoneNumber = CONSTANT.VALIDATION.PHONENUMBER;
    } else if (!/^\d{10}$/.test(userData.phoneNumber)) {
      newError.phoneNumber = "Phone Number must be 10 digits";
    }

    if (
      userData.alternatePhoneNumber &&
      !/^\d{10}$/.test(userData.alternatePhoneNumber)
    ) {
      newError.alternatePhoneNumber = CONSTANT.VALIDATION.ALTERNATEPHONENUMBER;
    }

    if (!userData.gender) {
      newError.gender = CONSTANT.VALIDATION.GENDER;
    }

    if (!userData.dateOfBirth) {
      newError.dateOfBirth = CONSTANT.VALIDATION.DATEOFBIRTH;
    }

    if (!userData.companyName.trim()) {
      newError.companyName = CONSTANT.VALIDATION.COMPANYNAME;
    }

    if (!userData.department.trim()) {
      newError.department = CONSTANT.VALIDATION.DEPARTMENT;
    }

    if (!userData.designation.trim()) {
      newError.designation = CONSTANT.VALIDATION.DESIGNATION;
    }

    if (!userData.employeeId.trim()) {
      newError.employeeId = CONSTANT.VALIDATION.EMPLOYEEID;
    }

    if (!userData.username.trim()) {
      newError.username = CONSTANT.VALIDATION.USERNAME;
    }

    if (!userData.password.trim()) {
      newError.password = CONSTANT.VALIDATION.PASSWORD;
    } else if (userData.password.length < 6) {
      newError.password = "Password must be at least 6 characters";
    }

    if (!userData.confirmPassword.trim()) {
      newError.confirmPassword = CONSTANT.VALIDATION.CONFIRMPASSWORD;
    } else if (userData.password !== userData.confirmPassword) {
      newError.confirmPassword = "Passwords do not match";
    }

    if (!userData.website.trim()) {
      newError.website = CONSTANT.VALIDATION.WEBSITE;
    } else if (
      !/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i.test(userData.website)
    ) {
      newError.website = "Invalid Website URL";
    }

    if (!userData.description.trim()) {
      newError.description = CONSTANT.VALIDATION.DESCRIPTION;
    }

    if (!userData.notes.trim()) {
      newError.notes = CONSTANT.VALIDATION.NOTES;
    }

    if (!userData.status.trim()) {
      newError.status = CONSTANT.VALIDATION.STATUS;
    }

    if (!userData.createdBy.trim()) {
      newError.createdBy = CONSTANT.VALIDATION.CREATEDBY;
    }

    if (!userData.updatedBy.trim()) {
      newError.updatedBy = CONSTANT.VALIDATION.UPDATEDBY;
    }

    if (!userData.address[0].country.trim()) {
      newError.country = CONSTANT.VALIDATION.COUNTRY;
    }

    if (!userData.address[0].state.trim()) {
      newError.state = CONSTANT.VALIDATION.STATE;
    }

    if (!userData.address[0].city.trim()) {
      newError.city = CONSTANT.VALIDATION.CITY;
    }

    if (!userData.address[0].district.trim()) {
      newError.district = CONSTANT.VALIDATION.DISTRICT;
    }

    if (!userData.address[0].zipcode.trim()) {
      newError.zipcode = CONSTANT.VALIDATION.ZIPCODE;
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

    console.log("Submitted Data:", userData);
  };

  const resetForm = () => {
    setUserData(initialState);
    setError({});
  };

  const statusOptions = [
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
  ];

  return (
    <>
      <Header />

      <div className="userProfile-form-data">
        <form className="userProfile-form" onSubmit={handleSubmit}>
          <h2 className="userProfile-title">Add New User</h2>

          <InputField
            type="text"
            name="firstName"
            id="firstName"
            placeholder="First Name"
            value={userData.firstName}
            onChange={handleChange}
            error={error.firstName}
            classname="input-field"
          />

          <InputField
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Last Name"
            value={userData.lastName}
            onChange={handleChange}
            error={error.lastName}
            classname="input-field"
          />

          <InputField
            type="text"
            name="fullName"
            id="fullName"
            placeholder="Full Name"
            value={userData.fullName}
            onChange={handleChange}
            error={error.fullName}
            classname="input-field"
          />

          <InputField
            type="email"
            name="email"
            id="email"
            placeholder="example@gmail.com"
            value={userData.email}
            onChange={handleChange}
            error={error.email}
            classname="input-field"
          />

          <InputField
            type="tel"
            name="phoneNumber"
            id="phoneNumber"
            placeholder="9876543210"
            value={userData.phoneNumber}
            onChange={handleChange}
            error={error.phoneNumber}
            classname="input-field"
          />

          <InputField
            type="tel"
            name="alternatePhoneNumber"
            id="alternatePhoneNumber"
            placeholder="9876543210"
            value={userData.alternatePhoneNumber}
            onChange={handleChange}
            error={error.alternatePhoneNumber}
            classname="input-field"
          />

          <div className="gender-section">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={userData.gender === "male"}
                onChange={handleChange}
              />
              Male
            </label>

            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={userData.gender === "female"}
                onChange={handleChange}
              />
              Female
            </label>

            {error.gender && <p className="error">{error.gender}</p>}
          </div>

          <ReactDatePicker
            selectedDate={userData.dateOfBirth}
            onChange={(d) => {
              setUserData({
                ...userData,
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
            type="text"
            name="companyName"
            id="companyName"
            placeholder="Company Name"
            value={userData.companyName}
            onChange={handleChange}
            error={error.companyName}
            classname="input-field"
          />

          <InputField
            type="text"
            name="department"
            id="department"
            placeholder="Department"
            value={userData.department}
            onChange={handleChange}
            error={error.department}
            classname="input-field"
          />

          <InputField
            type="text"
            name="designation"
            id="designation"
            placeholder="Designation"
            value={userData.designation}
            onChange={handleChange}
            error={error.designation}
            classname="input-field"
          />

          <InputField
            type="text"
            name="employeeId"
            id="employeeId"
            placeholder="Employee ID"
            value={userData.employeeId}
            onChange={handleChange}
            error={error.employeeId}
            classname="input-field"
          />

          <InputField
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            value={userData.username}
            onChange={handleChange}
            error={error.username}
            classname="input-field"
          />

          <InputField
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={userData.password}
            onChange={handleChange}
            error={error.password}
            classname="input-field"
          />

          <InputField
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={userData.confirmPassword}
            onChange={handleChange}
            error={error.confirmPassword}
            classname="input-field"
          />

          <InputField
            type="text"
            name="website"
            id="website"
            placeholder="Website"
            value={userData.website}
            onChange={handleChange}
            error={error.website}
            classname="input-field"
          />

          <InputField
            type="text"
            name="description"
            id="description"
            placeholder="Description"
            value={userData.description}
            onChange={handleChange}
            error={error.description}
            classname="input-field"
          />

          <InputField
            type="text"
            name="notes"
            id="notes"
            placeholder="Notes"
            value={userData.notes}
            onChange={handleChange}
            error={error.notes}
            classname="input-field"
          />

          <DropDown
            optionsLabel={statusOptions.map((i) => i.label)}
            selectClasName="input-field"
            selectValue={userData.status}
            dropDownChange={handleChange}
            selectName="status"
          />

          {error.status && <span className="error">{error.status}</span>}

          <FileUpload
            label="Upload Image"
            accept="image/*"
            onFileSelect={(file) => {
              if (!file) return;

              const reader = new FileReader();

              reader.onloadend = () => {
                setUserData((prev) => ({
                  ...prev,
                  profileImage: reader.result as string,
                }));
              };

              reader.readAsDataURL(file);
            }}
          />

          <InputField
            type="text"
            name="createdBy"
            id="createdBy"
            placeholder="Created By"
            value={userData.createdBy}
            onChange={handleChange}
            error={error.createdBy}
            classname="input-field"
          />

          <InputField
            type="text"
            name="updatedBy"
            id="updatedBy"
            placeholder="Updated By"
            value={userData.updatedBy}
            onChange={handleChange}
            error={error.updatedBy}
            classname="input-field"
          />

          <InputField
            type="text"
            name="country"
            id="country"
            placeholder="Country"
            value={userData.address[0].country}
            onChange={handleAddressChange}
            error={error.country}
            classname="input-field"
          />

          <InputField
            type="text"
            name="state"
            id="state"
            placeholder="State"
            value={userData.address[0].state}
            onChange={handleAddressChange}
            error={error.state}
            classname="input-field"
          />

          <InputField
            type="text"
            name="city"
            id="city"
            placeholder="City"
            value={userData.address[0].city}
            onChange={handleAddressChange}
            error={error.city}
            classname="input-field"
          />

          <InputField
            type="text"
            name="district"
            id="district"
            placeholder="District"
            value={userData.address[0].district}
            onChange={handleAddressChange}
            error={error.district}
            classname="input-field"
          />

          <InputField
            type="text"
            name="zipcode"
            id="zipcode"
            placeholder="Zipcode"
            value={userData.address[0].zipcode}
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
      </div>
    </>
  );
}

export default UserProfile;
