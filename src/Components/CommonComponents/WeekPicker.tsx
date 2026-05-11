import {
  eachWeekOfInterval,
  startOfWeek,
  endOfWeek,
  format,
  getWeek,
} from "date-fns";
import "../../Styles/WeekPicker.css";

type WeekPickerProps = {
  startYear?: number;
  startMonth?: number;
  endYear?: number;
  endMonth?: number;
};

export default function WeekPicker({
  startYear,
  startMonth,
  endYear,
  endMonth,
}: WeekPickerProps) {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
  const nextYear = currentYear + 1;
  const currentWeek = getWeek(new Date());

  const totalLastMonthDays = new Date(
    nextYear,
    endMonth ?? 11 + 1,
    0,
  ).getDate();

  console.log("WeekPicker");

  const weeks = eachWeekOfInterval({
    start: new Date(startYear || lastYear, startMonth ?? 0, 1),
    end: new Date(endYear || nextYear, endMonth ?? 11 + 1, totalLastMonthDays),
  }).map((date) => {
    const startDate = startOfWeek(date, { weekStartsOn: 0 });
    const endDate = endOfWeek(date, { weekStartsOn: 0 });
    const year = endDate.getFullYear();
    const weekNumber = getWeek(date);

    return {
      label: `Week ${weekNumber} of ${year}: Start Date: ${format(startDate, "dd/MM/yyyy")} - End Date: ${format(endDate, "dd/MM/yyyy")}`,
      value: `week-${weekNumber} of ${year}`,
    };
  });
  return (
    <div className="week-picker">
      <select
        className="week-picker__select"
        defaultValue={`week-${currentWeek} of ${currentYear}`}
      >
        {weeks.map((week) => (
          <option key={week.value} value={week.value}>
            {week.label}
          </option>
        ))}
      </select>
    </div>
  );
}
