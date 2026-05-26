import { FaEye, FaEyeSlash } from "react-icons/fa6";

interface PasswordInputProps {
  label?: string;
  name: string;
  value: string;
  placeholder?: string;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
  classname?:string;
}

function PasswordInput({
  label = "Password",
  name,
  value,
  placeholder = "********",
  showPassword,
  setShowPassword,
  handleChange,
  required = false,
  classname
}: PasswordInputProps) {
  return (
    <div className="mb-4 flex flex-col">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          id={name}
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${classname} w-full px-3 py-2 pr-10 rounded-lg text-base outline-none`}
        />

        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-lg text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
    </div>
  );
}

export default PasswordInput;
