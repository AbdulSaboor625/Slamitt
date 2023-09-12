import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Modal,
  Tag,
  TimePicker,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import ContentEditable from "react-contenteditable";

import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getSingleRound } from "../../../../../Redux/Actions";
import { addOrUpdateSubmissionSettings } from "../../../../../requests/round";
import {
  addHttpsToUrl,
  getUniqueId,
  isValidURL,
} from "../../../../../utility/common";
import {
  CrossThickIcon,
  DeleteIcon,
  EyeNewCrossIcon,
  EyeNewOpenIcon,
  FileNewIcon,
  InfoNewIcon,
  LinkIcon,
  ReloadIcon,
  TickThickIcon,
  UploadFileIcon,
} from "../../../../../utility/iconsLibrary";
import AppCustomPicker from "../../../../AppCustomPicker";
import AppModal from "../../../../AppModal";
import AppUploadBox from "../../../../AppUploadBox";
const ReactQuill = dynamic(import("react-quill"), { ssr: false });
const docFormats = ["doc", "ppt", "pdf", "excel"];
const mediaFormats = ["jpg", "png", "mov", "mp4", "tiff", "psd", "epf", "ai"];
const COMPONENT_TYPE = Object.freeze({
  CASE_STUDY: "caseStudy",
  TASKS: "tasks",
  GUIDELINES: "guidelines",
  RESOURCES: "resources",
});
const TasksOptions = ({
  roundData,
  options,
  setOptions,
  taskBody,
  taskData,
  setTaskBody,
  isReset,
}) => {
  useEffect(() => {
    if (isReset) {
      const optionsToEnable = {
        caseStudy: {
          show: roundData?.visibilty?.caseStudy || false,
          isPresent: false,
        },
        guidelines: {
          show: roundData?.visibilty?.guidelines || false,
          isPresent: false,
        },
        resources: {
          show: roundData?.visibilty?.resources || false,
          isPresent: false,
        },
      };

      if (roundData?.caseStudy?.length) {
        optionsToEnable.caseStudy.isPresent = true;
      }
      if (roundData?.resources?.length) {
        optionsToEnable.resources.isPresent = true;
      }
      if (
        roundData?.guidelines?.length ||
        roundData?.guidelinesExtended?.maxAllowedSubmissions ||
        roundData?.guidelinesExtended?.preConfiguredGuidelines
      ) {
        optionsToEnable.guidelines.isPresent = true;
      }
      setOptions({ ...optionsToEnable });
    }
  }, [isReset]);
  return (
    <div className="createTasksOptions">
      {!options?.caseStudy?.isPresent && (
        <Tag
          onClick={() => {
            // taskData.visibilityStatus[COMPONENT_TYPE.CASE_STUDY] =
            //   !options[COMPONENT_TYPE.CASE_STUDY].show;
            setTaskBody((prev) => ({
              ...prev,
              visibilityStatus: {
                ...prev.visibilityStatus,
                caseStudy: true,
              },
            }));

            setOptions({
              ...options,
              caseStudy: { isPresent: true, show: true },
            });
          }}
          className="cursor-pointer"
        >
          + Case Study
        </Tag>
      )}
      {/* {!options.tasks.isPresent && (
        <Tag
          onClick={() =>
            setOptions({ ...options, tasks: { isPresent: true, show: true } })
          }
          className="cursor-pointer"
        >
          + Task
        </Tag>
      )} */}
      {!options?.guidelines?.isPresent && (
        <Tag
          onClick={() => {
            // taskData.visibilityStatus[COMPONENT_TYPE.GUIDELINES] =
            //   !options[COMPONENT_TYPE.GUIDELINES].show;

            setTaskBody((prev) => ({
              ...prev,
              visibilityStatus: {
                ...prev.visibilityStatus,
                guidelines: true,
              },
            }));
            setOptions({
              ...options,
              guidelines: { isPresent: true, show: true },
            });
          }}
          className="cursor-pointer"
        >
          + Submission Guidelines
        </Tag>
      )}
      {!options?.resources?.isPresent && (
        <Tag
          onClick={() => {
            // taskData.visibilityStatus[COMPONENT_TYPE.RESOURCES] =
            //   !options[COMPONENT_TYPE.RESOURCES].show;
            setTaskBody((prev) => ({
              ...prev,
              visibilityStatus: {
                ...prev.visibilityStatus,
                resources: true,
              },
            }));
            setOptions({
              ...options,
              resources: { isPresent: true, show: true },
            });
          }}
          className="cursor-pointer"
        >
          + Resources
        </Tag>
      )}
    </div>
  );
};

const ModalHeader = ({ settings, taskBody }) => {
  const [headerState, setHeaderState] = useState({
    imageUrl: null,
    emojiObject: null,
    title: "",
  });

  useState(() => {
    if (settings)
      setHeaderState({
        title: settings.title,
        emojiObject: settings.emojiObject,
        imageUrl: settings.imageUrl,
      });
  }, [settings]);

  const handleChangeImage = (e) => {
    if (e.type === "EMOJI") {
      setHeaderState({ ...headerState, emojiObject: e.emoji, imageUrl: null });
      taskBody.current.emojiObject = e.emoji;
      taskBody.current.imageUrl = null;
    } else {
      setHeaderState({ ...headerState, emojiObject: e.url, imageUrl: null });
      taskBody.current.emojiObject = null;
      taskBody.current.imageUrl = e.url;
    }
  };

  const handleChangeTitle = (e) => {
    const title = e.target.value;
    setHeaderState({ ...headerState, title });
    taskBody.current.title = title;
  };

  return (
    <div>
      <AppCustomPicker
        onImageSelected={handleChangeImage}
        defaultValue={{
          type: headerState.emojiObject ? "EMOJI" : "LINK",
          url: headerState?.imageUrl,
          emoji: headerState?.emojiObject,
        }}
      />
      <Input
        placeholder="Task Title"
        onChange={handleChangeTitle}
        defaultValue={headerState?.title}
      />
    </div>
  );
};

const ModalFooter = ({ taskBody, onSubmit, onReset }) => {
  return (
    <div className="createTasksModalButtons">
      <Button
        // disabled={!taskBody?.tasks?.length}
        type="primary"
        // type="secondary"
        icon={<ReloadIcon />}
        onClick={onReset}
      >
        Reset Changes
      </Button>
      <Button
        // disabled={!taskBody?.tasks?.length}
        type="primary"
        icon={<TickThickIcon />}
        onClick={onSubmit}
      >
        Save
      </Button>
    </div>
  );
};

