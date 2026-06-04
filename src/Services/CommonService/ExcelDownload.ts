import type { Workbook } from "exceljs";
import { CONSTANT } from "../Constant";
import { TOASTER } from "./ToasterHelper";

interface excelDownloadProps {
  workBook: Workbook;
  fileName: string;
}

export const ExcelDownload = async ({
  workBook,
  fileName,
}: excelDownloadProps) => {
  const buffer = await workBook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: CONSTANT.MIME_TYPES.EXCEL[0],
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
  TOASTER.SUCCESS.FILE_DOWNLOAD();
};
