import { SearchOutlined } from "@ant-design/icons";
import { Avatar, Image, List, Skeleton, Typography } from "antd";
import { chatSelectionOptions } from "../../utility/config";
import { chat } from "../../utility/imageConfig";
import AppSelect from "../AppSelect";
import FormField from "../FormField";

const ChatsSection = ({
  rooms,
  room,
  containers,
  selectRoom,
  handleSelectContainer,
  detailsOpen,
  setDetailsOpen,
}) => {
  const groupChatContainer = {
    roomCode: room?.roomCode,
    competitionCode: room?.competitionCode,
    containerName: `All ${room?.roomName}`,
  };

  const RoomsDropDown = () => {
    const roomsOptions = rooms.map((room) => ({
      ...room,
      label: room.roomName,
      value: room.roomCode,
    }));

    if (room) {
      room.label = room.roomName;
      room.value = room.roomCode;
    }

    return (
      <AppSelect
        option={roomsOptions}
        bordered={false}
        defaultValue={roomsOptions[0]?.value}
        onChange={(e) => {
          const room = rooms.find(({ roomCode }) => roomCode === e);
          selectRoom(room);
        }}
        value={room}
      />
    );
  };

  const ChatSelectionDropDown = () => (
    <div className="competitionSelectCol">
      <AppSelect
        option={chatSelectionOptions}
        bordered={false}
        defaultValue={chatSelectionOptions[0].value}
        onChange={(e) => {
          console.log("Dropdown", e);
        }}
      />
    </div>
  );

  const ContainerBox = ({ container, selectContainer }) => (
    <List.Item className={`${false ? "selected" : ""} border-2 my-2`}>
      <Skeleton avatar title={false} loading={false} active>
        <List.Item.Meta
          onClick={selectContainer}
          style={{ cursor: "pointer" }}
          avatar={<Avatar src={"https://joeschmoe.io/api/v1/random"} />}
          title={
            <Typography.Title className="teamTitle">
              {container?.containerName}
            </Typography.Title>
          }
        />
      </Skeleton>
    </List.Item>
  );

  return (
    <div
      className={`competitionSidebarContent ${
        detailsOpen ? "hidden" : "block"
      } lg:block`}
    >
      <div className="competitionCodeFieldWrap searchChatFieled">
        <FormField
          type={"text"}
          placeholder="Search Chats"
          prefix={<SearchOutlined />}
        />
      </div>
      <div className="competitionSelectHolder">
        <ChatSelectionDropDown />
        <div className="competitionSelectCol">
          <RoomsDropDown />
        </div>
      </div>
      {containers.length ? (
        <div className="chatCardScroller">
          <ul className="competitionTeamsList">
            <ContainerBox
              selectContainer={() =>
                handleSelectContainer(groupChatContainer, true)
              }
              container={groupChatContainer}
              key={groupChatContainer.roomCode}
            />
            {containers.map((container) => (
              <ContainerBox
                container={container}
                selectContainer={() => handleSelectContainer(container, false)}
                key={container.containerCode}
              />
            ))}
          </ul>
        </div>
      ) : (
        <div className="competitionPlaceholderBox chatPlaceholder">
          <Image
            preview={false}
            src={chat}
            alt="img"
            height={200}
            width={200}
          />
          <br />
          <Typography.Text className="competitionPlaceholderBoxText">
            You have no recent chats on {room?.roomName}
          </Typography.Text>
        </div>
      )}
    </div>
  );
};

export default ChatsSection;
