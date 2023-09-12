import { EllipsisOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  List,
  Menu,
  Skeleton,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { checkLegalRegistration } from "../../utility/common";
import { CheckNewIcon, DragIcon, ReplyIcon } from "../../utility/iconsLibrary";

const AppTeamsItem = ({
  readOnlyState,
  isSelected,
  onSelectContainer,
  container,
  competition,
  rooms = [],
  moveContainer,
  isActive,
  selectionMood,
  isMobile,
  id,
  crewUser,
}) => {
  const { role } = useSelector((state) => state.auth.user);
  const [isLegalRegistrationDone, setIsLegalRegistrationDone] = useState(false);
  const manageScoring = crewUser && crewUser?.permissions?.manageScoring;

  useEffect(() => {
    const isLegal = checkLegalRegistration(competition, container);
    setIsLegalRegistrationDone(isLegal);
  }, [container]);

  const roomsMenu = (
    <Menu>
      {rooms.map((room) => (
        <Menu.Item
          onClick={() => {
            moveContainer({
              containerCode: container?.containerCode,
              roomCode: room.roomCode,
            });
          }}
          key={room.roomCode}
        >
          {`${room.roomName} (${room.containersCount || 0})`}
        </Menu.Item>
      ))}
    </Menu>
  );
  // if (container && container.roundScores) {
  //   container.points = Object.values(container.roundScores).reduce(
  //     (prevVal, curVal) => prevVal + curVal
  //   );
  // }

  const listActions = [];
  if (!readOnlyState) {
    if (role !== "CREW") {
      listActions.push(
        <Dropdown.Button
          type="text"
          key="list-edit"
          overlay={roomsMenu}
          trigger={["click"]}
          placement="bottomRight"
          className="dropdown-btn"
          icon={<ReplyIcon />}
          arrow={{ pointAtCenter: true }}
        />
      );
    } else {
      if (manageScoring) {
        listActions.push(
          <Dropdown.Button
            type="text"
            key="list-edit"
            overlay={roomsMenu}
            trigger={["click"]}
            placement="bottomRight"
            className="dropdown-btn"
            icon={<ReplyIcon />}
            arrow={{ pointAtCenter: true }}
          />
        );
      }
    }
  }
  listActions.push(<Button key="list-drag" icon={<DragIcon />} type="text" />);

  return (
    <List.Item
      id={id}
      className={`${
        selectionMood
          ? `${isSelected ? "selected" : ""}`
          : `${isActive && !isMobile && "active"}`
      }`}
      // className={`${isSelected ? "selected" : ""} ${isActive ? "active" : ""}`}
      // style={isActive ? { borderColor: "purple" } : {}}
      actions={listActions}
    >
      <Skeleton avatar title={false} loading={false} active>
        <List.Item.Meta
          onClick={() => {
            onSelectContainer(container, id);
          }}
          style={{ cursor: "pointer" }}
          avatar={
            <div className="relative">
              {container?.emojiObject ? (
                <p
                  className="competitionTeamsEmoji"
                  style={{ fontSize: "2rem", marginBottom: 0 }}
                >
                  {container?.emojiObject?.emoji}
                </p>
              ) : (
                <Avatar
                  src={
                    container?.imageURL || "https://joeschmoe.io/api/v1/random"
                  }
                />
              )}
              {Boolean(container?.users.length) && (
                <div className="absolute bottom-0 right-0">
                  {isLegalRegistrationDone &&
                  Boolean(container?.lockRegistration) ? (
                    <CheckNewIcon className="statusIcon green" />
                  ) : (
                    <EllipsisOutlined className="statusIcon orange" />
                  )}
                </div>
              )}
            </div>
          }
          title={
            <>
              <Typography.Title className="teamTitle">
                {container?.containerName}
              </Typography.Title>
              {!container?.users?.length && (
                <Typography.Text className="teamSubtext">
                  (Unassigned)
                </Typography.Text>
              )}
            </>
          }
          description={
            role === "CREW" && !manageScoring
              ? ""
              : `${
                  isNaN(container?.points)
                    ? 0
                    : container?.points.toFixed(3) || 0
                } points`
          }
        />
      </Skeleton>
    </List.Item>
  );
};

export default AppTeamsItem;
