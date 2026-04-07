import DatePicker from "react-datepicker";

 type props = {
    error?: string;
    selectedDate: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
  };

export function ReactDatePicker({error,selectedDate,onChange,placeholder}:props) {
 
  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder || "Select Date"}
        maxDate={new Date()}
        className="input-field"
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}

