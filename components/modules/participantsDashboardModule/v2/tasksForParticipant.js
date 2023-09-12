import { Avatar, Button, Image, Tag, Tooltip, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Api from "../../../../services";
import {
  ArrowLinkIcon,
  CrossNewIcon,
  DeleteIcon,
  FileNewIcon,
  LinkIcon,
  LockedIcon,
  UploadFileIcon,
} from "../../../../utility/iconsLibrary";
import AppModal from "../../../AppModal";
import {
  UploadFileSubmissionModal,
  UploadLinkSubmissionModal,
} from "../../competitonsModule/Rounds/submissions";
import TaskTabs from "../../competitonsModule/Rounds/tasks/taskTabs";
import { InfoCircleOutlined } from "@ant-design/icons";
import {
  CONTAINER_SCORING_EMPTY_STATE,
  socketEvents,
} from "../../../../utility/config";
import AppNameAvater from "../../../AppAvatar/AppNameAvater";
import { getAllRounds } from "../../../../Redux/Actions";
const TasksTabModal = ({ isVisible, setIsVisible, round, competition }) => {
  return (
    <AppModal
      className="participantDashboardTasksModal"
      isVisible={isVisible}
      onCancel={() => setIsVisible(false)}
    >
      <TaskTabs round={round} competition={competition} from="PARTICIPANT" />
    </AppModal>
  );
};

const TasksForParticipant = ({ competition, container, pusher }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [rounds, setRounds] = useState([]);
  const [allRoundSubmissions, setAllRoundSubmissions] = useState([]);

  useEffect(() => {
    if (competition) {
      const competitionCode = competition?.competitionCode;
      const channel = pusher.subscribe(competitionCode);

      channel.bind("receive_message", (payload) => {
        console.log("payload", payload);
        if (
          payload.event === socketEvents.submission_settings_update ||
          payload.event === socketEvents.weightage_change
        ) {
          fetchRounds();
        }
      });
    }
  }, [competition]);

  const fetchRounds = async () => {
    try {
      const response = await Api.get(`/round/${competition?.competitionCode}`);
      if (response.code && response.result) {
        setRounds(
          response?.result.filter(
            (item) =>
              item?.submissionsSettings?.isLive &&
              `${item?.competitionCode}-${item?.assignedRoomCode}` ===
                container?.competitionRoomCode
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllRoundSubmissions = async () => {
    try {
      const response = await Api.get(
        `/submissions/${container?.containerCode}`
      );
      if (response.code && response.result) {
        setAllRoundSubmissions(response?.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRounds();
    fetchAllRoundSubmissions();
  }, [competition, container]);

  const TaskContent = ({ round }) => {
    const { submissionsSettings } = round;
    const [isVisibleTabs, setIsVisibleTabs] = useState(false);
    const [isVisibleUploadModal, setIsVisibleUploadModal] = useState({
      file: false,
      link: false,
    });
    const [submissions, setSubmissions] = useState([]);

    const deadline = moment(
      round?.submissionsSettings?.guidelinesExtended?.deadline
    );
    const currentTime = moment();

    useEffect(() => {
      const submissions = allRoundSubmissions.find(
        (sub) => sub?.competitionRoundCode === round?.competitionRoundCode
      );
      if (submissions?.submissions?.length > 0)
        setSubmissions(submissions?.submissions);
    }, [allRoundSubmissions]);

    const handleUpdateSubmissions = async (subContainer, newSubmissions) => {
      let data = [];
      data = newSubmissions.map((item) => {
        if (!item.submittedBy) {
          return {
            ...item,
            submittedBy: user,
          };
        } else {
          return item;
        }
      });

      if (
        subContainer &&
        subContainer.competitionRoundCode &&
        newSubmissions &&
        Array.isArray(newSubmissions)
      ) {
        const response = await Api.update("/submissions/updateSubmission", {
          ...subContainer,
          containerCode: container?.containerCode,
          submissions: data,
        });
        if (response && response.result && response.result.submissions) {
          const newSubs = response?.result;
          const previousSubs = submissions?.filter(
            (sub) => sub?.competitionRoundCode !== newSubs?.competitionRoundCode
          );
          newSubs?.submissions?.length === subContainer?.submissions?.length
            ? setSubmissions([...submissions])
            : setSubmissions([newSubs, ...previousSubs]);
        }
      }
    };

    const Guidelines = () => {
      const formats =
        round?.submissionsSettings?.guidelinesExtended &&
        Object.keys(
          round?.submissionsSettings?.guidelinesExtended?.acceptableFormat
        ).filter(
          (format) =>
            round?.submissionsSettings?.guidelinesExtended?.acceptableFormat[
              format
            ]
        );

      const getDisplayName = (format) => {
        switch (format) {
          case "pdf":
            return "PDF";
          case "excel":
            return "EXCEL Formats";
          case "doc":
            return "DOC Formats";
          case "ppt":
            return "PPT Formats";
          case "jpg":
            return "JPG";
          case "mov":
            return "MOV";
          case "png":
            return "PNG";
          case "mp4":
            return "MP4";
          case "tiff":
            return "TIFF";
          case "psd":
            return "PSD";
          case "epf":
            return "EPF";
          case "ai":
            return "AI";
          default:
            return "";
        }
      };
      const ExtendedGuidelines = () => {
        return (
          <>
            {round?.submissionsSettings?.guidelinesExtended
              .maxAllowedSubmissions && (
              <li>
                {" "}
                {competition?.competitionType === "TEAM"
                  ? "Your team"
                  : "You"}{" "}
                have been requested to upload upto{" "}
                <span className="textPrimary">
                  {
                    round?.submissionsSettings?.guidelinesExtended
                      .maxAllowedSubmissions
                  }
                </span>{" "}
                {round?.submissionsSettings?.guidelinesExtended
                  .maxAllowedSubmissions === 1
                  ? "submission"
                  : "submissions"}
              </li>
              // <li>
              //   Allow{" "}
              //   {competition?.competitionType === "TEAM"
              //     ? "Teams"
              //     : "Participants"}{" "}
              //   to attach{" "}
              //   <span className="textPrimary">
              //     {
              //       round?.submissionsSettings?.guidelinesExtended
              //         .maxAllowedSubmissions
              //     }
              //   </span>{" "}
              //   submissions
              // </li>
            )}
            {round?.submissionsSettings?.guidelinesExtended?.deadline && (
              <li>
                Submission deadline is on{" "}
                <span className="textPrimary">
                  {moment(
                    round?.submissionsSettings?.guidelinesExtended?.deadline
                  ).format("LL")}
                </span>{" "}
                at{" "}
                <span className="textPrimary">
                  {moment(
                    round?.submissionsSettings?.guidelinesExtended?.deadline
                  ).format("LT")}
                </span>
              </li>
            )}
            {round?.submissionsSettings?.guidelinesExtended
              ?.lockParticipantWhenDeadlineCrossed && (
              <li>
                Submissions will get locked for all{" "}
                {competition?.competitionType === "TEAM"
                  ? "Team"
                  : "Participant"}{" "}
                when deadline commences.
              </li>
            )}
            {round?.submissionsSettings?.guidelinesExtended?.acceptableFormat
              .all && <li>Submissions will be accepted in all formats.</li>}
            {!round?.submissionsSettings?.guidelinesExtended?.acceptableFormat
              .all && formats.filter((item) => item !== "all").length ? (
              <li>
                Submissions will be accepted in the given formats:{" "}
                <span className="textPrimary">
                  {formats
                    .filter((item) => item !== "all")
                    .map(
                      (item, index) =>
                        getDisplayName(item) +
                        `${
                          formats.filter((item) => item !== "all").length ==
                          index + 1
                            ? "."
                            : ","
                        }`
                    )}
                </span>
              </li>
            ) : (
              <></>
            )}
          </>
        );
      };
      return (
        <ul className="list-disc tasksList">
          {round?.submissionsSettings?.guidelinesExtended
            ?.preConfiguredGuidelines && <ExtendedGuidelines />}
          {round?.submissionsSettings?.guidelines.map((item, index) => (
            <li>{item?.guidelineText}</li>
          ))}
        </ul>
      );
    };

    const Resources = () => {
      return (
        <div className="tasksTabResources">
          {round?.submissionsSettings?.resources?.map((item, index) => (
            <div className="taskResourcesAttachment" key={index}>
              <span className="icon">
                {item.type === "FILE" ? <FileNewIcon /> : <LinkIcon />}{" "}
              </span>
              <Typography.Link href={item?.url} target="_blank">
                {item?.fileName}
              </Typography.Link>
              {/* <Typography.Text>124.4kb</Typography.Text> */}
            </div>
          ))}
        </div>
      );
    };

    const UploadSubmissionComponent = ({ submissionsSettings }) => {
      if (
        submissions?.filter(
          (item) => item?.submittedBy?.userCode !== competition?.createdBy
        )?.length ===
        (submissionsSettings?.guidelinesExtended?.maxAllowedSubmissions ?? 5)
      )
        return <></>;

      if (competition.status === "CONCLUDED") return <></>;
      // if (!submissionsSettings?.visibilty?.guidelines) return <></>;
      // if (
      //   // submissionsSettings?.visibilty?.guidelines &&
      //   deadline &&
      //   currentTime.isBefore(deadline)
      // ) {
      //   return (
      //     <div className="tasksTabsHolder">
      //       <div className="taskResourcesblock">
      //         <div className="roundSubmissionsModalResourceButtons">
      //           <Button
      //             icon={<UploadFileIcon />}
      //             onClick={() =>
      //               setIsVisibleUploadModal({
      //                 ...isVisibleUploadModal,
      //                 file: true,
      //               })
      //             }
      //           >
      //             Upload File
      //           </Button>
      //           <Button
      //             icon={<LinkIcon />}
      //             onClick={() =>
      //               setIsVisibleUploadModal({
      //                 ...isVisibleUploadModal,
      //                 link: true,
      //               })
      //             }
      //           >
      //             Attach Link
      //           </Button>
      //         </div>
      //       </div>
      //     </div>
      //   );
      // }
      // if (
      //   // submissionsSettings?.visibilty?.guidelines &&
      //   (deadline && currentTime.isAfter(deadline)) ||
      //   (deadline && currentTime.isBefore(deadline))
      // ) {
      //   if (
      //     !submissionsSettings?.guidelinesExtended
      //       ?.lockParticipantWhenDeadlineCrossed ||
      //     (deadline && currentTime.isBefore(deadline))
      //   )
      return (
        <div className="roundSubmissionsModalResourceButtons">
          <Button
            icon={<UploadFileIcon />}
            onClick={() =>
              setIsVisibleUploadModal({
                ...isVisibleUploadModal,
                file: true,
              })
            }
          >
            Upload File
          </Button>
          <Button
            icon={<LinkIcon />}
            onClick={() =>
              setIsVisibleUploadModal({
                ...isVisibleUploadModal,
                link: true,
              })
            }
          >
            Attach Link
          </Button>
        </div>
      );
      //   else
      //     return (
      //       <Typography.Text className="taskStatusLine">
      //         Submissions deadline is over
      //       </Typography.Text>
      //     );
      // }
      return <></>;
    };

    const deleteResource = async (id) => {
      const sub = submissions.filter((item) => item._id != id);

      const response = await Api.update("/submissions/updateSubmission", {
        competitionRoundCode: competition?.competitionRoundCode,
        containerCode: container?.containerCode,
        submissions: sub,
      });
      // if (response && response.result && response.result.submissions) {
      //   const newSubs = response?.result;
      //   const previousSubs = submissions?.filter(
      //     (sub) => sub?.competitionRoundCode !== newSubs?.competitionRoundCode
      //   );
      //   newSubs?.submissions?.length === subContainer?.submissions?.length
      //     ? setSubmissions([...submissions])
      //     : setSubmissions([newSubs, ...previousSubs]);
      // }
    };

    const SubmissionsList = ({ submissionsSettings, isLocked }) => {
      // if (!submissionsSettings?.visibilty?.guidelines) return <></>;
      if (!!submissions?.length)
        return submissions.map((item, index) => {
          return (
            <div className="tasksTabResources">
              <div className="tasksResourceTime">
                {deadline && moment(item?.createdAt)?.isAfter(deadline) && (
                  <Tooltip
                    title={`Late Submission made at ${moment(
                      item?.createdAt
                    ).format("hh:mm A[,] DD MMM")}`}
                  >
                    <Avatar
                      className="lateIcon"
                      src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1689867866657_Group_3940.png"
                    />
                  </Tooltip>
                )}
                {moment(item?.createdAt).format("hh:mm A")}
              </div>
              <Tooltip
                // title={`${item?.submittedBy?.fName "" item?.submittedBy?.lName}`}
                title={
                  competition?.createdBy === item?.submittedBy?.userCode
                    ? "Organizer"
                    : `${item?.submittedBy?.fName} ${item?.submittedBy?.lName}`
                }
                trigger={"hover"}
              >
                <div className="taskResourcesAttachment">
                  {competition?.createdBy === item?.submittedBy?.userCode ||
                  item?.submittedBy?.imageURL ? (
                    <Avatar
                      src={
                        competition?.createdBy === item?.submittedBy?.userCode
                          ? "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1690391230070_Group_37961.png"
                          : item?.submittedBy?.imageURL
                      }
                    />
                  ) : (
                    <AppNameAvater
                      user={{
                        firstName: item?.submittedBy?.fName,
                        lastName: item?.submittedBy?.lName,
                      }}
                    />
                  )}
                  <span className="icon">
                    {item?.type === "FILE" ? (
                      <FileNewIcon className="file" />
                    ) : (
                      <LinkIcon />
                    )}
                  </span>
                  <Typography.Link>
                    {item?.type === "FILE" ? item?.fileName : item?.url}
                  </Typography.Link>
                  {competition?.status !== "CONCLUDED" && !isLocked && (
                    <Button
                      className="buttonDelete"
                      icon={<CrossNewIcon />}
                      onClick={() =>
                        handleUpdateSubmissions(
                          {
                            competitionRoundCode: round?.competitionRoundCode,
                          },
                          submissions.filter((e) => e._id != item._id)
                        )
                      }
                    />
                  )}
                </div>
              </Tooltip>
              {/* <Typography.Text className="taskStatusUser">
                Submitted by:{" "}
                {item?.submittedBy?.fName + " " + item?.submittedBy?.lName}
              </Typography.Text> */}

              {/* {moment(item?.createdAt).isAfter(deadline) && (
                <Tooltip title="Late submission">
                  <InfoCircleOutlined style={{ color: "red" }} />
                </Tooltip>
              )} */}
            </div>
          );
        });
      else
        return (
          <Typography.Text className="taskStatusLine">
            {competition?.status !== "CONCLUDED"
              ? "No Submissions have been uploaded"
              : "No Submissions were uploaded"}
          </Typography.Text>
        );
    };

    const [isLocked, setIsLocked] = useState(false);
    useEffect(() => {
      setIsLocked(
        submissionsSettings?.lockedContainerCodes?.includes(
          container?.containerCode
        )
      );
    }, [submissionsSettings, container]);

    function unescapeHtml(value) {
      var div = document.createElement("div");
      div.innerHTML = value;
      return div.textContent;
    }

    return (
      <div className="participantDashboardContent">
        <div className="participantDashboardTasks">
          {/* round avatar, name & ststus */}
          <div className="participantDashboardTasksHeader">
            <div className="participantDashboardTasksHeaderLeft">
              <Avatar
                src="https://rethink-competitions.s3.amazonaws.com/1665134509262_roundicon.png"
                alt="round Avatar"
              />
              <div className="textHolder">
                <Typography.Text className="title">
                  {round?.roundName}
                </Typography.Text>
                <div className="participantDashboardTasksStatus">
                  <div
                    className={`participantDashboardTasksStatusIcon ${
                      round?.isLive ? "bg-green-400" : "bg-slate-500"
                    }`}
                  ></div>
                  <strong>{round?.isLive ? "Live" : "Draft"}</strong>
                </div>
              </div>
            </div>
          </div>
          {/* tasks */}
          <div className="tasksTabsHolder">
            <ul className="list-disc tasksList">
              {submissionsSettings?.tasks?.length &&
                [...submissionsSettings?.tasks]
                  ?.slice(0, 3)
                  ?.map((task, index) => (
                    <li
                      key={index}
                      dangerouslySetInnerHTML={{
                        __html: unescapeHtml(task?.taskText),
                      }}
                    ></li>
                  ))}
            </ul>
          </div>

          {/* for view the tasks modal with tab system */}
          {(submissionsSettings?.tasks?.length > 3 ||
            submissionsSettings?.visibilty?.caseStudy ||
            submissionsSettings?.visibilty?.resources ||
            submissionsSettings?.visibilty?.guidelines) && (
            <div className="participantDashboardTasksButton">
              <Button type="primary" onClick={() => setIsVisibleTabs(true)}>
                view Entire Task <ArrowLinkIcon />
              </Button>
            </div>
          )}
          {/* submission guideline */}
          {submissionsSettings?.visibilty?.guidelines && (
            <div className="tasksTabsHolder">
              <Tag className="tasksTagTitle">Guidelines</Tag>
              <Guidelines />
            </div>
          )}
          {/* resources */}
          {/* {submissionsSettings?.resources?.length &&
            submissionsSettings?.visibilty?.resources && (
              <div className="tasksTabsHolder">
                <Tag className="tasksTagTitle">Resources</Tag>
                <Resources />
              </div>
            )} */}

          <div className="tasksTabsHolder tasksTabResourcesFooter">
            <div className="tasksTabResourcesUploadedList">
              <SubmissionsList
                isLocked={isLocked}
                submissionsSettings={submissionsSettings}
              />
              {isLocked && (
                <Typography.Text className="submissionStatusLocked">
                  {" "}
                  <LockedIcon className="lockedIcon" />
                  <span className="submissionStatusBlockTextWrap">
                    <strong className="title">Submissions Locked</strong>
                    <span className="submissionStatusBlockTextSubtext">
                      Reach out to the organiser to request for submission
                      permission for this round
                    </span>
                  </span>
                </Typography.Text>
              )}
              {!isLocked && round?.allowParticipantsForSubmission && (
                <UploadSubmissionComponent
                  submissionsSettings={submissionsSettings}
                />
              )}
            </div>
          </div>
          {/* {isLocked && (
            <Typography.Text>
              {" "}
              <LockedIcon className="lockedIcon" />
              <span className="submissionStatusBlockTextWrap">
                Submissions Locked
                <span className="submissionStatusBlockTextSubtext">
                  Reach out to the organiser to request for submission
                  permission for this round
                </span>
              </span>
            </Typography.Text>
          )} */}
          {/* All Modals */}
          <div>
            <TasksTabModal
              isVisible={isVisibleTabs}
              setIsVisible={setIsVisibleTabs}
              round={round}
              competition={competition}
            />

            <UploadLinkSubmissionModal
              round={round}
              isModalVisible={isVisibleUploadModal.link}
              containerName={container?.containerName}
              container={{
                competitionRoundCode: round?.competitionRoundCode,
                submissions: [],
              }}
              hideUploadModel={(newSubmissions) => {
                handleUpdateSubmissions(
                  { competitionRoundCode: round?.competitionRoundCode },
                  [...submissions, ...newSubmissions]
                );
                setIsVisibleUploadModal({
                  ...isVisibleUploadModal,
                  link: false,
                });
              }}
            />
            <UploadFileSubmissionModal
              containerName={container.containerName}
              container={{
                competitionRoundCode: round?.competitionRoundCode,
                submissions: [],
              }}
              isModalVisible={isVisibleUploadModal.file}
              hideUploadModel={(newSubmissions) => {
                handleUpdateSubmissions(
                  { competitionRoundCode: round?.competitionRoundCode },
                  [...submissions, ...newSubmissions]
                );
                setIsVisibleUploadModal({
                  ...isVisibleUploadModal,
                  file: false,
                });
              }}
              round={round}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* !rounds?.length ||
      rounds?.filter((item) => !item.submissionsSettings).length */}
      {!rounds?.length ? (
        <div className="participantDashboardPlaceholder tasksEmptyState">
          <Image
            className="participantDashboardPlaceholderImage"
            preview={false}
            width={114}
            height={127}
            alt="thumbnail"
            src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1688407002465_image_404.png"
          />
          <Typography.Text className="participantDashboardPlaceholderText">
            Organiser hasn’t released any task for this competition
          </Typography.Text>
        </div>
      ) : (
        rounds?.map(
          (round, i) =>
            round?.submissionsSettings &&
            round?.submissionsSettings?.isLive && (
              <TaskContent key={i} round={round} />
            )
        )
      )}
    </div>
  );
};

export default TasksForParticipant;
