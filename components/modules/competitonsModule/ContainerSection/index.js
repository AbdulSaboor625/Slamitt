import { Button, Typography } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";
import {
  getAllContainers,
  notify,
  setRoomSelected,
  updateContainer,
} from "../../../../Redux/Actions";
import { getCrewPermissions } from "../../../../utility/common";
import { CONTAINER_ROUND_CODE_LIMIT } from "../../../../utility/config";
import { DeleteIcon, EditPencilIcon } from "../../../../utility/iconsLibrary";
import AppCustomPicker from "../../../AppCustomPicker";
import AppSelect from "../../../AppSelect";
import DeleteContainerModal from "../DeleteContainerModal";
import StatsTabs from "../statsTabs";
const ContainerSection = ({
  readOnlyState,
  container,
  updateRoom,
  rooms,
  updateName,
  removeUser,
  makeAdmin,
  competition,
  updateContainerImage,
  onUpdateCompetition,
  detailsOpen,
  setDetailsOpen,
  role,
  isVisibleTeamSizeModal,
  setVisibiltyTeamSizeModal,
  pusher,
}) => {
  const [isVisible, setVisible] = useState(false);
  const [setToAdmin, setMakeAdmin] = useState(false);
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.auth.user.email);
  const roomsState = useSelector((state) => state.rooms);

  const [containerNameEditable, setContainerNameEditable] = useState(false);
  const [containerName, setContainerName] = useState(container.containerName);
  useEffect(() => {
    if (container) {
      setContainerName(container.containerName);
    }
  }, [container]);

  

  const crewPermissions = getCrewPermissions(competition?.crew, userEmail);
  const movableRooms = rooms?.filter((r) => {
    if (r?.roomCode !== roomsState?.selected?.roomCode)
      return {
        ...r,
        label: `${r?.roomName} (${r?.containersCount})`,
        value: r?.roomCode,
      };
  });

  const RoomDropdown = ({ label }) => {
    const [value, setValue] = useState(label);
    return (
      <AppSelect
        option={movableRooms}
        bordered={false}
        disabled={role === "CREW" && !crewPermissions?.manageScoring}
        value={value}
        defaultValue={value}
        onChange={(e) => {
          const room = rooms.find((room) => room.roomCode === e);
          if (container?.roomCode === room?.roomCode) {
            dispatch(
              notify({
                message: `You are already in ${room?.roomCode}`,
                type: "error",
              })
            );
          } else {
            updateRoom(room);
            dispatch(setRoomSelected(room));
            dispatch(getAllContainers(room));
            setValue(e);
          }
        }}
      />
    );
  };

  const deleteContainer = () => {
    dispatch(updateContainer({ ...container, isDeleted: true }));
  };

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  return (
    <div
      className={`participantContentBlock ${
        detailsOpen ? "block" : "hidden"
      } tablet:block`}
    >
      <DeleteContainerModal
        isModalVisible={isDeleteModalVisible}
        hideModal={() => setIsDeleteModalVisible(false)}
        deleteContainer={deleteContainer}
      />
      <div className="participantContentHeader">
        <div className="participantContentTeamInfo">
          <AppCustomPicker
            imgStyle={{ height: "4rem", width: "4rem", cursor: "pointer" }}
            emojiStyle={{
              fontSize: "2.7rem",
              lineHeight: "1.2",
              cursor: "pointer",
            }}
            className="tabset"
            popOverClass="m-5"
            tabpaneClass="m-5"
            onImageSelected={(e) => updateContainerImage(e)}
            defaultValue={{
              type: container?.emojiObject ? "EMOJI" : "LINK",
              url: container?.imageURL || "",
              emoji: container?.emojiObject || "",
            }}
            showClearButton={false}
          />
          {/* <Avatar
            src={container?.imageURL || "https://joeschmoe.io/api/v1/random"}
          /> */}
          <div className="participantContentHeaderBox">
            <Typography.Title
              // style={{ fontSize: "22px", color: "#101115", fontWeight: "bold" }}
              className="participantContentHeaderTitle"
              editable={
                readOnlyState
                  ? false
                  : {
                      maxLength: CONTAINER_ROUND_CODE_LIMIT,
                      tooltip: false,
                      icon: <EditPencilIcon />,
                      onChange: (e) => {
                        if (containerName !== e) updateName(e);
                      },
                    }
              }
            >
              {containerName}
            </Typography.Title>
            {/* <Input
              maxLength={CONTAINER_ROUND_CODE_LIMIT}
              bordered={containerNameEditable}
              onPressEnter={(e) => {
                updateName(e.target.value);
                setContainerNameEditable(false);
              }}
              // onBlur={(e) => {
              //   updateName(e.target.value);
              //   setContainerNameEditable(false);
              // }}
              suffix={
                !containerNameEditable ? (
                  <Button
                    icon={<EditPencilIcon />}
                    type="text"
                    onClick={() => setContainerNameEditable(true)}
                  />
                ) : (
                  <span />
                )
              }
              onChange={(e) => setContainerName(e.target.value)}
              readOnly={!containerNameEditable}
              value={containerName}
              style={{ fontSize: "22px", color: "#101115", fontWeight: "bold" }}
            /> */}
            {/* {!readOnlyState && <AssignOrViewAdmin />} */}
          </div>
        </div>
        {!readOnlyState && (
          <div className="participantContentTeamsRound">
            <>
              <Button
                className="buttonDelete"
                icon={<DeleteIcon />}
                type="text"
                onClick={() => setIsDeleteModalVisible(true)}
              >
                Delete
              </Button>
            </>
            <RoomDropdown
              label={`${roomsState?.selected?.roomName} (${
                roomsState.all.find(
                  (room) =>
                    room.competitionRoomCode ===
                    roomsState?.selected?.competitionRoomCode
                ).containersCount
              })`}
            />
          </div>
        )}
      </div>
      <div className="participantTabsContent">
        <StatsTabs
          readOnlyState={readOnlyState}
          setVisible={setVisible}
          isVisible={isVisible}
          container={container}
          competition={competition}
          removeUser={removeUser}
          makeAdmin={makeAdmin}
          setToAdmin={setToAdmin}
          setVisibiltyTeamSizeModal={setVisibiltyTeamSizeModal}
          setMakeAdmin={setMakeAdmin}
          pusher={pusher}
        />
      </div>
    </div>
  );
};

export default ContainerSection;
