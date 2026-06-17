import { describe, test, expect } from "vitest";
import { ExcelDownload } from "./ExcelDownload";
import ExcelJS from "exceljs";

describe("ExcelDownload", () => {
  test("should download file", async () => {
    const workbook = new ExcelJS.Workbook();

    await ExcelDownload({
      workBook: workbook,
      fileName: "test.xlsx",
    });

    expect(document.createElement).toHaveBeenCalled();
  });
});