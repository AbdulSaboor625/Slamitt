import { Button, Card, Tooltip, Typography } from "antd";
import { titleCase } from "../../../utility/common";
import { ArrowLinkIcon, InfoNewIcon } from "../../../utility/iconsLibrary";

const MockRoundFeedbackModule = ({
  round,
  isRoundWeightageVisible,
  isRoundScoresVisible,
  isDeleted,
  participantSection = false,
  timelineSection = false,
  setActiveTabKey,
  container,
  competition,
  fieldModified,
}) => {
  if (!round?.Round?.isLive) return "";
  const calculatePoints = (point) => {
    const WeightagePoint = Number(
      (point * (round?.Round?.roundWeightage || 100)) / 100
    );
    return participantSection
      ? competition?.preferences?.roundWeightage
        ? WeightagePoint
        : point
      : WeightagePoint;
  };
  return (
    <Card className="roundStatsBlock mockedActiveRound">
      <div className="roundStatsBlockTitle flex items center justify-between">
        <div className="mockedActiveRoundTitleWrap">
          {!participantSection && (
            <div className="flex items-center space-x-3 participantDashboardScoresSubHeaderInfo">
              <div className="mockedRoundImage">
                <img
                  src="https://rethink-competitions.s3.amazonaws.com/1665134509262_roundicon.png"
                  alt=""
                />
              </div>
              <Typography.Title>
                {titleCase(round?.Round?.roundName)}
              </Typography.Title>
            </div>
          )}
          <>
            <div className="flex items-center space-x-3 participantDashboardScoresSubHeaderInfo">
              <div className="mockedRoundImage">
                <img
                  src="https://rethink-competitions.s3.amazonaws.com/1665134509262_roundicon.png"
                  alt=""
                />
              </div>
              {participantSection && (
                <Typography.Text className="participantTimelineTitle">
                  {fieldModified?.[0] !== "roundWeightage"
                    ? !round.roundScore
                      ? isDeleted
                        ? `${round?.Round?.roundName} has been deleted`
                        : `${round?.Round?.roundName} scores have been updated` //`You were not scored for ${round?.Round?.roundName}`
                      : `${round?.Round?.roundName} scores have been updated`
                    : `${round?.Round?.roundName}'s Weightage have been updated`}

                  <Tooltip
                    title={"Score added by Organiser"}
                    trigger={"hover"}
                    placement="top"
                    color={"black"}
                  >
                    {" "}
                    <span className="mockedActiveRoundText visibleMobile">
                      <InfoNewIcon /> <span>Mock Round</span>
                    </span>
                  </Tooltip>
                </Typography.Text>
              )}
              <Tooltip
                title={"Score added by Organiser"}
                trigger={"hover"}
                placement="top"
                color={"black"}
              >
                <span className="mockedActiveRoundText">
                  {" "}
                  <InfoNewIcon /> <span>Mock Round</span>
                </span>
              </Tooltip>
            </div>
            {participantSection && !isDeleted && (
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
          </>
        </div>
        {!participantSection ? (
          <Typography.Text className="mockedActiveRoundPoints">
            <span className="weightageText">Weightage</span>{" "}
            {round?.Round?.roundWeightage}%
          </Typography.Text>
        ) : (
          <div />
        )}
      </div>

      {participantSection && !timelineSection && (
        <div className="timelineScoreCardHeadBottom">
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
        </div>
      )}
      {!timelineSection ? (
        isRoundScoresVisible || round.roundScore === 0 ? (
          <Typography.Text
            className={`totalStatsBlockTitlePoints w-[80%] ${
              !round.roundScore ? "notScored" : ""
            }`}
          >
            <span className="totalPoints">
              {round?.type === "MOCK" ? "Weighted Total" : "Total"}
            </span>
            {!round.roundScore && (
              <Typography.Text className="notScoredStatus">
                <img
                  src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1684254727706_scoreempty.png"
                  alt=""
                />
                <span className="totalPoints">
                  {!participantSection
                    ? `${container
                        ?.split("-")
                        ?.shift()} was not scored for this Round`
                    : "You were not scored"}{" "}
                </span>
              </Typography.Text>
            )}
            {!round.roundScore ? (
              <span className="notScoredEmpty">N/A</span>
            ) : (
              <div className="totalPointsText">
                {calculatePoints(round?.roundScore)} /{" "}
                {calculatePoints(round?.Round?.maxPoints)}{" "}
                <span className="pts">pts</span>
              </div>
            )}
          </Typography.Text>
        ) : (
          <Typography.Text className="totalStatsBlockTitlePoints w-[80%]">
            <span className="totalPoints">Scores were not disclosed</span>
          </Typography.Text>
        )
      ) : null}
    </Card>
  );
};

export default MockRoundFeedbackModule;
