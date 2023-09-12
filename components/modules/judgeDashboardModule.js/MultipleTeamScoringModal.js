import {
  Avatar,
  Button,
  Col,
  Image,
  Input,
  Modal,
  Popconfirm,
  Row,
  Slider,
  Typography,
} from "antd";
import { Fragment, useEffect, useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import useMediaQuery from "../../../hooks/useMediaQuery";
import { isValidRegistration } from "../../../utility/common";
import { scoreSliderEmojis } from "../../../utility/config";
import {
  ArrowBackIcon,
  FeedbackIcon,
  FileNewIcon,
  LikeSVGIcon,
  LinkIcon,
  ReloadIcon,
} from "../../../utility/iconsLibrary";
import { loading, noSubmissions, unscored } from "../../../utility/imageConfig";

let urls = scoreSliderEmojis;

const Notes = ({ notes, onNotesChange, containerCode }) => {
  const contentEditable = useRef(null);
  const [notesList, setNotesList] = useState("<li><br></li>");

  const handleChange = (e) => {
    const data = e.target.value;

    // insert empty list tags to maintain styling if there is nothing in notes
    if (data === "") {
      data = "<li><br></li>";
    }

    // const formatData = data.replaceAll("<li><br>", "<li>●<br>");

    // setNotesList(
    //   formatData.replaceAll("<li>●<br></li><li>●<br></li>", "<li>●<br></li>")
    // );

    setNotesList(data);

    onNotesChange(
      containerCode,
      data
      // data.replaceAll("<li>●<br></li><li>●<br></li>", "<li>●<br></li>")
    );
  };

  useEffect(() => {
    if (notes) setNotesList(notes);
  }, [notes]);

  return (
    <ul className="judgeNotesList">
      <ContentEditable
        innerRef={contentEditable}
        html={notesList}
        disabled={false}
        onChange={handleChange}
        tagName="div"
      />
    </ul>
  );
};

const SubmissionSection = ({ submission }) => {
  return (
    <div className="judgeSubmissionsHeader">
      {submission &&
      submission.submissions &&
      submission.submissions.length > 0 ? (
        <div>
          <div className="judgeSubmissionsHeaderTextbox">
            <Typography.Text className="subtext lt-gray">
              Tap on links to preview submissions
            </Typography.Text>
          </div>
          {submission.submissions.map((sub, i) => (
            <a
              rel="noreferrer"
              href={sub.url}
              target="_blank"
              key={i}
              style={{ cursor: "pointer" }}
              className="submissionLinkFieldWrap"
            >
              <Input
                style={{ cursor: "pointer" }}
                className="submissionLinkField"
                readOnly={true}
                prefix={sub.type === "LINK" ? <LinkIcon /> : <FileNewIcon />}
                value={sub.type === "LINK" ? sub.url : sub.fileName}
              />
            </a>
          ))}
        </div>
      ) : (
        <>
          <div className="judgeSubmissionsPlaceholder">
            <div className="judgeSubmissionsHeaderTextbox text-center">
              <Image
                src={noSubmissions}
                preview={false}
                className="text-center"
                alt="no submissions"
              />
            </div>
            <div className="text-center">
              <Typography.Text className="judgeSubmissionsPlaceholderText">
                {`No submissions were uploaded`}
              </Typography.Text>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const MultipleTeamScoringModal = ({
  competitionRoundCode,
  containers,
  isModalVisible,
  hideModal,
  onChange,
  assessmentCriteria,
  onSubmit,
  onNotesChange,
  onFeedBackChange,
  onEndorse,
  verified,
  scoreSessionTimer,
  sessionTimer,
  permissionDeniedNotification,
  showSubmissionsTab,
  competition,
}) => {
  const { imageURL, containerCode, containerName } = containers[0] || {};
  const timer = scoreSessionTimer[containerCode];
  const [selectedAudioContainer, setSelectedAudioContainer] = useState("");
  const [selectedCriteria, setSelectedCriteria] = useState("");
  const [second, setSecond] = useState("00");
  const [counter, setCounter] = useState(0);
  const [accessRequested, setAccessRequested] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("");
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [stop, setStop] = useState(false);
  const [touched, setTouched] = useState({});
  const untouchedState = null;
  const [isEndorse, setIsEndorse] = useState(false);

  const isMobile = useMediaQuery("(max-width: 1023px)");

  useEffect(() => {
    const endorsed = localStorage.getItem("endorsed");
    if (Boolean(endorsed)) {
      setIsEndorse(true);
    } else {
      localStorage.setItem("endorsed", `false`);
      setIsEndorse(false);
    }
  }, []);

  useEffect(() => {
    if (assessmentCriteria && assessmentCriteria.length) {
      setSelectedCriteria(assessmentCriteria[0].label);
    }
  }, [assessmentCriteria]);

  useEffect(() => {
    const touchedObj = {};
    if (containers && containers.length) {
      containers.forEach(({ containerCode, assessment }, i) => {
        if (assessment && assessment.length) {
          assessment.map(({ points, label }, i) => {
            if (!touchedObj.hasOwnProperty(label)) touchedObj[label] = [];
            if (points != untouchedState) touchedObj[label].push(containerCode);
          });
        }
      });
    }

    setTouched({ ...touchedObj });
  }, [containers]);

  useEffect(() => {
    let intervalId;

    if (isAudioActive && recordingStatus === "recording") {
      if (counter > 59) {
        stopTimer();
      }

      intervalId = setInterval(() => {
        const secondCounter = counter % 60;
        let computedSecond =
          String(secondCounter).length === 1
            ? `0${secondCounter}`
            : secondCounter;
        setSecond(computedSecond);
        setCounter((counter) => counter + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isAudioActive, counter, recordingStatus]);

  const stopTimer = () => {
    setStop(true);
    setIsAudioActive(false);
    setCounter(0);
    setSecond("00");
  };

  const handleTouched = (containerCode, label, reset = false) => {
    const updateTouched = { ...touched };

    if (!updateTouched.hasOwnProperty(label)) updateTouched[label] = [];
    if (reset) {
      updateTouched[label] = updateTouched[label].filter(
        (c) => c != containerCode
      );
      setTouched(updateTouched);
    } else {
      updateTouched[label] = [
        ...new Set([...updateTouched[label], containerCode]),
      ];
      setTouched(updateTouched);
    }
  };

  return (
    <Modal
      className="teamScoringModal"
      closable={false}
      visible={isModalVisible}
      onOk={hideModal}
      onCancel={hideModal}
      footer={[
        <div className="text-center" key={"1"}>
          <Button
            type="primary"
            onClick={() => onSubmit(containers)}
            style={{ fontSize: "1rem" }}
            size="small"
            className="p-1 text-sm"
          >
            Done
          </Button>
        </div>,
      ]}
      destroyOnClose={true}
      style={{ borderRadius: "20px", maxWidth: "40%" }}
    >
      <Row className="teamScoringModalHeader">
        <Col className="teamNameWrap" span={12}>
          <Button
            className="buttonBack"
            icon={<ArrowBackIcon />}
            type="text"
            onClick={hideModal}
          />
          <div className="teamNameTextbox">
            <Typography.Text className="teamName">
              Judging Multiple
            </Typography.Text>
          </div>
        </Col>
        <Col offset={4} span={8}>
          <Typography.Text className="timerText">
            <Image src={loading} alt="loading" preview={false} />
            <span className="timer">
              {`${sessionTimer}`}
              {/* {`${timer?.minute}:${timer?.second}`} */}
              <span className="sec">Sec</span>
            </span>
            {/* <Typography.Text className="text-center">
            <HourGlassIcon />
            <span className="mx-1">{`${sessionTimer} Sec`}</span> */}
          </Typography.Text>
        </Col>
      </Row>
      <Row className="myteamScoringTabset">
        {assessmentCriteria.map((item, idx) => (
          <Col className="myteamScoringTabsetItem" key={`${idx}-${item.label}`}>
            <Button
              type="primary"
              style={{
                fontSize: ".75rem",
                background: selectedCriteria === item.label ? "#000" : "#fff",
                color: selectedCriteria === item.label ? "#fff" : "#000",
                borderColor:
                  selectedCriteria === item.label ? "#000" : "#c4c4c4",
              }}
              onClick={() => setSelectedCriteria(item.label)}
            >
              {item.label}
            </Button>
          </Col>
        ))}
        <Col className="notesRow myteamScoringTabsetItem">
          <Button
            type="primary"
            // className="mt-2 w-full"
            style={{
              fontSize: ".75rem",
              background: selectedCriteria === "notes" ? "#000" : "#fff",
              color: selectedCriteria === "notes" ? "#fff" : "#000",
              borderColor: selectedCriteria === "notes" ? "#000" : "#c4c4c4",
            }}
            onClick={() => setSelectedCriteria("notes")}
          >
            Notes
          </Button>
        </Col>
        {showSubmissionsTab && (
          <Col className="notesRow myteamScoringTabsetItem">
            <Button
              type="primary"
              style={{
                fontSize: ".75rem",
                background: selectedCriteria === "submission" ? "#000" : "#fff",
                color: selectedCriteria === "submission" ? "#fff" : "#000",
                borderColor:
                  selectedCriteria === "submission" ? "#000" : "#c4c4c4",
              }}
              onClick={() => setSelectedCriteria("submission")}
            >
              Submission
            </Button>
          </Col>
        )}
        {/* {verified && ( */}
        <Col className="feedbackRow" span={24}>
          <Button
            type="primary"
            className="mt-2 w-full"
            style={{
              fontSize: ".75rem",
              background: selectedCriteria === "feedback" ? "#000" : "#EFEFEF",
              color: selectedCriteria === "feedback" ? "#fff" : "#666",
            }}
            onClick={() => setSelectedCriteria("feedback")}
          >
            <FeedbackIcon />
            Feedback
          </Button>
        </Col>
        {/* )} */}
        {/* )} */}
      </Row>
      {/* {selectedCriteria !== "feedback" && (
        <Row className="scoringTitleWrap" justify="center">
          <Col span={24}>
            <Typography.Text className="scoringTitle">
              Move slider to assign points.
            </Typography.Text>
          </Col>
        </Row>
      )} */}
      {/* <Divider /> */}
      {selectedCriteria !== "feedback" &&
      selectedCriteria !== "notes" &&
      selectedCriteria !== "submission" ? (
        <Row className="teamScoringHolder" justify="left">
          {containers &&
            containers.length &&
            containers.map(
              (
                {
                  imageURL,
                  containerName,
                  containerCode,
                  assessment,
                  users,
                  lockRegistration = false,
                },
                i
              ) => {
                const isRegistrationValid = isValidRegistration(
                  { users },
                  competition
                );

                const selectedAssessmentCriteria = assessmentCriteria.find(
                  (ac) => ac.label == selectedCriteria
                );
                const containerAssessment = assessment.filter(
                  ({ label }) => label === selectedCriteria
                )[0];

                const { points, endorse, label, isCustom } =
                  containerAssessment;

                const maxPoints = selectedAssessmentCriteria.points;
                let rangePoints = [0];
                for (let i = 1; i < 5; i++)
                  rangePoints.push((maxPoints / 4) * i);

                let emojiUrl = unscored;
                if (points === untouchedState) emojiUrl = unscored;
                else if (points < rangePoints[1]) emojiUrl = urls[0];
                else if (points < rangePoints[2]) emojiUrl = urls[1];
                else if (points < rangePoints[3]) emojiUrl = urls[2];
                else if (points < rangePoints[4]) emojiUrl = urls[3];
                else emojiUrl = urls[4];
                const marks = {
                  0: "0",
                  maxPoints: `${maxPoints}`,
                };

                const initialStateHidden = true;

                return (
                  <Fragment key={containerName}>
                    <div className="teamScoringRow">
                      <Col className="teamScoringTitleBox teamScoringTitleAvatar">
                        <div className="teamScoringTitleAvatarWrap">
                          <Avatar
                            src={
                              imageURL
                                ? imageURL
                                : "https://joeschmoe.io/api/v1/random"
                            }
                          />
                          <Typography.Text className="teamScoringTitle">
                            {containerName}
                          </Typography.Text>
                        </div>
                        <div className="teamScoringFlex">
                          {points != untouchedState && (
                            <Typography.Text className="teamScoringRatings">{`${points} / ${maxPoints}`}</Typography.Text>
                          )}
                          {isRegistrationValid && lockRegistration && (
                            <div className="teamScoringEndorse">
                              {!isCustom && verified && (
                                <Popconfirm
                                  disabled={isEndorse}
                                  title={`Are you sure? You are ${
                                    endorse
                                      ? "removing endorsement for"
                                      : "endorsing"
                                  } ${containerName} for ${label}.`}
                                  onConfirm={() => {
                                    onEndorse(label, containerCode);
                                    setIsEndorse(true);
                                    localStorage.setItem("isEndorse", true);
                                  }}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <Button
                                    className="buttonEndorse"
                                    onClick={() => {
                                      isEndorse &&
                                        onEndorse(label, containerCode);
                                    }}
                                    style={{
                                      color: `${
                                        endorse ? "#0066FF" : "#C4C4C4"
                                      }`,
                                      border: "none",
                                    }}
                                  >
                                    <LikeSVGIcon />
                                  </Button>
                                </Popconfirm>
                              )}
                            </div>
                          )}
                        </div>
                      </Col>
                      {/* <Col span={24} className="mb-10">
                        <div>
                          {submissionLinks?.length ? (
                            <SubmissionsView
                              submissionLinks={submissionLinks}
                              single={false}
                            />
                          ) : (
                            <span></span>
                          )}
                        </div>
                      </Col> */}
                      <Col
                        className={`teamScoringSlider ${
                          initialStateHidden ? "" : "judgeInitialEmoji"
                        }`}
                      >
                        {/* <div
                          className="justify-between judgeFormEmojiView"
                          style={{
                            display: `${initialStateHidden ? "none" : "flex"}`,
                            zIndex: "1",
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            marginTop: "-10px",
                          }}
                        >
                          {initialSliderEmojis.map((url, index) => (
                            <Image
                              key={url}
                              src={url}
                              onClick={() => {
                                handleTouched(containerCode, label);
                                onChange(
                                  Math.round(rangePoints[index]),
                                  label,
                                  containerCode
                                );
                              }}
                              style={{ height: "40px", width: "40px" }}
                              preview={false}
                              alt="emoji"
                            />
                          ))}
                        </div> */}

                        <Slider
                          id="slider-marks"
                          marks={marks}
                          value={points || 0}
                          className={`score-slider ${
                            points === untouchedState ? "unscored " : ""
                          }`}
                          onChange={(val) => {
                            if (isNaN(val)) {
                              onChange(maxPoints, label, containerCode);
                            } else {
                              onChange(val, label, containerCode);
                            }
                          }}
                          tooltipVisible={false}
                          // tooltipPlacement="bottom"
                          handleStyle={{
                            visibility: `${initialStateHidden ? "" : "hidden"}`,
                            border: "0px",
                            height: "73px",
                            width: `${
                              points === untouchedState ? "42px" : "96px"
                            }`,
                            marginTop: `${
                              points === untouchedState ? "-22px" : "-52px"
                            }`,
                            background: `url("${emojiUrl}") no-repeat`,
                            backgroundSize: "100%",
                            borderRadius: "0px",
                          }}
                          min={0}
                          max={maxPoints}
                          defaultValue={points}
                        />
                        <div className="teamScoringReset">
                          <Button
                            className="teamScoringReset"
                            onClick={() => {
                              onChange(untouchedState, label, containerCode);
                              handleTouched(containerCode, label, true);
                            }}
                            icon={<ReloadIcon />}
                            type="text"
                          />
                        </div>
                      </Col>
                    </div>
                    <div className="flex justify-center w-full pb-3 judge-emoji-border">
                      {/* {initialStateHidden ? ( */}
                      <span>Move slider to assign points</span>
                      {/* ) : (
                        <span>Tap to choose an emoji</span>
                      )} */}
                    </div>
                  </Fragment>
                );
              }
            )}
        </Row>
      ) : (
        <div className="feedbackFormHolder">
          {/* {verified && */}
          {containers &&
            containers.length &&
            containers.map(
              ({
                imageURL,
                containerName,
                containerCode,
                feedback,
                notes,
                Submission,
              }) => (
                <>
                  <div className="feedbackFormRow">
                    <div className="feedbackFormAvatar">
                      <Avatar
                        src={
                          imageURL
                            ? imageURL
                            : "https://joeschmoe.io/api/v1/random"
                        }
                      />
                    </div>
                    <div className="feedbackFormFieldWrap">
                      <Typography.Text className="feedbackFormTeamName">
                        {containerName}
                      </Typography.Text>
                      {selectedCriteria === "feedback" ? (
                        <div className="teamScoringFeedbackTextarea">
                          {/* <Col className="my-2 mx-0" span={18} offset={1}> */}
                          <Input.TextArea
                            rows={4}
                            value={feedback?.text || ""}
                            onChange={(e) =>
                              onFeedBackChange(containerCode, e.target.value)
                            }
                            style={{ height: "2.5rem", width: "85%" }}
                            size="small"
                            placeholder="Add feedback here"
                          />
                          {/* {feedback && feedback.audio ? (
                          <></>
                        ) : !isAudioActive || recordingStatus === "idle" ? (
                          <AudioOutlined
                            onClick={() => {
                              setAccessRequested(true);
                              setSelectedAudioContainer(containerCode);
                              setIsAudioActive(true);
                              navigator.permissions
                                .query({ name: "microphone" })
                                .then((permissionStatus) => {
                                  if (permissionStatus.state === "denied") {
                                    permissionDeniedNotification();
                                    setIsAudioActive(false);
                                  }
                                });
                            }}
                            style={{
                              marginLeft: "0.5rem",
                              marginBottom: "0.25rem",
                              fontSize: "2rem",
                              color: "#1890ff",
                            }}
                          />
                        ) : selectedAudioContainer === containerCode ? (
                          <span
                            className="audioTimer"
                            // style={{
                            //   marginLeft: "0.45rem",
                            //   marginBottom: "2rem",
                            //   fontSize: "1.5rem",
                            // }}
                          >
                            <Typography.Text>:{60 - second}s</Typography.Text>
                            <StopOutlined
                              style={{
                                marginRight: ".35rem",
                                marginBottom: ".5rem",
                                color: "red",
                              }}
                              onClick={stopTimer}
                            />
                          </span>
                        ) : (
                          ""
                        )}
                        {accessRequested &&
                          selectedAudioContainer === containerCode && (
                            <AudioFeedback
                              recordingStatus={recordingStatus}
                              setRecordingStatus={setRecordingStatus}
                              containerCode={containerCode}
                              stop={stop}
                              setStop={setStop}
                              isActive={isAudioActive}
                            />
                          )}
                        {feedback && feedback.audio && (
                          <>
                            <AudioFeedbackPlayer
                              onFeedBackChange={onFeedBackChange}
                              feedback={feedback}
                              containerCode={containerCode}
                            />
                          </>
                        )} */}
                        </div>
                      ) : selectedCriteria === "notes" ? (
                        <Notes
                          notes={notes}
                          onNotesChange={onNotesChange}
                          containerCode={containerCode}
                        />
                      ) : showSubmissionsTab ? (
                        <SubmissionSection
                          submission={
                            competitionRoundCode &&
                            Submission &&
                            Submission.length
                              ? Submission.find(
                                  (c) =>
                                    c.competitionRoundCode ===
                                    competitionRoundCode
                                )
                              : null
                          }
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </>
              )
            )}
        </div>
      )}
    </Modal>
  );
};

export default MultipleTeamScoringModal;
