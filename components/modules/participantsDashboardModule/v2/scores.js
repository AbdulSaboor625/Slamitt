import { Avatar, Image, Tooltip, Typography } from "antd";
import moment from "moment";
import React from "react";
import { CONTAINER_SCORING_EMPTY_STATE } from "../../../../utility/config";
import { InfoNewIcon } from "../../../../utility/iconsLibrary";
import JudgesFeedbackModule from "../../competitonsModule/judgesFeedbackModule";
import MockRoundFeedbackModule from "../../competitonsModule/mockRoundFeedbackModule";

const Scores = ({ container, competition }) => {
  const isRoundScoresVisible = competition?.preferences?.roundScores;
  const isRoundWeightageVisible = competition?.preferences?.roundWeightage;
  const completedRound = container?.roundData?.filter((round) => {
    const judges = round?.roundScore?.length;
    let submitJudges = 0;

    round?.roundScore?.map((judge) => {
      if (judge?.submit) submitJudges++;
    });
    if (judges === submitJudges) {
      round.type = "GENERAL";
      return round;
    }
  });

  const liveMockRound = container?.mockRoundData?.filter((round) => {
    if (round?.Round?.isLive) {
      round.type = "MOCK";
      return round;
    }
  });

  const allRounds = [...completedRound, ...liveMockRound];
  const sortedRounds = allRounds?.sort((a, b) => {
    return new Date(b.Round.updatedAt) - new Date(a.Round.updatedAt);
  });

  return (
    <div className="participantDashboardContent">
      {sortedRounds?.length ? (
        <div className="participantDashboardScoresContent">
          {sortedRounds?.map((round) => {
            return (
              <div
                className="participantDashboardScoresRepeator"
                key={round.roundCode}
              >
                <div className="participantDashboardScoresHeader">
                  <Typography.Text className="participantDashboardScoresHeaderText">
                    {moment(round?.Round?.updatedAt).format("DD/MM/YYYY")}
                  </Typography.Text>
                  <Typography.Text className="participantDashboardScoresHeaderText italic">
                    Updated {moment(round?.Round?.updatedAt).fromNow()}
                  </Typography.Text>
                </div>
                <div
                  className={`participantDashboardScoresBox ${
                    competition?.preferences?.roundScores ? "" : "weightedAvg"
                  }`}
                >
                  <div className="participantDashboardScoresSubHeader">
                    <div className="flex items-center space-x-3 participantDashboardScoresSubHeaderInfo">
                      <Avatar
                        src={
                          round?.Round?.imageURL &&
                          !round?.Round?.imageURL.includes(
                            "https://avataaars.io/"
                          )
                            ? round?.Round?.imageURL
                            : "https://rethink-competitions.s3.amazonaws.com/1665134509262_roundicon.png"
                        }
                      />
                      <Typography.Text className="participantDashboardRoundTitle">
                        {round?.Round?.roundName}
                      </Typography.Text>
                      {round?.type === "MOCK" && (
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
                      )}
                    </div>

                    {round?.type === "MOCK" ? (
                      (isRoundScoresVisible || isRoundWeightageVisible) && (
                        <ul className="participantDashboardRoundStatus">
                          {isRoundScoresVisible ? (
                            <li>
                              <Typography.Text className="participantDashboardRoundStatusText">
                                {round?.Round?.maxPoints
                                  ? "Max Points "
                                  : "Total Points "}{" "}
                                <strong>
                                  {round?.Round?.maxPoints ||
                                    round?.Round?.totalPoints}{" "}
                                  <sub>pts</sub>
                                </strong>
                              </Typography.Text>
                            </li>
                          ) : (
                            <div />
                          )}

                          {isRoundWeightageVisible ? (
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
                      )
                    ) : (
                      <ul className="participantDashboardRoundStatus">
                        {isRoundScoresVisible ? (
                          <li>
                            <Typography.Text className="participantDashboardRoundStatusText">
                              {round?.Round?.maxPoints
                                ? "Max Points "
                                : "Total Points "}{" "}
                              <strong>
                                {round?.Round?.maxPoints ||
                                  round?.Round?.totalPoints}{" "}
                                <sub>pts</sub>
                              </strong>
                            </Typography.Text>
                          </li>
                        ) : (
                          <div />
                        )}

                        {isRoundWeightageVisible ? (
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
                    )}
                  </div>
                  {round.type && round?.type === "GENERAL" ? (
                    <JudgesFeedbackModule
                      round={round}
                      competition={competition}
                      participantSection={true}
                      container={container?.containerName}
                    />
                  ) : (
                    <MockRoundFeedbackModule
                      round={round}
                      isRoundScoresVisible={isRoundScoresVisible}
                      isRoundWeightageVisible={isRoundWeightageVisible}
                      container={container?.containerName}
                      competition={competition}
                      participantSection={true}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="participantDashboardPlaceholder">
          <Image
            className="participantDashboardPlaceholderImage"
            preview={false}
            width={200}
            height={200}
            alt="thumbnail"
            src={CONTAINER_SCORING_EMPTY_STATE}
          />
          {competition?.status !== "CONCLUDED" ? (
            <Typography.Text className="participantDashboardPlaceholderText">
              You will be able to view your performance here after round scores
              are released
            </Typography.Text>
          ) : (
            <Typography.Text className="participantDashboardPlaceholderText">
              No Scores were released for this competition
            </Typography.Text>
          )}
        </div>
      )}
    </div>
  );
};

export default Scores;
