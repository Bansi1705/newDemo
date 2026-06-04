import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DOMPurify from "dompurify";
import React from "react";

const showToast = (
  toastId: string,
  message: string,
  color: string,
  title: string,
) => {
  if (!toast.isActive(toastId)) {
    toast(<Toast color={color} title={title} message={message} />, {
      toastId,
    });
  }
};

const Toaster = {
  success: (message: string) =>
    showToast("success-toast", message, "--toastify-color-success", "Success"),

  warning: (message: string) =>
    showToast("warning-toast", message, "--toastify-color-warning", "Warning"),

  error: (message: string) =>
    showToast("error-toast", message, "--toastify-color-error", "Error"),

  info: (message: string) =>
    showToast("info-toast", message, "--toastify-color-info", "Info"),
};

interface CustomToastProps {
  color: string;
  title: string;
  message: string;
}

const Toast: React.FC<CustomToastProps> = ({ color, title, message }) => {
  const sanitizedMessage = DOMPurify.sanitize(message);

  const colorStyle = { color: `var(${color})` };

  return (
    <div>
      <strong style={colorStyle}>{title}</strong>
      <p
        style={title === "Error" ? colorStyle : {}}
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      />
    </div>
  );
};

export default Toaster;
