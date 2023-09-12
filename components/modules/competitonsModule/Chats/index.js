import { EnterOutlined } from "@ant-design/icons";
import { Button, Input, Typography } from "antd";
import React, { useState } from "react";

import { chatOptions } from "../../../../utility/config";
import AppSelect from "../../../AppSelect";
import ChatContent from "./chatContent";

const ChatsSection = ({
  container,
  chat,
  addChat,
  storeMessages,
  detailsOpen,
}) => {
  const [message, setMessage] = useState();

  const handleAddChat = () => {
    const payload = {
      type: "TEXT",
      value: message,
    };

    addChat(payload);

    setMessage("");
  };

  const OptionsDropdown = () => {
    return (
      <AppSelect
        option={chatOptions}
        bordered={false}
        defaultValue={chatOptions[0].value}
        onChange={(e) => {
          console.log("Dropdown", e);
        }}
      />
    );
  };

  return (
    <div
      className={`participantContentBlock ${
        detailsOpen ? "block" : "hidden"
      } tablet:block`}
    >
      <div className="chatSectionHeader">
        <Typography.Text className="chatSectionHeaderTitle">
          <img src="https://joeschmoe.io/api/v1/random" alt="img description" />{" "}
          {container?.containerName}
        </Typography.Text>
        <div className="chatSectionHeaderDrop">
          <OptionsDropdown />
        </div>
      </div>
      <div className="chatMessagesContainer">
        <div className="chatMessagesScroller">
          <ChatContent chat={chat} storeMessages={storeMessages} />
        </div>
      </div>
      <div className="chatSectionInputField">
        <Input
          suffix={
            <Button
              icon={<EnterOutlined />}
              type="text"
              onClick={handleAddChat}
            />
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={"Type here. Type @ to mention someone"}
          onPressEnter={handleAddChat}
          style={{ fontSize: "22px", color: "#101115", fontWeight: "bold" }}
        />
      </div>
    </div>
  );
};

export default ChatsSection;
