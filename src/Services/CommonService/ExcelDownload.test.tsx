import { describe, test, expect, vi } from "vitest";
import { ExcelDownload } from "./ExcelDownload";
import Toaster from "./ToasterHelper";
import type { Workbook } from "exceljs";

vi.mock("./ToasterHelper", () => ({
  default: {
    success: vi.fn(),
  },
}));

describe("ExcelDownload", () => {
  test("should download excel file and show success message", async () => {
    const writeBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(8));

    const workBook = {
      xlsx: {
        writeBuffer,
      },
    };

    const clickMock = vi.fn();

    vi.spyOn(URL, "createObjectURL").mockReturnValue("mock-url");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

    vi.spyOn(document, "createElement").mockReturnValue({
      click: clickMock,
    } as unknown as HTMLAnchorElement);

    await ExcelDownload({
      workBook: workBook as unknown as Workbook,
      fileName: "test.xlsx",
    });

    expect(writeBuffer).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(Toaster.success).toHaveBeenCalled();
  });
});