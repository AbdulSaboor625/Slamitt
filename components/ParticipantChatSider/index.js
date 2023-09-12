import ChatsSection from "./chatsSection";

const ParticipantChatSider = ({ room, containers, onChatSelectContainer }) => {
  return (
    <>
      <div className="competitionSidebarHolder">
        <ChatsSection
          room={room}
          containers={containers}
          handleSelectContainer={onChatSelectContainer}
        />
      </div>
    </>
  );
};

export default ParticipantChatSider;
