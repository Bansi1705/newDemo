import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";
import { Otp } from "./CommonComponents/Otp";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Buttons } from "./CommonComponents/Buttons";
import InputField from "./CommonComponents/InputFeild";
import type { LoginData } from "../types";
interface FormError {
  email?: string;
  password?: string;
  otp?: string;
}

export const Login : React.FC = () => {
  const [data, setData] = useState<LoginData>({ email: "", password: "" });
  const [error, setError] = useState<FormError>({});
  const [otpValue, setOtpValue] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    setError({ ...error, [name]: "" });
  };

  const handleOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("loginOtp", otp);
    toast.success(`Otp Generated ${otp}`);
  };

  const validate = (): boolean => {
    const newError: FormError = {};
    if (!data.email.trim()) {
      newError.email = "Email is required!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newError.email = "Invalid email format";
    }
    if (!data.password.trim()) {
      newError.password = "Password is required!";
    } else if (data.password.length < 6) {
      newError.password = "Minimum 6 characters required";
    }
    if (!otpValue.trim()) {
      newError.otp = "Otp Required!";
    }
    if (otpValue !== localStorage.getItem("loginOtp")) {
      newError.otp = "Invalid OTP!";
    }
    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      sessionStorage.setItem("LoginUser", JSON.stringify(data));
      toast.success("Login Successful!");
      navigate("/home");
    } else {
      toast.error("Please fix the errors!");
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <InputField
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="bansi@gmail.com"
            error={error.email}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <div className="password-wrapper">
            <InputField
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="********"
              error={error.password}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error.password && <p className="form-error">{error.password}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Otp :
          </label>
          <Otp otpValue={otpValue} setOtpValue={setOtpValue} />
          {error.otp && <p className="form-error">{error.otp}</p>}
        </div>

        <div className="action-buttons">
          <Buttons
            type="submit"
            label="Login"
            className="form-button"
          />
          <Buttons
            type="button"
            label="Generate Otp"
            className="form-button"
            onClick={handleOtp}
          />
        </div>
      </form>
    </div>
  );
}
