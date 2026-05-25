import React from "react";
import { toast } from "react-toastify";
import { CONSTANT } from "../../Services/Constant";

type FileUploadProps = {
  onFileSelect: (file: File) => void;
  label?: string;
  accept?: string;
  required?: boolean;
};

const FileUpload = ({
  onFileSelect,
  label = "Upload File",
  accept = "*/*",
  required = false,
}: FileUploadProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    console.log(file);

    if (!file) return;

    if (file.size <= CONSTANT.MAX_FILE_SIZE) {
      onFileSelect(file);
    } else {
      toast.error(CONSTANT.ERROR.LARGE_FILE);
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>

      <input type="file" accept={accept} onChange={handleChange} />
    </div>
  );
};

export default FileUpload;
