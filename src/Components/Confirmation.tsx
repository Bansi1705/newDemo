import "./Confirmation.css";

type props = {
  confirm: () => void;
  cancel: () => void;
};

function Confirmation({ confirm, cancel }: props) {
  return (
    <>
      <div className="confirm-model">
        <div className="main-confirm">
          <h2 className="confirm-msg">
            Do You Really Want To Delete This Item ??
          </h2>
          <div className="confirm-actions">
            <button onClick={confirm} className="yes-btn">
              Yes
            </button>
            <button onClick={cancel} className="no-btn">
              NO
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Confirmation;
