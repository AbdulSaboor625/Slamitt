import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Anchor,
  Button,
  Col,
  Image,
  Input,
  Row,
  Switch,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import { useCSVDownloader } from "react-papaparse";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllContainers,
  getAllRounds,
  notify,
  updateRound,
} from "../../../../Redux/Actions";
import Api from "../../../../services";
import {
  addHttpsToUrl,
  generateAcceptProperties,
  getPresenceChannelName,
  isValidURL,
} from "../../../../utility/common";
import {
  CrossIcon,
  EllipseIcon,
  FileNewIcon,
  ImportSubmissionIcon,
  LinkIcon,
  LockedIcon,
  SettingsIcon,
  UnlockedIcon,
  UploadFileIcon,
  UploadIcon,
} from "../../../../utility/iconsLibrary";
import AppModal from "../../../AppModal";
import AppUploadBox from "../../../AppUploadBox";
import ImportFromCSV from "../../../CSVImport";
import { GuidelineText } from "../../participantsDashboardModule/v2/submission";
import { socketEvents } from "../../../../utility/config";

const MAX_ALLOWED_SUBMISSIONS = 5;

const isDuplicateSubmission = (container, newSubmissions, submission, type) => {
  if (!container) return false;
  const finalSubmissions = [
    ...(container.submissions || []),
    ...newSubmissions,
  ];
  return finalSubmissions.filter((s) => {
    if (type === "FILE") return s.fileName === submission.fileName;
    else if (type === "LINK") return s.url === submission.url;
  }).length;
};

const UploadCsvModal = ({
  competition,
  containers,
  isVisible,
  setIsVisible,
  handleBulkUpdateSubmissions,
}) => {
  const { CSVDownloader, Type } = useCSVDownloader();

  const [error, setError] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  const isTeamCompetition =
    competition && competition.competitionType === "TEAM";

  let teamCodeOrPartCode = "Part Code";
  if (isTeamCompetition) teamCodeOrPartCode = "Team Code";

  const previousContainerData = containers.map((c) => {
    let container = {};
    container[teamCodeOrPartCode] = c.containerName;
    container = {
      ...container,
      Link1: c.submissions.length > 0 ? c.submissions[0].url : "",
      Link2: c.submissions.length > 1 ? c.submissions[1].url : "",
      Link3: c.submissions.length > 2 ? c.submissions[2].url : "",
      Link4: c.submissions.length > 3 ? c.submissions[3].url : "",
      Link5: c.submissions.length > 4 ? c.submissions[4].url : "",
    };
    return container;
  });

  return (
    <div>
      <AppModal
        closable={false}
        className="csvUploadModal"
        isVisible={isVisible}
        onOk={() => {
          setIsVisible(false);
          setError(false);
          setSubmissions([]);
        }}
        onCancel={() => {
          setSubmissions([]);
          setIsVisible(false);
          setError(false);
        }}
      >
        <div className="csvUploadPopup">
          <Typography.Title
            className="csvUploadPopupTitle text-center"
            level={4}
          >
            {`Set up ${isTeamCompetition ? "Team" : "Participant"} Submissions`}
          </Typography.Title>
          <Typography.Text className="csvUploadTemplateText">
            {`Download this `}
            <Anchor>
              <CSVDownloader
                className="text-[#3498db]"
                type={Type.Button}
                filename={"sample"}
                config={{
                  delimiter: ",",
                }}
                data={previousContainerData}
              >
                {`Sample Submission Template`}
              </CSVDownloader>
            </Anchor>
            {` to see an example of the format required`}
          </Typography.Text>

          <ImportFromCSV
            setError={setError}
            setSubmissions={setSubmissions}
            allContainers={containers}
          />

          <div
            className="csvUploadPopupFooter"
            style={{ justifyContent: "center" }}
          >
            <div className="csvUploadPopupButtons">
              <Button
                className="csvUploadButton"
                type="primary"
                shape="round"
                size="small"
                disabled={error || !submissions.length}
                onClick={() => {
                  handleBulkUpdateSubmissions(submissions);
                  setSubmissions([]);
                }}
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      </AppModal>
    </div>
  );
};

