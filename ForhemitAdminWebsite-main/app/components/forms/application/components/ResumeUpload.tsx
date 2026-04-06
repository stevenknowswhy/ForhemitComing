"use client";

import { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";

interface ResumeUploadProps {
  resumeUrl: string;
  onUpload: (url: string) => void;
  onRemove: () => void;
}

export function ResumeUpload({ resumeUrl, onUpload, onRemove }: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  if (resumeUrl) {
    return (
      <div className="upload-success-card">
        <div className="upload-success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <path d="M9 15l2 2 4-4"/>
          </svg>
        </div>
        <div className="upload-success-content">
          <span className="upload-success-title">Resume uploaded</span>
          <span className="upload-success-subtitle">Your file is ready for review</span>
        </div>
        <button 
          className="upload-remove-btn"
          onClick={onRemove}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="upload-dropzone">
      <div className="upload-dropzone-content">
        <div className="upload-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17,8 12,3 7,8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <div className="upload-text">
          <span className="upload-primary-text">Drop your resume here</span>
          <span className="upload-secondary-text">or click to browse</span>
        </div>
        <div className="upload-formats">
          <span className="format-badge">PDF</span>
          <span className="format-badge">DOC</span>
          <span className="format-badge">DOCX</span>
          <span className="format-size">up to 8MB</span>
        </div>
      </div>
      <UploadButton
        endpoint="resumeUploader"
        onUploadBegin={() => setIsUploading(true)}
        onClientUploadComplete={(res) => {
          setIsUploading(false);
          if (res?.[0]) {
            onUpload(res[0].url);
          }
        }}
        onUploadError={(error: Error) => {
          setIsUploading(false);
          alert(`ERROR! ${error.message}`);
        }}
        appearance={{
          button: `upload-btn-hidden ${isUploading ? 'uploading' : ''}`,
          allowedContent: "upload-hint-hidden"
        }}
        content={{
          button: "",
          allowedContent: ""
        }}
      />
      {isUploading && (
        <div className="upload-loading">
          <div className="upload-spinner"></div>
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );
}
