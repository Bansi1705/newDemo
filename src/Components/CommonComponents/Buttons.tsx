import type { buttonProps } from "../../Interface/types";

export const Buttons: React.FC<buttonProps> = ({
  type = "button",
  onClick,
  label,
  className="cursor-pointer",
  disabled,
  dataTestid,
}) => {
  return (
    <button
      onClick={onClick}
      className={className}
      disabled={disabled}
      name="commonButton"
      type={type}
      data-testid={dataTestid}
    >
      {label}
    </button>
  );
};
