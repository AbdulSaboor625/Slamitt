import { Avatar, Typography } from "antd";
import React from "react";

export default function AppNameAvater({ user }) {
  return (
    <Avatar
      className="crewAvatar"
      icon={
        <Typography.Text>
          {(user?.firstName ? user?.firstName[0]?.toUpperCase() : "") +
            (user?.lastName ? user?.lastName[0]?.toUpperCase() : "")}
        </Typography.Text>
      }
    />
  );
}
