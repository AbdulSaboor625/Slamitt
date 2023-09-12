import { CheckCircleFilled } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Divider,
  Popconfirm,
  Progress,
  Space,
  Table,
  Typography,
} from "antd";
import { useState } from "react";
import { DeleteIcon } from "../../../utility/iconsLibrary";
import AssignTeamOrParticipantModal from "../competitonsModule/AssignTeamOrParticipantModal";

const TeamSettings = ({
  users = [],
  isAdmin = false,
  makeAdmin,
  removeUser,
  container,
  competition,
}) => {
  const [isVisibleOnBoardModal, setVisibleOnBoardModal] = useState(false);
  const percentage = parseInt((users.length / competition.teamSize) * 100);
  const setToAdmin = container?.users?.length === 0 ? true : false;
  const column = [
    {
      title: "Name",
      render: (user) => {
        return (
          <Typography.Text>
            {user.firstName} {user.lastName}
          </Typography.Text>
        );
      },
      key: "firstName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];
  isAdmin &&
    column.push({
      title: "",
      key: "action",
      render: (user) => (
        <Space size="middle">
          {!user.isVerified ? (
            <>
              <Typography.Text>Invite Sent</Typography.Text>
              <Button
                className="textUnderline"
                type="text"
                icon={<DeleteIcon />}
                onClick={() => removeUser(container.containerCode, user.email)}
              />
            </>
          ) : user.isAdmin ? (
            <Typography.Text className="textUnderline">Admin</Typography.Text>
          ) : (
            <>
              <Button
                className="textUnderline"
                type="text"
                onClick={() => makeAdmin(container.containerCode, user.email)}
              >
                Make Admin
              </Button>
              <Popconfirm
                onConfirm={() =>
                  removeUser(container.containerCode, user.email)
                }
                title="Are you sure you want to remove this participant?"
              >
                <Button icon={<DeleteIcon />} type={"text"} />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    });

  const InviteOtherParticipantsModule = () => {
    const size = competition.teamSize - users.length;
    return (
      <>
        <div className="settingsInviteBlock">
          {size && (
            <Typography.Text className="settingsInviteTitle">
              invite {size} more teammates
            </Typography.Text>
          )}

          <Progress percent={percentage} />
          <Typography.Text className="settingsInviteBlockText">
            <Button type="text" onClick={() => setVisibleOnBoardModal(true)}>
              Onboard Team
            </Button>
            Failing to add your team will devoid your teammates of their hard
            earned points
          </Typography.Text>
        </div>
      </>
    );
  };

  return (
    <div className="settingsTabContent">
      <div className="settingsTabHeader">
        <Typography.Title className="settingsTabHeaderHeading" level={3}>
          {container?.emojiObject ? (
            <p className="settingsTabHeaderHeadingEmoji">
              {container?.emojiObject?.emoji}
            </p>
          ) : (
            <Avatar src={container.imageURL} />
          )}
          {container?.containerName}
        </Typography.Title>
        {/* <Typography.Text className="registeredAccount">
          {" "}
          <CheckCircleFilled
            style={{
              color: "#1DDB8B",
            }}
          />{" "}
          Registered
        </Typography.Text> */}
        {(competition.minTeamSize !== null &&
          competition.minTeamSize === container.users.length) ||
        competition.teamSize === container.users.length ? (
          <Typography.Text className="registeredAccount">
            {" "}
            <CheckCircleFilled
              style={{
                color: "#1DDB8B",
              }}
            />{" "}
            Registered
          </Typography.Text>
        ) : (
          <></>
        )}
      </div>
      <Divider className="borderStyle" />
      <Table
        className="settingsTableContent"
        columns={column}
        dataSource={users}
      />
      {isAdmin && container?.users?.length !== competition?.teamSize && (
        <InviteOtherParticipantsModule />
      )}

      <AssignTeamOrParticipantModal
        isVisible={isVisibleOnBoardModal}
        setVisible={setVisibleOnBoardModal}
        container={container}
        setToAdmin={setToAdmin}
      />
    </div>
  );
};

export default TeamSettings;
