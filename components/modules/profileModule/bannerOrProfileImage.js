import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, message, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EditPencilIcon, ReloadIcon } from "../../../utility/iconsLibrary";

export default function BannerOrProfileImage({
  editable,
  basicInfoOpen,
  setBasicInfoOpen,
  type = "banner",
  user,
  updateUser,
  setUpdateUser,
}) {
  const [initialImage, setInitialImage] = useState(
    type === "banner"
      ? user?.bannerURL ||
      "https://rethink-competitions.s3.amazonaws.com/1672155147357_imagecover.jpg"
      : user?.imageURL ||
      "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1672162177885_profile_image.png"
  );
  useEffect(() => {
    setInitialImage(
      type === "banner"
        ? user?.bannerURL ||
        "https://rethink-competitions.s3.amazonaws.com/1672155147357_imagecover.jpg"
        : user?.imageURL ||
        "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1672162177885_profile_image.png"
    );
  }, [user.imageURL, user.bannerURL]);
  const [imageUrl, setImageUrl] = useState("");
  const [reload, setReload] = useState(true);
  const [status, setStatus] = useState("initial");
  const authDetails = useSelector((state) => state.auth);
  const props = {
    name: "file",
    multiple: false,
    action: process.env.NEXT_PUBLIC_UPLOAD_URL,
    accept: ["image/jpeg", "image/jpg"],
    headers: {
      Authorization: authDetails.slamittToken
        ? `Bearer ${authDetails.slamittToken}`
        : null,
    },
    // openFileDialogOnClick: reload,
    onChange(info) {
      const { status } = info.file;
      setStatus(
        !status ? "initial" : status === "uploading" ? "initial" : status
      );
      if (status === "done") {
        setReload(false);
        // setImageUploaded(info.file.response);
        const newProfile = {
          ...updateUser,
          imageURL: info.file.response.result.location,
        };
        const newBanner = {
          ...updateUser,
          bannerURL: info.file.response.result.location,
        };
        type === "banner"
          ? setUpdateUser(newBanner)
          : setUpdateUser(newProfile);
        setImageUrl(info.file.response.result.location);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload(file) {
      const fileSize = 5; // in mb
      if (!fileSize) return true;

      const isLessThanFileSize = file.size < fileSize * 1024 * 1024; // fileSize in mb
      if (!isLessThanFileSize)
        message.error(`Document must be smaller than ${fileSize} mb`);

      return isLessThanFileSize;
    },
  };

  const ImagesComponent = ({ image }) => {
    return (
      <div>
        {type === "banner" ? (
          <BannerComponent bannerImage={image} />
        ) : (
          <ProfileComponent profileImage={image} />
        )}
      </div>
    );
  };

  const BannerComponent = ({ bannerImage }) => {
    return (
      <div className="profileCoverBanner">
        <div className="profileCoverImage">
          <img src={bannerImage} alt="Banner Image" />
        </div>
        {/* {!editable ? (
          <Button className="buttonUpdateBanner">+ Add Banner</Button>
        ) : null} */}
        {editable &&
          (status === "done" ? (
            <Button
              onClick={() => {
                setStatus("initial");
                setUpdateUser({ ...updateUser, bannerURL: "" });
              }}
              className="buttonEditCover"
              icon={<ReloadIcon />}
            />
          ) : (
            <Upload.Dragger className="buttonEditBanner" {...props}>
              <EditPencilIcon />
              <span>Edit Banner</span>
            </Upload.Dragger>
          ))}
        {/* {!editable && (
          <div>
            {!basicInfoOpen ? (
              <Button
                className="buttonBasicInfo"
                icon={<SettingOutlined />}
                onClick={() => setBasicInfoOpen(true)}
              >
                Basic info
              </Button>
            ) : (
              <Button
                className="buttonBasicInfo"
                icon={<UserOutlined />}
                onClick={() => setBasicInfoOpen(false)}
              >
                Profile
              </Button>
            )}
          </div>
        )} */}
      </div>
    );
  };

  const ProfileComponent = ({ profileImage }) => {
    return (
      <div className="profileUserAvatar">
        <Avatar src={profileImage} alt="Profile Picture" />
        {editable &&
          (status === "done" ? (
            <Button
              onClick={() => {
                setStatus("initial");
                setUpdateUser({ ...updateUser, imageURL: "" });
              }}
              className="editAvatarIcon"
              icon={<ReloadIcon />}
            />
          ) : (
            <Upload.Dragger className="editAvatarIcon" {...props}>
              <EditPencilIcon />
            </Upload.Dragger>
          ))}
      </div>
    );
  };

  switch (status) {
    case "initial":
      return <ImagesComponent image={initialImage} />;
    case "done":
      return <ImagesComponent image={imageUrl} />;
    case "error":
      return (
        <ImagesComponent
          image={
            "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1671098555777_wrong.webp"
          }
        />
      );
    default:
      <ImagesComponent image={initialImage} />;
  }
}
