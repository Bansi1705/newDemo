import React, { useState } from "react";
import { toast } from "react-toastify";
import { CONSTANT } from "../../Services/Constant";

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

    if (file.size <= CONSTANT.MAX_FILE_SIZE) {
      validFiles.push(file);
    } else {
      toast.error(CONSTANT.ERROR.LARGE_FILE);
    }
  }

  if (validFiles.length > 0) {
    onFileSelect(multipleFile ? validFiles : validFiles[0]);

    const newCount = selectedFileCount + validFiles.length;

    setSelectedFileCount(newCount);

    setFileName(
      multipleFile
        ? `${newCount} files selected`
        : validFiles[0].name
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
