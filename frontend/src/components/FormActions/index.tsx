import { faUpload, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent } from "react";
import "./styles.module.css";

interface ActionProps {
  handleFileSubmit(e: FormEvent<HTMLFormElement>): void;
  handleFileRemoval(): void;
  loading: boolean;
  visible: boolean;
}

export default function FormActions({
  handleFileSubmit,
  handleFileRemoval,
  loading,
  visible,
}: ActionProps) {
  return (
    <form
      id="file-actions"
      className={visible ? "shared-wd" : ""}
      onSubmit={handleFileSubmit}
    >
      <button
        className="file-action"
        type="button"
        id="eject-file"
        title="Remove CSV file"
        onClick={handleFileRemoval}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>

      <button
        disabled={loading}
        className="file-action"
        type="submit"
        title={`Submit${loading ? "ting" : ""} CSV file`}
      >
        <FontAwesomeIcon icon={faUpload} />
      </button>
    </form>
  );
}
