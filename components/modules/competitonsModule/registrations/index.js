import {
  Button,
  DatePicker,
  Image,
  Input,
  Spin,
  Switch,
  Table,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteContainerBulk,
  getCompetitionByCompetitionCode,
  rearrangeContainers,
  selectOrUnselectContainer,
  setRegistrationsList,
  updateCompetitionDetails,
  updateContainerBulk,
} from "../../../../Redux/Actions";
import Api from "../../../../services";
import {
  encodeBase64,
  findUnassigned,
  getPresenceChannelName,
  titleCase,
} from "../../../../utility/common";
import {
  routeGenerator,
  routes,
  socketEvents,
} from "../../../../utility/config";
import { exportRegistration } from "../../../../utility/excelService";
import {
  ExpoertCSVIcon,
  BulkUploadIcon,
  SettingsIcon,
  ReplyIcon,
  DeleteIcon,
  SortDescendingIcon,
  SortAscendingIcon,
  CrossCircleIcon,
  CheckedGreenIcon,
  DotsIcon,
  ReplyNewIcon,
  CrossNewIcon,
  ArrowBackIcon,
  ArrowNextIcon,
} from "../../../../utility/iconsLibrary";
import { team } from "../../../../utility/imageConfig";
import AppNameAvater from "../../../AppAvatar/AppNameAvater";
import AppCSVuploadModal from "../../../AppCSVuploadModal";
import AppUploadBulkReviewModal from "../../../AppUploadBulkReviewModal";
import RegistrationParticipantsModal from "../ContainerSection/registrationParticipantsModal";
import ConcludedRegistrationSetup from "./concludedRegistrationSetup";
import moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";
import AddTeamSizeModal from "../../../AppTeamSizeModal";
import AppSortPopOver from "../../../AppSortPopover";
import AppDropDown from "../../../AppDropdown";
import DeleteContainerModal from "../DeleteContainerModal";
import { useRef } from "react";
import Scrollbar from "../../../Scrollbar";
import VirtualizedList from "../../../VirtualizedList";
import RegistrationTable from "./RegistrationTable";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

