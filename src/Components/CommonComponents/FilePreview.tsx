import { useMemo } from "react";

type FilePreviewProps = {
  file: File | null;
};

const FilePreview = ({ file }: FilePreviewProps) => {
  const fileURL = useMemo(() => {
    return file ? URL.createObjectURL(file) : "";
  }, [file]);

  if (!file) return <p>No file selected</p>;

  const fileType = file.type;

  if (fileType.startsWith("image/")) {
    return <img src={fileURL} alt="preview" width="300" />;
  }

  if (fileType === "application/pdf") {
    return (
      <iframe src={fileURL} width="100%" height="500px" title="PDF Preview" />
    );
  }

  return (
    <div>
      <p>Preview not supported for this file type.</p>
      Download / Open File
    </div>
  );
};

export default FilePreview;
