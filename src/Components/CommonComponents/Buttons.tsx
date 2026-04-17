import type { buttonProps } from "../../Interface/types";

export const Buttons: React.FC<buttonProps> = ({
  type = "button",
  onClick,
  label,
  className,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      className={className}
      disabled={disabled}
      name="commonButton"
      type={type}
    >
      {label}
    </button>
  );
};
