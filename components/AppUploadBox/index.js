import { message, Spin, Upload } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";

const AppUploadBox = ({
  children,
  setImageUploaded,
  maxCount,
  fileSize,
  accept,
  multiple,
}) => {
  const [status, setStatus] = useState("initial");
  const [loading, setLoading] = useState(false);
  const authDetails = useSelector((state) => state.auth);
  const props = {
    name: "file",
    accept: accept || "*",
    listType: "picture-card",
    multiple,
    action: process.env.NEXT_PUBLIC_UPLOAD_URL,
    headers: {
      Authorization: authDetails.slamittToken
        ? `Bearer ${authDetails.slamittToken}`
        : null,
    },
    onChange(info) {
      const { status } = info.file;
      setStatus(status === "uploading" ? "initial" : status);
      if (status === "uploading") {
        setLoading(true);
      } else if (status === "done") {
        setLoading(false);
        setImageUploaded({
          ...info.file.response,
          fileName: info.file.name,
        });
      } else if (status === "error") {
        setLoading(false);
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload(file) {
      if (!fileSize) return true;

      const isLessThanFileSize = file.size < fileSize * 1024 * 1024 * 2; // fileSize in mb
      if (!isLessThanFileSize)
        message.error(`Document must be smaller than ${fileSize} mb`);
      return isLessThanFileSize;
    },
  };
  return (
    <Upload maxCount={maxCount} {...props} showUploadList={false}>
      {loading ? (
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          {/* <Spin size='large' /> */}
          <div className="loader-icon" />
        </div>
      ) : (
        { ...children }
      )}
    </Upload>
  );
};

export default AppUploadBox;
