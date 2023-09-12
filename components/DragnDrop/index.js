import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Image, message, Upload } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";

const DragNDrop = ({ children, setImageUploaded }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("initial");
  const [reload, setReload] = useState(true);

  const authDetails = useSelector((state) => state.auth);
  const props = {
    name: "file",
    multiple: false,
    action: process.env.NEXT_PUBLIC_UPLOAD_URL,
    accept: ["image/jpeg", "image/jpg", "file/pdf"],
    headers: {
      Authorization: authDetails.slamittToken
        ? `Bearer ${authDetails.slamittToken}`
        : null,
    },
    // openFileDialogOnClick: reload,
    onChange(info) {
      const { status } = info.file;
      setStatus(status === "uploading" ? "initial" : status);
      if (status === "done") {
        setReload(false);
        setImageUploaded(info.file.response);
        setImageUrl(info.file.response.result.location);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  switch (status) {
    case "initial":
      return <Upload.Dragger {...props}>{{ ...children }}</Upload.Dragger>;
    case "done":
      return (
        <Card className="uploadWidget">
          <Image
            src={imageUrl}
            alt="id-card"
            preview={false}
            height={200}
            width={300}
          />
          <div className="uploadWidgetIcons">
            <Button
              icon={<DeleteOutlined />}
              className="btnDelete"
              type="text"
              onClick={() => {
                setImageUploaded({});
                setImageUrl("");
                setStatus("initial");
              }}
            />
            <Button
              icon={<DeleteOutlined />}
              className="btnReload"
              type="text"
              onClick={() => {
                setImageUploaded({});
                setImageUrl("");
                setStatus("initial");
                setReload(true);
              }}
            />
          </div>
        </Card>
      );
    case "error":
      return (
        <Card>
          <Alert message="Image Uploading Failed" type="error" />
          <Button
            icon={<ReloadOutlined />}
            type="text"
            onClick={() => {
              setImageUploaded({});
              setImageUrl("");
              setStatus("initial");
            }}
          />
        </Card>
      );
  }
};

export default DragNDrop;
