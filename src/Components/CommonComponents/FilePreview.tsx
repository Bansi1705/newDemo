import { IoIosCloseCircleOutline } from "react-icons/io";
import "../../Styles/ImagePreview.css";
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

type FilePreviewProps = {
  file: File | string | null;
  onClose: () => void;
};

function FilePreview({ file, onClose }: FilePreviewProps) {
  const [excelHtml, setExcelHtml] = useState("");
  const [excelError, setExcelError] = useState("");
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
      : (file?.type?.startsWith("image/") ?? false);

  const isPdf =
    typeof file === "string"
      ? file.startsWith("data:application/pdf")
      : file?.type === "application/pdf";

  const isExcel =
    typeof file === "string"
      ? file.toLowerCase().includes("spreadsheetml") ||
        file.toLowerCase().includes("application/vnd.ms-excel") ||
        (file.startsWith("data:") &&
          file.includes("base64") &&
          !file.startsWith("data:image") &&
          !file.startsWith("data:application/pdf")) ||
        file.toLowerCase().endsWith(".xlsx") ||
        file.toLowerCase().endsWith(".xls")
      : (file?.type?.includes("spreadsheet") ?? false) ||
        (file?.type?.includes("excel") ?? false) ||
        (file?.name?.toLowerCase().endsWith(".xlsx") ?? false) ||
        (file?.name?.toLowerCase().endsWith(".xls") ?? false);

  useEffect(() => {
    if (!isExcel) return;
    if (!file) return;

    const loadExcel = async () => {
      let data;

      if (typeof file === "string") {
        const base64 = file.includes(",") ? file.split(",")[1] : file;
        const binary = atob(base64);

        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }

        data = bytes.buffer;
      } else {
        data = await file.arrayBuffer();
      }

      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const html = XLSX.utils.sheet_to_html(sheet);

      setExcelError("");
      setExcelHtml(html);
    };

    loadExcel().catch((e) => {
      const msg = e instanceof Error ? e.message : "Excel preview failed";
      setExcelError(msg);
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
