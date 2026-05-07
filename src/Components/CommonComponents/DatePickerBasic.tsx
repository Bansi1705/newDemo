import { useState } from "react";
import { DateRangePicker, type Range, type RangeKeyDict } from "react-date-range";
import { SlCalender } from "react-icons/sl";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../../Styles/DatePickerBasic.css";

export default function CustomDateRangePicker() {
  const [open, setOpen] = useState(false);

  const [range, setRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [tempState, setTempState] = useState<Range[]>(range);

  const handleOpen = () => {
    setTempState(range);
    setOpen(true);
  };

  const handleApply = () => {
    setRange(tempState);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempState(range);
    setOpen(false);
  };

  const format = (date?: Date) =>
    date ? new Date(date).toLocaleDateString("en-GB") : "";

  return (
    <div className="date-range-picker">
      <div className="date-range-picker__field">
        <input
          readOnly
          onClick={handleOpen}
          value={`${format(range[0].startDate)} - ${format(range[0].endDate)}`}
          placeholder="Select date range"
          className="date-range-picker__input"
        />
        <SlCalender size={20} className="date-range-picker__icon" />
      </div>

      {open && (
        <div className="date-range-picker__popover">
          <DateRangePicker
            onChange={(item: RangeKeyDict) => setTempState([item.selection])}
            moveRangeOnFirstSelection={false}
            months={1}
            direction="horizontal"
            ranges={tempState}
            inputRanges={[]}
          />
          <div className="date-range-picker__actions">
            <button
              onClick={handleCancel}
              className="date-range-picker__button date-range-picker__button--secondary"
            >
              Cancel
            </button>

            <button
              onClick={handleApply}
              className="date-range-picker__button date-range-picker__button--primary"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
