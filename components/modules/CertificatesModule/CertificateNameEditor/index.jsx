import { Input } from "antd";
import React from "react";

const CertificateNameEditor = ({ setCertificateDetail, certificateDetail }) => {
  return (
    <div className="certificatesEditorSidebarHolder">
      <strong className="certificatesEditorSidebarTitle">TEXT</strong>
      <div className="certificatesEditorSidebarBox">
        <span className="certificatesEditorSidebarTag">Issue date:</span>
        <span className="certificatesEditorSidebarText">
          Certificates will be issued to participants when this competition
          concludes
        </span>
      </div>
      <div className="certificatesEditorSidebarBox">
        <span className="certificatesEditorSidebarTag">
          Certificate Details
        </span>
        <div className="certificatesEditorField">
          <Input
            type="text"
            placeholder="Is Proudly Presented By"
            value={certificateDetail?.presentedByTextLine}
            onChange={(e) =>
              setCertificateDetail({
                ...certificateDetail,
                presentedByTextLine: e.target.value,
              })
            }
          />{" "}
        </div>
      </div>
      <div className="certificatesEditorSidebarBox">
        <div className="certificatesEditorField">
          <Input
            type="text"
            placeholder="In Recognition of their Excellent Performance in"
            value={certificateDetail?.performanceRecognitionTextLine}
            onChange={(e) =>
              setCertificateDetail({
                ...certificateDetail,
                performanceRecognitionTextLine: e.target.value,
              })
            }
          />{" "}
        </div>
      </div>
    </div>
  );
};

export default CertificateNameEditor;
