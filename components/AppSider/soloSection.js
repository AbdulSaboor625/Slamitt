import {
  CloseOutlined,
  EllipsisOutlined,
  FileAddOutlined,
  PlusSquareFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, Typography } from "antd";

import AppCSVuploadModal from "../AppCSVuploadModal";
import {
  AppDropDown,
  AppDynamicDropdown,
  AppSortPopOver,
  FormField,
} from "../index";

import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  selectOrUnselectContainer,
  setConfigForContainers,
} from "../../Redux/Actions";
import { capitalize } from "../../utility/common";
import { ReplyIcon } from "../../utility/iconsLibrary";
import ContainerListSection from "./containerListSection";

const SoloSection = ({
  roomState,
  containerState,
  competitionState,
  createNewRoom,
  deleteRoom,
  selectRoom,
  updateRoom,
  moveContainer,
  config,
  moveContainerBulk,
  createContainer,
  redirectToRound,
  bulkCreateContainers,
}) => {
  const competition = competitionState.current;

  const [isShowingSearch, showSearch] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [containerCode, setContainerCode] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = (newRoom) => createNewRoom(newRoom);
  const handleDelete = (room) => deleteRoom(room);
  const handleSelect = (room) => selectRoom(room);
  const handleUpdate = (room) => updateRoom(room);
  const handleMoveContainer = (container) => moveContainer(container);
  const handleMoveContainerBulks = (room) => moveContainerBulk(room.roomCode);
  const handleCreateContainer = (containerCode) =>
    createContainer(containerCode);

  const staticRooms = [];
  const dynamicRooms = [];

  const rooms = roomState.all.map((room) => {
    const updateRoom = {
      ...room,
      key: room.competitionRoomCode,
      label: room.roomName,
      value: room.competitionRoomCode,
    };

    if (room.roomCode === "qualified" || room.roomCode === "disqualified")
      staticRooms.push(updateRoom);
    else dynamicRooms.push(updateRoom);

    return updateRoom;
  });

  const handleCancelSelection = () => {
    dispatch(setConfigForContainers());
    dispatch(selectOrUnselectContainer(null, true));
  };

  const countSelectedContainers = () => {
    let count = 0;
    containerState.all.forEach((container) => {
      if (container.isSelected) count++;
    });
    return count;
  };

  const RoomDropDown = ({ label, iconShow = false }) => (
    <AppDynamicDropdown
      label={label}
      staticItems={staticRooms}
      dynamicItems={dynamicRooms}
      menu={rooms}
      iconShow={iconShow}
      handleSelect={handleSelect}
      handleSubmit={handleSubmit}
      handleDelete={handleDelete}
      handleUpdate={handleUpdate}
    />
  );

  const ContainerUpdateRoomDropdown = ({ label }) => {
    return (
      <AppDropDown
        label={label}
        iconShow={false}
        menu={rooms}
        onClick={(e) => handleMoveContainerBulks(rooms[e.key])}
      />
    );
  };

  return (
    <div className="competitionSidebarContent">
      <div className="competitionCodeField">
        <Typography.Text className="competitionCodeFieldLabel">
          Add Participants by entering a Participant ID
        </Typography.Text>
        <div className="competitionCodeFieldWrap">
          <Input
            onInput={(e) => (e.target.value = capitalize(e.target.value))}
            className="inputstyle"
            type={"text"}
            placeholder="COMP001"
            suffix={
              <Button
                icon={<PlusSquareFilled />}
                type="text"
                onClick={() => handleCreateContainer(containerCode)}
              />
            }
            value={containerCode}
            onChange={(e) => setContainerCode(e.target.value)}
          />
          <div className="competitionFileButton">
            <Button
              icon={<FileAddOutlined />}
              type="text"
              onClick={() => setVisible(true)}
            />
            <AppCSVuploadModal
              competition={competition}
              isVisible={isVisible}
              setVisible={setVisible}
              bulkCreateContainers={bulkCreateContainers}
            />
          </div>
        </div>
      </div>
      <div className="competitionQualifiedDropdown">
        <RoomDropDown
          label={
            roomState?.selected?.roomName
              ? roomState?.selected?.roomName
              : "Qualified"
          }
          iconShow
        />
        <div className="competitionQualifiedButtons">
          {config.container.selection ? (
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
              <Button
                className="participantsButtonSearch"
                icon={<SearchOutlined />}
                type="text"
                onClick={() => showSearch(true)}
              />
              <AppSortPopOver>
                <Button
                  className="participantsButtonSorting"
                  icon={<EllipsisOutlined />}
                  type="text"
                />
              </AppSortPopOver>
            </>
          )}
        </div>
      </div>
      <div className="participantsTeamSearchBox">
        {isShowingSearch && (
          <FormField
            placeholder={"Search Teams"}
            suffix={<CloseOutlined />}
            type="text"
          />
        )}
      </div>
      <div className="competitionTeamsStatus">
        {config.container.selection && (
          <Typography.Text className="textSize">
            {countSelectedContainers()} selected
          </Typography.Text>
        )}
        <div className="competitionTeamsRound">
          {config.container.selection && (
            <ContainerUpdateRoomDropdown
              label={
                <Button className="textSize" icon={<ReplyIcon />} type="text">
                  Move
                </Button>
              }
            />
          )}
        </div>
      </div>
      <ContainerListSection
        roomDropDown={<RoomDropDown label={<ReplyIcon />} />}
        containers={containerState}
        rooms={rooms}
        handleMoveContainer={handleMoveContainer}
        config={config}
      />
    </div>
  );
};

export default SoloSection;
