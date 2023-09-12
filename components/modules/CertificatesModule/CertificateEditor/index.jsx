import React, { useState } from "react";
import CertificateNameEditor from "../CertificateNameEditor";
import CertificateInstituteEditor from "../CertificateInstituteEditor";
import CertificateSignatureEditor from "../CertificateSignatureEditor";

const CertificateEditor = ({
  screen,
  certificate,
  setCertificate,
  institute,
  setInstitute,
  signees,
  setSignees,
}) => {
  switch (screen) {
    case "TEXT":
      return (
        <CertificateNameEditor
          certificateDetail={certificate}
          setCertificateDetail={setCertificate}
        />
      );
    case "INSTITUTE":
      return (
        <CertificateInstituteEditor
          certificateDetail={institute}
          setCertificateDetail={setInstitute}
        />
      );
    case "SIGNATURE":
      return (
        <CertificateSignatureEditor
          certificateDetail={signees}
          setCertificateDetail={setSignees}
        />
      );
    default:
      return <div />;
  }
};
export default CertificateEditor;