export const UploadLinkSubmissionModal = ({
  containerName,
  container,
  isModalVisible,
  hideUploadModel,
  round,
}) => {
  const dispatch = useDispatch();
  const [link, setLink] = useState("");
  const [newContainerSubmissions, setNewContainerSubmissions] = useState([]);

  const handleDeleteLink = (idx) =>
    setNewContainerSubmissions([
      ...newContainerSubmissions.filter((s, i) => i !== idx),
    ]);
  return (
    <AppModal
      className="forgotScoreModal"
      closable={false}
      isVisible={isModalVisible}
      onOk={() => {
        hideUploadModel([]);
        setLink("");
        setNewContainerSubmissions([]);
      }}
      onCancel={() => {
        hideUploadModel([]);
        setLink("");
        setNewContainerSubmissions([]);
      }}
      footer={false}
      style={{ borderRadius: "20px" }}
    >
      <Row justify="left" className="submissionUploadBlock">
        <Col className="mx-0" span={24}>
          <Typography.Title className="w-100">{`Attach links submission on behalf of ${containerName}`}</Typography.Title>
          <Typography.Text className="submissionUploadBlockTextNote">
            You may upload up to{" "}
            {round?.submissionsSettings?.guidelinesExtended
              ?.maxAllowedSubmissions
              ? round?.submissionsSettings?.guidelinesExtended
                  ?.maxAllowedSubmissions
              : 1}{" "}
            links
          </Typography.Text>
        </Col>
        <Col className="mx-0 submissionUploadLinkField" span={24}>
          {newContainerSubmissions.map((submission, i) => (
            <Input
              className="my-2"
              prefix={<LinkIcon />}
              key={i}
              value={submission.url}
              suffix={
                <Button
                  className="buttonDelete"
                  onClick={() => handleDeleteLink(i)}
                >
                  <CrossIcon />
                </Button>
              }
              disabled={true}
            />
          ))}
          {(round?.submissionsSettings?.maxAllowedSubmissions ?? 5) >
            newContainerSubmissions.length && (
            <Input
              prefix={<LinkIcon />}
              value={link}
              placeholder="Enter link"
              onChange={(e) => setLink(e.target.value.trim())}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim() !== "") {
                  const newSubmission = {
                    type: "LINK",
                    url: addHttpsToUrl(link.trim()),
                  };
                  if (isValidURL(e.target.value)) {
                    if (
                      isDuplicateSubmission(
                        container,
                        newContainerSubmissions,
                        newSubmission,
                        "LINK"
                      )
                    ) {
                      dispatch(
                        notify({
                          type: "error",
                          message: "Submission already added!",
                        })
                      );
                    } else {
                      // setNewContainerSubmissions([
                      //   ...newContainerSubmissions,
                      //   newSubmission,
                      // ]);
                      container.submissions.length +
                        newContainerSubmissions.length <
                      (round?.submissionsSettings?.maxAllowedSubmissions ?? 5)
                        ? setNewContainerSubmissions([
                            ...newContainerSubmissions,
                            newSubmission,
                          ])
                        : dispatch(
                            notify({
                              type: "error",
                              message: `You have already added ${
                                round?.submissionsSettings
                                  ?.maxAllowedSubmissions ?? 5
                              } files`,
                            })
                          );
                    }
                    setLink("");
                  } else {
                    dispatch(
                      notify({
                        type: "error",
                        message: "Please enter a valid URL",
                      })
                    );
                  }
                }
              }}
            />
          )}
        </Col>
        <Col className="mx-auto" span={24}>
          <Button
            className="buttonUpload"
            type="primary"
            disabled={
              container?.submissions?.length + newContainerSubmissions?.length >
              5
            }
            onClick={() => {
              if (link && isValidURL(link)) {
                const newSubmission = {
                  type: "LINK",
                  url: addHttpsToUrl(link.trim()),
                };
                if (
                  isDuplicateSubmission(
                    container,
                    newContainerSubmissions,
                    newSubmission,
                    "LINK"
                  )
                ) {
                  dispatch(
                    notify({
                      type: "error",
                      message: "Submission already added!",
                    })
                  );
                } else {
                  hideUploadModel([...newContainerSubmissions, newSubmission]);
                }
              } else {
                // hideUploadModel(newContainerSubmissions);
                dispatch(
                  notify({
                    type: "error",
                    message: "Please enter a valid URL",
                  })
                );
              }
              setLink("");
              setNewContainerSubmissions([]);
            }}
          >
            {`Attach`}
          </Button>
        </Col>
      </Row>
    </AppModal>
  );
};

const UploadLinkResourceModal = ({
  isModalVisible,
  setOpenUploadResource,
  setResourse,
  resource,
}) => {
  const dispatch = useDispatch();
  const [link, setLink] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  return (
    <AppModal
      className="forgotScoreModal"
      isVisible={isModalVisible}
      onCancel={() => {
        setLink("");
        setOpenUploadResource(false);
      }}
      footer={false}
      style={{ borderRadius: "20px" }}
    >
      <Row justify="left" className="submissionUploadBlock">
        <Col className="mx-0" span={24}>
          <Typography.Title className="w-100">{`Enter a link to attach a Resource`}</Typography.Title>
        </Col>
        <Col className="mx-0 submissionUploadLinkField" span={24}>
          <Input
            prefix={<LinkIcon />}
            value={link}
            placeholder="Enter link"
            onChange={(e) => {
              setLink(e.target.value.trim());
              if (!isValidURL(e.target.value.trim())) {
                setError(true);
              } else setError(false);
            }}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter" && e.target.value.trim() !== "") {
            //     if (isValidURL(e.target.value)) {
            //       setLink("");
            //     } else {
            //       dispatch(
            //         notify({
            //           type: "error",
            //           message: "Please enter a valid URL",
            //         })
            //       );
            //     }
            //   }
            // }}
          />
          {error && (
            <Typography.Text className="text-danger">
              Please enter a valid URL
            </Typography.Text>
          )}
          {errorMsg && (
            <div>
              <Typography.Text className="text-danger">
                {errorMsg}
              </Typography.Text>
            </div>
          )}
        </Col>
        <Col className="mx-auto" span={24}>
          <Button
            className="buttonUpload"
            type="primary"
            disabled={error}
            onClick={() => {
              if (link && isValidURL(link)) {
                if (
                  !resource
                    .filter((rsc) => rsc.type === "LINK")
                    .filter((rsc) => rsc.url === addHttpsToUrl(link.trim()))
                    .length
                ) {
                  setResourse([
                    ...resource,
                    { url: addHttpsToUrl(link.trim()), type: "LINK" },
                  ]);
                  setLink("");
                  setOpenUploadResource(false);
                } else {
                  setErrorMsg("Submission already added!");
                }
              }
            }}
          >
            {`Attach`}
          </Button>
        </Col>
      </Row>
    </AppModal>
  );
};

