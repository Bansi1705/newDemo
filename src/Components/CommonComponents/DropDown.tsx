import type { dropdownOption } from "../../types";

export const DropDown: React.FC<dropdownOption> = ({
  selectValue,
  disabled,
  selectName,
  optionsLabel,
  selectClasName,
  error,
  dropDownChange,
  placeholder,
}) => {
  return (
    <>
      <select
        name={selectName}
        id=""
        value={selectValue}
        className={selectClasName}
        onChange={dropDownChange}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {optionsLabel?.map((optionLabel, index) => (
          <option key={index} value={optionLabel} disabled={disabled}>
            {optionLabel}
          </option>
        ))}
      </select>
      {error && <p className="form-error">{error}</p>}
    </>
  );
};
