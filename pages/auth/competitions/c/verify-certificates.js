import { Button } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { notify } from "../../../../Redux/Actions";
import BrandingFooter from "../../../../components/modules/profileModule/brandingFooter";
import { getCategories } from "../../../../requests/category";
import Api from "../../../../services";
import { decodeBase64 } from "../../../../utility/common";
import {
  CertificateAwards,
  CertificateVerified,
  FirstPlace,
  InsituteCertificateIcon,
  Participation,
  SecondPlace,
  SpecialMention,
  ThirdPlace,
} from "../../../../utility/iconsLibrary";

const VerifyCertificates = () => {
  const router = useRouter();
  const { code } = router.query;
  const dispatch = useDispatch();

  const [decodedPayload, setDecodedPayload] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [competition, setCompetition] = useState(null);
  const [container, setContainer] = useState(null);

  useEffect(() => {
    const getContainer = async () => {
      const resp = await Api.get(
        "/container/get-single-container/" + decodedPayload?.container
      );
      if (resp?.code && resp?.result) {
        setContainer(resp?.result);
      }
    };

    getContainer();
  }, [decodedPayload?.container]);

  useEffect(() => {
    const getCompetition = async () => {
      const resp = await Api.get("/competition/" + decodedPayload?.competition);
      if (resp?.code && resp?.result) {
        setCompetition(resp?.result);
      }
    };

    getCompetition();
  }, [decodedPayload?.competition]);

  useEffect(() => {
    if (code) {
      const payload = decodeBase64(code);
      setDecodedPayload(payload);
    }
  }, [code]);

  useEffect(() => {
    if (decodedPayload) {
      const getCertificate = async () => {
        console.log("getCertificate");
        const response = await Api.post("/certificate/verify", {
          competition: decodedPayload?.competition,
          container: decodedPayload?.container,
        });
        if (response?.code && response?.result) {
          const categories = await getCategories();
          const cats = [];
          response?.result?.competition?.categoryArray?.map((item) => {
            categories.map((it) => {
              const found = it.subCategory.find(
                (sub) => sub.categoryNameSubCategoryNameCode === item
              );
              if (found) cats.push(found);
            });
          });
          response.result.competition.categories = cats;
          setCertificate(response?.result);
          console.log("Certificate response: ", response?.result);
        } else {
          // dispatch(notify({ type: "error", message: response?.message }));
        }
      };

      getCertificate();
    }
  }, [decodedPayload?.competition]);

  console.log("Certificate in verify certificate: ", certificate);

  return (
    <>
      <div className="certificatesDownloadPage">
        <div className="certificatesDownloadPageScroller">
          <div className="certificatesDownloadContainer">
            <div className="certificatesDownloadHeader">
              <div className="certificatesDownloadHeaderLeft">
                <div className="certificatesDownloadUser">
                  <div className="certificatesDownloadHeaderAvatar">
                    {container?.emojiObject?.emoji ? (
                      container?.emojiObject?.emoji
                    ) : container?.imageURL ? (
                      <img src={container?.imageURL} />
                    ) : (
                      <span className="shortText">
                        {container?.containerName[0]}
                      </span>
                    )}
                    {/* <span className="shortText">JD</span> */}
                    {/* <VerifyCertificateCompIcon /> */}
                  </div>
                  <strong className="username">
                    {container?.containerName}
                    {/* {container?.containerName} */}
                  </strong>
                </div>
                {/* <div className="teamNameInfoBox">
                  <div className="teamImage">
                    <img
                      src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1686677492944_Ellipse_26.png"
                      alt=""
                    />
                  </div>
                  <strong className="teamNameText">Team 4</strong>
                </div> */}
              </div>
              {/* <div className="certificatesDownloadHeaderRight">
                <Button
                  type="secondary"
                  shape="round"
                  href={container?.certificate}
                  target="_blank"
                >
                  Download Certificate
                </Button>
              </div> */}
            </div>

            <div className="certificatesDownloadContent">
              <div
                className={`certificatesPositionBlock certificatesAdditionalStyles ${
                  decodedPayload?.type === "placement"
                    ? decodedPayload?.place === "1st place"
                      ? "firstPlaceFrame"
                      : decodedPayload?.place === "2nd place"
                      ? "secondPlaceFrame"
                      : "thirdPlaceFrame"
                    : decodedPayload?.type === "specialMention"
                    ? "specialMentionFrame"
                    : "participationFrame"
                }`}
              >
                <div className="certificatesPositionHolder">
                  <div className="certificatesPositionMedalImge">
                    {decodedPayload?.type === "placement" ? (
                      decodedPayload?.place === "1st place" ? (
                        <FirstPlace />
                      ) : decodedPayload?.place === "2nd place" ? (
                        <SecondPlace />
                      ) : (
                        <ThirdPlace />
                      )
                    ) : decodedPayload?.type === "specialMention" ? (
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
                            {moment(certificate?.competition?.updatedAt).format(
                              "DD/MM/YY"
                            )}
                          </span>
                        </strong>
                      </div>
                      <strong className="placementTitle">
                        {decodedPayload?.type === "placement"
                          ? decodedPayload?.place === "1st place"
                            ? "First Place"
                            : decodedPayload?.place === "2nd place"
                            ? "Second Place"
                            : "Third Place"
                          : decodedPayload?.type === "specialMention"
                          ? decodedPayload?.place
                          : "Participation Certificate"}
                        {/* {decodedPayload?.place} */}
                      </strong>
                      <div className="certificatesInfoText">
                        {certificate?.presentedByTextLine}
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
                          {/* <InsituteCertificateIcon /> */}
                        </div>
                        <div className="certificatesCollegeName">
                          <span className="collegeName">
                            {competition?.Organizer?.institute_name}
                          </span>{" "}
                          to
                        </div>
                      </div>
                      <div className="certificatesRecipientname">
                        {`${
                          competition?.compettiionType === "TEAM"
                            ? container?.containerName
                            : container?.users?.[0]?.firstName +
                              " " +
                              container?.users?.[0]?.lastName
                        }`}
                      </div>
                      <div className="certificatesInfoText">
                        {certificate?.performanceRecognitionTextLine}
                      </div>
                      <div className="certificatesCompetitionName">
                        <div className="certificatesCompetitionIcon">
                          {competition?.emojiObject?.emoji}
                        </div>
                        <span>{competition?.competitionName}</span>
                      </div>
                    </div>
                    <div className="certificatesBlockFooter">
                      {certificate?.signees?.map(
                        (item) =>
                          !item?.isHidden && (
                            <div
                              className="certificateFooterColumn"
                              key={item._id}
                            >
                              <div className="certificateFooterSignature">
                                {item?.signature && (
                                  <img
                                    height={30}
                                    width={30}
                                    src={item?.signature}
                                    alt="signature"
                                  />
                                )}
                              </div>
                              <div className="certificateFooterSignatureWrap">
                                <div className="certificateSignatureName">
                                  {item?.name}
                                </div>
                                <div className="certificateSignatureDes">
                                  {item?.designation}
                                </div>
                              </div>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                  <div className="certificatesPositionOrganisers">
                    <div className="certificatesPositionOrganisersQR">
                      <img
                        src={
                          container?.qrCode ||
                          "https://rethink-competitions.s3.amazonaws.com/1684488804026_image_446.png"
                        }
                      />
                    </div>
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

            <div className="certificatesDownloadFooter">
              <div className="competitionNameBox">
                <div className="competitionNameImage">
                  {competition?.emojiObject?.emoji || <CertificateAwards />}
                </div>
                <strong className="competitionNameText">
                  <span>{competition?.competitionName}</span> |{" "}
                  {competition?.category?.categoryName}
                </strong>
              </div>
              <div className="certificatesDownloadVerified">
                <div className="certificatesDownloadVerifiedImage">
                  <CertificateVerified />
                </div>
                <strong className="certificatesDownloadVerifiedText">
                  This Certificate is verified by Slamitt
                </strong>
              </div>
            </div>
          </div>
        </div>
        <BrandingFooter />
      </div>
    </>
  );
};

export default VerifyCertificates;
