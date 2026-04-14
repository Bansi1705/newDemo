import type { buttonProps } from "../../types";

export const Buttons: React.FC<buttonProps> = ({
  onClick,
  label,
  className,
  disabled,
  type ="button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
