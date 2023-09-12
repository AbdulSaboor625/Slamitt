import {
  Avatar,
  Button,
  Checkbox,
  Image,
  Input,
  Modal,
  Popconfirm,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppSelect from "../../../AppSelect";
import EditBasicSettingsModal from "./editBasicSettingsModal";

import { notify } from "../../../../Redux/Actions";
import {
  allRoundsScoreSheet,
  singleMockRoundScoreSheet,
  singleRoundScoreSheet,
} from "../../../../utility/excelService";
import {
  ArrowBackIcon,
  CompetitionIcon,
  ConcludeIcon,
  CrossCircleIcon,
  DeleteIcon,
  DownloadIcon,
} from "../../../../utility/iconsLibrary";
import {
  abandonCompIcoon,
  concludeCompetition,
  deleteCompIcon,
} from "../../../../utility/imageConfig";
import ConcludeCompetitionModal, {
  ContainersView,
} from "./concludeCompetitionModal";
import {
  ConfigCompetitionMode,
  ConfigDiscoveribility,
  ConfigTimeLine,
} from "./registrationSettingsV1.2";
const CompetitionSection = ({
  readOnlyState,
  updateCompetition,
  competition,
  competitionState,
  allContainers,
  participantsOrTeams,
  placementsData,
  setPlacementsData,
}) => {
  const qualifiedContainers = useSelector(
    (state) => state.containers.qualified
  );

  const dispatch = useDispatch();
  // const [roundSelected, setRoundSelected] = useState(null);

  const [isVisible, setVisibility] = useState(false);
  const [isEditName, setEditName] = useState(false);
  const [isEditCategory, setEditCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [isEndCompetitionModalVisible, setIsEndCompetitionModalVisible] =
    useState(false);
  const [endCompetitionModalType, setEndCompetitionModalType] = useState("");
  const [isVisibleCOncludeCompModal, setIsVisibleConcludeCompModal] =
    useState(false);
  const [isPlacementModalVisible, setPlacementModalVisible] = useState(false);
  const [roundSelected, setRoundSelected] = useState("all");
  const [containerNames, setContainerNames] = useState({});
  const [judgedRounds, setJudgedRounds] = useState([]);
  const [compSubCats, setCompSubCats] = useState([]);
  const [allJudges, setAllJudges] = useState([]);
  const [settingScreen, setSettingScreen] = useState("");
  const [placementsCount, setPlacemensCount] = useState({
    placements: [
      {
        containers: [],
        place: "",
        type: "",
        imageURL: "",
        rewards: [],
      },
    ],
    count: 1,
    placementAdded: 1,
  });

  const isAllZeroCOntainers = () => {
    let flag = true;
    qualifiedContainers?.forEach((cont) => {
      if (cont?.points > 0) flag = false;
    });
    return flag;
  };
  /*
  if round changes, then update the roundSelected state
  {
    roundName: "",
    roundCode: "",
  }
  */

  const foundCompetitionSubCategory = () => {
    const allSubs = competitionState?.categories.flatMap(
      (cat) => cat?.subCategory
    );
    const compSubCats = allSubs?.filter((sub) =>
      competition?.categoryArray?.includes(sub?.categoryNameSubCategoryNameCode)
    );
    return compSubCats;
  };

  useEffect(() => {
    setCompSubCats(foundCompetitionSubCategory());
  }, [competition]);

  const isJudgedAnyRound = () => {
    let result = false;
    competitionState?.allRounds?.forEach((round) => {
      if (round?.type === "MOCK" && round?.isLive) {
        result = true;
        return true;
      } else if (round) {
        round?.Judges?.forEach((judge) => {
          if (judge?.status === "JUDGED") {
            result = true;
            return true;
          }
        });
      }
    });
    return result;
  };

  useEffect(() => {
    if (competitionState?.allRounds) {
      let Judge = [];
      competitionState?.allRounds
        .filter((round) => round.type === "GENERAL")
        .map(
          (round) =>
            !!round.Judges.length &&
            round.Judges.map((judge) => {
              if (judge) Judge.push(judge);
            })
        );
      setAllJudges(Judge);
      let judgedRound = [];
      competitionState?.allRounds?.forEach((round) => {
        let judged = 0;
        round?.Judges?.forEach((judge) => {
          if (judge?.status === "JUDGED") {
            judged++;
          }
        });
        if (judged > 0) {
          judgedRound.push(round);
        }
      });
      competitionState?.allRounds?.forEach((round) => {
        if (round?.isLive) {
          round.label = `${round?.roundName}`;
          judgedRound.push(round);
        }
      });
      let aRounds = [];
      judgedRound.map((rnd) => {
        if (rnd.type === "GENERAL") {
          if (!!rnd.Judges.length) aRounds.push(rnd);
        } else {
          aRounds.push(rnd);
        }
      });
      const uniqueData = aRounds.filter((item, index, self) => {
        return index === self.findIndex((t) => t._id === item._id);
      });
      setJudgedRounds(uniqueData);
    }
  }, [competitionState?.allRounds]);

  useEffect(() => {
    if (allContainers && allContainers.length) {
      let allContainerNames = {};
      allContainers.forEach((container) => {
        allContainerNames[container.containerCode] = container.containerName;
      });

      setContainerNames({ ...allContainerNames });
    }
  }, [allContainers]);

  const getRoundScoreSheet = async () => {
    setLoading(true);
    if (roundSelected === "all") {
      // allRoomsScoreSheet(competitionState?.current?.competitionCode);
      allRoundsScoreSheet(
        competitionState?.current?.competitionCode,
        competitionState?.current?.competitionType
      );
    } else if (roundSelected.type === "GENERAL" || !roundSelected.type) {
      await singleRoundScoreSheet(
        roundSelected.roundCode,
        competitionState?.current?.competitionName +
          "_" +
          roundSelected.roundName,
        roundSelected.roundWeightage,
        roundSelected,
        competitionState?.current?.competitionType
      );
    } else {
      await singleMockRoundScoreSheet(
        roundSelected.roundCode,
        competitionState?.current?.competitionName +
          "_" +
          roundSelected.roundName,
        roundSelected
      );
    }
    setLoading(false);
  };

  const EndCompetitionModal = ({
    isModalVisible,
    setIsModalVisible,
    competition,
    type = "CONCLUDE",
  }) => {
    const [showSubmittedState, setShowSubmittedState] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [permitDelete, setPermitDelete] = useState(false);
    const getPlacements = () => {
      return placementsCount?.placements?.map((placement) => {
        const containerCodes = placement?.containers?.map(
          (cont) => cont?.containerCode
        );
        const rewards = placement?.rewards?.map((reward) => {
          return {
            name: reward?.label,
            imageURL: reward?.imageURL || null,
            emojiObject: reward?.emojiObject || null,
          };
        });
        return {
          place: placement?.place,
          containerCodes: containerCodes,
          type: placement?.type,
          imageURL: placement?.imageURL,
          rewards: rewards || [],
        };
      });
    };

    const data = {
      CONCLUDE: {
        heading: (
          <Typography.Title level={2}>
            Type
            <span style={{ color: "#6808FE" }}>{` CONCLUDE `}</span>
            to conclude this competition
          </Typography.Title>
        ),
        subHeading: "Concluding your competition will make it Uneditable.",
        inputText: "CONCLUDE",
        submittedImage: concludeCompetition,
        submittedHeading: "And it’s a Wrap!",
        submittedSubHeading: "Access this competition to preview stats",
        onSubmit: () => setShowSubmittedState(true),
        afterClose: () => {
          updateCompetition({
            status: "CONCLUDED",
            placements: getPlacements(),
          });
        },
      },
      ABANDON: {
        heading: (
          <Typography.Title level={2}>
            Type
            <span style={{ color: "#F53F3F" }}>{` ${
              permitDelete ? "DELETE" : "ABANDON"
            } `}</span>
            to discontinue this competition
          </Typography.Title>
        ),
        subHeading: `${
          permitDelete ? "Deleting" : "Abandon"
        } your competition ${
          permitDelete ? "will delete the competition" : ""
        }.`,
        inputText: permitDelete ? "DELETE" : "ABANDON",
        submittedImage: !permitDelete ? abandonCompIcoon : deleteCompIcon,
        submittedHeading: `${
          competition ? competition.competitionName : "Competition"
        } has been ${permitDelete ? "deleted" : "abandoned"}`,
        submittedSubHeading: `${
          permitDelete
            ? "This competition is no longer accessible"
            : "This competition is currently inactive"
        }`,
        onSubmit: () => setShowSubmittedState(true),
        afterClose: () =>
          updateCompetition({ status: "ABANDONED", isDeleted: permitDelete }),
      },
    };

    if (type !== "CONCLUDE" && type !== "ABANDON") return <div />;
    return (
      <Modal
        className="abandonCompetitionModal"
        visible={isModalVisible}
        closable={false}
        onOk={() => console.log("helo")}
        onCancel={() => {
          if (showSubmittedState) {
            data[type].afterClose();
          }
          setIsModalVisible(false);
        }}
        footer={null}
      >
        {type === "CONCLUDE" && !showSubmittedState ? (
          <ArrowBackIcon
            className="absolute top-6 left-6 cursor-pointer concludeBackButton"
            onClick={() => {
              setIsModalVisible(false);
              setIsVisibleConcludeCompModal(true);
            }}
          />
        ) : null}
        {showSubmittedState ? (
          <div className="abandonCompetitionModalConcludeSuccess">
            <div className="img-abandon">
              <Image
                src={data[type].submittedImage}
                alt="competititon ended"
                height={150}
                width={150}
                preview={false}
              />
            </div>
            <Typography.Title className="abandonTitle" level={3}>
              {data[type].submittedHeading}
            </Typography.Title>
            <Typography.Text className="subtext">
              {data[type].submittedSubHeading}
            </Typography.Text>
          </div>
        ) : (
          <div className="abandonCompetitionModalConcludeOption">
            {data[type].heading}
            <Typography.Text className="subtext">
              {data[type].subHeading}
            </Typography.Text>
            {type === "ABANDON" && (
              <div className="abandonCompetitionDeleteOption">
                <Typography.Text className="abandonCompetitionCheckOption">
                  <Checkbox
                    onChange={(e) => setPermitDelete(e.target.checked)}
                  />{" "}
                  Delete Competition from dashboard
                </Typography.Text>
              </div>
            )}
            <Input
              className="formInput"
              placeholder={data[type].inputText}
              addonAfter={
                <Button
                  type="primary"
                  disabled={inputValue.toUpperCase() !== data[type].inputText}
                  onClick={() => {
                    type === "CONCLUDE"
                      ? data[type].afterClose()
                      : data[type].onSubmit();
                  }}
                >
                  {data[type].inputText}
                </Button>
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.trim())}
            />
          </div>
        )}
      </Modal>
    );
  };

  function toSentenceCase(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  console.log("competition?.placements", competition?.placements);

  switch (settingScreen) {
    case "DISCOVERIBILITY_SCREEN":
      return <ConfigDiscoveribility setSettingScreen={setSettingScreen} />;
    case "TIMELINE_SCREEN":
      return <ConfigTimeLine setSettingScreen={setSettingScreen} />;
    case "COMPETITION_MODE_SCREEN":
      return <ConfigCompetitionMode setSettingScreen={setSettingScreen} />;
    default:
      return (
        <>
          <div className="basicSettingScroller">
            <div className="mobileSettingHeader visibleTabletMobile">
              <CompetitionIcon />
              <strong className="mobileSettingTitle">
                Competition Settings
              </strong>
            </div>
            <section className="basicSettingRow basicSettings">
              <div className="basicSettingHeader">
                <Typography.Title level={3}>
                  <Image
                    preview={false}
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1675965960791_image_428.png"
                    alt="Basic Settings"
                  />
                  Basic Settings
                </Typography.Title>
                <div className="basicSettingHeaderStatus">
                  {/* <Typography.Title className="styleConclude" level={5}>
                <span className="statusText">{competition?.status}</span>
                {competition?.status !== "ACTIVE" ? (
                  <Image
                    preview={false}
                    src={
                      competition?.status === "CONCLUDED"
                        ? concludeFlag
                        : abandonFlag
                    }
                    alt={competition?.status}
                  />
                ) : null}
              </Typography.Title> */}
                  {/* {competition?.status === "ACTIVE" && (
                <Button
                  className="linkEdit"
                  icon={<EditPencilIcon />}
                  type={"ghost"}
                  onClick={() => {
                    setVisibility(true);
                    setEditName(true);
                  }}
                >
                  Edit
                </Button>
              )} */}
                </div>
              </div>
              <div className="basicSettingContent">
                <div className="basicSettingSubrow">
                  <Typography.Text
                    className="title"
                    onClick={() => foundCompetitionSubCategory()}
                  >
                    Logo and Name
                  </Typography.Text>
                  <div className="basicSettingHolder">
                    <Typography.Text
                      className="subHeading"
                      onClick={() => {
                        if (!readOnlyState) {
                          setVisibility(true);
                          setEditName(true);
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {competition?.imageURL ? (
                        <Image
                          src={competition?.imageURL}
                          preview={false}
                          heigth={50}
                          width={50}
                          alt="Competition Image"
                        />
                      ) : (
                        <span className="subHeadingEmoji">
                          {competition?.emojiObject.emoji}
                        </span>
                      )}{" "}
                      {competition?.competitionName}
                    </Typography.Text>
                  </div>
                </div>
                <div className="basicSettingSubrow flex-start">
                  <Typography.Text className="title cat-space">
                    Category and Subcategory
                  </Typography.Text>
                  <div className="basicSettingHolder">
                    <div
                      className="basicSettingCategories"
                      onClick={() => {
                        if (!readOnlyState) {
                          setVisibility(true);
                          setEditName(false);
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <Typography.Text className="subHeading">
                        {competition &&
                          competition.category &&
                          competition.category.imageUrl && (
                            <Image
                              src={competition?.category?.imageUrl}
                              preview={false}
                              height={50}
                              width={50}
                              alt="Categorie Name"
                            />
                          )}
                        {competition && competition.category
                          ? competition.category.categoryName
                          : "Select category"}
                      </Typography.Text>
                      <div className="settingsTagsList">
                        {competition &&
                          competition?.categoryArray &&
                          compSubCats?.map((scat) => {
                            return (
                              <Tag key={scat}>
                                {/* {toSentenceCase(scat.replaceAll("-", " "))} */}
                                {scat?.subCategoryName}
                              </Tag>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* <div className="regSettingsRow microSiteSettings">
              <div className="regSettingsHeader">
                <Typography.Title level={3}>
                  <Image
                    preview={false}
                    src="https://rethink-competitions.s3.amazonaws.com/1682623763791_settingimg.png"
                    alt="Micro Site Settings"
                  />
                  Micro-site Settings
                </Typography.Title>
                <Button
                  className="buttonPreview btnSmall"
                  type="secondary"
                  icon={<EyeNewIcon />}
                >
                  Preview
                </Button>
              </div>
              <div className="regSettingsHolder">
                <div className="regSettingsRow registrationComType">
                  <div className="regSettingsHeader">
                    <Typography.Title level={3}>
                      Discoverability
                    </Typography.Title>
                    <div className="regSettingsInteraInfo">
                      <Image
                        src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1682625005968_image_434.png"
                        alt=""
                        preview={false}
                      />
                      <div className="regSettingsInteraInfoTextbox">
                        <Typography.Text className="regSettingsInteraInfoTitle">
                          Private
                        </Typography.Text>
                        <Typography.Text className="regSettingsInteraInfoText">
                          Your competition will not show up on the explore feed
                        </Typography.Text>
                      </div>
                    </div>
                    <Button
                      className="linkEdit"
                      icon={<EditPencilIcon />}
                      onClick={() => setSettingScreen("DISCOVERIBILITY_SCREEN")}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="regSettingsRow registrationComType">
                  <div className="regSettingsHeader">
                    <Typography.Title level={3}>Timeline</Typography.Title>
                    <div className="regSettingsInteraInfo">
                      <ul className="timeDatesList">
                        <li>
                          <span className="date">10</span> MAY
                        </li>
                        <li>
                          <span className="date">11</span> MAY
                        </li>
                        <li>
                          <span className="date">12</span> MAY
                        </li>
                        <li>
                          <span className="date">13</span> MAY
                        </li>
                      </ul>
                    </div>
                    <Button className="btnSmall" type="secondary">
                      Configure Dates
                    </Button>
                    <Button
                      className="linkEdit"
                      icon={<EditPencilIcon />}
                      onClick={() => setSettingScreen("TIMELINE_SCREEN")}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="regSettingsRow registrationComType">
                  <div className="regSettingsHeader">
                    <Typography.Title level={3}>
                      Competition Mode
                    </Typography.Title>
                    <div className="regSettingsInteraInfo">
                      <Image
                        src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1682625510829_image_37.png"
                        alt=""
                        preview={false}
                      />
                      <div className="regSettingsInteraInfoTextbox">
                        <Typography.Text className="regSettingsInteraInfoTitle">
                          Offline
                        </Typography.Text>
                      </div>
                    </div>
                    <Button
                      className="btnSmall"
                      type="secondary"
                      onClick={() =>
                        setSettingScreen("COMPETITION_MODE_SCREEN")
                      }
                    >
                      Configure Mode
                    </Button>
                  </div>
                </div>
                <div className="regSettingsRow registrationComType">
                  <div className="regSettingsHeader">
                    <Typography.Title level={3}>Gallery</Typography.Title>
                    <div className="regSettingsInteraInfo">
                      <ul className="galleryImagesList">
                        <li>
                          <Image
                            src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1682627585514_img01.jpg"
                            alt=""
                            preview={false}
                          />
                        </li>
                        <li>
                          <Image
                            src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1682627612173_img02.jpg"
                            alt=""
                            preview={false}
                          />
                        </li>
                        <li>
                          <Image
                            src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1682627633719_img03.jpg"
                            alt=""
                            preview={false}
                          />
                        </li>
                        <li>
                          <Image
                            src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1682627651736_img04.jpg"
                            alt=""
                            preview={false}
                          />
                        </li>
                        <li>
                          <Image
                            src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1682627651736_img04.jpg"
                            alt=""
                            preview={false}
                          />
                        </li>
                      </ul>
                    </div>
                    <Button className="btnSmall" type="secondary">
                      Add Media
                    </Button>
                    <Button
                      className="linkEdit"
                      icon={<EditPencilIcon />}
                      onClick={() => setSettingScreen("REGISTRATION_TYPE")}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="regSettingsRow registrationComType">
                  <div className="regSettingsHeader">
                    <Typography.Title level={3}>About</Typography.Title>
                    <div className="regSettingsInteraInfo">
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim...
                      </p>
                    </div>
                    <Button className="btnSmall" type="secondary">
                      Add Description
                    </Button>
                    <Button
                      className="linkEdit"
                      icon={<EditPencilIcon />}
                      onClick={() => setSettingScreen("REGISTRATION_TYPE")}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="regSettingsRow registrationComType">
                  <div className="regSettingsHeader">
                    <Typography.Title level={3}>
                      Contact Details
                    </Typography.Title>
                    <div className="regSettingsInteraInfo contactInfo">
                      <div className="regSettingsInteraInfoTextbox">
                        <Typography.Text className="regSettingsInteraInfoTitle">
                          John Doe
                        </Typography.Text>
                        <Typography.Text className="regSettingsInteraInfoText">
                          +91 90000 00000
                        </Typography.Text>
                        <Typography.Text className="regSettingsInteraInfoText">
                          johndoe@gmail.com
                        </Typography.Text>
                      </div>
                      <div className="regSettingsInteraInfoTextbox">
                        <Typography.Text className="regSettingsInteraInfoTitle">
                          Ramlaxman Srinivasan
                        </Typography.Text>
                        <Typography.Text className="regSettingsInteraInfoText">
                          +91 90000 00000
                        </Typography.Text>
                        <Typography.Text className="regSettingsInteraInfoText">
                          johndoe@gmail.com
                        </Typography.Text>
                      </div>
                    </div>
                    <Button
                      className="linkEdit"
                      icon={<EditPencilIcon />}
                      onClick={() => setSettingScreen("REGISTRATION_TYPE")}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </div> */}
            <section className="basicSettingRow">
              <div className="basicSettingHeader">
                <Typography.Title level={3}>
                  <Image
                    preview={false}
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1675966207674_image_429.png"
                    alt="Basic Settings"
                  />
                  Scoring Preferences
                </Typography.Title>
              </div>
              <div className="basicSettingContent">
                <div className="basicSettingSubrow">
                  <Typography.Text className="title">
                    Export Round Scores
                  </Typography.Text>
                  <div className="basicSettingHolder">
                    {/* <Typography.Text className="subtitle hiddenTabletMobile">
                  Download
                </Typography.Text> */}
                    <div className="basicSettingCVBox">
                      <div className="flex">
                        <AppSelect
                          className="settingsSelect"
                          placeholder={"Set Up"}
                          defaultValue="all"
                          option={[
                            { label: "All Rounds", value: "all" },
                            ...judgedRounds,
                          ]}
                          onChange={(e) => {
                            e !== "all"
                              ? setRoundSelected({
                                  ...competitionState?.allRounds.find(
                                    (rnd) => rnd.roundCode === e
                                  ),
                                })
                              : setRoundSelected(e);
                            // getRoundScoreSheet(e);
                          }}
                        />
                        {/* <CSVLink {...reportProps}>
                      <Button
                        className="buttonPlus"
                        type="ghost"
                        icon={<PlusOutlined />}
                        // disabled={!roundSelected}
                      />
                    </CSVLink> */}
                      </div>
                      {/* <CSVLink {...report}> */}
                      <Button
                        className="btn-sm downloadButton"
                        type="primary"
                        onClick={getRoundScoreSheet}
                        disabled={!isJudgedAnyRound()}
                      >
                        <span className="hiddenTabletMobile">
                          {loading ? (
                            <div className="loader-icon" />
                          ) : (
                            "Download"
                          )}
                        </span>
                        <span className="downloadIcon visibleTabletMobile">
                          <DownloadIcon />
                        </span>
                      </Button>
                      {/* </CSVLink> */}
                    </div>
                  </div>
                </div>
                {/* <div className="basicSettingSubrow">
              <Typography.Text className="title">
                Sync Competition
              </Typography.Text>
              <div className="basicSettingHolder">
                Commented from here to
                <Typography.Text className="subtitle">
                  Hold cmd and Tap S to Update google Sheets
                </Typography.Text>
                <Typography.Text className="switchTitle">
                  Auto Sync <Switch />
                </Typography.Text>
                Commented till here
                <Button
                  disabled={competition?.stats !== "ACTIVE"}
                  className="buttonSync"
                  type={"ghost"}
                >
                  Sync with Google Sheets
                </Button>
              </div>
            </div> */}
                <div className="basicSettingSubrow flex-start">
                  <Typography.Text className="title">
                    Make Scoring Transparent
                  </Typography.Text>
                  <div className="basicSettingHolder">
                    <Typography.Text className="subtitle">
                      Allow Participants to view during the competition
                    </Typography.Text>
                    {/* // When Enable LeaberBoard just uncomment this code below code */}
                    <div className="settingsCheckboxes">
                      <Checkbox
                        disabled={competition?.status !== "ACTIVE"}
                        checked={competition?.preferences.roundScores}
                        onChange={(e) =>
                          updateCompetition({
                            isVisibleRoundScores: e.target.checked,
                          })
                        }
                      >
                        Round Scores
                      </Checkbox>
                      {/* <Checkbox
                    disabled={competition?.status !== "ACTIVE"}
                    checked={competition?.preferences.stats}
                    onChange={(e) =>
                      updateCompetition({ isVisibleStats: e.target.checked })
                    }
                  >
                    Stats
                  </Checkbox> */}
                      {/* <Checkbox
                    disabled={competition?.status !== "ACTIVE"}
                    checked={competition?.preferences.competitorScores}
                    onChange={(e) =>
                      e.target.checked && !competition?.preferences?.roundScores
                        ? updateCompetition({
                            isVisibleCompetitorScores: e.target.checked,
                            isVisibleRoundScores: true,
                          })
                        : updateCompetition({
                            isVisibleCompetitorScores: e.target.checked,
                          })
                    }
                  >
                    LeaderBoard
                  </Checkbox> */}
                      <Checkbox
                        disabled={competition?.status !== "ACTIVE"}
                        checked={competition?.preferences?.roundWeightage}
                        onChange={(e) =>
                          updateCompetition({
                            isVisibleRoundWeightage: e.target.checked,
                          })
                        }
                      >
                        Round Weightage
                      </Checkbox>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="basicSettingRow settingConclude">
              <div className="basicSettingHeader no-boder">
                {competition?.status === "ACTIVE" ? (
                  <Typography.Title level={3}>
                    Conclude Competition
                  </Typography.Title>
                ) : competition?.status === "CONCLUDED" ? (
                  <Typography.Title level={3}>
                    <Image
                      preview={false}
                      src="https://rethink-competitions.s3.amazonaws.com/1677684572640_Group_3711.svg"
                      alt="Basic Settings"
                    />
                    Competition Concluded
                  </Typography.Title>
                ) : competition?.status === "ABANDONED" ? (
                  <Typography.Title level={3}>
                    <Image
                      preview={false}
                      src="https://rethink-competitions.s3.amazonaws.com/1677683065927_Group_3711.svg"
                      alt="Basic Settings"
                    />
                    Competition Abandoned
                  </Typography.Title>
                ) : null}
                {competition?.status === "ACTIVE" && (
                  <div className="basicSettingHeaderButtons">
                    <div className="buttonWrap">
                      <Typography.Text className="title">
                        Cancel Competition
                      </Typography.Text>
                      <Button
                        className="abandonButton"
                        type="primary"
                        onClick={() => {
                          setEndCompetitionModalType("ABANDON");
                          setIsEndCompetitionModalVisible(true);
                        }}
                      >
                        <CrossCircleIcon />
                        ABANDON
                      </Button>
                    </div>
                    <div className="buttonWrap">
                      <Typography.Text className="title">
                        End Competition
                      </Typography.Text>
                      <Tooltip
                        title={
                          !!allJudges.filter(
                            (judge) => judge.status === "JUDGING"
                          ).length
                            ? "Some of your judges are still judging, please wait for them to complete or delete their session before concluding this competition"
                            : ""
                        }
                        trigger={"hover"}
                        placement="top"
                        color={"black"}
                      >
                        {console.log("formats", isAllZeroCOntainers())}
                        <Button
                          className="concludeButton"
                          type="primary"
                          onClick={() => {
                            if (
                              !isJudgedAnyRound() ||
                              qualifiedContainers?.length < 1
                            ) {
                              dispatch(
                                notify({
                                  type: "error",
                                  message: `There needs to be at least 2 ${
                                    competition?.competitionType === "SOLO"
                                      ? "participants"
                                      : "teams"
                                  } in the qualified list to conclude this competition with scores other than 0`,
                                })
                              );
                            } else {
                              qualifiedContainers?.length > 1 &&
                              !isAllZeroCOntainers()
                                ? !allJudges.filter(
                                    (judge) => judge.status === "JUDGING"
                                  ).length
                                  ? setIsVisibleConcludeCompModal(true)
                                  : null
                                : dispatch(
                                    notify({
                                      type: "error",
                                      message: `There needs to be at least 2 ${
                                        competition?.competitionType === "SOLO"
                                          ? "participants"
                                          : "teams"
                                      } in the qualified list to conclude this competition with scores other than 0`,
                                    })
                                  );
                            }
                          }}
                        >
                          <ConcludeIcon />
                          CONCLUDE
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                )}
              </div>
              {competition?.status === "CONCLUDED" ? (
                <div className="basicSettingContent">
                  <div className="concludedCompetitionPlacementsBlock">
                    {competition?.placements?.map((plc, i) => {
                      const containers = qualifiedContainers?.filter((c) =>
                        plc?.containerCodes?.includes(c?.containerCode)
                      );
                      plc.containers = containers;
                      return (
                        <div key={i} className="concludedCompetitionPlacement">
                          <div className="concludedCompetitionPlacementTitle">
                            <Avatar
                              className="concludedCompetitionPlacementTitleIcon"
                              src={plc?.imageURL}
                              alt="plscements"
                            />
                            <Typography.Text className="concludedCompetitionPlacementTitleText">
                              {plc?.place}
                            </Typography.Text>
                          </div>
                          <div className="concludedCompetitionPlacementAvatars">
                            <div className="concludedCompetitionPlacementTeamsList">
                              <ContainersView placement={plc} />
                              {/* <div className="concludedCompetitionPlacemenRatings">
                            <div className="concludedCompetitionPlacemenRatingsIcon">
                              <img src="https://rethink-competitions.s3.amazonaws.com/1680106770706_image_164.png" alt=""/>
                            </div>
                            <div className="concludedCompetitionPlacemenRatingsPoints">43</div>
                          </div> */}
                              {/* {plc?.containers?.map((item) => {
                            return (
                              <div>{item?.containerName}</div>
                            )
                            })}  */}
                            </div>
                            <ul className="rewardsList">
                              {plc?.rewards?.length ? (
                                plc?.rewards?.map((rwrd, i) => {
                                  return (
                                    <li key={i} className="cursor-pointer">
                                      <Tooltip
                                        title={rwrd?.name}
                                        trigger={"hover"}
                                        placement="top"
                                        color={"black"}
                                      >
                                        {/* <Avatar
                                          className={
                                            rwrd?.name
                                              ? "PrizeSection"
                                              : "concludedCompetitionPlacementTitleIcon"
                                          }
                                          src={rwrd?.imageURL}
                                          icon={rwrd?.emojiObject?.emoji}
                                          alt="plscements"
                                        /> */}
                                        <img
                                          src={rwrd?.imageURL}
                                          alt="Placements"
                                          width={20}
                                        />
                                      </Tooltip>
                                    </li>
                                  );
                                })
                              ) : (
                                <Typography.Text className="noRewardsText">
                                  No rewards were given
                                </Typography.Text>
                              )}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* <div className="basicSettingSubrow">
                <Typography.Text className="title">
                  Placements and Rewards
                </Typography.Text>
                <div className="basicSettingHolder">
                  <Typography.Text className="subtitle">
                    Setup Placements to Conclude Competitions
                  </Typography.Text>
                  <Button
                    disabled={
                      !allContainers ||
                      allContainers.length < 2 ||
                      !allContainers[0].points ||
                      !allContainers[1].points
                    }
                    className="setupButton"
                    type="default"
                    onClick={() => setPlacementModalVisible(true)}
                  >
                    Set Up
                  </Button>
                </div>
              </div> 
                <div className="basicSettingSubrow basicSettingSubrowReverse">
                  <Typography.Text className="title">
                    End Competition
                  </Typography.Text>
                  <div className="basicSettingHolder">
                    <Button
                      className="setupButton"
                      type="primary"
                      onClick={() => {
                        if (
                          !isJudgedAnyRound() ||
                          qualifiedContainers?.length < 1
                        ) {
                          dispatch(
                            notify({
                              type: "error",
                              message: `There needs to be at least 2 ${
                                competition?.competitionType === "SOLO"
                                  ? "participants"
                                  : "teams"
                              } in the qualified list to conclude this competition with scores other than 0`,
                            })
                          );
                        } else {
                          qualifiedContainers?.length > 1 &&
                          !isAllZeroCOntainers()
                            ? setIsVisibleConcludeCompModal(true)
                            : dispatch(
                                notify({
                                  type: "error",
                                  message: `There needs to be at least 2 ${
                                    competition?.competitionType === "SOLO"
                                      ? "participants"
                                      : "teams"
                                  } in the qualified list to conclude this competition with scores other than 0`,
                                })
                              );
                        }
                      }}
                    >
                      CONCLUDE
                    </Button>
                  </div>
                </div>
                <div className="basicSettingSubrow basicSettingSubrowReverse">
                  <Typography.Text className="title">
                    Cancel Competition
                  </Typography.Text>
                  <div className="basicSettingHolder">
                    <Button
                      className="endButton"
                      type="primary"
                      onClick={() => {
                        setEndCompetitionModalType("ABANDON");
                        setIsEndCompetitionModalVisible(true);
                      }}
                    >
                      ABANDON
                    </Button>
                  </div>
                </div>*/}
                </div>
              ) : competition?.status === "ABANDONED" ? (
                <div className="abandonedStatusblock">
                  <Typography.Text className="abandonedStatusTitle">
                    <Image
                      preview={false}
                      src="https://rethink-competitions.s3.amazonaws.com/1669756188810_abandon.svg"
                      alt="ABANDONED"
                    />
                    This competition has been abandoned
                  </Typography.Text>
                  <div className="abandonedStatusDelete">
                    <Typography.Text className="textStatus">
                      Delete Competition
                    </Typography.Text>
                    <Popconfirm
                      title={
                        <>
                          <Typography.Text>
                            Are you sure? Type DELETE for delete the
                            Competition.
                          </Typography.Text>
                          <Input
                            type={"text"}
                            autoFocus={true}
                            placeholder="Type DELETE"
                            value={confirmDelete}
                            onChange={(e) => {
                              setConfirmDelete(e.target.value.toUpperCase());
                            }}
                          />
                        </>
                      }
                      onConfirm={() => {
                        updateCompetition({ isDeleted: true });
                      }}
                      okText={
                        <Button disabled={confirmDelete !== "DELETE"}>
                          Yes
                        </Button>
                      }
                      okType="button"
                      cancelText="No"
                    >
                      <Button className="buttonDelete" icon={<DeleteIcon />}>
                        <span className="buttonDelete visibleMobile">
                          Delete Competition
                        </span>
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              ) : null}
            </section>
            {/* {competition?.status === "CONCLUDED" && (
          <section className="basicSettingRow additionSpace">
            <div className="basicSettingHeader">
              <Typography.Title level={3}>
                Conclude Competition
              </Typography.Title>
            </div>
            <div className="basicSettingContent">
              <div className="basicSettingSubrow">
                <Typography.Text className="title">
                  Placements and Rewards
                </Typography.Text>
                <div className="basicSettingHolder">
                  <div className="settingsCardsList">
                    {competition?.rewards?.placements.map((placement, i) => (
                      <Card key={i}>
                        <Typography.Text className="teamTitle">
                          {containerNames[placement.containerCode]}
                        </Typography.Text>
                        <Typography.Text className="teamSubTitle">
                          {placement.name}
                        </Typography.Text>
                        <div className="iconsList">
                          {placement.prizes?.map((prize, i) => (
                            <p key={i}>
                              {prize.imageURL ? (
                                <img src={prize.imageURL} alt={prize.name} />
                              ) : (
                                prize?.emojiObject?.emoji
                              )}
                            </p>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                  <Typography.Title level={4}>
                    Special Mentions
                  </Typography.Title>
                  <div className="settingsCardsList">
                    {competition?.rewards?.specialMentions.map(
                      (specialMention, i) => (
                        <Card key={i}>
                          <Typography.Text className="teamTitle">
                            {containerNames[specialMention.containerCode]}
                          </Typography.Text>
                          <Typography.Text className="teamSubTitle">
                            {specialMention.name}
                          </Typography.Text>
                          <div className="iconsList">
                            {specialMention.prizes?.map((prize, i) => (
                              <p key={i}>
                                {prize.imageURL ? (
                                  <img src={prize.imageURL} alt={prize.name} />
                                ) : (
                                  prize?.emojiObject?.emoji
                                )}
                              </p>
                            ))}
                          </div>
                        </Card>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )} */}
            {/*competition?.status === "ABANDON" && (
          <section className="basicSettingRow additionSpace">
            <div className="basicSettingHeader">
              <Typography.Title level={3}>Delete Competition</Typography.Title>
            </div>
            <div className="basicSettingContent">
              <div className="basicSettingSubrow">
                <Typography.Text className="title">
                  Delete Competition
                </Typography.Text>
                <div className="basicSettingHolder">
                  <Popconfirm
                    onConfirm={() => {
                      updateCompetition({ isDeleted: true });
                      console.log("Yes");
                    }}
                    title="Are you sure you want to delete this competition?"
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button className="endButton" type="primary">
                      Delete Competition
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          </section>
        )}{" "}
        */}
          </div>
          {isVisible && (
            <EditBasicSettingsModal
              isVisible={isVisible}
              setVisibility={setVisibility}
              editName={isEditName}
              competition={competition}
              updateCompetiton={updateCompetition}
              selected={competition?.categoryArray}
            />
          )}

          <EndCompetitionModal
            competition={competition}
            type={endCompetitionModalType}
            isModalVisible={isEndCompetitionModalVisible}
            setIsModalVisible={setIsEndCompetitionModalVisible}
          />
          <ConcludeCompetitionModal
            competition={competition}
            containers={qualifiedContainers}
            isVisible={isVisibleCOncludeCompModal}
            setVisible={setIsVisibleConcludeCompModal}
            setIsEndCompetitionModalVisible={setIsEndCompetitionModalVisible}
            setEndCompetitionModalType={setEndCompetitionModalType}
            placementsCount={placementsCount}
            setPlacemensCount={(e) => setPlacemensCount({ ...e })}
            placementsData={placementsData}
            setPlacementsData={setPlacementsData}
          />
          {/* <SetupRewardsModal
        participantsOrTeams={participantsOrTeams}
        isPlacementModalVisible={isPlacementModalVisible}
        setPlacementModalVisible={setPlacementModalVisible}
        allContainers={allContainers}
        competition={competitionState.current}
        onConclude={updateCompetition}
      /> */}
          {/* {isEditCategory && (
        <CreateCompetitionPhase1

      />
      )} */}
        </>
      );
  }
};

export default CompetitionSection;