const CaseStudy = ({
  taskData,
  setTaskBody,
  caseStudy,
  handleChangeVisibilty,
  handleDelete,
  options,
  isReset,
  setReset,
}) => {
  useEffect(() => {
    if (caseStudy) {
      setTaskBody({
        ...taskData,
        caseStudy,
      });
    }
  }, [caseStudy]);

  useEffect(() => {
    if (isReset) {
      if (caseStudy) {
        setTaskBody({
          ...taskData,
          caseStudy,
        });
        setReset(false);
      } else {
        setTaskBody({
          ...taskData,
          caseStudy: "",
        });
      }
    }
  }, [isReset]);

  const handleValueChange = (e) => {
    setTaskBody({
      ...taskData,
      caseStudy: e,
    });
    // taskBody.current.caseStudy = e;
  };

  return (
    <div className="taskTabsContent">
      <div className="taskTabsContentHeader">
        <Tag className="taskTabsContentTag">Case Study</Tag>
        <div className="taskTabsContentHeaderButtons">
          <button
            className={`btnCircle ${options.caseStudy.show ? "" : "hidden"}`}
            onClick={() => handleChangeVisibilty(COMPONENT_TYPE.CASE_STUDY)}
          >
            {!options.caseStudy.show ? (
              <Tooltip
                title={`Show this Section`}
                trigger={"hover"}
                placement="top"
                color={"black"}
              >
                <EyeNewOpenIcon />
              </Tooltip>
            ) : (
              <Tooltip
                title={`Hide this Section`}
                trigger={"hover"}
                placement="top"
                color={"black"}
              >
                <EyeNewCrossIcon />
              </Tooltip>
            )}
          </button>
          <button
            className="btnCircle"
            onClick={() => handleDelete(COMPONENT_TYPE.CASE_STUDY)}
          >
            <CrossThickIcon />
          </button>
        </div>
      </div>
      <div className={`${!options.caseStudy.show && "hide-component"}`}>
        <ReactQuill
          theme="snow"
          value={taskData?.caseStudy}
          placeholder="Start Typing here"
          onChange={handleValueChange}
          modules={{
            toolbar: [
              ["bold", "italic", "underline", "strike"], // toggled buttons
              // ["blockquote", "code-block"],

              [{ header: 1 }, { header: 2 }], // custom button values
              [{ list: "ordered" }, { list: "bullet" }],
              // [{ script: "sub" }, { script: "super" }], // superscript/subscript
              // [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
              // [{ direction: "rtl" }], // text direction

              // [{ size: ["small", false, "large", "huge"] }], // custom dropdown
              [{ header: [1, 2, 3, 4, 5, 6, false] }],

              // [{ color: [] }, { background: [] }], // dropdown with defaults from theme
              // [{ font: [] }],
              [{ align: [] }],

              ["clean"][("bold", "italic")], // remove formatting button
              ["link", "image"],
            ],
          }}
        />
      </div>
    </div>
  );
};

const Tasks = ({ defaultTasks, isReset, setTaskBody, taskData, setReset }) => {
  const taskRef = useRef(null);
  const [notesList, setNotesList] = useState("<li></li>");

  useEffect(() => {
    if (defaultTasks?.length) {
      setTaskBody((prev) => ({
        ...prev,
        tasks: defaultTasks,
      }));
      setNotesList(
        defaultTasks
          .map((item) => {
            return `<li>${item.taskText}&nbsp;</li>`;
          })
          .join("")
      );
    }
  }, [defaultTasks]);

  useEffect(() => {
    if (isReset) {
      if (defaultTasks?.length) {
        setTaskBody((prev) => ({
          ...prev,
          tasks: defaultTasks,
        }));
        setNotesList(
          defaultTasks
            .map((item) => {
              return `<li>${item.taskText}&nbsp;</li>`;
            })
            .join("")
        );
      } else {
        setTaskBody((prev) => ({
          ...prev,
          tasks: [],
        }));
        setNotesList("<li></li>");
      }
      setReset(false);
    }
  }, [isReset]);

  const handleChange = (e) => {
    let data = e.target.value;

    if (!data.startsWith("<li>")) {
      data = `<li>${data}</li>`;
    }
    if (data === "<li><br></li>") {
      data = data.replace(/<li><br\s*\/?><\/li>/gi, "<li>&nbsp;</li>");
    }

    data = data.replace(/&nbsp;&nbsp;|&nbsp;\s+&nbsp;/gi, "");
    data = data.replace(/<li><\/li>/g, "");
    setNotesList(data);
    const tasksData = data
      .split(/<\/?li>|<br>|&nbsp;/)
      .filter(Boolean)
      .map((taskText) => ({ taskText }));

    setTaskBody({
      ...taskData,
      tasks: tasksData,
    });
  };

  return (
    <div className="taskTabsContent">
      <div className="taskTabsContentHeader">
        <Tag className="taskTabsContentTag">Tasks</Tag>
        <div className="taskTabsContentHeaderButtons">
          {/* <button
            className="btnCircle"
            onClick={() => handleChangeVisibilty(COMPONENT_TYPE.TASKS)}
          >
            {options.tasks.show ? <EyeNewCrossIcon /> : <EyeNewOpenIcon />}
          </button>
          <button
            className="btnCircle"
            onClick={() => handleDelete(COMPONENT_TYPE.TASKS)}
          >
            <CrossThickIcon />
          </button> */}
        </div>
      </div>
      <div className="tasksListBlock">
        <ul className="list-disc tasksList">
          <ContentEditable
            innerRef={taskRef}
            html={notesList}
            disabled={false}
            onChange={handleChange}
            tagName="div"
          />
        </ul>
      </div>
    </div>
  );
};

