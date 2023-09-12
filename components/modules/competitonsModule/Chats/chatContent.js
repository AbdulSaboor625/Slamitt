import React from "react";
import ChatBox from "./chatBox";

const ChatContent = ({ chat, storeMessages }) => {
  return (
    <ul className="chatMessagesList">
      {chat.length ? (
        chat.map(({ userCode, payload, role }, index) => (
          <ChatBox
            key={index}
            role={role}
            by={userCode}
            value={payload.value}
          />
        ))
      ) : (
        <></>
      )}
      {storeMessages.map((messageObj, index) => {
        const payload = JSON.parse(messageObj.message);
        return (
          <ChatBox
            role={messageObj.senderRole}
            by={messageObj.senderUserId}
            key={index}
            value={payload.value}
          />
        );
      })}
    </ul>
  );
};

export default ChatContent;
