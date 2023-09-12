import { Progress, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { findRegisteredUsers } from "../../../utility/common";
import { AvatarIcon, GroupCheckIcon } from "../../../utility/iconsLibrary";

export const progressText = (competition, container) => {
  const registeredUsers = findRegisteredUsers(container?.users);
  let condition = () => {
    if (competition?.teamSize) {
      if (competition?.minTeamSize) {
        if (container?.users?.length === competition?.teamSize) {
          return "fullSize";
        } else if (container?.users?.length < competition?.minTeamSize) {
          return "lessMin";
        } else if (container?.users?.length < competition?.teamSize) {
          return "lessSizeWithMin";
        }
      } else {
        if (container?.users?.length === competition?.teamSize) {
          return "fullSize";
        }
        if (container?.users?.length < competition?.teamSize) {
          return "lessSize";
        }
      }
    } else if (competition?.competitionType === "TEAM") {
      return "notConfigured";
    }
  };
  let text = "";
  let emptyText = (
    <span>
      {`This code hasn't been assigned to any ${
        competition?.competitionType === "TEAM" ? "team" : "participant"
      }`}
    </span>
  );
  const fullSizeText = () => {
    if (Boolean(competition?.minTeamSize)) {
      if (registeredUsers?.userRegistered >= competition?.minTeamSize)
        // return `${container?.containerName} is all set!`;
        return `Maximum no. of team members have been met!`;
      else
        return `Waiting for ${
          competition?.minTeamSize - registeredUsers?.userRegistered
        } team member to complete registering and access their dashboard`;
    } else {
      if (registeredUsers?.userRegistered === competition?.teamSize)
        // return `${container?.containerName} is all set!`;
        return `Maximum no. of team members have been met!`;
      else
        return `Waiting for ${
          competition?.teamSize - registeredUsers?.userRegistered
        } team member to complete registering and access their dashboard`;
    }
  };

  const lessSizeWithMinText = () => {
    // if (registeredUsers?.userRegistered >= competition?.minTeamSize)
    return `Minimum no. of team members have been met. You may add up to ${
      competition?.teamSize - container?.users?.length
    } more members.`;
    // `${
    //   registeredUsers.userRegistered === competition?.minTeamSize
    //     ? `${container?.containerName} is all set.`
    //     : registeredUsers.userRegistered > 0
    //     ? `${registeredUsers.userRegistered} team member${
    //         registeredUsers.userRegistered > 1 ? "s" : ""
    //       } registered`
    //     : ""
    // } You may add ${
    //   competition?.teamSize - container?.users?.length
    // } more member${
    //   competition?.teamSize - container?.users?.length > 1 ? "s" : ""
    // } to this team`;
  };

  switch (condition()) {
    case "fullSize":
      text = fullSizeText();
      break;

    case "lessMin":
      // text = `Invite ${
      //   competition?.teamSize - container?.users?.length
      // } more member${
      //   competition?.teamSize - container?.users?.length > 1 ? "s" : ""
      // } to complete registration for ${container?.containerName}`;
      text = `
      Add a min of ${competition?.minTeamSize} and a max of
      ${competition?.teamSize} members to confirm registrations
    `;

      emptyText = (
        <span>{`Add a minimum of ${
          competition?.minTeamSize - container?.users?.length
        } and a maximum of ${
          competition?.teamSize - container?.users?.length
        } Participants to this code`}</span>
      );
      break;
    case "lessSizeWithMin":
      text = lessSizeWithMinText();
      emptyText = (
        <span>{`Add ${
          competition?.teamSize - container?.users?.length
        } Participant${
          competition?.teamSize - container?.users?.length > 1 ? "s" : ""
        } to this code`}</span>
      );
      break;
    case "lessSize":
      text = `Add ${
        competition?.teamSize - container?.users?.length
      } more member${
        competition?.teamSize - container?.users?.length > 1 ? "s" : ""
      } to set up ${container?.containerName}`;
      emptyText = (
        <span>{`Add ${
          competition?.teamSize - container?.users?.length
        } Participant${
          competition?.teamSize - container?.users?.length > 1 ? "s" : ""
        } to this code`}</span>
      );
      break;
    case "notConfigured":
      emptyText = (
        <span>{`Registrations for this competition has not yet been setup`}</span>
      );
      break;
    default:
      break;
  }
  return { text, emptyText, condition: condition() };
};

const ProgressBar = ({ competition, container }) => {
  const [registeredUsers, setRegisteredUsers] = useState({
    flag: false,
    userRegistered: 0,
  });
  const [parsentage, setParsentage] = useState(
    parseInt(
      Number(container?.users?.length || 0) / Number(competition?.teamSize || 0)
    ) * 100 || 0
  );
  const [progresText, setProgresText] = useState(
    progressText(competition, container)
  );

  useEffect(() => {
    if (container?.users?.length) {
      competition?.competitionType === "SOLO"
        ? setParsentage(100)
        : setParsentage(
            parseInt(
              (Number(container.users.length || 0) /
                Number(competition?.teamSize || 0)) *
                100
            )
          );
    }
    setProgresText(progressText(competition, container));
    setRegisteredUsers(findRegisteredUsers(container?.users));
  }, [container, competition]);

  return (
    <div className="teamProgressBlock">
      {competition?.status === "ACTIVE" && (
        <Progress
          success={{
            percent:
              (registeredUsers.userRegistered / competition?.teamSize) * 100 ||
              0,
            strokeColor:
              registeredUsers.userRegistered === competition?.teamSize
                ? "#1ddb8b"
                : "#6808fe",
          }}
          percent={parsentage}
          showInfo={false}
          strokeColor={"rgba(255, 170, 40, 0.4)"}
        />
      )}
      {competition?.status === "ACTIVE" ? (
        <Typography.Text className="teamProgressBlockText">
          {competition?.minTeamSize ? <GroupCheckIcon /> : <AvatarIcon />}
          {progresText.text}
        </Typography.Text>
      ) : (
        <Typography.Text className="teamProgressBlockText">
          {`${registeredUsers.userRegistered}/${
            competition?.minTeamSize
              ? competition?.minTeamSize
              : competition?.teamSize
          } members onborded`}
        </Typography.Text>
      )}
    </div>
  );
};

export default ProgressBar;