export const UploadFileSubmissionModal = ({
  containerName,
  container,
  isModalVisible,
  hideUploadModel,
  round,
}) => {
  const dispatch = useDispatch();
  const [newContainerSubmissions, setNewContainerSubmissions] = useState([]);

  const handleDeleteFile = (idx) =>
    setNewContainerSubmissions([
      ...newContainerSubmissions.filter((s, i) => i !== idx),
    ]);
  return (
    <AppModal
      className="forgotScoreModal"
      closable={false}
      isVisible={isModalVisible}
      onOk={() => {
        hideUploadModel([]);
        setNewContainerSubmissions([]);
      }}
      onCancel={() => {
        hideUploadModel([]);
        setNewContainerSubmissions([]);
      }}
      footer={false}
      style={{ borderRadius: "20px" }}
    >
      <Row justify="left" className="submissionUploadBlock">
        <Col className="mx-0" span={24}>
          <Typography.Title>{`Attach files submission on behalf of ${containerName}`}</Typography.Title>
          <Typography.Text className="submissionUploadBlockTextNote">
            You may upload up to{" "}
            {round?.submissionsSettings?.guidelinesExtended
              ?.maxAllowedSubmissions
              ? round?.submissionsSettings?.guidelinesExtended
                  ?.maxAllowedSubmissions
              : 1}{" "}
            files
          </Typography.Text>
        </Col>
        <Col className="mx-0" span={24}>
          {newContainerSubmissions.map((submission, i) => (
            <Input
              className="submissionUploadeditem"
              prefix={<FileNewIcon />}
              key={i}
              value={submission.fileName}
              suffix={
                <Button onClick={() => handleDeleteFile(i)}>
                  <CrossIcon />
                </Button>
              }
              disabled={true}
            />
          ))}

          {(round?.submissionsSettings?.maxAllowedSubmissions ?? 5) >
            newContainerSubmissions.length && (
            <AppUploadBox
              multiple
              fileSize={20}
              maxCount={round?.submissionsSettings?.maxAllowedSubmissions ?? 5}
              accept={generateAcceptProperties(
                round?.submissionsSettings?.guidelinesExtended?.acceptableFormat
              )}
              setImageUploaded={(file) => {
                if (file && file.code && file.result) {
                  const newSubmission = {
                    fileName: file.fileName,
                    url: file.result.location,
                    type: "FILE",
                  };
                  if (
                    isDuplicateSubmission(
                      container,
                      newContainerSubmissions,
                      newSubmission,
                      "FILE"
                    )
                  ) {
                    dispatch(
                      notify({
                        type: "error",
                        message: `Submission already added!`,
                      })
                    );
                  } else {
                    if (
                      container.submissions.length +
                        newContainerSubmissions.length <
                      (round?.submissionsSettings?.maxAllowedSubmissions ?? 5)
                    ) {
                      setNewContainerSubmissions([
                        ...newContainerSubmissions,
                        newSubmission,
                      ]);
                    } else {
                      dispatch(
                        notify({
                          type: "error",
                          message: `You have already added ${
                            round?.submissionsSettings?.maxAllowedSubmissions ??
                            5
                          } files`,
                        })
                      );
                    }
                  }
                }
              }}
            >
              <Button>
                <UploadIcon />
              </Button>
            </AppUploadBox>
          )}
          {/* ))} */}
          <Typography.Text className="submissionUploadLimit">
            Upload upto 20mb
          </Typography.Text>
        </Col>
        <Col className="mx-auto" span={24}>
          <Button
            className="buttonUpload"
            type="primary"
            disabled={!newContainerSubmissions?.length}
            onClick={() => {
              hideUploadModel(newContainerSubmissions);
              setNewContainerSubmissions([]);
            }}
          >
            {`Upload`}
          </Button>
        </Col>
      </Row>
    </AppModal>
  );
};

export const SubmissionCounter = ({
  onChange = () => null,
  minCount,
  defaultValue = 5,
  hasSubmissions,
}) => {
  const [count, setCount] = useState(defaultValue);
  useEffect(() => {
    onChange(count);
  }, [count]);
  return (
    <div className="submissionsCounter">
      <Input
        min={minCount || 1}
        addonAfter={
          <Button
            icon={<PlusOutlined />}
            type="text"
            // disabled={count >= 5}
            onClick={() => count < 5 && setCount(count + 1)}
          />
        }
        readOnly={true}
        value={count}
        addonBefore={
          <Button
            // disabled={count < 2}
            icon={<MinusOutlined />}
            type="text"
            onClick={() => count > 1 && setCount(count - 1)}
          />
        }
      />
    </div>
  );
};

