import { useRouter } from "next/router";
import React from "react";
import Certificate from "../Certificate";
import CertificateEditor from "../CertificateEditor";

const CertificateContent = ({
  screen,
  certificateCode,
  certificateDetail,
  setCertificateDetail,
  institute,
  setInstitute,
  signees,
  setSignees,
  placementsData,
}) => {
  const router = useRouter();
  const { query } = router;

  return (
    <div className="certificatesEditorBlock">
      <div className="certificatesEditorSidebar">
        <CertificateEditor
          certificate={certificateDetail}
          setCertificate={setCertificateDetail}
          institute={institute}
          setInstitute={setInstitute}
          signees={signees}
          setSignees={setSignees}
          screen={screen}
          certificateCode={certificateCode}
        />
      </div>
      <div className="certificatesEditorContent">
        <Certificate
          activeTab={query.category}
          certificate={certificateDetail}
          institute={institute}
          signees={signees}
          certificateCode={certificateCode}
          placementsData={placementsData}
        />
      </div>
    </div>
  );
};

export default CertificateContent;
