import { Typography, Image, Avatar, List, Skeleton } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AppSelect from "../AppSelect";
import { chatSelectionOptions } from "../../utility/config";
import FormField from "../FormField";

const ChatsSection = ({ room, containers, handleSelectContainer }) => {
  const groupChatContainer = {
    roomCode: room?.roomCode,
    competitionCode: room?.competitionCode,
    containerName: `All ${room?.roomName}`,
  };

  const ChatSelectionDropDown = () => (
    <AppSelect
      option={chatSelectionOptions}
      bordered={false}
      defaultValue={chatSelectionOptions[0].value}
      onChange={(e) => {
        console.log("Dropdown", e);
      }}
    />
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
    <div className="competitionSidebarContent">
      <div className="competitionCodeFieldWrap searchChatFieled">
        <FormField
          type={"text"}
          placeholder="Search Chats"
          prefix={<SearchOutlined />}
        />
      </div>
      <div className="competitionSelectHolder">
        <div className="competitionSelectCol">
          <ChatSelectionDropDown />
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
        <div className="competitionPlaceholderBox">
          <Image
            preview={false}
            src="https://images.unsplash.com/photo-1598257006463-7c64a5a538cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
            alt="img"
            height={200}
            width={200}
          />
          <br />
          <Typography.Text className="competitionPlaceholderBoxText">
            You have no recent chats
          </Typography.Text>
        </div>
      )}
    </div>
  );
};

export default ChatsSection;
