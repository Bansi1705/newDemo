import type React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface YearPickerProps {
  selectedYear: Date | null;
  setSelectedYear: React.Dispatch<React.SetStateAction<Date | null>>;
}

const YearPicker: React.FC<YearPickerProps> = ({
  selectedYear,
  setSelectedYear,
}) => {
  return (
    <DatePicker
      selected={selectedYear}
      onChange={setSelectedYear}
      showYearPicker
      dateFormat="yyyy"
      showIcon
      className="input-field"
    />
  );
};

export default YearPicker;
