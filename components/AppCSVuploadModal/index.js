import { Anchor, Button, Typography } from "antd";
import { useState } from "react";
import { useCSVDownloader } from "react-papaparse";
import { useDispatch } from "react-redux";
import { notify } from "../../Redux/Actions";
import AppModal from "../AppModal";
import ImportFromCSV from "../CSVImport";
import CsvUpload from "../CsvUpload";

const AppCSVuploadModal = ({
  competition,
  isVisible,
  setVisible,
  setShowBulkUploadReviewModal,
  setVisibiltyTeamSizeModal,
  onSubmitTeamSize,
  addTeamOrParticipantsCode = true,
  allContainers = [],
  roundData,
  submissions,
  setSubmissions,
  uploadImportSubmissions,
  links = [],
}) => {
  const { Link } = Anchor;
  const [containers, setContainers] = useState([]);

  const { CSVDownloader, Type } = useCSVDownloader();
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const previousContainerData = links?.length
    ? links?.map((l) => {
        const existContainer = allContainers.find(
          (a) => a?.containerCode === l?.containerCode
        );
        if (existContainer) {
          return {
            "Team Code": `${existContainer?.containerName}`,
            Link1: l?.links ? l?.links[0] : "",
            Link2: l?.links ? l?.links[1] : "",
            Link3: l?.links ? l?.links[2] : "",
            Link4: l?.links ? l?.links[3] : "",
            Link5: l?.links ? l?.links[4] : "",
          };
        }
      })
    : allContainers?.map((c) => {
        return {
          "Team Code": `${c.containerName}`,
          Link1: "",
          Link2: "",
          Link3: "",
          Link4: "",
          Link5: "",
        };
      });

  const disable = () => {
    if (addTeamOrParticipantsCode) {
      return !containers?.length;
    } else {
      return !submissions?.length || error;
    }
  };

  return (
    <div>
      <AppModal
        className="csvUploadModal"
        isVisible={isVisible}
        onOk={() => setVisible(false)}
        onCancel={() => {
          setContainers([]);
          setVisible(false);
          setError(false);
          // competition?.teamSize === null && onSubmitTeamSize();
        }}
      >
        <div className="csvUploadPopup">
          <Typography.Title className="csvUploadPopupTitle" level={4}>
            Invite{" "}
            {competition?.competitionType === "TEAM"
              ? "Team Codes"
              : "Participant Codes"}{" "}
            by CSV
          </Typography.Title>
          <Typography.Text className="csvUploadTemplateText">
            Download a{" "}
            <Anchor>
              {addTeamOrParticipantsCode ? (
                <Link
                  href="https://slamitt-prod.s3.ap-south-1.amazonaws.com/Bulk+Register+Sample+Sheet.csv"
                  title="Sample CSV Template"
                />
              ) : (
                <CSVDownloader
                  className="text-[#3498db]"
                  type={Type.Button}
                  filename={"sample"}
                  config={{
                    delimiter: ",",
                  }}
                  data={previousContainerData}
                >
                  {" "}
                  Sample CSV Template{" "}
                </CSVDownloader>
              )}
            </Anchor>{" "}
            to see an example of the format required
          </Typography.Text>
          {addTeamOrParticipantsCode ? (
            <CsvUpload
              competition={competition}
              setContainers={setContainers}
              setVisible={setVisible}
            />
          ) : (
            <ImportFromCSV
              setError={setError}
              setSubmissions={setSubmissions}
              roundData={roundData}
              allContainers={allContainers}
            />
          )}
          {/* <DragNDrop>
            <>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Or drop file to upload</p>
            </>
          </DragNDrop> */}
          {/* <Radio>
            Overwrite any participants that have already registered.
          </Radio> */}
          <div className="csvUploadPopupFooter">
            {/* <Button
              className="buttonYoutubeVideo"
              type="dashed"
              shape="round"
              icon={<YoutubeFilled />}
              size="small"
            >
              Watch Tutorial
            </Button> */}
            <div className="csvUploadPopupButtons">
              <Button
                className="csvUploadCancle"
                type="text"
                shape="round"
                size="small"
                onClick={() => {
                  if (addTeamOrParticipantsCode) {
                    // competition?.teamSize === null && onSubmitTeamSize();
                    setContainers([]);
                  } else {
                    setSubmissions([]);
                    setError(false);
                  }
                  setVisible(false);
                }}
              >
                Cancel
              </Button>
              <Button
                className="csvUploadButton"
                type="primary"
                shape="round"
                size="small"
                disabled={disable()}
                onClick={async () => {
                  if (addTeamOrParticipantsCode) {
                    if (containers.length) {
                      competition?.competitionType === "TEAM" &&
                        competition?.teamSize === null &&
                        (await onSubmitTeamSize());
                      setShowBulkUploadReviewModal(containers);
                      setContainers([]);
                      setVisible(false);
                      competition.competitionType === "TEAM" &&
                        competition.teamSize === null &&
                        setVisibiltyTeamSizeModal(true);
                    } else
                      dispatch(
                        notify({
                          type: "error",
                          message: "You haven’t uploaded a CSV yet",
                        })
                      );
                  } else {
                    uploadImportSubmissions();
                  }
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

export default AppCSVuploadModal;
