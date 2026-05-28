import { IoIosCloseCircleOutline } from "react-icons/io";
import "../../Styles/ImagePreview.css";
import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { CONSTANT } from "../../Services/Constant";
import { toast } from "react-toastify";

type PreviewFile = {
  name: string;
  url: string;
};

type FilePreviewProps = {
  file: PreviewFile | PreviewFile[] | null;
  onClose: () => void;
  handleRemoveFile?: (index: number) => void;
};

function FilePreview({ file, onClose, handleRemoveFile }: FilePreviewProps) {
  const [excelHtml, setExcelHtml] = useState("");
  const [previewIndex, setPreviewIndex] = useState(0);
  const previewFiles = file ? (Array.isArray(file) ? file : [file]) : [];
  const currentFile = previewFiles[previewIndex];

  const fileUrl = currentFile?.url || "";

  const isImage = fileUrl.startsWith("data:image");

  const isPdf = fileUrl.startsWith("data:application/pdf");

  const isExcel =
    currentFile?.name.toLowerCase().endsWith(".xlsx") ||
    currentFile?.name.toLowerCase().endsWith(".xls");

  useEffect(() => {
    if (!isExcel || !currentFile) return;

    const loadExcel = async () => {
      try {
        const base64 = currentFile.url.includes(",")
          ? currentFile.url.split(",")[1]
          : currentFile.url;

        const binary = atob(base64);

        const bytes = new Uint8Array(binary.length);

        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }

        const workbook = new ExcelJS.Workbook();

        await workbook.xlsx.load(bytes.buffer);

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
        toast.error(CONSTANT.ERROR.PREVIEW_FAIL);
        setExcelHtml("");
      }
    };

    loadExcel().catch(() => {
      toast.error(CONSTANT.ERROR.NOT_FOUND);
      setExcelHtml("");
    });
  }, [currentFile, isExcel]);

  if (!file) return null;

  return (
    <div className="imagePreview-model">
      <div className="main-preview">
        <div className="preview-body">
          <div className="sidebar">
            {previewFiles.map((item, index) => (
              <div
                key={index}
                className={`sidebar-item ${
                  previewIndex === index ? "active-file" : ""
                }`}
                onClick={() => setPreviewIndex(index)}
              >
                {item.name}

                {handleRemoveFile && (
                  <button
                    className="text-black-300 bg-blue-400"
                    onClick={(e) => {
                      e.stopPropagation();

                      setPreviewIndex((prev) => {
                        if (prev === index) {
                          if (prev === previewFiles.length - 1) {
                            return prev > 0 ? prev - 1 : 0;
                          }

                          return prev;
                        }

                        if (index < prev) {
                          return prev - 1;
                        }

                        return prev;
                      });

                      handleRemoveFile(index);
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="preview-content">
            <div className="preview-header">
              <IoIosCloseCircleOutline
                onClick={onClose}
                className="close-btn"
              />
            </div>

            <div className="preview-viewer">
              {isImage && (
                <img
                  src={fileUrl}
                  alt={currentFile?.name}
                  className="preview-image"
                />
              )}

              {isPdf && (
                <iframe
                  src={fileUrl}
                  title="PDF Preview"
                  className="preview-frame"
                />
              )}

              {isExcel && (
                <iframe
                  title="Excel Preview"
                  className="preview-frame"
                  srcDoc={`
                <html>
                  <head>
                    <style>
                      body {
                        font-family: Arial;
                        font-size: 13px;
                        padding: 10px;
                      }

                      table {
                        border-collapse: collapse;
                        width: 100%;
                      }

                      td, th {
                        border: 1px solid #ccc;
                        padding: 6px;
                      }
                    </style>
                  </head>

                  <body>
                    ${excelHtml}
                  </body>
                </html>
             `}
                />
              )}

              {!isImage && !isPdf && !isExcel && (
                <div className="unsupported-file">Unsupported File Type</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilePreview;
