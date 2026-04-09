import "../../Styles/Confirmation.css";

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
            <button type="button" onClick={confirm} className="yes-btn">
              Yes
            </button>
            <button type="button" onClick={cancel} className="no-btn">
              NO
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Confirmation;
