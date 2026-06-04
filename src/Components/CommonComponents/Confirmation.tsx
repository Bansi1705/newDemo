import "../../Styles/Confirmation.css";
import { Buttons } from "./Buttons";

type props = {
  confirm: () => void;
  cancel: () => void;
  message: string;
  type: "delete" | "edit" | "Logout";
};

function Confirmation({ confirm, cancel, message, type }: props) {
  return (
    <>
      <div className="confirm-model">
        <div className="main-confirm">
          <h2 className="confirm-msg">{message}</h2>
          <div className="confirm-actions flex justify-center gap-4">
            <>
              <Buttons
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
                label={type == "edit" ? "NO" : "Cancel"}
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