const Submissions = ({
  readOnlyState,
  roundData,
  allcontainers,
  competition,
  rooms,
  organiserSide = false,
  pusher,
}) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const [isUploadModalVisible, setIsUploadModalVisible] = useState({
    link: false,
    file: false,
  });
  const [hasSubmissions, setHasSubmissions] = useState(false);
  const [openSubmissionSetting, setOpenSubmissionSetting] = useState(false);
  const [containers, setContainers] = useState([]);
  const [container, setContainer] = useState({
    submissions: [],
  });
  const [assignedRoom, setAssignedRoom] = useState({});
  const [allowParticipantsForSubmission, setAllowParticipantsForSubmission] =
    useState(roundData?.allowParticipantsForSubmission || false);
  const [isSubmissionsCsvModalVisible, setIsSubmissionsCsvModalVisible] =
    useState(false);

  useEffect(() => {
    const channel = pusher?.subscribe(
      getPresenceChannelName(allcontainers?.[0]?.competitionRoomCode)
    );

    channel?.bind("receive_message", (payload) => {
      console?.log("payload", payload);
      if (payload?.event === socketEvents?.update_submissions) {
        dispatch(getAllContainers());
      } else if (payload?.event === socketEvents?.submission_settings_update) {
        dispatch(getAllRounds(payload?.data?.competitionCode));
      }
    });
  }, []);

  useEffect(() => {
    if (
      allcontainers &&
      allcontainers.length &&
      roundData &&
      roundData.competitionRoundCode
    ) {
      setAllowParticipantsForSubmission(
        roundData?.allowParticipantsForSubmission
      );
      const submissionContainers = [];
      const { competitionRoundCode, submissionsSettings } = roundData;
      const lockedCodes = submissionsSettings?.lockedContainerCodes || [];

      let roundHasSubmissions = false;

      allcontainers.forEach((container) => {
        const {
          containerName,
          containerCode,
          competitionRoomCode,
          imageURL,
          emojiObject,
          Submission,
        } = container;

        const submissionContainer = {
          containerName,
          containerCode,
          competitionRoomCode,
          competitionRoundCode,
          imageURL,
          emojiObject,
          submissions: [],
          submissionLock: false,
        };

        if (Submission && Submission.length) {
          const currentRoundSubmission = Submission.find(
            (s) =>
              s.containerCode === containerCode &&
              s.competitionRoundCode === competitionRoundCode
          );
          if (currentRoundSubmission && currentRoundSubmission.submissions) {
            submissionContainer.submissions =
              currentRoundSubmission.submissions;
            if (currentRoundSubmission.submissions.length) {
              roundHasSubmissions = true;
            }
          }
        }

        if (lockedCodes.includes(containerCode)) {
          submissionContainer.submissionLock = true;
        }

        submissionContainers.push(submissionContainer);
      });

      setHasSubmissions(roundHasSubmissions);

      setContainers([...submissionContainers]);
    }
    if (!allcontainers?.length) {
      setContainers([]);
    }
    const room = rooms.find((r) => r?.roomCode === roundData?.assignedRoomCode);
    setAssignedRoom(room);
  }, [allcontainers, roundData]);

  const isAnyContainerUnLocked = () => {
    let flag = false;
    containers?.map((container) => {
      if (!container?.submissionLock) {
        flag = true;
      }
    });
    return flag;
  };
  const handleUpdateSubmissions = async (
    container,
    submissions,
    allowParticipantsForSubmission
  ) => {
    const data = submissions.map((item) => {
      if (!item.submittedBy) {
        return (item = {
          ...item,
          submittedBy: user,
          //  {
          //   firstName: allowParticipantsForSubmission ? fName : "Organiser",
          //   lastName: allowParticipantsForSubmission ? lName : "",
          //   userCode,
          // },
        });
      } else {
        return item;
      }
    });
    if (
      container &&
      container.competitionRoundCode &&
      container.containerCode &&
      submissions &&
      Array.isArray(submissions)
    ) {
      const response = await Api.update("/submissions/updateSubmission", {
        ...container,
        submissions: data,
      });

      if (response && response.result && response.result.submissions) {
        const updatedContainers = containers.map((container) => {
          if (container.containerCode === response.result.containerCode) {
            return { ...container, submissions: response.result.submissions };
          }

          return { ...container };
        });
        setContainers([...updatedContainers]);
        dispatch(getAllContainers());
      }
    }
  };

  const handleBulkUpdateSubmissions = async (submissions) => {
    if (submissions && Array.isArray(submissions)) {
      try {
        const response = await Api.post(
          "/submissions/addSubmission/organizer",
          {
            competitionRoundCode: roundData?.competitionRoundCode,
            submissions: submissions,
          }
        );

        setIsSubmissionsCsvModalVisible(false);

        if (response && response.result && response.result.length) {
          const updatedContainers = [...containers];
          updatedContainers.forEach((container) => {
            const updatedContainer = response.result.find(
              (c) => c.containerCode === container.containerCode
            );
            if (updatedContainer) {
              container.submissions = updatedContainer.submissions || [];
            }
          });
          setContainer([...updatedContainers]);
        }

        dispatch(getAllContainers());

        dispatch(
          notify({
            type: "success",
            message: "Submissions added succesfully!",
          })
        );
      } catch (error) {
        dispatch(notify({ type: "error", message: error?.message }));
      }
    }
  };

  const SettingsSubmissionModal = ({
    openSubmissionSetting,
    setOpenSubmissionSetting,
    submissionsSettings,
    setAllowParticipantsForSubmission,
  }) => {
    const [maxAllowedSubmissions, setMaxAllowedSubmissions] = useState(
      submissionsSettings?.maxAllowedSubmissions || 5
    );
    const [lockedContainerCodes, setLockedContainerCodes] = useState(
      submissionsSettings?.lockedContainerCodes
    );
    const [guidelines, setGuidelines] = useState(
      submissionsSettings?.guidelines || []
    );
    const [guidelineText, setGuidelineText] = useState("");
    const [openUploadResource, setOpenUploadResource] = useState(false);
    const [resource, setResourse] = useState(
      submissionsSettings?.resource || []
    );

    const contentEditable = useRef(null);
    const [notesList, setNotesList] = useState(
      submissionsSettings.guidelines?.length
        ? submissionsSettings.guidelines
            .map((g) => {
              return `<li>${g.guidelineText}</li>`;
            })
            .join("")
        : "<li>&nbsp;</li>"
    );

    const handleChange = (e) => {
      let data = e.target.value;

      // insert empty list tags to maintain styling if there is nothing in notes
      if (data === "<li><br></li>") {
        data = data.replace(/<li><br\s*\/?><\/li>/gi, "<li>&nbsp;</li>");
      }
      //  else {
      //   // data = data.replace(/<li>&nbsp;/gi, '<li>');
      // }

      // data = data.replace(/<li><br\s*\/?><\/li>/gi, '<li>&nbsp;</li>');
      // data = data.replace(/<li>&nbsp;.+/gi, '<li>');
      data = data.replace(/&nbsp;&nbsp;|&nbsp;\s+&nbsp;/gi, "");
      data = data.replace(/<li><\/li>/g, "");

      setNotesList(data);

      setGuidelines(
        data
          .split(/<\/?li>|<br>|&nbsp;/)
          .filter(Boolean)
          .map((guidelineText) => ({ guidelineText }))
      );
    };

    const handleSetUpSubmissions = () => {
      const codes = Boolean(submissionsSettings)
        ? submissionsSettings?.lockedContainerCodes
        : containers?.map((c) => c.containerCode);
      const submissionsSettings = !Boolean(guidelineText)
        ? {
            guidelines,
            maxAllowedSubmissions,
            resource,
          }
        : {
            guidelines: [...guidelines, { guidelineText }],
            maxAllowedSubmissions,
            resource,
          };
      const body = {
        competitionRoundCode: roundData?.competitionRoundCode,
        submissionsSettings,
        allowParticipantsForSubmission: true,
      };
      dispatch(updateRound(body));
      setOpenSubmissionSetting(false);
    };

    const deleteSubmission = (idx) => {
      const filtered = resource.filter((item, i) => i !== idx);
      setResourse(filtered);
    };

    const [errorMsg, setErrorMsg] = useState();

    return (
      <AppModal
        className="roundSubmissionsModal"
        onCancel={() => {
          setOpenSubmissionSetting(false);
          !submissionsSettings?.guidelines &&
            setAllowParticipantsForSubmission(false);
        }}
        isVisible={openSubmissionSetting}
        footer={
          !readOnlyState && (
            <div>
              <Button type="primary" onClick={handleSetUpSubmissions}>
                Done
              </Button>
            </div>
          )
        }
      >
        <div className="roundSubmissionsModalContent">
          <Image
            preview={false}
            width={100}
            alt="Submission"
            src="https://rethink-competitions.s3.amazonaws.com/1676302695441_image.png"
          />
          <Typography.Text className="roundSubmissionsModalTitle">
            Set up Round submissions
          </Typography.Text>
          <div className="roundSubmissionsModalTextbox">
            <Typography.Text className="roundSubmissionsModalSubtitle">
              {!roundData?.isLive && "Add"} Guidelines
            </Typography.Text>
            <div className="roundSubmissionsModalListWrap">
              <ul className="roundSubmissionsModalList">
                <li>
                  Allow{" "}
                  {competition?.competitionType === "SOLO"
                    ? "participants"
                    : "teams"}{" "}
                  to attach{" "}
                  {readOnlyState ? (
                    `${maxAllowedSubmissions}`
                  ) : (
                    <SubmissionCounter
                      hasSubmissions={hasSubmissions}
                      defaultValue={maxAllowedSubmissions}
                      onChange={(e) => setMaxAllowedSubmissions(e)}
                    />
                  )}{" "}
                  submissions
                </li>

                <ContentEditable
                  innerRef={contentEditable}
                  html={notesList}
                  disabled={false}
                  onChange={handleChange}
                  tagName="div"
                />

                {/* {guidelines?.length
                  ? guidelines.map((g, i) => <li key={i}>{g.guidelineText}</li>)
                  : null} */}
                {/* {readOnlyState ? null : (
                  <li>
                    <Input
                      className="addTextField"
                      bordered={false}
                      placeholder="Add here..."
                      value={guidelineText}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && guidelineText === "") {
                          e.preventDefault();
                          setGuidelineText(
                            guidelines[guidelines.length - 1]?.guidelineText
                          );
                          setGuidelines(guidelines.slice(0, -1));
                        }
                      }}
                      onChange={(e) => {
                        setGuidelineText(e.target.value);
                      }}
                      onPressEnter={(e) => {
                        if (e?.target?.value !== "") {
                          setGuidelines([
                            ...guidelines,
                            { guidelineText: e.target.value },
                          ]);
                          setGuidelineText("");
                        }
                      }}
                    />
                  </li>
                )} */}
              </ul>
            </div>
          </div>
          <div className="roundSubmissionsModalResource">
            <Typography.Text className="roundSubmissionsModalSubtitle">
              Add up to 5 resource files and/or links
            </Typography.Text>
            <div>
              {readOnlyState ? (
                <Typography.Text className="roundSubmissionsModalResourceText">
                  No Resources were added
                </Typography.Text>
              ) : (
                <div>
                  {/* {resource?.url ? (
                    <div className="roundSubmissionsResourceLink">
                      {resource?.type === "FILE" ? (
                        <UploadFileIcon />
                      ) : (
                        <LinkIcon />
                      )}
                      <Typography.Text>{resource?.url}</Typography.Text>
                      {!readOnlyState && (
                        <Button
                          icon={<CrossIcon />}
                          className="buttonDelete"
                          onClick={() => setResourse({ type: "", url: "" })}
                        />
                      )}
                    </div>
                  ) : ( */}
                  {resource.length < 5 && (
                    <div className="roundSubmissionsModalResourceButtons">
                      <AppUploadBox
                        multiple
                        maxCount={5}
                        fileSize={20}
                        accept={"*"}
                        setImageUploaded={(file) => {
                          if (file && file.code && file.result) {
                            const newSubmission = {
                              fileName: file.fileName,
                              url: file.result.location,
                              type: "FILE",
                            };
                            const rsc = resource.filter(
                              (item) => item.url !== ""
                            );
                            if (
                              !!rsc.filter(
                                (r) => r.fileName === newSubmission.fileName
                              ).length
                            ) {
                              setErrorMsg("Submission already added!");
                            } else {
                              setResourse([...rsc, newSubmission]);
                              setErrorMsg();
                            }
                          }
                        }}
                      >
                        <Button icon={<UploadFileIcon />}>Upload a file</Button>
                      </AppUploadBox>
                      <Typography.Text className="or">or</Typography.Text>
                      <Button
                        onClick={() => setOpenUploadResource(true)}
                        icon={<LinkIcon />}
                      >
                        Attach a Link
                      </Button>
                    </div>
                  )}
                  {/* // )} */}
                </div>
              )}
            </div>
            <div className="submissionUploadeditemBlock">
              {errorMsg && (
                <Typography.Text className="text-danger">
                  {errorMsg}
                </Typography.Text>
              )}
              {!!resource?.length ? (
                resource.map((resource, idx) => {
                  return (
                    <div
                      key={idx}
                      className="roundSubmissionsResourceLink submissionUploadeditem"
                    >
                      {resource?.type === "FILE" ? (
                        <UploadFileIcon />
                      ) : (
                        <LinkIcon />
                      )}
                      <Typography.Text>{resource?.url}</Typography.Text>
                      {!readOnlyState && (
                        <Button
                          icon={<CrossIcon />}
                          className="buttonDelete"
                          onClick={() => deleteSubmission(idx)}
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                <></>
              )}
            </div>
          </div>
          <UploadLinkResourceModal
            isModalVisible={openUploadResource}
            setOpenUploadResource={setOpenUploadResource}
            setResourse={setResourse}
            resource={resource}
          />
        </div>
      </AppModal>
    );
  };

  const handleLockAllContainersSubmissions = (isAllLocked) => {
    const containerCodes = containers.map((c) => c.containerCode);
    dispatch(
      updateRound({
        competitionRoundCode: roundData?.competitionRoundCode,
        submissionsSettings: {
          ...(roundData?.submissionsSettings || {}),
          lockedContainerCodes: isAllLocked ? containerCodes : [],
        },
      })
    );
  };

  const handleLockContainerSubmissions = (containerCode, lock) => {
    let containerCodes = roundData?.submissionsSettings?.lockedContainerCodes
      ? [...roundData?.submissionsSettings?.lockedContainerCodes]
      : [];
    if (lock && !containerCodes.includes(containerCode)) {
      containerCodes.push(containerCode);
    } else if (!lock) {
      containerCodes = containerCodes.filter((c) => c !== containerCode);
    }
    dispatch(
      updateRound({
        competitionRoundCode: roundData?.competitionRoundCode,
        submissionsSettings: {
          ...(roundData?.submissionsSettings || {}),
          lockedContainerCodes: [...containerCodes],
        },
      })
    );
  };

  if (!containers.length) {
    return (
      <div className="judgesEmptyPlaceholder">
        <div className="judgesEmptyPlaceholderBlock">
          <Image
            preview={false}
            width={500}
            height={500}
            alt="thumbnail"
            src="https://rethink-competitions.s3.amazonaws.com/1669755981870_empty_state.png"
          />
          <Typography.Text className="judgesEmptyPlaceholderTitle">
            Add participant to {assignedRoom?.roomName} list to upload
            submissions
          </Typography.Text>
        </div>
      </div>
    );
  }

  const UploadSubmissionButton = ({ round, container, competition }) => {
    return (
      <div className="submissionTableCol">
        <Button
          className="btnSubmissionLink"
          onClick={() => {
            setContainer(container);
            setIsUploadModalVisible({
              ...isUploadModalVisible,
              file: true,
            });
          }}
        >
          <UploadFileIcon style={{ display: "inline-block" }} />
          <span className="btnText">Upload File</span>
        </Button>
        <Button
          className="btnSubmissionLink"
          onClick={() => {
            setContainer(container);
            setIsUploadModalVisible({
              ...isUploadModalVisible,
              link: true,
            });
          }}
        >
          <LinkIcon style={{ display: "inline-block" }} />
          <span className="btnText">Attach Link</span>
        </Button>
      </div>
    );
  };

  return (
    <div className="submissionsContent">
      {readOnlyState && !hasSubmissions ? (
        <div className="judgeSubmissionsPlaceholder">
          <div className="judgeSubmissionsHeaderTextbox text-center">
            <Image
              src={
                "https://rethink-competitions.s3.amazonaws.com/1669460084654_organiserNoSubmissions.svg"
              }
              preview={false}
              className="text-center"
              alt="no submissions"
            />
          </div>
          <div className="text-center">
            <Typography.Text className="judgeSubmissionsPlaceholderText">
              {`No submissions were uploaded`}
            </Typography.Text>
          </div>
        </div>
      ) : (
        <>
          <UploadLinkSubmissionModal
            containerName={container.containerName}
            container={container}
            isModalVisible={isUploadModalVisible.link}
            hideUploadModel={(newSubmissions) => {
              handleUpdateSubmissions(
                container,
                [...container.submissions, ...newSubmissions],
                roundData?.allowParticipantsForSubmission
              );
              setIsUploadModalVisible({ ...isUploadModalVisible, link: false });
            }}
            round={roundData}
          />
          <UploadFileSubmissionModal
            containerName={container.containerName}
            container={container}
            isModalVisible={isUploadModalVisible.file}
            hideUploadModel={(newSubmissions, name) => {
              handleUpdateSubmissions(
                container,
                [...container.submissions, ...newSubmissions],
                roundData?.allowParticipantsForSubmission
              );
              setIsUploadModalVisible({ ...isUploadModalVisible, file: false });
            }}
            round={roundData}
          />
          {/* {competition?.status !== "CONCLUDED" && (
            <div className="submissionsContentHeader">
              <div>
                {" "}
                {competition?.status != "CONCLUDED" && !readOnlyState && (
                  <div className="submissionsButtonWrap">
                    {isAnyContainerUnLocked() ? (
                      <Button
                        onClick={() => handleLockAllContainersSubmissions(true)}
                        icon={<LockedIcon />}
                      >
                        Lock all Submissions
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          handleLockAllContainersSubmissions(false)
                        }
                        icon={<UnlockedIcon />}
                      >
                        Unlock all Submissions
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div className="submissionsContentHeaderToggle">
                <Typography.Text>
                  Allow Participants to upload Submissions
                </Typography.Text>
                <Switch
                  checked={allowParticipantsForSubmission}
                  onChange={(e) => {
                    if (roundData?.submissionsSettings) {
                      setAllowParticipantsForSubmission(e);
                      dispatch(
                        updateRound({
                          competitionRoundCode: roundData?.competitionRoundCode,
                          allowParticipantsForSubmission: e,
                        })
                      );
                    } else {
                      setOpenSubmissionSetting(true);
                    }
                  }}
                />
              </div>
            </div>
          )} */}
          {containers?.length >= 1 && (
            <div className="submissionsContentHeader">
              {allowParticipantsForSubmission ? (
                <div className="submissionsContentHeaderButtons hiddenMobile">
                  {/* <Button
                    className="buttonSettings"
                    onClick={() => setOpenSubmissionSetting(true)}
                    icon={<SettingsIcon />}
                  >
                    Settings
                  </Button> */}
                  {competition?.status != "CONCLUDED" && !readOnlyState && (
                    <div className="submissionsButtonWrap">
                      {isAnyContainerUnLocked() ? (
                        <Button
                          onClick={() =>
                            handleLockAllContainersSubmissions(true)
                          }
                          icon={<LockedIcon />}
                        >
                          Lock all Submissions
                        </Button>
                      ) : (
                        <Button
                          onClick={() =>
                            handleLockAllContainersSubmissions(false)
                          }
                          icon={<UnlockedIcon />}
                        >
                          Unlock all Submissions
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                !readOnlyState && (
                  <Button
                    className="buttonImportSubmission"
                    icon={<ImportSubmissionIcon />}
                    onClick={() => setIsSubmissionsCsvModalVisible(true)}
                  >
                    {`${
                      hasSubmissions
                        ? // ? "Update Submissions"
                          "Import Submissions"
                        : "Import Submissions"
                    }`}
                  </Button>
                )
              )}
              {readOnlyState && roundData?.allowParticipantsForSubmission ? (
                <div>
                  <Typography.Text>
                    Participants were required to make submissions
                  </Typography.Text>
                </div>
              ) : (
                <div className="submissionsContentHeaderToggle">
                  <Typography.Text>
                    Allow Participants to upload Submissions
                  </Typography.Text>
                  <Switch
                    disabled={competition?.status === "CONCLUDED"}
                    checked={allowParticipantsForSubmission}
                    onChange={(e) => {
                      if (roundData?.submissionsSettings) {
                        setAllowParticipantsForSubmission(e);
                        dispatch(
                          updateRound({
                            competitionRoundCode:
                              roundData?.competitionRoundCode,
                            allowParticipantsForSubmission: e,
                          })
                        );
                      } else {
                        setOpenSubmissionSetting(true);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          )}
          {roundData?.submissionsSettings &&
            roundData?.allowParticipantsForSubmission && (
              <GuidelineText round={roundData} />
            )}
          <div className="visibleMobile">
            {containers?.length >= 1 && (
              <div className="submissionsContentHeader">
                {allowParticipantsForSubmission ? (
                  <div className="submissionsContentHeaderButtons">
                    <Button
                      className="buttonSettings"
                      onClick={() => setOpenSubmissionSetting(true)}
                      icon={<SettingsIcon />}
                    >
                      Settings
                    </Button>
                    {competition?.status != "CONCLUDED" && !readOnlyState && (
                      <div className="submissionsButtonWrap">
                        {isAnyContainerUnLocked() ? (
                          <Button
                            onClick={() =>
                              handleLockAllContainersSubmissions(true)
                            }
                            icon={<LockedIcon />}
                          >
                            Lock all Submissions
                          </Button>
                        ) : (
                          <Button
                            onClick={() =>
                              handleLockAllContainersSubmissions(false)
                            }
                            icon={<UnlockedIcon />}
                          >
                            Unlock all Submissions
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>
          <div className="submissionTableBlock teamSubmissions">
            {containers.map((container) => (
              <div className="submissionTableRow" key={container.containerCode}>
                <div className="submissionTableRowItem">
                  <div className="submissionTableRowItemAvatar">
                    <EllipseIcon className="ellipseIcon" />
                    {container?.emojiObject ? (
                      <p
                        className="submissionTeamEmoji"
                        style={{ fontSize: "2rem" }}
                      >
                        {container?.emojiObject.emoji}
                      </p>
                    ) : (
                      <Image
                        src={container?.imageURL}
                        preview={false}
                        width={40}
                        heigth={40}
                        alt="thumbnail"
                      />
                    )}
                    {!readOnlyState && (
                      <div>
                        {roundData?.allowParticipantsForSubmission ? (
                          <div className="submissionStatusIcon">
                            {container?.submissionLock ? (
                              <LockedIcon
                                onClick={() =>
                                  handleLockContainerSubmissions(
                                    container?.containerCode,
                                    false
                                  )
                                }
                                className="cursor-pointer submissionStatusIconImage locked"
                              />
                            ) : (
                              <UnlockedIcon
                                onClick={() =>
                                  handleLockContainerSubmissions(
                                    container?.containerCode,
                                    true
                                  )
                                }
                                className="cursor-pointer submissionStatusIconImage"
                              />
                            )}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                  <div className="submissionTableRowItemTextbox">
                    <Typography.Text className="submissionTeamName">
                      {container?.containerName}
                    </Typography.Text>
                    {!readOnlyState && competition?.status !== "CONCLUDED" && (
                      <div>
                        {roundData?.allowParticipantsForSubmission && (
                          <Typography.Text className="submissionTableRowItemSubtext">
                            {container?.submissionLock
                              ? "Submissions Locked"
                              : "Submissions Open"}
                          </Typography.Text>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {readOnlyState &&
                  !(container.submissions && container.submissions.length) && (
                    <Typography.Text>{"No Submissions made"}</Typography.Text>
                  )}
                <div className="submissionTableRowContent">
                  {container.submissions.length < MAX_ALLOWED_SUBMISSIONS &&
                    !readOnlyState &&
                    !roundData?.allowParticipantsForSubmission && (
                      <UploadSubmissionButton
                        competition={competition}
                        round={roundData}
                        container={container}
                      />
                    )}
                  <div className="submissionTableLinks">
                    {container.submissions.map((submission, i) => (
                      <div key={i} className=" linkItem">
                        {!readOnlyState &&
                          !roundData?.allowParticipantsForSubmission && (
                            <CrossIcon
                              onClick={() => {
                                const updatedSubmissions =
                                  container.submissions.filter(
                                    (s, idx) => idx !== i
                                  );
                                handleUpdateSubmissions(
                                  container,
                                  updatedSubmissions,
                                  roundData?.allowParticipantsForSubmission
                                );
                              }}
                              className="submissionLinkDelete"
                            />
                          )}
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
                        </Tooltip>
                        {/* {!organiserSide && (
                          <div className="submissionTitle">
                            {(roundSub?.round?.Competition?.competitionType ===
                              "TEAM" ||
                              submission?.submittedBy?.firstName ===
                                "Organiser") && (
                              <>
                                <Tooltip
                                  title={`${submission?.submittedBy?.firstName}{" "}
                                  ${submission?.submittedBy?.lastName}`}
                                  trigger={"hover"}
                                  placement="top"
                                  color={"black"}
                                >
                                  <span className="strongName">
                                    Submitted by:
                                  </span>
                                </Tooltip>
                              </>
                            )}
                          </div>
                        )} */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <SettingsSubmissionModal
            openSubmissionSetting={openSubmissionSetting}
            setOpenSubmissionSetting={setOpenSubmissionSetting}
            setAllowParticipantsForSubmission={
              setAllowParticipantsForSubmission
            }
            submissionsSettings={roundData?.submissionsSettings || {}}
          />
          <UploadCsvModal
            competition={competition}
            containers={containers}
            isVisible={isSubmissionsCsvModalVisible}
            setIsVisible={setIsSubmissionsCsvModalVisible}
            handleBulkUpdateSubmissions={handleBulkUpdateSubmissions}
          />
        </>
      )}
    </div>
  );
};

export default Submissions;
