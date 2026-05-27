import React from "react";
import { toast } from "react-toastify";
import { CONSTANT } from "../../Services/Constant";

type FileUploadProps = {
  onFileSelect: (file: File) => void;
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;

    if (!file) return;

    for (let i = 0; i < file.length; i++) {
      const data=file[i]
      if (data.size <= CONSTANT.MAX_FILE_SIZE) {
        onFileSelect(data);
      } else {
        toast.error(CONSTANT.ERROR.LARGE_FILE);
      }
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>

      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        multiple={multipleFile}
      />
    </div>
  );
};

export default FileUpload;
