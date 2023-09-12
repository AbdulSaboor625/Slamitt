import { Avatar, Button, Card, Collapse, Image, Tabs, Typography } from "antd";
import { useEffect, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import ContentEditable from "react-contenteditable";
import { useSelector } from "react-redux";
import useMediaQuery from "../../../hooks/useMediaQuery";
import {
  getCrewPermissions,
  titleCase,
  weightedScoreCalculator,
} from "../../../utility/common";
import { initialSliderEmojis } from "../../../utility/config";
import { ArrowLinkIcon, LikeSVGIcon } from "../../../utility/iconsLibrary";
import { unscored } from "../../../utility/imageConfig";
import AppNameAvater from "../../AppAvatar/AppNameAvater";
import ReadMore from "../../AppReadMore";
const { Panel } = Collapse;

const urls = initialSliderEmojis;
const untouchedState = null;

const JudgesFeedbackModule = ({
  round,
  participantSection = false,
  timelineSection = false,
  competition = null,
  showHeader,
  isDeleted,
  setActiveTabKey,
  fieldModified,
  container,
}) => {
  const { role } = useSelector((state) => state.auth.user);
  const userEmail = useSelector((state) => state.auth.user.email);
  const competitionDetails = useSelector((state) => state.competition.current);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const emojiPointsMapper = (points, assessmentCriteria) => {
    const total = round?.Round?.assessmentCriteria?.find(
      (d) => d.label === assessmentCriteria
    );

    if (points === untouchedState) return unscored;

    const pointsPercentage = Math.floor((points / total?.points) * 100);
    if (pointsPercentage >= 0 && pointsPercentage <= 19)
      return initialSliderEmojis[0];
    else if (pointsPercentage >= 20 && pointsPercentage <= 39)
      return initialSliderEmojis[1];
    else if (pointsPercentage >= 40 && pointsPercentage <= 59)
      return initialSliderEmojis[2];
    else if (pointsPercentage >= 60 && pointsPercentage <= 79)
      return initialSliderEmojis[3];
    else if (pointsPercentage >= 80 && pointsPercentage <= 100)
      return initialSliderEmojis[4];
  };

  const crewPermissions = getCrewPermissions(
    competitionDetails?.crew,
    userEmail
  );
  const manageScoring = crewPermissions && crewPermissions?.manageScoring;

  const EmojiSection = ({ assessment, roundCritera, Judge }) => (
    <>
      <ul className="roundStatsReactList">
        {assessment &&
          assessment.length &&
          assessment.map(({ label, points, endorse }) => {
            if (points == null)
              return (
                <div className="roundStatScoresPlaceholder">
                  <img
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1684254727706_scoreempty.png"
                    alt=""
                  />
                  <strong className="textPlaceholder">
                    {!participantSection
                      ? `${container
                          ?.split("-")
                          ?.shift()} was not scored for this Round`
                      : "You were not scored"}{" "}
                  </strong>
                </div>
              );
            else
              return (
                <li key={label}>
                  <Typography.Text className="roundStatsReactEmoji">
                    <Image
                      alt="scoreEmoji"
                      preview={false}
                      src={emojiPointsMapper(points, label)}
                      // src="https://rethink-competitions.s3.amazonaws.com/1667395415018_Group_3198.png"
                    />{" "}
                    {endorse && <LikeSVGIcon />}
                  </Typography.Text>
                  <div className="roundStatsReactTextbox">
                    <Typography.Text className="roundStatsReactSkill">
                      {label}
                    </Typography.Text>
                    {role !== "CREW"
                      ? (!participantSection ||
                          competition?.preferences?.roundScores) && (
                          <Typography.Text className="roundStatsReactNumber">
                            {`${points}/${roundCritera[label]} pts`}
                          </Typography.Text>
                        )
                      : manageScoring
                      ? (!participantSection ||
                          competition?.preferences?.roundScores) && (
                          <Typography.Text className="roundStatsReactNumber">
                            {`${points}/${roundCritera[label]} pts`}
                          </Typography.Text>
                        )
                      : null}
                  </div>
                </li>
              );
          })}
      </ul>
    </>
  );

  const [roundCritera, setRoundCriteria] = useState({});
  const allRounds = useSelector((state) => state.competition?.allRounds);
  const [judgesList, setJudgesList] = useState([]);
  useEffect(() => {
    const Judges = allRounds?.find(
      (item) => item?.roundCode === round?.roundCode
    );
    setJudgesList(Judges?.Judges);
  }, [allRounds]);

  const { roundScore, Round } = round;
  const isSubmittedByJudge =
    roundScore?.length > 0 &&
    roundScore?.filter(({ submit }) => submit === true).length;

  useEffect(() => {
    if (round && round?.Round && round?.Round?.assessmentCriteria) {
      const criteriaObj = {};
      round?.Round?.assessmentCriteria?.forEach(({ label, points }) => {
        criteriaObj[label] = points;
      });

      setRoundCriteria({ ...criteriaObj });
    }
  }, [round && round.Round && round.Round.assessmentCriteria]);

  const Judges = allRounds?.find(
    (item) => item?.roundCode === round?.roundCode
  );

  const totalWeightedScore = () => {
    return Number(
      weightedScoreCalculator(
        roundScore
          ?.filter(({ submit }) => submit === true)
          ?.map((r) => ({
            ...r,
            assessment: r.assessment.filter(({ points }) => points !== null),
          }))
          .filter((v) => v.assessment.length),
        participantSection && competitionDetails?.preferences?.roundWeightage
          ? Round?.roundWeightage
          : !participantSection
          ? Round?.roundWeightage
          : 100
      )
    );
  };
  const WeightedScore = () => {
    return competition?.preferences?.roundScores ? (
      <Typography.Text className="totalStatsBlockTitlePoints">
        <>
          <span className="totalPoints">
            {/* Weighted Avg. */}
            {Judges?.Judges?.length > 1
              ? competitionDetails?.preferences?.roundWeightage
                ? "Weighted Average"
                : "Total Average"
              : competitionDetails?.preferences?.roundWeightage
              ? "Weighted total"
              : "Total"}
            {round?.adjustedScore && (
              <Typography.Text className="extraPoints">
                {`${
                  round?.adjustedScore < 0
                    ? round?.adjustedScore
                    : `+${
                        (round?.adjustedScore * round?.Round?.roundWeightage) /
                        100
                      }`
                }`}
              </Typography.Text>
            )}
          </span>
          <div className="totalPointsText">
            {parseFloat(totalWeightedScore()) !== 0 ? (
              <>
                {parseFloat(
                  round?.adjustedScore
                    ? Number(
                        (round?.adjustedScore * round?.Round?.roundWeightage) /
                          100
                      ) + totalWeightedScore()
                    : totalWeightedScore()
                )}
                /{" "}
                <strong>
                  {((participantSection
                    ? competitionDetails?.preferences?.roundWeightage
                      ? Number(round?.Round?.roundWeightage) || 100
                      : 100
                    : Number(round?.Round?.roundWeightage)) *
                    Number(round?.Round?.totalPoints)) /
                    100}
                  {/* <sub>%</sub> */}{" "}
                </strong>
                <span className="pts">pts</span>
              </>
            ) : (
              "N/A"
            )}
            {/* {totalScoredPoints}/{totalPoints} pts */}
          </div>
        </>
      </Typography.Text>
    ) : (
      <></>
    );
  };

  if (!isSubmittedByJudge)
    return (
      <></>
      // <div className="competitionPlaceholderBlock">
      //   <Image
      //     preview={false}
      //     width={200}
      //     height={200}
      //     alt="thumbnail"
      //     src={CONTAINER_SCORING_EMPTY_STATE}
      //   />
      //   <Typography.Text>
      //     The participant {"hasn't"} been scored in any round
      //   </Typography.Text>
      // </div>
    );

  const RoundScoreDetails = ({
    assessment,
    roundCritera,
    feedback,
    notes,
    participantSection,
    screen,
    Judge,
  }) => {
    const handlePlayClick = (aud) => {
      const aa = new Audio(aud.audio);
      aa.play();
    };

    return (
      <div>
        <EmojiSection
          Judge={Judge}
          assessment={assessment}
          roundCritera={roundCritera}
        />
        {feedback && feedback.text && (
          <>
            {/* <Divider plain className="border-top-2 border-black" /> */}
            <div className="roundStatsBlockFeedback ">
              <div className="roundStatsBlockFeedbackTitle">
                <Image
                  preview={false}
                  alt="feedback image"
                  src={
                    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1667405583042_image_387.png"
                  }
                />
                <Typography.Text>Feedback</Typography.Text>
              </div>
              {feedback && feedback.audio && (
                <div className="feedbackAudioPlayer">
                  <ReactAudioPlayer
                    src={feedback.audio}
                    autoPlay={false}
                    controls
                  />
                  {/* <audio
                    // style={{
                    //   width: "80%",
                    //   display: "inline-block",
                    //   marginTop: "1rem",
                    // }}
                    src={feedback.audio}
                    controls
                    // className="no-time-display"
                  /> */}
                </div>
              )}
              <Typography.Paragraph className="roundStatsBlockText">
                <ReadMore>{feedback.text || ""}</ReadMore>
              </Typography.Paragraph>
            </div>
          </>
        )}
        {/* <button className="ant-btn ant-btn-primary" onClick={() => handlePlayClick(feedback)}>
          play voice
        </button> */}

        {!participantSection &&
          notes &&
          notes?.replaceAll("<li><br></li>", "") !== "" && (
            <>
              {/* <Divider plain className="border-top-2 border-black" /> */}
              <div className="roundStatsBlockFeedback">
                <div className="roundStatsBlockFeedbackTitle">
                  <Image
                    preview={false}
                    alt="feedback image"
                    style={{ maxWidth: "18px" }}
                    src={
                      "https://rethink-competitions.s3.amazonaws.com/1667492414987_notes.png"
                    }
                  />
                  <Typography.Text>Notes</Typography.Text>
                </div>
                <ContentEditable
                  //  innerRef={contentEditable}
                  html={notes?.replaceAll("<li><br></li>", "")}
                  // html={notes}
                  disabled={true}
                  // onChange={handleChange}
                  tagName="ul"
                />
              </div>
            </>
          )}
        {(!participantSection || competition?.preferences?.roundScores) &&
        (screen === "desktop" || screen === "mobile") &&
        role !== "CREW" ? (
          <div className="mobile-weighted-score hiddenMobile">
            <WeightedScore />
          </div>
        ) : manageScoring ? (
          <div className="mobile-weighted-score hiddenMobile">
            <WeightedScore />
          </div>
        ) : null}
      </div>
    );
  };

  // let showContainer = [];
  // roundScore?.forEach((v) => {
  //   showContainer = [
  //     ...showContainer,
  //     v?.assessment?.filter(({ points }) => points !== null),
  //   ];
  // });

  return (
    // !!showContainer.length &&
    // !!showContainer[0].length &&
    <Card className="roundStatsBlock">
      {showHeader && (
        <div className="participantDashboardScoresSubHeader">
          {/* {!isMobile && ( */}
          <>
            <div className="participantDashboardScoresSubHeaderwrapper">
              <div className="timelineScoreCardHeadTop">
                <div className="flex items-center space-x-3 participantDashboardScoresSubHeaderInfo">
                  <Avatar
                    src={
                      round?.Round?.imageURL &&
                      !round?.Round?.imageURL.includes("https://avataaars.io/")
                        ? round?.Round?.imageURL
                        : "https://rethink-competitions.s3.amazonaws.com/1665134509262_roundicon.png"
                    }
                  />
                  {}
                  <Typography.Text className="participantTimelineTitle">
                    {fieldModified?.[0] !== "roundWeightage"
                      ? !roundScore
                        ? isDeleted
                          ? `${round?.Round?.roundName} has been deleted`
                          : `You were not scored for ${round?.Round?.roundName}`
                        : `${round?.Round?.roundName} ${
                            fieldModified?.[0] === "adjustedScore"
                              ? "adjusted"
                              : ""
                          } scores have been updated`
                      : `${round?.Round?.roundName}'s Weightage have been updated`}
                  </Typography.Text>
                  {/* <Typography.Text className="participantDashboardRoundTitle">
                      {round?.Round?.roundName}
                    </Typography.Text> */}
                </div>
                {!isDeleted && (
                  <div className="participantTimelineBoxRight">
                    <Typography.Text className="participantTimelineBoxLink">
                      <span className="participantTimelineBoxLinkText">
                        View Scores{" "}
                      </span>
                      <Button
                        className="circleButton"
                        icon={<ArrowLinkIcon />}
                        onClick={() => setActiveTabKey("2")}
                      />
                    </Typography.Text>
                  </div>
                )}
              </div>
              {/* <div className="timelineScoreCardHeadBottom">
                <ul className="participantDashboardRoundStatus">
                  {competition?.preferences?.roundScores ? (
                    <li>
                      <Typography.Text className="participantDashboardRoundStatusText">
                        Max Points{" "}
                        <strong>
                          {round?.Round?.totalPoints || round?.Round?.maxPoints}
                          <sub>pts</sub>
                        </strong>
                      </Typography.Text>
                    </li>
                  ) : (
                    <div />
                  )}

                  {competition?.preferences?.roundWeightage ? (
                    <li>
                      <Typography.Text className="participantDashboardRoundStatusText">
                        Weightage{" "}
                        <strong>
                          {round?.Round?.roundWeightage}
                          <sub>%</sub>
                        </strong>
                      </Typography.Text>
                    </li>
                  ) : (
                    <div />
                  )}
                </ul>
              </div> */}
            </div>
          </>
          {/* // )} */}
        </div>
      )}
      {!showHeader && (
        <div className="roundStatsBlockTitle">
          {role === "CREW" ? (
            <div className="roundStatsParent">
              <Avatar
                src={
                  round?.Round?.imageURL &&
                  !round?.Round?.imageURL.includes("https://avataaars.io/")
                    ? round?.Round?.imageURL
                    : "https://rethink-competitions.s3.amazonaws.com/1665134509262_roundicon.png"
                }
              />
              <Typography.Title className="has-space">
                {titleCase(Round?.roundName)}{" "}
              </Typography.Title>
            </div>
          ) : (
            <div className="roundStatsParent">
              <Avatar
                src={
                  round?.Round?.imageURL &&
                  !round?.Round?.imageURL.includes("https://avataaars.io/")
                    ? round?.Round?.imageURL
                    : "https://rethink-competitions.s3.amazonaws.com/1665134509262_roundicon.png"
                }
              />

              <Typography.Title>
                {`${titleCase(Round?.roundName)}`}
              </Typography.Title>
            </div>
          )}
          {/* {role !== "CREW"
            ? (!participantSection ||
                competition?.preferences?.roundScores) && (
                <Typography.Title className="roundStatsBlockTitlePoints">
                  {Round?.roundWeightage}%
                </Typography.Title>
              )
            : manageScoring
            ? (!participantSection ||
                competition?.preferences?.roundScores) && (
                <Typography.Title className="roundStatsBlockTitlePoints">
                  {Round?.roundWeightage}%
                </Typography.Title>
              )
            : null} */}
        </div>
      )}
      {(participantSection && !timelineSection) || !participantSection ? (
        !isMobile ? (
          <>
            <div className="roundStatsScoringInfoWrapper">
              <div className="scoreJudgeTag">
                <div className="scoreJudgeIcon">
                  <img src="https://rethink-competitions.s3.amazonaws.com/1684838689671_image_363_1.png" />
                </div>
                <label>Judges</label>
              </div>
              <div className="roundStatsScoringInfo">
                <Typography.Text className="participantDashboardRoundStatusText">
                  Total Points{" "}
                  <strong>
                    {Round?.totalPoints}
                    <sub>pts</sub>
                  </strong>
                </Typography.Text>
                {role !== "CREW"
                  ? (!participantSection ||
                      competition?.preferences?.roundScores) && (
                      <Typography.Text className="participantDashboardRoundStatusText">
                        Weightage{" "}
                        <strong>
                          {Round?.roundWeightage}
                          <sub>%</sub>
                        </strong>
                      </Typography.Text>
                    )
                  : manageScoring
                  ? (!participantSection ||
                      competition?.preferences?.roundScores) && (
                      <Typography.Text className="participantDashboardRoundStatusText">
                        Weightage{" "}
                        <strong>
                          {Round?.roundWeightage}
                          <sub>%</sub>
                        </strong>
                      </Typography.Text>
                    )
                  : null}
              </div>
            </div>
            <Tabs tabPosition={"left"}>
              {roundScore &&
                roundScore.length &&
                roundScore.map(
                  ({
                    Judge,
                    judgeCode,
                    submit,
                    feedback,
                    assessment,
                    notes,
                  }) => {
                    console.log(
                      "🚀 ~ file: judgesFeedbackModule.js:541 ~ assessment:",
                      assessment
                    );
                    let totalJudgePoints = 0;
                    assessment.forEach(
                      ({ points }) => (totalJudgePoints += points)
                    );
                    // if (!submit || !assessment.find((v) => v.points !== null))
                    //   return null;
                    // else
                    return (
                      <Tabs.TabPane
                        key={judgeCode}
                        tab={
                          <>
                            <Typography.Text className="roundStatsName">
                              {Judge?.imageURL?.includes("media.licdn") ? (
                                <>
                                  <div className="avata-image-holder">
                                    {judgesList?.find(
                                      (item) => item?.judgeCode == judgeCode
                                    )?.verified && (
                                      <Avatar
                                        className="likedin-icon"
                                        src={
                                          "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1684869022533_Vector.svg"
                                        }
                                        alt="img"
                                      />
                                    )}
                                    <Avatar src={Judge?.imageURL} alt="img" />
                                  </div>
                                </>
                              ) : (
                                <>
                                  {judgesList?.find(
                                    (item) => item?.judgeCode === judgeCode
                                  )?.verified && (
                                    <Avatar
                                      src={
                                        "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1681843182047_linkedinin.svg"
                                      }
                                      alt="img"
                                    />
                                  )}
                                  <AppNameAvater
                                    user={{
                                      firstName: Judge?.firstName,
                                      lastName: Judge?.lastName,
                                    }}
                                  />
                                </>
                              )}

                              {`${Judge?.firstName} ${
                                Judge?.lastName ? Judge?.lastName : ""
                              }`}
                            </Typography.Text>
                            {role !== "CREW"
                              ? (!participantSection ||
                                  competition?.preferences?.roundScores) && (
                                  <Typography.Text className="roundStatsPoints">
                                    {totalJudgePoints !== 0
                                      ? `${totalJudgePoints} pts`
                                      : "N/A"}
                                  </Typography.Text>
                                )
                              : manageScoring
                              ? (!participantSection ||
                                  competition?.preferences?.roundScores) && (
                                  <Typography.Text className="roundStatsPoints">
                                    {totalJudgePoints !== 0
                                      ? `${totalJudgePoints} pts`
                                      : "N/A"}
                                  </Typography.Text>
                                )
                              : null}
                          </>
                        }
                      >
                        <RoundScoreDetails
                          assessment={assessment}
                          feedback={feedback}
                          notes={notes}
                          participantSection={participantSection}
                          roundCritera={roundCritera}
                          screen={"desktop"}
                          Judge={Judge}
                        />
                      </Tabs.TabPane>
                    );
                  }
                )}
            </Tabs>
          </>
        ) : (
          <div className="participantDashboardScoresAccordion">
            <div className="participantDashboardScoresAccordionTotal">
              <div className="mobile-weighted-score">
                {competition?.preferences?.roundScores && <WeightedScore />}
              </div>
            </div>
            {/* <Collapse defaultActiveKey={0}> */}
            {competition?.preferences?.roundScores && (
              <Collapse>
                {roundScore &&
                  roundScore.length &&
                  roundScore.map(
                    (
                      { Judge, judgeCode, submit, feedback, assessment, notes },
                      i
                    ) => {
                      let totalJudgePoints = 0;
                      assessment.forEach(
                        ({ points }) => (totalJudgePoints += points)
                      );

                      if (!submit || !assessment.find((v) => v.points !== null))
                        return null;
                      else
                        return (
                          <Panel
                            key={i}
                            header={
                              <>
                                <Typography.Text className="roundStatsName">
                                  <AppNameAvater
                                    user={{
                                      firstName: Judge?.firstName,
                                      lastName: Judge?.lastName,
                                    }}
                                  />
                                  <div className="roundStatsTextbox">
                                    <span className="roundStatsNameTitle">
                                      {`${Judge?.firstName} ${
                                        Judge?.lastName ? Judge?.lastName : ""
                                      }`}
                                    </span>
                                    {role !== "CREW"
                                      ? (!participantSection ||
                                          competition?.preferences
                                            ?.roundScores) && (
                                          <Typography.Text className="roundStatsPoints">
                                            {totalJudgePoints} pts
                                          </Typography.Text>
                                        )
                                      : manageScoring
                                      ? (!participantSection ||
                                          competition?.preferences
                                            ?.roundScores) && (
                                          <Typography.Text className="roundStatsPoints">
                                            {totalJudgePoints} pts
                                          </Typography.Text>
                                        )
                                      : null}
                                  </div>
                                </Typography.Text>
                                <div className="hiddenMobile">
                                  {role !== "CREW"
                                    ? (!participantSection ||
                                        competition?.preferences
                                          ?.roundScores) && (
                                        <Typography.Text className="roundStatsPoints">
                                          {totalJudgePoints} pts
                                        </Typography.Text>
                                      )
                                    : manageScoring
                                    ? (!participantSection ||
                                        competition?.preferences
                                          ?.roundScores) && (
                                        <Typography.Text className="roundStatsPoints">
                                          {totalJudgePoints} pts
                                        </Typography.Text>
                                      )
                                    : null}
                                </div>
                              </>
                            }
                          >
                            <RoundScoreDetails
                              assessment={assessment}
                              feedback={feedback}
                              notes={notes}
                              participantSection={participantSection}
                              roundCritera={roundCritera}
                              screen={"mobile"}
                            />
                          </Panel>
                        );
                    }
                  )}
              </Collapse>
            )}
          </div>
        )
      ) : null}
    </Card>
  );
};

export default JudgesFeedbackModule;
