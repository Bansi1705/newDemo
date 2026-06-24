import { describe, test, vi } from "vitest";
import { COMMON_SERVICES } from "./CommonServices";
import Toaster from "./ToasterHelper";

vi.mock("./ToasterHelper", () => ({
  default: {
    error: vi.fn(),
  },
}));

describe("Common serices Component testing", () => {
  test("Get Past five year by getFiveYear", () => {
    const currenYear = new Date().getFullYear();

    expect(COMMON_SERVICES.getFiveYear()).toEqual([
      currenYear,
      currenYear - 1,
      currenYear - 2,
      currenYear - 3,
      currenYear - 4,
    ]);
  });

  test("Get next five year by nextFiveYear function in key value pair", () => {
    const currenYear = new Date().getFullYear();

    expect(COMMON_SERVICES.nextFiveYear()).toEqual({
      1: currenYear,
      2: currenYear + 1,
      3: currenYear + 2,
      4: currenYear + 3,
      5: currenYear + 4,
    });
  });

  test("Get all month year by nextMonth function in key value pair", () => {
    expect(COMMON_SERVICES.nextMonth()).toEqual({
      1: "January",
      2: "February",
      3: "March",
      4: "April",
      5: "May",
      6: "June",
      7: "July",
      8: "August",
      9: "September",
      10: "October",
      11: "November",
      12: "December",
    });
  });

  test("Get text color according a percentage of budget and actualt mtd by getPercentageColor function", () => {
    expect(COMMON_SERVICES.getPercentageColor(120, 100)).toBe("red");
    expect(COMMON_SERVICES.getPercentageColor(80, 100)).toBe("orange");
    expect(COMMON_SERVICES.getPercentageColor(60, 100)).toBe("green");
    expect(COMMON_SERVICES.getPercentageColor(40, 100)).toBe("black");
  });

  test("Foramate text value accorging a category name by formatValue function", () => {
    expect(COMMON_SERVICES.formatValue("occupancy", "203")).toBe("203%");
    expect(COMMON_SERVICES.formatValue("adr", "203")).toBe("$203.00");
    expect(COMMON_SERVICES.formatValue("revpar", "203")).toBe("$203.00");
  });

  test("formate date value in a formate of 04/05/26, 12:03 by formateDate function", () => {
    expect(COMMON_SERVICES.formatDate("2026-05-04T06:33:29.161Z")).toBe(
      "04/05/26, 12:03",
    );
  });

  test("formate date in a formate of 30 Oct 2025 by formateCreateDate function", () => {
    expect(COMMON_SERVICES.formatCreateDate("2026-05-04T06:33:29.161Z")).toBe(
      "04 May 2026",
    );
  });

  test("Formate a text in  proper way by formateText function", () => {
    expect(COMMON_SERVICES.formatText("banSi")).toBe("Bansi");
  });

  test("sort data by sortData function", () => {
    const data = [
      { name: "C", age: 20 },
      { name: "A", age: 21 },
      { name: "B", age: 18 },
    ];
    const resultInAse = COMMON_SERVICES.sortData(data, "asc", "name");
    expect(resultInAse).toEqual([
      { name: "A", age: 21 },
      { name: "B", age: 18 },
      { name: "C", age: 20 },
    ]);
    const resultInDesc = COMMON_SERVICES.sortData(data, "desc", "age");
    expect(resultInDesc).toEqual([
      { name: "A", age: 21 },
      { name: "C", age: 20 },
      { name: "B", age: 18 },
    ]);
  });

  test("Accept a proper phone number", () => {
    COMMON_SERVICES.formtePhoneNumber("92345678901");
    expect(Toaster.error).toHaveBeenCalled();
  });
});
