"use client";

import TemplatesTab from "../components/TemplatesTab";
import "../admin.css";

export default function TemplatesPage() {
  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Document Templates</h1>
        <p className="admin-page-subtitle">
          Create, manage, and generate document templates
        </p>
      </div>
      <TemplatesTab />
    </div>
  );
}
