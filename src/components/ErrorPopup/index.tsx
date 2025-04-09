import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles.css";

interface ErrorProps {
  message: string;
  close(): void;
}
export default function ErrorPopup({ message, close }: ErrorProps) {
  return (
    <div id="error">
      <p>{message}</p>
      <button type="button" title="Close error popup" data-testid="error-popup">
        <FontAwesomeIcon
          icon={faXmark}
          onClick={close}
          data-testid="close-error"
        />
      </button>
    </div>
  );
}
