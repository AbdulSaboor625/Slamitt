import { EllipsisOutlined } from "@ant-design/icons";
import { Button, Image, Select, Spin } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Api from "../../../../services";
import {
  CheckedGreenIcon,
  EditPencilIcon,
  FirstPlace,
  Participation,
  SecondPlace,
  SpecialMention,
  ThirdPlace,
  TitleCertificate,
  RewardSettingsIcon,
  EditCertificatesIcon,
  DownloadIcon,
} from "../../../../utility/iconsLibrary";
import DeleteContainerModal from "./CertificateModal";
import CertificateModal from "./CertificateModal";
import { notify } from "../../../../Redux/Actions";
import { downloadPdfFiles } from "../../../../utility/common";

const ContainersView = ({ containers }) => {
  if (containers?.length > 1) {
    return (
      <div className="certificatePlacementTeam">
        {containers?.map((cntr, i) => (
          <div key={i} className="certificatePlacementTeamIcon">
            <Image preview={false} src={cntr?.imageURL} alt="" />
            <span className="icon">
              {cntr?.users?.length > 0 ? (
                cntr?.lockRegistration ? (
                  <CheckedGreenIcon className="statusSuccess" />
                ) : (
                  <EllipsisOutlined className="statusWarning" />
                )
              ) : null}
            </span>
          </div>
        ))}
        <div className="certificatePlacementTeamInfo">
          <div className="certificatePlacementTeamPoints">
            <Image
              preview={false}
              src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1684834403149_image_164.png"
              alt=""
            />
            <span className="number">{containers[0]?.points}</span>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="certificatePlacementTeam">
        <div className="certificatePlacementTeamIcon">
          <Image preview={false} src={containers[0]?.imageURL} alt="" />
          <span className="icon">
            {containers[0]?.users?.length > 0 ? (
              containers[0]?.lockRegistration ? (
                <CheckedGreenIcon className="statusSuccess" />
              ) : (
                <EllipsisOutlined className="statusWarning" />
              )
            ) : null}
          </span>
        </div>
        <div className="certificatePlacementTeamInfo">
          <strong className="certificatePlacementTeamName">
            {containers[0]?.containerName}
          </strong>
          <div className="certificatePlacementTeamPoints">
            <Image
              preview={false}
              src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1684834403149_image_164.png"
              alt=""
            />
            <span className="number">{containers[0]?.points}</span>
          </div>
        </div>
      </div>
    );
  }
};

