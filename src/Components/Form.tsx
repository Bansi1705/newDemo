import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { User } from "../types";
import Header from "./Header";
import "./Form.css";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import { ReactDatePicker } from "./CommonComponents/DatePicker";

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
          setData(data);
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

  return (
    <>
      <Header />
      <div className="form-data">
        <form onSubmit={handleSubmit} className="form">
          <h2 className="form-title">{id ? "Edit User" : "Add User"}</h2>

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              {" "}
              Name :
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter Your Name"
              value={data.name}
              onChange={handleInputChange}
              className="input-field"
            />
            {error.name && <span className="error">{error.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="age" className="form-label">
              {" "}
              Age :
            </label>
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={data.age}
              min={1}
              max={100}
              onChange={handleInputChange}
              className="input-field"
            />
            {error.age && <span className="error">{error.age}</span>}
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

          <button type="submit">{id ? "Update" : "Add"} User</button>
        </form>
      </div>
    </>
  );
};
