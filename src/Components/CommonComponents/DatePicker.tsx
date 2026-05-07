import { endOfDay, startOfDay } from "date-fns";
import DatePicker from "react-datepicker";

type Props = {
  error?: string;
  selectedDate?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  isWeekPicker?: boolean;
};

export function ReactDatePicker({
  error,
  selectedDate,
  onChange,
  placeholder,
  isWeekPicker = false,
}: Props) {
  return (
    <div>
      <DatePicker
        showIcon
        toggleCalendarOnIconClick
        selected={selectedDate}
        onChange={onChange}
        startDate={selectedDate ? startOfDay(selectedDate) : undefined}
        endDate={selectedDate ? endOfDay(selectedDate) : undefined}
        showWeekPicker={isWeekPicker}
        dateFormat={isWeekPicker ? "'Week' w, yyyy" : "dd/MM/yyyy"}
        maxDate={new Date()}
        className="input-field"
        shouldCloseOnSelect
        placeholderText={placeholder}
        name="datePicker"
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