const Guidelines = ({
  setTaskBody,
  taskData,
  defaultGuidelines,
  guidelinesExtended,
  taskBody,
  handleChangeVisibilty,
  handleDelete,
  options,
  competition,
  isReset,
  setReset,
}) => {
  const guidelinesRef = useRef(null);
  const [notesList, setNotesList] = useState("<li><br></li>");

  useEffect(() => {
    if (defaultGuidelines?.length) {
      setTaskBody((prev) => ({
        ...prev,
        guidelinesExtended: {
          ...prev.guidelinesExtended,
          guidelines: defaultGuidelines,
        },
      }));
      // taskBody.current.guidelinesExtended.guidelines = defaultGuidelines;
      setNotesList(
        defaultGuidelines
          .map((g) => {
            return `<li>${g.guidelineText}</li>`;
          })
          .join("")
      );
    }
    if (guidelinesExtended?.maxAllowedSubmissions) {
      setTaskBody((prev) => ({
        ...prev,
        guidelinesExtended: {
          ...prev.guidelinesExtended,
          maxAllowedSubmissions: guidelinesExtended?.maxAllowedSubmissions,
        },
      }));
      // taskBody.current.guidelinesExtended.maxAllowedSubmissions =
      //   guidelinesExtended?.maxAllowedSubmissions;
      // setCount(guidelinesExtended.maxAllowedSubmissions);
    }

    if (guidelinesExtended?.deadline) {
      setTaskBody((prev) => ({
        ...prev,
        guidelinesExtended: {
          ...prev.guidelinesExtended,
          deadline: {
            date: moment(guidelinesExtended.deadline).format(
              "YYYY-MM-DDTHH:mm:ss.SSSZ"
            ),
            time: moment(guidelinesExtended.deadline).format(
              "YYYY-MM-DDTHH:mm:ss.SSSZ"
            ),
          },
        },
      }));
      // taskBody.current.guidelinesExtended.deadline.date = moment(
      //   guidelinesExtended.deadline
      // );
      // taskBody.current.guidelinesExtended.deadline.time = moment(
      //   guidelinesExtended.deadline
      // );

      // setDeadline({
      //   date: moment(guidelinesExtended.deadline),
      //   time: moment(guidelinesExtended.deadline),
      // });
    }

    if (
      guidelinesExtended?.acceptableFormat &&
      taskData?.guidelinesExtended?.acceptableFormat
    ) {
      if (guidelinesExtended?.preConfiguredGuidelines) {
        setTaskBody((prev) => ({
          ...prev,
          guidelinesExtended: {
            ...prev.guidelinesExtended,
            acceptableFormat: guidelinesExtended?.acceptableFormat,
          },
        }));
        // taskBody.current.guidelinesExtended.acceptableFormat =
        //   guidelinesExtended?.acceptableFormat;
        // setAcceptableFormats(guidelinesExtended.acceptableFormat);
      } else {
        setTaskBody((prev) => ({
          ...prev,
          guidelinesExtended: {
            ...prev.guidelinesExtended,
            acceptableFormat: {
              all: true,
              doc: false,
              pdf: false,
              ppt: false,
              excel: false,
              jpg: false,
              png: false,
              mp4: false,
              mov: false,
              tiff: false,
              psd: false,
              epf: false,
              ai: false,
            },
          },
        }));
        // taskBody.current.guidelinesExtended.acceptableFormat = {
        //   ...guidelinesExtended?.acceptableFormat,
        //   all: true,
        // };
        // setAcceptableFormats({
        //   ...guidelinesExtended.acceptableFormat,
        //   all: true,
        // });
      }
    }
    setTaskBody((prev) => ({
      ...prev,
      guidelinesExtended: {
        ...prev.guidelinesExtended,
        lockParticipantWhenDeadlineCrossed:
          guidelinesExtended?.lockParticipantWhenDeadlineCrossed,
      },
    }));

    // if (guidelinesExtended?.lockParticipantWhenDeadlineCrossed)
    // setCloseOnDeadlineApproachCheck(true);
  }, [defaultGuidelines, guidelinesExtended]);

  useEffect(() => {
    if (isReset) {
      if (defaultGuidelines?.length) {
        setTaskBody((prev) => ({
          ...prev,
          guidelinesExtended: {
            ...prev.guidelinesExtended,
            guidelines: defaultGuidelines,
          },
        }));
        taskBody.current.guidelinesExtended.guidelines = defaultGuidelines;
        setNotesList(
          defaultGuidelines
            .map((g) => {
              return `<li>${g.guidelineText}</li>`;
            })
            .join("")
        );
      } else {
        setTaskBody((prev) => ({
          ...prev,
          guidelinesExtended: {
            ...prev.guidelinesExtended,
            guidelines: [],
          },
        }));
        taskBody.current.guidelinesExtended.guidelines = defaultGuidelines;
        setNotesList(
          []
            .map((g) => {
              return `<li>${g.guidelineText}</li>`;
            })
            .join("")
        );
      }
      if (guidelinesExtended?.maxAllowedSubmissions) {
        setTaskBody((prev) => ({
          ...prev,
          guidelinesExtended: {
            ...prev.guidelinesExtended,
            maxAllowedSubmissions: guidelinesExtended?.maxAllowedSubmissions,
          },
        }));
      } else {
        setTaskBody((prev) => ({
          ...prev,
          guidelinesExtended: {
            ...prev.guidelinesExtended,
            maxAllowedSubmissions: 1,
          },
        }));
      }

      if (guidelinesExtended?.deadline) {
        setTaskBody((prev) => ({
          ...prev,
          guidelinesExtended: {
            ...prev.guidelinesExtended,
            deadline: {
              date: moment(guidelinesExtended.deadline).format(
                "YYYY-MM-DDTHH:mm:ss.SSSZ"
              ),
              time: moment(guidelinesExtended.deadline).format(
                "YYYY-MM-DDTHH:mm:ss.SSSZ"
              ),
            },
          },
        }));
      } else {
        setTaskBody((prev) => ({
          ...prev,
          guidelinesExtended: {
            ...prev.guidelinesExtended,
            deadline: {
              date: null,
              time: null,
            },
          },
        }));
      }

      if (
        guidelinesExtended?.acceptableFormat &&
        taskBody.current?.guidelinesExtended?.acceptableFormat
      ) {
        if (guidelinesExtended?.preConfiguredGuidelines) {
          setTaskBody((prev) => ({
            ...prev,
            guidelinesExtended: {
              ...prev.guidelinesExtended,
              acceptableFormat: guidelinesExtended?.acceptableFormat,
            },
          }));
        } else {
          setTaskBody((prev) => ({
            ...prev,
            guidelinesExtended: {
              ...prev.guidelinesExtended,
              acceptableFormat: {
                all: true,
                doc: false,
                pdf: false,
                ppt: false,
                excel: false,
                jpg: false,
                png: false,
                mp4: false,
                mov: false,
                tiff: false,
                psd: false,
                epf: false,
                ai: false,
              },
            },
          }));
        }
      } else {
        setTaskBody((prev) => ({
          ...prev,
          guidelinesExtended: {
            ...prev.guidelinesExtended,
            acceptableFormat: {
              all: true,
              doc: false,
              pdf: false,
              ppt: false,
              excel: false,
              jpg: false,
              png: false,
              mp4: false,
              mov: false,
              tiff: false,
              psd: false,
              epf: false,
              ai: false,
            },
          },
        }));
      }
      setTaskBody((prev) => ({
        ...prev,
        guidelinesExtended: {
          ...prev.guidelinesExtended,
          lockParticipantWhenDeadlineCrossed:
            guidelinesExtended?.lockParticipantWhenDeadlineCrossed,
        },
      }));
      setReset(false);
    }
  }, [isReset]);

  const handleChange = (e) => {
    let data = e.target.value;

    if (!data.startsWith("<li>")) {
      data = `<li>${data}</li>`;
    }

    if (data === "") {
      data = "<li><br></li>";
    }
    if (data === "<li><br></li>") {
      data = data.replace(/<li><br\s*\/?><\/li>/gi, "<li>&nbsp;</li>");
    }

    data = data.replace(/&nbsp;&nbsp;|&nbsp;\s+&nbsp;/gi, "");
    data = data.replace(/<li><\/li>/g, "");

    setNotesList(data);

    const guidelines = data
      .split(/<\/?li>|<br>|&nbsp;/)
      .filter(Boolean)
      .map((guidelineText) => ({ guidelineText }));

    setTaskBody((prev) => ({
      ...prev,
      guidelinesExtended: {
        ...prev.guidelinesExtended,
        guidelines,
      },
    }));
    // taskBody.current.guidelinesExtended.guidelines = guidelines;
  };

  const areAllPropertiesFalse = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] !== false) {
        return false;
      }
    }
    return true;
  };

  const handleCheckedAccetableFormat = (checked, format) => {
    if (format === "all" && checked) {
      setTaskBody((prev) => ({
        ...prev,
        guidelinesExtended: {
          ...prev.guidelinesExtended,
          acceptableFormat: {
            all: true,
            doc: false,
            pdf: false,
            ppt: false,
            excel: false,
            jpg: false,
            png: false,
            mp4: false,
            mov: false,
            tiff: false,
            psd: false,
            epf: false,
            ai: false,
          },
        },
      }));
      // taskBody.current.guidelinesExtended.acceptableFormat = {
      //   all: true,
      //   doc: false,
      //   pdf: false,
      //   ppt: false,
      //   excel: false,
      //   jpg: false,
      //   png: false,
      //   mp4: false,
      //   mov: false,
      //   tiff: false,
      //   psd: false,
      //   epf: false,
      //   ai: false,
      // };
      // setAcceptableFormats({
      //   all: true,
      //   doc: false,
      //   pdf: false,
      //   ppt: false,
      //   excel: false,
      //   jpg: false,
      //   png: false,
      //   mp4: false,
      //   mov: false,
      //   tiff: false,
      //   psd: false,
      //   epf: false,
      //   ai: false,
      // });
      return;
    }
    if (checked) {
      setTaskBody((prev) => ({
        ...prev,
        guidelinesExtended: {
          ...prev.guidelinesExtended,
          acceptableFormat: {
            ...prev.guidelinesExtended.acceptableFormat,
            all: false,
            [format]: true,
          },
        },
      }));
      // taskBody.current.guidelinesExtended.acceptableFormat[format] = true;
      // taskBody.current.guidelinesExtended.acceptableFormat.all = false;
      // setAcceptableFormats({
      //   ...acceptableFormat,
      //   all: false,
      //   [format]: true,
      // });
    } else {
      if (format != "all") {
        setTaskBody((prev) => ({
          ...prev,
          guidelinesExtended: {
            ...prev.guidelinesExtended,
            acceptableFormat: {
              ...prev.acceptableFormat,
              [format]: false,
            },
          },
        }));
        setTaskBody((prev) => ({
          ...prev,
          guidelinesExtended: {
            ...prev.guidelinesExtended,
            acceptableFormat: {
              ...prev.acceptableFormat,
              all: areAllPropertiesFalse(
                taskBody.current.guidelinesExtended.acceptableFormat
              )
                ? true
                : false,
            },
          },
        }));
        // taskBody.current.guidelinesExtended.acceptableFormat[format] = false;
        // setAcceptableFormats({
        //   ...acceptableFormat,
        //   [format]: false,
        //   all: areAllPropertiesFalse(
        //     taskBody.current.guidelinesExtended.acceptableFormat
        //   )
        //     ? true
        //     : false,
        // });
      }
    }
  };

  const onChangeDate = (e) => {
    setTaskBody((prev) => ({
      ...prev,
      guidelinesExtended: {
        ...prev.guidelinesExtended,
        deadline: {
          ...prev.guidelinesExtended.deadline,
          date: e,
        },
      },
    }));
    // taskBody.current.guidelinesExtended.deadline.date = e;
    // setDeadline({
    //   ...deadline,
    //   date: e,
    // });
  };
  const onChangeTime = (e) => {
    setTaskBody((prev) => ({
      ...prev,
      guidelinesExtended: {
        ...prev.guidelinesExtended,
        deadline: {
          ...prev.guidelinesExtended.deadline,
          time: e,
        },
      },
    }));
    // taskBody.current.guidelinesExtended.deadline.time = e;
    // setDeadline({
    //   ...deadline,
    //   time: e,
    // });
  };

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

  const handleSubmissionCounter = (e) => {
    setTaskBody((prev) => ({
      ...prev,
      guidelinesExtended: {
        ...prev.guidelinesExtended,
        maxAllowedSubmissions: e,
      },
    }));
    // taskBody.current.guidelinesExtended.maxAllowedSubmissions = e;
  };

  const handleLockOnDeadline = (checked) => {
    setTaskBody((prev) => ({
      ...prev,
      guidelinesExtended: {
        ...prev.guidelinesExtended,
        lockParticipantWhenDeadlineCrossed: checked,
      },
    }));
    // taskBody.current.guidelinesExtended.lockParticipantWhenDeadlineCrossed =
    //   checked;
    // setCloseOnDeadlineApproachCheck(checked);
  };

  return (
    <div className="taskTabsContent">
      <div className="taskTabsContentHeader">
        <Tag className="taskTabsContentTag">Submission Guidelines</Tag>
        <div className="taskTabsContentHeaderButtons">
          <button
            className={`btnCircle ${options?.guidelines?.show ? "" : "hidden"}`}
            onClick={() => handleChangeVisibilty(COMPONENT_TYPE.GUIDELINES)}
          >
            {!options?.guidelines?.show ? (
              <Tooltip
                title={`Show this Section`}
                trigger={"hover"}
                placement="top"
                color={"black"}
              >
                <EyeNewOpenIcon />
              </Tooltip>
            ) : (
              <Tooltip
                title={`Hide this Section`}
                trigger={"hover"}
                placement="top"
                color={"black"}
              >
                <EyeNewCrossIcon />
              </Tooltip>
            )}
          </button>
          <button
            className="btnCircle"
            onClick={() => handleDelete(COMPONENT_TYPE.GUIDELINES)}
          >
            <CrossThickIcon />
          </button>
        </div>
      </div>
      <div
        className={`taskTabsSubmissionGuidelines ${
          !options?.guidelines?.show && "hide-component"
        }`}
      >
        <div className="roundSubmissionsModalListWrap">
          <ul className="roundSubmissionsModalList">
            <li>
              Allow{" "}
              {competition?.competitionType === "SOLO"
                ? "participants"
                : "teams"}{" "}
              to attach
              <div className="submissionsCounter">
                <Input
                  min={1}
                  addonAfter={
                    <Button
                      icon={<PlusOutlined />}
                      type="text"
                      onClick={() =>
                        handleSubmissionCounter(
                          taskData?.guidelinesExtended?.maxAllowedSubmissions +
                            1
                        )
                      }
                    />
                  }
                  readOnly={true}
                  value={taskData?.guidelinesExtended?.maxAllowedSubmissions}
                  addonBefore={
                    <Button
                      // disabled={count < 2}
                      icon={<MinusOutlined />}
                      type="text"
                      onClick={() =>
                        taskData?.guidelinesExtended?.maxAllowedSubmissions >
                          1 &&
                        handleSubmissionCounter(
                          taskData?.guidelinesExtended?.maxAllowedSubmissions -
                            1
                        )
                      }
                    />
                  }
                />
              </div>
              submissions
            </li>
            <li>
              Set submission deadline on{" "}
              <DatePicker
                // value={taskData?.guidelinesExtended?.deadline?.date}
                value={
                  taskData?.guidelinesExtended?.deadline?.date
                    ? moment(taskData?.guidelinesExtended?.deadline?.date)
                    : null
                }
                // value={deadline.date}
                onChange={onChangeDate}
                placeholder="DD/MM/YY"
                format={"DD/MM/YYYY"}
                disabledDate={(current) =>
                  current && current < moment().subtract(1, "day").endOf("day")
                }
              />
              at{" "}
              <TimePicker
                className="timePicker"
                // value={taskData?.guidelinesExtended?.deadline?.time}
                value={
                  taskData?.guidelinesExtended?.deadline?.time
                    ? moment(taskData?.guidelinesExtended?.deadline?.time)
                    : null
                }
                // value={deadline.time}
                // placeholder="HH:MM"
                format={"hh:mm A"}
                placeholder="HH:MM"
                onChange={onChangeTime}
              />
            </li>

            <li>
              <Checkbox
                checked={
                  taskData?.guidelinesExtended
                    ?.lockParticipantWhenDeadlineCrossed
                }
                disabled={!taskData?.guidelinesExtended?.deadline?.date}
                onChange={(e) => handleLockOnDeadline(e.target.checked)}
              />{" "}
              <Typography.Text>
                Lock submissions for participants when deadline commences
              </Typography.Text>
            </li>
            <li className="infoOption">
              <Tooltip
                color="black"
                placement="left"
                title="Participant submissions will only be accepted in the selected formats"
              >
                <InfoNewIcon />
              </Tooltip>
              Request for submissions in the following format:
            </li>
            {/*  FILE UPLOAD ACCESSOR */}
            <li className="checkBoxOptionsList">
              {/* ALL ACCESS */}
              <div className="checkBoxOptionsRow">
                <Typography.Text className="checkBoxOptionsRowTitle">
                  Open Ended
                </Typography.Text>
                <div className="checkBoxOptionHolder">
                  <div className="checkBoxOption">
                    <Checkbox
                      // checked={acceptableFormat.all}
                      checked={
                        taskData?.guidelinesExtended?.acceptableFormat?.all
                      }
                      onChange={(e) => {
                        const checked = e.target.checked;
                        handleCheckedAccetableFormat(checked, "all");
                      }}
                    />{" "}
                    <Typography.Text>
                      All formats are acceptable
                    </Typography.Text>
                  </div>
                </div>
              </div>
              {/* DOC ACCESS */}
              <div className="checkBoxOptionsRow">
                <Typography.Text className="checkBoxOptionsRowTitle">
                  Documents
                </Typography.Text>
                <div className="checkBoxOptionHolder">
                  {docFormats.map((format, index) => (
                    <div className="checkBoxOption" key={index}>
                      <Checkbox
                        checked={
                          taskData?.guidelinesExtended?.acceptableFormat[format]
                        }
                        onChange={(e) => {
                          const checked = e.target.checked;
                          handleCheckedAccetableFormat(checked, format);
                        }}
                      />{" "}
                      <Typography.Text>
                        {getDisplayName(format)}
                      </Typography.Text>
                    </div>
                  ))}
                </div>
              </div>
              {/* MEDIA ACCES */}
              <div className="checkBoxOptionsRow">
                <Typography.Text className="checkBoxOptionsRowTitle">
                  Media
                </Typography.Text>
                <div className="checkBoxOptionHolder">
                  {mediaFormats.map((format, idx) => (
                    <div className="checkBoxOption" key={idx}>
                      <Checkbox
                        checked={
                          taskData?.guidelinesExtended?.acceptableFormat[format]
                        }
                        onChange={(e) => {
                          const checked = e.target.checked;
                          handleCheckedAccetableFormat(checked, format);
                        }}
                      />{" "}
                      <Typography.Text>
                        {getDisplayName(format)}
                      </Typography.Text>
                    </div>
                  ))}
                </div>
              </div>
            </li>
            <li className="customGuidelinesOption">
              <Typography.Text className="customGuidelinesOptionTitle">
                Custom Guidelines
              </Typography.Text>
            </li>
            <ContentEditable
              innerRef={guidelinesRef}
              html={notesList}
              disabled={false}
              onChange={handleChange}
              tagName="ul"
              className="listGuidelines"
            />
          </ul>
        </div>
      </div>
    </div>
  );
};

