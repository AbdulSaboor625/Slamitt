import {
  ClockCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Input,
  Popconfirm,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useMediaQuery from "../../../../hooks/useMediaQuery";
import { encodeBase64 } from "../../../../utility/common";
import { DeleteIcon } from "../../../../utility/iconsLibrary";
import AppNameAvater from "../../../AppAvatar/AppNameAvater";
import AppModal from "../../../AppModal";

const isJudgeSessionEnded = (status) =>
  status === "JUDGED" || status === "ABANDONED";

const JudgesCard = ({
  round,
  judgeCode,
  readOnlyState,
  firstName,
  lastName,
  email,
  about,
  status,
  onRemoveJudge,
  isScoreStatusModalVisible,
  imageURL,
  emojiObject,
  onResendInvite,
  invitationStatus,
  allowJudgeReEntry,
  judge,
  onClick,
  crewUser,
  setScoreStatusModalVisibilty,
  setSelectedJudge,
  verified,
}) => {
  const { role } = useSelector((state) => state.auth.user);
  let statusText = readOnlyState ? "Scores not Submitted" : "Currently Judging";
  if (status === "INVITED")
    statusText = readOnlyState ? "Judge not Onboarded" : "Invited";
  if (status === "JUDGED")
    statusText = readOnlyState ? "Scores Submitted" : "Judged";
  if (status === "ABANDONED") statusText = "Abandoned";
  if (status === "LOGGED OUT")
    statusText = readOnlyState ? "Scores not Submitted" : "Logged Out";

  const [confirmDelete, setConfirmDelete] = useState("");
  const [openJudgeModal, setOpenJudgeModal] = useState(false);

  useEffect(() => {
    if (isScoreStatusModalVisible) {
      setOpenJudgeModal(false);
    }
  }, [isScoreStatusModalVisible]);

  const onCancel = () => {
    setConfirmDelete("");
  };

  const DeleteJudgePopup = () => {
    const [confirmDelete, setConfirmDelete] = useState("");
    const deleteJudge = () => {
      if (confirmDelete === "DELETE") {
        onRemoveJudge();
        setConfirmDelete("");
      }
    };
    return (
      <Popconfirm
        title={
          <>
            {status === "JUDGED" ? (
              <Typography.Text>
                Are you sure? All the scores from this judge will be deleted
                immediately.
              </Typography.Text>
            ) : (
              <Typography.Text>
                Are you sure? All the scores from this judge will be deleted
                immediately and the judge session will be terminated
              </Typography.Text>
            )}
            <Input
              type={"text"}
              autoFocus={true}
              placeholder="Type DELETE"
              value={confirmDelete}
              onChange={(e) => {
                setConfirmDelete(e.target.value.toUpperCase());
              }}
            />
          </>
        }
        onConfirm={deleteJudge}
        onCancel={onCancel}
        okText={<Button disabled={confirmDelete !== "DELETE"}>Yes</Button>}
        okType="button"
        cancelText="No"
      >
        <Button icon={<DeleteIcon />} type="text" />
      </Popconfirm>
    );
  };

  const isMobile = useMediaQuery("(max-width: 767px)");

  const CardForJudge = ({ from = "normal" }) => {
    return (
      <Card
        className={`${status} judgeCard`}
        extra={readOnlyState ? <></> : role !== "CREW" && <DeleteJudgePopup />}
      >
        <div
          className={`${from === "normal" && "judgeCardContent"}`}
          onClick={onClick}
          style={{ cursor: status !== "INVITED" ? "pointer" : "default" }}
        >
          <div
            className={`${"judgeCardHeader"}`}
            // onClick={() => {
            //   setOpenJudgeModal(true);
            // }}
          >
            {imageURL?.includes("media.licdn") ? (
              <>
                <div className="judgeCardHeaderAvatar">
                  {verified && (
                    <Avatar
                      className="linkedinIcon"
                      src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1684869022533_Vector.svg"
                      alt="linkdin"
                    />
                  )}
                  <Avatar src={imageURL} alt="img" />
                </div>
              </>
            ) : (
              <AppNameAvater user={{ firstName, lastName }} />
            )}

            <div className="judgeCardHeaderTextbox">
              <Typography.Text className="judgeCardName">{`${firstName} ${
                lastName ? lastName : ""
              }`}</Typography.Text>
              <Typography.Text className={`judgeCardTextCode breakEmail`}>
                {email}
              </Typography.Text>
            </div>
          </div>
          <Typography.Text className={`judgeCardTextCode breakEmail`}>
            Email: {email}
          </Typography.Text>

          <p className="judgeCardText">{about}</p>
        </div>
        {round && round.isLive ? (
          <>
            <div
              className={`flex flex-col gap-y-3 items-center ${
                from === "normal" && "btns-judgin-area"
              }`}
            >
              <>
                {status !== "JUDGING" && !readOnlyState && (
                  <Button
                    className="button-outline btn-invite"
                    type="ghost"
                    onClick={
                      isJudgeSessionEnded(status)
                        ? allowJudgeReEntry
                        : onResendInvite
                    }
                  >
                    {isJudgeSessionEnded(status)
                      ? "Allow Re-Entry"
                      : "Resend invite"}
                  </Button>
                )}
                {status == "JUDGED" ||
                status == "JUDGING" ||
                status == "LOGGED OUT" ? (
                  <Button
                    className="button-outline buttonViewSession"
                    type="ghost"
                    onClick={() => {
                      setScoreStatusModalVisibilty(true);
                      setSelectedJudge(judge);
                    }}
                  >
                    View Session
                  </Button>
                ) : (
                  ""
                )}
                {!isJudgeSessionEnded(status) && !readOnlyState && (
                  <Tooltip title="Copied!" trigger="click">
                    <Button
                      className="button-outline"
                      type="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${
                            process.env.NEXT_PUBLIC_NEXT_URL + "/login/judge/"
                          }${encodeBase64({
                            judgeCode,
                            competitionRoundCode: round.competitionRoundCode,
                            type: "JUDGE",
                          })}`
                        );
                      }}
                    >
                      Secret Link
                    </Button>
                  </Tooltip>
                )}
              </>
            </div>
            <div className="judgeCardFooter">
              <div className="judgeCardFooterInfo">
                {invitationStatus ? (
                  <span
                    className={`${status} ${
                      !readOnlyState || status === "JUDGED"
                        ? "judgeCardStatusIcon"
                        : ""
                    } `}
                  >
                    {!readOnlyState && <ClockCircleOutlined />}
                  </span>
                ) : (
                  <InfoCircleOutlined />
                )}
                {invitationStatus ? statusText : "Email Delivery Failed"}
              </div>
            </div>
          </>
        ) : (
          <div className="judgeCardFooter">
            <div className="judgeCardFooterInfo">
              {!readOnlyState ? (
                <>
                  <PlusOutlined />
                  Ready to invite
                </>
              ) : (
                "Invite not Sent!"
              )}
            </div>
          </div>
        )}
      </Card>
    );
  };

  const JudgeCardModal = ({ isVisible, setVisible }) => {
    return (
      <AppModal
        className="judgeCardMobileModal"
        isVisible={isVisible}
        onCancel={() => setVisible(false)}
      >
        <CardForJudge from="modal" />
      </AppModal>
    );
  };

  return (
    <>
      <CardForJudge />
      {/* {isMobile && (
        <JudgeCardModal
          isVisible={openJudgeModal}
          setVisible={setOpenJudgeModal}
        />
      )} */}
    </>
  );
};

export default JudgesCard;
