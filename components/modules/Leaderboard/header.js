import { Button, Col, Image, Row, Switch, Tooltip, Typography } from "antd";
import React from "react";
import { LeaderBoardLogo } from "../../../utility/imageConfig";
import RankCard from "./rankCard";

import { ShareAltOutlined } from "@ant-design/icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../../../Redux/Actions";
import { routeGenerator, routes } from "../../../utility/config";
import {
  ArrowLinkIcon,
  ExportSubmissionIcon,
} from "../../../utility/iconsLibrary";
import AppCustomPicker from "../../AppCustomPicker";
import { allRoundsScoreSheet } from "../../../utility/excelService";

const LeaderBoardHeader = ({
  leaderboard,
  onPublishOrUpdateLeaderBoardPressed = () => null,
  onUpdateLeaderBoardPressed = () => null,
  container = [],
  publicLeaderboard = true,
  competition,
  participantSide,
  setContainers = () => null,
  isSwitchActive,
  setIsSwitchActive,
  showScore,
  from = "PARTCIPANT",
  canUpdateLeaderBoard = false,
}) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  // const [editedLeaderBoardName, setEditedLeaderBoardName] = React.useState(
  //   leaderboard?.leaderboardName
  // );

  const _onCopyPublicLink = () => {
    navigator.clipboard.writeText(
      routeGenerator(
        routes.leaderboardPublic,
        { leaderboardID: leaderboard?._id },
        true
      )
    );
    dispatch(
      notify({
        type: "info",
        message: "Leaderboard link copied!",
      })
    );
  };

  const _onHideContainer = (cnt, isHidden) => {
    const newContainer = container.map((c) => {
      if (c.containerName === cnt.containerName) c.isHidden = isHidden;
      return c;
    });
    setContainers(newContainer);
    // container.forEach(
    //   (c) => c.containerName === cnt.containerName && (c.isHidden = isHidden)
    // );
    isSwitchActive && onPublishOrUpdateLeaderBoardPressed(true);
  };

  const updatedAt = moment(leaderboard?.updatedAt);
  const formattedDate = updatedAt.format("LT");
  const formattedTime = updatedAt.format("D/MM/YY");
  const result = `Last Updated at ${formattedDate} on ${formattedTime}`;

  return (
    <>
      {from != "PUBLIC" && (
        <Row
          className={`leaderboardPageHeader ${
            !leaderboard?.isLive &&
            user.userCode !== leaderboard?.createdBy &&
            "empty-leaderboard"
          }`}
        >
          {/* <Col className="leaderboardPageHeaderLeft" span={6}>
          <div className="leaderboardPageHeaderUserinfo">
            {user.userCode === leaderboard?.createdBy ? (
              <AppCustomPicker
                imgStyle={{
                  marginTop: "1rem",
                  height: "4rem",
                  width: "4rem",
                  cursor: "pointer",
                }}
                emojiStyle={{
                  fontSize: "3rem",
                  lineHeight: "1.2",
                  cursor: "pointer",
                }}
                className="tabset"
                popOverClass="m-5"
                tabpaneClass="m-5"
                onImageSelected={(image) =>
                  image.type === "EMOJI"
                    ? onPublishOrUpdateLeaderBoardPressed({
                        emojiObject: image.emoji,
                      })
                    : onPublishOrUpdateLeaderBoardPressed({
                        imageURL: image.url,
                      })
                }
                defaultValue={{
                  type: leaderboard?.imageURL ? "LINK" : "EMOJI",
                  url: leaderboard?.imageURL || "",
                  emoji: leaderboard?.emojiObject || "",
                }}
              />
            ) : leaderboard?.imageURL ? (
              <div className="modalUploadSpacer">
                <Image
                  preview={false}
                  alt="leaderboard"
                  src={leaderboard?.imageURL}
                />
              </div>
            ) : (
              <div className="modalUploadSpacer">
                <span style={{ fontSize: 40 }}>
                  {leaderboard?.emojiObject?.emoji}
                </span>
              </div>
            )}
            // (its a comment) <Avatar size="large" icon={<UserOutlined />} />
            <div className="leaderboardPageHeaderUserTextbox">
              <Typography.Title
                className="leaderboardPageHeaderUsername"
                // editable={{
                //   onEnd: () =>
                //     editedLeaderBoardName !== leaderboard?.leaderboardName &&
                //     onPublishOrUpdateLeaderBoardPressed({
                //       leaderboardName: editedLeaderBoardName,
                //     }),
                //   onChange: (value) => setEditedLeaderBoardName(value),
                //   tooltip: false,
                //   triggerType: ["icon", "text"],
                //   editing: user.userCode === leaderboard?.createdBy,
                //   icon: () => null,
                //   enterIcon: () => null,
                // }}
              >
                {leaderboard?.leaderboardName}
              </Typography.Title>
              {user.userCode === leaderboard?.createdBy &&
                !publicLeaderboard && (
                  <div className="leaderboardPageHeaderToggle">
                    <Typography.Paragraph>
                      Last updated on{" "}
                      {moment(leaderboard?.updatedAt)?.format(
                        "LT ,DD MMMM, YYYY"
                      )}
                    </Typography.Paragraph>{" "}
                    <Switch
                      checked={leaderboard?.isLive}
                      onChange={(checked) =>
                        onPublishOrUpdateLeaderBoardPressed({
                          isLive: checked,
                        })
                      }
                    />
                  </div>
                )}
            </div>
          </div>
        </Col> */}
          {/* <Col
          className="leaderboardPageHeaderRight empty-leaderboard"
          span={12}
          offset={6}
        >
          <Image
            style={{
              filter: `${
                user.userCode !== leaderboard?.createdBy && !leaderboard?.isLive
                  ? "grayscale(100%)"
                  : "grayscale(0%)"
              }`,
            }}
            alt="logo"
            src={LeaderBoardLogo}
            preview={false}
          />
        </Col> */}

          {user.userCode === leaderboard?.createdBy && (
            <Row className="leaderboardPageHeaderSubrow">
              {/* {!publicLeaderboard && (
              <Button
                className="buttonRound"
                type="ghost"
                onClick={() => onUpdateLeaderBoardPressed(true)}
              >
                Reset
              </Button>
            )} */}
              <div className="leaderboardPageHeaderStatus">
                <div className="leaderboardPageHeaderToggle">
                  <span className="leaderboardPageHeaderToggleTitle">
                    {competition?.status != "CONCLUDED"
                      ? "Live Leaderboard"
                      : "Leaderboard"}
                  </span>
                  <Switch
                    checked={isSwitchActive}
                    disabled={competition?.status == "CONCLUDED"}
                    onChange={(e) => {
                      onPublishOrUpdateLeaderBoardPressed({ autoUpdate: e });
                    }}
                  />
                </div>
                {(!isSwitchActive || from == "PARTCIPANT") && (
                  <div className="leaderboardPageHeaderStatusDate">
                    <Typography.Paragraph>
                      {result}
                      {/* {moment(leaderboard?.updatedAt)?.format("LT, DD/MM/YY")} */}
                    </Typography.Paragraph>{" "}
                  </div>
                )}
              </div>
              <div className="leaderboardPageHeaderButtons">
                {!publicLeaderboard &&
                  !isSwitchActive &&
                  (canUpdateLeaderBoard ? (
                    <Button
                      className="buttonRound"
                      type="ghost"
                      onClick={() =>
                        onPublishOrUpdateLeaderBoardPressed({ update: true })
                      }
                    >
                      Update Leaderboard
                    </Button>
                  ) : (
                    <Tooltip
                      title={
                        "You cannot Update until two participants gets scored"
                      }
                      trigger={"hover"}
                      placement="top"
                      color={"black"}
                    >
                      <Button className="buttonRound" type="ghost">
                        Update Leaderboard
                      </Button>
                    </Tooltip>
                  ))}
                {!publicLeaderboard && (
                  <Button
                    className="buttonRound"
                    type="primary"
                    onClick={() => {
                      onPublishOrUpdateLeaderBoardPressed(
                        {
                          isPublished: !leaderboard?.isPublished,
                          isLive: !leaderboard?.isLive ? true : true,
                        },
                        "PUBLISH"
                      );
                    }}
                  >
                    <ArrowLinkIcon />
                    Publish
                  </Button>
                )}
                {leaderboard?.isLive && (
                  <Button
                    type="ghost"
                    icon={<ShareAltOutlined />}
                    onClick={_onCopyPublicLink}
                    className="buttonRound"
                  >
                    Copy link
                  </Button>
                )}
                {competition && (
                  <Button
                    className="buttonRound"
                    type="ghost"
                    onClick={() => {
                      allRoundsScoreSheet(
                        competition?.competitionCode,
                        competition?.competitionType
                      );
                    }}
                  >
                    <ExportSubmissionIcon />
                    Export Scoresheet
                  </Button>
                )}
              </div>
            </Row>
          )}
        </Row>
      )}
      {(user.userCode === leaderboard?.createdBy ||
        leaderboard?.isLive ||
        from == "PARTCIPANT") && (
        <Row className="leaderboardPageTeamsHeader">
          {container.map((item, index) => (
            <RankCard
              key={index}
              leaderboard={leaderboard}
              // onHideContainer={_onHideContainer}
              container={item}
              setContainers={setContainers}
              classIndex={index}
              showScore={showScore}
              from={from}
            />
          ))}
        </Row>
      )}
    </>
  );
};

export default LeaderBoardHeader;
