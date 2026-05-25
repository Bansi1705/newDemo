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

  const [error, setError] = useState<Record<string, string>>({});

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
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newError.phoneNumber = "Phone Number must be 10 digits";
    }

    if (
      formData.alternatePhoneNumber &&
      !/^\d{10}$/.test(formData.alternatePhoneNumber)
    ) {
      newError.alternatePhoneNumber = CONSTANT.VALIDATION.ALTERNATEPHONENUMBER;
    }

    if (!formData.gender) {
      newError.gender = CONSTANT.VALIDATION.GENDER;
    }

    if (!formData.dateOfBirth) {
      newError.dateOfBirth = CONSTANT.VALIDATION.DATEOFBIRTH;
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
    }
    // } else if (
    //   !/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i.test(userData.website)
    // ) {
    //   newError.website = "Invalid Website URL";
    // }

    if (!formData.description.trim()) {
      newError.description = CONSTANT.VALIDATION.DESCRIPTION;
    }

    if (!formData.notes.trim()) {
      newError.notes = CONSTANT.VALIDATION.NOTES;
    }

    if (!formData.status.trim()) {
      newError.status = CONSTANT.VALIDATION.STATUS;
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

    const updatedData = [...userData, formData];
    setUserData(updatedData);

    console.log("Submitted Data:", updatedData);
  };

  const resetForm = () => {
    setFormData(initialState);
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
            placeholder="9876543210"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={error.phoneNumber}
            classname="input-field"
          />

          <InputField
            label="Alternate Phone Number"
            type="tel"
            name="alternatePhoneNumber"
            id="alternatePhoneNumber"
            placeholder="9876543210"
            value={formData.alternatePhoneNumber}
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
      </div>
    </>
  );
}

export default UserProfile;
