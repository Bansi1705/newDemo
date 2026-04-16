import "../../Styles/Confirmation.css";
import { Buttons } from "./Buttons";

type props = {
  confirm: () => void;
  cancel: () => void;
  message: string;
};

function Confirmation({ confirm, cancel, message }: props) {
  return (
    <>
      <div className="confirm-model">
        <div className="main-confirm">
          <h2 className="confirm-msg">{message}</h2>
          <div className="confirm-actions">
            <Buttons
              label="Yes"
              onClick={confirm}
              className="yes-btn"
            />

            <Buttons
              label="No"
              onClick={cancel}
              className="no-btn"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Confirmation;
