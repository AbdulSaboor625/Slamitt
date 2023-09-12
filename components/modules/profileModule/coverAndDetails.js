import { Button, Progress, Typography } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { EditPencilIcon, HatIcon, UserInfoIcon, } from "../../../utility/iconsLibrary";
import BannerOrProfileImage from "./bannerOrProfileImage";

const CoverAndDetails = ({
  editable,
  setEditable,
  setBasicInfoOpen,
  basicInfoOpen,
  setUpdateUser,
  form,
  user,
  onSubmit,
}) => {
  const imageProps = {
    editable: editable,
    basicInfoOpen: basicInfoOpen,
    setBasicInfoOpen: setBasicInfoOpen,
    user: user,
    setUpdateUser: setUpdateUser,
  };
  return (
    <div className="profileCoverBlock">
      <BannerOrProfileImage {...imageProps} type="banner" />
      <div className="profileUserInfoBlock">
        <div className="profileUserInfoLeft">
          <BannerOrProfileImage type="profile" {...imageProps} />
          {!basicInfoOpen && (
            <>
              <div className="profileUserTextbox">
                <Typography.Text className="profileUserName">
                  {user?.fName} {user?.lName}
                </Typography.Text>
                <Typography.Text className="profileUserLocation">
                  <HatIcon className="locationIcon" /> {user?.institute_name}
                </Typography.Text>
              </div>
              <div className="visibleMobile profileUserInfoMobile">
                <Button className="buttonLink btnBio hiddenMobile">+ Add Bio</Button>
                <div className="accountInfoBox hiddenMobile">
                  <div className="accountInfoBoxProgress">
                    {/* <img src="/progress-circle.png" alt=""/> */}
                    <Progress
                      type="circle"
                      percent="80"
                      width={46}
                    />
                    <UserInfoIcon className="icoUser"/>
                  </div>
                  <div className="accountInfoBoxText">
                    <strong className="accountInfoBoxTitle">Acount Info</strong>
                    <span className="accountInfoBoxSubtext">Complete adding your details</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="profileUserInfoRight">
            {editable ? (
              <div className="flex items-center">
                <Typography.Title
                  level={5}
                  underline={true}
                  onClick={() => {
                    setEditable(false);
                    form.resetFields();
                  }}
                  className="buttonCancle"
                >
                  Cancel
                </Typography.Title>
                {/* <Typography.Title
                  className="buttonLink linkPreview"
                  level={5}
                  underline={true}
                >
                  <EyeIcon />
                  Preview
                </Typography.Title> */}
                <Button
                  onClick={onSubmit}
                  disabled={false}
                  className="buttonProfileDone"
                >
                  Update Info
                </Button>
              </div>
            ) : (
              <Button
                className="buttonLink"
                icon={<EditPencilIcon />}
                onClick={() => setEditable(true)}
              >
                {basicInfoOpen ? "Edit Profile" : "Edit Profile"}
              </Button>
            )}
        </div>
      </div>
    </div>
  );
};

export default CoverAndDetails;
