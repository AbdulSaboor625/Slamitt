import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseOutlined,
  LoadingOutlined,
  PlusSquareFilled,
} from "@ant-design/icons";
import { Button, Image, Input, Spin, Switch, Tooltip, Typography } from "antd";

import {
  AppCSVuploadModal,
  AppDropDown,
  AppDynamicDropdown,
  AppSortPopOver,
  Scrollbar,
} from "../index";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  containersDragAndDrop,
  deleteContainerBulk,
  notify,
  selectOrUnselectContainer,
  setContainerActive,
  setContainersList,
  setSelectionOfContainers,
  updateCompetitionDetails,
} from "../../Redux/Actions";
import { CONTAINER_ROUND_CODE_LIMIT } from "../../utility/config";
import {
  ArrowBackIcon,
  ArrowNextIcon,
  ArrowRightIcon,
  CSVIcon,
  DeleteIcon,
  LinkIcon,
  ReplyIcon,
  SearchIcon,
  SettingsIcon,
} from "../../utility/iconsLibrary";
import AddTeamSizeModal from "../AppTeamSizeModal";
import DeleteContainerModal from "../modules/competitonsModule/DeleteContainerModal";
// import ContainerListSection from "./containerListSection";
import { arrayMoveImmutable } from "array-move";
import SortableList, { SortableItem, SortableKnob } from "react-easy-sort";
import useMediaQuery from "../../hooks/useMediaQuery";
import {
  capitalize,
  findUnassigned,
  weightedScoreCalculator,
} from "../../utility/common";
import { background1 } from "../../utility/imageConfig";
import AppTeamsItem from "../AppTeamsItem";
import AppUploadBulkReviewModal from "../AppUploadBulkReviewModal";
import RegistrationParticipantsModal from "../modules/competitonsModule/ContainerSection/registrationParticipantsModal";
import { useRouter } from "next/router";
import Api from "../../services";
import { List } from "react-virtualized";
import VirtualizedList from "../VirtualizedList";

