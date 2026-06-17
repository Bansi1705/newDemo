import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { endOfMonth } from "date-fns";

interface MultipleMonthPickerProps {
  selectedMultipleMonths: [Date | null, Date | null];
  setSelectedMultipleMonths: React.Dispatch<
    React.SetStateAction<[Date | null, Date | null]>
  >;
}
const MultipleMonthPicker: React.FC<MultipleMonthPickerProps> = ({
  selectedMultipleMonths,
  setSelectedMultipleMonths,
}) => {
  const monthEndDate = selectedMultipleMonths[1]
    ? endOfMonth(selectedMultipleMonths[1])
    : null;

  console.log(monthEndDate);
  return (
    <DatePicker
      startDate={selectedMultipleMonths[0]}
      endDate={monthEndDate}
      showMonthYearPicker
      onChange={(dates) =>
        setSelectedMultipleMonths(dates as [Date | null, Date | null])
      }
      shouldCloseOnSelect={false}
      className="input-field cursor-pointer"
      placeholderText={"Select Multiple Months"}
      showIcon
      dateFormat="MM/dd/yyyy"
      selectsRange
    />
  );
};

export default MultipleMonthPicker;
