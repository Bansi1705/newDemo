import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  error?: string;
  selectedDate?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  maxDate?: Date;
  minDate?: Date;
  className?: string;
};

export function ReactDatePicker({
  error,
  selectedDate,
  onChange,
  placeholder,
  maxDate,
  minDate,
  className,
}: Props) {
  return (
    <div>
      <DatePicker
        showIcon
        toggleCalendarOnIconClick
        selected={selectedDate}
        onChange={onChange}
        maxDate={maxDate ?? new Date()}
        minDate={minDate}
        className={className}
        placeholderText={placeholder}
        name="datePicker"
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        dateFormat="dd/MMMM/yyyy"
        data-testid="date-picker"
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}
