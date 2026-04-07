import type { inputProps } from "../../types";

const InputField : React.FC<inputProps> = ({ id,name, value, onChange, error ,classname ,placeholder }) => {
  return (
    <>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={classname}
        placeholder={placeholder}
      />
      {error && <span className="error-message">{error}</span>}
    </>
  );
};

export default InputField;