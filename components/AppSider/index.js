import { Button, Image, Tooltip, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditBasicSettingsModal from "../modules/competitonsModule/Settings/editBasicSettingsModal";
import ChatsSection from "./chatsSection";
import ContainersSection from "./containersSection";
import RoundsSection from "./roundsSection";

import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { useRouter } from "next/router";
import {
  ScrollHandle,
  createContainer,
  createRoom,
  deactivateUploadRequest,
  deleteRoom,
  getAllContainers,
  getAllContainersChat,
  getAllRooms,
  getAllRoundContainers,
  getAllRounds,
  getChatToken,
  getQualifiedContainers,
  notify,
  setContainerSelectedChat,
  setRoomSelected,
  setRoomSelectedChat,
  setSettingSectionActive,
  updateCompetitionDetails,
  updateContainer,
  updateContainerBulk,
  updateRoom,
} from "../../Redux/Actions";
import { SET_CONTAINER_ACTIVE } from "../../Redux/actionTypes";
import Api from "../../services";
import {
  getPresenceChannelName,
  weightedScoreCalculator,
} from "../../utility/common";
import { socketEvents } from "../../utility/config";
import { CrewNewIcon, SettingsIcon } from "../../utility/iconsLibrary";
import SettingsSection from "./settingsSection";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

const AppSider = ({
  readOnlyState,
  activeContentTab,
  redirectToRound,
  redirectToSettings,
  detailsOpen,
  setDetailsOpen,
  pusher,
  isLaunchCompetitionModalOpen,
  isVisibleTeamSizeModal,
  setVisibiltyTeamSizeModal,
}) => {
  const router = useRouter();
  const { competitionCode } = router.query;
  const competitionState = useSelector((state) => state.competition);
  const roomState = useSelector((state) => state.rooms);
  const chatState = useSelector((state) => state.chat);
  const user = useSelector((state) => state.auth.user);
  const containers = useSelector((state) => state.containers.all);
  const dispatch = useDispatch();
  const competition = useSelector((state) => state.competition);

  const [isVisible, setVisibility] = useState(false);
  const [isEditName, setEditName] = useState(false);

  const [isShowingSearchContainers, setIsShowingSearchContainers] =
    useState(false);

  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);

  useEffect(() => {
    if (
      roomState &&
      roomState.selected &&
      roomState.selected.competitionRoomCode
    ) {
      const competitionRoomCode = roomState.selected.competitionRoomCode;
      const competitionCode = roomState.selected.competitionCode;

      const channel = pusher.subscribe(
        getPresenceChannelName(competitionRoomCode)
      );

      channel.bind("receive_message", (payload) => {
        if (
          payload.event === socketEvents.room_containers_update ||
          payload.event === socketEvents.container_fetch_score ||
          payload.event === socketEvents.participant_invitation
        ) {
          dispatch(getAllContainers(roomState.selected, false));
          // dispatch(getQualifiedContainers());
        } else if (payload.event === socketEvents.round_score_update) {
          getRegistrations();
        } else if (payload.event === socketEvents.judge_status_update) {
          dispatch(getAllRounds({ cCode: "" }));
        } else if (payload.event === socketEvents.new_container_created) {
          setFetchData((prev) => !prev);
          dispatch(getAllContainers(roomState.selected, false));
          dispatch(getAllContainers());
          dispatch(getAllRooms(competitionCode));
        }
        if (payload.event === socketEvents.BULK_CREATE_CONTAINERS) {
          if (!payload.isLoading) {
            dispatch(getAllRooms(competitionCode));
            dispatch(deactivateUploadRequest());
          }
        }
      });
    }
  }, [
    roomState && roomState.selected && roomState.selected.competitionRoomCode,
  ]);

  useEffect(() => {
    if (competition?.current) {
      const channel = pusher.subscribe(
        getPresenceChannelName(competition?.current?.competitionCode)
      );

      channel.bind("receive_message", (payload) => {
        if (
          payload.event === socketEvents.round_live ||
          payload?.event === socketEvents?.container_fetch_score
        ) {
          dispatch(getAllRooms(competition?.current?.competitionCode));
          getRegistrations();
        }
      });
    }
  }, [competition?.current]);

  useEffect(() => {
    if (roomState.all.length) dispatch(setRoomSelected(roomState.all[0]));
    if (chatState.rooms.length)
      dispatch(setRoomSelectedChat(chatState.rooms[0]));
  }, []);

  useEffect(() => {
    if (roomState.selected) {
      dispatch(getAllContainers(roomState.selected, true));
    }
  }, [roomState.selected.roomCode]);

  useEffect(() => {
    dispatch(setRoomSelectedChat(chatState.rooms[0]));
  }, [chatState.rooms]);

  useEffect(() => {
    if (!chatState.room) dispatch(getAllContainersChat(chatState.rooms[0]));
    else dispatch(getAllContainersChat(chatState.room));
  }, [chatState.room]);

  const createNewRoom = (roomName) => dispatch(createRoom(roomName));
  const onDeleteRoom = async (room) => {
    const response = await Api.get(`/container/${room.competitionRoomCode}`);
    let allContainer;
    if (response.code && response.result) {
      allContainer = response.result;
      if (!!allContainer.length) {
        allContainer?.map((container) => {
          dispatch(updateContainer({ ...container, isDeleted: true }));
        });
      }
      dispatch(deleteRoom(room));
      dispatch(setRoomSelected(roomState.all[0]));
      // if (allContainer.length < 1) {
      //   dispatch(deleteRoom(room));
      //   dispatch(setRoomSelected(roomState.all[0]));
      // } else {
      //   dispatch(
      //     notify({
      //       type: "error",
      //       message: `You have to remove all ${
      //         competitionState.current.competitionType === "SOLO"
      //           ? "participants"
      //           : "teams"
      //       } from here to delete the room`,
      //     })
      //   );
      // }
    } else {
      dispatch(notify({ type: "error", message: "Something Wrong" }));
    }
  };
  const onSelectRoom = (room) => {
    dispatch(setRoomSelected(room));
    dispatch(getAllContainers(room));
  };
  const onUpdateRoom = (room) => dispatch(updateRoom(room));
  const onMoveContainer = (container) => {
    dispatch(updateContainer(container));
    // dispatch({
    //   type: SET_CONTAINER_ACTIVE,
    //   container: containers.length > 1 ? containers[1] : null,
    // });
  };
  const onMoveContainerBulk = (roomCode, moveUnselected) => {
    dispatch(updateContainerBulk(roomCode, moveUnselected));
    // dispatch({
    //   type: SET_CONTAINER_ACTIVE,
    //   container: containers[0],
    // });
  };
  const onCreateContainer = (containerCode) => {
    dispatch(createContainer(containerCode));
  };

  const changeSettingsSection = (section) =>
    dispatch(setSettingSectionActive(section));
  const onChatSelectRoom = (room) => dispatch(setRoomSelectedChat(room));
  const onChatSelectContainer = (container, isGroupChat) => {
    dispatch(setContainerSelectedChat(container, isGroupChat));
    setDetailsOpen(true);
  };

  const _onUpdateCompetition = (payload) => {
    dispatch(updateCompetitionDetails(payload));
    // setTimeout(() => {
    //   dispatch(ScrollHandle(""))
    // }, 9000);
  };

  useEffect(() => {
    if (chatState.token) {
      if (isConnected) {
        hmsActions.leave().then((r) =>
          hmsActions.join({
            userName: user.userCode,
            authToken: chatState.token,
            settings: {
              isAudioMuted: true,
            },
          })
        );
      } else {
        hmsActions.join({
          userName: user.userCode,
          authToken: chatState.token,
          settings: {
            isAudioMuted: true,
          },
        });
      }
    }
  }, [chatState.token]);

  useEffect(() => {
    let role = "";
    if (window.location.pathname.includes("/o/")) role = "organizer";
    else if (window.location.pathname.includes("/c/")) role = "crew";
    else if (window.location.pathname.includes("/p/")) role = "participant";

    // if (chatState.container.containerCode || chatState.container.roomCode)
    dispatch(getChatToken(role));
  }, [chatState.container.containerCode || chatState.container.roomCode]);

  useEffect(() => {
    let role = "";
    if (window.location.pathname.includes("/o/")) role = "organizer";
    else if (window.location.pathname.includes("/c/")) role = "crew";
    else if (window.location.pathname.includes("/p/")) role = "participant";

    if (activeContentTab === "CHAT") {
      if (chatState.container.containerCode || chatState.container.roomCode)
        dispatch(getChatToken(role));
    }
  }, [activeContentTab]);

  const [page, setPage] = useState(1);
  const [totalContainers, setTotalContainers] = useState(0);
  const [containerList, setContainerList] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    sortBy: "",
    type: "",
  });

  const handleSearch = async (e) => {
    // setSearch(e.target.value.toLowerCase());
    // const search = e.target.value.toLowerCase();
    const response = await Api.post(
      `/container/filter/${roomState?.selected?.competitionRoomCode}?page=${1}`,
      { containerName: search }
    );
    if (response?.result && response?.code) {
      setTotalContainers(response?.result?.total);
      setContainerList(response.result?.data);
    }
  };

  const [fetchData, setFetchData] = useState(false);

  const getRegistrations = async () => {
    const response = await Api.post(
      `/container/list/${
        roomState?.selected?.competitionRoomCode
          ? roomState?.selected?.competitionRoomCode
          : containers?.[0]?.competitionRoomCode
          ? containers?.[0]?.competitionRoomCode
          : `${competition?.current?.competitionCode}-qualified`
      }?page=1`,
      { sortBy: filter.sortBy, type: filter.type }
    );
    if (response.result && response.code) {
      const containers = response?.result?.data;
      // containers.forEach((container, idx) => {
      //   container.index = container.index || idx + 1;
      //   container.points = 0;
      //   if (container.mockRoundData && container.mockRoundData.length) {
      //     container.mockRoundData.forEach((round) => {
      //       if (round?.Round?.isLive) {
      //         container.points += parseFloat(
      //           (
      //             (1.0 * round.roundScore * round?.Round?.roundWeightage) /
      //             100.0
      //           ).toFixed(3)
      //         );
      //       }
      //     });
      //   }
      //   if (container.roundData && container.roundData.length) {
      //     container.roundScores = {};
      //     container.roundData.forEach((round) => {
      //       if (round.roundScore && round.roundScore.length) {
      //         container.points += parseFloat(
      //           weightedScoreCalculator(
      //             round.roundScore
      //               .filter(({ submit }) => submit === true)
      //               .map((r) => ({
      //                 ...r,
      //                 assessment: r.assessment.filter(
      //                   ({ points }) => points !== null
      //                 ),
      //               }))
      //               .filter((v) => v.assessment.length),
      //             round.Round.roundWeightage
      //           )
      //         );
      //       }
      //     });
      //   }
      // });
      setTotalContainers(response?.result?.total);
      setContainerList(response?.result?.data);
    }
  };
  useEffect(() => {
    if (roomState?.selected) getRegistrations();
  }, [roomState, fetchData, filter]);

  const handleNextContainers = async () => {
    if (roomState?.selected && page !== Math.ceil(totalContainers / 10)) {
      const response = !search
        ? await Api.post(
            `/container/list/${roomState?.selected?.competitionRoomCode}?page=${
              page + 1
            }`,
            { sortBy: filter.sortBy, type: filter.type }
          )
        : await Api.post(
            `/container/filter/${
              roomState?.selected?.competitionRoomCode
            }?page=${page + 1}`,
            { containerName: search }
          );
      if (response.result && response.code) {
        const containers = response?.result?.data;
        // containers.forEach((container, idx) => {
        //   container.index = container.index || idx + 1;
        //   container.points = 0;
        //   if (container.mockRoundData && container.mockRoundData.length) {
        //     container.mockRoundData.forEach((round) => {
        //       if (round?.Round?.isLive) {
        //         container.points += parseFloat(
        //           (
        //             (1.0 * round.roundScore * round?.Round?.roundWeightage) /
        //             100.0
        //           ).toFixed(3)
        //         );
        //       }
        //     });
        //   }
        //   if (container.roundData && container.roundData.length) {
        //     container.roundScores = {};
        //     container.roundData.forEach((round) => {
        //       if (round.roundScore && round.roundScore.length) {
        //         container.points += parseFloat(
        //           weightedScoreCalculator(
        //             round.roundScore
        //               .filter(({ submit }) => submit === true)
        //               .map((r) => ({
        //                 ...r,
        //                 assessment: r.assessment.filter(
        //                   ({ points }) => points !== null
        //                 ),
        //               }))
        //               .filter((v) => v.assessment.length),
        //             round.Round.roundWeightage
        //           )
        //         );
        //       }
        //     });
        //   }
        // });
        setTotalContainers(response?.result?.total);
        setContainerList(response?.result?.data);
        setPage((prev) => prev + 1);
      }
    }
  };
  const handlePreviousContainers = async () => {
    if (roomState?.selected && page !== 1) {
      const response = !search
        ? await Api.post(
            `/container/list/${roomState?.selected?.competitionRoomCode}?page=${
              page - 1
            }`,
            { sortBy: filter.sortBy, type: filter.type }
          )
        : await Api.post(
            `/container/filter/${
              roomState?.selected?.competitionRoomCode
            }?page=${page - 1}`,
            { containerName: search }
          );
      if (response.result && response.code) {
        const containers = response?.result?.data;
        // containers.forEach((container, idx) => {
        //   container.index = container.index || idx + 1;
        //   container.points = 0;
        //   if (container.mockRoundData && container.mockRoundData.length) {
        //     container.mockRoundData.forEach((round) => {
        //       if (round?.Round?.isLive) {
        //         container.points += parseFloat(
        //           (
        //             (1.0 * round.roundScore * round?.Round?.roundWeightage) /
        //             100.0
        //           ).toFixed(3)
        //         );
        //       }
        //     });
        //   }
        //   if (container.roundData && container.roundData.length) {
        //     container.roundScores = {};
        //     container.roundData.forEach((round) => {
        //       if (round.roundScore && round.roundScore.length) {
        //         container.points += parseFloat(
        //           weightedScoreCalculator(
        //             round.roundScore
        //               .filter(({ submit }) => submit === true)
        //               .map((r) => ({
        //                 ...r,
        //                 assessment: r.assessment.filter(
        //                   ({ points }) => points !== null
        //                 ),
        //               }))
        //               .filter((v) => v.assessment.length),
        //             round.Round.roundWeightage
        //           )
        //         );
        //       }
        //     });
        //   }
        // });
        setTotalContainers(response?.result?.total);
        setContainerList(response?.result?.data);
        setPage((prev) => prev - 1);
      }
    }
  };

  const ActiveTabSection = () => {
    switch (activeContentTab) {
      case "CHAT":
        return (
          <ChatsSection
            detailsOpen={detailsOpen}
            setDetailsOpen={setDetailsOpen}
            {...chatState}
            selectRoom={onChatSelectRoom}
            handleSelectContainer={onChatSelectContainer}
          />
        );

      case "ROUND":
        return (
          <RoundsSection
            readOnlyState={readOnlyState}
            setDetailsOpen={setDetailsOpen}
            isLaunchCompetitionModalOpen={isLaunchCompetitionModalOpen}
            setFetchData={setFetchData}
          />
        );
      case "CONTAINERS":
        return (
          <>
            <ContainersSection
              isShowingSearch={isShowingSearchContainers}
              showSearch={setIsShowingSearchContainers}
              readOnlyState={readOnlyState}
              isLaunchCompetitionModalOpen={isLaunchCompetitionModalOpen}
              roomState={roomState}
              competitionState={competitionState}
              deleteRoom={onDeleteRoom}
              createNewRoom={createNewRoom}
              selectRoom={onSelectRoom}
              updateRoom={onUpdateRoom}
              moveContainer={onMoveContainer}
              moveContainerBulk={onMoveContainerBulk}
              createContainer={onCreateContainer}
              redirectToRound={redirectToRound}
              onUpdateCompetition={_onUpdateCompetition}
              detailsOpen={detailsOpen}
              setDetailsOpen={setDetailsOpen}
              isVisibleTeamSizeModal={isVisibleTeamSizeModal}
              setVisibiltyTeamSizeModal={setVisibiltyTeamSizeModal}
              setTotalContainers={setTotalContainers}
              totalContainers={totalContainers}
              setContainerList={setContainerList}
              containerList={containerList}
              handlePreviousContainers={handlePreviousContainers}
              handleNextContainers={handleNextContainers}
              page={page}
              setPage={setPage}
              search={search}
              setSearch={setSearch}
              handleSearch={handleSearch}
              setFetchData={setFetchData}
              fetchData={fetchData}
              filter={filter}
              setFilter={setFilter}
            />
            {/* <div className="virtualPaginationButtons">
              <div
                onClick={handlePreviousContainers}
                className="nextContainersButton"
              >
                <ArrowLeftOutlined />
              </div>
              <div>{`${page} / ${Math.ceil(totalContainers / 10)}`}</div>
              <div
                onClick={handleNextContainers}
                className="prevContainersButton"
              >
                <ArrowRightOutlined />
              </div>
            </div> */}
          </>
        );
      case "SETTINGS":
        return (
          <SettingsSection
            setDetailsOpen={setDetailsOpen}
            onChangeSettingSection={changeSettingsSection}
          />
        );
      default:
        return <div />;
    }
  };
  return (
    <>
      <div className="competitionSidebarHolder">
        <EditBasicSettingsModal
          isVisible={isVisible}
          setVisibility={setVisibility}
          editName={isEditName}
          competition={competitionState?.current}
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
          {competitionState?.current?.emojiObject ? (
            <p className="competitionSidebarTitleEmoji">
              {competitionState?.current?.emojiObject.emoji}
            </p>
          ) : (
            <Image
              src={competitionState?.current?.imageURL}
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
              {competitionState?.current?.competitionName}
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
            <Tooltip title={competitionState?.current?.category?.categoryName}>
              <span className="subCategory">
                {competitionState?.current?.category?.categoryName}
              </span>
            </Tooltip>
          </Typography.Title>
          {user?.role !== "CREW" && (
            <Button
              onClick={() => {
                redirectToSettings();
                router.push(
                  `/auth/competitions/o/${competitionCode}?content=${"settings"}`
                );
              }}
              icon={<SettingsIcon />}
              className={`mobile:block laptop:hidden settingsButton ${
                router?.query?.content === "settings" && "active"
              }`}
            />
          )}
        </div>
        <ActiveTabSection />
      </div>
    </>
  );
};

export default AppSider;
