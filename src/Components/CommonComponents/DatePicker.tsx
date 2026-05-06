import DatePicker from "react-datepicker";

type props = {
  error?: string;
  selectedDate: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  startDate?: Date | null;
  endDate?: Date | null;
};

export function ReactDatePicker({
  error,
  selectedDate,
  onChange,
  placeholder,
  startDate,
  endDate,
}: props) {
  return (
    <div>
      <DatePicker
        showIcon
        toggleCalendarOnIconClick
        selected={selectedDate}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        maxDate={new Date()}
        className="input-field"
        shouldCloseOnSelect={true}
        placeholderText={placeholder}
        name="datePicker"
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
