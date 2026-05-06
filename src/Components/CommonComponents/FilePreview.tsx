import { IoIosCloseCircleOutline } from "react-icons/io";
import "../../Styles/ImagePreview.css";
import { useEffect, useState } from "react";
// import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { CONSTANT } from "../../Services/Constant";
import { toast } from "react-toastify";

type FilePreviewProps = {
  file: File | string | null;
  onClose: () => void;
};

function FilePreview({ file, onClose }: FilePreviewProps) {
  const [excelHtml, setExcelHtml] = useState("");
  const [objectUrl, setObjectUrl] = useState<string>("");

  useEffect(() => {
    if (!file || typeof file === "string") {
      setObjectUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const fileUrl = typeof file === "string" ? file : objectUrl;

  const isImage =
    typeof file === "string"
      ? file.startsWith("data:image")
      : file
        ? CONSTANT.MIME_TYPES.IMAGE.includes(file.type)
        : false;

  const isPdf =
    typeof file === "string"
      ? file.startsWith("data:application/pdf")
      : file?.type === CONSTANT.MIME_TYPES.PDF;

  const isExcel =
    typeof file === "string"
      ? file.toLowerCase().includes(CONSTANT.MIME_TYPES.XLSX.toLowerCase()) ||
        file.toLowerCase().includes(CONSTANT.MIME_TYPES.XLS.toLowerCase()) ||
        file.toLowerCase().endsWith(".xlsx") ||
        file.toLowerCase().endsWith(".xls")
      : file
        ? file.type === CONSTANT.MIME_TYPES.XLSX ||
          file.type === CONSTANT.MIME_TYPES.XLS
        : false;

  useEffect(() => {
    if (!isExcel) return;
    if (!file) return;

    const loadExcel = async () => {
      try {
        let data: ArrayBuffer;

        if (typeof file === "string") {
          const base64 = file.includes(",") ? file.split(",")[1] : file;
          const binary = atob(base64);

          const byte = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            byte[i] = binary.charCodeAt(i);
          }

          data = byte.buffer;
        } else {
          data = await file.arrayBuffer();
        }

        //  const workbook = XLSX.read(data, { type: "array" });
        //   const sheetName = workbook.SheetNames[0];
        //   const sheet = workbook.Sheets[sheetName];
        //   const html = XLSX.utils.sheet_to_html(sheet);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(data);

        const worksheet = workbook.worksheets[0];

        let html = "<table>";

        worksheet.eachRow((row) => {
          html += "<tr>";

          row.eachCell((cell) => {
            html += `<td>${cell.value ?? ""}</td>`;
          });

          html += "</tr>";
        });

        html += "</table>";

        setExcelHtml(html);
      } catch {
        toast.error(CONSTANT.ERROR.NOT_FOUND);
        setExcelHtml("");
      }
    };

    loadExcel().catch(() => {
      toast.error(CONSTANT.ERROR.PREVIEW_FAIL);
      setExcelHtml("");
    });
  }, [file, isExcel]);

  if (!file) return null;

  return (
    <div className="imagePreview-model">
      <div className="main-preview">
        <div className="preview-header">
          <IoIosCloseCircleOutline onClick={onClose} className="close-btn" />
        </div>

        {isImage && (
          <img src={fileUrl} alt="Preview" className="preview-image" />
        )}

        {isPdf && (
          <iframe
            src={fileUrl}
            title="PDF Preview"
            width="100%"
            height="500px"
          />
        )}

        {isExcel && (
          <iframe
            title="Excel Preview"
            width="100%"
            height="500px"
            srcDoc={`
              <html>
                <head>
                  <style>
                    body { font-family: Arial; font-size: 13px; }
                    table { border-collapse: collapse; width: 100%; }
                    td, th { border: 1px solid #ccc; padding: 6px; }
                  </style>
                </head>
                <body>
                  ${excelHtml}
                </body>
              </html>
            `}
          />
        )}

        {!isImage && !isPdf && !isExcel && <h3>Unsupported File Type</h3>}
      </div>
    </div>
  );
}

export default FilePreview;
