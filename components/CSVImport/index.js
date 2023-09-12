import React, { useState } from "react";
import {
  formatFileSize,
  lightenDarkenColor,
  useCSVReader,
} from "react-papaparse";
import { useDispatch } from "react-redux";
import { notify } from "../../Redux/Actions";
import { isValidURL } from "../../utility/common";
import { UploadIcon } from "../../utility/iconsLibrary";

const GREY = "#CCC";
const GREY_LIGHT = "rgba(255, 255, 255, 0.4)";
const DEFAULT_REMOVE_HOVER_COLOR = "#A01919";
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
  DEFAULT_REMOVE_HOVER_COLOR,
  40
);
const GREY_DIM = "#686868";

const styles = {
  zone: {
    alignItems: "center",
    border: `2px dashed ${GREY}`,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    padding: 20,
  },
  file: {
    background: "linear-gradient(to bottom, #EEE, #DDD)",
    borderRadius: 20,
    display: "flex",
    height: 120,
    width: 120,
    position: "relative",
    zIndex: 10,
    flexDirection: "column",
    justifyContent: "center",
  },
  info: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    paddingLeft: 10,
    paddingRight: 10,
  },
  size: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    marginBottom: "0.5em",
    justifyContent: "center",
    display: "flex",
    paddingLeft: 5,
    paddingRight: 5,
  },
  name: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    fontSize: 12,
    marginBottom: "0.5em",
    maxWidth: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    paddingLeft: 5,
    paddingRight: 5,
  },
  progressBar: {
    bottom: 14,
    position: "absolute",
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
  },
  zoneHover: {
    borderColor: GREY_DIM,
  },
  default: {
    borderColor: GREY,
  },
  remove: {
    height: 23,
    position: "absolute",
    right: 6,
    top: 6,
    width: 23,
    cursor: "pointer",
  },
};

