import DatePicker from "react-datepicker";

 type props = {
    error?: string;
    selectedDate: Date | null;
    onChange: (date: Date | null) => void;
  };

export function ReactDatePicker({error,selectedDate,onChange}:props) {
 
  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        placeholderText="Select Birthdate"
        maxDate={new Date()}
        className="input-field"
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}

