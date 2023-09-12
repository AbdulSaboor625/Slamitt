import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Select, Spin, Table, Tag, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bulkCreateContainers } from "../../Redux/Actions";
import { getInitials, getUniqueId } from "../../utility/common";
import { exportSkippedContainer } from "../../utility/excelService";
import {
  ArrowBackIcon,
  DeleteIcon,
  UnionNextIcon,
  UnionPrevIcon,
} from "../../utility/iconsLibrary";
import {
  groupContainersFromRows,
  validateContainerUsers,
} from "../../utility/validatationRules";
import AppModal from "../AppModal";

const columns = [
  {
    title: "Code",
    dataIndex: "containerName",
  },
  {
    title: "Row",
    dataIndex: "row",
  },
  {
    title: "Full name",
    key: "action",
    render: (_, record) => (
      <>
        {/* {record?.firstName ? ( */}
        <Typography.Text className="csvUserName">
          {record?.firstName && (
            <span className="csvUserShortName">{getInitials(record)}</span>
          )}
          <span className="csvUserFullName">
            {record?.firstName
              ? `${record?.firstName + " " + record?.lastName}`
              : "N/A"}
          </span>
        </Typography.Text>
      </>
    ),
  },
  {
    title: "email",
    render: (_, record) => (
      <Typography.Text>{record?.email ? record?.email : "N/A"}</Typography.Text>
    ),
  },
];

const skippedColumns = [
  ...columns,
  {
    title: "Reason",
    key: "reason",
    render: (_, record) => (
      <div className="flex flex-col space-y-2 reasonTagsWarp">
        {record?.reasons.map((reason, i) => (
          <Tag className="reasonTag" color="red" key={i}>
            {reason}
          </Tag>
        ))}
      </div>
    ),
  },
];

