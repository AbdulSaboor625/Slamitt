import { Avatar, Button, Image, Tooltip, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllContainers,
  getAllRounds,
  notify,
  updateRound,
} from "../../../../Redux/Actions";
import Api from "../../../../services";
import { getPresenceChannelName } from "../../../../utility/common";
import { socketEvents } from "../../../../utility/config";
import {
  CrossIcon,
  FileNewIcon,
  LinkIcon,
  LockedIcon,
  UnlockedIcon,
  UploadFileIcon,
} from "../../../../utility/iconsLibrary";
import {
  UploadFileSubmissionModal,
  UploadLinkSubmissionModal,
} from "../../competitonsModule/Rounds/submissions";
import { useRouter } from "next/router";
import { getContainer } from "../../../../requests/container";

export const GuidelineText = ({ round }) => {
  const submissionsSettings = round?.submissionsSettings || {};
  return (
    <div className="roundSubmissionGuidelines">
      {/* <Typography.Text className="roundSubmissionGuidelinesTitle">
        Guidelines
      </Typography.Text>
      <ul className="roundSubmissionGuidelinesList">
        <li>
          Attach up to{" "}
          <span className="textPurple">
            {submissionsSettings?.maxAllowedSubmissions || 5} submissions
          </span>
        </li>
        {submissionsSettings?.guidelines?.length
          ? submissionsSettings?.guidelines?.map((g, i) => {
              return <li key={i}>{g?.guidelineText}</li>;
            })
          : null}
      </ul> */}
      {!!submissionsSettings?.resource?.length && (
        <div className="roundSubmissionGuidelinesResource">
          <Typography.Text className="roundSubmissionGuidelinesResourceTitle">
            Resource:
          </Typography.Text>
          {submissionsSettings?.resource?.map((rsc, i) => {
            return (
              <div
                key={i}
                className="roundSubmissionsResourceLink"
                style={{ cursor: "pointer" }}
                onClick={() => window.open(rsc?.url, "_blank")}
              >
                {rsc?.type === "FILE" ? (
                  <>
                    {" "}
                    <UploadFileIcon className="submissionFileIcon" />
                    <Typography.Text>{rsc?.fileName}</Typography.Text>
                  </>
                ) : (
                  <>
                    {" "}
                    <LinkIcon className="submissionLinkIcon" />
                    <Typography.Text>{rsc?.url}</Typography.Text>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const RoundBasedSubmission = ({
  roundSub = { sub: {}, round: {} },
  from,
  pusher,
  handleUpdateSubmissions,
  readOnlyState,
  competitionState,
  container,
  submissionSelected,
  setSubmissionSelected,
  allowParticipantsForSubmission,
}) => {
  const Containers = useSelector((state) => state.containers.all);
  const router = useRouter();
  const dispatch = useDispatch();
  // const newPusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  //   cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  //   channelAuthorization: {
  //     endpoint: `${process.env.NEXT_PUBLIC_BASE_URL}/pusher/auth`,
  //   },
  // });

  useEffect(() => {
    const channel = pusher?.subscribe(
      getPresenceChannelName(container?.competitionRoomCode)
    );

    channel?.bind("receive_message", (payload) => {
      if (payload?.event === socketEvents?.update_submissions) {
        dispatch(getAllContainers());
      }
    });
  }, []);

  const [isUploadModalVisible, setIsUploadModalVisible] = useState({
    link: false,
    file: false,
  });
  const [isLocked, setIsLocked] = useState(
    round?.submissionsSettings?.lockedContainerCodes?.includes(
      container?.containerCode
    )
      ? true
      : false
  );
  const { sub, round } = roundSub;
  useEffect(() => {
    // it was placed because during the first render there was no component mapped which was throwing error
    setTimeout(() => {
      if (submissionSelected && document.getElementById(submissionSelected)) {
        document
          .getElementById(submissionSelected)
          .scrollIntoView({ behavior: "smooth" });
      }
    }, 300);

    setTimeout(() => {
      if (from !== "ORGANIZER") setSubmissionSelected("");
    }, 400);
  }, [submissionSelected]);
  useEffect(() => {
    setIsLocked(
      round?.submissionsSettings?.lockedContainerCodes?.includes(
        container?.containerCode
      )
    );
  }, [container, round]);

  const [submissions, setSubmissions] = useState([]);
  // const submissions = sub?.submissions || [];
  useEffect(() => {
    if (container && round) {
      const sub = Containers?.find(
        (item) => item.containerCode === container?.containerCode
      );
      const rnd = sub?.Submission?.find(
        (item) => item.competitionRoundCode === round?.competitionRoundCode
      );
      setSubmissions(rnd?.submissions);
    }
  }, [Containers, roundSub, sub]);

  const UploadSubmissionsButton = () => {
    return (
      <div
        id={round?.competitionRoundCode}
        className="participantTimelineButtons"
      >
        <Button
          className="btnSubmissionLink"
          disabled={
            submissions?.length >=
            (round?.submissionsSettings?.maxAllowedSubmissions ?? 5)
          }
          onClick={() => {
            if (
              submissions?.length !==
              (round?.submissionsSettings?.maxAllowedSubmissions ?? 5)
            ) {
              setIsUploadModalVisible({ ...isUploadModalVisible, file: true });
            } else {
              dispatch(
                notify({
                  type: "error",
                  message: `You have already added ${
                    round?.submissionsSettings?.maxAllowedSubmissions ?? 5
                  } files`,
                })
              );
            }
          }}
          // icon={<UploadNewIcon />}
        >
          <UploadFileIcon style={{ display: "inline-block" }} />
          <span className="btnText">Upload File</span>
        </Button>
        <Button
          className="btnSubmissionLink"
          disabled={
            submissions?.length >=
            (round?.submissionsSettings?.maxAllowedSubmissions ?? 5)
          }
          // icon={<LinkIcon />}
          onClick={() =>
            setIsUploadModalVisible({ ...isUploadModalVisible, link: true })
          }
        >
          <LinkIcon style={{ display: "inline-block" }} />
          <span className="btnText">Attach Link</span>
        </Button>
      </div>
    );
  };

  const AddedSubmissions = () => {
    return (
      <div className="participantTimelineLinks">
        {submissions &&
          submissions?.map((submission, i) => {
            const CloseSubmissionButton = () => {
              return (
                <CrossIcon
                  onClick={() => {
                    const updatedSubmissions = sub.submissions.filter(
                      (s, idx) => idx !== i
                    );
                    handleUpdateSubmissions(sub, updatedSubmissions);
                  }}
                  className="submissionLinkDelete"
                />
              );
            };
            return (
              <div key={i}>
                <div className="participantTimelineLink" key={i}>
                  <Tooltip
                    placement="top"
                    // title={
                    //   submission.type === "LINK"
                    //     ? submission.url
                    //     : submission.fileName
                    // }
                    title={`${submission?.submittedBy?.fName}${" "}
                                  ${
                                    submission?.submittedBy?.lName
                                      ? submission?.submittedBy?.lName
                                      : ""
                                  }`}
                    color={"geekblue"}
                  >
                    <a
                      download={true}
                      rel="noreferrer"
                      href={submission.url}
                      target="_blank"
                      className="submissionLinkButton"
                    >
                      {submission.type === "LINK" ? (
                        <LinkIcon className="submissionLinkIcon" />
                      ) : (
                        <FileNewIcon className="submissionFileIcon" />
                      )}
                      <span className="submissionLinkWrap">
                        {submission.type === "LINK"
                          ? submission.url
                          : submission.fileName}
                      </span>
                    </a>
                    {competitionState?.status === "ACTIVE" && (
                      <div>
                        {!readOnlyState && from === "ORGANIZER" ? (
                          <div>
                            {!round?.allowParticipantsForSubmission && (
                              <CloseSubmissionButton />
                            )}
                          </div>
                        ) : (
                          round?.allowParticipantsForSubmission &&
                          !isLocked && <CloseSubmissionButton />
                        )}
                      </div>
                    )}
                  </Tooltip>
                </div>
                {/* {from === "PARTICIPANT" && (
                  <div className="submissionTitle">
                    {(roundSub?.round?.Competition?.competitionType ===
                      "TEAM" ||
                      submission?.submittedBy?.firstName === "Organiser") && (
                      <>
                        <Tooltip
                          title={`${submission?.submittedBy?.firstName}{" "}
                                  ${submission?.submittedBy?.lastName}`}
                          trigger={"hover"}
                          placement="top"
                          color={"black"}
                        >
                          <span className="strongName">Submitted by:</span>
                        </Tooltip>
                      </>
                    )}
                  </div>
                )} */}
              </div>
            );
          })}
      </div>
    );
  };

  useEffect(() => {
    if (submissions?.length > 5) {
      dispatch(
        notify({
          type: "error",
          message: "Cannot add mroe than 5 files",
        })
      );
    }
  }, [submissions]);

  const handleRound = () => {
    router.push({
      pathname: router.asPath.split("?").shift(),
      query: `content=round&compRoundCode=${round?.competitionRoundCode}`,
    });
  };

  const handleLockContainerSubmissions = (containerCode, lock) => {
    let containerCodes = round?.submissionsSettings?.lockedContainerCodes
      ? [...round?.submissionsSettings?.lockedContainerCodes]
      : [];
    if (lock && !containerCodes.includes(containerCode)) {
      containerCodes.push(containerCode);
    } else if (!lock) {
      containerCodes = containerCodes.filter((c) => c !== containerCode);
    }
    dispatch(
      updateRound({
        competitionRoundCode: round?.competitionRoundCode,
        submissionsSettings: {
          ...(round?.submissionsSettings || {}),
          lockedContainerCodes: [...containerCodes],
        },
      })
    );
  };

  const RoundSubmissionHolder = () => {
    return (
      <div
        className="participantTimelineBox roundSubmissionBox"
        id={round?.roundCode}
      >
        <div className="roundSubmissionBoxHeader">
          <div className="roundSubmissionBoxTeamInfo">
            <Avatar
              src={
                round.imageURL &&
                !round.imageURL.includes("https://avataaars.io/")
                  ? round.imageURL
                  : "https://rethink-competitions.s3.amazonaws.com/1665134509262_roundicon.png"
              }
            />
            <div
              className="roundSubmissionBoxTeamTextbox"
              onClick={handleRound}
            >
              <Typography.Text className="roundName">
                {round.roundName}
              </Typography.Text>
              <div className="roundStatus">
                {" "}
                {round.isLive ? (
                  <Typography.Text>
                    {competitionState?.status === "ACTIVE" ? (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <strong>Live</strong>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                        <strong>{competitionState?.status}</strong>
                      </div>
                    )}
                  </Typography.Text>
                ) : (
                  <Typography.Text className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <strong>Draft</strong>
                  </Typography.Text>
                )}
              </div>
            </div>
          </div>
          {from === "PARTICIPANT" ? (
            <Typography.Text className="roundDate">
              <span className="updateOn">
                {submissions.length !== 0 && "Updated on"}
              </span>{" "}
              <span className="updateDate">
                {moment(round?.updatedAt).format("DD/MM/YYYY")}
              </span>
            </Typography.Text>
          ) : null}
        </div>
        {round?.submissionsSettings && <GuidelineText round={round} />}
        <AddedSubmissions />
        {isLocked ? (
          <div className="submissionStatusBlockText participantDashboardSubmissionsClosed">
            {competitionState?.status === "ACTIVE" && (
              <div
                onClick={() =>
                  competitionState?.status === "ACTIVE" &&
                  handleLockContainerSubmissions(
                    container?.containerCode,
                    false
                  )
                }
              >
                <Typography.Text>
                  {" "}
                  <LockedIcon className="lockedIcon" />
                  <span className="submissionStatusBlockTextWrap">
                    Submissions Locked
                    <span className="submissionStatusBlockTextSubtext">
                      Reach out to the organiser to request for permission to
                      update submission for this round
                    </span>
                  </span>
                </Typography.Text>
              </div>
            )}
          </div>
        ) : (
          <div className="submissionTableRowContent direction">
            {!readOnlyState && (
              <div>
                {round?.allowParticipantsForSubmission && (
                  <div className="submissionStatusBlockText participantDashboardSubmissionsOpen">
                    <Typography.Text>
                      {" "}
                      <div
                        onClick={() =>
                          competitionState?.status === "ACTIVE" &&
                          handleLockContainerSubmissions(
                            container?.containerCode,
                            true
                          )
                        }
                      >
                        <UnlockedIcon className="unlockedIcon" />
                      </div>
                      <span className="submissionStatusBlockTextWrap">
                        Submissions Open
                      </span>
                    </Typography.Text>
                  </div>
                )}
              </div>
            )}

            {from === "ORGANIZER" ? (
              competitionState?.status === "ACTIVE" &&
              !round?.allowParticipantsForSubmission ? (
                <UploadSubmissionsButton />
              ) : null
            ) : competitionState?.status === "ACTIVE" &&
              round?.allowParticipantsForSubmission &&
              !isLocked ? (
              <UploadSubmissionsButton />
            ) : null}

            {from === "PARTICIPANT" &&
              submissions &&
              submissions.length === 0 && (
                <div className="participantTimelineNoSubmissions">
                  <Typography.Title level={5} className="text-right">
                    {round?.allowParticipantsForSubmission
                      ? "No submissions were uploaded"
                      : "Submissions may be uploaded by the organiser"}
                  </Typography.Title>
                </div>
              )}
          </div>
        )}
        <UploadFileSubmissionModal
          containerName={container.containerName}
          container={{
            competitionRoundCode: round?.competitionRoundCode,
            submissions: submissions || [],
          }}
          isModalVisible={isUploadModalVisible.file}
          hideUploadModel={(newSubmissions) => {
            handleUpdateSubmissions(
              { competitionRoundCode: round?.competitionRoundCode },
              submissions?.concat(newSubmissions)
              // [...submissions, ...newSubmissions]
            );
            setIsUploadModalVisible({
              ...isUploadModalVisible,
              file: false,
            });
          }}
          round={round}
        />
        <UploadLinkSubmissionModal
          containerName={container.containerName}
          container={{
            competitionRoundCode: round?.competitionRoundCode,
            submissions: submissions || [],
          }}
          isModalVisible={isUploadModalVisible.link}
          hideUploadModel={(newSubmissions) => {
            newSubmissions?.length &&
              handleUpdateSubmissions(
                { competitionRoundCode: round?.competitionRoundCode },
                [...submissions, ...newSubmissions]
              );
            setIsUploadModalVisible({ ...isUploadModalVisible, link: false });
          }}
          round={round}
        />
      </div>
    );
  };

  return (
    <>
      {from === "ORGANIZER" ? (
        <RoundSubmissionHolder />
      ) : allowParticipantsForSubmission ? (
        <RoundSubmissionHolder />
      ) : (
        sub?.submissions?.length > 0 && <RoundSubmissionHolder />
      )}
    </>
  );
};

const Submission = ({
  container,
  from = "PARTICIPANT",
  readOnlyState,
  submissionSelected,
  setSubmissionSelected,
  pusher,
}) => {
  // const newPusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  //   cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  //   channelAuthorization: {
  //     endpoint: `${process.env.NEXT_PUBLIC_BASE_URL}/pusher/auth`,
  //   },
  // });

  // useEffect(() => {
  //   const channel = pusher?.subscribe(
  //     getPresenceChannelName(allcontainers?.[0]?.competitionRoomCode)
  //   );

  //   channel?.bind("receive_message", (payload) => {
  //     console?.log("payload", payload);
  //     if (payload?.event === socketEvents?.update_submissions) {
  //       dispatch(getAllContainers());
  //     }
  //   });
  // }, []);

  useEffect(() => {
    const channel = pusher?.subscribe(
      getPresenceChannelName(container?.competitionRoomCode)
    );

    channel?.bind("receive_message", (payload) => {
      console.log("payload", payload);
      if (payload?.event === socketEvents?.update_submissions) {
        dispatch(getAllContainers());
      } else if (payload?.event === socketEvents?.submission_settings_update) {
        dispatch(getAllRounds(payload?.data?.competitionCode));
      }
    });
  }, []);
  const user = useSelector((state) => state.auth.user);
  const rounds = useSelector((state) => state.competition.allRounds);
  const competitionState = useSelector((state) => state.competition.current);
  const [submissions, setSubmissions] = useState([]);
  const [allRounds, setAllRounds] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    if (rounds?.length) {
      // const genarelRounds = rounds?.filter((round) => round.type !== "MOCK");
      setAllRounds(rounds);
    }
  }, [rounds]);

  useEffect(() => {
    if (from !== "ORGANIZER") {
      dispatch(getAllRounds(container?.competitionCode));
    }
    const submissions = container?.Submission?.filter((submission) => {
      if (submission?.submissions?.length > 0) return submission;
    });
    setSubmissions(submissions);
  }, [container]);

  const handleUpdateSubmissions = async (subContainer, newSubmissions) => {
    const data = newSubmissions?.map((item) => {
      if (!item.submittedBy) {
        return (item = {
          ...item,
          submittedBy: user,
        });
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

        dispatch(getAllContainers());
      }
    }
  };

  const EmptyState = () => {
    return (
      <div className="participantDashboardPlaceholder">
        <Image
          className="participantDashboardPlaceholderImage"
          preview={false}
          width={200}
          height={200}
          alt="thumbnail"
          src={
            "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1670366526605_submissionsplaceholder.png"
          }
        />
        <Typography.Text className="participantDashboardPlaceholderText">
          {competitionState?.status === "ACTIVE"
            ? from === "PARTICIPANT"
              ? "Submission requests from the organiser will appear here"
              : `Submissions from ${container?.containerName} will appear here`
            : "No submissions were uploaded by this {participant/team}"}
        </Typography.Text>
      </div>
    );
  };

  const roundWithParticipantsSubmission = allRounds?.filter(
    (rnd) => rnd.allowParticipantsForSubmission
  )?.length;

  return (
    <div className="participantDashboardContent">
      {roundWithParticipantsSubmission || !!container?.Submission?.length ? (
        allRounds?.map((round, i) => {
          const sub =
            submissions &&
            submissions.find(
              (s) => s?.competitionRoundCode === round?.competitionRoundCode
            );
          const roundSub = { sub, round };
          // if (!round || !submissions) {
          //   return (
          //     <div>
          //       <EmptyState />
          //     </div>
          //   );
          // }
          // if (roundSub.round.allowParticipantsForSubmission)
          return (
            <RoundBasedSubmission
              key={i}
              roundSub={roundSub}
              from={from}
              handleUpdateSubmissions={handleUpdateSubmissions}
              readOnlyState={readOnlyState}
              competitionState={competitionState}
              container={container}
              submissionSelected={submissionSelected}
              setSubmissionSelected={setSubmissionSelected}
              allowParticipantsForSubmission={
                round?.allowParticipantsForSubmission
              }
            />
          );
          // else return <></>;
        })
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default Submission;
