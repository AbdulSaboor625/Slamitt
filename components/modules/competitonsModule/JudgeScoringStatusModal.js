import { Avatar, Button, Card, Col, Input, Modal, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllContainers, getAllRounds, notify } from "../../../Redux/Actions";
import Api from "../../../services";
import { socketEvents } from "../../../utility/config";
import { DoubleDoneIcon, MessageIcon } from "../../../utility/iconsLibrary";
const JudgeScoringStatusModal = ({
  readOnlyState,
  pusherChannel,
  isVisible = true,
  setVisibility,
  judges,
  judgeCode,
  judgeStatus,
  getAllJudges,
  role,
  manageScoring,
}) => {
  const { details } = useSelector((state) => state.competition.round);
  const dispatch = useDispatch();
  // const [scoredContainers, setScoredContainers] = useState([]);
  const [unScoredContainers, setUnScoredContainers] = useState(0);
  const [aggregateScore, setAggregateScore] = useState({
    curMinPoints: 0,
    curMaxPoints: 0,
    curAvgPoints: 0,
  });
  const [containers, setContainers] = useState([]);
  const [showConfirmScoreReleaseModal, setShowConfirmScoreReleaseModal] =
    useState(false);
  useEffect(() => {
    if (judgeCode) getContainers(judgeCode);
  }, [judgeCode]);

  const assessmentCriteria = details?.assessmentCriteria || [];
  let maxPoints = 0;
  assessmentCriteria.forEach(({ points }) => (maxPoints += points));

  useEffect(() => {
    if (pusherChannel) {
      pusherChannel.bind("receive_message", (payload) => {
        if (
          payload &&
          payload.event === socketEvents.round_score_update &&
          details?.competitionRoundCode === payload.competitionRoundCode
        ) {
          getContainers(payload.judgeCode || judgeCode);
        }
      });
    }
  }, [pusherChannel]);

  const [judge, setJudge] = useState();
  useEffect(() => {
    setJudge(judges.find((j) => j.judgeCode === judgeCode));
  }, [judges, judgeCode]);

  const getContainers = async (judgeCode) => {
    let curMinPoints = maxPoints;
    let curMaxPoints = 0;
    let total = 0;
    const response = await Api.get(
      `/container/${details.competitionCode}-${details.assignedRoomCode}`
    );
    if (response?.code && response?.result) {
      const temp = response?.result.map((item) => {
        const roundData = item.roundData.find(
          (rnd) => rnd?.roundCode === details?.roundCode
        );
        if (roundData) {
          const judgeScores = roundData?.roundScore?.find(
            (rndScore) => rndScore?.judgeCode === judgeCode
          );

          if (
            judgeScores &&
            !judgeScores?.assessment?.find((v) => v?.points === null)
          )
            item.scored = true;
          else item.scored = false;
        } else item.scored = false;

        return item;
      });
      // setScoredContainers(temp);
      const scored = temp.filter((item) => item?.scored);
      const unScored = temp.filter((item) => !item?.scored);
      [...unScored, ...scored].forEach((container) => {
        const roundData = container?.roundData.find(
          (rnd) => rnd.roundCode === details.roundCode
        );
        roundData?.roundScore?.forEach((rndScore) => {
          if (rndScore?.judgeCode === judgeCode) {
            let pointsCur = 0;
            rndScore?.assessment?.forEach(
              ({ points }) => (pointsCur += points)
            );
            container.judgedPoints = pointsCur;
            container.judgeFeedback = rndScore.feedback;
          }
        });
      });
      setContainers(
        [...scored, ...unScored].sort((a, b) => b.judgedPoints - a.judgedPoints)
      );
      setUnScoredContainers(unScored.length);
      if (scored.length) {
        scored.forEach((container) => {
          container.roundData
            .find((rnd) => rnd?.roundCode === details?.roundCode)
            .roundScore?.forEach((rndScore) => {
              if (rndScore?.judgeCode === judgeCode) {
                let pointsCur = 0;
                rndScore?.assessment.forEach(
                  ({ points }) => (pointsCur += points)
                );
                if (pointsCur < curMinPoints) curMinPoints = pointsCur;
                if (pointsCur > curMaxPoints) curMaxPoints = pointsCur;
                total += pointsCur;
              }
            });
        });
      }
      setAggregateScore({
        curMinPoints: scored?.length ? curMinPoints : 0,
        curMaxPoints,
        curAvgPoints: scored.length ? (total / scored.length).toFixed(2) : 0,
      });
    }
  };
  const releaseScores = async () => {
    try {
      const response = await Api.get(
        `/round/release/${details.competitionRoundCode}/${judgeCode}`
      );
      if (response.code) {
        setVisibility(false);
        dispatch(getAllRounds({}));
        // setShowConfirmScoreReleaseModal(false);
        dispatch(
          notify({
            type: "success",
            message: "Scores released successfully",
          })
        );
        getAllJudges();
        dispatch(getAllContainers());
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(
        notify({
          type: "error",
          message: error.message,
        })
      );
    }
  };

  const JudgeCard = ({
    emojiObject,
    containerName,
    imageURL,
    container,
    role,
    manageScoring,
  }) => {
    const [scoredPoints, setScoredPoints] = useState(0);
    const [feedback, setFeedback] = useState({});
    useEffect(() => {
      // const roundData = container?.roundData.find(
      //   (rnd) => rnd.roundCode === details.roundCode
      // );
      // roundData?.roundScore?.forEach((rndScore) => {
      //   if (rndScore?.judgeCode === judgeCode) {
      //     let pointsCur = 0;
      //     rndScore?.assessment?.forEach(({ points }) => (pointsCur += points));
      //     setScoredPoints(pointsCur);
      //     setFeedback(rndScore?.feedback);
      //   }
      // });
      setScoredPoints(container.judgedPoints);
      setFeedback(container.judgeFeedback);
    }, [container]);
    const avatarClass =
      scoredPoints === aggregateScore?.curMaxPoints && scoredPoints !== 0
        ? "crownEmoji"
        : scoredPoints === aggregateScore?.curMinPoints && scoredPoints !== 0
        ? "poopEmoji"
        : "";
    const cardAction = [];
    // if (!endorsements && !feedback.audio && feedback.text) {
    //   cardAction.push(
    //     <Button
    //       className="inactiveFeedback"
    //       style={{
    //         border: "none",
    //       }}
    //     >
    //       <MessageIcon key="feedback" />
    //     </Button>
    //   );
    // } else {
    //   if (endorsements) {
    //     cardAction.push(
    //       <Button
    //         style={{
    //           border: "none",
    //           fontWeight: "bold",
    //         }}
    //       >
    //         <LikeSVGIcon key="endorse" className="likeIcon" />{" "}
    //         {endorsements ? endorsements : ""}
    //       </Button>
    //     );
    //   }

    if (feedback?.text || feedback?.audio) {
      cardAction.push(
        <Button
          style={{
            border: "none",
          }}
        >
          <MessageIcon key="feedback" />
        </Button>
      );
    }

    return (
      <Card
        className={`judgesCard ${
          container.scored ? "scoredCard" : ""
        } ${avatarClass}`}
        actions={cardAction}
        style={{ border: "none" }}
        key="1"
      >
        {emojiObject ? (
          <p className="judgesCardEmoji">{emojiObject.emoji}</p>
        ) : (
          <Avatar src={imageURL} />
        )}
        <Typography.Title
          className="judgesCardSubtitle"
          style={{ margin: "0" }}
          level={5}
        >
          {containerName}
        </Typography.Title>
        {scoredPoints ? (
          role === "CREW" ? (
            manageScoring ? (
              <Typography.Text
                className="judgesCardSubtext"
                style={{ margin: "0" }}
              >
                <strong>{scoredPoints}</strong>
                <span>/{maxPoints}</span>
              </Typography.Text>
            ) : null
          ) : (
            <Typography.Text
              className="judgesCardSubtext"
              style={{ margin: "0" }}
            >
              <strong>{scoredPoints}</strong>
              <span>/{maxPoints}</span>
            </Typography.Text>
          )
        ) : (
          <Typography.Text
            className="judgesCardSubtext"
            style={{ margin: "0" }}
          >
            <strong>N</strong>
            <span>/A</span>
          </Typography.Text>
        )}
      </Card>
    );
  };

  const ConfirmReleaseScoreModal = ({ isModalVisible, hideModal }) => {
    const [value, setValue] = useState("");
    return (
      <Modal
        className="deleteScoreModal"
        // closable={false}
        visible={isModalVisible}
        // onOk={hideModal}
        onCancel={hideModal}
        footer={null}
        style={{ borderRadius: "20px" }}
        afterClose={() => setValue("")}
      >
        <Row justify="center">
          <Col span={24}>
            <Typography.Title className="deleteScoreModalTitle">
              Are you sure?
            </Typography.Title>
            <Typography.Text className="deleteScoreModalText">
              All the scores will be released immediately.
            </Typography.Text>
          </Col>
          <Col className="mt-5">
            <Typography.Text className="deleteScoreModalText">
              Type RELEASE to confirm
            </Typography.Text>
            <div className="deleteScoreModalFooterField">
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                style={{ height: "2.5rem" }}
                size="small"
                placeholder="RELEASE"
                suffix={
                  <>
                    <Button
                      // className={
                      //   value.toLowerCase() == "RELEASE"
                      //     ? "deleteContainerButton"
                      //     : ""
                      // }
                      type="primary"
                      disabled={value.toLowerCase() !== "release"}
                      onClick={() => {
                        if (value.toLowerCase() === "release") {
                          releaseScores();
                          setValue("");
                          hideModal();
                        }
                      }}
                    >
                      RELEASE
                    </Button>
                    <Button onClick={hideModal} type="primary">
                      Cancel
                    </Button>
                  </>
                }
              />
            </div>
          </Col>
        </Row>
      </Modal>
    );
  };

  const ModalHeader = () => {
    return (
      <div className="judgeReleaseModalHeader">
        <div className="judgeReleaseModalCounter">
          <div className="judgesContentHeaderScoringCol">
            <Typography.Title>{aggregateScore.curAvgPoints}</Typography.Title>
            <Typography.Text>Avg Score</Typography.Text>
          </div>
          <div className="judgesContentHeaderScoringCol">
            <Typography.Title>{aggregateScore.curMaxPoints}</Typography.Title>
            <Typography.Text>Highest</Typography.Text>
          </div>
          <div className="judgesContentHeaderScoringCol">
            <Typography.Title>{aggregateScore.curMinPoints}</Typography.Title>
            <Typography.Text>Lowest</Typography.Text>
          </div>
        </div>
        {!readOnlyState &&
        judge?.status !== "JUDGED" &&
        judge?.status !== "ABANDONED" &&
        role !== "CREW" ? (
          <Button
            type="primary"
            onClick={() => setShowConfirmScoreReleaseModal(true)}
          >
            RELEASE SCORES
          </Button>
        ) : (
          <>
            {!readOnlyState &&
            manageScoring &&
            judge?.status !== "JUDGED" &&
            judge?.status !== "ABANDONED" ? (
              <Button
                type="primary"
                onClick={() => setShowConfirmScoreReleaseModal(true)}
              >
                RELEASE SCORES
              </Button>
            ) : null}
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <Modal
        className="judgeReleaseModal"
        visible={isVisible}
        onCancel={() => setVisibility(false)}
        footer={null}
      >
        {role === "CREW" ? (
          manageScoring ? (
            <ModalHeader />
          ) : null
        ) : (
          <ModalHeader />
        )}
        {/* <hr /> */}
        <div className="judgeReleaseModalSubHeader">
          {unScoredContainers > 0 && judge?.status !== "JUDGED" ? (
            <span className="scoringStatus">
              <Typography.Text className="number">
                {unScoredContainers}
              </Typography.Text>
              <Typography.Text>participants are left to Score</Typography.Text>
            </span>
          ) : (
            <span className="scoringStatus">
              {judge?.status === "JUDGED" ? (
                <>
                  <DoubleDoneIcon />
                  <Typography.Text>
                    {(judge?.firstName && judge?.firstName) +
                      " " +
                      (judge?.lastName && judge?.lastName)}{" "}
                    has released their scores for this round
                  </Typography.Text>
                </>
              ) : (
                <Typography.Text>
                  All participants have been Scored
                </Typography.Text>
              )}
            </span>
          )}
          {/* <Typography.Text className="judgesSessionTimer">
          <Image preview={false} src={loading} alt="" height={50} width={50} />
          <span className="judgesSessionTimerWrap">
          <span className="judgesSessionTimerSubtitle">Session Timer </span>
          <span className="judgesSessionTimerstatus">{`00:30:00`}</span>
          </span>
        </Typography.Text> */}
        </div>
        <ul className="judgeReleaseModalCards">
          {containers.map((container) => (
            <li key={container.containerCode}>
              <JudgeCard
                key={container.containerCode}
                emojiObject={container.emojiObject}
                containerName={container.containerName}
                imageURL={container.imageURL}
                container={container}
                role={role}
                manageScoring={manageScoring}
              />
            </li>
          ))}
        </ul>
      </Modal>
      <ConfirmReleaseScoreModal
        isModalVisible={showConfirmScoreReleaseModal}
        hideModal={() => setShowConfirmScoreReleaseModal(false)}
      />
    </>
  );
};

export default JudgeScoringStatusModal;
