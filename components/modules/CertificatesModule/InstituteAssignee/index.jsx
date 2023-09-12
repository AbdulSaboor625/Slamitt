import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";
import {
  DeleteIcon,
  EditCertificatesIcon,
  ImageUploadIcon,
} from "../../../../utility/iconsLibrary";
import Api from "../../../../services";

const InstituteAssignee = ({ setDetail, detail, signee }) => {
  const handleUpload = async (payload) => {
    const formData = new FormData();
    formData.append("file", payload);

    const response = await Api.post("/upload/single", formData);

    if (response?.code && response?.result) {
      setDetail((prev) => {
        const updated = prev ? [...prev] : [];
        if (signee < updated.length) {
          updated[signee] = {
            ...updated[signee],
            signature: response?.result?.location,
          };
        } else {
          const newInd = {
            signature: response?.result?.location,
            name: "",
            designation: "",
            isHidden: false,
          };
          updated.push(newInd);
        }
        return updated;
      });
    }
  };

  return (
    <div className="editorSigneesConetnt">
      <span className="certificatesEditorSidebarText">
        Upload scanned signature
      </span>
      <div className="certificatesEditorSidebarBox certificatesLogoUploadBox">
        <Form.Item className="certificatesLogoUploadBox">
          {!detail?.signature && (
            <label className="certificatesLogoUploader">
              <Input
                type="file"
                accept=".png, .jpg"
                onChange={(e) => {
                  handleUpload(e?.target?.files?.[0]);
                }}
              />
              <ImageUploadIcon className="certificatesLogoUploaderIcon" />
              <span className="certificatesLogoUploaderText">
                Preferably 400x400 px (5mb)
              </span>
            </label>
          )}
          {/* {detail?.signature && (
            <img
              src={detail?.signature}
              height={30}
              width={30}
              alt="signature"
            />
          )} */}
        </Form.Item>
        {detail?.signature && (
          <div className="certificatesLogoUploaded">
            <div className="certificatesLogoUploadedButtons">
              <Button
                className="buttonCircle"
                icon={<DeleteIcon />}
                onClick={() =>
                  setDetail((prev) => {
                    const updated = prev ? [...prev] : [];
                    if (signee < updated.length) {
                      updated[signee] = {
                        ...updated[signee],
                        signature: null,
                      };
                    } else {
                      const newInd = {
                        signature: null,
                        name: "",
                        designation: "",
                        isHidden: false,
                      };
                      updated.push(newInd);
                    }
                    return updated;
                  })
                }
              ></Button>
              {/* <Button>Edit</Button> */}
              <label className="buttonCircle" htmlFor="premiumPhoto">
                <EditCertificatesIcon />
              </label>
            </div>
            <input
              style={{ display: "none", width: "20px", height: "20px" }}
              type="file"
              id="premiumPhoto"
              // multiple={true}
              onChange={(e) => {
                handleUpload(e?.target?.files?.[0]);
              }}
            />
            <img src={detail?.signature} />
          </div>
        )}
      </div>
      <div className="certificatesEditorSidebarBox">
        <div className="certificatesEditorField">
          <Form.Item>
            <Input
              type="text"
              placeholder="Name of Signee"
              value={detail?.name}
              onChange={(e) =>
                setDetail((prev) => {
                  const updated = prev ? [...prev] : [];
                  if (signee < updated.length) {
                    updated[signee] = {
                      ...updated[signee],
                      name: e?.target?.value,
                    };
                  } else {
                    const newInd = {
                      signature: "",
                      name: e?.target?.value,
                      designation: "",
                      isHidden: false,
                    };
                    updated.push(newInd);
                  }
                  return updated;
                })
              }
            />
          </Form.Item>
        </div>
      </div>
      <div className="certificatesEditorSidebarBox">
        <div className="certificatesEditorField">
          <Form.Item>
            <Input
              type="text"
              placeholder="Assignee Designation"
              value={detail?.designation}
              onChange={(e) =>
                setDetail((prev) => {
                  const updated = prev ? [...prev] : [];
                  if (signee < updated.length) {
                    updated[signee] = {
                      ...updated[signee],
                      designation: e?.target?.value,
                    };
                  } else {
                    const newInd = {
                      signature: "",
                      name: "",
                      designation: e?.target?.value,
                      isHidden: false,
                    };
                    updated.push(newInd);
                  }
                  return updated;
                })
              }
            />
          </Form.Item>
        </div>
      </div>
      <div className="certificatesEditorCheckboxWrap">
        <label className="hideSigneeCheckbox">
          <Input
            type="checkbox"
            checked={detail?.isHidden}
            onChange={(e) =>
              setDetail((prev) => {
                const updated = prev ? [...prev] : [];
                if (signee < updated.length) {
                  updated[signee] = {
                    ...updated[signee],
                    isHidden: e?.target?.checked,
                  };
                } else {
                  const newInd = {
                    signature: "",
                    name: "",
                    designation: "",
                    isHidden: e?.target?.checked,
                  };
                  updated.push(newInd);
                }
                return updated;
              })
            }
          />
          <span className="customChecbox"></span>
          <span className="lblText">Hide Signee</span>
        </label>
      </div>
    </div>
  );
};

export default InstituteAssignee;
