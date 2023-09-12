import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Image, Tooltip, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Api from "../../../../services";
import {
  ArrowCircleIcon,
  ArrowDwnIcon,
  ArrowLinkIcon,
  ArrowUpIcon,
  CrossIcon,
  DoubleDoneIcon,
  DoubleDoneThinIcon,
} from "../../../../utility/iconsLibrary";
import { abandonFlag, concludeFlag } from "../../../../utility/imageConfig";
import JudgesFeedbackModule from "../../competitonsModule/judgesFeedbackModule";
import MockRoundFeedbackModule from "../../competitonsModule/mockRoundFeedbackModule";
import AppNameAvater from "../../../AppAvatar/AppNameAvater";

const ScoringUpdate = ({ timelineEvent, setActiveTabKey, competition }) => {
  const {
    fieldModified,
    round,
    roundScore,
    isDeleted,
    adjustedScore = 0,
  } = timelineEvent?.data;
  return (
    <div
      className={`participantTimelineGroup ${
        !roundScore ? (isDeleted ? `roundDeleted` : ``) : ``
      }`}
    >
      <div className="participantTimelineBlock">
        <strong className="time">
          {moment(timelineEvent?.updatedAt).format("LT")}
        </strong>
        <div
          className={`participantTimelineBox
          ${!roundScore ? (isDeleted ? `roundDeleted` : ``) : ``}
          `}
        >
          <div className={`${!isDeleted ? "timelineScoreCardBlock" : ""}`}>
            {isDeleted && (
              <div className="participantTimelineBoxLeft flex items-center space-x-3">
                <div className="deleteIcon">
                  <Avatar src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1678735382829_image_403.png" />
                </div>
                <Avatar
                  src={
                    round?.imageURL &&
                    !round?.imageURL.includes("https://avataaars.io/")
                      ? round?.imageURL
                      : "https://rethink-competitions.s3.amazonaws.com/1665134509262_roundicon.png"
                  }
                />
                <Typography.Text className="participantTimelineTitle">
                  {round.roundName} has been Deleted
                </Typography.Text>
              </div>
            )}
            {!isDeleted ? (
              round?.type === "MOCK" ? (
                <MockRoundFeedbackModule
                  round={{ Round: round, roundScore }}
                  isRoundWeightageVisible={
                    competition?.preferences?.roundWeightage
                  }
                  isRoundScoresVisible={competition?.preferences?.roundScores}
                  isDeleted={isDeleted}
                  setActiveTabKey={setActiveTabKey}
                  participantSection={true}
                  timelineSection={true}
                  container={timelineEvent.containerCode}
                  competition={competition}
                />
              ) : (
                <>
                  <JudgesFeedbackModule
                    isDeleted={isDeleted}
                    round={{ Round: round, roundScore, adjustedScore }}
                    competition={competition}
                    participantSection={true}
                    timelineSection={true}
                    fieldModified={fieldModified}
                    showHeader={true}
                    setActiveTabKey={setActiveTabKey}
                    container={timelineEvent.containerCode}
                  />
                </>
              )
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const WeightageUpdate = ({ timelineEvent, setActiveTabKey, competition }) => {
  const {
    fieldModified,
    round,
    roundScore,
    isDeleted,
    adjustedScore = 0,
    weightages,
  } = timelineEvent?.data;
  return (
    <div
      className={`participantTimelineGroup ${
        !roundScore ? (isDeleted ? `roundDeleted` : ``) : ``
      }`}
    >
      <div className="participantTimelineBlock">
        <strong className="time">
          {moment(timelineEvent?.updatedAt).format("LT")}
        </strong>
        <div
          className={`participantTimelineBox
          ${!roundScore ? (isDeleted ? `roundDeleted` : ``) : ``}
          `}
        >
          <div className="timelineScoreCardBlock timelineScoreStatus">
            <div className="participantDashboardScoresSubHeader">
              <div className="participantDashboardScoresSubHeaderwrapper">
                <div className="timelineScoreCardHeadTop">
                  <div className="flex items-center space-x-3 participantDashboardScoresSubHeaderInfo">
                    <Avatar
                      src="https://rethink-competitions.s3.amazonaws.com/1665134509262_roundicon.png"
                      alt=""
                    />
                    <Typography.Text className="participantTimelineTitle">
                      {`${round?.roundName}'s Weightage have been updated`}
                    </Typography.Text>
                  </div>
                </div>
              </div>
            </div>
            <div className="timelineScoreStatusScores">
              <div className="timelineScoreStatusOld">
                <span className="oldTag">Previously</span>
                Weightage{" "}
                <span className="points">{weightages?.oldWeightage}</span>%
              </div>
              <ArrowCircleIcon className="timelineScoreStatusArrow" />
              <div className="timelineScoreStatusNew">
                <span className="newTag">Currently</span>
                Weightage{" "}
                <span className="points">{weightages?.newWeightage}</span>%
              </div>
            </div>
          </div>
          {/* <div className="timelineScoreCardBlock">
            {round?.type === "MOCK" ? (
              <MockRoundFeedbackModule
                round={{ Round: round, roundScore }}
                isRoundWeightageVisible={
                  competition?.preferences?.roundWeightage
                }
                isRoundScoresVisible={competition?.preferences?.roundScores}
                isDeleted={isDeleted}
                setActiveTabKey={setActiveTabKey}
                participantSection={true}
                container={timelineEvent.containerCode}
                competition={competition}
                fieldModified={fieldModified}
              />
            ) : (
              <>
                <JudgesFeedbackModule
                  isDeleted={isDeleted}
                  round={{ Round: round, roundScore, adjustedScore }}
                  competition={competition}
                  participantSection={true}
                  timelineSection={true}
                  showHeader={true}
                  setActiveTabKey={setActiveTabKey}
                  fieldModified={fieldModified}
                  container={timelineEvent.containerCode}
                />
              </>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

const RoundUpdate = ({ timelineEvent, setActiveTabKey, competition }) => {
  const { round, fieldModified, roundScore, isDeleted } = timelineEvent?.data;
  const [messages, setMessages] = useState("");
  useEffect(() => {
    if (fieldModified && fieldModified.length) generateMessage();
  }, [fieldModified]);
  const generateMessage = () => {
    fieldModified.forEach((field) => {
      if (field === "roundWeightage")
        setMessages(`Round ${round?.roundName}'s weightage have been updated`);
    });
  };
  return round?.Competition?.preferences?.roundWeightage ? (
    <div className="participantTimelineGroup">
      <div className="participantTimelineBlock">
        <strong className="time">
          {moment(timelineEvent?.updatedAt).format("LT")}
        </strong>
        <div
          className={`participantTimelineBox ${
            !roundScore ? (isDeleted ? `roundDeleted` : ``) : ``
          }`}
        >
          <div className="participantTimelineBoxLeft flex items-center space-x-3">
            <div className="deleteIcon">
              <Avatar src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1678735382829_image_403.png" />
            </div>
            <Avatar
              src={
                round?.imageURL &&
                !round?.imageURL.includes("https://avataaars.io/")
                  ? round?.imageURL
                  : "https://rethink-competitions.s3.amazonaws.com/1665134509262_roundicon.png"
              }
            />
            <Typography.Text className="participantTimelineTitle">
              {messages}
            </Typography.Text>
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
          <div className={`participantTimelineBoxRight roundDeletedText`}>
            <span className="">Contact the organiser for details</span>
          </div>
        </div>
      </div>
      {/* <div className="participantTimelineBlock">
        {round?.type === "MOCK" ? (
          <MockRoundFeedbackModule
            round={{ Round: round, roundScore }}
            isRoundWeightageVisible={competition?.preferences?.roundWeightage}
            isRoundScoresVisible={competition?.preferences?.roundScores}
            isDeleted={isDeleted}
            setActiveTabKey={setActiveTabKey}
            participantSection={true}
            container={timelineEvent.containerCode}
            competition={competition}
          />
        ) : (
          <JudgesFeedbackModule
            isDeleted={isDeleted}
            round={{ Round: round, roundScore }}
            competition={competition}
            participantSection={true}
            timelineSection={true}
            showHeader={true}
            setActiveTabKey={setActiveTabKey}
            container={timelineEvent.containerCode}
          />
        )}
      </div> */}
    </div>
  ) : (
    <></>
  );
};

const SubmissionUpdate = ({
  timelineEvent,
  setActiveTabKey,
  setSubmissionSelected,
  competition,
}) => {
  const SUBMISSION_EVENT_TYPES = Object.freeze({
    ADDED: "ADDED",
    REMOVED: "REMOVED",
    UPDATED: "UPDATED",
    OPENED: "OPENED",
    CLOSED: "CLOSED",
  });
  const {
    round,
    submissions,
    eventType,
    message = "",
    user,
  } = timelineEvent?.data;
  const [status, setStatus] = React.useState("");

  useEffect(() => {
    if (round?.allowParticipantsForSubmission) {
      if (
        round?.submissionsSettings?.lockedContainerCodes?.includes(
          timelineEvent?.containerCode
        )
      ) {
        setStatus("LOCKED");
      } else {
        setStatus("UNLOCKED");
      }
    } else {
      setStatus("");
    }
  }, [timelineEvent]);

  const getMessageForSubmisions = (eventType, user, round) => {
    switch (eventType) {
      case SUBMISSION_EVENT_TYPES.ADDED:
        return (
          <div>
            Submissions for {round?.roundName} has been Updated
            {user &&
              (round?.Competition?.competitionType === "TEAM" ||
                competition?.createdBy === user?.userCode) && (
                <>
                  {" "}
                  by{" "}
                  {competition?.createdBy !== user?.userCode ? (
                    <>
                      {user?.imageURL ? (
                        <Avatar src={user?.imageURL} />
                      ) : (
                        <AppNameAvater
                          user={{
                            firstName: user?.fName,
                            lastName: user?.lName,
                          }}
                        />
                      )}{" "}
                      {user?.fName} {user?.lName}
                    </>
                  ) : (
                    "Organiser"
                  )}
                </>
              )}
          </div>
        );
      case SUBMISSION_EVENT_TYPES.UPDATED:
        return (
          <div>
            {user ? "Submissions" : "Tasks"} for {round?.roundName} has been
            Updated
            {user &&
              round?.Competition?.competitionType === "TEAM" &&
              (round?.Competition?.competitionType === "TEAM" ||
                competition?.createdBy === user?.userCode) && (
                <>
                  {" "}
                  by{" "}
                  {competition?.createdBy !== user?.userCode ? (
                    <>
                      {user?.imageURL ? (
                        <Avatar src={user?.imageURL} />
                      ) : (
                        <AppNameAvater
                          user={{
                            firstName: user?.fName,
                            lastName: user?.lName,
                          }}
                        />
                      )}{" "}
                      {user?.fName} {user?.lName}
                    </>
                  ) : (
                    "Organiser"
                  )}
                </>
              )}
          </div>
        );
      case SUBMISSION_EVENT_TYPES.REMOVED:
        return (
          <div>
            Tasks for {round?.roundName} has been Updated{" "}
            {user &&
              round?.Competition?.competitionType === "TEAM" &&
              competition?.createdBy === user?.userCode && (
                <>
                  {" "}
                  by{" "}
                  {competition?.createdBy !== user?.userCode ? (
                    <>
                      {user?.imageURL ? (
                        <Avatar src={user?.imageURL} />
                      ) : (
                        <AppNameAvater
                          user={{
                            firstName: user?.fName,
                            lastName: user?.lName,
                          }}
                        />
                      )}{" "}
                      {user?.fName} {user?.lName}
                    </>
                  ) : (
                    "Organiser"
                  )}
                </>
              )}
          </div>
        );
      case SUBMISSION_EVENT_TYPES.OPENED:
        return `A new submission request has been raised for ${round?.roundName}`;
      case SUBMISSION_EVENT_TYPES.CLOSED:
        return `Tasks for ${round?.roundName} has been Closed`;
      default:
        return `Tasks for ${round?.roundName} has been Updated`;
    }
  };

  return (
    <div className="participantTimelineGroup">
      <div className="participantTimelineBlock">
        <strong className="time">{`${moment(timelineEvent?.createdAt).format(
          "LT"
        )}`}</strong>
        <div className="participantTimelineBox timelineSubmissions">
          <div className="participantTimelineBoxLeft flex items-center space-x-3">
            <Avatar
              src={
                round?.imageURL &&
                !round?.imageURL.includes("https://avataaars.io/")
                  ? round?.imageURL
                  : "https://rethink-competitions.s3.amazonaws.com/1665134509262_roundicon.png"
              }
            />
            <Typography.Text className="participantTimelineTitle">
              {getMessageForSubmisions(eventType, user, round)}
            </Typography.Text>
          </div>
          <div className="participantTimelineBoxRight">
            {/* <Button
        className="circleButton"
        onClick={() =>
          setShowUploadModal({ file: true, link: false })
        }
        icon={<UploadIcon className="upload" />}
      />
      <Button className="circleButton" icon={<LinkIcon />} /> */}
            <Typography.Text className="participantTimelineBoxLink">
              <a
                className="participantTimelineBoxAnchor"
                href={`#${round?.competitionRoundCode}`}
              >
                <span
                  onClick={() => setActiveTabKey("3")}
                  className="participantTimelineBoxLinkText submissionsButton"
                >
                  {status === "LOCKED"
                    ? "Preview Guidelines"
                    : status === "UNLOCKED"
                    ? "Upload Submissions"
                    : "Preview Submissions"}
                </span>
                <Button
                  className="circleButton"
                  icon={<ArrowLinkIcon />}
                  onClick={() => {
                    setActiveTabKey("3");
                    setSubmissionSelected(round.roundCode);
                  }}
                />
              </a>
            </Typography.Text>
          </div>
        </div>
      </div>
      {/* <div className="participantTimelineBlock">
        <div className="participantTimelineBox">
          <div className="participantTimelineLinks">
            {submissions && submissions.length > 0
              ? submissions[0]?.submissions.map((submission, i) => (
                  <div key={i} className="participantTimelineLink">
                    <Tooltip
                      placement="top"
                      title={
                        submission.type === "LINK"
                          ? submission.url
                          : submission.fileName
                      }
                      color={"geekblue"}
                    >
                      <a
                        rel="noreferrer"
                        href={submission.url}
                        target="_blank"
                        className="submissionLinkButton"
                      >
                        {submission.type === "LINK" ? (
                          <LinkIcon className="submissionLinkIcon" />
                        ) : (
                          <FileNewIcon className="submissionFileIcon" />
                        )}
                        <span className="submissionLinkWrap">
                          {submission.type === "LINK"
                            ? submission.url
                            : submission.fileName}
                        </span>
                      </a>
                    </Tooltip>
                  </div>
                  // <a href={"#"} key={i} target="iframe_a">
                  //   <Button className="participantTimelineLink">
                  //     <LinkIcon key={i} />
                  //     <span className="text">www.google.com</span>
                  //   </Button>
                  // </a>
                ))
              : ""}
          </div>
        </div>
      </div> */}
    </div>
  );
};

const CompettitionUpdate = ({ container, competition, allContainers }) => {
  const { user } = useSelector((state) => state.auth);
  const [profileUpdateText, setProfileUpdateText] = useState("");
  useEffect(() => {
    if (competition?.status === "CONCLUDED") {
      getProfileUpdationStatus(
        competition?.competitionCode,
        user?.userCode,
        container?.containerCode
      );
    }
  }, [competition]);

  const getProfileUpdationStatus = async (
    competitionCode,
    userCode,
    containerCode
  ) => {
    try {
      const profileUpdationStatus = await Api.get(
        `/profile/me/${userCode}/${competitionCode}/${containerCode}`
      );
      if (profileUpdationStatus.result) {
        setProfileUpdateText(
          profileUpdationStatus.result.isProcessed
            ? "Here are the results for this competition"
            : "Your profile will be updated soon"
        );
      } else {
        setProfileUpdateText(
          "Your profile hasn't been updated since you failed to complete valid registration"
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="participantTimelineBlock participantTimelineConcluded">
      <strong className="time">{`${moment(
        container?.Competition?.updatedAt
      ).format("LT")}`}</strong>
      <div className="participantTimelineConcludedWrap">
        <div
          className={`participantTimelineBox timelineConcluded ${
            competition?.status === "CONCLUDED" ? "" : "abandonComp"
          }`}
        >
          <div className="participantTimelineBoxLeft flex items-center justify-between">
            <div className="visibleMobile timelineConcludedImage">
              <Image
                preview={false}
                src={
                  competition?.status === "CONCLUDED"
                    ? "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1677786283071_image_391.png"
                    : "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1677787515309_image_408.png"
                }
                alt={competition?.status}
              />
            </div>
            <Typography.Text className="participantTimelineTitle">
              <Image
                preview={false}
                src={
                  competition?.status === "CONCLUDED"
                    ? concludeFlag
                    : abandonFlag
                }
                alt={competition?.status}
              />
              {container?.Competition?.competitionName} has been{" "}
              {container?.Competition?.status}
            </Typography.Text>
            <Typography.Text className="participantTimelineConcluded">
              {competition?.status === "CONCLUDED"
                ? // ? "You may reach out to the organiser to know your results"
                  profileUpdateText
                : "Competition insights will not be previewable. Reach out to your organiser for any queries"}
            </Typography.Text>
          </div>
        </div>

        {competition.status === "CONCLUDED" ? (
          <div className="participantTimelineConcludedRewards">
            {competition.placements.map((placement) => (
              <>
                <div
                  className="participantTimelineConcludedRewardsRow"
                  key={JSON.stringify(placement)}
                >
                  {placement.containerCodes.find(
                    (cntCode) => cntCode === container.containerCode
                  ) ? (
                    <Typography.Text className="congratulationsMessage">
                      <img
                        src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1680192703199_emoji.png"
                        alt=""
                      />
                      <span>
                        <span className="yellow">Congratulations!</span>{" "}
                        {competition.competitionType === "TEAM"
                          ? "Your Team was"
                          : "You were"}{" "}
                        awarded {placement?.place} in this competition.
                      </span>
                    </Typography.Text>
                  ) : (
                    <></>
                  )}
                  <div className="participantTimelineConcludedRewardsContent">
                    <div className="participantTimelineConcludedRewardsLeft">
                      <Avatar
                        className="participantTimelineConcludedRewardImage"
                        src={placement.imageURL}
                      />
                      <Typography.Text className="participantTimelineConcludedRewardTitle">
                        {placement.place}
                      </Typography.Text>
                    </div>
                    <div className="participantTimelineConcludedRewardsTeams">
                      <Avatar.Group className="participantTimelineConcludedRewardsTeamImage">
                        {placement.containerCodes.map((cnt) => {
                          const containerFound = allContainers.find(
                            (cont) => cont.containerCode === cnt
                          );

                          return placement.containerCodes.length > 1 ? (
                            <Tooltip
                              title={containerFound?.containerName}
                              placement="top"
                              color="black"
                              key={JSON.stringify(cnt)}
                            >
                              {containerFound?.emojiObject ? (
                                <Avatar
                                  icon={containerFound?.emojiObject?.emoji}
                                />
                              ) : (
                                <Avatar src={containerFound?.imageURL} />
                              )}
                            </Tooltip>
                          ) : (
                            <div className="flex items-center">
                              {containerFound?.emojiObject ? (
                                <>
                                  <Avatar
                                    icon={containerFound?.emojiObject?.emoji}
                                  />
                                  <span className="font-bold ml-2">
                                    {containerFound?.containerName}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Avatar src={containerFound?.imageURL} />
                                  <span className="font-bold ml-2">
                                    {containerFound?.containerName}
                                  </span>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </Avatar.Group>
                    </div>
                    <div className="participantTimelineConcludedRewardsRight">
                      {placement.rewards.map((rwrd) => (
                        <Tooltip
                          title={rwrd.name}
                          placement="top"
                          color="black"
                          key={JSON.stringify(rwrd)}
                        >
                          <Avatar
                            src={rwrd?.imageURL}
                            icon={rwrd?.emojiObject?.emoji}
                          />
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

const LeaderboardUpdate = ({
  setActiveTabKey,
  timelineEvent,
  data,
  container,
}) => {
  return (
    <div className="participantTimelineBlock">
      <strong className="time">{`${moment(timelineEvent?.createdAt).format(
        "LT"
      )}`}</strong>
      <div className="participantTimelineBox">
        <div className="participantTimelineBoxLeft">
          <Typography.Text className="participantTimelineTitle">
            {data?.name || "Leaderboard"} has been updated.
            {/* {data?.oldRank
              ? `Your Rank updated from ${data?.oldRank} to ${data?.newRank}`
              : `Your rank is ${data?.newRank}`} */}
          </Typography.Text>
          <div className="participantTimelinePoints">
            <div className="participantTimelinePointsImage">
              <Avatar src={container?.imageURL} />
            </div>
            <Typography.Text className="participantTimelinePointsItem ratings">
              {!data?.oldRank ? (
                <>
                  <ArrowUpIcon className="arrowUp" /> #{data?.newRank}
                </>
              ) : data?.oldRank > data?.newRank ? (
                <>
                  <span className="oldRank">#{data?.oldRank}</span>{" "}
                  <ArrowUpIcon className="arrowUp" /> #{data?.newRank}
                </>
              ) : (
                <>
                  <span className="oldRank">#{data?.oldRank}</span>{" "}
                  <ArrowDwnIcon className="arrowDown" /> #{data?.newRank}
                </>
              )}
              {/* {data?.oldRank} <ArrowUpOutlined /> {data?.newRank} */}
              {/* #3 <ArrowDownOutlined /> #6 */}
            </Typography.Text>
            <Typography.Text className="participantTimelinePointsItem">
              <span className="participantTimelinePointsItemImg">
                <img
                  src="https://rethink-competitions.s3.amazonaws.com/1669844887275_spark.png"
                  alt=""
                />
              </span>{" "}
              {data?.points} pts
            </Typography.Text>
          </div>
        </div>
        <div className="participantTimelineBoxRight">
          <Typography.Text className="participantTimelineBoxLink">
            <span className="participantTimelineBoxLinkText">
              View Leaderboard{" "}
            </span>
            <Button
              className="circleButton"
              icon={<ArrowLinkIcon />}
              onClick={() => setActiveTabKey("5")}
            />
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};

const ParticipantUpdate = ({
  timelineEvent,
  setActiveTabKey,
  competition,
  user,
}) => {
  const getOnboardingText = () => {
    let temp = "";
    const name = `${
      timelineEvent.data?.firstName ? timelineEvent.data?.firstName : ""
    } ${timelineEvent.data?.lastName ? timelineEvent.data?.lastName : ""}`;
    if (competition?.competitionType === "SOLO") {
      if (user?.userCode === timelineEvent.data?.userCode) {
        if (timelineEvent.data?.status === "DELETED") {
          temp = `You have been removed from the ${competition?.competitionName}`;
        } else if (
          timelineEvent.data?.status === "ONBOARDED" ||
          timelineEvent.data?.status === "INVITED"
        ) {
          temp = `You have successfully registered in ${competition?.competitionName}`;
        }
      } else {
        if (timelineEvent.data?.status === "DELETED") {
          temp = `${name} has been removed from the ${competition?.competitionName}`;
        } else if (
          timelineEvent.data?.status === "ONBOARDED" ||
          timelineEvent.data?.status === "INVITED"
        ) {
          temp = `${name} has successfully registered in ${competition?.competitionName}`;
        }
      }
    } else {
      if (user?.userCode === timelineEvent.data?.userCode) {
        if (timelineEvent.data?.status === "DELETED") {
          temp = `You have been removed from the Team`;
        } else if (
          timelineEvent.data?.status === "ONBOARDED" ||
          timelineEvent.data?.status === "INVITED"
        ) {
          temp = `You were added to this team`;
        }
      } else {
        if (timelineEvent.data?.status === "DELETED") {
          temp = `${name} has been removed from the ${competition?.competitionName}`;
        } else if (
          timelineEvent.data?.status === "ONBOARDED" ||
          timelineEvent.data?.status === "INVITED"
        ) {
          temp = `${name} has successfully registered in ${competition?.competitionName}`;
        }
      }
    }
    return temp;
  };

  return (
    <div className="participantTimelineBlock">
      <strong className="time">{`${moment(timelineEvent?.createdAt).format(
        "LT"
      )}`}</strong>
      {(timelineEvent.data?.status === "ONBOARDED" ||
        timelineEvent.data?.status === "INVITED") && (
        <div className="participantTimelineBox">
          <div className="participantTimelineBoxLeft emailAdded flex items-center space-x-3">
            <Avatar
              size={44}
              style={{ background: "#6808FE" }}
              className="mr-2"
            >
              {`${
                timelineEvent.data?.firstName
                  ? timelineEvent.data?.firstName[0]
                  : ""
              }${
                timelineEvent.data?.lastName
                  ? timelineEvent.data?.lastName[0]
                  : ""
              }`}
            </Avatar>
            <div className="participantAddedInfo">
              <Typography.Text className="participantTimelineTitle">
                {getOnboardingText()}
                <DoubleDoneIcon className="hiddenMobile" />
                <DoubleDoneThinIcon className="checkedIcon visibleMobile" />
              </Typography.Text>
              <div className="hiddenMobile">
                {competition?.competitionType === "TEAM" && (
                  <Typography.Text className="participantTimelineBoxLink">
                    {timelineEvent.data?.email}
                  </Typography.Text>
                )}
              </div>
            </div>
          </div>
          {competition?.competitionType === "TEAM" && (
            <div className="participantTimelineBoxRight">
              {competition?.competitionType === "TEAM" && (
                <div className="visibleMobile participantTimelineEmailWrap">
                  <Typography.Text className="participantTimelineBoxLink participantTimelineEmail">
                    {timelineEvent.data?.email}
                  </Typography.Text>
                </div>
              )}
              <Typography.Text className="participantTimelineBoxLink">
                <span className="participantTimelineBoxLinkText">My Team </span>
                <Button
                  className="circleButton"
                  icon={<ArrowLinkIcon />}
                  onClick={() => setActiveTabKey("5")}
                />
              </Typography.Text>
            </div>
          )}
        </div>
      )}
      {timelineEvent.data?.status === "DELETED" && (
        <div className="participantTimelineBox">
          <div className="participantTimelineBoxLeft flex items-center space-x-3">
            <Badge
              className="participantTimelineBadge"
              count={
                <CrossIcon
                  style={{
                    marginRight: ".75rem",
                    marginTop: "2.5rem",
                    color: "#fff",
                    background: "red",
                    borderRadius: "50%",
                  }}
                  className="participantTimelineBadgeCrossIcon"
                />
              }
            >
              <Avatar
                size={44}
                style={{ background: "#6808FE" }}
                className="mr-2"
              >
                {`${
                  timelineEvent.data?.firstName
                    ? timelineEvent.data?.firstName[0]
                    : ""
                }${
                  timelineEvent.data?.lastName
                    ? timelineEvent.data?.lastName[0]
                    : ""
                }`}
              </Avatar>
            </Badge>
            <div className="participantAddedInfo">
              <Typography.Text className="participantTimelineTitle">
                {getOnboardingText()}
              </Typography.Text>
            </div>
          </div>
          <div className="participantTimelineBoxRight">
            <Typography.Text className="participantTimelineTeamRemoved">
              Contact the organiser for details
            </Typography.Text>
          </div>
        </div>
      )}
    </div>
  );
};

const Timeline = ({
  timelineEvents,
  container,
  competition,
  setActiveTabKey,
  user,
  setSubmissionSelected,
}) => {
  console.log(timelineEvents);
  let addedDates = [];

  timelineEvents = timelineEvents?.sort(function (a, b) {
    var keyA = new Date(a.updatedAt),
      keyB = new Date(b.updatedAt);
    // Compare the 2 dates
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  timelineEvents = timelineEvents?.reverse();

  function dateExists(element) {
    let res = addedDates.filter(
      (currentElement) => currentElement == element
    ).length;
    if (res == 0) {
      addedDates.push(element);
    }

    return res;
  }
  return (
    <div className="participantDashboardContent">
      <div className="participantTimelineRepeator">
        <div className="participantDashboardTimelineWrapper">
          {timelineEvents?.map((timelineEvent) => (
            <div key={timelineEvent._id}>
              {dateExists(moment(timelineEvent?.updatedAt).format("L")) ===
                0 && (
                <div className="participantDashboardSubHeader">
                  <Typography.Text className="participantDashboardHeading">
                    {moment(timelineEvent?.updatedAt).format("dddd")}
                  </Typography.Text>
                  <Typography.Text className="participantDashboardHeading">
                    {/* {moment(timelineEvent?.updatedAt).format("L")} */}
                    {moment(timelineEvent?.updatedAt).format("DD/MM/YYYY")}
                  </Typography.Text>
                </div>
              )}
              {timelineEvent.event === "COMPETITION" && (
                <CompettitionUpdate
                  timelineEvent={timelineEvent}
                  container={container}
                  competition={competition}
                  allContainers={timelineEvent?.containers}
                />
              )}
              {timelineEvent.event === "ROUND" &&
                !timelineEvent?.data?.isNotScoresSpecific && (
                  <ScoringUpdate
                    timelineEvent={timelineEvent}
                    setActiveTabKey={setActiveTabKey}
                    competition={competition}
                  />
                )}
              {timelineEvent.event === "ROUND" &&
                competition?.preferences?.roundWeightage &&
                timelineEvent?.data?.fieldModified?.[0] ===
                  "roundWeightage" && (
                  <WeightageUpdate
                    timelineEvent={timelineEvent}
                    setActiveTabKey={setActiveTabKey}
                    competition={competition}
                  />
                )}
              {timelineEvent.event === "ROUND" &&
                competition?.preferences?.roundScores &&
                timelineEvent?.data?.fieldModified?.[0] === "adjustedScore" && (
                  <ScoringUpdate
                    timelineEvent={timelineEvent}
                    setActiveTabKey={setActiveTabKey}
                    competition={competition}
                  />
                )}
              {timelineEvent.event === "SUBMISSION" && (
                <SubmissionUpdate
                  timelineEvent={timelineEvent}
                  setActiveTabKey={setActiveTabKey}
                  setSubmissionSelected={setSubmissionSelected}
                  competition={competition}
                />
              )}
              {timelineEvent.event === "CONTAINER" &&
                competition?.competitionType === "TEAM" && (
                  <div className="participantTimelineBlock">
                    <strong className="time">{`${moment(
                      timelineEvent?.createdAt
                    ).format("LT")}`}</strong>
                    <div className="participantTimelineBox">
                      <div className="participantTimelineBoxLeft">
                        <Typography.Text className="participantTimelineTitle successTitle">
                          Your Team has been added successfully{" "}
                          <DoubleDoneIcon />
                        </Typography.Text>
                      </div>
                      <div className="participantTimelineBoxRight">
                        <Typography.Text className="participantTimelineBoxLink">
                          <span className="participantTimelineBoxLinkText">
                            My Team{" "}
                          </span>
                          <Button
                            className="circleButton"
                            icon={<ArrowLinkIcon />}
                            onClick={() => setActiveTabKey("5")}
                          />
                        </Typography.Text>
                      </div>
                    </div>
                  </div>
                )}
              {timelineEvent.event === "PARTICIPANT" && (
                <ParticipantUpdate
                  timelineEvent={timelineEvent}
                  setActiveTabKey={setActiveTabKey}
                  competition={competition}
                  user={user}
                />
              )}
              {timelineEvent.event === "LEADERBOARD" && (
                <LeaderboardUpdate
                  timelineEvent={timelineEvent}
                  data={timelineEvent?.data}
                  setActiveTabKey={setActiveTabKey}
                  container={container}
                />
              )}
            </div>
          ))}
        </div>

        {/* leaderboard timeline */}
      </div>
    </div>
  );
};

export default Timeline;
