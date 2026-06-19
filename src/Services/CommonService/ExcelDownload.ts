import type { Workbook } from "exceljs";
import { CONSTANT } from "../Constant";
import Toaster from "./ToasterHelper";
interface excelDownloadProps {
  workBook: Workbook;
  fileName: string;
}

export const ExcelDownload = async ({
  workBook,
  fileName,
}: excelDownloadProps) => {
  const buffer = await workBook.xlsx.writeBuffer();
  // console.log(buffer)
  const blob = new Blob([buffer], {
    type: CONSTANT.MIME_TYPES.EXCEL[0],
  });
  // console.log(blob)
  const url = URL.createObjectURL(blob);
  // console.log(url)
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
  Toaster.success(CONSTANT.TOAST_SUCCESS_MSG.FILE_DOWNLOADED);
};
