import React, { useState } from "react";
import { CONSTANT } from "../../Services/Constant";
import Toaster from "../../Services/CommonService/ToasterHelper";

type FileUploadProps = {
  onFileSelect: (files: File | File[]) => void;
  label?: string;
  accept?: string;
  required?: boolean;
  multipleFile?: boolean;
};

const FileUpload = ({
  onFileSelect,
  label = "Upload File",
  accept = "*/*",
  required = false,
  multipleFile = false,
}: FileUploadProps) => {
  const [fileName, setFileName] = useState("No file selected");
  const [selectedFileCount, setSelectedFileCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      console.log(file.type);

      if (
        CONSTANT.MIME_TYPES.IMAGE.includes(file.type) ||
        CONSTANT.MIME_TYPES.PDF.includes(file.type) ||
        CONSTANT.MIME_TYPES.TXT.includes(file.type) ||
        CONSTANT.MIME_TYPES.EXCEL.includes(file.type)
      ) {
        if (file.size <= CONSTANT.MAX_FILE_SIZE.SMALL) {
          validFiles.push(file);
        } else {
          Toaster.warning(CONSTANT.TOAST_WARNING_MSG.LARGE_IMAGE_FILE);
        }
      } else if (CONSTANT.MIME_TYPES.VIDEO.includes(file.type)) {
        if (file.size <= CONSTANT.MAX_FILE_SIZE.LARGE) {
          validFiles.push(file);
        } else {
          Toaster.warning(CONSTANT.TOAST_WARNING_MSG.LARGE_VIDEO_FILE);
        }
      } else {
        Toaster.warning(CONSTANT.TOAST_WARNING_MSG.INVALID_FILE_TYPE);
      }
    }

    if (validFiles.length > 0) {
      onFileSelect(multipleFile ? validFiles : validFiles[0]);
      const newCount = selectedFileCount + validFiles.length;
      setSelectedFileCount(newCount);
      setFileName(
        multipleFile ? `${newCount} files selected` : validFiles[0].name,
      );
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>

      <label className="custom-file-upload">
        Choose Files
        <input
          data-testid="file-input"
          type="file"
          accept={accept}
          onChange={handleChange}
          multiple={multipleFile}
          hidden
        />
      </label>

      <span>{fileName}</span>
    </div>
  );
};

export default FileUpload;
