import { endOfWeek, format, startOfWeek, isWithinInterval } from "date-fns";
import DatePicker from "react-datepicker";
import "../../Styles/MultiWeekSelect.css";
import "react-datepicker/dist/react-datepicker.css";

export type MultipleWeekPickerProps = {
  placeholder?: string;
  selectedWeeks: Date[];
  onChange: (weeks: Date[]) => void;
};

export function MultipleWeekPicker({
  placeholder,
  selectedWeeks = [],
  onChange,
}: MultipleWeekPickerProps) {
  const handleWeekSelect = (date: Date | null) => {
    if (!date) return;

    const weekStart = startOfWeek(date, { weekStartsOn: 0 });

    const exists = selectedWeeks.find(
      (week) => week.getTime() === weekStart.getTime(),
    );

    const updatedWeeks = exists
      ? selectedWeeks.filter((week) => week.getTime() !== weekStart.getTime())
      : [...selectedWeeks, weekStart];

    onChange(updatedWeeks);
  };

  const getWeekRange = (weeks: Date[]) => {
    if (!weeks.length) return "";

    const sortedWeeks = [...weeks].sort((a, b) => a.getTime() - b.getTime());

    const start = startOfWeek(sortedWeeks[0], {
      weekStartsOn: 0,
    });

    const end = endOfWeek(sortedWeeks[sortedWeeks.length - 1], {
      weekStartsOn: 0,
    });

    return `${format(start, "dd/MM/yyyy")} - ${format(end, "dd/MM/yyyy")}`;
  };

  return (
    <div>
      <DatePicker
        showIcon
        toggleCalendarOnIconClick
        selected={
          selectedWeeks.length ? selectedWeeks[selectedWeeks.length - 1] : null
        }
        onChange={handleWeekSelect}
        showWeekPicker
        className="input-field cursor-pointer"
        placeholderText={placeholder ?? "Select Multiple Weeks"}
        name="datePicker"
        value={getWeekRange(selectedWeeks)}
        shouldCloseOnSelect={false}
        dayClassName={(date) => {
          const isSelected = selectedWeeks.find((week) => {
            const start = startOfWeek(week, { weekStartsOn: 0 });
            const end = endOfWeek(week, { weekStartsOn: 0 });
            return isWithinInterval(date, { start, end });
          });

          return isSelected ? "selected-week" : "";
        }}
      />
    </div>
  );
}
