import {
  EyeFilled,
  EyeInvisibleFilled,
  InfoCircleOutlined,
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Collapse,
  Image,
  Typography,
  Tooltip,
  Carousel,
} from "antd";
import React, { useRef, useState } from "react";
import {
  ChatMicIcon,
  CheckCircleIcon,
  EyeHideIcon,
  EyeIcon,
  GroupIcon,
  LikeSVGIcon,
  RoundNewIcon,
  SearchThickIcon,
  MultipleUserIcon,
  ChatNewIcon,
} from "../../../../utility/iconsLibrary";
import AppModal from "../../../AppModal";
import EmptyProfileSection from "../emptyProfileSection";
import moment from "moment";
import useMediaQuery from "../../../../hooks/useMediaQuery";

const CompetitionCard = ({ comp }) => {
  const carauselRef = useRef(null);
  const competitionData = comp;
  const containerData = comp.containers.find(
    (cnt) => comp.containerCode === cnt.containerCode
  );
  const placements = comp.placements.filter((placement) =>
    placement.containerCodes.find((cnt) => cnt === containerData.containerCode)
  );
  let notVerifiedJudges = 0;
  let verifiedJudges = 0;
  comp.rounds.forEach((rnd) => {
    verifiedJudges += rnd.judges.filter((j) => j.verified).length;
    notVerifiedJudges += rnd.judges.filter((j) => !j.verified).length;
  });
  const judgesCount = comp.rounds.reduce(
    (accum, curr) => accum + curr.judges.length,
    0
  );
  const endorsements = comp.endorsements.length;
  const feedbacks = comp.feedbacks.length;
  const getJudgesTitle = () => {
    let str = "";
    if (verifiedJudges === 1) str += `${verifiedJudges} verfied judge `;
    else if (verifiedJudges !== 1) str += `${verifiedJudges} verfied judges `;

    if (notVerifiedJudges === 1)
      str += `${notVerifiedJudges} non verfied judge `;
    else if (notVerifiedJudges !== 1)
      str += `${notVerifiedJudges} non verfied judges `;
    return str;
  };
  const getTeamsTitle = () => {
    let str = "";
    const teamOrSoloTextSingular =
      comp?.competitionType === "SOLO" ? "Participant" : "Team";
    const teamOrSoloTextPlural =
      comp?.competitionType === "SOLO" ? "Participants" : "Teams";
    if (comp?.validContainers && comp?.validContainers.length === 1)
      str += `${comp?.validContainers.length} registered ${teamOrSoloTextSingular} `;
    else if (comp?.validContainers && comp?.validContainers.length !== 1)
      str += `${comp?.validContainers.length} registered ${teamOrSoloTextPlural} `;

    if (comp?.invalidContainers && comp?.invalidContainers.length === 1)
      str += `${comp?.invalidContainers.length} unassigned ${teamOrSoloTextSingular} `;
    else if (comp?.invalidContainers && comp?.invalidContainers.length !== 1)
      str += `${comp?.invalidContainers.length} unassigned ${teamOrSoloTextPlural} `;
    return str;
  };

  return (
    <div className="profileCompetitionBox thirdPlace disabled/firstPlace/secondPlace">
      <div className="profileCompetitionBoxImage hiddenMobile">
        {/* {editable && (
          <span className="profileCompetitionBoxViewButton">
            <EyeIcon className="iconHide" />
            <EyeHideIcon className="iconShow" />
          </span>
        )} */}
        <div className="teamLogo">
          {competitionData?.emojiObject ? (
            <span className="teamLogoEmoji">
              {competitionData?.emojiObject?.emoji}
            </span>
          ) : (
            <img src={competitionData?.imageURL} alt="" />
          )}
        </div>
        <Image
          preview={false}
          // className="w-[100%]"
          src="/defaultCompetitionBanner.png"
          alt=""
        />
        <div className="profileCompetitionTeamCode">
          <div className="profileCompetitionTeamCodeImage">
            {containerData?.emojiObject ? (
              <span className="profileCompetitionTeamCodeEmoji">
                {containerData?.emojiObject?.emoji}
              </span>
            ) : (
              <img src={containerData?.imageURL} alt="" />
            )}
          </div>
          <span className="profileCompetitionTeamCodeText">
            <Tooltip
              title={containerData?.containerName}
              trigger={"hover"}
              placement="top"
              color={"black"}
            >
              {containerData?.containerName}
            </Tooltip>
          </span>
        </div>
        {/* {editable && (
          <EyeFilled className="absolute left-3 top-2 cursor-pointer" />
        )} */}
      </div>
      <div className="profileCompetitionBoxContent">
        {/* top div */}
        <div className="profileCompetitionBoxTop">
          <div className="profileCompetitionBoxLeft">
            <div className="profileCompetitionBoxHead">
              <div className="mobilePlacementBox visibleMobile">
                {/* {placements.map((place) => (
                  <>
                    <Avatar src={place.imageURL} />
                    <span className="mobilePlacementNum">2</span>
                  </>
                ))} */}
              </div>
              <div className="teamLogo visibleMobile">
                {competitionData?.emojiObject ? (
                  <span className="teamLogoEmoji">
                    {competitionData?.emojiObject?.emoji}
                  </span>
                ) : (
                  <img src={competitionData?.imageURL} alt="" />
                )}
              </div>
              <div className="profileCompetitionBoxHeadTextbox">
                <div className="profileCompetitionBoxHeading">
                  <Typography.Text className="profileCompetitionBoxTitle">
                    {competitionData?.competitionName}
                  </Typography.Text>
                  <CheckCircleIcon className="checkIcon" />
                </div>
                <div className="profileCompetitionBoxInfo">
                  <Typography.Text className="date">
                    {/* {competitionData?.createdAt} */}
                    {moment(competitionData?.createdAt).format("D MMM, yyyy")} -
                    {moment(competitionData?.updatedAt).format("D MMM, yyyy")}
                  </Typography.Text>
                </div>
              </div>
            </div>
            <div className="profileCompetitionBoxStats">
              <Typography.Text className="profileCompetitionBoxStatsText">
                <span className="icon">
                  <img src={competitionData?.category?.imageURL} alt="" />
                </span>
                <span className="text catName">
                  <Tooltip
                    title={competitionData?.category?.categoryName}
                    trigger={"hover"}
                    placement="top"
                    color={"black"}
                  >
                    {competitionData?.category?.categoryName}
                  </Tooltip>
                </span>
              </Typography.Text>
              {endorsements ? (
                <Typography.Text className="profileCompetitionBoxStatsText">
                  <span className="icon">
                    <LikeSVGIcon className="likeIcon" />
                  </span>
                  <span className="text">{endorsements}</span>
                </Typography.Text>
              ) : (
                <div />
              )}
              {feedbacks ? (
                <Typography.Text className="profileCompetitionBoxStatsText">
                  <span className="icon">
                    <ChatNewIcon className="chatIcon" />
                  </span>
                  <span className="text">{feedbacks}</span>
                </Typography.Text>
              ) : (
                <div />
              )}
            </div>
          </div>
          <div className="profileCompetitionBoxRightWrap hiddenMobile">
            {placements.length ? (
              <>
                {placements.length > 1 ? (
                  <Button
                    icon={<LeftOutlined />}
                    type="text"
                    onClick={() => carauselRef.current.prev()}
                  />
                ) : (
                  <></>
                )}
                <Carousel
                  ref={carauselRef}
                  className="profileCompetitionBoxCarousel"
                  effect="slide"
                  autoplay
                >
                  {placements.map((place) => (
                    <div
                      className="profileCompetitionBoxRight"
                      key={JSON.stringify(place)}
                    >
                      <div className="profileCompetitionBoxRightHead">
                        <Avatar src={place.imageURL} />
                        <div className="textbox">
                          <Typography.Title level={5}>
                            {place.place}
                          </Typography.Title>
                        </div>
                      </div>
                      {place.rewards.length ? (
                        <ul className="profileCompetitionBoxIcons">
                          {place?.rewards?.map((rwrd, idx) => (
                            <Tooltip
                              title={rwrd?.name}
                              trigger={"hover"}
                              placement="top"
                              color={"black"}
                              key={JSON.stringify(rwrd)}
                            >
                              <li key={idx}>
                                {rwrd.emojiObject ? (
                                  <span>{rwrd.emojiObject.emoji}</span>
                                ) : (
                                  <img src={rwrd.imageURL} width="18" />
                                )}
                                {/* <Typography.Text>{rwrd?.name}</Typography.Text> */}
                              </li>
                            </Tooltip>
                          ))}
                        </ul>
                      ) : (
                        <div />
                      )}
                    </div>
                  ))}
                </Carousel>
                {placements.length > 1 ? (
                  <Button
                    icon={<RightOutlined />}
                    type="text"
                    onClick={() => carauselRef.current.next()}
                  />
                ) : (
                  <></>
                )}
              </>
            ) : (
              <div>
                <Typography.Text className="noPlacementNote">
                  No Placement
                </Typography.Text>
              </div>
            )}
          </div>
        </div>
        {/* below div */}
        <div className="profileCompetitionBoxBottom">
          <Tooltip color="black" title={getTeamsTitle()}>
            <div className="boxItem">
              <span className="icon groupIcon">
                <img
                  src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1674669680079_group.png"
                  alt=""
                />
              </span>
              <Typography.Text>
                {comp?.containers?.length}{" "}
                {comp?.competitionType === "SOLO" ? "Participants" : "Teams"}
              </Typography.Text>
            </div>
          </Tooltip>
          <Tooltip
            color="black"
            title={`${comp?.roundsJudged} out of ${comp?.rounds?.length} total rounds conducted`}
          >
            <div className="boxItem">
              <span className="icon roundIcon">
                <img
                  src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1674669741422_round.png"
                  alt=""
                />
              </span>
              <Typography.Text>
                {comp?.roundsJudged}{" "}
                {comp?.roundsJudged === 1 ? "Round" : "Rounds"}
              </Typography.Text>
            </div>
          </Tooltip>
          {judgesCount ? (
            <Tooltip color="black" title={getJudgesTitle()}>
              <div className="boxItem">
                <span className="icon judgeIcon">
                  <img
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1674669758228_judge.png"
                    alt=""
                  />
                </span>
                <Typography.Text>{judgesCount} Judges</Typography.Text>
              </div>
            </Tooltip>
          ) : (
            <div className="boxItem noJudgeOnboarded">
              <Typography.Text>No judges were Onboarded</Typography.Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PrimaryCompetiton = ({ editable }) => {
  return (
    <div>
      {[1, 2, 3].map((card, i) => (
        <CompetitionCard editable={editable} key={i} />
      ))}
    </div>
  );
};

const MoreCompetition = ({ editable }) => {
  return (
    <div>
      {[1, 2, 3].map((card, i) => (
        <CompetitionCard editable={editable} key={i} />
      ))}
    </div>
  );
};

const Competitions = ({
  editable,
  competitions,
  isViewable,
  fetchCompetitions,
  allCompetitionsCount,
}) => {
  const [visible, setVisible] = useState(false);
  const pageOffest = useRef(1);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const CompetitionModal = () => {
    const genExtra = () => (
      <ul className="profileCompetitionsViews">
        <li className="active">
          <EyeIcon />
          <Typography.Text className="viewCount">12</Typography.Text>
        </li>
        <li>
          <EyeHideIcon />
          <Typography.Text className="viewCount">06</Typography.Text>
        </li>
        <li>
          <SearchThickIcon className="searchIcon" />
        </li>
      </ul>
    );
    const { Panel } = Collapse;
    return (
      <AppModal
        isVisible={visible}
        onCancel={() => setVisible(false)}
        defaultActiveKey={["1"]}
        className="moreProfileModal"
      >
        <div className="moreProfileModalContent">
          <Typography.Text className="heading">Competitions</Typography.Text>
          <Collapse defaultActiveKey={1}>
            <Panel header="Primary" key={1}>
              <PrimaryCompetiton editable={editable} />
            </Panel>
            <Panel header="More" key={2} extra={genExtra()}>
              <MoreCompetition editable={editable} />
            </Panel>
          </Collapse>
          <div className="text-center">
            <Button className="buttonCancle" onClick={() => setVisible(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </AppModal>
    );
  };
  return (
    <div className="profileCompetitionsBlock">
      <div className="profileMainBlockHead">
        {!isMobile ? (
          <Typography.Title className="heading" level={3}>
            Competitions{" "}
            {allCompetitionsCount
              ? `(${allCompetitionsCount > 50 ? "50+" : allCompetitionsCount})`
              : ""}
          </Typography.Title>
        ) : (
          ""
        )}

        {/* {editable && (
          <ul className="profileCompetitionsViews">
            <li>
              <EyeIcon />
              <Typography.Text className="viewCount">12</Typography.Text>
            </li>
            <li>
              <EyeHideIcon />
              <Typography.Text className="viewCount">06</Typography.Text>
            </li>
          </ul>
        )} */}
        {/* {editable && (
          <Typography.Paragraph className="subtext">
            Tap on the eye to show and hide competitions on your profile
          </Typography.Paragraph>
        )} */}
      </div>
      <div className={`profileStatsHolder ${isViewable ? "" : "blurState"}`}>
        {/* Hidden Profile item state */}
        <div className="profileStatsPlaceholderText hiddenMobile">
          Finish setting up your account to access your competition reports
        </div>
        <div className="profileStatsPlaceholderText visibleMobile">
          Complete adding Account Info to preview your profile
        </div>
        {competitions && competitions.length ? (
          <div className="profileCompetitionsList">
            {competitions.map((comp, i) => (
              <CompetitionCard key={i} card={comp} comp={comp} />
            ))}
            {competitions?.length < allCompetitionsCount ? (
              <div className="profileMainBlockLinkWrap">
                <Button
                  type="text"
                  className="profileSidebarLinkWrap"
                  onClick={() => {
                    pageOffest.current += 1;
                    fetchCompetitions(pageOffest.current);
                  }}
                >
                  View All
                </Button>
              </div>
            ) : (
              <div />
            )}
            <CompetitionModal />
          </div>
        ) : (
          <EmptyProfileSection section={"COMPETITIONS"} />
        )}
      </div>
    </div>
  );
};

export default Competitions;