const ContainersSection = ({
  readOnlyState,
  roomState,
  competitionState,
  createNewRoom,
  deleteRoom,
  selectRoom,
  updateRoom,
  moveContainer,
  moveContainerBulk,
  createContainer,
  onUpdateCompetition,
  detailsOpen,
  setDetailsOpen,
  isLaunchCompetitionModalOpen,
  isShowingSearch,
  showSearch,
  isVisibleTeamSizeModal,
  setVisibiltyTeamSizeModal,
  setContainerList,
  containerList,
  totalContainers,
  setTotalContainers,
  handleNextContainers,
  handlePreviousContainers,
  page,
  setPage,
  search,
  setSearch,
  handleSearch,
  fetchData,
  setFetchData,
  filter,
  setFilter,
}) => {
  const containerState = useSelector((state) => state.containers);
  const spinner = useSelector((state) => state.config.spinner);
  const { status } = useSelector((state) => state.config);
  const { role } = useSelector((state) => state.auth.user);
  const userEmail = useSelector((state) => state.auth.user.email);
  const inputRef = useRef();
  const competition = competitionState.current;
  const [isShowBulkUploadReviewModal, setShowBulkUploadReviewModal] =
    useState(false);
  const [csvReadedRows, setCsvReadedRows] = useState([]);
  const [isFoundSearch, setIsFound] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [isVisibleRegModal, setVisibleRegModal] = useState(false);
  const [containerCode, setContainerCode] = useState("");
  const [menuActive, setMenuActive] = useState("");
  // const [containerList, setContainerList] = useState(containerState?.all || []);
  // const [containerList, setContainerList] = useState([]);
  const [isContainerListRerranged, setisContainerListRerranged] =
    useState(false);
  const [isListModified, setIsListModified] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 22 }} spin />;
  const [allowRegistrationTrigger, setAllowRegistrationTrigger] = useState(
    competition?.allowRegistration
  );
  // const [teamSizePayload, setTeamSizepayload] = useState({});
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width: 1023px)");
  useEffect(() => {
    if (isContainerListRerranged && Array.isArray(containerState.all)) {
      setisContainerListRerranged(false);
    }
    // setContainerList(containerState.all);
  }, [containerState.all, containerState]);

  // useEffect( () => {
  //   if (roomState?.selected) {
  //     const response = await Api.get(
  //       `/container/list/${roomState?.selected?.competitionRoomCode}?page=1`
  //     );
  //     if (response.result && response.code) {
  //       const containers = response?.result?.data;
  //       containers.forEach((container, idx) => {
  //         container.index = container.index || idx + 1;
  //         container.points = 0;
  //         if (container.mockRoundData && container.mockRoundData.length) {
  //           container.mockRoundData.forEach((round) => {
  //             if (round?.Round?.isLive) {
  //               container.points += parseFloat(
  //                 (
  //                   (1.0 * round.roundScore * round?.Round?.roundWeightage) /
  //                   100.0
  //                 ).toFixed(3)
  //               );
  //             }
  //           });
  //         }
  //         if (container.roundData && container.roundData.length) {
  //           container.roundScores = {};
  //           container.roundData.forEach((round) => {
  //             if (round.roundScore && round.roundScore.length) {
  //               container.points += parseFloat(
  //                 weightedScoreCalculator(
  //                   round.roundScore
  //                     .filter(({ submit }) => submit === true)
  //                     .map((r) => ({
  //                       ...r,
  //                       assessment: r.assessment.filter(
  //                         ({ points }) => points !== null
  //                       ),
  //                     }))
  //                     .filter((v) => v.assessment.length),
  //                   round.Round.roundWeightage
  //                 )
  //               );
  //             }
  //           });
  //         }
  //       });
  //       setTotalContainers(response?.result?.total);
  //       setContainerList(containers);
  //       // dispatch(setContainersList(response?.result?.data));
  //     }
  //   }
  // }, []);

  const crewUser = competition?.crew?.find((c) => c.email === userEmail);
  const openRegister = () => {
    if (
      competition?.status === "ABANDON" ||
      competition?.status === "ABANDONED" ||
      competition?.status === "CONCLUDED" ||
      containerList[0]?.roomCode === "disqualified"
    )
      return false;
    else return true;
  };

  const handleSubmit = (newRoom) => {
    const titleCase = (str) => {
      return str.toLowerCase().replace(/(^|\s)\S/g, (L) => L.toUpperCase());
    };
    const roomName = titleCase(newRoom);
    createNewRoom(roomName);
  };
  const handleDelete = (room) => deleteRoom(room);
  const handleSelect = (room) => selectRoom(room);
  const handleUpdate = (room) => {
    const newName = room.roomName;
    const isExist = roomState?.all.find(
      (room) => room.roomName.toLowerCase() === newName.toLowerCase()
    );
    if (isExist)
      dispatch(
        notify({
          message: `${newName} is already exist in the list`,
          type: "error",
        })
      );
    else updateRoom(room);
  };
  const handleMoveContainer = (container) => moveContainer(container);
  const handleMoveContainerBulks = async (room, moveUnselected) => {
    await moveContainerBulk(room.roomCode, moveUnselected);
    handleCancelSelection();
  };
  const handleCreateContainer = (containerCode) => {
    const titleCase = (str) => {
      return str.toLowerCase().replace(/(^|\s)\S/g, (L) => L.toUpperCase());
    };
    const containerName = titleCase(containerCode);
    createContainer(containerName);
  };

  const onSelectContainer = (containerSelected, id) => {
    console.log("selection", containerSelected);
    if (containerState.selection) {
      let array = [];
      containerList.forEach((item) => {
        if (item?.containerCode === containerSelected?.containerCode) {
          array.push({ ...item, isSelected: !item.isSelected });
        } else {
          array.push(item);
        }
      });
      setContainerList(array);
      dispatch(selectOrUnselectContainer(containerSelected));
    } else if (menuActive !== "select") {
      dispatch(setContainerActive(containerSelected));
      setDetailsOpen(true);
    }
    if (id)
      setTimeout(() => {
        document?.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      }, 0);
  };

  const onSortEnd = (oldIndex, newIndex) => {
    setContainerList((array) => arrayMoveImmutable(array, oldIndex, newIndex));
    setIsListModified(true);
  };

  const saveRearrangment = () => {
    //replace containers in redux store with new list
    dispatch(containersDragAndDrop(containerList));
  };

  const staticRooms = [];
  const dynamicRooms = [];

  const rooms = roomState.all.map((room) => {
    const updateRoom = {
      ...room,
      key: room.competitionRoomCode,
      label: `${room.roomName} (${room.containersCount || 0})`,
      value: room.competitionRoomCode,
      containerCount: room.containersCount || 0,
      roomCode: room.roomCode,
    };

    if (room.roomCode === "qualified" || room.roomCode === "disqualified")
      staticRooms.push(updateRoom);
    else dynamicRooms.push(updateRoom);

    return updateRoom;
  });

  const moveableRooms = roomState?.all?.filter((room) => {
    if (room?.roomCode !== roomState?.selected?.roomCode) {
      room.label = `${room.roomName} (${room.containersCount || 0})`;
      room.key = room.competitionRoomCode;
      return room;
    }
  });

  const handleCancelSelection = () => {
    dispatch(setSelectionOfContainers());
    dispatch(selectOrUnselectContainer(null, true));
  };

  const countSelectedContainers = () => {
    let count = 0;
    containerState.all.forEach((container) => {
      if (container?.isSelected) count++;
    });
    return count;
  };

  const RoomDropDown = ({ label, iconShow = false }) => {
    const [value, setValue] = useState(label);
    return (
      <AppDynamicDropdown
        readOnlyState={readOnlyState}
        label={value}
        staticItems={staticRooms}
        dynamicItems={dynamicRooms}
        menu={rooms}
        iconShow={iconShow}
        handleSelect={handleSelect}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        setValue={setValue}
      />
    );
  };

  // team Size Modal Functions
  const [isSolo, switchSolo] = useState(
    competition?.competitionType === "SOLO" ? true : false
  );
  const [setupMinTeamSize, setSetupMinTeamSize] = useState(
    competition?.minTeamSize ? true : false
  );
  const [size, setSize] = useState({
    teamSize: competition?.teamSize === null ? 2 : competition?.teamSize || 2,
    minTeamSize: competition?.minTeamSize || 0,
  });
  const [isBelongsToSameOrgOrInstitute, setBelongsToSameOrgOrInstitute] =
    useState(null);
  const [useContainerCodePreDefined, setUseContainerCodePreDefined] = useState(
    competition?.useContainerCodePreDefined
  );

  useEffect(() => {
    if (competition?.competitionType === "SOLO") {
      switchSolo(true);
    }
    if (competition) {
      setUseContainerCodePreDefined(competition.useContainerCodePreDefined);
    }
  }, [competition]);

  const onSubmitTeamSize = async () => {
    let payload = {};
    if (isSolo) {
      payload.competitionType = "SOLO";
      payload.teamSize = null;
      payload.minTeamSize = null;
      payload.isBelongsToSameOrgOrInstitute = false;
      payload.useContainerCodePreDefined =
        findUnassigned(containerState.all).length > 0
          ? useContainerCodePreDefined
          : false;
    } else {
      payload = {
        ...size,
        competitionType: "TEAM",
        minTeamSize: setupMinTeamSize ? size.minTeamSize : null,
        useContainerCodePreDefined:
          findUnassigned(containerState.all).length > 0
            ? useContainerCodePreDefined
            : false,
      };
      if (
        isBelongsToSameOrgOrInstitute ||
        isBelongsToSameOrgOrInstitute === false
      )
        payload.isBelongsToSameOrgOrInstitute = isBelongsToSameOrgOrInstitute;
    }
    if (!isSolo) {
      await onUpdateCompetition({
        ...payload,
        allowRegistration:
          competition?.teamSize === null ? true : allowRegistrationTrigger,
      });
    } else {
      await onUpdateCompetition({
        ...payload,
        allowRegistration: allowRegistrationTrigger,
      });
    }
  };

  const ContainerUpdateRoomDropdown = ({ label, type = "selected" }) => {
    return (
      <AppDropDown
        label={label}
        iconShow={false}
        menu={moveableRooms}
        onClick={(e) => {
          handleMoveContainerBulks(
            moveableRooms[e.key],
            type === "selected" ? false : true
          );
        }}
      />
    );
  };

  const searchRef = useRef();
  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, [search]);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const AllowRegistrationSwitch = () => {
    return (
      <Switch
        checked={competition?.allowRegistration}
        onChange={(e) => {
          if (
            !competition ||
            (competition.competitionType === "TEAM" &&
              competition.teamSize === null)
          ) {
            setAllowRegistrationTrigger(true);
            setVisibiltyTeamSizeModal(e);
          } else {
            dispatch(
              updateCompetitionDetails({
                allowRegistration: e,
              })
            );
          }
        }}
      />
    );
  };

  const EmptyStateRegistrationSwitch = () => {
    return (
      <Typography.Text className={`competitionPlaceholderBoxText`}>
        or Turn on <strong>Registrations</strong>
        <Switch
          checked={
            competition?.allowRegistration
              ? competition?.allowRegistration
              : false
          }
          onChange={(e) => {
            if (
              !competition ||
              (competition.competitionType === "TEAM" &&
                competition.teamSize === null)
            ) {
              setVisibiltyTeamSizeModal(e);
              setAllowRegistrationTrigger(true);
            } else {
              dispatch(
                updateCompetitionDetails({
                  allowRegistration: e,
                })
              );
            }
          }}
        />{" "}
      </Typography.Text>
    );
  };

  const EmptyState = ({ from }) => {
    return (
      <div className="competitionPlaceholderBox manuallyPlaceholderBox">
        <Image
          preview={false}
          // src={background1}
          src={
            "https://rethink-competitions.s3.amazonaws.com/1669755981870_empty_state.png"
          }
          alt="img"
          height={200}
          width={200}
        />
        <Typography.Text className="competitionPlaceholderBoxText">
          {from === "DISQUALIFIED"
            ? "Move teams to Disqualified manually"
            : `Add teams to ${roomState?.selected?.roomName} list manually`}
        </Typography.Text>
        {from === "DISQUALIFIED" ? null : (
          <div className="competitionPlaceholderBoxTextbox">
            {!openRegister() ? null : role === "CREW" ? (
              crewUser?.permissions?.manageRegistrations ? (
                <EmptyStateRegistrationSwitch />
              ) : (
                <Typography.Text className={`competitionPlaceholderBoxText`}>
                  Or ask your Organiser for Registration Permission
                </Typography.Text>
              )
            ) : (
              <EmptyStateRegistrationSwitch />
            )}
          </div>
        )}
        {competition?.allowRegistration &&
          openRegister() &&
          from !== "DISQUALIFIED" && (
            <div className="buttonInviteWrap">
              <Button
                className="buttonInvite"
                onClick={() => setVisibiltyTeamSizeModal(true)}
              >
                Registration Settings
              </Button>
              <Button
                className="buttonInvite"
                onClick={() => setVisibleRegModal(true)}
              >
                Invite{" "}
                {competition?.competitionType === "TEAM"
                  ? "Team"
                  : "Participants"}
              </Button>
            </div>
          )}
      </div>
    );
  };

  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 229) {
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

  useEffect(() => {
    const selectContiner = async (containerCode) => {
      const res = await Api.get(
        `/container/get-single-container/${containerCode}`
      );
      dispatch(setContainerActive(res?.result));
      setTimeout(() => {
        document?.getElementById(containerCode)?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
        router.push({
          pathname: router.asPath.split("?").shift(),
          query: `content=containers`,
        });
      }, 0);
    };
    if (router.query.containerCode) selectContiner(router.query.containerCode);
  }, [router.query]);

  const scrollbarRef = useRef(null);
  const [fetching, setFetching] = useState(false);
  // const [page, setPage] = useState(1);
  // const [totalContainers, setTotalContainers] = useState(0);

  // const handleScroll = async () => {
  //   if (scrollbarRef.current && page) {
  //     const { scrollTop, scrollHeight, clientHeight } =
  //       scrollbarRef.current.view;
  //     const pad = 1;
  //     const t = (scrollTop + pad) / (scrollHeight - clientHeight);
  //     console.log(t);
  //     if (t > 1 && !fetching) {
  //       setFetching(true);
  //       if (containerState?.current) {
  //         const response = !search
  //           ? await Api.get(
  //               `/container/list/${
  //                 containerState?.current?.competitionRoomCode
  //               }?page=${page + 1}`
  //             )
  //           : await Api.post(
  //               `/container/filter/${
  //                 containerState?.current?.competitionRoomCode
  //               }?page=${page + 1}`,
  //               { containerName: search }
  //             );
  //         if (
  //           response.code &&
  //           response.result &&
  //           !!response.result?.data?.length
  //         ) {
  //           setTotalContainers(response?.result?.total);
  //           setContainerList((prev) => [...prev, ...response?.result?.data]);
  //           setPage(page + 1);
  //         }
  //       }
  //       setFetching(false);
  //     }
  //   }
  // };

  // const handleNextContainers = async () => {
  //   if (roomState?.selected && page !== Math.ceil(totalContainers / 10)) {
  //     const response = await Api.get(
  //       `/container/list/${roomState?.selected?.competitionRoomCode}?page=${
  //         page + 1
  //       }`
  //     );
  //     if (response.result && response.code) {
  //       const containers = response?.result?.data;
  //       containers.forEach((container, idx) => {
  //         container.index = container.index || idx + 1;
  //         container.points = 0;
  //         if (container.mockRoundData && container.mockRoundData.length) {
  //           container.mockRoundData.forEach((round) => {
  //             if (round?.Round?.isLive) {
  //               container.points += parseFloat(
  //                 (
  //                   (1.0 * round.roundScore * round?.Round?.roundWeightage) /
  //                   100.0
  //                 ).toFixed(3)
  //               );
  //             }
  //           });
  //         }
  //         if (container.roundData && container.roundData.length) {
  //           container.roundScores = {};
  //           container.roundData.forEach((round) => {
  //             if (round.roundScore && round.roundScore.length) {
  //               container.points += parseFloat(
  //                 weightedScoreCalculator(
  //                   round.roundScore
  //                     .filter(({ submit }) => submit === true)
  //                     .map((r) => ({
  //                       ...r,
  //                       assessment: r.assessment.filter(
  //                         ({ points }) => points !== null
  //                       ),
  //                     }))
  //                     .filter((v) => v.assessment.length),
  //                   round.Round.roundWeightage
  //                 )
  //               );
  //             }
  //           });
  //         }
  //       });
  //       setTotalContainers(response?.result?.total);
  //       setContainerList(containers);
  //       setPage((prev) => prev + 1);
  //     }
  //   }
  // };
  // const handlePreviousContainers = async () => {
  //   if (roomState?.selected && page !== 1) {
  //     const response = await Api.get(
  //       `/container/list/${roomState?.selected?.competitionRoomCode}?page=${
  //         page - 1
  //       }`
  //     );
  //     if (response.result && response.code) {
  //       const containers = response?.result?.data;
  //       containers.forEach((container, idx) => {
  //         container.index = container.index || idx + 1;
  //         container.points = 0;
  //         if (container.mockRoundData && container.mockRoundData.length) {
  //           container.mockRoundData.forEach((round) => {
  //             if (round?.Round?.isLive) {
  //               container.points += parseFloat(
  //                 (
  //                   (1.0 * round.roundScore * round?.Round?.roundWeightage) /
  //                   100.0
  //                 ).toFixed(3)
  //               );
  //             }
  //           });
  //         }
  //         if (container.roundData && container.roundData.length) {
  //           container.roundScores = {};
  //           container.roundData.forEach((round) => {
  //             if (round.roundScore && round.roundScore.length) {
  //               container.points += parseFloat(
  //                 weightedScoreCalculator(
  //                   round.roundScore
  //                     .filter(({ submit }) => submit === true)
  //                     .map((r) => ({
  //                       ...r,
  //                       assessment: r.assessment.filter(
  //                         ({ points }) => points !== null
  //                       ),
  //                     }))
  //                     .filter((v) => v.assessment.length),
  //                   round.Round.roundWeightage
  //                 )
  //               );
  //             }
  //           });
  //         }
  //       });
  //       setTotalContainers(response?.result?.total);
  //       setContainerList(containers);
  //       setPage((prev) => prev - 1);
  //     }
  //   }
  // };

  return (
    <div
      className={`competitionSidebarContent  ${isScrolled ? "item-fixed" : ""}`}
    >
      <DeleteContainerModal
        isModalVisible={isDeleteModalVisible}
        hideModal={() => setIsDeleteModalVisible(false)}
        deleteContainer={() => dispatch(deleteContainerBulk())}
      />

      {!readOnlyState && (
        <>
          {roomState?.selected?.roomCode !== "disqualified" && (
            <div className="competitionCodeField">
              <Typography.Text className="competitionCodeFieldLabel">
                Add{" "}
                {competition?.competitionType === "SOLO"
                  ? "Participants"
                  : "Teams"}{" "}
                by entering a{" "}
                {competition?.competitionType === "SOLO"
                  ? "participant"
                  : "team"}{" "}
                ID
              </Typography.Text>
              <div className="competitionCodeFieldWrap">
                <Input
                  onInput={(e) => (e.target.value = capitalize(e.target.value))}
                  // autoFocus={!isLaunchCompetitionModalOpen}
                  className="inputstyle"
                  type={"text"}
                  disabled={spinner.length}
                  placeholder={
                    competition?.competitionType === "SOLO"
                      ? "PARTICIPANT001"
                      : "TEAM001"
                  }
                  maxLength={CONTAINER_ROUND_CODE_LIMIT}
                  suffix={
                    spinner.length ? (
                      <Spin indicator={antIcon} />
                    ) : (
                      <Button
                        icon={<PlusSquareFilled />}
                        type="text"
                        disabled={!containerCode || spinner.length}
                        onClick={() =>
                          handleCreateContainer(containerCode.trimEnd())
                        }
                      />
                    )
                  }
                  value={containerCode}
                  onChange={(e) => setContainerCode(e.target.value.trimStart())}
                  onPressEnter={(e) => {
                    if (containerCode) {
                      handleCreateContainer(containerCode.trimEnd());
                    }
                  }}
                  onBlur={(e) => inputRef.current.blur()}
                  ref={inputRef}
                />
                <div className="competitionFileButton">
                  <Button
                    icon={
                      status === "active" ? (
                        // <div className="loader-icon" />
                        <div className="loader-icon" />
                      ) : (
                        <CSVIcon />
                      )
                    }
                    type="text"
                    onClick={() =>
                      competition.competitionType === "TEAM" &&
                      competition.teamSize === null
                        ? setVisibiltyTeamSizeModal(true)
                        : setVisible(true)
                    }
                    disabled={status === "active"}
                  />

                  <AddTeamSizeModal
                    switchSolo={switchSolo}
                    competition={competition}
                    isSolo={isSolo}
                    size={size}
                    setSize={setSize}
                    setupMinTeamSize={setupMinTeamSize}
                    setSetupMinTeamSize={setSetupMinTeamSize}
                    isBelongsToSameOrgOrInstitute={
                      isBelongsToSameOrgOrInstitute
                    }
                    setBelongsToSameOrgOrInstitute={
                      setBelongsToSameOrgOrInstitute
                    }
                    onSubmitTeamSize={onSubmitTeamSize}
                    isVisibleModal={isVisibleTeamSizeModal}
                    setVisibleModal={() => {
                      setVisibiltyTeamSizeModal(false);
                      // setAllowRegistrationTrigger(false);
                    }}
                    setVisibleCSVModal={setVisible}
                    onUpdateCompetition={onUpdateCompetition}
                    handleSubmit={onSubmitTeamSize}
                    containers={containerState.all}
                    useContainerCodePreDefined={useContainerCodePreDefined}
                    setUseContainerCodePreDefined={
                      setUseContainerCodePreDefined
                    }
                  />

                  <RegistrationParticipantsModal
                    roomCode={roomState?.selected?.roomCode || "qualified"}
                    room={roomState?.selected}
                    competition={competition}
                    isVisible={isVisibleRegModal}
                    setVisible={setVisibleRegModal}
                    setVisibiltyTeamSizeModal={setVisibiltyTeamSizeModal}
                  />

                  <AppCSVuploadModal
                    onSubmitTeamSize={onSubmitTeamSize}
                    competition={competition}
                    isVisible={isVisible}
                    setVisible={setVisible}
                    setVisibiltyTeamSizeModal={setVisibiltyTeamSizeModal}
                    setShowBulkUploadReviewModal={(rows) => {
                      setShowBulkUploadReviewModal(true);
                      setCsvReadedRows(rows);
                    }}
                  />
                  <AppUploadBulkReviewModal
                    isVisible={isShowBulkUploadReviewModal}
                    setVisible={setShowBulkUploadReviewModal}
                    csvReadedRows={csvReadedRows}
                    competition={competition}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <div className="competitionQualifiedDropdown">
        <RoomDropDown
          label={`${
            roomState?.selected?.roomName
              ? roomState?.selected?.roomName
              : "Qualified"
          } (${totalContainers})`}
          // } (${containerList?.length})`}
          iconShow
        />
        <div className="competitionQualifiedButtons">
          {containerState.selection ? (
            <>
              <Button
                className="participantsButtonSearch textCancel"
                type="text"
                onClick={handleCancelSelection}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              {Boolean(containerState.all[0]) ? (
                <>
                  {!isShowingSearch && (
                    <Button
                      className="participantsButtonSearch"
                      icon={<SearchIcon />}
                      type="text"
                      onClick={() => showSearch(true)}
                    />
                  )}
                  <AppSortPopOver
                    crewUser={crewUser}
                    role={role}
                    readOnlyState={readOnlyState}
                    handleCancelSelection={() =>
                      dispatch(selectOrUnselectContainer(null, true))
                    }
                    containers={containerList}
                    setContainers={setContainerList}
                    setisContainerListRerranged={setisContainerListRerranged}
                    menuActive={menuActive}
                    setMenuActive={setMenuActive}
                    filter={filter}
                    setFilter={setFilter}
                    setPage={setPage}
                  >
                    {/* <Button
                        className="participantsButtonSorting"
                        icon={<DotsIcon />}
                        type="text"
                      /> */}
                  </AppSortPopOver>
                </>
              ) : null}
            </>
          )}
        </div>
      </div>
      <div className="participantsTeamSearchBox">
        {isShowingSearch && (
          <Input
            ref={searchRef}
            className="inputstyle"
            placeholder={"Search Teams"}
            value={search}
            suffix={
              <CloseOutlined
                onClick={() => {
                  setSearch("");
                  setIsFound(true);
                  showSearch(false);
                  setFetchData((prev) => !prev);
                  // setContainerList(containerState.all);
                }}
              />
            }
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={handleSearch}
          />
        )}
      </div>
      <div className="competitionTeamsStatus">
        {/* {containerState.selection && (
          <Typography.Text className="textSize">
            {countSelectedContainers()} selected
          </Typography.Text>
        )} */}
        {containerState.selection && countSelectedContainers() ? (
          <>
            <div className="competitionTeamsRound space-between">
              <Button
                type="text"
                className="textSize"
                icon={<DeleteIcon />}
                onClick={() => setIsDeleteModalVisible(true)}
              >
                Delete
              </Button>
              <ContainerUpdateRoomDropdown
                label={
                  <Button
                    className="textSize"
                    icon={<ReplyIcon />}
                    type="text"
                    disabled={
                      containerState.selection &&
                      containerState.all.length - countSelectedContainers() ===
                        0
                    }
                  >
                    Move Unselected (
                    {containerState.selection &&
                      containerState.all.length - countSelectedContainers()}
                    )
                  </Button>
                }
                type="unselected"
              />
              <ContainerUpdateRoomDropdown
                label={
                  <Button className="textSize" icon={<ReplyIcon />} type="text">
                    Move {containerState.selection && countSelectedContainers()}
                  </Button>
                }
                type="selected"
              />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="competitionSidebarScroller">
        <>
          {containerList.length ? (
            <ul className="competitionTeamsList">
              {competition?.status !== "CONCLUDED" ? (
                // <Scrollbar
                //   autoHeight
                //   onScrollStop={handleScroll}
                //   scrollRef={scrollbarRef}
                // >
                <SortableList
                  onSortEnd={onSortEnd}
                  className="list"
                  draggedItemClassName="dragged"
                >
                  <>
                    <VirtualizedList
                      width={300}
                      height={400}
                      rowHeight={86}
                      rowCount={containerList?.length}
                      rowRenderer={({ key, index, style }) => (
                        <SortableItem key={key}>
                          <div className="item" style={style}>
                            <SortableKnob>
                              <AppTeamsItem
                                readOnlyState={readOnlyState}
                                competition={competition}
                                id={containerList?.[index]?.containerCode}
                                key={index}
                                isMobile={isMobile}
                                crewUser={crewUser}
                                container={containerList?.[index]}
                                selectionMood={containerState?.selection}
                                isSelected={containerList?.[index]?.isSelected}
                                onSelectContainer={onSelectContainer}
                                rooms={moveableRooms}
                                moveContainer={handleMoveContainer}
                                isActive={
                                  containerList?.[index]?.containerCode ===
                                  containerState?.current?.containerCode
                                }
                              />
                            </SortableKnob>
                          </div>
                        </SortableItem>
                      )}
                    />
                    {totalContainers > 10 && (
                      <div className="virtualPaginationButtons">
                        {page > 1 && (
                          <div
                            onClick={handlePreviousContainers}
                            className="nextContainersButton"
                          >
                            <ArrowLeftOutlined />
                          </div>
                        )}
                        <div>{`${page} / ${Math.ceil(
                          totalContainers / 10
                        )}`}</div>
                        {page < Math.ceil(totalContainers / 10) && (
                          <div
                            onClick={handleNextContainers}
                            className="prevContainersButton"
                          >
                            <ArrowRightOutlined />
                          </div>
                        )}
                      </div>
                    )}
                  </>
                </SortableList>
              ) : (
                // </Scrollbar>
                containerList.map((container, index) => (
                  <div className="item">
                    <AppTeamsItem
                      readOnlyState={readOnlyState}
                      competition={competition}
                      id={container?.containerCode}
                      key={index}
                      isMobile={isMobile}
                      crewUser={crewUser}
                      container={container}
                      selectionMood={containerState?.selection}
                      isSelected={container?.isSelected}
                      onSelectContainer={onSelectContainer}
                      rooms={moveableRooms}
                      moveContainer={handleMoveContainer}
                      isActive={
                        container.containerCode ===
                        containerState?.current?.containerCode
                      }
                    />
                  </div>
                ))
              )}
              {isListModified && (
                <button
                  className="saveChangesFloatingBox"
                  onClick={saveRearrangment}
                >
                  <Typography.Text className="saveChangesFloatingBoxTitle">
                    Save Changes{" "}
                  </Typography.Text>
                </button>
              )}
              {openRegister() ? (
                <div className={`registrationFloatingBox`}>
                  <Typography.Text className="registrationFloatingBoxTitle">
                    {role === "CREW" ? (
                      competition?.allowRegistration ? (
                        <div className="bg-green-400 registrationFloatingBoxTitleStatusIcon"></div>
                      ) : (
                        <div className="bg-red-400 registrationFloatingBoxTitleStatusIcon"></div>
                      )
                    ) : null}
                    {/* Registration is{" "} */}
                    {competition?.allowRegistration
                      ? "Registration is on"
                      : "Turn on Registrations"}
                    {competition?.allowRegistration && (
                      <div className="flex items-center space-x-3 registrationFloatingBoxButtons">
                        <Tooltip
                          title={"Invite Link"}
                          trigger={"hover"}
                          placement="top"
                          color={"black"}
                        >
                          <LinkIcon
                            className="linkIcon"
                            onClick={() => setVisibleRegModal(true)}
                          />
                        </Tooltip>
                        <Tooltip
                          title={"Team setup"}
                          trigger={"hover"}
                          placement="top"
                          color={"black"}
                        >
                          <SettingsIcon
                            className="linkIcon"
                            onClick={() => {
                              setVisibiltyTeamSizeModal(true);
                              // router.push(
                              //   `/auth/competitions/o/${competition?.competitionCode}?content=settings&tab=registration`
                              // )
                            }}
                          />
                        </Tooltip>
                      </div>
                    )}{" "}
                  </Typography.Text>
                  {role === "CREW" ? (
                    crewUser?.permissions?.manageRegistrations ? (
                      <AllowRegistrationSwitch />
                    ) : null
                  ) : (
                    <AllowRegistrationSwitch />
                  )}
                </div>
              ) : null}
            </ul>
          ) : (
            <div className="competitionSidebarWrapper">
              {isFoundSearch ? (
                <div>No result found</div>
              ) : !readOnlyState ? (
                <>
                  {roomState?.selected?.roomCode !== "disqualified" ? (
                    <EmptyState />
                  ) : (
                    <EmptyState from="DISQUALIFIED" />
                  )}
                </>
              ) : (
                <div className="competitionPlaceholderBox manuallyPlaceholderBox">
                  <Image
                    preview={false}
                    src={background1}
                    alt="img"
                    height={200}
                    width={200}
                  />
                  <Typography.Text className="competitionPlaceholderBoxText">
                    {`No ${
                      competition?.competitionType === "SOLO"
                        ? "participants"
                        : "teams"
                    } were added to this list`}
                  </Typography.Text>
                </div>
              )}
            </div>
          )}
        </>
        {/* <ContainerListSection
          readOnlyState={readOnlyState}
          setDetailsOpen={setDetailsOpen}
          foundSearch={isFoundSearch}
          roomDropDown={<RoomDropDown label={<ReplyIcon />} />}
          containers={containerState}
          rooms={rooms}
          roomState={roomState}
          handleMoveContainer={handleMoveContainer}
          containerList={containerList}
          setContainerList={setContainerList}
          competitionType={competition?.competitionType}
        /> */}
      </div>
    </div>
  );
};

export default ContainersSection;
