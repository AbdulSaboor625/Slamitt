import React from "react";
import { Progress, Typography } from "antd";
import { useSelector } from "react-redux";
const STATUS_RESPONSE = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
  EXCEPTION: "exception",
});

const PROGRESS_STATUS = Object.freeze({
  ACTIVE: "active",
  NORMAL: "normal",
  SUCCESS: "success",
  EXCEPTION: "exception",
});

const ProgressStatus = () => {
  const { status, uploaded, total } = useSelector((state) => state.config);
  const getStatusCompletitionPercentage = () => {
    const percentage = (uploaded?.length / (total || 1)) * 100;
    return percentage;
  };
  const getStatus = () => {
    const percentage = getStatusCompletitionPercentage();
    if (status === STATUS_RESPONSE.ACTIVE) {
      if (percentage === 100) return PROGRESS_STATUS.SUCCESS;
      if (percentage < 100) return PROGRESS_STATUS.ACTIVE;
    } else if (status === STATUS_RESPONSE.EXCEPTION) {
      return PROGRESS_STATUS.EXCEPTION;
    } else {
      return PROGRESS_STATUS.NORMAL;
    }
  };
  return (
    status !== STATUS_RESPONSE.INACTIVE && (
      <div
        style={{
          position: "fixed",
          top: "90%",
          left: "70%",
          right: 10,
          bottom: 20,
          backgroundColor: "#000",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Progress
          percent={getStatusCompletitionPercentage()}
          status={getStatus()}
        />
        <Typography.Text>
          Please do not refresh/leave page until uploading completes
        </Typography.Text>
      </div>
    )
  );
};

export default ProgressStatus;
