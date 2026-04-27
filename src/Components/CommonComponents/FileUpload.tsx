import React from "react";

type FileUploadProps = {
  onFileSelect: (file: File) => void;
  label?: string;
  accept?: string;
};

const FileUpload = ({
  onFileSelect,
  label = "Upload File",
  accept = "*/*",
}: FileUploadProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div>
      <label>{label}</label>
      <input type="file" accept={accept} onChange={handleChange} />
    </div>
  );
};

export default FileUpload;
