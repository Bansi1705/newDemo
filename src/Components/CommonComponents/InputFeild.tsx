import type { inputProps } from "../../Interface/types";

const InputField: React.FC<inputProps> = ({
  type,
  id,
  name,
  value,
  onChange,
  error,
  classname,
  placeholder,
  onKeyDown,
  label,
  required = false,
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}

      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={classname}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        autoComplete="off"
      />

      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default InputField;