const Resources = ({
  taskData,
  setTaskBody,
  taskBody,
  options,
  handleChangeVisibilty,
  handleDelete,
  defaultResources,
  isReset,
  setReset,
}) => {
  const [resources, setResources] = useState([]);
  const [isResourceUploadInputOpen, setOpenUploadResource] = useState(false);
  const [link, setLink] = useState("");

  useEffect(() => {
    if (defaultResources && defaultResources.length) {
      setTaskBody((prev) => ({
        ...prev,
        resources: defaultResources || [],
      }));
      // taskBody.current.resources = defaultResources;
      // setResources(defaultResources || []);
    }
  }, [defaultResources]);

  useEffect(() => {
    if (isReset) {
      setTaskBody((prev) => ({
        ...prev,
        resources: defaultResources || [],
      }));
      setReset(false);
    }
  }, [isReset]);

  const deleteResource = (id) => {
    setTaskBody((prev) => ({
      ...prev,
      resources: prev?.resources?.filter((item) => item.id !== id),
    }));
    // setResources(resources.filter((item) => item.id !== id));
    // taskBody.current.resources = resources.filter((item) => item.id !== id);
  };

  const onAddResource = (payload) => {
    setTaskBody((prev) => ({
      ...prev,
      resources: [...taskData?.resources, payload],
    }));
    setOpenUploadResource(false);
    // taskBody.current.resources = [...resources, payload];
    // setResources([...resources, payload]);
  };
  return (
    <div className="taskTabsContent">
      <div className="taskTabsContentHeader">
        <Tag className="taskTabsContentTag">Resources</Tag>
        <div className="taskTabsContentHeaderButtons">
          <button
            className={`btnCircle ${
              taskData?.visibilityStatus?.resources ? "" : "hidden"
            }`}
            onClick={() => handleChangeVisibilty(COMPONENT_TYPE.RESOURCES)}
          >
            {!taskData?.visibilityStatus?.resources ? (
              <Tooltip
                title={`Show this Section`}
                trigger={"hover"}
                placement="top"
                color={"black"}
              >
                <EyeNewOpenIcon />
              </Tooltip>
            ) : (
              <Tooltip
                title={`Hide this Section`}
                trigger={"hover"}
                placement="top"
                color={"black"}
              >
                <EyeNewCrossIcon />
              </Tooltip>
            )}
          </button>
          <button
            className="btnCircle"
            onClick={() => handleDelete(COMPONENT_TYPE.RESOURCES)}
          >
            <CrossThickIcon />
          </button>
        </div>
      </div>
      <div
        className={`taskResourcesblock ${
          !taskData?.visibilityStatus?.resources && "hide-component"
        }`}
      >
        <div className="roundSubmissionsModalResourceButtons">
          <Button
            onClick={() =>
              taskData?.resources?.length < 5 && setOpenUploadResource(true)
            }
            icon={<LinkIcon />}
            placeholder="Add a link"
            disabled={!taskData?.visibilityStatus?.resources}
          >
            Attach a Link
          </Button>
          {taskData?.resources?.length < 5 ? (
            <AppUploadBox
              multiple
              maxCount={5}
              fileSize={20}
              accept={"*"}
              setImageUploaded={(file) => {
                if (file && file.code && file.result) {
                  const newResources = {
                    fileName: file.fileName,
                    url: file.result.location,
                    type: "FILE",
                    id: getUniqueId(),
                  };
                  const rsc = taskData?.resources?.filter(
                    (item) => item.url !== ""
                  );
                  if (
                    !!rsc.filter((r) => r.fileName === newResources.fileName)
                      .length
                  ) {
                    toast.error("Resource already added!");
                  } else {
                    onAddResource(newResources);
                  }
                }
              }}
            >
              <Button
                icon={<UploadFileIcon />}
                onClick={() => setOpenUploadResource(false)}
                disabled={!taskData?.visibilityStatus?.resources}
              >
                Upload a file
              </Button>
            </AppUploadBox>
          ) : (
            <Button icon={<UploadFileIcon />}>Upload a file</Button>
          )}
        </div>
        <div className="taskResourcesHolder">
          {isResourceUploadInputOpen &&
            taskData?.resources?.length < 5 &&
            options.resources.show && (
              <>
                <div className="taskResourcesAttachedLink">
                  <span className="icon">
                    <LinkIcon />
                  </span>
                  <Input
                    onChange={(e) => setLink(e.target.value)}
                    value={link}
                    placeholder="Enter Link here..."
                    // onBlur={() => {
                    //   setOpenUploadResource(false);
                    //   setLink("");
                    // }}
                  />
                  <Button
                    type="text"
                    disabled={!link}
                    onClick={() => {
                      const url = addHttpsToUrl(link.trim());
                      if (link !== "" && isValidURL(url)) {
                        setLink("");
                        onAddResource({
                          id: getUniqueId(),
                          fileName: url,
                          type: "LINK",
                          url,
                        });
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                {/* {!isValidURL(link) && "Add correct link"}{" "} */}
              </>
            )}
          {taskData?.resources?.map((item) => (
            <div className="taskResourcesAttachment">
              <div className="icon">
                {item.type === "FILE" ? <FileNewIcon /> : <LinkIcon />}{" "}
              </div>
              <Typography.Text>{item.fileName}</Typography.Text>
              <Button
                className="buttonDelete"
                icon={<DeleteIcon />}
                onClick={() => deleteResource(item.id)}
                disabled={!options.resources.show}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CreateTaskModal = ({
  isVisible,
  setIsVisible,
  round,
  competition,
  setTask,
}) => {
  const dispatch = useDispatch();
  const [options, setOptions] = useState({
    caseStudy: { show: true, isPresent: false },
    tasks: { show: true, isPresent: false },
    guidelines: { show: true, isPresent: false },
    resources: { show: true, isPresent: false },
  });
  const [isReset, setReset] = useState(false);
  const [taskData, setTaskBody] = useState({
    tasks: [],
    guidelinesExtended: {
      guidelines: [],
      maxAllowedSubmissions: 1,
      deadline: {
        date: "",
        time: "",
      },
      lockParticipantWhenDeadlineCrossed: false,
      acceptableFormat: {
        all: true,
        doc: false,
        pdf: false,
        ppt: false,
        excel: false,
        jpg: false,
        png: false,
        mp4: false,
        mov: false,
        tiff: false,
        psd: false,
        epf: false,
        ai: false,
      },
    },
    resources: [],
    visibilityStatus: {
      resources: false,
      caseStudy: false,
      guidelines: false,
    },
  });
  const taskBody = useRef({
    // title: "",
    // imageUrl: "",
    // emojiObject: {},
    caseStudy: "",
    tasks: [],
    guidelinesExtended: {
      guidelines: [],
      maxAllowedSubmissions: 1,
      deadline: {
        date: "",
        time: "",
      },
      lockParticipantWhenDeadlineCrossed: false,
      acceptableFormat: {
        all: true,
        doc: false,
        pdf: false,
        ppt: false,
        excel: false,
        jpg: false,
        png: false,
        mp4: false,
        mov: false,
        tiff: false,
        psd: false,
        epf: false,
        ai: false,
      },
    },
    resources: [],
    visibilityStatus: {
      resources: false,
      caseStudy: false,
      guidelines: false,
    },
  });

  useEffect(() => {
    console.log("setDefault", round.submissionsSettings);
    if (round?.submissionsSettings) {
      const optionsToEnable = {
        caseStudy: {
          show: round?.submissionsSettings?.visibilty?.caseStudy || false,
          isPresent: false,
        },
        guidelines: {
          show: round?.submissionsSettings?.visibilty?.guidelines || false,
          isPresent: false,
        },
        resources: {
          show: round?.submissionsSettings?.visibilty?.resources || false,
          isPresent: false,
        },
      };

      if (round?.submissionsSettings?.caseStudy?.length) {
        optionsToEnable.caseStudy.isPresent = true;
      }
      if (round?.submissionsSettings?.resources?.length) {
        optionsToEnable.resources.isPresent = true;
      }
      if (
        round?.submissionsSettings?.guidelines?.length ||
        round?.submissionsSettings?.guidelinesExtended?.maxAllowedSubmissions ||
        round?.submissionsSettings?.guidelinesExtended?.preConfiguredGuidelines
      ) {
        optionsToEnable.guidelines.isPresent = true;
      }
      setOptions({ ...optionsToEnable });
    }
  }, [round?.submissionsSettings]);
  console.log("options", round?.submissionsSettings);

  const onReset = () => {
    setReset(true);
    // setTaskBody((prev) => ({
    //   ...prev,
    //   tasks: round?.submissionsSettings?.tasks,
    // }));
    // setOptions({
    //   caseStudy: { show: false, isPresent: false },
    //   guidelines: { show: false, isPresent: false },
    //   resources: { show: false, isPresent: false },
    // });
    // taskBody.current = {
    //   // title: "",
    //   // imageUrl: "",
    //   // emojiObject: {},
    //   caseStudy: "",
    //   tasks: [],
    //   guidelinesExtended: {
    //     guidelines: [],
    //     maxAllowedSubmissions: 1,
    //     deadline: {
    //       date: "",
    //       time: "",
    //     },
    //     lockParticipantWhenDeadlineCrossed: false,
    //     acceptableFormat: {
    //       all: true,
    //       doc: false,
    //       pdf: false,
    //       ppt: false,
    //       excel: false,
    //       jpg: false,
    //       png: false,
    //       mp4: false,
    //       mov: false,
    //       tiff: false,
    //       psd: false,
    //       epf: false,
    //       ai: false,
    //     },
    //   },
    //   resources: [],
    //   visibilityStatus: {
    //     resources: false,
    //     caseStudy: false,
    //     guidelines: false,
    //   },
    // };
  };

  const onSubmit = async () => {
    if (!taskData.tasks.length) {
      toast.error("Please add some tasks");
      return;
    }

    if (
      taskData?.guidelinesExtended?.maxAllowedSubmissions < 1 &&
      taskData?.visibilityStatus?.guidelines
    ) {
      toast.error("Please setup max submissions");
      return;
    }

    // if (
    //   (taskBody.current?.guidelinesExtended?.deadline?.date === "" ||
    //     taskBody.current?.guidelinesExtended?.deadline?.time === "") &&
    //   taskBody.current?.visibilityStatus?.guidelines
    // ) {
    //   toast.error("Please provide deadline!");
    //   return;
    // }
    const hour = moment(taskData?.guidelinesExtended?.deadline?.time).get(
      "hour"
    );
    const minute = moment(taskData?.guidelinesExtended?.deadline?.time).get(
      "minute"
    );
    const deadlineTime = moment(taskData?.guidelinesExtended?.deadline?.date)
      .set({
        hour,
        minute,
      })
      .subtract(1, "minute");

    if (
      taskData?.guidelinesExtended?.deadline?.date &&
      moment(deadlineTime).isSameOrBefore(moment())
    ) {
      toast.error("Please provide a future deadline!");
      return;
    }

    // if (
    //   !taskData?.visibilityStatus?.guidelines &&
    //   !options.guidelines.isPresent
    // )
    //   delete taskData.guidelinesExtended;
    // if (!taskData?.visibilityStatus?.resources && !options.resources.isPresent)
    //   delete taskBody.current.resources;

    const payload = {
      ...taskData,
      visibilityStatus: {
        caseStudy: taskData?.visibilityStatus?.caseStudy,
        guidelines: taskData?.visibilityStatus?.guidelines,
        resources: taskData?.visibilityStatus?.resources,
      },
    };

    const response = await addOrUpdateSubmissionSettings(
      round.competitionRoundCode,
      {
        submissionsSettings: payload,
      }
    );
    if (response) {
      dispatch(getSingleRound(response));
      setTask(true);
      setIsVisible(false);
    }
  };

  const handleChangeVisibilty = (type) => {
    setTaskBody((prev) => ({
      ...prev,
      visibilityStatus: {
        ...prev?.visibilityStatus,
        [type]: !prev?.visibilityStatus[type],
      },
    }));
    // taskBody.current.visibilityStatus[type] = !options[type].show;
    setOptions({
      ...options,
      [type]: {
        ...options[type],
        show: !options[type].show,
      },
    });
    // taskBody.current.visibilityStatus[type] = !options[type].show;
    // setOptions({
    //   ...options,
    //   [type]: {
    //     ...options[type],
    //     show: !options[type].show,
    //   },
    // });
  };
  const handleDelete = (type) => {
    setOptions({
      ...options,
      [type]: {
        isPresent: false,
        show: false,
      },
    });
    if (type === COMPONENT_TYPE.GUIDELINES) {
      setTaskBody((prev) => ({
        ...prev,
        guidelinesExtended: {
          guidelines: [],
          maxAllowedSubmissions: 1,
          deadline: {
            date: "",
            time: "",
          },
          lockParticipantWhenDeadlineCrossed: false,
          acceptableFormat: {
            all: true,
            doc: false,
            pdf: false,
            ppt: false,
            excel: false,
            jpg: false,
            png: false,
            mp4: false,
            mov: false,
            tiff: false,
            psd: false,
            epf: false,
            ai: false,
          },
        },
      }));
      setTaskBody((prev) => ({
        ...prev,
        visibilityStatus: {
          ...prev.visibilityStatus,
          guidelines: false,
        },
      }));
      // taskBody.current.guidelinesExtended = {
      //   preConfiguredGuidelines: false,
      //   guidelines: [],
      //   maxAllowedSubmissions: 1,
      //   deadline: {
      //     date: "",
      //     time: "",
      //   },
      //   lockParticipantWhenDeadlineCrossed: false,
      //   acceptableFormat: {
      //     all: true,
      //     doc: false,
      //     pdf: false,
      //     ppt: false,
      //     excel: false,
      //     jpg: false,
      //     png: false,
      //     mp4: false,
      //     mov: false,
      //     tiff: false,
      //     psd: false,
      //     epf: false,
      //     ai: false,
      //   },
      // };
      // taskBody.current.visibilityStatus.guidelines = false;
    } else if (type === COMPONENT_TYPE.CASE_STUDY) {
      setTaskBody((prev) => ({
        ...prev,
        caseStudy: "",
      }));
      setTaskBody((prev) => ({
        ...prev,
        visibilityStatus: {
          ...prev.visibilityStatus,
          caseStudy: false,
        },
      }));
      // taskBody.current.caseStudy = "";
      // taskBody.current.visibilityStatus.caseStudy = false;
    } else if (type === COMPONENT_TYPE.RESOURCES) {
      setTaskBody((prev) => ({
        ...prev,
        resources: [],
      }));
      setTaskBody((prev) => ({
        ...prev,
        visibilityStatus: {
          ...prev.visibilityStatus,
          resources: false,
        },
      }));
      // taskBody.current.visibilityStatus.resources = false;
      // taskBody.current[type] = [];
    } else {
      setTaskBody((prev) => ({
        ...prev,
        tasks: [],
      }));
      taskBody.current[type] = [];
    }
  };

  useEffect(() => {
    if (round?.submissionsSettings?.tasks?.length) {
      setTaskBody((prev) => ({
        ...prev,
        tasks: round?.submissionsSettings?.tasks,
      }));
    }
  }, [round?.submissionsSettings]);

  console.log("options", options);
  return (
    <AppModal
      className="createTasksModal"
      isVisible={isVisible}
      onCancel={() => {
        setIsVisible(false);
      }}
      closable={true}
      footer={
        <ModalFooter
          taskBody={taskData}
          onReset={onReset}
          onSubmit={onSubmit}
        />
      }
    >
      <div className="createTasksModalContent">
        {/* <ModalHeader
          taskBody={taskBody}
          settings={round?.submissionsSettings}
        /> */}
        <Typography.Text className="createTasksModalHeading">
          Set up task for {round?.roundName}
        </Typography.Text>
        {/* <TasksOptions
          options={options}
          setOptions={setOptions}
          taskBody={taskBody}
        /> */}

        <Tasks
          defaultTasks={round?.submissionsSettings?.tasks}
          taskData={taskData}
          setTaskBody={setTaskBody}
          isReset={isReset}
          setReset={setReset}
        />
        {options?.caseStudy?.isPresent && (
          <CaseStudy
            taskData={taskData}
            setTaskBody={setTaskBody}
            caseStudy={round?.submissionsSettings?.caseStudy}
            handleChangeVisibilty={handleChangeVisibilty}
            handleDelete={handleDelete}
            options={options}
            isReset={isReset}
            setReset={setReset}
          />
        )}

        {options?.guidelines?.isPresent && (
          <Guidelines
            taskData={taskData}
            setTaskBody={setTaskBody}
            defaultGuidelines={round?.submissionsSettings?.guidelines}
            guidelinesExtended={round?.submissionsSettings?.guidelinesExtended}
            handleChangeVisibilty={handleChangeVisibilty}
            handleDelete={handleDelete}
            options={options}
            taskBody={taskBody}
            competition={competition}
            isReset={isReset}
            setReset={setReset}
          />
        )}
        {options?.resources?.isPresent && (
          <Resources
            taskData={taskData}
            setTaskBody={setTaskBody}
            handleChangeVisibilty={handleChangeVisibilty}
            handleDelete={handleDelete}
            options={options}
            taskBody={taskBody}
            defaultResources={round?.submissionsSettings?.resources}
            isReset={isReset}
            setReset={setReset}
          />
        )}
        <TasksOptions
          roundData={round?.submissionsSettings}
          options={options}
          setOptions={setOptions}
          taskBody={taskBody}
          taskData={taskData}
          setTaskBody={setTaskBody}
          isReset={isReset}
        />
      </div>
    </AppModal>
  );
};

export default CreateTaskModal;
