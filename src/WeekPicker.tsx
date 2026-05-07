import { eachWeekOfInterval, startOfWeek, endOfWeek, format } from "date-fns";
import "./Styles/WeekPicker.css";

const year = new Date().getFullYear();

const weeks = eachWeekOfInterval({
  start: new Date(year, 0, 1),
  end: new Date(year, 11, 31),
}).map((date, index) => {
  const stastDate = startOfWeek(date, { weekStartsOn: 0 });
  const endDate = endOfWeek(date, { weekStartsOn: 0 });

  return {
    label: `Week ${index + 1} : Start Date: ${format(stastDate, "dd/MM/yyyy")} - End Date: ${format(endDate, "dd/MM/yyyy")}`,
    value: `week-${index + 1}`,
  };
});

export default function WeekPicker() {
  return (
    <div className="week-picker">
      <select className="week-picker__select" defaultValue="">
        <option value="" disabled>
          Select Week
        </option>
        {weeks.map((week) => (
          <option key={week.value} value={week.value}>
            {week.label}
          </option>
        ))}
      </select>
    </div>
  );
}
