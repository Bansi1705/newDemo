import type { dropdownOption } from "../../Interface/types";

export const DropDown: React.FC<dropdownOption> = ({
  selectValue,
  disabled,
  selectName,
  optionsLabel,
  selectClasName,
  error,
  dropDownChange,
  placeholder,
  label,
  required = false,
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor="selectFeild" className="form-label">
          {label}

          {required && <span className="required-mark">*</span>}
        </label>
      )}

      <select
        name={selectName}
        id="selectFeild"
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
    </div>
  );
};
