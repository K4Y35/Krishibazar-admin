"use client";

import { forwardRef, useCallback } from "react";

interface FileUploadProps {
  accept?: string;
  onFileSelect: (file: File) => void;
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ accept = "*", onFileSelect }, ref) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFileSelect(e.target.files[0]);
      }
    };

    return (
      <div className="my-8 flex flex-col items-center justify-center">
        <input
          type="file"
          id="file-upload"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          ref={ref}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer rounded-md bg-primaryPink px-4 py-2 text-white"
        >
          Select File
        </label>
        <p className="mt-2 text-sm text-gray-500">
          Supported formats: {accept}
        </p>
      </div>
    );
  },
);

FileUpload.displayName = "FileUpload";

export default FileUpload;
