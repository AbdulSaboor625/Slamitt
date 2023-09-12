import { Button } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  FirstPlace,
  Participation,
  SecondPlace,
  SpecialMention,
  ThirdPlace,
  InsituteCertificateIcon,
} from "../../../../utility/iconsLibrary";
import { slamittLogoSmall } from "../../../../utility/imageConfig";
import { useSelector } from "react-redux";
import moment from "moment";

const Certificate = ({
  activeTab,
  certificate,
  institute,
  signees,
  certificateCode,
  placementsData,
}) => {
  const [activePlace, setActivePlace] = useState();

  const user = useSelector((state) => state.auth.user);
  const competition = useSelector((state) => state.competition);

  useEffect(() => {
    setActivePlace(activeTab);
  }, [activeTab]);
  const router = useRouter();

  return (
    <div className="certificatesEditorWrapper">
      <ul className="certificatesEditorNav">
        <li>
          <Button
            className={`${activeTab === "first-place" ? "active" : ""}`}
            onClick={() => {
              setActivePlace("first-place");
              router.push(
                `/auth/competitions/c/${certificateCode}?category=${"first-place"}`
              );
            }}
          >
            First Place
          </Button>
        </li>
        {placementsData && (
          <>
            {!placementsData?.places?.find((item) => item.label === "2nd Place")
              ?.isLocked && (
              <li>
                <Button
                  className={`${activeTab === "second-place" ? "active" : ""}`}
                  onClick={() => {
                    setActivePlace("second-place");
                    router.push(
                      `/auth/competitions/c/${certificateCode}?category=${"second-place"}`
                    );
                  }}
                >
                  Second Place
                </Button>
              </li>
            )}
            {!placementsData?.places?.find((item) => item.label === "3rd Place")
              ?.isLocked && (
              <li>
                <Button
                  className={`${activeTab === "third-place" ? "active" : ""}`}
                  onClick={() => {
                    setActivePlace("third-place");
                    router.push(
                      `/auth/competitions/c/${certificateCode}?category=${"third-place"}`
                    );
                  }}
                >
                  Third Place
                </Button>
              </li>
            )}
            {placementsData?.places?.find(
              (item) => item.type === "specialMention"
            ) &&
              !placementsData?.places?.find(
                (item) => item.type === "specialMention"
              )?.isLocked && (
                <li>
                  <Button
                    className={`${
                      activeTab === "special-mention" ? "active" : ""
                    }`}
                    onClick={() => {
                      setActivePlace("special-mention");
                      router.push(
                        `/auth/competitions/c/${certificateCode}?category=${"special-mention"}`
                      );
                    }}
                  >
                    {placementsData?.places?.find(
                      (item) => item.type === "specialMention"
                    )?.label || "Special Mention"}
                  </Button>
                </li>
              )}
          </>
        )}
        <li>
          <Button
            className={`${activeTab === "participation" ? "active" : ""}`}
            onClick={() => {
              setActivePlace("participation");
              router.push(
                `/auth/competitions/c/${certificateCode}?category=${"participation"}`
              );
            }}
          >
            Participation
          </Button>
        </li>
      </ul>
      <div
        className={`certificatesPositionBlock ${
          activeTab === "first-place"
            ? "firstPlaceFrame"
            : activeTab === "second-place"
            ? "secondPlaceFrame"
            : activeTab === "third-place"
            ? "thirdPlaceFrame"
            : activeTab === "special-mention"
            ? "specialMentionFrame"
            : activeTab === "participation"
            ? "participationFrame"
            : ""
        }`}
      >
        <div className="certificatesPositionHolder">
          <div className="certificatesPositionMedalImge">
            {activeTab === "first-place" ? (
              <FirstPlace />
            ) : activeTab === "second-place" ? (
              <SecondPlace />
            ) : activeTab === "third-place" ? (
              <ThirdPlace />
            ) : activeTab === "special-mention" ? (
              <SpecialMention />
            ) : activeTab === "participation" ? (
              <Participation />
            ) : (
              ""
            )}
          </div>
          <div className="certificatesEditorInformation">
            <div className="certificatesEditorHolder">
              <div className="certificateIssueDate">
                <strong className="date">
                  Issue Date:{" "}
                  {moment(certificate?.competition?.updatedAt).format(
                    "DD/MM/YY"
                  ) || <span>DD/MM/YY</span>}
                </strong>
              </div>
              {activeTab === "first-place" ? (
                <strong className="placementTitle">First Place</strong>
              ) : activeTab === "second-place" ? (
                <strong className="placementTitle">Second Place</strong>
              ) : activeTab === "third-place" ? (
                <strong className="placementTitle">Third Place</strong>
              ) : activeTab === "special-mention" ? (
                <strong className="placementTitle">
                  {placementsData?.places?.find(
                    (item) => item.type === "specialMention"
                  )?.label || "Special Mention"}
                </strong>
              ) : activeTab === "participation" ? (
                <strong className="placementTitle">
                  PARTICIPATION CERTIFICATE
                </strong>
              ) : (
                ""
              )}
              <div className="certificatesInfoText">
                {certificate?.presentedByTextLine
                  ? certificate?.presentedByTextLine
                  : "Is Proudly Presented By"}
              </div>
              <div className="certificatesCollegeInfo">
                <div className="certificatesCollegeLogo">
                  {!institute?.logo ? (
                    <InsituteCertificateIcon />
                  ) : (
                    <img height={30} width={30} src={`${institute?.logo}`} />
                  )}
                </div>
                <div className="certificatesCollegeName">
                  <span className="collegeName">
                    {institute?.name ? institute?.name : user?.institute_name}
                  </span>{" "}
                  to
                </div>
              </div>
              <div className="certificatesRecipientname">[recipient name]</div>
              <div className="certificatesInfoText">
                {certificate?.performanceRecognitionTextLine
                  ? certificate?.performanceRecognitionTextLine
                  : "In Recognition of their Excellent Performance in"}
              </div>
              <div className="certificatesCompetitionName">
                <div className="certificatesCompetitionIcon">
                  {competition?.current?.emojiObject?.emoji || "😉"}
                </div>
                <span>
                  {competition?.current?.competitionName || "Competition Name"}
                </span>
              </div>
            </div>
            <div className="certificatesBlockFooter">
              {signees &&
                signees.length > 0 &&
                signees?.map(
                  (item) =>
                    !item.isHidden &&
                    (item.signature || item.name || item.designation) && (
                      <div
                        className="certificateFooterColumn"
                        key={item.signeeCode}
                      >
                        {item?.signature && (
                          <div className="certificateFooterSignature">
                            <img
                              height={30}
                              width={30}
                              src={item?.signature}
                              alt="signature"
                            />
                          </div>
                        )}
                        <div className="certificateFooterSignatureWrap">
                          <div className="certificateSignatureName">
                            {item?.name ? item?.name : "Name of Signee"}
                          </div>
                          <div className="certificateSignatureDes">
                            {item?.designation
                              ? item?.designation
                              : "Desgination"}
                          </div>
                        </div>
                      </div>
                    )
                )}
            </div>
          </div>
          <div className="certificatesPositionOrganisers">
            <div className="certificatesPositionOrganisersQR">
              <img src="https://rethink-competitions.s3.amazonaws.com/1684488804026_image_446.png" />
            </div>
            <div className="certificatesPositionOrganisersLogo">
              <img src={slamittLogoSmall} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
