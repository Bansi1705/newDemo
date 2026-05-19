import DatePicker from "react-datepicker";

type Props = {
  error?: string;
  selectedDate?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
};

export function ReactDatePicker({
  error,
  selectedDate,
  onChange,
  placeholder,
}: Props) {
  return (
    <div>
      <DatePicker
        showIcon
        toggleCalendarOnIconClick
        selected={selectedDate}
        onChange={onChange}
        maxDate={new Date()}
        className="input-field"
        placeholderText={placeholder}
        name="datePicker"
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
