import { Avatar, Button, Image, Tooltip, Typography } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import {
  EyeHideIcon,
  EyeIcon,
  LeaderBoardThunderBoltIcon,
  ArrowLinkIcon,
  RewardCoinImg,
} from "../../../utility/iconsLibrary";
import { useRouter } from "next/router";

const ScoreCard = ({
  container = [],
  onHideContainer,
  leaderboard,
  setActiveTabKey,
  showScore,
  from,
}) => {
  const router = useRouter();
  const [isHidden, setIsHidden] = React.useState(container.isHidden);
  const user = useSelector((state) => state.auth.user);

  return (
    <div
      className={`leaderboardStatsCard ${container.isHidden && "bg-slate-700"}`}
    >
      <div className="leaderboardStatsCardTeamInfo">
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
        {/* <Typography.Text className="textRank">
          <span className="hash">#</span>
          {container?.currentRank === 0
            ? container?.prevRank
            : container?.currentRank}
        </Typography.Text> */}
        <Typography.Text className="textRank">
          <span className="hash">#</span>
          {container?.[0]?.rank}
        </Typography.Text>

        {container.length == 1 ? (
          <>
            {container?.[0]?.emojiObject ? (
              <p style={{ fontSize: "2rem" }}>
                {container?.[0]?.emojiObject?.emoji}
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
      </div>
      {/* <div className="leaderboardStatsCardIcons">
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
      {(showScore || from === "ORGANISER" || from === "PUBLIC") && (
        <div className="leaderboardStatsCardPointsWrap">
          <div className="leaderboardStatsCardPoints iconCoin">
            <div className="ant-image">
              <RewardCoinImg />
            </div>
            <Typography.Text>
              70
            </Typography.Text>
          </div>
          <div className="leaderboardStatsCardPoints">
            <LeaderBoardThunderBoltIcon />
            <Typography.Text>
              {container?.[0]?.score?.toPrecision(4)} <span>pts</span>
            </Typography.Text>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreCard;
