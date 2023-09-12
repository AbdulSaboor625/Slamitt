import { Avatar, Card, Typography, Button } from "antd";
import React from "react";
import {
  LikeIcon,
  JudgeGavelIcon,
  LikeSVGIcon,
  MessageIcon,
} from "../../../utility/iconsLibrary";
import { MessageFilled } from "@ant-design/icons";

const JudgedCard = ({
  selectMultiple,
  curMaxPoints,
  curMinPoints,
  selectedMultipleContainers,
  showModal,
  container,
  maxPoints,
}) => {
  const {
    containerName,
    containerCode,
    scoredPoints,
    endorsements,
    feedback,
    emojiObject,
    imageURL,
  } = container;

  const cardAction = [];
  if (!endorsements && !feedback.audio && feedback.text) {
    cardAction.push(
      <Button
        className="inactiveFeedback"
        style={{
          border: "none",
        }}
      >
        <MessageIcon key="feedback" />
      </Button>
    );
  } else {
    if (endorsements) {
      cardAction.push(
        <Button
          style={{
            border: "none",
            fontWeight: "bold",
          }}
        >
          <LikeSVGIcon key="endorse" className="likeIcon" />{" "}
          {endorsements ? endorsements : ""}
        </Button>
      );
    }

    if (feedback.text || feedback.audio) {
      cardAction.push(
        <Button
          style={{
            border: "none",
          }}
        >
          <MessageIcon key="feedback" />
        </Button>
      );
    }
  }

  const selectedClass = selectedMultipleContainers.find(
    (c) => c.containerCode == container.containerCode
  )
    ? "selected"
    : "";

  const avatarClass =
    scoredPoints === curMaxPoints
      ? "crownEmoji"
      : scoredPoints === curMinPoints
      ? "poopEmoji"
      : "";

  return (
    <Card
      className={`judgesCard scoredCard ${avatarClass} ${selectedClass}`}
      // style={{
      //   background,
      //   textAlign: "center",
      //   borderRadius: "20px",
      //   overflow: "hidden",
      //   border: "1.5px solid #e8e4e4",
      // }}
      actions={cardAction}
      onClick={() => {
        if (!selectMultiple) showModal(containerCode);
      }}
      style={{ border: "none" }}
      key="1"
    >
      {emojiObject ? (
        <p className="judgesCardEmoji">{emojiObject.emoji}</p>
      ) : (
        <Avatar src={imageURL} />
      )}
      <Typography.Title
        className="judgesCardSubtitle"
        style={{ margin: "0" }}
        level={5}
      >
        {containerName}
      </Typography.Title>
      <Typography.Text className="judgesCardSubtext" style={{ margin: "0" }}>
        <strong>{scoredPoints}</strong>
        <span>/{maxPoints}</span>
      </Typography.Text>
    </Card>
  );
};

export default JudgedCard;
