import { useRef, useState, type FC, type DragEvent, type ChangeEvent } from "react";
import { validateFile, type UploadAreaProps, type UploadState } from "./UploadArea.logic";
import styles from "./UploadArea.module.css";

export const UploadArea: FC<UploadAreaProps> = ({ state: controlled, onFiles }) => {
  const [internal, setInternal] = useState<UploadState>("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const state = controlled ?? internal;

  const accept = (files: File[]) => {
    const valid = files.filter((f) => validateFile(f).ok);
    if (valid.length > 0) onFiles?.(valid);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!controlled) setInternal("idle");
    accept(Array.from(e.dataTransfer.files));
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    accept(Array.from(e.target.files ?? []));

  return (
    <div
      data-testid="upload-area"
      className={styles.area}
      data-state={state}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        if (!controlled) setInternal("dragging");
      }}
      onDragLeave={() => {
        if (!controlled) setInternal("idle");
      }}
      onDrop={onDrop}
    >
      <span>Arraste a imagem ou clique para selecionar</span>
      <small>PNG ou JPG até 10MB</small>
      <input
        ref={inputRef}
        className={styles.hidden}
        type="file"
        accept="image/png,image/jpeg"
        onChange={onChange}
      />
    </div>
  );
};
