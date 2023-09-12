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
  Tabs,
  Typography,
} from "antd";
import { Fragment, useEffect, useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import useMediaQuery from "../../../hooks/useMediaQuery";
import { isValidRegistration } from "../../../utility/common";
import { scoreSliderEmojis } from "../../../utility/config";
import {
  ArrowBackIcon,
  FileNewIcon,
  LikeSVGIcon,
  LinkIcon,
  ReloadIcon,
} from "../../../utility/iconsLibrary";
import { loading, noSubmissions, unscored } from "../../../utility/imageConfig";
import Recoding from "../recodingModule/Recoding";

let urls = scoreSliderEmojis;

const Scoring = ({
  assessment,
  assessmentCriteria,
  untouchedState,
  containerName,
  containerCode,
  onEndorse,
  verified,
  onChange,
  handleTouched,
  isRegistrationValid,
}) => {
  const endorses = assessment.map(({ endorse }) => endorse);
  const [isEndorse, setIsEndorse] = useState(false);
  useEffect(() => {
    const endorsed = localStorage.getItem("endorsed");
    if (Boolean(endorsed)) {
      setIsEndorse(true);
    } else {
      localStorage.setItem(
        "endorsed",
        `${endorses?.includes(true) ? true : false}`
      );
      setIsEndorse(false);
    }
  }, []);
  return (
    <Row className="teamScoringHolder" justify="left">
      {assessment &&
        assessment.length &&
        assessment.map(({ points, label, endorse, isCustom }, i) => {
          const maxPoints = assessmentCriteria[i]?.points;
          let rangePoints = [0];
          for (let i = 1; i < 5; i++) rangePoints.push((maxPoints / 5) * i);

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
          // touched.filter(
          //   (c) => c === label
          // ).length;

          return (
            <Fragment key={label}>
              <div className="teamScoringRow">
                <Col className="teamScoringTitleBox">
                  <Typography.Text className="teamScoringTitle">
                    {label}
                  </Typography.Text>
                  <div className="teamScoringFlex">
                    {points != untouchedState && (
                      <Typography.Text className="teamScoringRatings">{`${points}/${maxPoints}`}</Typography.Text>
                    )}
                    {isRegistrationValid && (
                      <div className="teamScoringEndorse">
                        {!isCustom && verified && (
                          <Popconfirm
                            disabled={isEndorse}
                            title={`Are you sure? You are ${
                              endorse ? "removing endorsement for" : "endorsing"
                            } ${containerName} for ${label}.`}
                            onConfirm={() => {
                              onEndorse(label, containerCode);
                              setIsEndorse(true);
                            }}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button
                              className="buttonEndorse"
                              onClick={() => {
                                isEndorse && onEndorse(label, containerCode);
                              }}
                              style={{
                                color: `${endorse ? "#0066FF" : "#C4C4C4"}`,
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

                <Col
                  className={`teamScoringSlider  ${
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
                      handleTouched(label);
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
                    marks={marks}
                    value={points || 0}
                    id="slider-marks"
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
                    tooltipPlacement="bottom"
                    handleStyle={{
                      visibility: `${initialStateHidden ? "" : "hidden"}`,
                      border: "0px",
                      height: "73px",
                      width: `${points === untouchedState ? "42px" : "96px"}`,
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
                      onClick={() => {
                        onChange(untouchedState, label, containerCode);
                        handleTouched(label, true);
                      }}
                      className="teamScoringReset"
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
        })}
    </Row>
  );
};

const Notes = ({ notes, onNotesChange, containerCode }) => {
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const contentEditable = useRef(null);
  const [notesList, setNotesList] = useState("<li>Start typing here…</li>");
  const handleFocus = () => {
    setNotesList(null);
  };
  const handleChange = (e) => {
    let data = e.target.value;

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
    <div className="teamScoringFeedback judgeNotesBlock">
      <div className={`text-center ${isMobile && "hidden"}`}>
        <Typography.Text className="text-center">Notes</Typography.Text>
      </div>
      <ul className="judgeNotesList">
        <ContentEditable
          innerRef={contentEditable}
          html={notesList}
          disabled={false}
          onChange={handleChange}
          onFocus={handleFocus}
          tagName="div"
        />
      </ul>
    </div>
  );
};

const Submission = ({ submission }) => {
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

const Feedback = ({
  recording,
  feedback,
  onFeedBackChange,
  containerCode,
  isAudioActive,
  recordingStatus,
  setAccessRequested,
  setIsAudioActive,
  permissionDeniedNotification,
  accessRequested,
  second,
  setRecordingStatus,
  stop,
  setStop,
  stopTimer,
  setRecording,
  setRecodingPayload,
}) => {
  const textareaRef = useRef(null);
  const autoResize = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    autoResize();
  }, []);
  return (
    <>
      {/* <Divider /> */}
      <div className="teamScoringFeedback">
        <Typography.Text className="align-start teamScoringTitle">
          Feedback
        </Typography.Text>
        <div></div>
        <div
          className={
            recording == "audio"
              ? "teamScoringRecorder recordingStart"
              : "teamScoringRecorder"
          }
        >
          <div className="teamScoringTextfield">
            <Typography.Text
              className={
                recording == "audio"
                  ? "active profileUserInfoText "
                  : "profileUserInfoText"
              }
            >
              <textarea
                // rows={2}
                ref={textareaRef}
                onChange={(e) =>
                  e.target.value !== ""
                    ? setRecording("text")
                    : setRecording("")
                }
                onBlur={(e) => onFeedBackChange(containerCode, e.target.value)}
                onInput={autoResize}
                defaultValue={feedback?.text || ""}
                className="ant-input"
                placeholder="Add feedback here..."
                // maxLength="250"
              ></textarea>
            </Typography.Text>
          </div>
          <Recoding
            containerCode={containerCode}
            onFeedBackChange={onFeedBackChange}
            setRecodingPayload={setRecodingPayload}
            setRecording={setRecording}
          />
          {/* <Input.TextArea
            rows={4}
            value={feedback?.text || ""}
            onChange={(e) => onFeedBackChange(containerCode, e.target.value)}
            style={{ height: "2.5rem", width: "85%" }}
            size="small"
            placeholder="Add feedback here"
          /> */}

          {/* {feedback && feedback?.audio ? (
            <></>
          ) : !isAudioActive || recordingStatus === "idle" ? (
            <AudioOutlined
              onClick={() => {
                setAccessRequested(true);
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
          ) : (
            <span
              className="audioTimer"
              // style={{
              //   marginLeft: "0.45rem",
              //   marginBottom: "2rem",
              //   fontSize: "1.5rem",
              // }}
            >
              <Typography style={{ display: "inline-block" }}>
                :{60 - second}s
              </Typography>
              <StopOutlined
                style={{
                  marginRight: ".35rem",
                  marginBottom: ".5rem",
                  color: "red",
                }}
                onClick={stopTimer}
              />
            </span>
          )}
          {accessRequested && (
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
          )}  */}
        </div>
      </div>
    </>
  );
};

const SingleTeamScoringModal = ({
  competitionRoundCode,
  container,
  isModalVisible,
  hideModal,
  onChange,
  assessmentCriteria,
  onSubmit,
  onFeedBackChange,
  onNotesChange,
  onEndorse,
  verified,
  scoreSessionTimer,
  sessionTimer,
  permissionDeniedNotification,
  showSubmissionsTab,
  competition,
}) => {
  const {
    imageURL,
    emojiObject,
    containerCode,
    containerName,
    feedback,
    assessment,
    notes,
  } = container;
  const timer = scoreSessionTimer[containerCode];
  const untouchedState = null;

  const [second, setSecond] = useState("00");
  const [counter, setCounter] = useState(0);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [accessRequested, setAccessRequested] = useState(false);
  const [stop, setStop] = useState(false);
  const [touched, setTouched] = useState([]);
  const [recordingStatus, setRecordingStatus] = useState("");
  const [isRegistrationValid, setRegistrationValid] = useState(false);
  const [recodingPayload, setRecodingPayload] = useState(null);
  const isMobile = useMediaQuery("(max-width: 1023px)");

  useEffect(() => {
    if (competition && container) {
      setRegistrationValid(
        isValidRegistration(container, competition) &&
          container?.lockRegistration
      );
    }
  }, [competition, container]);

  const handleTouched = (criteria, reset = false) => {
    if (reset) {
      const updateTouched = touched.filter((c) => c !== criteria);
      setTouched([...updateTouched]);
    } else {
      setTouched([...new Set([...touched, criteria])]);
    }
  };

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

  useEffect(() => {
    const touchedLabels = [];
    if (assessment && assessment.length) {
      assessment.map(({ points, label }, i) => {
        if (points != untouchedState) touchedLabels.push(label);
      });

      setTouched([...touchedLabels]);
    }
  }, [assessment]);

  const stopTimer = () => {
    setStop(true);
    setIsAudioActive(false);
    setCounter(0);
    setSecond("00");
  };

  let scoredPoints = 0;
  let totalPoints = 0;
  if (assessmentCriteria && assessmentCriteria.length)
    assessmentCriteria.forEach(({ points }) => (totalPoints += points));
  if (container && container.assessment && container.assessment.length)
    container.assessment.forEach(({ points }) => (scoredPoints += points));
  let submission = "";
  if (
    competitionRoundCode &&
    container &&
    container.Submission &&
    container.Submission.length
  ) {
    const curRoundSubmission = container.Submission.find(
      (c) => c.competitionRoundCode === competitionRoundCode
    );
    if (curRoundSubmission) {
      submission = curRoundSubmission;
    }
  }

  const [recording, setRecording] = useState("");

  return (
    <Modal
      className="teamScoringModal"
      closable={false}
      visible={isModalVisible}
      onOk={hideModal}
      onCancel={hideModal}
      footer={[
        <div
          className={`text-center mobile:absolute bottom-3 mobile:w-[80%] inset-x-0 mx-auto`}
          key={"1"}
        >
          <Button
            type="primary"
            disabled={
              !!container?.assessment?.filter((item) => item?.points === null)
                ?.length
            }
            onClick={() => onSubmit(container)}
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
          {!emojiObject ? (
            <Avatar src={imageURL} />
          ) : (
            <p className="teamEmoji" style={{ fontSize: "2.5rem" }}>
              {emojiObject?.emoji}
            </p>
          )}
          <div className="teamNameTextbox">
            <Typography.Text className="teamName">
              {containerName}
            </Typography.Text>
            <Typography.Text className="teamPoints">
              {`${scoredPoints}/${totalPoints} Pts`}
            </Typography.Text>
          </div>
        </Col>
        <Col offset={5} span={7}>
          <Typography.Text className="timerText">
            <Image src={loading} preview={false} alt="" />
            <span className="timer">
              {/* {sessionTimer} */}
              {`${timer?.minute}:${timer?.second}`}
              <span className="sec">Sec</span>
            </span>
          </Typography.Text>
        </Col>
      </Row>
      {/* <Row className="scoringTitleWrap" justify="center">
        <Col span={24}>
          <Typography.Text className="scoringTitle">
            Move slider to assign points.
          </Typography.Text>
        </Col>
      </Row> */}
      {/* <Divider /> */}
      {/* <Row>
        {submissionLinks.length ? (
          <>
            <div className="judgeSubmissionsHeader">
              <div className="judgeSubmissionsHeaderTextbox">
                <Typography.Title className="heading">
                  Submissions
                </Typography.Title>
                <Typography.Text className="subtext">
                  Tap on links to preview submissions
                </Typography.Text>
              </div>
              <SubmissionsView submissionLinks={submissionLinks} />
            </div>
          </>
        ) : (
          ""
        )}
      </Row> */}
      {/* {isMobile ? ( */}
      {/* <> */}
      <Tabs className="judgesScoreMobileTabset" defaultActiveKey="1">
        <Tabs.TabPane tab="Score" key={"1"}>
          <Scoring
            assessment={assessment}
            assessmentCriteria={assessmentCriteria}
            untouchedState={untouchedState}
            containerName={containerName}
            containerCode={containerCode}
            onEndorse={onEndorse}
            verified={verified}
            onChange={onChange}
            handleTouched={handleTouched}
            isRegistrationValid={isRegistrationValid}
          />

          <div className="audioFeedbackBlock">
            {/* {recording !== "audio" && ( */}
            <Feedback
              recording={recording}
              feedback={feedback}
              onFeedBackChange={onFeedBackChange}
              containerCode={containerCode}
              isAudioActive={isAudioActive}
              recordingStatus={recordingStatus}
              setAccessRequested={setAccessRequested}
              setIsAudioActive={setIsAudioActive}
              permissionDeniedNotification={permissionDeniedNotification}
              accessRequested={accessRequested}
              second={second}
              setRecordingStatus={setRecordingStatus}
              stop={stop}
              setStop={setStop}
              stopTimer={stopTimer}
              setRecording={setRecording}
              setRecodingPayload={setRecodingPayload}
            />
            {/* )} */}
            {/* {recording !== "text" && (
              
            )} */}
            {/* <Recoding
              containerCode={containerCode}
              onFeedBackChange={onFeedBackChange}
              setRecodingPayload={setRecodingPayload}
              setRecording={setRecording}
            /> */}
          </div>
        </Tabs.TabPane>
        {showSubmissionsTab && (
          <Tabs.TabPane tab="Submission" key={"2"}>
            <Submission submission={submission} />
          </Tabs.TabPane>
        )}
        {/* <Tabs.TabPane tab="Feedback" key={"3"}>
          <Feedback
            feedback={feedback}
            onFeedBackChange={onFeedBackChange}
            containerCode={containerCode}
            isAudioActive={isAudioActive}
            recordingStatus={recordingStatus}
            setAccessRequested={setAccessRequested}
            setIsAudioActive={setIsAudioActive}
            permissionDeniedNotification={permissionDeniedNotification}
            accessRequested={accessRequested}
            second={second}
            setRecordingStatus={setRecordingStatus}
            stop={stop}
            setStop={setStop}
            stopTimer={stopTimer}
          />
        </Tabs.TabPane> */}
        <Tabs.TabPane tab="Notes" key={"3"}>
          <Notes
            notes={notes}
            onNotesChange={onNotesChange}
            containerCode={containerCode}
          />
        </Tabs.TabPane>
      </Tabs>
      {/* </>
      ) : (
        <>
          <Scoring
            assessment={assessment}
            assessmentCriteria={assessmentCriteria}
            untouchedState={untouchedState}
            containerName={containerName}
            containerCode={containerCode}
            onEndorse={onEndorse}
            verified={verified}
            onChange={onChange}
            handleTouched={handleTouched}
          />
          <Feedback
            feedback={feedback}
            onFeedBackChange={onFeedBackChange}
            containerCode={containerCode}
            isAudioActive={isAudioActive}
            recordingStatus={recordingStatus}
            setAccessRequested={setAccessRequested}
            setIsAudioActive={setIsAudioActive}
            permissionDeniedNotification={permissionDeniedNotification}
            accessRequested={accessRequested}
            second={second}
            setRecordingStatus={setRecordingStatus}
            stop={stop}
            setStop={setStop}
            stopTimer={stopTimer}
          />
          <Notes
            notes={notes}
            onNotesChange={onNotesChange}
            containerCode={containerCode}
          />
        </>
      )} */}
      {/* {verified && ( */}

      {/* )} */}
    </Modal>
  );
};

export default SingleTeamScoringModal;