const RegistrationTab = ({ pusher }) => {
  const [setUpModalVisible, setSetUpModalVisible] = React.useState(false);
  const competition = useSelector((state) => state.competition.current);
  const containerState = useSelector((state) => state.containers);
  const roomState = useSelector((state) => state.rooms);
  const token = encodeBase64(useSelector((state) => state.auth.slamittToken));

  const [searchInput, setSearchInput] = useState(null);

  const dispatch = useDispatch();

  const [registrationData, setRegistrationData] = React.useState([]);
  const [isVisibleRegModal, setIsVisibleRegModal] = React.useState(false);
  const [isVisibleBulkModal, setIsVisibleBulkModal] = React.useState(false);
  const [isVisibleBulkReviewModal, setIsVisibleBulkReviewiModal] =
    React.useState(false);
  const [csvReadedRows, setCsvReadedRows] = React.useState(false);
  const [loading, setLoading] = useState(false);

  //Sort Popover
  const [isContainerListRerranged, setisContainerListRerranged] =
    useState(false);
  const [menuActive, setMenuActive] = useState("");

  const [triggerReload, setTriggerReload] = useState(false);
  const [page, setPage] = useState(1);
  const [registrationsCount, setRegistrationCount] = useState(0);

  const registrations = useSelector(
    (state) => state.paginatedContainers.registrationsList
  );

  // useEffect(() => {
  //   if (registrations.length) setRegistrationData(registrations);
  // }, [registrations]);

  const getRegistrations = async (competitionCode) => {
    try {
      // const response = await Api.get(
      //   `/container/get-all-containers/filter?competitionCode=${competition?.competitionCode}`
      // );
      const response = await Api.get(
        `/container/get-all-containers/${competitionCode}?page=${1}`
      );
      if (response?.result && response?.code) {
        setRegistrationCount(response?.result?.total);
        const data = [];
        response?.result?.data?.map((cont) => {
          cont?.users.forEach((item) => {
            data.push({
              containerCode: cont.containerCode,
              containerName: cont?.containerName,
              list: cont?.roomCode,
              user: item,
            });
          });
        });
        const containerCounts = {};
        const modifiedData = [];
        let idx = 0;

        for (const item of data) {
          if (!containerCounts[item.containerName]) {
            containerCounts[item.containerName] = 1;
            modifiedData.push({ ...item, index: idx });
            idx++;
          } else {
            containerCounts[item.containerName]++;
            if (containerCounts[item.containerName] > 1) {
              modifiedData.push({ ...item, containerName: "" });
            } else {
              modifiedData.push({ ...item, index: idx });
              idx++;
            }
          }
        }
        setRegistrationData(modifiedData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (competition) {
      getRegistrations(competition?.competitionCode);
    }
  }, [competition, triggerReload]);

  useEffect(() => {
    const channel = pusher.subscribe(
      getPresenceChannelName(competition?.competitionCode)
    );

    channel.bind("receive_message", (payload) => {
      console.log("containerState", payload);
      if (
        payload.event === socketEvents?.room_containers_update ||
        payload.event === socketEvents?.BULK_CREATE_CONTAINERS
      ) {
        getRegistrations(competition?.competitionCode);
      }
    });
  }, [competition]);

  // const fakeData = [
  //   {
  //     containerName: "Code 1",
  //     firstName: "John",
  //     lastName: "Doe",
  //   },
  //   {
  //     containerName: "Code 1",
  //     firstName: "John",
  //     lastName: "Doe",
  //   },
  //   {
  //     containerName: "Code 1",
  //     firstName: "John",
  //     lastName: "Doe",
  //   },
  //   {
  //     containerName: "Code 2",
  //     firstName: "John",
  //     lastName: "Doe",
  //   },
  //   {
  //     containerName: "Code 2",
  //     firstName: "John",
  //     lastName: "Doe",
  //   },
  //   {
  //     containerName: "Code 2",
  //     firstName: "John",
  //     lastName: "Doe",
  //   },
  // ];

  const [isSolo, switchSolo] = useState(
    competition?.competitionType === "SOLO" ? true : false
  );
  const [setupMinTeamSize, setSetupMinTeamSize] = useState(
    competition?.minTeamSize ? true : false
  );
  const [useContainerCodePreDefined, setUseContainerCodePreDefined] = useState(
    competition?.useContainerCodePreDefined
  );
  const [size, setSize] = useState({
    teamSize: competition?.teamSize === null ? 2 : competition?.teamSize || 2,
    minTeamSize: competition?.minTeamSize || 0,
  });
  const [allowRegistrationTrigger, setAllowRegistrationTrigger] = useState(
    competition?.allowRegistration
  );
  const [isBelongsToSameOrgOrInstitute, setBelongsToSameOrgOrInstitute] =
    useState(null);
  useEffect(() => {
    if (competition?.competitionType === "SOLO") {
      switchSolo(true);
    }
    if (competition) {
      setUseContainerCodePreDefined(competition.useContainerCodePreDefined);
    }
  }, [competition]);

  const onUpdateCompetition = (payload) => {
    dispatch(updateCompetitionDetails(payload));
  };

  useEffect(() => {
    if (competition) {
      const channel = pusher.subscribe(
        getPresenceChannelName(competition?.competitionCode)
      );

      channel.bind("receive_message", (payload) => {
        if (payload.event === "UPDATE_COMPETITION_VIEWS") {
          dispatch(
            getCompetitionByCompetitionCode({
              competitionCode: competition?.competitionCode,
            })
          );
        }
      });
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
      onUpdateCompetition({
        ...payload,
        allowRegistration:
          competition?.teamSize === null ? true : allowRegistrationTrigger,
      });
    } else {
      onUpdateCompetition({
        ...payload,
        allowRegistration: allowRegistrationTrigger,
      });
    }
  };

  // Sorting and selecting states and functions
  const [selectedContiners, setSelectedContainers] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const sortType = {
    ASCENDING: "ASCENDING",
    DESCENDING: "DESCENDING",
  };

  const moveableRooms = roomState?.all?.filter((room) => {
    room.label = `${room.roomName} (${room.containersCount || 0})`;
    room.key = room.competitionRoomCode;
    return room;
  });

  const handleCancelSelection = () => {
    registrationData.forEach((item) => {
      item.isSelected = false;
    });
  };

  const onMoveContainerBulk = (roomCode, moveUnselected) => {
    let selected = [];
    if (moveUnselected) {
      registrationData.forEach((item) => {
        if (!item.containerCode.includes(selectedContiners)) {
          selected.push(item.containerCode);
        }
      });
    } else {
      selected = selectedContiners;
    }
    dispatch(updateContainerBulk(roomCode, moveUnselected, selected));
    handleCancelSelection();
    setTriggerReload((prev) => !prev);
  };

  const handleMoveContainerBulks = (room, moveUnselected) => {
    onMoveContainerBulk(room.roomCode, moveUnselected);
    setSelectedContainers([]);
  };

  // useEffect(() => {
  //   setLoading(false);
  // }, [registrations?.length]);
  useEffect(() => {
    setLoading(false);
  }, [registrationData?.length]);
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
          setSelectedContainers([]);
          setSelection(false);
          setTriggerReload((prev) => !prev);
        }}
      />
    );
  };
  const handleSorting = (type, value = null) => {
    setisContainerListRerranged(true);
    if (type === "ALPHABETICAL") {
      if (value === sortType.ASCENDING) {
        dispatch(rearrangeContainers(containerState?.all, sortType.ASCENDING));
      }
      if (value === sortType.DESCENDING) {
        dispatch(rearrangeContainers(containerState?.all, sortType.DESCENDING));
      }
    }
  };

  const [searchText, setSearchText] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchText]);

  const searchHandler = (e) => {
    setSearchText(e.target.value);
  };

  const RegistrationTabHeader = () => {
    return (
      <>
        <div className="registrationsContentHeader">
          <div className="registrationsContentPrimaryHeader">
            {/* switch for turn on registration */}
            <div
              className={`registrationsContentPrimaryHeaderStatus ${
                competition?.allowRegistration ? "open" : ""
              }`}
            >
              {competition?.status == "ACTIVE" ? (
                <Typography.Text className="title">
                  Registrations are{" "}
                  {competition?.allowRegistration ? "Open" : "Closed"}
                </Typography.Text>
              ) : !competition?.allowRegistration ? (
                <Typography.Text className="title">
                  Registrations were open till{" "}
                  {moment(
                    competition?.registrationClosedOn ?? competition?.updatedAt
                  ).format("h:mm A [on] DD/MM/YYYY")}
                </Typography.Text>
              ) : (
                <Typography.Text className="title">
                  Registrations were open till{" "}
                  {moment(competition?.updatedAt).format(
                    "h:mm A [on] DD/MM/YYYY"
                  )}
                </Typography.Text>
              )}
              <SettingsIcon
                className="cursor-pointer settingsButton"
                onClick={() => setSetUpModalVisible(true)}
              />
              {competition?.allowRegistration &&
                competition?.status == "ACTIVE" && (
                  <Typography.Text
                    className="linkCopy"
                    copyable={{
                      text: routeGenerator(
                        routes.inviteParticipantRegistration,
                        {
                          competitionCode: competition?.competitionCode,
                          roomCode: "qualified",
                          token: token,
                        },
                        true
                      ),
                    }}
                  >
                    <span className="linkCopyText">
                      <img
                        src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1676919440568_Vector.svg"
                        alt=""
                      />
                      <span className="linkCopyTextLink">
                        {routeGenerator(
                          routes.inviteParticipantRegistration,
                          {
                            competitionCode: competition?.competitionCode,
                            roomCode: "qualified",
                            token: token,
                          },
                          true
                        )}
                      </span>
                    </span>
                  </Typography.Text>
                )}
              {competition?.status == "ACTIVE" && (
                <Switch
                  checked={competition?.allowRegistration}
                  onChange={(e) => {
                    if (
                      competition?.competitionType === "TEAM" &&
                      !competition?.teamSize
                    ) {
                    } else
                      dispatch(
                        updateCompetitionDetails({
                          allowRegistration: e,
                        })
                      );
                  }}
                />
              )}
            </div>
            {/* registration counting */}
            <div className="registrationCountingStats">
              <div className="registrationCountingStatsBox">
                <Typography.Text
                  className={`textPoints ${
                    registrationsCount === 0 ? "" : "filled"
                  }`}
                >
                  {registrationsCount}
                  <img
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1687883431726_image_419.png"
                    alt="Image"
                  />
                </Typography.Text>
                <Typography.Text className="textSubtitle">
                  REGISTRATION
                </Typography.Text>
              </div>
              <div className="registrationCountingStatsBox">
                <Typography.Text
                  className={`textPoints ${
                    competition?.registrationViews === 0 ? "" : "filled"
                  }`}
                >
                  {competition?.registrationViews}
                  <img
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1687885122769_image_422.png"
                    alt="Image"
                  />
                </Typography.Text>
                <Typography.Text className="textSubtitle">
                  VIEWS
                </Typography.Text>
              </div>
              {/* <div className="registrationCountingStatsBox">
                <Typography.Text className="textPoints">
                  00
                  <img
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1687885179456_image_421.png"
                    alt="Image"
                  />
                </Typography.Text>
                <Typography.Text className="textSubtitle">
                  SHARES
                </Typography.Text>
              </div> */}
            </div>
          </div>
          <div className="registrationsContentSecondaryHeader">
            <div className="registrationsContentSecondaryHeaderForm">
              <Typography.Text className="label">Filter by</Typography.Text>
              <div className="registrationsContentSecondaryHeaderFormFields">
                {/* <div className="field">
                  <DatePicker placeholder="Registration Date" disabled />
                </div> */}
                <div className="field">
                  {/* <Input ref={inputRef} onChange={searchHandler} /> */}
                  <Input
                    ref={inputRef}
                    placeholder="Keyword"
                    disabled={competition?.status === "CONCLUDED"}
                    value={searchText}
                    onChange={searchHandler}
                    onPressEnter={async () => {
                      // const value = e.target.value;
                      // setSearchInput(e.target.value);
                      setPage(1);
                      if (searchText === "") {
                        setTriggerReload((prev) => !prev);
                      } else {
                        const resp = await Api.post(
                          `/container/${
                            competition?.competitionCode
                          }/search?page=${1}`,
                          { keyword: searchText }
                        );

                        if (resp?.code && resp?.result) {
                          const data = [];
                          resp?.result?.data?.map((cont) => {
                            cont?.users.forEach((item) => {
                              data.push({
                                containerCode: cont.containerCode,
                                containerName: cont?.containerName,
                                list: cont?.roomCode,
                                user: item,
                              });
                            });
                            // cont?.users?.map((user, i) => {
                            //   data.push({
                            //     containerCode: cont.containerCode,
                            //     containerName: cont?.containerName,
                            //     constainerStatus:
                            //       user.status == "DENIED"
                            //         ? "DENIED"
                            //         : user.status == "ONBOARDED"
                            //         ? "ONBOARDED"
                            //         : "INVITED",
                            //     //   <CrossCircleIcon className="iconCancle" />
                            //     // ) : user.status == "ONBOARDED" ? (
                            //     //   <CheckedGreenIcon className="iconChecked" />
                            //     // ) : (
                            //     //   <DotsIcon className="iconInvited" />
                            //     // ),
                            //     firstName: user?.firstName,
                            //     lastName: user?.lastName,
                            //     email: user?.email,
                            //     institute: user?.institute,
                            //     list: cont?.roomCode,
                            //     createdAt: user?.createdAt,
                            //     rowSpan: i === 0 ? cont?.users?.length : 0,
                            //   });
                            // });
                          });
                          const containerCounts = {};
                          const modifiedData = [];
                          let idx = 0;

                          for (const item of data) {
                            if (!containerCounts[item.containerName]) {
                              containerCounts[item.containerName] = 1;
                              modifiedData.push({ ...item, index: idx });
                              idx++;
                            } else {
                              containerCounts[item.containerName]++;
                              if (containerCounts[item.containerName] > 1) {
                                modifiedData.push({
                                  ...item,
                                  containerName: "",
                                });
                              } else {
                                modifiedData.push({ ...item, index: idx });
                                idx++;
                              }
                            }
                          }

                          setRegistrationData(modifiedData);
                          setRegistrationCount(resp.result?.total);
                          // dispatch(setRegistrationsList(data));
                        }
                      }
                    }}
                  />
                  {competition?.status !== "CONCLUDED" && searchText && (
                    <div
                      className="clearButton"
                      onClick={() => {
                        setTriggerReload((prev) => !prev);
                        setSearchText("");
                      }}
                    >
                      <CrossNewIcon />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="registrationsContentSecondaryHeaderButtons">
              {!selectedContiners.length ? (
                <>
                  {" "}
                  {competition?.status != "CONCLUDED" && (
                    <Button
                      className="buttonRegistrations"
                      type="secondary"
                      onClick={() => setIsVisibleRegModal(true)}
                    >
                      <ReplyNewIcon />
                      {competition?.competitionType == "TEAM"
                        ? "Invite Teams"
                        : "Invite Participants"}
                    </Button>
                  )}
                  <Button
                    className="buttonRegistrations"
                    type="secondary"
                    onClick={() =>
                      exportRegistration({
                        value: "all",
                        competitionCode: competition?.competitionCode,
                        competitionType: competition?.competitionType,
                      })
                    }
                    disabled={!registrationData.length}
                    // disabled={!registrations.length}
                  >
                    <ExpoertCSVIcon />
                    Export CSV
                  </Button>
                  {competition?.status != "CONCLUDED" && (
                    <Button
                      className="buttonRegistrations"
                      type="secondary"
                      onClick={() => setIsVisibleBulkModal(true)}
                    >
                      {/* {loading ? (
                        <div className="loader-icon" />
                      ) : (
                        <> */}
                      <BulkUploadIcon />
                      BULK UPLOAD
                      {/* </>
                      // )} */}
                    </Button>
                  )}
                </>
              ) : // ) : !!registrations.length ? (
              !!registrationData.length ? (
                <ul className="registrationsContentSecondaryHeaderActions">
                  <li>
                    <Button
                      type="text"
                      className="textSize"
                      icon={<DeleteIcon />}
                      onClick={() => setIsDeleteModalVisible(true)}
                    >
                      Delete
                    </Button>
                  </li>
                  <li>
                    <ContainerUpdateRoomDropdown
                      label={
                        <Button
                          className="textSize"
                          icon={<ReplyIcon />}
                          type="text"
                          // disabled={
                          //   registrations.length - selectedContiners.length ===
                          //   0
                          // }
                          disabled={
                            registrationData.length -
                              selectedContiners.length ===
                            0
                          }
                        >
                          Move Unselected (
                          {/* {registrations.length - selectedContiners.length}) */}
                          {registrationData.length - selectedContiners.length})
                        </Button>
                      }
                      type="unselected"
                    />
                  </li>
                  <li>
                    <ContainerUpdateRoomDropdown
                      label={
                        <Button
                          className="textSize"
                          icon={<ReplyIcon />}
                          type="text"
                        >
                          Move {`(${selectedContiners.length})`}
                        </Button>
                      }
                      type="selected"
                    />
                  </li>
                </ul>
              ) : (
                <>
                  {" "}
                  {competition?.status != "CONCLUDED" && (
                    <Button
                      className="buttonRegistrations"
                      type="secondary"
                      onClick={() => setIsVisibleRegModal(true)}
                    >
                      <ReplyNewIcon />
                      {competition?.competitionType == "TEAM"
                        ? "Invite Teams"
                        : "Invite Participants"}
                    </Button>
                  )}
                  <Button
                    className="buttonRegistrations"
                    type="secondary"
                    onClick={() =>
                      exportRegistration({
                        value: "all",
                        competitionCode: competition?.competitionCode,
                        competitionType: competition?.competitionType,
                      })
                    }
                    // disabled={!registrations.length}
                    disabled={!registrationData.length}
                  >
                    <ExpoertCSVIcon />
                    Export CSV
                  </Button>
                  {competition?.status != "CONCLUDED" && (
                    <Button
                      className="buttonRegistrations"
                      type="secondary"
                      onClick={() => setIsVisibleBulkModal(true)}
                    >
                      {loading ? (
                        <div className="loader-icon" />
                      ) : (
                        <>
                          <BulkUploadIcon />
                          BULK UPLOAD
                        </>
                      )}
                    </Button>
                  )}
                </>
              )}
              {/* <Button onClick={() => setSetUpModalVisible(true)}>Settings</Button> */}
            </div>
          </div>
        </div>
      </>
    );
  };

  const EmptyState = () => {
    return (
      <>
        <div className="registrationPlaceholder">
          <div className="registrationPlaceholderImage">
            {competition?.competitionType == "TEAM" ? (
              <Image
                src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1687889164885_teamimage.png"
                alt="Team Image"
                preview={false}
              />
            ) : (
              <Image
                src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1687889212959_soloimage.png"
                alt="Solo Image"
                preview={false}
              />
            )}
          </div>
          <Typography.Text className="registrationPlaceholderText">
            No{" "}
            {competition?.competitionType == "TEAM" ? "Teams" : "Participants"}{" "}
            have Registered yet
          </Typography.Text>
        </div>
      </>
    );
  };

  const [selection, setSelection] = useState(false);
  const [sortOrder, setSortOrder] = useState(1);
  const router = useRouter();

  const handleContainer = (container) => {
    router.push({
      pathname: router.asPath.split("?").shift(),
      query: `content=containers&containerCode=${container.containerCode}`,
    });
  };

  const columns = [
    {
      // title: (
      //   <div className="tableIdBox">
      //     {competition?.status !== "CONCLUDED" && (
      //       <label className="tableIdCheckbox">
      //         <Input
      //           type="checkbox"
      //           checked={!!selectedContiners?.length || selection}
      //           onChange={(e) => {
      //             if (e.target.checked) {
      //               setSelection(true);
      //               // const selections = [];
      //               // registrationData.forEach((item) => {
      //               //   item.isSelected = true;
      //               //   selections.push(item.containerCode);
      //               // });
      //               // setSelectedContainers(selections);
      //             } else {
      //               setSelection(false);
      //               registrationData.forEach((item) => {
      //                 item.isSelected = false;
      //               });
      //               setSelectedContainers([]);
      //             }
      //           }}
      //         />
      //         <span className="customChecbox"></span>
      //       </label>
      //     )}
      //     <div className="tableIdBoxText idTitle">ID</div>
      //     <div className="tableSortButtons">
      //       {/* {sortOrder == 1 ? (
      //         <Button
      //           className="btnSorting"
      //           type="primary"
      //           icon={<SortDescendingIcon />}
      //           onClick={() => {
      //             handleSorting("ALPHABETICAL", sortType.ASCENDING);
      //             setSortOrder(-1);
      //           }}
      //         />
      //       ) : (
      //         <Button
      //           className="btnSorting"
      //           type="primary"
      //           icon={<SortAscendingIcon />}
      //           onClick={() => {
      //             handleSorting("ALPHABETICAL", sortType.DESCENDING);
      //             setSortOrder(1);
      //           }}
      //         />
      //       )} */}
      //     </div>
      //   </div>
      // ),
      render: (rec, row) => {
        const obj = {
          children: (
            <div className="tableIdBox">
              {selection && (
                <label className="tableIdCheckbox">
                  <Input
                    type="checkbox"
                    checked={rec.isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        rec.isSelected = true;
                        setSelectedContainers((prev) => [
                          ...prev,
                          ...[rec.containerCode],
                        ]);
                      } else {
                        rec.isSelected = false;
                        setSelectedContainers((prev) =>
                          prev.filter((item) => item != rec.containerCode)
                        );
                      }
                    }}
                  />
                  <span className="customChecbox"></span>
                  {/* <span className="tableIdNumber">{index + 1}</span> */}
                  {/* <span className="tableIdNumber">{num++}</span> */}
                </label>
              )}
              <div
                className="tableIdBoxText"
                onClick={() => handleContainer(rec)}
              >
                <Typography.Text className="playerId">
                  {rec.containerName}
                </Typography.Text>
              </div>
            </div>
          ),
          props: {},
        };
        obj.props.rowSpan = rec.rowSpan;
        return obj;
      },
    },
    {
      // title: (
      //   <div className="tableIdBox">
      //     <div className="tableIdBoxText">Full Name</div>
      //     {/* <div className="tableSortButtons">
      //       <Button
      //         className="btnSorting"
      //         type="primary"
      //         icon={<SortDescendingIcon />}
      //         onClick={() => handleSorting("ALPHABETICAL", sortType.DESCENDING)}
      //       />
      //       <Button
      //         className="btnSorting"
      //         type="primary"
      //         icon={<SortAscendingIcon />}
      //         onClick={() => handleSorting("ALPHABETICAL", sortType.ASCENDING)}
      //       />
      //     </div> */}
      //   </div>
      // ),
      render: (rec) => {
        return (
          <div
            className="flex items-center space-x-2"
            onClick={() => handleContainer(rec)}
          >
            <AppNameAvater user={rec} />
            <Typography.Text className="playerName">
              {rec.firstName} {rec.lastName}
            </Typography.Text>
          </div>
        );
      },
    },
    {
      // title: "Email",
      render: (rec) => {
        return (
          <Typography.Text onClick={() => handleContainer(rec)}>
            {rec?.email}
          </Typography.Text>
        );
        // return <Typography.Text>admin@slamitt.com</Typography.Text>;
      },
    },
    // {
    //   title: "Phone",
    //   render: (rec) => {
    //     return <Typography.Text>08012345678</Typography.Text>;
    //   },
    // },
    {
      // title: "Organisation/Institute",
      render: (rec) => {
        return (
          <Typography.Text
            className="textOverflow"
            onClick={() => handleContainer(rec)}
          >
            {rec?.institute?.length < 30 ? (
              rec?.institute
            ) : (
              <Tooltip
                title={rec?.institute}
                trigger={"hover"}
                placement="top"
                color={"black"}
              >
                {rec?.institute}
              </Tooltip>
            )}
          </Typography.Text>
        );
      },
    },
    {
      // title: "Registered On",
      render: (rec) => {
        return (
          <Typography.Text onClick={() => handleContainer(rec)}>
            {rec?.createdAt
              ? moment(rec?.createdAt).format("DD/MM/YYYY hh:mm A")
              : null}
          </Typography.Text>
        );
      },
    },
    {
      // title: "Status",
      render: (rec) => {
        return (
          <Typography.Text
            className="registrationStatusText"
            onClick={() => handleContainer(rec)}
          >
            {/* {rec.constainerStatus} */}
            {/* <Tooltip color="black" placement="top" title={rec.constainerStatus}> */}
            {rec.constainerStatus == "INVITED" ? (
              <>
                <DotsIcon className="iconInvited" />{" "}
                <span className="statusText">Invited</span>
              </>
            ) : rec.constainerStatus == "DENIED" ? (
              <>
                {" "}
                <CrossCircleIcon className="iconCancle" />{" "}
                <span className="statusText">Denied</span>
              </>
            ) : rec.constainerStatus == "ONBOARDED" ? (
              <>
                {" "}
                <CheckedGreenIcon className="iconChecked" />{" "}
                <span className="statusText">Registered</span>
              </>
            ) : (
              ""
            )}
            {/* </Tooltip> */}
          </Typography.Text>
        );
      },
    },
    {
      // title: "List",
      render: (rec) => {
        return (
          <Typography.Text onClick={() => handleContainer(rec)}>
            {titleCase(rec?.list)}
          </Typography.Text>
        );
      },
    },
  ];

  const scrollbarRef = useRef(null);
  const [fetching, setFetching] = useState(false);

  // const handleScroll = async () => {
  //   if (scrollbarRef.current && page) {
  //     const { scrollTop, scrollHeight, clientHeight } =
  //       scrollbarRef.current.view;
  //     const pad = 1;
  //     const t = (scrollTop + pad) / (scrollHeight - clientHeight);
  //     if (t >= 1 && !fetching) {
  //       setFetching(true);
  //       if (competition) {
  //         try {
  //           // const response = await Api.get(
  //           //   `/container/get-all-containers/filter?competitionCode=${competition?.competitionCode}`
  //           // );

  //           const response = !searchText
  //             ? await Api.get(
  //                 `/container/get-all-containers/${
  //                   competition?.competitionCode
  //                 }?page=${page + 1}`
  //               )
  //             : await Api.post(
  //                 `/container/${competition?.competitionCode}/search?page=${
  //                   page + 1
  //                 }`,
  //                 { keyword: searchText }
  //               );

  //           if (response?.result && response?.code) {
  //             const data = [];
  //             response?.result?.data?.map((cont) => {
  //               data.push({
  //                 containerCode: cont.containerCode,
  //                 containerName: cont?.containerName,
  //                 list: cont?.roomCode,
  //                 users: cont?.users,
  //               });
  //               // cont?.users?.map((user, i) => {
  //               //   data.push({
  //               //     containerCode: cont.containerCode,
  //               //     containerName: cont?.containerName,
  //               //     constainerStatus:
  //               //       user.status == "DENIED"
  //               //         ? "DENIED"
  //               //         : user.status == "ONBOARDED"
  //               //         ? "ONBOARDED"
  //               //         : "INVITED",
  //               //     //   <CrossCircleIcon className="iconCancle" />
  //               //     // ) : user.status == "ONBOARDED" ? (
  //               //     //   <CheckedGreenIcon className="iconChecked" />
  //               //     // ) : (
  //               //     //   <DotsIcon className="iconInvited" />
  //               //     // ),
  //               //     firstName: user?.firstName,
  //               //     lastName: user?.lastName,
  //               //     email: user?.email,
  //               //     institute: user?.institute,
  //               //     list: cont?.roomCode,
  //               //     createdAt: user?.createdAt,
  //               //     rowSpan: i === 0 ? cont?.users?.length : 0,
  //               //   });
  //               // });
  //             });
  //             // setRegistrationData((prev) => [...prev, ...data]);
  //             dispatch(setRegistrationsList([...registrations, ...data]));
  //           }
  //           setPage(page + 1);
  //         } catch (err) {
  //           console.log(err);
  //         }
  //       }
  //       setFetching(false);
  //     }
  //   }
  // };

  const handleNextRegistrations = async () => {
    if (competition && page !== Math.ceil(registrationsCount / 10)) {
      try {
        const response = !searchText
          ? await Api.get(
              `/container/get-all-containers/${
                competition?.competitionCode
              }?page=${page + 1}`
            )
          : await Api.post(
              `/container/${competition?.competitionCode}/search?page=${
                page + 1
              }`,
              { keyword: searchText }
            );

        if (response?.result && response?.code) {
          const data = [];
          response?.result?.data?.map((cont) => {
            cont?.users.forEach((item) => {
              data.push({
                containerCode: cont.containerCode,
                containerName: cont?.containerName,
                list: cont?.roomCode,
                user: item,
              });
            });
          });
          // dispatch(setRegistrationsList(data));
          const containerCounts = {};
          const modifiedData = [];
          let idx = 0;

          for (const item of data) {
            if (!containerCounts[item.containerName]) {
              containerCounts[item.containerName] = 1;
              modifiedData.push({ ...item, index: idx });
              idx++;
            } else {
              containerCounts[item.containerName]++;
              if (containerCounts[item.containerName] > 1) {
                modifiedData.push({ ...item, containerName: "" });
              } else {
                modifiedData.push({ ...item, index: idx });
                idx++;
              }
            }
          }

          setRegistrationData(modifiedData);
          setPage((prev) => prev + 1);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  const handlePreviousRegistrations = async () => {
    if (competition && page !== 1) {
      try {
        const response = !searchText
          ? await Api.get(
              `/container/get-all-containers/${
                competition?.competitionCode
              }?page=${page - 1}`
            )
          : await Api.post(
              `/container/${competition?.competitionCode}/search?page=${
                page - 1
              }`,
              { keyword: searchText }
            );

        if (response?.result && response?.code) {
          const data = [];
          response?.result?.data?.map((cont) => {
            cont?.users.forEach((item) => {
              data.push({
                containerCode: cont.containerCode,
                containerName: cont?.containerName,
                list: cont?.roomCode,
                user: item,
              });
            });
          });
          // dispatch(setRegistrationsList(data));
          const containerCounts = {};
          const modifiedData = [];
          let idx = 0;

          for (const item of data) {
            if (!containerCounts[item.containerName]) {
              containerCounts[item.containerName] = 1;
              modifiedData.push({ ...item, index: idx });
              idx++;
            } else {
              containerCounts[item.containerName]++;
              if (containerCounts[item.containerName] > 1) {
                modifiedData.push({ ...item, containerName: "" });
              } else {
                modifiedData.push({ ...item, index: idx });
                idx++;
              }
            }
          }

          setRegistrationData(modifiedData);
          setPage((prev) => prev - 1);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const RegistrationContent = () => {
    // const rowProps = (container) => {
    //   return {
    //     onClick: () => handleContainer(container),
    //   };
    // };
    return (
      <div
        className={`registrationContentHolderWrapper ${
          !!registrationData.length ? "" : "placeholderNoTable"
        }`}
      >
        <div className="registrationContentHolder">
          {/* {!!registrations.length && ( */}
          {!!registrationData.length && (
            <div className="registrationTableRow registrationTableHeader">
              <div className="tableIdBox">
                {competition?.status !== "CONCLUDED" && (
                  <label className="tableIdCheckbox">
                    <Input
                      type="checkbox"
                      checked={!!selectedContiners?.length || selection}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelection(true);
                          // const selections = [];
                          // registrationData.forEach((item) => {
                          //   item.isSelected = true;
                          //   selections.push(item.containerCode);
                          // });
                          // setSelectedContainers(selections);
                        } else {
                          setSelection(false);
                          registrationData.forEach((item) => {
                            item.isSelected = false;
                          });
                          // registrations.forEach((item) => {
                          //   item.isSelected = false;
                          // });
                          setSelectedContainers([]);
                        }
                      }}
                    />
                    <span className="customChecbox"></span>
                  </label>
                )}
                <div className="tableIdBoxText idTitle">ID</div>
                <div className="tableSortButtons">
                  {/* {sortOrder == 1 ? (
                <Button
                  className="btnSorting"
                  type="primary"
                  icon={<SortDescendingIcon />}
                  onClick={() => {
                    handleSorting("ALPHABETICAL", sortType.ASCENDING);
                    setSortOrder(-1);
                  }}
                />
              ) : (
                <Button
                  className="btnSorting"
                  type="primary"
                  icon={<SortAscendingIcon />}
                  onClick={() => {
                    handleSorting("ALPHABETICAL", sortType.DESCENDING);
                    setSortOrder(1);
                  }}
                />
              )} */}
                </div>
              </div>
              <div className="registrationTableRowContent">
                <div className="registrationTableRowContentRow">
                  <div className="tableNameBox">
                    <div className="tableIdBoxText">Full Name</div>
                    {/* <div className="tableSortButtons">
                  <Button
                    className="btnSorting"
                    type="primary"
                    icon={<SortDescendingIcon />}
                    onClick={() => handleSorting("ALPHABETICAL", sortType.DESCENDING)}
                  />
                  <Button
                    className="btnSorting"
                    type="primary"
                    icon={<SortAscendingIcon />}
                    onClick={() => handleSorting("ALPHABETICAL", sortType.ASCENDING)}
                  />
                </div> */}
                  </div>
                  <div className="tableEmailBox">Email</div>
                  <div className="tableOrganisationBox">
                    Organisation/Institute
                  </div>
                  <div className="tableRegisteredBox">Registered On</div>
                  <div className="tableStatusBox">Status</div>
                  <div className="tableListBox">List</div>
                </div>
              </div>
            </div>
          )}
          {!!registrationData.length ? (
            // <Scrollbar
            //   autoHeight
            //   onScrollStop={handleScroll}
            //   scrollRef={scrollbarRef}
            // >
            <>
              <VirtualizedList
                width={1700}
                height={1200}
                rowHeight={74}
                rowCount={registrationData?.length}
                // rowCount={registrations?.length}
                rowRenderer={({ key, index, style }) => (
                  <div
                    key={key}
                    className="registrationContentTable"
                    style={style}
                  >
                    <RegistrationTable
                      selection={selection}
                      setSelectedContainers={setSelectedContainers}
                      data={registrationData[index]}
                      // data={registrations[index]}
                      index={index}
                      handleContainer={handleContainer}
                    />
                    {/* <Table
                      columns={columns}
                      // dataSource={
                      //   index === 0 ? [columns] : [registrationData[index - 1]]
                      // }
                      dataSource={[registrationData[index]]}
                      // dataSource={registrationData}
                      // onRow={rowProps}
                      pagination={false}
                    /> */}
                  </div>
                )}
              />
              {registrationsCount > 10 && (
                <div className="virtualPaginationButtons">
                  {page > 1 && (
                    <div
                      onClick={handlePreviousRegistrations}
                      className="prevContainersButton"
                    >
                      <ArrowLeftOutlined />
                    </div>
                  )}
                  <div>{`${page} / ${Math.ceil(registrationsCount / 10)}`}</div>
                  {page < Math.ceil(registrationsCount / 10) && (
                    <div
                      onClick={handleNextRegistrations}
                      className="nextContainersButton"
                    >
                      <ArrowRightOutlined />
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            // </Scrollbar>
            <EmptyState />
          )}

          {/* {!!registrationData.length ? (
            <div className="registrationContentTable">
              <Scrollbar
                autoHeight
                onScrollStop={handleScroll}
                scrollRef={scrollbarRef}
              >
                <Table
                  columns={columns}
                  dataSource={registrationData}
                  // onRow={rowProps}
                  pagination={false}
                />
              </Scrollbar>
            </div>
          ) : (
            <EmptyState />
          )} */}
        </div>
      </div>
    );
  };

  return (
    <div className="registrationsContent">
      <RegistrationTabHeader />
      <RegistrationContent />
      {/* <RegistrationSetUp
        isVisible={setUpModalVisible}
        setIsVisible={setSetUpModalVisible}
      /> */}

      <AppCSVuploadModal
        onSubmitTeamSize={() => null}
        competition={competition}
        isVisible={isVisibleBulkModal}
        setVisible={setIsVisibleBulkModal}
        setVisibiltyTeamSizeModal={() => null}
        setShowBulkUploadReviewModal={(rows) => {
          setIsVisibleBulkReviewiModal(true);
          setCsvReadedRows(rows);
        }}
      />
      <RegistrationParticipantsModal
        roomCode={roomState?.selected?.roomCode || "qualified"}
        room={roomState?.selected}
        competition={competition}
        isVisible={isVisibleRegModal}
        setVisible={setIsVisibleRegModal}
        setVisibiltyTeamSizeModal={() => null}
        dropdownRoom={true}
        roomOptions={roomState.all.map(
          (item) =>
            item.roomCode != "disqualified" && {
              label: `${item.roomName}(${item.containersCount})`,
              value: item.roomCode,
            }
        )}
      />

      <AppUploadBulkReviewModal
        isVisible={isVisibleBulkReviewModal}
        setVisible={setIsVisibleBulkReviewiModal}
        csvReadedRows={csvReadedRows}
        competition={competition}
        setLoading={setLoading}
        loading={loading}
      />
      {competition?.status != "CONCLUDED" ? (
        <AddTeamSizeModal
          switchSolo={switchSolo}
          competition={competition}
          isSolo={isSolo}
          size={size}
          setSize={setSize}
          setupMinTeamSize={setupMinTeamSize}
          setSetupMinTeamSize={setSetupMinTeamSize}
          isBelongsToSameOrgOrInstitute={isBelongsToSameOrgOrInstitute}
          setBelongsToSameOrgOrInstitute={setBelongsToSameOrgOrInstitute}
          onSubmitTeamSize={onSubmitTeamSize}
          isVisibleModal={setUpModalVisible}
          setVisibleModal={() => {
            setSetUpModalVisible(false);
          }}
          // setVisibleCSVModal={setIsVisibleRegModal}
          onUpdateCompetition={onUpdateCompetition}
          handleSubmit={onSubmitTeamSize}
          containers={containerState.all}
          useContainerCodePreDefined={useContainerCodePreDefined}
          setUseContainerCodePreDefined={setUseContainerCodePreDefined}
        />
      ) : (
        <ConcludedRegistrationSetup
          isVisible={setUpModalVisible}
          setIsVisible={setSetUpModalVisible}
          competition={competition}
        />
      )}
      <DeleteContainerModal
        isModalVisible={isDeleteModalVisible}
        hideModal={() => setIsDeleteModalVisible(false)}
        deleteContainer={() => {
          dispatch(deleteContainerBulk(selectedContiners));
          setSelectedContainers([]);
          setSelection(false);
          setTriggerReload((prev) => !prev);
        }}
      />
    </div>
  );
};

export default RegistrationTab;
