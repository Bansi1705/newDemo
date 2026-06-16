import { useState } from "react";
import {
  DateRangePicker,
  type Range,
  type RangeKeyDict,
} from "react-date-range";
import { SlCalender } from "react-icons/sl";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../../Styles/DatePickerBasic.css";
import { format } from "date-fns";

export default function CustomDateRangePicker() {
  const [openDateRangePicker, setOpenDateRangePicker] = useState(false);

  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [tempState, setTempState] = useState<Range[]>(dateRange);

  const handleDateRangePickerOpen = () => {
    setTempState(dateRange);
    setOpenDateRangePicker(true);
  };

  const handleSelecteDateRangeApply = () => {
    setDateRange(tempState);
    setOpenDateRangePicker(false);
  };

  const handleSelectedDateRangeCancel = () => {
    setTempState(dateRange);
    setOpenDateRangePicker(false);
  };

  const startDate: Date = dateRange[0]?.startDate || new Date();
  const endDate: Date = dateRange[0]?.endDate || new Date();

  return (
    <div className="date-range-picker">
      <div className="date-range-picker__field">
        <input
          readOnly
          onClick={handleDateRangePickerOpen}
          value={`${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`}
          placeholder="Select date range"
          className="date-range-picker__input"
        />
        <SlCalender size={20} className="date-range-picker__icon" />
      </div>

      {openDateRangePicker && (
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
              onClick={handleSelectedDateRangeCancel}
              className="date-range-picker__button date-range-picker__button--secondary"
            >
              Cancel
            </button>

            <button
              onClick={handleSelecteDateRangeApply}
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
