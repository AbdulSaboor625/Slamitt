import { Button, Col, Image, Row, Tabs, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  clearJudgeState,
  logoutJudge,
  notify,
  updateJudge,
  updateRoundContainer,
} from "../../../Redux/Actions";
import {
  judgeEmptyState,
  routeGenerator,
  routes,
} from "../../../utility/config";
import { CrossIcon, SearchIcon } from "../../../utility/iconsLibrary";
import { imgHead, loading } from "../../../utility/imageConfig";
import AppCustomPicker from "../../AppCustomPicker";
import JudgedCard from "./JudgedCard";
import JudgingCard from "./JudgingCard";
import MultipleTeamScoringModal from "./MultipleTeamScoringModal";
import SingleTeamScoringModal from "./SingleTeamScoringModal";
import SubmitScoreModal from "./SubmitScoreModal";

const ScoringModule = ({
  judgeState,
  updateContainer,
  submitScores,
  sessionTimer,
  abandon,
  pusherChannel,
  search,
  setSearch,
}) => {
  const { containers, round, judge } = judgeState;
  const { verified } = judge;
  const dispatch = useDispatch();
  const router = useRouter();

  const [showSubmissionsTab, setShowSubmissionsTab] = useState(false);
  const [longPressedContainer, setLongPressedContainer] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedContainerCode, setSelectedContainerCode] = useState("");
  const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
  const [scoreSessionTimer, setScoreSessionTimer] = useState({});
  const [counter, setCounter] = useState(0);
  const [openContainerCode, setOpenContainerCode] = useState(false);
  const [selectMultiple, setSelectMultiple] = useState(false);
  const [selectedMultipleContainers, setSelectedMultipleContainers] = useState(
    []
  );
  const [longPressTimer, setLongPressTimer] = useState(0);
  const [isLongPress, setIsLongPress] = useState(false);
  const [isMultipleSelectModalVisible, setIsMultipleSelectModalVisible] =
    useState(false);
  const [tabActive, setTabActive] = useState(1);
  // scroll to top position tracking
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const showModal = (containerCode) => {
    setSelectedContainerCode(containerCode);
    setIsModalVisible(true);
    setOpenContainerCode(containerCode);
    if (containerCode in scoreSessionTimer) {
      const updateCounter =
        parseInt(scoreSessionTimer[containerCode].minute) * 60 +
        parseInt(scoreSessionTimer[containerCode].second);
      setCounter(updateCounter);
    }
  };

  const hideModal = () => {
    // document.body.scrollTop = 0;

    if (selectedMultipleContainers && selectedMultipleContainers.length) {
      updateContainer({
        containers: selectedMultipleContainers,
        callApi: true,
      });
    }

    if (selectedContainer && selectedContainer.containerCode) {
      updateContainer({ containers: [selectedContainer], callApi: true });
    }

    setSelectMultiple(false);
    setSelectedMultipleContainers([]);
    setSelectedContainerCode("");
    setIsModalVisible(false);
    setIsMultipleSelectModalVisible(false);
    setOpenContainerCode("");
    setCounter(0);
  };

  let interval;
  useEffect(() => {
    if (isLongPress) {
      if (
        isLongPress &&
        longPressTimer >= 1 &&
        ((tabActive == "1" && inProgess.length > 1) ||
          (tabActive == "2" && scored.length > 1))
      ) {
        setSelectMultiple(true);
        addMultipleSelectContainer(longPressedContainer);
        setLongPressTimer(0);
        setIsLongPress(false);
        setLongPressedContainer("");
        return () => clearInterval(interval);
      }

      interval = setInterval(() => {
        setLongPressTimer((longPressTimer) => longPressTimer + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLongPress, longPressTimer]);

  const handleTouchStart = (container) => {
    setIsLongPress(true);
    setLongPressedContainer(container);
  };

  const handleTouchEnd = () => {
    clearInterval(interval);
    setLongPressTimer(0);
    setIsLongPress(false);
  };

  const hideSubmitModal = () => {
    setIsSubmitModalVisible(false);
  };

  const onSubmit = async (container) => {
    // await updateContainer({ container, callApi: true });
    hideModal();
  };

  const onMultipleSubmit = async (containers) => {
    // for (const container of containers) {
    //   await updateContainer({ container, callApi: true });
    // }
    hideModal();
  };

  const onChange = (val, updateLabel, containerCode) => {
    const container = containers.find(
      (container) => container.containerCode === containerCode
    );

    if (container) {
      container.assessment.every((assess) => {
        if (assess.label === updateLabel) {
          assess.points = val;
          return false;
        }
        return true;
      });

      updateContainer({ containers: [container] });
    }
  };

  const onEndorse = (updateLabel, containerCode) => {
    const container = containers.filter(
      (container) => container.containerCode === containerCode
    )[0];

    container.assessment.every(({ label }, i) => {
      if (label === updateLabel) {
        container.assessment[i].endorse = !container.assessment[i].endorse;
        return false;
      }
      return true;
    });

    updateContainer({ containers: [container] });
  };

  const onFeedBackChange = (containerCode, val, isAudio = false) => {
    const container = containers.filter(
      (container) => container.containerCode === containerCode
    )[0];

    if (isAudio) container.feedback.audio = val;
    else container.feedback.text = val;

    updateContainer({ containers: [container] });
  };

  const onNotesChange = (containerCode, val) => {
    const container = containers.filter(
      (container) => container.containerCode === containerCode
    )[0];

    container.notes = val;

    updateContainer({ containers: [container] });
  };

  const permissionDeniedNotification = () =>
    dispatch(
      notify({
        type: "error",
        message: "Please grant permission on your device to record feedback",
      })
    );

  let newContainers = containers.map((container) => {
    let scoredPoints = 0;
    let endorsements = 0;
    container.assessment.map(({ points, endorse }) => {
      scoredPoints += points;
      endorsements += endorse;
    });
    return { ...container, scoredPoints, endorsements };
  });

  let inProgess = newContainers.filter((container) => !container.scored);
  let scored = newContainers.filter((container) => container.scored);
  let allProgressAndScored = [...inProgess, ...scored];

  if (scored && scored.length) {
    scored = scored.sort(
      (c1, c2) => parseFloat(c2.scoredPoints) - parseFloat(c1.scoredPoints)
    );
  }

  const assessmentCriteria = round?.assessmentCriteria || [];
  let maxPoints = 0;
  assessmentCriteria.forEach(({ points }) => (maxPoints += points));

  let curMinPoints = maxPoints;
  let curMaxPoints = 0;
  if (scored.length) {
    scored.forEach((container) => {
      let pointsCur = 0;
      container.assessment.forEach(({ points }) => (pointsCur += points));
      if (pointsCur < curMinPoints) curMinPoints = pointsCur;
      if (pointsCur > curMaxPoints) curMaxPoints = pointsCur;
    });
  }

  if (search && search.length) {
    inProgess = inProgess.filter((container) =>
      container.containerName.toLowerCase().includes(search.toLowerCase())
    );
    scored = scored.filter((container) =>
      container.containerName.toLowerCase().includes(search.toLowerCase())
    );
  }

  const selectedContainer =
    newContainers.filter(
      ({ containerCode }) => containerCode === selectedContainerCode
    )[0] || {};

  const addMultipleSelectContainer = (container) => {
    if (
      selectedMultipleContainers.find(
        (c) => c.containerCode == container.containerCode
      )
    ) {
      setSelectedMultipleContainers([
        ...selectedMultipleContainers.filter(
          (c) => c.containerCode != container.containerCode
        ),
      ]);
    } else {
      setSelectedMultipleContainers([...selectedMultipleContainers, container]);
    }
  };

  useEffect(() => {
    if (selectMultiple && selectedMultipleContainers.length === 0)
      setSelectMultiple(false);
  }, [selectedMultipleContainers]);

  const onFinalSubmit = () => {
    let newContainers = containers.map((container) => ({
      ...container,
      submit: true,
    }));

    submitScores({ containers: newContainers });
    hideSubmitModal();
  };

  useEffect(() => {
    const updateScoreSessionTimer = {};
    containers.forEach((container) => {
      if (!updateScoreSessionTimer.hasOwnProperty(container.containerCode))
        updateScoreSessionTimer[container.containerCode] = {
          minute: "00",
          second: "00",
        };
    });
    setScoreSessionTimer({ ...scoreSessionTimer, ...updateScoreSessionTimer });
  }, [containers && containers.length]);

  useEffect(() => {
    if (
      containers &&
      containers.length &&
      round &&
      round.competitionRoundCode
    ) {
      let hasSubmissions = false;
      containers.forEach((container) => {
        if (container.Submission && container.Submission.length) {
          const currentRoundSubmission = container.Submission.find(
            (s) => s.competitionRoundCode === round.competitionRoundCode
          );
          if (
            currentRoundSubmission &&
            currentRoundSubmission.submissions &&
            currentRoundSubmission.submissions.length &&
            currentRoundSubmission.submissions.filter((s) => s.url).length
          ) {
            hasSubmissions = true;
          }
        }
      });

      setShowSubmissionsTab(hasSubmissions);
    }
  }, [containers, round]);

  useEffect(() => {
    let intervalId;

    if (openContainerCode) {
      intervalId = setInterval(() => {
        const secondCounter = counter % 60;
        const minuteCounter = Math.floor(counter / 60);

        let computedSecond =
          String(secondCounter).length === 1
            ? `0${secondCounter}`
            : secondCounter;
        let computedMinute =
          String(minuteCounter).length === 1
            ? `0${minuteCounter}`
            : minuteCounter;

        const newTimer = {
          ...scoreSessionTimer,
        };
        newTimer[openContainerCode] = {
          minute: computedMinute,
          second: computedSecond,
        };
        setScoreSessionTimer(newTimer);
        setCounter((counter) => counter + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [counter, openContainerCode]);

  let teamsOrParticipants = "participants";
  if (
    round &&
    round.Competition &&
    round.Competition.competitionType === "TEAM"
  ) {
    teamsOrParticipants = "teams";
  }

  if (!containers.length)
    return (
      <div className="judgesContentHolder">
        <div className="text-center">
          <Image
            preview={false}
            style={{ margin: "auto" }}
            src={judgeEmptyState.SCORED}
            alt=""
          />
          <div>
            <Typography.Text>
              This room has no {teamsOrParticipants}
            </Typography.Text>
          </div>
        </div>
      </div>
    );

  const showSubmitMiddle =
    inProgess.length === 0 && scored.length && tabActive == "1";
  const submitScoresButton = () => (
    <Button
      disabled={scored?.length < 2}
      onClick={() => {
        if (!navigator.onLine) {
          dispatch(
            notify({
              type: "info",
              message: "You cannot submit scores while you are offline",
            })
          );
        } else {
          setIsSubmitModalVisible(true);
        }
      }}
      className="buttonSubmitScore"
      type="primary"
    >
      <span className="visibleTablet">Release Scores</span>
      <span className="visibleMobile">RELEASE SCORES</span>
    </Button>
  );

  const inProgressContent = () => (
    <div className="judgesContentCardsScroller">
      {/* In Progress */}
      {inProgess && inProgess.length ? (
        <>
          <div className="judgesContentCardsHeader"></div>
          <Row
            gutter={[16]}
            // style={{ maxHeight: "500px", overflowY: "scroll" }}
          >
            {inProgess.map((container) => (
              <Col
                key={container.containerCode}
                xs={12}
                sm={8}
                md={6}
                xl={4}
                xxl={3}
                className="select-none my-3"
                onClick={() => {
                  if (selectMultiple) addMultipleSelectContainer(container);
                }}
                // onTouchStart={() => handleTouchStart(container)}
                // onTouchEnd={handleTouchEnd}
              >
                <JudgingCard
                  selectMultiple={selectMultiple}
                  selectedMultipleContainers={selectedMultipleContainers}
                  maxPoints={maxPoints}
                  container={container}
                  showModal={showModal}
                />
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <div className="judgesContentPlaceholder">
          <Image
            preview={false}
            style={{ margin: "auto" }}
            src={judgeEmptyState.PROGRESS}
            alt=""
          />
          <div className="judgesContentPlaceholderText">
            <Typography.Text>
              {`All ${teamsOrParticipants} have been scored!`}
            </Typography.Text>
          </div>
          {/* {showSubmitMiddle && submitScoresButton()} */}
        </div>
      )}
      <div className="judgesCardsSpacer"></div>
    </div>
  );

  const scoredContent = () => (
    <div className="judgesContentCardsScroller">
      {scored && scored.length ? (
        <>
          <div className="judgesContentCardsHeader"></div>
          <Row
            gutter={16}
            // style={{ maxHeight: "500px", overflowY: "scroll" }}
          >
            {scored.map((container) => (
              <Col
                key={container.containerCode}
                xs={12}
                sm={8}
                md={6}
                xl={4}
                xxl={3}
                className="select-none my-3"
                onClick={() => {
                  if (selectMultiple) addMultipleSelectContainer(container);
                }}
                // onTouchStart={() => handleTouchStart(container)}
                // onTouchEnd={handleTouchEnd}
              >
                <JudgedCard
                  selectMultiple={selectMultiple}
                  curMaxPoints={curMaxPoints}
                  curMinPoints={curMinPoints}
                  selectedMultipleContainers={selectedMultipleContainers}
                  maxPoints={maxPoints}
                  container={container}
                  showModal={showModal}
                />
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <>
          <div className="judgesContentPlaceholder">
            <Image
              preview={false}
              style={{ marging: "auto" }}
              src={judgeEmptyState.SCORED}
              alt=""
            />
            <div className="judgesContentPlaceholderText">
              <Typography.Text>
                {`No ${teamsOrParticipants} have been scored`}
              </Typography.Text>
            </div>
          </div>
        </>
      )}
      <div className="judgesCardsSpacer"></div>
    </div>
  );

  const updateJudgeImage = (image) => {
    dispatch(
      updateJudge({
        imageURL: image.url,
        emojiObject: image.emoji,
      })
    );
  };
  return (
    <div className="judgesContentHolder">
      <SingleTeamScoringModal
        competition={round?.Competition}
        competitionRoundCode={round?.competitionRoundCode}
        assessmentCriteria={assessmentCriteria}
        onChange={onChange}
        isModalVisible={isModalVisible}
        hideModal={hideModal}
        container={selectedContainer}
        // submission={
        //   submissions.find(
        //     (s) => s?.containerCode === selectedContainer?.containerCode
        //   )?.links
        // }
        onSubmit={onSubmit}
        onFeedBackChange={onFeedBackChange}
        onNotesChange={onNotesChange}
        onEndorse={onEndorse}
        verified={verified}
        sessionTimer={sessionTimer}
        scoreSessionTimer={scoreSessionTimer}
        permissionDeniedNotification={permissionDeniedNotification}
        showSubmissionsTab={showSubmissionsTab}
      />
      <MultipleTeamScoringModal
        competition={round?.Competition}
        competitionRoundCode={round?.competitionRoundCode}
        assessmentCriteria={assessmentCriteria}
        onChange={onChange}
        isModalVisible={isMultipleSelectModalVisible}
        hideModal={hideModal}
        containers={selectedMultipleContainers}
        onSubmit={onMultipleSubmit}
        onNotesChange={onNotesChange}
        onFeedBackChange={onFeedBackChange}
        onEndorse={onEndorse}
        verified={verified}
        scoreSessionTimer={scoreSessionTimer}
        sessionTimer={sessionTimer}
        permissionDeniedNotification={permissionDeniedNotification}
        showSubmissionsTab={showSubmissionsTab}
      />
      <SubmitScoreModal
        sessionTimer={sessionTimer}
        openSelectedContainerModal={showModal}
        abandon={abandon}
        maxPoints={maxPoints}
        containers={allProgressAndScored}
        isModalVisible={isSubmitModalVisible}
        setIsSubmitModalVisible={setIsSubmitModalVisible}
        hideModal={hideSubmitModal}
        onSubmit={onFinalSubmit}
      />
      <div className="judgesContentSubHeader mobileSubHeader">
        <Typography.Text className="judgesSessionTimer">
          <Image preview={false} src={loading} alt="" />
          <span className="judgesSessionTimerWrap">
            <span className="judgesSessionTimerSubtitle">Session Timer</span>
            <span className="judgesSessionTimerstatus">{`${sessionTimer}`}</span>
          </span>
        </Typography.Text>
        <div className="flex items-center">
          <div className="judgesSubHeaderAvatar">
            {/* <Popover
              placement="bottomRight"
              title={null}
              content={
                <></>
              }
              trigger={["click"]}
            >
              <Image preview={false} src={imgHead} alt="" />
            </Popover> */}
            <AppCustomPicker
              imgStyle={{ height: "3rem", width: "3rem", cursor: "pointer" }}
              emojiStyle={{ fontSize: "2.5rem", cursor: "pointer" }}
              className="tabset"
              popOverClass="m-5"
              tabpaneClass="m-5"
              onImageSelected={(e) => updateJudgeImage(e)}
              defaultValue={{
                type: judgeState.judge?.imageURL ? "LINK" : "EMOJI",
                url: judgeState.judge?.imageURL || "",
                emoji: judgeState.judge?.emojiObject || "",
              }}
              showClearButton={false}
            />
          </div>
          <Button
            className=""
            type="text"
            onClick={() => {
              if (judgeState.containers && judgeState.containers.length)
                dispatch(
                  updateRoundContainer({
                    containers: judgeState.containers,
                    callApi: true,
                  })
                );
              localStorage.removeItem("judgeState");
              localStorage.removeItem("containers");
              dispatch(updateJudge({ status: "LOGGED OUT" }));
              dispatch(logoutJudge());
              dispatch(clearJudgeState());
              pusherChannel.unsubscribe();
              router.replace(
                routeGenerator(
                  routes.judgeLogin,
                  {
                    competitionRoundCode: round?.competitionRoundCode,
                  },
                  true
                )
              );
            }}
          >
            Logout
          </Button>
        </div>
      </div>
      <div className="judgesContentSubHeader">
        <Typography.Text className="judgesSessionTimer">
          <Image preview={false} src={loading} alt="" />
          <span className="judgesSessionTimerWrap">
            <span className="judgesSessionTimerSubtitle">Session Timer</span>
            <span className="judgesSessionTimerstatus">{`${sessionTimer}`}</span>
          </span>
        </Typography.Text>
        <div className="judgesSubHeaderAvatar">
          <Image preview={false} src={imgHead} alt="" />
        </div>
        <div className="judgesContentSubHeaderSearch">
          <Button
            type="secondary"
            className="buttonjudge judgeMultipleDesktop judgeMultipleDesktop"
            disabled={
              selectedMultipleContainers.length === 1 ||
              (tabActive == "1" && inProgess.length < 2) ||
              (tabActive == "2" && scored.length < 2)
            }
            onClick={() => {
              if (selectMultiple && selectedMultipleContainers.length)
                setIsMultipleSelectModalVisible(true);
              else setSelectMultiple(!selectMultiple);
            }}
          >
            {selectMultiple
              ? selectedMultipleContainers.length
                ? selectedMultipleContainers.length === 1
                  ? `Select 1 more ${teamsOrParticipants.slice(0, -1)}`
                  : `Judge ${selectedMultipleContainers.length} ${teamsOrParticipants}`
                : "Cancel Multiple"
              : "Judge Multiple"}
          </Button>
          {selectMultiple && selectedMultipleContainers.length > 0 && (
            <Button
              type="secondary"
              className="buttonjudge judgeMultipleDesktop judgeMultipleDesktop"
              onClick={() => {
                setSelectedMultipleContainers([]);
                setSelectMultiple(false);
              }}
            >
              Cancel Multiple
            </Button>
          )}
          <div className="JudgingSearchForm">
            <input
              type="search"
              className="JudgingSearchFormInput"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            {search ? (
              <CrossIcon
                onClick={() => {
                  setSearch("");
                }}
              />
            ) : (
              <SearchIcon />
            )}
            {/* <FormField
              type={"text"}
              placeholder="Search Team Codes"
              prefix={}
            /> */}
          </div>
          {/* {!showSubmitMiddle && submitScoresButton()} */}
          {submitScoresButton()}
          {selectMultiple && selectedMultipleContainers.length && (
            <div className="judgeMultipleMobile">
              <div className="judgeMultipleMobileHolder">
                <Button
                  type="primary"
                  className="buttonjudge"
                  disabled={
                    selectedMultipleContainers.length === 1 ||
                    (tabActive == "1" && inProgess.length < 2) ||
                    (tabActive == "2" && scored.length < 2)
                  }
                  onClick={() => {
                    if (selectMultiple && selectedMultipleContainers.length)
                      setIsMultipleSelectModalVisible(true);
                    else setSelectMultiple(!selectMultiple);
                  }}
                >
                  {selectMultiple
                    ? selectedMultipleContainers.length
                      ? selectedMultipleContainers.length === 1
                        ? `Select 1 more ${teamsOrParticipants.slice(0, -1)}`
                        : `Judge ${selectedMultipleContainers.length} ${teamsOrParticipants}`
                      : "Cancel Multiple"
                    : "Judge Multiple"}
                </Button>
                <br />
                {selectMultiple && selectedMultipleContainers.length > 0 && (
                  <Button
                    type="default"
                    className="buttonjudge"
                    onClick={() => {
                      setSelectedMultipleContainers([]);
                      setSelectMultiple(false);
                    }}
                  >
                    Cancel <CrossIcon />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <Divider plain /> */}
      {/* Scored */}
      {search && search.length ? (
        <div className="judgesContentCardsScroller">
          <div className="judgesContentCardsHeader">
            <Typography.Text className="judgesContentCardsStatus">
              Results for {search}...
            </Typography.Text>
          </div>
          {/* In Progress */}
          <>
            {inProgess && !inProgess.length && scored && !scored.length ? (
              <div className="judgesContentPlaceholder">
                <Image
                  preview={false}
                  style={{ margin: "auto" }}
                  src={judgeEmptyState.SCORED}
                  alt=""
                />
                <div className="judgesContentPlaceholderText">
                  <Typography.Text>
                    {`No ${teamsOrParticipants} found`}
                  </Typography.Text>
                </div>
              </div>
            ) : (
              <Row
                gutter={[16]}
                // style={{ maxHeight: "500px", overflowY: "scroll" }}
              >
                {inProgess &&
                  inProgess.length > 0 &&
                  inProgess.map((container) => (
                    <Col
                      key={container.containerCode}
                      xs={12}
                      sm={8}
                      md={6}
                      xl={4}
                      xxl={3}
                      className="select-none my-3"
                      onClick={() => {
                        if (selectMultiple)
                          addMultipleSelectContainer(container);
                      }}
                      // onTouchStart={() => handleTouchStart(container)}
                      // onTouchEnd={handleTouchEnd}
                    >
                      <JudgingCard
                        selectMultiple={selectMultiple}
                        selectedMultipleContainers={selectedMultipleContainers}
                        maxPoints={maxPoints}
                        container={container}
                        showModal={showModal}
                      />
                    </Col>
                  ))}

                {scored &&
                  scored.length > 0 &&
                  scored.map((container) => (
                    <Col
                      key={container.containerCode}
                      xs={12}
                      sm={8}
                      md={6}
                      xl={4}
                      xxl={3}
                      className="select-none my-3"
                      onClick={() => {
                        if (selectMultiple)
                          addMultipleSelectContainer(container);
                      }}
                      // onTouchStart={() => handleTouchStart(container)}
                      // onTouchEnd={handleTouchEnd}
                    >
                      <JudgedCard
                        selectMultiple={selectMultiple}
                        curMaxPoints={curMaxPoints}
                        curMinPoints={curMinPoints}
                        selectedMultipleContainers={selectedMultipleContainers}
                        maxPoints={maxPoints}
                        container={container}
                        showModal={showModal}
                      />
                    </Col>
                  ))}
              </Row>
            )}
          </>
        </div>
      ) : selectMultiple ? (
        tabActive == "1" ? (
          inProgressContent()
        ) : (
          scoredContent()
        )
      ) : (
        <Tabs
          defaultActiveKey="1"
          tabPosition="top"
          // style={{ height: "auto" }}
          onChange={(key) => {
            setTabActive(key);
          }}
          tabBarStyle={{}}
          className={`${scrollPosition > 170 && "floating-tabs"}`}
        >
          <Tabs.TabPane
            clas
            tab={`In Progress ${inProgess.length}/${containers.length}`}
            key="1"
          >
            {inProgressContent()}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`Scored ${scored.length}/${containers.length}`}
            key="2"
          >
            {scoredContent()}
          </Tabs.TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default ScoringModule;
