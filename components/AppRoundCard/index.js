import { MoreOutlined } from "@ant-design/icons";
import { Card, Image, Tooltip, Typography } from "antd";
import React from "react";
import { titleCase } from "../../utility/common";
import AppDropDown from "../AppDropdown";

const AppRoundCard = ({
  readOnlyState,
  round,
  onRoundClicked,
  onRoundOptionSelection,
  activeRoundCode,
  id,
}) => {
  const getCardColor = () => {
    const allJudges = round?.Judges || [];
    if (round?.type === "MOCK" && round.isLive) return "black";
    if (!round.isLive) return "";
    else {
      const judgingComplete = allJudges.filter(
        (judge) => judge.status === "JUDGED"
      );
      if (allJudges.length !== 0 && judgingComplete.length === allJudges.length)
        return "black";
      else return "green";
    }
  };

  const LiveRoundMenu = () => {
    const menuList = [
      { label: "Invite Judges", value: "invite" },
      { label: "Draft Round", value: "draft", disabled: round?.Judges?.length },
    ];
    return (
      <AppDropDown
        menu={menuList}
        label={<MoreOutlined />}
        onClick={(e) => onSelectMenuOption(menuList[e.key])}
      />
    );
  };
  const DraftRoundMenu = () => {
    let allowLive = false;
    if (round.assessmentCriteria.length) {
      let minPoints = 101;
      round.assessmentCriteria.forEach((c) => {
        if (!c.isDeleted) minPoints = Math.min(c.points, minPoints);
      });
      if (minPoints >= 5 && minPoints != 101) allowLive = true;
    }
    const menuList = [
      { label: "Reset Round", value: "reset" },
      // { label: "Delete Round" },
    ];

    if (allowLive) menuList.push({ label: "Go Live", value: "live" });

    return (
      <AppDropDown
        menu={menuList}
        label={<MoreOutlined />}
        onClick={(e) => onSelectMenuOption(menuList[e.key])}
      />
    );
  };

  const onSelectMenuOption = (option) => {
    onRoundOptionSelection(round, option.value);
  };

  return (
    <>
      <div className="roundCard-item" id={id}>
        <Card
          size="small"
          bodyStyle={{
            border: `${activeRoundCode ? "3px solid #7600fe" : "0px"}`,
            borderRadius: "10px",
          }}
          title={null}
          extra={
            readOnlyState ||
            (round?.type === "GENERAL" &&
              !round?.assessmentCriteria?.length) ? (
              <></>
            ) : round.isLive ? (
              <LiveRoundMenu />
            ) : (
              <DraftRoundMenu />
            )
          }
          style={{ cursor: "pointer" }}
          className={`roundCard-box ${getCardColor()} border-8 border-y-gray-700`}
        >
          <div
            onClick={() => {
              onRoundClicked(round, id);
            }}
          >
            {round.emojiObject ? (
              <p className="roundCardEmoji" style={{ fontSize: "2.5rem" }}>
                {round.emojiObject.emoji}
              </p>
            ) : (
              <Image
                src={
                  round.imageURL &&
                  !round.imageURL.includes("https://avataaars.io/")
                    ? round.imageURL
                    : "https://rethink-competitions.s3.amazonaws.com/1665134509262_roundicon.png"
                }
                alt="round"
                height={50}
                width={50}
                preview={false}
              />
            )}
            <div className="roundCard-textbox">
              <Tooltip title={titleCase(round.roundName)}>
                <Typography.Text className="roundName">
                  {titleCase(round.roundName)}
                </Typography.Text>
              </Tooltip>
              {!readOnlyState && (
                <p className="roundStatus">
                  {round.isLive
                    ? `${getCardColor() === "black" ? "completed" : "live"}`
                    : "draft"}
                </p>
              )}
            </div>
          </div>
        </Card>
        {/* {activeRoundCode ? (
          <div className="roundCard-mock">
            <Typography.Text strong>Mock Round:</Typography.Text>
            <Switch disabled={true} />
          </div>
        ) : (
          <></>
        )} */}
      </div>
    </>
  );
};

export default AppRoundCard;