const AppUploadBulkReviewModal = ({
  isVisible,
  setVisible = () => null,
  csvReadedRows,
  competition,
  loading,
  setLoading,
}) => {
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.rooms);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isShowingSkipped, setShowSkipped] = useState(false);
  const [valid, setValid] = useState([]);
  const [isSolo, setIsSolo] = useState(
    competition?.competitionType === "SOLO" ? true : false
  );
  const [skipped, setSkipped] = useState([]);
  const [pagination, setPagination] = useState(1);
  const [roomSelected, setRoomSelected] = useState(
    rooms?.all && rooms?.all[0]?.roomName
  );

  useEffect(() => {
    if (csvReadedRows?.length) {
      processRows(csvReadedRows);
    }
  }, [csvReadedRows]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    // selections: [Table.SELECTION_ALL, Table.SELECTION_NONE],
  };

  const processRows = (data) => {
    const headers = data[0];
    const firstNameIdx = headers.findIndex(
      (header) => header.toLowerCase() === "first name".toLowerCase()
    );
    const lastNameIdx = headers.findIndex(
      (header) => header.toLowerCase() === "last name".toLowerCase()
    );
    const emailIdx = headers.findIndex(
      (header) => header.toLowerCase() === "email id".toLowerCase()
    );
    const containerIdx = headers.findIndex(
      (header) => header.toLowerCase().trim() === "team code".toLowerCase()
    );

    // duplicate containers validations
    const containers = [];
    data.forEach((row, idx) => {
      if (idx)
        containers.push({
          key: getUniqueId(),
          row: idx,
          containerName: row[containerIdx] ? row[containerIdx].trim() : "",
          email: row[emailIdx] ? row[emailIdx].trim() : "",
          firstName: row[firstNameIdx] ? row[firstNameIdx].trim() : "",
          lastName: row[lastNameIdx] ? row[lastNameIdx].trim() : "",
        });
    });

    const { validated, skipped } = validateContainerUsers(containers, isSolo);
    setValid(validated);
    setSkipped(skipped);
  };

  const onSubmit = () => {
    if (setLoading) setLoading(true);
    let groupedData = groupContainersFromRows(valid, roomSelected);
    dispatch(
      bulkCreateContainers(
        Object.values(groupedData.groupedContainers),
        roomSelected === "Qualified" ? "qualified" : roomSelected
      )
    );
    setVisible(false);
  };

  const onDelete = () => {
    const data = valid.filter((row) => !selectedRowKeys.includes(row.key));
    setValid(data);
    setSelectedRowKeys([]);
    setShowSkipped(false);
  };
  const filteredRoom = rooms?.all?.filter(
    (rm) => rm.roomCode !== "disqualified"
  );
  const Header = () => {
    if (selectedRowKeys.length)
      return (
        <div className="csvUploadTableHeader">
          <div className="csvUploadTableHeaderRight">
            <Button
              className="buttonPopupOutline"
              type="secondary"
              onClick={() => setSelectedRowKeys([])}
            >
              Cancel
            </Button>
            <Button
              className="buttonPopupOutline"
              type="secondary"
              icon={<DeleteIcon />}
              onClick={onDelete}
            >
              Delete {selectedRowKeys.length} Codes
            </Button>
          </div>
        </div>
      );
    else if (selectedRowKeys.length === 0 && !isShowingSkipped)
      return (
        <div className="csvUploadTableHeader">
          <div className="csvUploadTableHeaderLeft">
            <Typography.Text className="infoUpload">
              Upload <span className="uploadsCount">{valid.length}</span> codes
              to{" "}
            </Typography.Text>
            <Select
              className="csvSelect"
              defaultValue={rooms?.all && rooms?.all[0].roomName}
              style={{ width: 120 }}
              onSelect={(e) => setRoomSelected(e)}
              value={roomSelected}
            >
              {filteredRoom &&
                filteredRoom?.map((room) => (
                  <Select.Option key={room._id} value={room?.roomCode}>
                    {room?.roomName}
                  </Select.Option>
                ))}
            </Select>
          </div>
          <div className="csvUploadTableHeaderRight">
            {skipped.length > 0 && (
              <Button
                className="linkSkip"
                icon={<InfoCircleOutlined />}
                type="text"
                onClick={() => setShowSkipped(true)}
              >
                <span className="linkText">
                  View Skipped ({skipped?.length || 0})
                </span>
              </Button>
            )}

            <Button
              disabled={(!!skipped.length && !valid.length) || !valid.length}
              className="buttonInvite"
              type="primary"
              onClick={() => {
                onSubmit();
              }}
            >
              {loading ? <div className="loader-icon" /> : "Invite Codes"}
            </Button>
          </div>
        </div>
      );
    else
      return (
        <div className="csvUploadTableHeader">
          <div className="csvUploadTableHeaderLeft">
            <Button
              className="iconBack"
              icon={<ArrowBackIcon />}
              type="text"
              onClick={() => setShowSkipped(false)}
            />
            <Typography.Text className="linkSkip textLarge">
              <InfoCircleOutlined />
              <span className="linkText">
                Skipped Codes ({skipped?.length || 0})
              </span>
            </Typography.Text>
          </div>
          <div className="csvUploadTableHeaderRight">
            <Button
              type="secondary buttonPopupOutline"
              onClick={() => exportSkippedContainer(skipped)}
            >
              Export Skiped Codes
            </Button>
          </div>
        </div>
      );
  };

  return (
    <AppModal
      className="csvUploadModal csvBulkReviewsModal"
      isVisible={isVisible}
      onOk={() => setVisible(false)}
      onCancel={() => {
        setValid([]);
        setSkipped([]);
        setSelectedRowKeys([]);
        setVisible(false);
      }}
    >
      <>
        <Header />
        <div className="csvBulkReviewsModalHolder">
          <div className="csvUploadTableScroller">
            {!(
              (isShowingSkipped && !skipped?.length) ||
              (!isShowingSkipped && !valid?.length)
            ) ? (
              <Table
                pagination={{ current: pagination, pageSize: 50 }}
                rowSelection={!isShowingSkipped ? rowSelection : null}
                columns={isShowingSkipped ? skippedColumns : columns}
                dataSource={isShowingSkipped ? skipped : valid}
              />
            ) : (
              <div className="csvUploadPlaceholder">
                <div className="csvUploadPlaceholderImage">
                  <img
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1689783485852_image_529.png"
                    alt=""
                  />
                </div>
                <div className="textbox">
                  <p>
                    <span className="textDark">
                      No Codes match the required format.
                    </span>{" "}
                    <br />
                    Download a{" "}
                    <span className="sampleLink">Sample CSV Template</span> to
                    see an example of the format required
                  </p>
                </div>
              </div>
            )}
          </div>
          {valid?.length > 50 && (
            <div className="csvBulkReviewsModalButtons">
              <Button
                className="button"
                disabled={pagination <= 1}
                onClick={() => setPagination(pagination - 1)}
              >
                <UnionPrevIcon /> Prev
              </Button>
              <Button
                className="button"
                disabled={
                  isShowingSkipped
                    ? pagination >= Math.ceil(skipped.length / 10)
                    : pagination >= Math.ceil(valid.length / 10)
                }
                onClick={() => setPagination(pagination + 1)}
              >
                Next <UnionNextIcon />
              </Button>
            </div>
          )}
        </div>
      </>
    </AppModal>
  );
};

export default AppUploadBulkReviewModal;
