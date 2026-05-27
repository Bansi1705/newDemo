import { IoIosCloseCircleOutline } from "react-icons/io";
import "../../Styles/ImagePreview.css";
import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { CONSTANT } from "../../Services/Constant";
import { toast } from "react-toastify";

type FilePreviewProps = {
  file: File | string | (File | string)[] | null;
  onClose: () => void;
};

function FilePreview({ file, onClose }: FilePreviewProps) {
  const [excelHtml, setExcelHtml] = useState("");
  const [objectUrl, setObjectUrl] = useState<string>("");
  const [previewIndex, setPreviewIndex] = useState(0);
  const previewFiles = file ? (Array.isArray(file) ? file : [file]) : [];
  const currentFile = previewFiles[previewIndex];

  useEffect(() => {
    if (!currentFile || typeof currentFile === "string") {
      setObjectUrl("");
      return;
    }

    const url = URL.createObjectURL(currentFile);

    setObjectUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [currentFile]);

  const fileUrl = typeof currentFile === "string" ? currentFile : objectUrl;

  const isImage =
    typeof currentFile === "string"
      ? currentFile.startsWith("data:image")
      : currentFile
        ? CONSTANT.MIME_TYPES.IMAGE.includes(currentFile.type)
        : false;

  const isPdf =
    typeof currentFile === "string"
      ? currentFile.startsWith("data:application/pdf")
      : currentFile?.type === CONSTANT.MIME_TYPES.PDF;

  const isExcel =
    typeof currentFile === "string"
      ? currentFile
          .toLowerCase()
          .includes(CONSTANT.MIME_TYPES.XLSX.toLowerCase()) ||
        currentFile
          .toLowerCase()
          .includes(CONSTANT.MIME_TYPES.XLS.toLowerCase()) ||
        currentFile.toLowerCase().endsWith(".xlsx") ||
        currentFile.toLowerCase().endsWith(".xls")
      : currentFile
        ? currentFile.type === CONSTANT.MIME_TYPES.XLSX ||
          currentFile.type === CONSTANT.MIME_TYPES.XLS
        : false;

  useEffect(() => {
    if (!isExcel) return;

    if (!currentFile) return;

    const loadExcel = async () => {
      try {
        let data: ArrayBuffer;

        if (typeof currentFile === "string") {
          const base64 = currentFile.includes(",")
            ? currentFile.split(",")[1]
            : currentFile;

          const binary = atob(base64);

          const byte = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            byte[i] = binary.charCodeAt(i);
          }

          data = byte.buffer;
        } else {
          data = await currentFile.arrayBuffer();
        }

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
  }, [currentFile, isExcel]);

  if (!file) return null;

  return (
    <div className="imagePreview-model">
      <div className="main-preview flex ">
        {previewFiles.map((item, index) => {
          return (
            <div
              key={index}
              className={`sidebar-item text-black w-1/4 ${
                previewIndex === index ? "active-file" : ""
              }`}
              onClick={() => setPreviewIndex(index)}
            >
              <ul>{item.toString().substring(0.5)}</ul>
            </div>
          );
        })}

        <div className="preview-content">
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
    </div>
  );
}

export default FilePreview;
