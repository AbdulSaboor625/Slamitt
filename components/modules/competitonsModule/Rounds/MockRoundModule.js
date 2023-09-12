import { Anchor, Button, Image, Input, Typography } from "antd";
import { useEffect, useState } from "react";
import { useCSVDownloader } from "react-papaparse";
import { useDispatch } from "react-redux";
import { updateRound } from "../../../../Redux/Actions";
import { EllipseIcon } from "../../../../utility/iconsLibrary";
import AppModal from "../../../AppModal";
import ImportFromCSV from "../../../CSVImport";

const UploadCsvModal = ({
  roundCode,
  containers,
  isVisible,
  setIsVisible,
  maxPoints,
  handleBulkUpdateScores,
}) => {
  const { CSVDownloader, Type } = useCSVDownloader();

  const [error, setError] = useState(false);
  const [mockRoundScores, setMockRoundScores] = useState([]);
  const [curMaxPoints, setCurMaxPoints] = useState(null);

  useEffect(() => {
    if (maxPoints || maxPoints === null) {
      setCurMaxPoints(maxPoints);
    }
  }, [maxPoints]);

  const previousContainerData = containers.map((container) => {
    const c = {
      "Team Code": container.containerName,
    };

    if (container.mockRoundData && container.mockRoundData.length) {
      const mockRoundDetails = container.mockRoundData.find(
        (r) => r.roundCode === roundCode
      );

      if (mockRoundDetails) {
        c[`Scores out of ${curMaxPoints || 100}`] =
          mockRoundDetails.roundScore || 0;
      }
    }

    return c;
  });

  return (
    <div>
      <AppModal
        closable={true}
        className="csvUploadModal"
        isVisible={isVisible}
        onOk={() => {
          setIsVisible(false);
          setError(false);
          setMockRoundScores([]);
          setCurMaxPoints(null);
        }}
        onCancel={() => {
          setMockRoundScores([]);
          setCurMaxPoints(null);
          setIsVisible(false);
          setError(false);
        }}
      >
        <div className="csvUploadPopup">
          <Typography.Title
            className="csvUploadPopupTitle text-center"
            level={4}
          >
            {"Bulk upload Scores by CSV"}
          </Typography.Title>
          <Typography.Text className="csvUploadTemplateText">
            {`Download a `}
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
                {`Sample CSV Template`}
              </CSVDownloader>
            </Anchor>
            {` to see an example of the format required`}
          </Typography.Text>

          <ImportFromCSV
            setError={setError}
            setCurMaxPoints={setCurMaxPoints}
            setMockRoundScores={setMockRoundScores}
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
                disabled={error || !mockRoundScores.length}
                onClick={() => {
                  handleBulkUpdateScores(mockRoundScores, curMaxPoints);
                  setMockRoundScores([]);
                  setCurMaxPoints(null);
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

const MockRoundModule = ({
  data,
  roundCode,
  isLive,
  containers = [],
  updateMockRoundScore,
  updateBulkMockRoundScores,
  isCsvModalVisible,
  setIsCsvModalVisible,
}) => {
  const dispatch = useDispatch();

  let maxAssignedPoints = 0;

  const handleBulkUpdateScores = (mockRoundScores, maxPoints) => {
    if (mockRoundScores && Array.isArray(mockRoundScores)) {
      if (maxPoints && maxPoints != data?.maxPoints) {
        dispatch(
          updateRound({
            competitionRoundCode: data?.competitionRoundCode,
            maxPoints,
          })
        );
      }

      updateBulkMockRoundScores(mockRoundScores);
      setIsCsvModalVisible(false);
    }
  };

  const ContainerCards = ({ container }) => {
    const [score, setScore] = useState(null);
    const [maxPoints, setMaxPoints] = useState(null);
    useEffect(() => {
      if (container.mockRoundData && container.mockRoundData.length) {
        const mockRoundDetails = container.mockRoundData.find(
          (r) => r.roundCode === roundCode
        );

        if (mockRoundDetails) {
          maxAssignedPoints = Math.max(
            maxAssignedPoints,
            mockRoundDetails.roundScore
          );

          setScore(mockRoundDetails.roundScore);
        }
      }
    }, [container]);

    useEffect(() => {
      if (data) {
        setMaxPoints(data.maxPoints);
      }
    }, [data]);

    return (
      <div className="submissionTableRow flex items-center justify-between">
        <div className="submissionTableCol flex items-center">
          <EllipseIcon />
          {container?.emojiObject ? (
            <p className="submissionTeamEmoji" style={{ fontSize: "2rem" }}>
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
          <Typography.Text className="submissionTeamName">
            {container?.containerName}
          </Typography.Text>
        </div>

        <div className="submissionTableScoreCol flex items-center">
          <div className="roundAssessmentItemOptions flex items-center">
            {isLive ? (
              <>
                <Typography.Text className="textScores inputLarge">
                  {score}
                </Typography.Text>
                <span className="seprator">/</span>
                <Typography.Text className="textScores inputSmall">
                  {maxPoints}
                </Typography.Text>
              </>
            ) : (
              <>
                <Input
                  disabled={isLive}
                  className="inputLarge"
                  type={"number"}
                  bordered={false}
                  max={maxPoints}
                  placeholder="00"
                  autoFocus={false}
                  value={score}
                  onChange={(e) => {
                    if (
                      e.target.value &&
                      Number(e.target.value) > (maxPoints || 100)
                    )
                      setScore(parseInt(e.target.value / 10));
                    else {
                      const roundedValue = parseFloat(e.target.value).toFixed(
                        2
                      );
                      setScore(Math.max(0, roundedValue));
                    }
                  }}
                  // defaultValue={0}
                  onBlur={(e) => {
                    if (
                      e.target.value &&
                      Number(e.target.value) <= (maxPoints || 100) &&
                      Number(e.target.value) >= 0
                    ) {
                      updateMockRoundScore(
                        container.containerCode,
                        e.target.value
                      );
                      if (!maxPoints)
                        dispatch(
                          updateRound({
                            competitionRoundCode: data?.competitionRoundCode,
                            maxPoints: 100,
                          })
                        );
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      e.target.value &&
                      Number(e.target.value) <= (maxPoints || 100) &&
                      Number(e.target.value) >= 0
                    ) {
                      updateMockRoundScore(
                        container.containerCode,
                        e.target.value
                      );
                      if (!maxPoints)
                        dispatch(
                          updateRound({
                            competitionRoundCode: data?.competitionRoundCode,
                            maxPoints: 100,
                          })
                        );
                    }
                  }}
                />
                <span className="seprator">/</span>
                <Input
                  disabled={isLive}
                  className="inputSmall"
                  type={"number"}
                  bordered={false}
                  autoFocus={false}
                  value={maxPoints}
                  placeholder="100"
                  onChange={(e) => {
                    setMaxPoints(e.target.value);
                  }}
                  onBlur={(e) => {
                    if (
                      e.target.value &&
                      Number(e.target.value) >= maxAssignedPoints
                    )
                      dispatch(
                        updateRound({
                          competitionRoundCode: data?.competitionRoundCode,
                          maxPoints: e.target.value,
                        })
                      );
                    else setMaxPoints(data.maxPoints);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (
                        e.target.value &&
                        Number(e.target.value) >= maxAssignedPoints
                      )
                        dispatch(
                          updateRound({
                            competitionRoundCode: data?.competitionRoundCode,
                            maxPoints: e.target.value,
                          })
                        );
                      else setMaxPoints(data.maxPoints);
                    }
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      {!data?.isLive && (
        <UploadCsvModal
          maxPoints={data?.maxPoints}
          roundCode={roundCode}
          containers={containers}
          isVisible={isCsvModalVisible}
          setIsVisible={setIsCsvModalVisible}
          handleBulkUpdateScores={handleBulkUpdateScores}
        />
      )}
      {containers.map((container) => (
        <ContainerCards container={container} key={container.containerCode} />
      ))}
    </>
  );
};

export default MockRoundModule;
