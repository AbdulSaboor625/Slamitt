import {
  Alert,
  Avatar,
  Col,
  Divider,
  Empty,
  Image,
  Row,
  Tabs,
  Typography,
} from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppCustomPicker, LineChart, RadarChart } from "../../";
import { updateContainerImage } from "../../../Redux/Actions";
import JudgesFeedbackModule from "../competitonsModule/judgesFeedbackModule";

const CompetitionSection = ({
  round,
  isAdmin,
  allRounds,
  scores,
  competition,
  container,
  setActiveTabKey,
  fetchCompetitionScores,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const filteredAllRounds = allRounds.filter((rnd) =>
    rnd.roundScore.filter((score) => score.isSubmit)
  );

  useEffect(() => {
    if (container && (container.imageURL || container.emojiObject)) {
      fetchCompetitionScores(container.competitionCode);
    }
  }, [container && (container.imageURL || container.emojiObject)]);

  const updateContainerDetails = (payload) => {
    payload.containerCode = container?.containerCode;
    if (payload.imageURL || payload.emojiObject) {
      dispatch(updateContainerImage(payload));
    }
  };

  const Stats = () => {
    return (
      <>
        <Tabs defaultActiveKey="1" centered tabPosition="bottom">
          <Tabs.TabPane tab="Round Insights" key="1">
            <div className="flex justify-between">
              <Typography.Text>{round?.roundCode}</Typography.Text>
              {/* <div className="flex">
                <Switch /> <Typography.Text>Scoring is live</Typography.Text>
              </div> */}
            </div>
            {/* <Divider /> */}
            <LineChart />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Skill Insights" key="2">
            <div className="flex justify-between">
              <Typography.Text>{round?.roundCode}</Typography.Text>
              {/* <div className="flex">
                <Switch /> <Typography.Text>Scoring is live</Typography.Text>
              </div> */}
            </div>
            <Divider />
            <RadarChart />
          </Tabs.TabPane>
        </Tabs>
      </>
    );
  };

  const Performance = () => {
    let points = [];
    for (let i of scores) {
      points.push(i?.score);
    }
    points.sort((a, b) => b - a);
    const afterRemoveSame = [...new Set(points)];
    return (
      <div className="teamPerformanceTableBlock">
        <div className="teamPerformanceTableTitle">
          <Typography.Title className="heading hide" level={3}>
            Avg Scores
          </Typography.Title>
          <Typography.Title className="heading" level={3}>
            {round?.totalPoints}
          </Typography.Title>
        </div>
        {!scores.length && <Empty />}
        <div className="teamPerformanceTableList">
          {scores.map((score, index) => {
            const pos = afterRemoveSame.indexOf(score.score) + 1;
            return (
              <div className="teamPerformanceTableRow" key={index}>
                <Typography.Text className="teamPerformancePosition">
                  {pos}{" "}
                </Typography.Text>
                <Typography.Text className="teamPerformanceUserInfo">
                  {score.emojiObject ? (
                    <p className="teamPerformanceUserEmoji">
                      {score.emojiObject.emoji}
                    </p>
                  ) : (
                    <Image
                      preview={false}
                      width={42}
                      height={42}
                      alt="thumbnail"
                      src={score?.imageURL}
                    />
                  )}
                  {score?.containerName}
                </Typography.Text>
                <Typography.Text className="teamPerformanceUserPoints">
                  {score?.score.toFixed(2)}
                </Typography.Text>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const CompetitionSectionHeader = () => {
    if (
      (competition?.competitionType === "TEAM" &&
        container?.users?.length !== competition?.minTeamSize) ||
      competition?.teamSize
    )
      return (
        <>
          {competition?.competitionType === "TEAM" && isAdmin ? (
            <Alert
              message={
                <Typography.Text>
                  <div className="card">
                    <AppCustomPicker
                      imgStyle={{
                        marginTop: "1rem",
                        height: "4rem",
                        width: "4rem",
                        cursor: "pointer",
                      }}
                      emojiStyle={{
                        fontSize: "3rem",
                        lineHeight: "1.2",
                        cursor: "pointer",
                      }}
                      className="tabset"
                      popOverClass="m-5"
                      tabpaneClass="m-5"
                      onImageSelected={(image) =>
                        updateContainerDetails({
                          imageURL: image.url,
                          emojiObject: image.emoji,
                        })
                      }
                      defaultValue={{
                        type: container?.imageURL ? "LINK" : "EMOJI",
                        url: container?.imageURL || "",
                        emoji: container?.emojiObject || "",
                      }}
                      showClearButton={false}
                    />

                    <Typography.Text>
                      {container?.containerName}
                    </Typography.Text>
                  </div>
                  {/* <GroupIcon /> */}
                  You have not{" "}
                  <span
                    className="underline cursor-pointer mx-2"
                    onClick={() => {
                      setActiveTabKey(3);
                      router.push(
                        `/auth/competitions/p/${
                          router.query.data[0]
                        }?content=${"settings"}`
                      );
                    }}
                  >
                    set up your team
                  </span>{" "}
                  yet!
                </Typography.Text>
              }
              type="warning"
            />
          ) : (
            <div className="card">
              <AppCustomPicker
                imgStyle={{
                  marginTop: "1rem",
                  height: "4rem",
                  width: "4rem",
                  cursor: "pointer",
                }}
                emojiStyle={{
                  fontSize: "3rem",
                  lineHeight: "1.2",
                  cursor: "pointer",
                }}
                className="tabset"
                popOverClass="m-5"
                tabpaneClass="m-5"
                onImageSelected={(image) =>
                  updateContainerDetails({
                    imageURL: image.url,
                    emojiObject: image.emoji,
                  })
                }
                defaultValue={{
                  type: container?.imageURL ? "LINK" : "EMOJI",
                  url: container?.imageURL || "",
                  emoji: container?.emojiObject || "",
                }}
                showClearButton={false}
              />
              <Typography.Text>{container?.containerName}</Typography.Text>
            </div>
          )}
          <Typography.Text className="participantsDashboardAlertText">
            Failing to add your team will devoid your teammates of their hard
            earned points
          </Typography.Text>
        </>
      );
    else if (competition?.competitionType === "SOLO")
      return (
        <div className="card">
          {container?.imageURL ? (
            <Avatar src={container?.imageURL} />
          ) : (
            <p style={{ fontSize: 40, marginBottom: 0 }}>
              {container?.emojiObject?.emoji}
            </p>
          )}
          <Typography.Text>{container?.containerName}</Typography.Text>
        </div>
      );
    else return <></>;
  };

  return (
    <div className="participantsDashboardContent">
      {" "}
      <div className="participantsDashboardAlert teamCode">
        <CompetitionSectionHeader />
        {/* {competition?.competitionType === "TEAM" &&
          container?.users?.length !== competition?.teamSize && (
            <>
              <Alert
                message={
                  <Typography.Text>
                    <div className="card">
                      {container?.imageURL ? (
                        <Avatar src={container?.imageURL} />
                      ) : (
                        <p style={{ fontSize: 40, marginBottom: 0 }}>
                          {container?.emojiObject?.emoji}
                        </p>
                      )}
                      <Typography.Text>
                        {container?.containerName}
                      </Typography.Text>
                    </div>
                    <GroupIcon /> You have not <span>set up your team</span>{" "}
                    yet!
                  </Typography.Text>
                }
                type="warning"
              />
              <Typography.Text className="participantsDashboardAlertText">
                Failing to add your team will devoid your teammates of their
                hard earned points
              </Typography.Text>
            </>
          )} */}
      </div>
      {!filteredAllRounds.length ? (
        <div className="roundPlaceholderBlock">
          <Empty
            image={
              "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1659384036776_imgplaceholder.png"
            }
            description={"All your Round details will appear here."}
          />
        </div>
      ) : (
        <Row className="preferencesTabContent">
          <Col
            className="roundScoringColumn"
            span={
              // competition?.preferences?.competitorScores ||
              // competition?.preferences?.stats
              competition?.preferences?.competitorScores &&
              container?.roundData?.length
                ? 12
                : 24
            }
          >
            {container?.roundData?.map((round) => (
              <JudgesFeedbackModule
                key={round.roundCode}
                round={round}
                competition={competition}
                participantSection={true}
              />
            ))}
          </Col>

          <Col className="roundPointsColumn" span={12}>
            <Tabs className="leaderboardTabset" defaultActiveKey="1">
              {/* {competition?.preferences?.stats && (
                <Tabs.TabPane tab="Stats" key="1">
                  <Stats />
                </Tabs.TabPane>
              )} */}
              {competition?.preferences?.competitorScores && (
                <Tabs.TabPane tab="Leaderboard" key="2">
                  <Performance />
                </Tabs.TabPane>
              )}
            </Tabs>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default CompetitionSection;
