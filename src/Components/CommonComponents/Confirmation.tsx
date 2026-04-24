import { MdCheck, MdClose } from "react-icons/md";
import "../../Styles/Confirmation.css";
import { Buttons } from "./Buttons";

type props = {
  confirm: () => void;
  cancel: () => void;
  message: string;
  type: "delete" | "edit";
};

function Confirmation({ confirm, cancel, message, type }: props) {
  return (
    <>
      <div className="confirm-model">
        <div className="main-confirm">
          <h2 className="confirm-msg">{message}</h2>
          <div className="confirm-actions flex justify-center gap-4">
            {type === "edit" ? (
              <>
                <Buttons label="Yes" onClick={confirm} className="yes-btn" />

                <Buttons label="No" onClick={cancel} className="no-btn" />
              </>
            ) : (
              <>
                <Buttons
                  label={<MdCheck />}
                  onClick={confirm}
                  className="yes-btn"
                />

                <Buttons
                  label={<MdClose />}
                  onClick={cancel}
                  className="no-btn"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Confirmation;
