import { Avatar, Button, Col, Input, Modal, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  FirstPlace,
  InsituteCertificateIcon,
  Participation,
  SecondPlace,
  SpecialMention,
  ThirdPlace,
  ArrowRightIcon,
} from "../../../../utility/iconsLibrary";
import moment from "moment";
import { useSelector } from "react-redux";

const CertificateModal = ({
  isModalVisible,
  hideModal,
  certificate,
  index,
  activeCertificate,
  placements,
}) => {
  const [activeindex, setActiveIndex] = useState(index);
  const [value, setValue] = useState("");
  const user = useSelector((state) => state.auth.user);

  // useEffect(() => {
  //   setActiveIndex(index);
  // }, [index]);
  return (
    <Modal
      className="certificatesModal"
      closable={true}
      visible={isModalVisible}
      onOk={hideModal}
      onCancel={hideModal}
      footer={null}
      style={{ borderRadius: "20px" }}
      afterClose={() => setValue("")}
    >
      <div>
        <div
          className={`certificatesPositionBlock certificatesAdditionalStyles
          ${
            activeCertificate?.type === "placement"
              ? activeCertificate?.place === "1st place"
                ? "firstPlaceFrame"
                : activeCertificate?.place === "2nd place"
                ? "secondPlaceFrame"
                : "thirdPlaceFrame"
              : activeCertificate?.type === "specialMention"
              ? "specialMentionFrame"
              : "participationFrame"
          }
          `}
          // className={`certificatesPositionBlock certificatesAdditionalStyles
          // ${
          //   activeindex == 1
          //     ? "firstPlaceFrame"
          //     : activeindex == 2
          //     ? "secondPlaceFrame"
          //     : activeindex == 3
          //     ? "thirdPlaceFrame"
          //     : activeindex == 4
          //     ? "specialMentionFrame"
          //     : activeindex == 5
          //     ? "participationFrame"
          //     : ""
          // }
          // `}
        >
          <div className="certificatesPositionHolder">
            <div className="certificatesPositionMedalImge">
              {activeCertificate?.type === "placement" ? (
                activeCertificate?.place === "1st place" ? (
                  <FirstPlace />
                ) : activeCertificate?.place === "2nd place" ? (
                  <SecondPlace />
                ) : (
                  <ThirdPlace />
                )
              ) : activeCertificate?.type === "specialMention" ? (
                <SpecialMention />
              ) : (
                <Participation />
              )}
            </div>
            <div className="certificatesEditorInformation">
              <div className="certificatesEditorHolder">
                <div className="certificateIssueDate">
                  <strong className="date">
                    Issue Date:{" "}
                    <span>
                      {certificate?.competition?.status === "CONCLUDED"
                        ? moment(certificate?.competition?.updatedAt).format(
                            "DD/MM/YY"
                          )
                        : "DD/MM/YY"}
                    </span>
                  </strong>
                </div>
                <strong className="placementTitle">
                  {activeCertificate?.type === "placement"
                    ? activeCertificate?.place === "1st place"
                      ? "First Place"
                      : activeCertificate?.place === "2nd place"
                      ? "Second Place"
                      : "Third Place"
                    : activeCertificate?.type === "specialMention"
                    ? placements?.places?.find(
                        (item) => item.type === "specialMention"
                      )?.label || activeCertificate?.place?.toUpperCase()
                    : "Participation Certificate"}
                  {/* {activeindex == 1
                    ? "First Place"
                    : activeindex == 2
                    ? "Second Place"
                    : activeindex == 3
                    ? "Third Place"
                    : activeindex == 4
                    ? activeCertificate?.place?.toUpperCase()
                    : activeindex == 5
                    ? "Participation Certificate"
                    : ""} */}
                </strong>
                <div className="certificatesInfoText">
                  {certificate?.presentedByTextLine || "Is Proudly Presented"}
                </div>
                <div className="certificatesCollegeInfo">
                  <div className="certificatesCollegeLogo">
                    {!certificate?.institute?.logo ? (
                      <InsituteCertificateIcon />
                    ) : (
                      <img
                        height={30}
                        width={30}
                        src={`${certificate?.institute?.logo}`}
                      />
                    )}
                  </div>
                  <div className="certificatesCollegeName">
                    <span className="collegeName">
                      {certificate?.institute?.name ||
                        user?.institute_name ||
                        "COLLEGE NAME"}
                    </span>{" "}
                    to
                  </div>
                </div>
                <div className="certificatesRecipientname">
                  {activeCertificate?.containers?.length > 1
                    ? activeCertificate?.containers?.[activeindex]?.users
                        ?.length === 0
                      ? activeCertificate?.containers?.[activeindex]
                          ?.containerName
                      : activeCertificate?.containers?.[activeindex]?.users?.[0]
                          ?.firstName +
                        " " +
                        activeCertificate?.containers?.[activeindex]?.users?.[0]
                          ?.lastName
                    : activeCertificate?.containers?.length === 1
                    ? certificate?.competition?.competitionType === "SOLO"
                      ? activeCertificate?.containers?.[0]?.users?.length === 0
                        ? activeCertificate?.containers?.[0]?.containerName
                        : activeCertificate?.containers?.[0]?.users?.[0]
                            ?.firstName +
                          " " +
                          activeCertificate?.containers?.[0]?.users?.[0]
                            ?.lastName
                      : activeCertificate?.containers?.[0]?.containerName
                    : "[Recipient Name]"}
                </div>
                <div className="certificatesInfoText">
                  {certificate?.performanceRecognitionTextLine ||
                    "In Recognition of their Excellent Performance in"}
                </div>
                <div className="certificatesCompetitionName">
                  {console.log(certificate)}
                  <div className="certificatesCompetitionIcon">
                    {certificate?.competition?.imageURL ? (
                      <Avatar src={certificate?.competition?.imageURL} />
                    ) : (
                      certificate?.competition?.emojiObject?.emoji
                    )}
                  </div>
                  <span>
                    {certificate?.competition?.competitionName ||
                      "Competition Name"}
                  </span>
                </div>
              </div>
              <div className="certificatesBlockFooter">
                {certificate?.signees?.map(
                  (item) =>
                    !item.isHidden &&
                    item?.name &&
                    item?.designation && (
                      <div className="certificateFooterColumn">
                        <div className="certificateFooterSignature">
                          {item?.signature && (
                            <img
                              height={30}
                              width={30}
                              src={item.signature}
                              alt="signature"
                            />
                          )}
                        </div>
                        <div className="certificateFooterSignatureWrap">
                          <div className="certificateSignatureName">
                            {item?.name || "Name of Signee"}
                          </div>
                          <div className="certificateSignatureDes">
                            {item?.designation || "Desgination"}
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
            <div className="certificatesPositionOrganisers">
              {/* <div className="certificatesPositionOrganisersQR">
                <img src="https://rethink-competitions.s3.amazonaws.com/1684488804026_image_446.png" />
              </div> */}
              <div className="certificatesPositionOrganisersLogo">
                <img
                  src="https://rethink-competitions.s3.amazonaws.com/1659457683750_1655746609367slamittlogosmall.png"
                  alt="Slamitt"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {activeCertificate?.containers?.length > 1 && (
        <div className="certificatesPaging">
          <div
            className="arrowNext"
            onClick={() => {
              // if (activeindex < 5) setActiveIndex((prev) => prev + 1);
              // else setActiveIndex(1);
              if (activeindex >= activeCertificate?.containers?.length - 1) {
                setActiveIndex(0);
              } else {
                setActiveIndex(activeindex + 1);
              }
            }}
          >
            <ArrowRightIcon />
          </div>
          <div className="certificatesPagingCounter">
            {activeindex + 1}/{activeCertificate?.containers?.length}
            {/* {activeindex}/{5} */}
          </div>
          <div
            className="arrowPrev"
            onClick={() => {
              // if (activeindex > 1) setActiveIndex((prev) => prev - 1);
              // else setActiveIndex(5);
              if (activeindex <= 0) {
                setActiveIndex(activeCertificate?.containers?.length - 1);
              } else {
                setActiveIndex(activeindex - 1);
              }
            }}
          >
            <ArrowRightIcon />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CertificateModal;