const ImportFromCSV = ({
  setSubmissions,
  setMockRoundScores = false,
  setCurMaxPoints = false,
  allContainers,
  setError,
}) => {
  const { CSVReader } = useCSVReader();
  const dispatch = useDispatch();
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  );
  let inValidLinks = [];
  let inValidLinksLocation = [];

  const checkLinks = (link, code, location) => {
    if (link !== "") {
      const valid = isValidURL(link);
      if (valid) {
        var tarea = link;
        if (tarea.indexOf("http://") == 0 || tarea.indexOf("https://") == 0) {
          // do something here
          return link;
        } else {
          return "https://" + link;
        }
      } else {
        inValidLinks.push(link);
        inValidLinksLocation.push(code);
        return "";
      }
    } else return "";
  };

  return (
    <CSVReader
      onUploadAccepted={(results) => {
        const { data } = results;
        const headers = data[0];

        if (!(setMockRoundScores && setCurMaxPoints)) {
          const TeamCode = headers.findIndex(
            (header) =>
              header.toLowerCase() === "Team Code".toLowerCase() ||
              header.toLowerCase() === "Part Code".toLowerCase()
          );
          const Link1 = headers.findIndex(
            (header) => header.toLowerCase() === "Link1".toLowerCase()
          );
          const Link2 = headers.findIndex(
            (header) => header.toLowerCase() === "Link2".toLowerCase()
          );
          const Link3 = headers.findIndex(
            (header) => header.toLowerCase() === "Link3".toLowerCase()
          );
          const Link4 = headers.findIndex(
            (header) => header.toLowerCase() === "Link4".toLowerCase()
          );
          const Link5 = headers.findIndex(
            (header) => header.toLowerCase() === "Link5".toLowerCase()
          );

          const submissions = [];
          for (let i = 1; i < data?.length; i++) {
            if (data[i][TeamCode]) {
              const exist = allContainers.find(
                (c) =>
                  c?.containerName.toLowerCase() ===
                  data[i][TeamCode]?.toLowerCase()
              );
              if (exist) {
                submissions.push({
                  containerCode: exist?.containerCode,
                  submissions: [
                    {
                      type: "LINK",
                      url: checkLinks(
                        data[i][Link1],
                        data[i][TeamCode],
                        "Link 1"
                      ),
                    },
                    {
                      type: "LINK",
                      url: checkLinks(
                        data[i][Link2],
                        data[i][TeamCode],
                        "Link 2"
                      ),
                    },
                    {
                      type: "LINK",
                      url: checkLinks(
                        data[i][Link3],
                        data[i][TeamCode],
                        "Link 3"
                      ),
                    },
                    {
                      type: "LINK",
                      url: checkLinks(
                        data[i][Link4],
                        data[i][TeamCode],
                        "Link 4"
                      ),
                    },
                    {
                      type: "LINK",
                      url: checkLinks(
                        data[i][Link5],
                        data[i][TeamCode],
                        "Link 5"
                      ),
                    },
                  ],
                });
              } else {
                dispatch(
                  notify({
                    type: "error",
                    message: `${data[i][TeamCode]} not exist`,
                  })
                );
                setError(true);
                ``;
                return;
              }
            }
          }

          submissions.forEach((container) => {
            const submissionsObj = {};
            container.submissions.forEach((submission) => {
              submissionsObj[submission.url] = submission;
            });

            container.submissions = Object.values(submissionsObj);
          });

          setSubmissions(submissions);
          if (inValidLinks.length !== 0) {
            dispatch(
              notify({
                type: "error",
                message: `${inValidLinks?.length} invalid ${
                  inValidLinks?.length > 1 ? "links" : "link"
                } found. Submissions from ${[
                  ...new Set(inValidLinksLocation),
                ]?.map((l) => l)} ${
                  inValidLinks?.length > 1 ? "were" : "was"
                } skipped`,
              })
            );
          }
        } else {
          try {
            const teamCodeHeaderIndex = headers.findIndex(
              (header) =>
                header.toLowerCase() === "Team Code".toLowerCase() ||
                header.toLowerCase() === "Part Code".toLowerCase()
            );
            const roundScoresHeaderIndex = headers.findIndex((header) =>
              header.toLowerCase().includes("scores out of ")
            );

            if (teamCodeHeaderIndex >= 0 && roundScoresHeaderIndex >= 0) {
              if (
                headers[roundScoresHeaderIndex]?.trim()?.split(" ")?.length > 3
              ) {
                const maxPoints = parseInt(
                  headers[roundScoresHeaderIndex].trim().split(" ")[3]
                );

                if (!maxPoints || maxPoints <= 0)
                  throw new Error("Invalid Max Points");

                const inValidContainers = [];

                const mockRoundScores = [];
                for (let i = 1; i < data?.length; i++) {
                  if (data[i][teamCodeHeaderIndex]) {
                    const exist = allContainers.find(
                      (c) =>
                        c?.containerName.toLowerCase() ===
                        data[i][teamCodeHeaderIndex]?.toLowerCase()
                    );
                    if (exist) {
                      if (
                        data[i][roundScoresHeaderIndex] &&
                        parseInt(data[i][roundScoresHeaderIndex]) <= maxPoints
                      ) {
                        mockRoundScores.push({
                          containerCode: exist?.containerCode,
                          points: parseInt(data[i][roundScoresHeaderIndex]),
                        });
                      } else {
                        inValidContainers.push(exist);
                        mockRoundScores.push({
                          containerCode: exist?.containerCode,
                          points: 0,
                        });
                      }
                    } else {
                      dispatch(
                        notify({
                          type: "error",
                          message: `${data[i][TeamCode]} not exist`,
                        })
                      );
                      setError(true);
                      return;
                    }
                  }
                }

                setCurMaxPoints(maxPoints);
                setMockRoundScores(mockRoundScores);
                if (inValidContainers.length) {
                  dispatch(
                    notify({
                      type: "error",
                      message: `${inValidContainers.length} teams were skipped due to wrong scores.`,
                    })
                  );
                }
              } else throw new Error("Invalid CSV Format");
            }
          } catch (error) {
            dispatch(
              notify({
                type: "error",
                message: error.message,
              })
            );
          }
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setZoneHover(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setZoneHover(false);
      }}
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
        Remove,
      }) => {
        return (
          <>
            <div
              className="customFileUploader"
              {...getRootProps()}
              style={Object.assign(
                {},
                styles.zone,
                zoneHover && styles.zoneHover
              )}
            >
              {acceptedFile ? (
                <>
                  <div style={styles.file}>
                    <div style={styles.info}>
                      <span style={styles.size}>
                        {formatFileSize(acceptedFile.size)}
                      </span>
                      <span style={styles.name}>{acceptedFile.name}</span>
                    </div>
                    <div style={styles.progressBar}>
                      <ProgressBar />
                    </div>
                    <div
                      {...getRemoveFileProps()}
                      style={styles.remove}
                      onMouseOver={(event) => {
                        event.preventDefault();
                        setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                      }}
                      onMouseOut={(event) => {
                        event.preventDefault();
                        setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                      }}
                    >
                      <Remove color={removeHoverColor} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col justify-center">
                  <span className="iconUpload">
                    <UploadIcon />
                  </span>
                  <h2>Or drop file to Upload</h2>
                </div>
              )}
            </div>
          </>
        );
      }}
    </CSVReader>
  );
};

export default ImportFromCSV;
