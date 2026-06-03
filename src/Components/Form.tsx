import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import { ReactDatePicker } from "./CommonComponents/DatePicker";
import InputField from "./CommonComponents/InputFeild";
import { Apiservice } from "../Services/ApiService";
import { Buttons } from "./CommonComponents/Buttons";
import { CONSTANT } from "../Services/Constant";
import type { ApiResponse, User } from "../Interface/types";
import FileUpload from "./CommonComponents/FileUpload";

const Form = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  type FromData = {
    name: string;
    age: number | "";
    birthdate: Date | null;
    uploadFile: {
      name: string;
      url: string;
    }[];
  };

  const [data, setData] = useState<FromData>({
    name: "",
    age: "",
    birthdate: null,
    uploadFile: [],
  });

  type FormErrors = {
    name?: string;
    age?: string;
    birthdate?: string;
    uploadFile?: string;
  };

  const [error, setError] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newError: FormErrors = {};

    if (!data.name.trim()) {
      newError.name = "Name is required.";
    }
    if (!data.age || data.age <= 0) {
      newError.age = "Enter Valid Age";
    }
    if (!data.birthdate) {
      newError.birthdate = "BirthDate is required.";
    } else if (data.birthdate > new Date()) {
      newError.birthdate = "Birthdate cannot be in future";
    }
    if (!data.uploadFile) {
      newError.uploadFile = "UploadFile is required.";
    }

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: name === "age" ? Number(value) : value,
    });
    setError({
      ...error,
      [name]: "",
    });
  };
  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const response: ApiResponse<User> = await Apiservice.get(
          `/users/${id}`,
        );
        console.log(response.data);
        setData({
          name: response.data.name || "",
          age: response.data.age || "",
          birthdate: response.data.birthdate
            ? new Date(response.data.birthdate)
            : null,
          uploadFile: response.data.uploadFile,
        });
      } catch (err) {
        console.log(err);
        toast.error(CONSTANT.ERROR.NOT_FOUND);
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    const payLoad = {
      name: data.name,
      age: data.age,
      birthdate: data.birthdate
        ? data.birthdate.toISOString().split("T")[0]
        : "",
      uploadFile: data.uploadFile,
    };

    try {
      if (id) {
        await Apiservice.put<ApiResponse<User>>(`/users/${id}`, payLoad);
        toast.success(CONSTANT.SUCCESS.UPDATE);
      } else {
        await Apiservice.post<ApiResponse<User>>(`/users`, payLoad);
        toast.success(CONSTANT.SUCCESS.CREATE);
      }

      navigate("/home");
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(CONSTANT.ERROR.COMMON);
    }
  };

  return (
    <>
      <Header showSearchInput={false} />
      <div className="form-data flex items-center justify-center h-screen bg-white-100">
        <form
          className="form bg-white p-6 rounded shadow-xl-30 w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <h2 className="form-title text-lg font-bold mb-4 text-center">
            {id ? "Edit User" : "Add User"}
          </h2>

          <div className="form-group mb-4">
            <label
              htmlFor="name"
              className="form-label block mb-1 font-medium text-gray-800"
            >
              Name :
            </label>
            <InputField
              placeholder="Enter Your Name"
              type="text"
              name="name"
              id="name"
              value={data.name}
              onChange={handleInputChange}
              error={error.name}
              classname="input-field px-3 py-2 border border-gray-300 rounded-lg text-base outline-none focus:border-blue-600 transition-colors duration-200"
            />
          </div>

          <div className="form-group mb-4">
            <label
              htmlFor="age"
              className="form-label block mb-1 font-medium text-gray-800"
            >
              Age :
            </label>

            <InputField
              placeholder="Enter Your Age"
              type="number"
              name="age"
              id="age"
              value={data.age}
              onChange={handleInputChange}
              error={error.age}
              classname="input-field px-3 py-2 border border-gray-300 rounded-lg text-base outline-none focus:border-blue-600 transition-colors duration-200"
            />
          </div>

          <div className="form-group mb-4">
            <label
              htmlFor="datePicker"
              className="form-label block mb-1 font-medium text-gray-800"
            >
              Birth Date :
            </label>
            <ReactDatePicker
              error={error.birthdate}
              onChange={(date) => setData({ ...data, birthdate: date })}
              selectedDate={data.birthdate}
              placeholder="Select BirthDate"
              className="input-field px-3 py-2 border border-gray-300 rounded-lg text-base outline-none focus:border-blue-600 transition-colors duration-200"
            />
          </div>
          <div className="form-group mb-4">
            <FileUpload
              label="Upload File"
              accept="image/*,.pdf,.xls,.xlsx"
              onFileSelect={(file) => {
                const selectedFile = Array.isArray(file) ? file[0] : file;

                const reader = new FileReader();

                reader.onloadend = () => {
                  const fileData = {
                    name: selectedFile.name,
                    url: reader.result as string,
                  };
                  setData((prev) => ({
                    ...prev,
                    uploadFile: [fileData],
                  }));
                };

                reader.readAsDataURL(selectedFile);
              }}
            />
          </div>

          <Buttons
            label={`${id ? "Update" : "Add"} User`}
            type="submit"
            className="submit-btn w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-800 transition-colors mt-4"
          />
        </form>
      </div>
    </>
  );
};
export default Form;
