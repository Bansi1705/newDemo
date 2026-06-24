import "../../Styles/Confirmation.css";
import { Buttons } from "./Buttons";

export type confirmationProps = {
  confirm: () => void;
  cancel: () => void;
  message: string;
  type: "delete" | "edit" | "Logout";
};

function Confirmation({ confirm, cancel, message, type }: confirmationProps) {
  return (
    <>
      <div className="confirm-model">
        <div className="main-confirm">
          <h2 className="confirm-msg">{message}</h2>
          <div className="confirm-actions flex justify-center gap-4">
            <>
              <Buttons
              dataTestid="confirm-delete-btn"
                label={
                  type == "edit"
                    ? "Yes"
                    : type == "delete"
                      ? "Delete"
                      : "Logout"
                }
                onClick={confirm}
                className="yes-btn"
              />

              <Buttons
                label={type == "edit" ? "No" : "Cancel"}
                onClick={cancel}
                className="no-btn"
              />
            </>
          </div>
        </div>
      </div>
    </>
  );
}

export default Confirmation;
