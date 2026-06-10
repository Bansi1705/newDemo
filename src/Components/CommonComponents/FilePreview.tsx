import { IoIosCloseCircleOutline } from "react-icons/io";
import "../../Styles/ImagePreview.css";
import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import Confirmation from "./Confirmation";
import Toaster from "../../Services/CommonService/ToasterHelper";
import { CONSTANT } from "../../Services/Constant";

type PreviewFile = {
  name: string;
  url: string;
};

type FilePreviewProps = {
  file: PreviewFile | PreviewFile[] | null;
  onClose: () => void;
  handleRemovePreViewFile?: (index: number) => void;
};

function FilePreview({
  file,
  onClose,
  handleRemovePreViewFile,
}: FilePreviewProps) {
  const [excelHtml, setExcelHtml] = useState("");
  const [previewIndex, setPreviewIndex] = useState(0);
  const previewFiles = file ? (Array.isArray(file) ? file : [file]) : [];
  const currentFile = previewFiles[previewIndex];
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [deletId, setDeleteId] = useState<number | null>(null);
  const [previewTxtFileContent, setPreviewTxtFileContent] = useState("");

  const fileUrl = currentFile?.url || "";

  const mimeType = fileUrl.split(";")[0].replace("data:", "");

  const isImage = CONSTANT.MIME_TYPES.IMAGE.includes(mimeType);

  const isPdf = mimeType === CONSTANT.MIME_TYPES.PDF;

  const isExcel = CONSTANT.MIME_TYPES.EXCEL.includes(mimeType);

  const isVideo = CONSTANT.MIME_TYPES.VIDEO.includes(mimeType);

  const isTxtFile = mimeType === CONSTANT.MIME_TYPES.TXT;

  useEffect(() => {
    if (!currentFile) return;

    console.log(currentFile);

    if (isExcel) {
      const loadExcel = async () => {
        try {
          const base64 = currentFile.url.split(",")[1];
          const binary = atob(base64);

          console.log("xsl", binary);

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
              html += `<td>${cell.value ?? "-"}</td>`;
            });

            html += "</tr>";
          });

          html += "</table>";

          setExcelHtml(html);
        } catch {
          Toaster.error(CONSTANT.TOAST_ERROR_MSG.PREVIEW_FAIL);
          setExcelHtml("");
        }
      };

      loadExcel().catch(() => {
        Toaster.error(CONSTANT.TOAST_ERROR_MSG.NOT_FOUND);
        setExcelHtml("");
      });
    } else {
      try {
        const base64 = currentFile.url.split(",")[1];
        const text = atob(base64);

        console.log("txt", text);

        setPreviewTxtFileContent(text);
      } catch {
        setPreviewTxtFileContent("Unable to preview text file");
      }
    }
  }, [currentFile, isExcel, isTxtFile]);

  if (!file) return null;

  const handleDeleteConfirm = () => {
    if (deletId !== null && handleRemovePreViewFile) {
      setPreviewIndex((prev) => {
        if (prev === deletId) {
          if (prev === previewFiles.length - 1) {
            return prev > 0 ? prev - 1 : 0;
          }
          return prev;
        }
        if (deletId < prev) {
          return prev - 1;
        }
        return prev;
      });
      handleRemovePreViewFile(deletId);
    }

    setShowConfirmDelete(false);
    setDeleteId(null);
  };
  const handleDeleteCancel = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  const previewFileItems = [
    {
      condition: isImage,
      element: (
        <img src={fileUrl} alt={currentFile?.name} className="preview-image" />
      ),
    },
    {
      condition: isPdf,
      element: (
        <iframe src={fileUrl} title="PDF Preview" className="preview-frame" />
      ),
    },
    {
      condition: isExcel,
      element: (
        <iframe
          title="Excel Preview"
          className="preview-frame"
          srcDoc={`
                <html>
                  <head>
                    <style>
                      body {
                        font-family: sans-serif;
                        font-size: 13px;
                        padding: 10px;
                      }

                      table {
                        border-collapse: collapse;
                        width: 100%;
                      }

                      td, th {
                        border: 1px solid #191717;
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
      ),
    },
    {
      condition: isVideo,
      element: (
        <video className="preview-image" controls>
          <source src={fileUrl} />
        </video>
      ),
    },
    {
      condition: isTxtFile,
      element: (
        <div className="txt-preview">
          <pre>{previewTxtFileContent}</pre>
        </div>
      ),
    },
  ];

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

                {handleRemovePreViewFile && (
                  <button
                    className="text-black-300 bg-blue-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowConfirmDelete(true);
                      setDeleteId(index);
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
              {previewFileItems.map((i) => i.condition && i.element)}
            </div>
          </div>
          {showConfirmDelete && (
            <Confirmation
              message="Do You Want To Delete This Item ??"
              type="delete"
              confirm={handleDeleteConfirm}
              cancel={handleDeleteCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default FilePreview;
