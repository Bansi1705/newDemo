import { useState } from "react";
import { DateRangePicker } from "react-date-range";
import { SlCalender } from "react-icons/sl";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function CustomDateRangePicker() {
  const [open, setOpen] = useState(false);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const format = (date: Date) => date.toLocaleDateString("en-GB");

  return (
    <div style={{ position: "relative", width: 260 }}>
      <div style={{ position: "relative" }}>
        <input
          readOnly
          onClick={() => setOpen(!open)}
          value={`${format(range[0].startDate)} - ${format(range[0].endDate)}`}
          placeholder="Select date range"
          style={{
            width: "100%",
            padding: "10px 42px 10px 10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        />
        <SlCalender
          size={20}
          style={{
            position: "absolute",
            top: "50%",
            right: "12px",
            color: "#4a90e2",
            pointerEvents: "none",
            transform: "translateY(-50%)",
          }}
        />
      </div>

      {open && (
        <div style={{ position: "absolute", top: "45px", zIndex: 100 }}>
          <DateRangePicker
            moveRangeOnFirstSelection={false}
            months={2}
            direction="horizontal"
            inputRanges={[]}
            ranges={range}
            onChange={(item) => setRange([item.selection])}
          />
        </div>
      )}
    </div>
  );
}
