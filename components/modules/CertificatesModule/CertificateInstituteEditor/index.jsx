import React, { useRef, useState } from "react";
import { Button, Form, Input, Typography } from "antd";
import {
  DeleteIcon,
  EditCertificatesIcon,
  InstituteIcon,
  ImageUploadIcon,
} from "../../../../utility/iconsLibrary";
import Api from "../../../../services";
import { useSelector } from "react-redux";

const CertificateInstituteEditor = ({
  certificateDetail,
  setCertificateDetail,
}) => {
  const user = useSelector((state) => state.auth.user);

  const handleUpload = async (payload) => {
    const formData = new FormData();
    formData.append("file", payload);
    const response = await Api.post("/upload/single", formData);
    if (response?.code && response?.result) {
      console.log("Image Payload: ", response.result.location);
      setCertificateDetail({
        ...certificateDetail,
        logo: response?.result?.location,
      });
    }
  };

  return (
    <div className="certificatesEditorSidebarHolder">
      <strong className="certificatesEditorSidebarTitle">
        INSTITUTE Details
      </strong>
      <div className="certificatesEditorSidebarBox">
        <span className="certificatesEditorSidebarTag">Logo</span>
        <div className="certificatesEditorField">
          <Form.Item className="certificatesLogoUploadBox">
            {!certificateDetail?.logo && (
              <>
                <label className="certificatesLogoUploader">
                  <Input
                    type="file"
                    onChange={(e) => {
                      handleUpload(e?.target?.files?.[0]);
                    }}
                  />
                  <ImageUploadIcon className="certificatesLogoUploaderIcon" />
                  <span className="certificatesLogoUploaderText">
                    Preferably 400x400 px (5mb)
                  </span>
                </label>
              </>
            )}
            {certificateDetail?.logo && (
              <div className="certificatesLogoUploaded">
                <div className="certificatesLogoUploadedButtons">
                  <Button
                    className="buttonCircle"
                    icon={<DeleteIcon />}
                    onClick={() =>
                      setCertificateDetail({
                        ...certificateDetail,
                        logo: null,
                      })
                    }
                  ></Button>
                  {/* <Button>Edit</Button> */}
                  <label className="buttonCircle" htmlFor="premiumPhoto">
                    {" "}
                    <EditCertificatesIcon />
                  </label>
                </div>
                <input
                  style={{ display: "none", width: "20px", height: "20px" }}
                  type="file"
                  id="premiumPhoto"
                  onChange={(e) => {
                    handleUpload(e?.target?.files?.[0]);
                  }}
                />
                <img src={certificateDetail?.logo} alt="college logo" />
              </div>
            )}
          </Form.Item>
        </div>
      </div>
      <div className="certificatesEditorSidebarBox">
        <span className="certificatesEditorSidebarTag">Institute Name</span>
        <div className="certificatesEditorField">
          {/* <div>Organiser Institute</div> */}
          <Form.Item className="instituteField">
            <div className="certificatesEditorFieldIcon">
              <InstituteIcon />
            </div>
            <Typography.Text className="certificatesEditorInstituteName">{user?.institute_name}</Typography.Text>
            {/* <Input
              type="text"
              placeholder={user?.institute_name || "Organiser Institute"}
              value={certificateDetail?.name}
              onChange={(e) => {
                setCertificateDetail({
                  ...certificateDetail,
                  name: e?.target?.value,
                });
              }}
            /> */}
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default CertificateInstituteEditor;
