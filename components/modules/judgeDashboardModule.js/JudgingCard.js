import { Avatar, Button, Card, Typography } from "antd";
import React from "react";
import { JudgeGavelIcon } from "../../../utility/iconsLibrary";

const JudgingCard = ({
  selectMultiple,
  selectedMultipleContainers,
  container,
  showModal,
  maxPoints,
}) => {
  const { containerCode, scoredPoints, containerName, imageURL, emojiObject } =
    container;
  const selectedClass = selectedMultipleContainers.find(
    (c) => c.containerCode == container.containerCode
  )
    ? "selected"
    : "";
  return (
    <Card
      onClick={() => {
        if (!selectMultiple) {
          showModal(containerCode);
        }
      }}
      className={`judgesCard ${selectedClass}`}
      title={null}
      actions={[
        <Button
          onClick={() => {
            if (!selectMultiple) showModal(containerCode);
          }}
          icon={<JudgeGavelIcon />}
          size="small"
          type="text"
          key={"1"}
          className="judgesCardButton"
        >
          <span
            className="judgesCardButtonText"
            style={{ textDecoration: "none" }}
          >
            Start Judging
          </span>
        </Button>,
      ]}
    >
      {emojiObject ? (
        <p className="judgesCardEmoji">{emojiObject.emoji}</p>
      ) : (
        <Avatar src={imageURL} />
      )}
      <Typography.Title
        className="judgesCardSubtitle"
        level={5}
        style={{ margin: "0" }}
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

export default JudgingCard;