const Certificates = ({ certificate, placements }) => {
  const competition = useSelector((state) => state.competition);
  const dispatch = useDispatch();

  const router = useRouter();
  const { competitionCode } = router.query;
  // const [checkConfigure, setCheckConfihure] = useState(false);
  // const [certificate, setCertificate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const dumpMenuList = [
    { id: "1", label: "PDF Template" },
    { id: "2", label: "PDF with Recipient Names" },
    { id: "3", label: "JPG Template" },
  ];

  const [downloadOption, setDownloadOption] = useState("PDF Template");

  const handleChange = async (value) => {
    setDownloadOption(value);
    if (downloadOption) {
      setDefaultValue({});
    }
  };

  const [loading, setLoading] = useState(false);

  const handleDownloadClick = async () => {
    if (downloadOption === "PDF Template") {
      dispatch(
        notify({
          type: "info",
          message:
            "Your request has been recieved. Your file will download once ready. This process can take 1 - 2 minutes.",
        })
      );
      try {
        const result = await Api.get(`/certificate/${competitionCode}/pdf`);
        if (result.code && result.result) {
          window.open(result.result, "_blank", "noreferrer");
        } else {
          dispatch(notify({ type: "error", message: result.message }));
        }
      } catch (error) {
        dispatch(notify({ type: "error", message: error?.message }));
      }
    } else if (downloadOption === "Recipient Names") {
      dispatch(
        notify({
          type: "info",
          message: `Your request has been recieved. Your file will download once ready. This process can take some time depending on number of ${
            competition?.current?.competitionType === "SOLO"
              ? "participants"
              : "teams"
          }.`,
        })
      );
      try {
        const result = await Api.get(
          `/certificate/${competitionCode}/recepientPdfs`
        );
        if (result.code && result.result) {
          window.open(result.result, "_blank", "noreferrer");
        } else {
          dispatch(notify({ type: "error", message: result.message }));
        }
      } catch (error) {
        dispatch(notify({ type: "error", message: error?.message }));
      }
    }
  };

  const [activeindex, setActiveIndex] = useState(1);
  const [activeCertificate, setActiveCertificate] = useState(null);

  console.log("Selected Certificate: ", activeCertificate);

  // const [pdfLinks, setPdfLinks] = useState([]);

  // useEffect(() => {
  //   const links = [];
  //   certificate?.competition?.placements
  //     .filter((item) => item.containers)
  //     .forEach((item) => {
  //       item.containers.forEach((con) => {
  //         links.push(con.certificate);
  //       });
  //     });
  //   setPdfLinks(links);
  // }, [competition.placements]);

  

  return (
    <div className="certificatesSettings">
      <div className="visibleTabletMobile certificatesMobileHead">
        {/* <RewardSettingsIcon /> */}
        <div className="certificatesSettingsIcon">
          <TitleCertificate />
        </div>
        <span className="visibleTabletMobileText">Certificates</span>
      </div>
      <div className="certificatesSettingsHeader">
        <div className="certificatesSettingsHeaderTitle">
          <div className="certificatesSettingsIcon slamitCertificateImg">
            <TitleCertificate />
          </div>
          <strong className="certificatesSettingsTitle">
            Slamitt Certificates
          </strong>
        </div>
        <Button className="buttonCircle visibleMobile">
          <EditCertificatesIcon />
        </Button>
      </div>
      {competition?.current?.certificateConfigured
        ? certificate && (
            <div className="certificatesSettingsContent">
              <ul className="certificatePlacementList">
                {certificate?.competition?.status !== "CONCLUDED" ? (
                  <>
                    <li>
                      <div className="certificatePlacementTitle">
                        <strong className="title">First Place</strong>
                      </div>

                      <div className="certificatePlacementBox">
                        <div
                          className="certificatePlacementMedal firstPlace"
                          onClick={() => {
                            setActiveCertificate({
                              type: "placement",
                              place: "1st place",
                              containers: [],
                            });
                            setActiveIndex(1);
                            setIsModalVisible(true);
                          }}
                        >
                          <div className="certificatePlacementMedalHolder">
                            <FirstPlace />
                          </div>
                        </div>
                        {certificate?.competition?.status === "CONCLUDED" &&
                          certificate?.competition?.placements[0] && (
                            <ContainersView
                              containers={
                                certificate?.competition?.placements[0]
                                  ?.containers
                              }
                            />
                          )}
                      </div>

                      {certificate?.competition?.status !== "CONCLUDED" && (
                        <div className="certificatePlacementEdit hiddenMobile">
                          <Button
                            className="buttonEdit"
                            icon={<EditPencilIcon />}
                            onClick={() =>
                              router.push(
                                `/auth/competitions/c/${competitionCode}?category=${"first-place"}`
                              )
                            }
                          >
                            Edit
                          </Button>
                        </div>
                      )}
                    </li>
                    {placements && (
                      <>
                        {!placements?.places?.find(
                          (item) => item.label === "2nd Place"
                        )?.isLocked && (
                          <li>
                            <div className="certificatePlacementTitle">
                              <strong className="title">Second Place</strong>
                            </div>

                            <div className="certificatePlacementBox">
                              <div
                                className="certificatePlacementMedal secondPlace"
                                onClick={() => {
                                  setActiveCertificate({
                                    type: "placement",
                                    place: "2nd place",
                                    containers: [],
                                  });
                                  setActiveIndex(2);
                                  setIsModalVisible(true);
                                }}
                              >
                                <div className="certificatePlacementMedalHolder">
                                  <SecondPlace />
                                </div>
                              </div>
                              {certificate?.competition?.status ===
                                "CONCLUDED" &&
                                certificate?.competition?.placements[1] && (
                                  <ContainersView
                                    containers={
                                      certificate?.competition?.placements[1]
                                        ?.containers
                                    }
                                  />
                                )}
                            </div>

                            {certificate?.competition?.status !==
                              "CONCLUDED" && (
                              <div className="certificatePlacementEdit hiddenMobile">
                                <Button
                                  className="buttonEdit"
                                  icon={<EditPencilIcon />}
                                  onClick={() =>
                                    router.push(
                                      `/auth/competitions/c/${competitionCode}?category=${"second-place"}`
                                    )
                                  }
                                >
                                  Edit
                                </Button>
                              </div>
                            )}
                          </li>
                        )}
                        {!placements?.places?.find(
                          (item) => item.label === "3rd Place"
                        )?.isLocked && (
                          <li>
                            <div className="certificatePlacementTitle">
                              <strong className="title">Third Place</strong>
                            </div>

                            <div className="certificatePlacementBox">
                              <div
                                className="certificatePlacementMedal thirdPlace"
                                onClick={() => {
                                  setActiveCertificate({
                                    type: "placement",
                                    place: "3rd place",
                                    containers: [],
                                  });
                                  setActiveIndex(3);
                                  setIsModalVisible(true);
                                }}
                              >
                                <div className="certificatePlacementMedalHolder">
                                  <ThirdPlace />
                                </div>
                              </div>
                              {certificate?.competition?.status ===
                                "CONCLUDED" &&
                                certificate?.competition?.placements[2] && (
                                  <ContainersView
                                    containers={
                                      certificate?.competition?.placements[2]
                                        ?.containers
                                    }
                                  />
                                )}
                            </div>

                            {certificate?.competition?.status !==
                              "CONCLUDED" && (
                              <div className="certificatePlacementEdit hiddenMobile">
                                <Button
                                  className="buttonEdit"
                                  icon={<EditPencilIcon />}
                                  onClick={() =>
                                    router.push(
                                      `/auth/competitions/c/${competitionCode}?category=${"third-place"}`
                                    )
                                  }
                                >
                                  Edit
                                </Button>
                              </div>
                            )}
                          </li>
                        )}
                        {placements?.places?.find(
                          (item) => item.type === "specialMention"
                        ) &&
                          !placements?.places?.find(
                            (item) => item.type === "specialMention"
                          )?.isLocked && (
                            <li>
                              <div className="certificatePlacementTitle">
                                <strong className="title">
                                  {placements?.places?.find(
                                    (item) => item.type === "specialMention"
                                  )?.label || "Special Mention"}
                                </strong>
                              </div>

                              <div className="certificatePlacementBox">
                                <div
                                  className="certificatePlacementMedal specialMention"
                                  onClick={() => {
                                    setActiveCertificate({
                                      type: "specialMention",
                                      place: "Special Mention",
                                      containers: [],
                                    });
                                    setActiveIndex(4);
                                    setIsModalVisible(true);
                                  }}
                                >
                                  <div className="certificatePlacementMedalHolder">
                                    <SpecialMention />
                                  </div>
                                </div>
                              </div>

                              {certificate?.competition?.status !==
                                "CONCLUDED" && (
                                <div className="certificatePlacementEdit hiddenMobile">
                                  <Button
                                    className="buttonEdit"
                                    icon={<EditPencilIcon />}
                                    onClick={() =>
                                      router.push(
                                        `/auth/competitions/c/${competitionCode}?category=${"special-mention"}`
                                      )
                                    }
                                  >
                                    Edit
                                  </Button>
                                </div>
                              )}
                            </li>
                          )}
                      </>
                    )}
                    <li>
                      <div className="certificatePlacementTitle">
                        <strong className="title">Participation</strong>
                      </div>

                      <div className="certificatePlacementBox">
                        <div
                          className="certificatePlacementMedal"
                          onClick={() => {
                            setActiveCertificate({
                              type: "",
                              place: "",
                              containers: [],
                            });
                            setActiveIndex(5);
                            setIsModalVisible(true);
                          }}
                        >
                          <div className="certificatePlacementMedalHolder">
                            <Participation />
                          </div>
                        </div>
                      </div>

                      {certificate?.competition?.status !== "CONCLUDED" && (
                        <div className="certificatePlacementEdit hiddenMobile">
                          <Button
                            className="buttonEdit"
                            icon={<EditPencilIcon />}
                            onClick={() =>
                              router.push(
                                `/auth/competitions/c/${competitionCode}?category=${"participation"}`
                              )
                            }
                          >
                            Edit
                          </Button>
                        </div>
                      )}
                    </li>
                  </>
                ) : (
                  certificate?.competition?.placements?.map((item, index) => {
                    return (
                      <li key={`${index}`}>
                        <div className="certificatePlacementTitle">
                          <strong className="title">
                            {item.type === "placement"
                              ? item.place === "1st place"
                                ? "First Place"
                                : item.place === "2nd place"
                                ? "Second Place"
                                : "Third Place"
                              : item.type === "specialMention"
                              ? item.place
                              : "Participant"}
                          </strong>
                        </div>

                        <div className="certificatePlacementBox">
                          <div
                            className={`certificatePlacementMedal ${
                              item.type === "placement"
                                ? item.place === "1st place"
                                  ? "firstPlace"
                                  : item.place === "2nd place"
                                  ? "secondPlace"
                                  : "thirdPlace"
                                : item.type === "specialMention"
                                ? "specialMention"
                                : ""
                            }`}
                            onClick={() => {
                              setActiveCertificate(item);
                              setActiveIndex(1);
                              setIsModalVisible(true);
                            }}
                          >
                            <div className="certificatePlacementMedalHolder">
                              {item.type === "placement" ? (
                                item.place === "1st place" ? (
                                  <FirstPlace />
                                ) : item.place === "2nd place" ? (
                                  <SecondPlace />
                                ) : (
                                  <ThirdPlace />
                                )
                              ) : item.type === "specialMention" ? (
                                <SpecialMention />
                              ) : (
                                <Participation />
                              )}
                            </div>
                          </div>
                          {certificate?.competition?.status === "CONCLUDED" &&
                            item && (
                              <ContainersView containers={item?.containers} />
                            )}
                        </div>

                        {certificate?.competition?.status !== "CONCLUDED" && (
                          <div className="certificatePlacementEdit hiddenMobile">
                            <Button
                              className="buttonEdit"
                              icon={<EditPencilIcon />}
                              onClick={() =>
                                router.push(
                                  `/auth/competitions/c/${competitionCode}?category=${"first-place"}`
                                )
                              }
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </li>
                    );
                  })
                )}
                {/* <li className="certificatePlacementTemplateItem">
                  <div className="certificatePlacementTitle">
                    <strong className="title">Export Certificates</strong>
                  </div>
                  <div className="certificatePlacementTemplate">
                    <div className="certificatePlacementSelect">
                      <Select
                        style={{ width: 120 }}
                        onChange={handleChange}
                        placeholder="Select Download Option"
                        defaultValue={{ value: "PDF Template", label: "PDF Template" }}
                        
                        options={
                          competition?.current?.status === "CONCLUDED"
                            ? [
                                {
                                  value: "PDF Template",
                                  label: "PDF Template",
                                },
                                // {
                                //   value: "Recipient Names",
                                //   label: "PDF with Recipient Names",
                                // },
                                // { value: "JPG Template", label: "JPG Template" },
                              ]
                            : [{ value: "PDF Template", label: "PDF Template" }]
                        }
                      />
                    </div>
                    <Button
                      className="buttonDownload"
                      type="primary"
                      onClick={handleDownloadClick}
                    >
                      <span className="hiddenMobile">
                        {loading ? <div className="loader-icon" /> : "Download"}
                      </span>
                      <span className="visibleMobile">
                        {loading ? (
                          <div className="loader-icon" />
                        ) : (
                          <DownloadIcon />
                        )}
                      </span>
                    </Button>
                  </div>
                </li> */}
              </ul>
            </div>
          )
        : competition?.current?.status !== "CONCLUDED" && (
            <Button
              className="buttonConfigure"
              // onClick={() => setCheckConfihure(true)}
              onClick={() =>
                router.push(
                  `/auth/competitions/c/${competitionCode}?category=${"first-place"}`
                )
              }
            >
              Configure
            </Button>
          )}

      <CertificateModal
        isModalVisible={isModalVisible}
        hideModal={hideModal}
        certificate={certificate}
        index={activeindex}
        activeCertificate={activeCertificate}
        placements={placements}
      />
    </div>
  );
};

export default Certificates;
