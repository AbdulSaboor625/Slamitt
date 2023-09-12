import { Button, Image, Skeleton, Tabs, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addGroupChat,
  addOrganiserChat,
  getChat,
  makeUserAdminFromContainer,
  notify,
  removeUserFromContainer,
  updateCompetitionDetails,
  updateContainer,
  updateContainerImage,
} from "../../../Redux/Actions";

import {
  selectHMSMessages,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import useMediaQuery from "../../../hooks/useMediaQuery";
import {
  ArrowBackIcon,
  CrewNewIcon,
  SettingsIcon,
} from "../../../utility/iconsLibrary";
import { abandonFlag, concludeFlag } from "../../../utility/imageConfig";
import ContainerSection from "./ContainerSection";
import Rounds from "./Rounds";
import Settings from "./Settings";
import EmptyContentSection from "./emptyContentSection";

// For LeaberBoard Content
import { useRouter } from "next/router";
import Api from "../../../services";
import { getPresenceChannelName } from "../../../utility/common";
import { socketEvents } from "../../../utility/config";
import LeaderBoardContent from "../Leaderboard/content";
import LeaderBoardHeader from "../Leaderboard/header";
import EditBasicSettingsModal from "./Settings/editBasicSettingsModal";
import RegistrationTab from "./registrations/index";

const ContentSection = ({
  readOnlyState,
  onChangeTab,
  activeContentTab,
  activeTabKey,
  setActiveTabKey,
  detailsOpen,
  setDetailsOpen,
  pusher,
  isVisibleTeamSizeModal,
  setVisibiltyTeamSizeModal,
  certificate,
  placementsData,
  setPlacementsData,
}) => {
  const { role } = useSelector((state) => state.auth.user);
  const container = useSelector((state) => state.containers);
  const competition = useSelector((state) => state.competition);
  const roomsState = useSelector((state) => state.rooms);
  const chatState = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const hmsActions = useHMSActions();
  const storeMessages = useHMSStore(selectHMSMessages);
  useEffect(() => {
    dispatch(getChat(chatState.container));
  }, [chatState.container.containerCode || chatState.container.roomCode]);

  const updateContainerDetails = (payload) => {
    payload.containerCode = container?.current?.containerCode;
    if (payload.imageURL || payload.emojiObject) {
      dispatch(updateContainerImage(payload));
    } else dispatch(updateContainer(payload));
  };

  const _makeAdmin = (containerCode, email) => {
    dispatch(makeUserAdminFromContainer(containerCode, email));
  };

  const _removeUser = (containerCode, email) => {
    dispatch(removeUserFromContainer(containerCode, email));
  };

  const _onUpdateCompetition = (payload) => {
    dispatch(updateCompetitionDetails(payload));
  };

  const addChat = (payload) => {
    if (chatState.container?.roomCode) dispatch(addGroupChat(payload));
    else dispatch(addOrganiserChat(payload));

    hmsActions.sendBroadcastMessage(JSON.stringify(payload));
  };

  const rooms = roomsState.all.map((room) => {
    return {
      ...room,
      label: `${room.roomName} (${room.containersCount || 0})`,
      value: room.roomCode,
    };
  });

  const isMobile = useMediaQuery("(max-width: 1023px)");

  const styleForTab = () => {
    if (isMobile && detailsOpen) {
      return { display: "none" };
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // For LeaberBoard Content
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [params, setParams] = useState();
  const [leaderboard, setLeaderboard] = useState(null);
  const [load, setLoad] = useState(true);
  const [containers, setContainers] = useState([]);

  useEffect(() => {
    if (params !== "") {
      getLeaderBoard();
    }
    // dispatch(getCategoryAndSubCategory());
    // dispatch(getAllCompetitionsParticipated());
    // dispatch(getAllCompetitionsOrganized());
  }, [params]);

  useEffect(() => {
    if (
      user &&
      leaderboard &&
      user?.userCode !== leaderboard?.createdBy &&
      params
    )
      window.location.href = `/leaderboard/public/${params}`;
    if (user?.userCode === leaderboard?.createdBy) onUpdateLeaderBoardPressed();
  }, [leaderboard]);

  const getLeaderBoard = async () => {
    if (params) {
      setLoad(true);
      try {
        const response = await Api.get(`/leaderboards/${params}`);
        if (response.code && response.result) {
          setLeaderboard(response.result);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        dispatch(notify({ message: error.message, type: "error" }));
      }
      setLoad(false);
    }
  };

  const onUpdateLeaderBoardPressed = async (clickedUpdate = false) => {
    if (params) {
      setLoad(true);
      try {
        const response = await Api.get(`/leaderboards/${params}/update`);
        if (response.code && response.result) {
          // const allContainers = response?.result;
          // const scores = allContainers.map((c) => c.score);
          // let uniqueScores = [...scores];
          // const containerWithRank = allContainers?.map((c) => {
          //   let currentRank = uniqueScores?.indexOf(c?.score) + 1;
          //   return { ...c, currentRank, prevRank: currentRank };
          // });
          // setContainers(containerWithRank);
          setContainers(response?.result);
          if (clickedUpdate)
            dispatch(
              notify({
                type: "success",
                message: "Leaderboard updated successfully.",
              })
            );
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        dispatch(notify({ message: error.message, type: "error" }));
      }
      setLoad(false);
    }
  };

  const onPublishOrUpdateLeaderBoardPressed = async (body, clickOn = "") => {
    if (params) {
      const payload = {};
      if (body.isPublished) payload.isPublished = body.isPublished;
      if (body.isLive || body.isLive === false) payload.isLive = body.isLive;
      if (body.leaderboardName) payload.leaderboardName = body.leaderboardName;
      if (containers.length) payload.scoreboard = containers;
      if (body.imageURL) payload.imageURL = body.imageURL;
      if (body.emojiObject) payload.emojiObject = body.emojiObject;
      payload.autoUpdate = body.autoUpdate;
      payload.competitionCode = competition?.current?.competitionCode;
      try {
        const response = await Api.update(`/leaderboards/${params}`, payload);
        if (response.code && response.result) {
          setLeaderboard(response.result);
          if (body.update)
            dispatch(
              notify({
                type: "success",
                message: "Leaderboard updated successfully.",
              })
            );
          if (body?.isLive || body?.isLive === false) {
            dispatch(
              notify({
                type: "success",
                message: `Leaderboard is now ${
                  body?.isLive === true ? "live" : "not in live"
                }`,
              })
            );
          } else if (clickOn === "PUBLISH") {
            dispatch(
              notify({
                type: "success",
                message: `Leaderboard published successfully.`,
              })
            );
          }
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        dispatch(notify({ message: error.message, type: "error" }));
      }
    }
  };

  const fetchLeaderBoard = async () => {
    const body = {
      leaderboardName: competition.current?.competitionName,
      emojiObject: competition.current?.emojiObject,
      competitions: [`${competition.current?.competitionCode}`],
      competitionCode: competition.current?.competitionCode,
    };
    try {
      const response = await Api.post("/leaderboards", body);
      if (response?.code && response?.result) {
        setParams(response?.result?._id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (router.query.content == "leaderboard") {
      fetchLeaderBoard();
    }
  }, [competition]);

  const [isSwitchActive, setIsSwitchActive] = useState(false);
  useEffect(() => {
    if (leaderboard) setIsSwitchActive(leaderboard?.autoUpdate);
  }, [leaderboard]);

  useEffect(() => {
    if (competition) {
      const channel = pusher.subscribe(
        getPresenceChannelName(competition?.current?.competitionCode)
      );

      channel.bind("receive_message", (payload) => {
        if (
          payload.event === "ROUND_SCORE_UPDATE" ||
          payload.event === socketEvents.room_containers_update ||
          payload.event === socketEvents.BULK_CREATE_CONTAINERS ||
          payload.event === socketEvents.round_live
        ) {
          onUpdateLeaderBoardPressed(false);
        }
      });
    }
  }, [competition]);

  useEffect(() => {
    if (container?.current?.competitionRoomCode) {
      const channel = pusher.subscribe(
        getPresenceChannelName(container?.current?.competitionRoomCode)
      );

      channel.bind("receive_message", (payload) => {
        if (payload.event === socketEvents?.room_containers_update) {
          onUpdateLeaderBoardPressed(false);
        }
      });
    }
  }, [container?.current]);

  const [isVisible, setVisibility] = useState(false);
  const [isEditName, setEditName] = useState(false);

  const validForLeaderboard = (containers) => {
    let array = [];
    [...containers].forEach((item) => {
      item.forEach((innerItem) => {
        array.push(innerItem);
      });
    });

    if (array.filter((item) => item.score != 0).length >= 2) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <div
        className={`${
          detailsOpen ? "block buttonPageBack" : "hidden"
        } tablet:hidden`}
      >
        <Button onClick={() => setDetailsOpen(false)}>
          {" "}
          <ArrowBackIcon />{" "}
        </Button>
      </div>
      <div
        className={`leaderboardPageWrapper ${
          activeTabKey == 6 ? "registrationPageWrapper" : ""
        }`}
      >
        {activeTabKey == 5 ||
          (activeTabKey == 6 && (
            <div className="competitionSidebarHolder">
              <EditBasicSettingsModal
                isVisible={isVisible}
                setVisibility={setVisibility}
                editName={isEditName}
                competition={competition?.current}
                updateCompetiton={_onUpdateCompetition}
              />
              <div className="competitionSidebarTitle">
                {competition?.current?.status &&
                  competition.current.status !== "ACTIVE" && (
                    <>
                      <div className="statusIcon visibleMobile">
                        <Image
                          preview={false}
                          src={
                            competition.current.status === "CONCLUDED"
                              ? "https://rethink-competitions.s3.amazonaws.com/1678046766997_CONCLUDED.svg"
                              : "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1678046801946_ABANDONED.svg"
                          }
                          alt={competition.current.status}
                        />
                      </div>
                    </>
                  )}
                {competition?.current?.emojiObject ? (
                  <p className="competitionSidebarTitleEmoji">
                    {competition?.current?.emojiObject.emoji}
                  </p>
                ) : (
                  <Image
                    src={competition?.current?.imageURL}
                    preview={false}
                    width={100}
                    heigth={100}
                    alt="img"
                  />
                )}
                <Typography.Title
                  onClick={() => {
                    if (!readOnlyState) {
                      setVisibility(true);
                      setEditName(true);
                    }
                  }}
                  style={{ cursor: readOnlyState ? "default" : "pointer" }}
                >
                  <strong>
                    {competition?.current?.competitionName}
                    {user?.role === "CREW" && (
                      <Typography.Text
                        className="crewStatus"
                        // style={{
                        //   border: "1px solid gray",
                        //   borderRadius: ".25rem",
                        // }}
                      >
                        <CrewNewIcon className="crewIcon" />{" "}
                        <span className="text">Crew</span>
                      </Typography.Text>
                    )}
                  </strong>{" "}
                  <span className="seprator"></span>{" "}
                  <span className="subCategory">
                    {competition?.current?.category?.categoryName}
                  </span>
                </Typography.Title>
                <Button
                  onClick={() => {
                    router.push(
                      `/auth/competitions/o/${
                        competition?.current?.competitionCode
                      }?content=${"settings"}`
                    );
                  }}
                  icon={<SettingsIcon />}
                  className={`mobile:block laptop:hidden settingsButton ${
                    router?.query?.content === "settings" && "active"
                  }`}
                />
              </div>
            </div>
          ))}
        <Tabs
          tabBarStyle={styleForTab()}
          // className={`competitionTabset ${
          //   isScrolled
          //     ? "sticky-tabs"
          //     : "                                                       "
          // }`}
          className={
            role == "CREW"
              ? "competitionTabset tabsForCrew"
              : "competitionTabset"
          }
          defaultActiveKey={6}
          onChange={(e) => {
            e == "5" && fetchLeaderBoard();
            onChangeTab(e);
          }}
          activeKey={`${activeTabKey}`}
        >
          {competition?.current?.status &&
            competition.current.status !== "ACTIVE" && (
              <Tabs.TabPane
                className="endedCompetitionTab"
                disabled={true}
                tab={
                  <>
                    <span className="styleConclude">
                      {competition.current.status}
                    </span>
                    <Image
                      preview={false}
                      src={
                        competition.current.status === "CONCLUDED"
                          ? concludeFlag
                          : abandonFlag
                      }
                      alt={competition.current.status}
                    />
                  </>
                }
                key={7}
              ></Tabs.TabPane>
            )}
          <Tabs.TabPane tab="Registration" key={6}>
            <RegistrationTab pusher={pusher} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              competition?.current?.competitionType === "SOLO"
                ? "Participants"
                : "Teams"
            }
            key={1}
          >
            {container.all.length &&
            container.current &&
            !container.current.isDeleted ? (
              <ContainerSection
                role={role}
                readOnlyState={readOnlyState}
                detailsOpen={detailsOpen}
                setDetailsOpen={setDetailsOpen}
                container={{ ...container.current }}
                rooms={rooms}
                updateRoom={(room) => {
                  updateContainerDetails({ roomCode: room.roomCode });
                }}
                updateName={(name) => {
                  const titleCase = (str) => {
                    return str
                      .toLowerCase()
                      .replace(/(^|\s)\S/g, (L) => L.toUpperCase());
                  };
                  const containerName = titleCase(name);
                  updateContainerDetails({ containerName: containerName });
                }}
                updateContainerImage={(image) =>
                  updateContainerDetails({
                    imageURL: image.url,
                    emojiObject: image.emoji,
                  })
                }
                removeUser={_removeUser}
                makeAdmin={_makeAdmin}
                competition={{ ...competition.current }}
                onUpdateCompetition={_onUpdateCompetition}
                isVisibleTeamSizeModal={isVisibleTeamSizeModal}
                setVisibiltyTeamSizeModal={setVisibiltyTeamSizeModal}
                pusher={pusher}
              />
            ) : (
              <EmptyContentSection
                tabActive={activeContentTab}
                isSolo={competition?.current?.competitionType}
              />
            )}
          </Tabs.TabPane>
          {(!readOnlyState ||
            (readOnlyState && competition?.allRounds?.length > 0)) && (
            <Tabs.TabPane tab="Rounds" key={3}>
              <Rounds
                readOnlyState={readOnlyState}
                tabActive={activeContentTab}
                detailsOpen={detailsOpen}
                setDetailsOpen={setDetailsOpen}
                pusher={pusher}
              />
            </Tabs.TabPane>
          )}{" "}
          {/* <Tabs.TabPane tab="Leaderboard" key={5} disabled={role === "CREW"}>
            {!!containers.length && containers?.[0]?.[0]?.score != 0 ? (
              !load ? (
                <div className="leaderboardPage">
                  <LeaderBoardHeader
                    leaderboard={leaderboard}
                    onUpdateLeaderBoardPressed={onUpdateLeaderBoardPressed}
                    onPublishOrUpdateLeaderBoardPressed={
                      onPublishOrUpdateLeaderBoardPressed
                    }
                    container={containers.slice(0, 3)}
                    publicLeaderboard={false}
                    competition={competition.current}
                    isSwitchActive={isSwitchActive}
                    setIsSwitchActive={setIsSwitchActive}
                    from="ORGANISER"
                    canUpdateLeaderBoard={validForLeaderboard(containers)}
                  />

                  {user.userCode === leaderboard?.createdBy ||
                  leaderboard?.isLive ? (
                    <LeaderBoardContent
                      container={containers}
                      setContainers={setContainers}
                      leaderboard={leaderboard}
                      setActiveTabKey={setActiveTabKey}
                      from="ORGANISER"
                    />
                  ) : (
                    // <>
                    //   {!load ? (
                    //     <div className="leaderboardPageEmptyState">
                    //       <Image
                    //         alt="Leaderboard Image"
                    //         preview={false}
                    //         src={leaderboardEmptyState}
                    //       />
                    //       <Typography.Text>
                    //         The Organiser has disabled the leaderboard at the
                    //         moment
                    //       </Typography.Text>
                    //     </div>
                    //   ) : (
                    //     <Spinner />
                    //   )}
                    // </>
                    <Skeleton loading={true} avatar />
                  )}
                </div>
              ) : (
                <Skeleton loading={true} avatar />
              )
            ) : (
              <div className="organiserLeaderboardPageEmptyState">
                <Image
                  alt="Leaderboard Image"
                  preview={false}
                  // src={leaderboardEmptyState}
                  src="https://rethink-competitions.s3.amazonaws.com/1686078590928_leaderboardplaceholder.png"
                />
                <Typography.Text>
                  Your competition leaderboard will update in real time here as
                  your{" "}
                  {competition?.current?.competitionType == "SOLO"
                    ? "Participants"
                    : "Teams"}{" "}
                  start getting scored
                </Typography.Text>
              </div>
            )}
          </Tabs.TabPane> */}
          {/* <Tabs.TabPane tab="Chats" key={2}>
          {chatState.container &&
          (chatState.container.containerCode ||
            chatState.container.roomCode) ? (
            <ChatsSection
              detailsOpen={detailsOpen}
              addChat={addChat}
              container={chatState.container}
              chat={chatState.chat}
              storeMessages={storeMessages}
            />
            //
          ) : (
            <EmptyContentSection tabActive={activeContentTab} />
          )}
        </Tabs.TabPane> */}
          {role !== "CREW" && (
            <Tabs.TabPane tab={<SettingsIcon />} key={4}>
              <Settings
                pusher={pusher}
                detailsOpen={detailsOpen}
                readOnlyState={readOnlyState}
                updateCompetition={_onUpdateCompetition}
                competitionState={competition}
                certificate={certificate}
                placementsData={placementsData}
                setPlacementsData={setPlacementsData}
              />
              {/* {console.log(activeContentTab)}
              {!competition?.current?.Crew?.length && (
                <EmptyContentSection tabActive={activeContentTab} />
              )} */}
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default ContentSection;
