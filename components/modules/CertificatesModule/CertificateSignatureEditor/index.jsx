import { Button } from "antd";
import React, { useEffect, useState } from "react";
import InstituteAssignee from "../InstituteAssignee";

const CertificateSignatureEditor = ({
  certificateDetail,
  setCertificateDetail,
}) => {
  const [signee, setSignee] = useState(0);

  console.log(certificateDetail);

  // console.log()

  return (
    <div className="certificatesEditorSidebarHolder">
      <strong className="certificatesEditorSidebarTitle">Signees</strong>
      <span className="certificatesEditorSidebarText">
        Not updating required details will hide this section automatically
      </span>
      <ul className="certificatesEditorTabs">
        <li className={signee == 0 ? "activeSignee" : ""}>
          <Button
            className={`${
              certificateDetail?.[0]?.isHidden
                ? "diabledSignee"
                : certificateDetail?.[0]?.name &&
                  certificateDetail?.[0]?.designation &&
                  certificateDetail?.[0]?.signature
                ? "filled"
                : ""
            }`}
            onClick={() => setSignee(0)}
          >
            1st Signee
          </Button>
        </li>
        <li className={signee == 1 ? "activeSignee" : ""}>
          <Button
            className={`${
              certificateDetail?.[1]?.isHidden
                ? "diabledSignee"
                : certificateDetail?.[1]?.name &&
                  certificateDetail?.[1]?.designation &&
                  certificateDetail?.[1]?.signature
                ? "filled"
                : ""
            }`}
            onClick={() => setSignee(1)}
          >
            2nd Signee
          </Button>
        </li>
        <li className={signee == 2 ? "activeSignee" : ""}>
          <Button
            className={`${
              certificateDetail?.[2]?.isHidden
                ? "diabledSignee"
                : certificateDetail?.[2]?.name &&
                  certificateDetail?.[2]?.designation &&
                  certificateDetail?.[2]?.signature
                ? "filled"
                : ""
            }`}
            onClick={() => setSignee(2)}
          >
            3rd Signee
          </Button>
        </li>
      </ul>
      <div>
        <InstituteAssignee
          signee={signee}
          detail={certificateDetail?.[signee]}
          setDetail={setCertificateDetail}
        />
      </div>
    </div>
  );
};

export default CertificateSignatureEditor;
