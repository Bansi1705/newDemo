import React, { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { Otp } from "./CommonComponents/Otp";
import { Buttons } from "./CommonComponents/Buttons";
import InputField from "./CommonComponents/InputFeild";
import type { LoginData } from "../Interface/types";
import PasswordInput from "./CommonComponents/PasswordInput";
import Toaster from "../Services/CommonService/ToasterHelper";
import { CONSTANT } from "../Services/Constant";
import { COMMON_SERVICES } from "../Services/CommonService/CommonServices";

interface FormError {
  email?: string;
  password?: string;
  otp?: string;
}
interface State {
  data: LoginData;
  error: FormError;
  otpValue: string;
  showPassword: boolean;
}

type Action =
  | {
      type: "HANDLE_CHANGE";
      payload: { name: string; value: string };
    }
  | {
      type: "SET_OTP";
      payload: string;
    }
  | {
      type: "SET_ERROR";
      payload: FormError;
    }
  | {
      type: "TOGGLE_PASSWORD";
    };

const initialState: State = {
  data: {
    email: "",
    password: "",
    userIp: "",
    userDevice: "",
  },
  error: {},
  otpValue: "",
  showPassword: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "HANDLE_CHANGE":
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.name]: action.payload.value,
        },
        error: {
          ...state.error,
          [action.payload.name]: "",
        },
      };

    case "SET_OTP":
      return {
        ...state,
        otpValue: action.payload,
        error: {
          ...state.error,
          otp: "",
        },
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "TOGGLE_PASSWORD":
      return {
        ...state,
        showPassword: !state.showPassword,
      };

    default:
      return state;
  }
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loginState, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const getUseInfo = async () => {
      const UserIPDetail = await COMMON_SERVICES.getUserIp();
      dispatch({
        type: "HANDLE_CHANGE",
        payload: {
          name: "userDevice",
          value: COMMON_SERVICES.getDeviceType(),
        },
      });
      dispatch({
        type: "HANDLE_CHANGE",
        payload: {
          name: "userIp",
          value: UserIPDetail,
        },
      });
    };
    getUseInfo();
  }, []);

  const handleLoginUserInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    dispatch({
      type: "HANDLE_CHANGE",
      payload: { name, value },
    });
  };

  const handleLoginUserOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("loginOtp", otp);
    Toaster.success(`OTP Generated ${otp}`);
  };

  const validate = (): boolean => {
    const newError: FormError = {};
    if (!loginState.data.email.trim()) {
      newError.email = "Email is required!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginState.data.email)) {
      newError.email = "Invalid email format";
    }
    if (!loginState.data.password.trim()) {
      newError.password = "Password is required!";
    } else if (loginState.data.password.length < 6) {
      newError.password = "Minimum 6 characters required";
    }
    if (!loginState.otpValue.trim()) {
      newError.otp = "Otp Required!";
    }
    if (loginState.otpValue !== localStorage.getItem("loginOtp")) {
      newError.otp = "Invalid OTP!";
    }
    dispatch({
      type: "SET_ERROR",
      payload: newError,
    });
    return Object.keys(newError).length === 0;
  };

  const handleLoginUserSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validate()) {
      sessionStorage.setItem(
        "LoginUser",
        JSON.stringify({ ...loginState.data, token: "123abc" }),
      );
      Toaster.success(CONSTANT.TOAST_SUCCESS_MSG.LOGIN);
      navigate("/home");
    } else {
      Toaster.error(CONSTANT.TOAST_ERROR_MSG.COMMON);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
        <form className="flex flex-col">
          <h2 className="text-center mb-6 text-2xl text-gray-800 font-bold">
            Login
          </h2>

          <div className="mb-4 flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium text-gray-800">
              Email:
            </label>
            <InputField
              type="email"
              name="email"
              id="email"
              value={loginState.data.email}
              onChange={handleLoginUserInputChange}
              placeholder="bansi@gmail.com"
              error={loginState.error.email}
              classname="px-3 py-2 border border-gray-300 rounded-lg text-base outline-none focus:border-blue-600 transition-colors duration-200"
            />
          </div>

          <div className="mb-4 flex flex-col text-black-400">
            <label htmlFor="email" className="mb-1 font-medium text-gray-800">
              Password:
            </label>
            <PasswordInput
              name="password"
              value={loginState.data.password}
              handleChange={handleLoginUserInputChange}
              showPassword={loginState.showPassword}
              setShowPassword={() => dispatch({ type: "TOGGLE_PASSWORD" })}
              classname="px-3 py-2 border border-gray-300 rounded-lg text-base outline-none focus:border-blue-600 transition-colors duration-200"
            />
            {loginState.error.password && (
              <span className="error-message">{loginState.error.password}</span>
            )}
          </div>
          <div className="mb-4 flex flex-col">
            <label
              htmlFor="otpFeild"
              className="mb-1 font-medium text-gray-800"
            >
              Otp :
            </label>
            <Otp
              otpValue={loginState.otpValue}
              setOtpValue={(value: string) =>
                dispatch({ type: "SET_OTP", payload: value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg text-base outline-none focus:border-blue-600 transition-colors duration-200"
            />
            {loginState.error.otp && (
              <p className="error-message">{loginState.error.otp}</p>
            )}
          </div>

          <div className="flex gap-4">
            <Buttons
              label="Login"
              type="submit"
              onClick={handleLoginUserSubmit}
              className="flex-1 px-4 py-3 bg-blue-600 text-white border-none rounded-lg text-base cursor-pointer hover:bg-blue-800 transition-colors duration-200 font-medium"
            />
            <Buttons
              label="Generate Otp"
              type="button"
              className="flex-1 px-4 py-3 bg-blue-600 text-white border-none rounded-lg text-base cursor-pointer hover:bg-blue-800 transition-colors duration-200 font-medium"
              onClick={handleLoginUserOtp}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
