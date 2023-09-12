import React from "react";
import {
  InsituteCertificateIcon,
  SignatureCertificateIcon,
  TextCertificateIcon,
} from "../../../../utility/iconsLibrary";

const CertificateSideBar = ({ setScreen, screen }) => {
  return (
    <ul className="certificatesSidebarButtons">
      <li>
        <span
          className={screen == "TEXT" ? "active" : "disable"}
          onClick={() => setScreen("TEXT")}
        >
          <TextCertificateIcon />
          <span className="visibleTabletMobile">Text</span>
        </span>
      </li>
      <li>
        <span
          className={screen == "INSTITUTE" ? "active" : "disable"}
          onClick={() => setScreen("INSTITUTE")}
        >
          <InsituteCertificateIcon />
          <span className="visibleTabletMobile">Institute Details</span>
        </span>
      </li>
      <li>
        <span
          className={screen == "SIGNATURE" ? "active" : "disable"}
          onClick={() => setScreen("SIGNATURE")}
        >
          <SignatureCertificateIcon />
          <span className="visibleTabletMobile">Signees</span>
        </span>
      </li>
    </ul>
  );
};

export default CertificateSideBar;
