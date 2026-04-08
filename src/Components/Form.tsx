import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { User } from "../types";
import Header from "./Header";
import "../Styles/Form.css";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import { ReactDatePicker } from "./CommonComponents/DatePicker";
import { Buttons } from "./CommonComponents/Buttons";
import InputField from "./CommonComponents/InputFeild";

export const Form = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  type FromData = {
    name: string;
    age: number | "";
    birthdate: Date | null;
  };

  const [data, setData] = useState<FromData>({
    name: "",
    age: "",
    birthdate: null,
  });

  type FormErrors = {
    name?: string;
    age?: string;
    birthdate?: string;
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
    if (id) {
      fetch(`http://localhost:5000/users/${id}`)
        .then((res) => res.json())
        .then((data: User) => {
          setData({
            ...data,
            birthdate: data.birthdate ? new Date(data.birthdate) : null,
          });
        })
        .catch((err) => console.log(err));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    const url = id
      ? `http://localhost:5000/users/${id}`
      : "http://localhost:5000/users";

    const method = id ? "PUT" : "POST";

    const body = {
      ...data,
      birthdate: data.birthdate?.toISOString().split("T")[0],
    };

    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (id) {
        toast.success("User Updated ....");
      } else {
        toast.success("User Added ....");
      }
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const searchShow = false;

  return (
    <>
      <Header searchShow={searchShow} />
      <div className="form-data">
        <form onSubmit={handleSubmit} className="form">
          <h2 className="form-title">{id ? "Edit User" : "Add User"}</h2>

          <div className="form-group">
            <label htmlFor="" className="form-label">
              Name :
            </label>
            <InputField
              placeholder="Enter Your Name"
              type="text"
              name="name"
              value={data.name}
              onChange={handleInputChange}
              error={error.name}
              classname="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="" className="form-label">
              Age :
            </label>

            <InputField
              placeholder="Enter Your Age"
              type="number"
              name="age"
              value={data.age}
              onChange={handleInputChange}
              error={error.age}
              classname="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="" className="form-label">
              Birth Date :
            </label>
            <ReactDatePicker
              error={error.birthdate}
              onChange={(date) => setData({ ...data, birthdate: date })}
              selectedDate={data.birthdate}
            />
          </div>

          <Buttons
            type="submit"
            label={`${id ? "Update" : "Add"} User`}
            className="submit-btn"
          />
        </form>
      </div>
    </>
  );
};
