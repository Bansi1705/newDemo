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
  onKeyDown
}) => {
  return (
    <>
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
    </>
  );
};

export default InputField;
