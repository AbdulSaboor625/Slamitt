import { Button, Modal, Typography, Avatar } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import {
  CheckedGreenIcon,
  DotsIcon,
  ErrorNewIcon,
  LeaderBoardThunderBoltIcon,
} from "../../../../../utility/iconsLibrary";

const ContainerSelectionModal = ({
  isModalVisible,
  hideModal,
  index,
  mentions,
  onSubmit,
  containerState,
}) => {
  return (
    <div>
      <Modal
        className="concludeCompetitionModal"
        closable={true}
        visible={isModalVisible}
        onOk={hideModal}
        onCancel={hideModal}
        footer={null}
        style={{ borderRadius: "20px" }}
        // afterClose={() => setValue("")}
      >
        <div className="concludeCompetitionModalTeamsBlock">
          <div className="concludeCompetitionModalTeamsBlockHead">
            <Typography.Text>Select a Team (Special Mention) </Typography.Text>
          </div>
          <div className="concludeCompetitionModalTeamsList">
            {containerState.map((item) => (
              <div
                className="concludeCompetitionModalTeamsListItem"
                onClick={() => {
                  onSubmit(index, item);
                  hideModal();
                }}
              >
                <div className="concludeCompetitionModalTeamImage">
                  {item.emojiObject ? (
                    <p
                      className="competitionTeamsEmoji"
                      style={{ fontSize: "2rem", marginBottom: 0 }}
                    >
                      {item?.emojiObject?.emoji}
                    </p>
                  ) : (
                    <Avatar src={item?.imageURL} />
                  )}
                  {!!item?.users?.length ? (
                    !!item.users.filter((item) => item.status == "ONBOARDED")
                      .length ? (
                      <CheckedGreenIcon className="icoChecked" />
                    ) : (
                      <DotsIcon className="dotsIcon" />
                    )
                  ) : (
                    <></>
                  )}
                </div>
                <div className="concludeCompetitionModalTeamInfo">
                  <Typography.Text className="concludeCompetitionModalTeamName">
                    {item.containerName}
                    {!item.users.length && "(Unassigned)"}
                  </Typography.Text>
                  <Typography.Text className="concludeCompetitionModalTeamPoints">
                    <LeaderBoardThunderBoltIcon /> {item.points}
                  </Typography.Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContainerSelectionModal;
