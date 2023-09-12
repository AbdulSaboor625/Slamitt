import { Button, Switch, Tabs, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getSingleRound } from "../../../../../Redux/Actions";
import { addOrUpdateSubmissionSettings } from "../../../../../requests/round";
import {
  EditIcon,
  EditPencilIcon,
  FileNewIcon,
  LinkIcon,
} from "../../../../../utility/iconsLibrary";
const TaskTabs = ({ round, competition, setIsVisible, from = "ORGANISER" }) => {
  const dispatch = useDispatch();
  const [isLive, setLive] = useState(false);

  useEffect(() => {
    if (round?.submissionsSettings) setLive(round?.submissionsSettings?.isLive);
  }, [round?.submissionsSettings]);

  const onSubmit = async (e) => {
    setLive(e);
    const payload = {
      ...round.submissionsSettings,
      guidelinesExtended: {
        ...round?.submissionsSettings?.guidelinesExtended,
        deadline: {
          date: round?.submissionsSettings?.guidelinesExtended?.deadline
            ? moment(round?.submissionsSettings?.guidelinesExtended?.deadline)
            : null,
          time: round?.submissionsSettings?.guidelinesExtended?.deadline
            ? moment(round?.submissionsSettings?.guidelinesExtended?.deadline)
            : null,
        },
        guidelines: round.submissionsSettings.guidelines,
      },
      isLive: e,
      visibilityStatus: round?.submissionsSettings?.visibilty,
    };
    if (!round.submissionsSettings.guidelinesExtended.preConfiguredGuidelines)
      delete round.submissionsSettings.guidelinesExtended;

    const response = await addOrUpdateSubmissionSettings(
      round.competitionRoundCode,
      {
        submissionsSettings: payload,
      }
    );
    if (response) {
      dispatch(getSingleRound(response));
    }
  };
  const CaseStudy = () => {
    return (
      <div className="caseStudyContent">
        <div
          dangerouslySetInnerHTML={{
            __html: round?.submissionsSettings?.caseStudy,
          }}
        />
      </div>
    );
  };

  function unescapeHtml(value) {
    var div = document.createElement("div");
    div.innerHTML = value;
    return div.textContent;
  }

  const Tasks = () => {
    return (
      <div className="tasksTabsHolder">
        <ul className="list-disc tasksList">
          {round?.submissionsSettings?.tasks.map((item, index) => (
            <li key={index} dangerouslySetInnerHTML={{__html: unescapeHtml(item?.taskText)}}></li>
          ))}
        </ul>
      </div>
    );
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
            .maxAllowedSubmissions &&
            (from === "ORGANISER" ? (
              <li>
                Allow{" "}
                {competition?.competitionType === "TEAM"
                  ? "Teams"
                  : "Participants"}{" "}
                to attach{" "}
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
            ) : (
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
                  .maxAllowedSubmissions < 2
                  ? "submission"
                  : "submissions"}
              </li>
            ))}
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
              .
            </li>
          )}
          {round?.submissionsSettings?.guidelinesExtended
            ?.lockParticipantWhenDeadlineCrossed && (
            <li>
              Submissions will get locked for all{" "}
              {competition?.competitionType === "TEAM" ? "Team" : "Participant"}{" "}
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
      <div className="tasksTabsHolder">
        <ul className="list-disc tasksList">
          {round?.submissionsSettings?.guidelinesExtended
            ?.preConfiguredGuidelines && <ExtendedGuidelines />}
          {round?.submissionsSettings?.guidelines.map((item, index) => (
            <li>{item?.guidelineText}</li>
          ))}
        </ul>
      </div>
    );
  };

  const Resources = () => {
    return (
      <div className="tasksTabsHolder">
        <div className="tasksTabResources">
          {round?.submissionsSettings?.resources.map((item, index) => (
            <div className="taskResourcesAttachment" key={index}>
              <span className="icon">
                {item.type === "FILE" ? <FileNewIcon /> : <LinkIcon />}{" "}
              </span>
              <a
                className="ant-typography"
                href={
                  item.type === "LINK"
                    ? item?.url?.includes("http://") ||
                      item?.url?.includes("https://")
                      ? item?.url
                      : `http://${item?.url}`
                    : item?.url
                }
                target="_blank"
                rel="noopener  noreferrer"
              >
                {item?.fileName}
              </a>
              {/* <Typography.Text>124.4kb</Typography.Text> */}
            </div>
          ))}
        </div>
      </div>
    );
  };

  console.log(round);

  return (
    <div className="tasksTabsContentBlock">
      {from === "ORGANISER" && (
        <div className="taskLiveToggle">
          <Typography.Text>
            {competition?.status == "CONCLUDED"
              ? isLive
                ? `Task was taken live at ${moment(
                    round?.submissionsSettings?.liveOn
                  ).format("h:mm a [on] DD/MM/YYYY")}`
                : "Task was not taken live"
              : "Take task live"}
          </Typography.Text>
          <Switch
            disabled={competition?.status === "CONCLUDED"}
            onChange={onSubmit}
            checked={isLive}
          />
          {competition?.status != "CONCLUDED" && !isLive && (
            <Button
              className="buttonEdit"
              icon={<EditPencilIcon />}
              type="ghost"
              onClick={() => setIsVisible(true)}
            >
              Edit
            </Button>
          )}
        </div>
      )}
      <Tabs>
        {round?.submissionsSettings?.tasks?.length && (
          <Tabs.TabPane tab="Tasks" key="2">
            <Tasks />
          </Tabs.TabPane>
        )}
        {round?.submissionsSettings?.caseStudy?.length &&
          round?.submissionsSettings?.visibilty?.caseStudy &&
          (from === "ORGANISER" ? (
            <Tabs.TabPane tab="Case Study" key="1">
              <CaseStudy />
            </Tabs.TabPane>
          ) : (
            round?.submissionsSettings?.visibilty?.caseStudy && (
              <Tabs.TabPane tab="Case Study" key="1">
                <CaseStudy />
              </Tabs.TabPane>
            )
          ))}

        {(round?.submissionsSettings?.guidelines?.length ||
          round?.submissionsSettings?.guidelinesExtended
            ?.preConfiguredGuidelines) &&
          round?.submissionsSettings?.visibilty?.guidelines &&
          (from === "ORGANISER" ? (
            <Tabs.TabPane tab="Guidelines" key="3">
              <Guidelines />
            </Tabs.TabPane>
          ) : (
            round?.submissionsSettings?.visibilty?.guidelines && (
              <Tabs.TabPane tab="Guidelines" key="3">
                <Guidelines />
              </Tabs.TabPane>
            )
          ))}
        {round?.submissionsSettings?.resources?.length &&
          round?.submissionsSettings?.visibilty?.resources &&
          (from === "ORGANISER" ? (
            <Tabs.TabPane tab="Resources" key="4">
              <Resources />
            </Tabs.TabPane>
          ) : (
            round?.submissionsSettings?.visibilty?.resources && (
              <Tabs.TabPane tab="Resources" key="4">
                <Resources />
              </Tabs.TabPane>
            )
          ))}
      </Tabs>
    </div>
  );
};

export default TaskTabs;
