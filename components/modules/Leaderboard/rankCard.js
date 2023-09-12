import { Avatar, Button, Image, Tooltip, Typography } from "antd";
import {
  ArrowLinkIcon,
  EyeHideIcon,
  EyeIcon,
  LeaderBoardThunderBoltIcon,
  RewardCoinImg,
} from "../../../utility/iconsLibrary";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const RankCard = ({
  container = {},
  setContainers,
  onHideContainer,
  leaderboard,
  classIndex,
  showScore,
  from,
}) => {
  const [isHidden, setIsHidden] = useState(container.isHidden);
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();

  return (
    <div className="leaderboardTeamBoxCol">
      <div
        className={`leaderboardTeamBox relative ${
          classIndex == 0
            ? "firstPlace"
            : classIndex == 1
            ? "secondPlace"
            : classIndex == 2
            ? "thirdPlace"
            : ""
        } ${container.isHidden ? "disabledPlace" : ""}`}
      >
        <div className="leaderboardTeamBoxHead">
          <div className="teamAvatarRank">
            {/* {user.userCode === leaderboard?.createdBy && (
              <Button
                className="buttonShowHide"
                type="text"
                icon={isHidden ? <EyeIcon /> : <EyeHideIcon />}
                onClick={() => {
                  setIsHidden(!isHidden);
                  onHideContainer(container, !isHidden);
                }}
              />
            )} */}
            {/* <Typography.Paragraph className="teamRank">
              {container?.currentRank}
            </Typography.Paragraph> */}
            <div className="rankIcon">
              {classIndex === 0 && (
                <img
                  src="https://rethink-competitions.s3.amazonaws.com/1686075781821_medal_2.png"
                  alt=""
                />
              )}
              {classIndex === 1 && (
                <img
                  src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1686076020825_2nd.png"
                  alt=""
                />
              )}
              {classIndex === 2 && (
                <img
                  src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1686075895385_image_444.png"
                  alt=""
                />
              )}
            </div>
            {/* container?.relations?.[0]?.Container?.emojiObject */}

            {/* {container?.emojiObject ||
            container?.relations?.[0]?.Container?.emojiObject ? (
              <p style={{ fontSize: "2rem" }}>
                {container?.relations?.[0]?.Container?.emojiObject?.emoji ??
                  container?.emojiObject?.emoji}
              </p> */}

            <div className="rankAvatarEmoji">
              {container.length == 1 ? (
                <>
                  {container?.[0]?.emojiObject ||
                  container?.[0]?.relations?.[0]?.Container?.emojiObject ? (
                    <p style={{ fontSize: "2rem" }}>
                      {container?.[0]?.relations?.[0]?.Container?.emojiObject
                        ?.emoji ?? container?.[0]?.emojiObject?.emoji}
                    </p>
                  ) : (
                    <Image
                      src={container?.[0]?.imageURL}
                      preview={false}
                      width={35}
                      heigth={35}
                      alt="img"
                    />
                  )}
                  <Typography.Paragraph className="teamName">
                    {container?.[0]?.containerName}
                  </Typography.Paragraph>
                </>
              ) : (
                  // Array.isArray(container) &&
                  container.map((item) => (
                    <div className="rankAvatarItems">
                      <Tooltip
                        color="black"
                        placement="top"
                        title={`${item.containerName}`}
                      >
                        {item?.emojiObject ? (
                          <p style={{ fontSize: "2rem" }}>{item?.emojiObject?.emoji}</p>
                        ) : (
                          <Image
                            src={item?.imageURL}
                            preview={false}
                            width={35}
                            heigth={35}
                            alt="img"
                          />
                        )}
                      </Tooltip>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/*  Arrow Feature */}
          {/* {from == "ORGANISER" && (
            <div
              className="leaderboardArrowIcon"
              onClick={() =>
                router.push({
                  pathname: router.asPath.split("?").shift(),
                  query: `content=containers&containerCode=${container?.relations?.[0]?.containerCode}`,
                })
              }
            >
              <ArrowLinkIcon />
            </div>
          )} */}

          {(showScore || from == "ORGANISER" || from == "PUBLIC") && (
            <div className="teamPointsWrap">
              <div className="teamPoints">
                <LeaderBoardThunderBoltIcon />
                <Typography.Text>
                  {container?.[0]?.score?.toPrecision(4)}
                </Typography.Text>
              </div>
              <div className="teamPoints iconCoin">
                <div className="ant-image">
                  <RewardCoinImg />
                </div>
                <Typography.Text>
                  182
                </Typography.Text>
              </div>
            </div>
          )}
        </div>
        {/* <div className="leaderboardStatsCardIcons absolute left-16 -bottom-1">
          <Avatar.Group>
            {container?.relations?.slice(0, 3)?.map((relation, i) => (
              <Avatar
                className={`${
                  relation?.Container?.roomCode === "disqualified" && "grayscale"
                } cursor-pointer`}
                alt={relation.Container?.Competition?.competitionName}
                src={
                  <>
                    <Tooltip
                      color={"geekblue"}
                      placement="top"
                      title={relation.Container?.Competition?.competitionName}
                    >
                      {relation.Container?.Competition?.imageURL ? (
                        relation.Container?.Competition?.imageURL
                      ) : (
                        <span>
                          {relation.Container?.Competition?.emojiObject?.emoji}
                        </span>
                      )}
                    </Tooltip>
                  </>
                }
                key={relation.competitionCode}
              />
            ))}
            {container?.relations?.length > 3 && (
              <Avatar
                className="cursor-pointer"
                // alt={relation.Container?.Competition?.competitionName}
                src={
                  <div className="ml-3">
                    <Tooltip
                      color={"geekblue"}
                      placement="top"
                      title={
                        <div>
                          {container?.relations?.length ? (
                            container?.relations?.slice(3).map((relation, i) => {
                              <Typography.Text key={i} className="text-white">
                                {
                                  relation?.Container?.Competition
                                    ?.competitionName
                                }
                              </Typography.Text>;
                            })
                          ) : (
                            <span></span>
                          )}
                        </div>
                      }
                    >
                      <Typography.Text className="text-center">
                        +{container?.relations?.length - 3}
                      </Typography.Text>
                    </Tooltip>
                  </div>
                }
                // key={relation.competitionCode}
              />
            )}
          </Avatar.Group>
        </div> */}
      </div>
    </div>
  );
};

export default RankCard;
