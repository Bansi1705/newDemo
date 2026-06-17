import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface singleMonthPickerProps {
  selectSingleMonth: Date | null;
  setSelectSingleMonth: React.Dispatch<React.SetStateAction<Date | null>>;
}

const SingleMonthPicker: React.FC<singleMonthPickerProps> = ({
  selectSingleMonth,
  setSelectSingleMonth,
}) => {
  const onMonthChange = (dates: Date | null) => {
    setSelectSingleMonth?.(dates);
  };

  return (
    <DatePicker
      selected={selectSingleMonth}
      showMonthYearPicker
      onChange={onMonthChange}
      shouldCloseOnSelect={false}
      className="input-field cursor-pointer"
      placeholderText="Select Month"
      showIcon
      dateFormat="MM/dd/yyyy"
    />
  );
};

export default SingleMonthPicker;
