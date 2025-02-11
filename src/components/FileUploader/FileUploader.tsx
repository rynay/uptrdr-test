import { ChangeEvent, DetailedHTMLProps, FC, InputHTMLAttributes, useEffect, useRef, useState } from "react";
import styles from "./FileUploader.module.scss";

const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 500000;

type Props = {
    files?: File[],
    label?: string;
    maxFileSizeInBytes?: number;
    updateFiles?: (files: File[]) => void
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const FileUploader: FC<Props> = ({
    files = [],
    label,
    updateFiles,
    maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
    multiple,
    ...otherProps
}) => {
  const fileInputField = useRef<HTMLInputElement | null>(null);

  const handleUploadBtnClick = () => {
    fileInputField.current?.click();
  };

  const addNewFiles = (newFiles: FileList) => {
    const result = files;
    for (let file of newFiles) {
      result.push(file)
    }
    return result;
  };

  const handleNewFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const { files: newFiles } = e.target;
    if (newFiles?.length) {
      let updatedFiles = addNewFiles(newFiles);
      updateFiles?.(updatedFiles);
    }
  };

  const removeFile = (fileName: string) => {
    const result = files.filter(el => el.name !== fileName);
    updateFiles?.(result);
  };

  return (
    <>
    {
        updateFiles && (
            <section className={styles.fileUploader}>
                <button className={styles.fileUploader__button} type="button" onClick={handleUploadBtnClick}>
                <span>Upload files</span>
                </button>
                <input
                    className={styles.fileUploader__formField}        
                    type="file"
                    ref={fileInputField}
                    onChange={handleNewFileUpload}
                    {...otherProps}
                />
            </section>
        )
    }
      <div className={styles.fileUploader__filePreviewContainer}>
        <div className={styles.fileUploader__filePreviewList}>
          {files?.map((file, index) => {
            let isImageFile = file?.type?.split("/")[0] === "image";
            return (
              <div className={styles.fileUploader__previewContainer} key={file.name}>
                <div>
                  {isImageFile && (
                    <img
                        className={styles.fileUploader__imagePreview}                    
                        src={file !== null ? URL.createObjectURL(file) : undefined}
                        alt={`file preview ${index}`}
                        onClick={() => {
                            const blobUrl = URL.createObjectURL(file);
                            window.open(blobUrl, '_blank');
                        }}
                    />
                  )}
                {updateFiles && (
                    <button
                        className={styles.fileUploader__remove}
                        onClick={(event) => {
                            event.stopPropagation()
                            removeFile(file.name)
                        }}
                    >
                        <div />
                        <div />
                    </button>
                )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
