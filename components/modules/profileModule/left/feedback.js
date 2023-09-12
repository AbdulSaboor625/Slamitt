import {
  EyeFilled,
  EyeInvisibleFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Collapse, Typography, Image } from "antd";
import React, { useRef, useState } from "react";
import {
  EyeHideIcon,
  EyeIcon,
  VarifiedIcon,
  SearchThickIcon,
  ArrowLinkIcon,
} from "../../../../utility/iconsLibrary";
import AppModal from "../../../AppModal";
import EmptyProfileSection from "../emptyProfileSection";
import moment from "moment";
import AppNameAvater from "../../../AppAvatar/AppNameAvater";
import { clearJudgeState } from "../../../../Redux/Actions";
import useMediaQuery from "../../../../hooks/useMediaQuery";

const SingleFeedback = ({ editable, feedback }) => {
  return (
    <div className="profileFeedbackBox">
      <div className="profileFeedbackBoxHeader">
        <div className="profileFeedbackBoxLeft">
          <div className="profileFeedbackBoxImage">
            {editable && (
              <span className="profileFeedbackBoxViewButton">
                <EyeIcon className="iconShow" />
                <EyeHideIcon className="iconHide" />
              </span>
            )}
            <ArrowLinkIcon className="visibleMobile" />
            {feedback?.judge?.imageURL?.includes("media.licdn") ? (
              <Avatar src={feedback.judge.imageURL} alt="img-jud" size={100} />
            ) : (
              <AppNameAvater
                user={{
                  firstName: feedback?.judge?.name?.split(" ")[0],
                  lastName: feedback?.judge?.name?.split(" ")[1],
                }}
              />
            )}

            {/* <ArrowLinkIcon /> */}
          </div>
          <div className="titleTextbox">
            <Typography.Title level={5} className="title">
              <VarifiedIcon /> {feedback?.judge?.name}
            </Typography.Title>
            <Typography.Text className="subtext visibleMobile">
              Financial due diligence analyst @KPMG India{" "}
            </Typography.Text>
          </div>
        </div>
      </div>
      {/* <div className="profileFeedbackAudioPlayer">
        <audio
          className="audioPlayer"
          // style={{
          //   width: "50%",
          //   display: "inline-block",
          //   marginTop: "1rem",
          // }}
          src={``}
          controls
        />
      </div> */}
      <Typography.Text className="profileFeedbackText">
        {feedback.text}
      </Typography.Text>
      <div className="profileFeedbackBoxRight">
        <div className="profileCompInfo">
          <div className="profileCompInfoName">
            <span className="profileCompInfoNameImage">
              {feedback?.competition?.emojiObject ? (
                <span>{feedback.competition?.emojiObject?.emoji}</span>
              ) : (
                <img src={feedback?.competition?.imageURL} alt="" />
              )}
            </span>
            <span className="profileCompInfoNameText">
              {feedback?.competition?.competitionName}
            </span>
          </div>{" "}
          <span className="hiddenMobile">| </span>
          <div className="profileCompInfoCategory hiddenMobile">
            <span className="profileCompInfoCategoryImage">
              <img src={feedback?.competition?.categoryImage} alt="" />
            </span>
            <span className="profileCompInfoCategoryText">
              {feedback?.competition?.category}
            </span>
          </div>
        </div>
        <Typography.Text className="profileFeedbackNameDate">
          <div className="profileCompInfoCategory visibleMobile">
            <span className="profileCompInfoCategoryImage">
              <img src={feedback?.competition?.categoryImage} alt="" />
            </span>
            <span className="profileCompInfoCategoryText">
              {feedback?.competition?.category}
            </span>{" "}
            |{" "}
          </div>
          <strong className="competitionTitle">
            {feedback?.round?.roundName}
          </strong>{" "}
          |{" "}
          <span className="competitionDate">
            {moment(feedback.round.createdAt).format("D MMM, yyyy")}
          </span>
        </Typography.Text>
      </div>
    </div>
  );
};

const PrimaryFeedBack = ({ editable }) => {
  return (
    <div>
      {[1, 2, 3].map((card, i) => (
        <SingleFeedback editable={editable} key={i} />
      ))}
    </div>
  );
};
const MoreFeedback = ({ editable }) => {
  return (
    <div>
      {[1, 2, 3].map((card, i) => (
        <SingleFeedback editable={editable} key={i} />
      ))}
    </div>
  );
};

const Feedback = ({
  editable,
  feedbacks,
  isViewable,
  fetchFeedbacks,
  allFeedbacksCount,
}) => {
  const { Panel } = Collapse;
  const pageOffest = useRef(1);
  const [visible, setVisible] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const FeedBackModal = () => {
    const genExtra = () => (
      <ul className="profileCompetitionsViews">
        <li className="active">
          <EyeIcon />
          <Typography.Text className="viewCount">12</Typography.Text>
        </li>
        <li>
          <EyeHideIcon />
          <Typography.Text className="viewCount">06</Typography.Text>
        </li>
        <li>
          <SearchThickIcon className="searchIcon" />
        </li>
      </ul>
    );
    return (
      <AppModal
        className="moreProfileModal"
        isVisible={visible}
        onCancel={() => setVisible(false)}
      >
        <div className="moreProfileModalContent">
          <Typography.Text className="heading">Feedback</Typography.Text>
          <Collapse>
            <Panel header="Primary" key={1}>
              <PrimaryFeedBack editable={editable} />
            </Panel>
            <Panel header="More" key={2} extra={genExtra()}>
              <MoreFeedback editable={editable} />
            </Panel>
          </Collapse>
          <div className="text-center">
            <Button className="buttonCancle" onClick={() => setVisible(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </AppModal>
    );
  };
  return (
    <div className="profileFeedbackBlock">
      <div className="profileMainBlockHead">
        {!isMobile ? (
          <Typography.Title className="heading" level={3}>
            Feedback {allFeedbacksCount ? `(${allFeedbacksCount})` : ""}
          </Typography.Title>
        ) : (
          ""
        )}

        {/* {editable && (
          <ul className="profileCompetitionsViews">
            <li>
              <EyeIcon />
              <Typography.Text className="viewCount">12</Typography.Text>
            </li>
            <li>
              <EyeHideIcon />
              <Typography.Text className="viewCount">06</Typography.Text>
            </li>
          </ul>
        )} */}
      </div>
      <div className={`profileStatsHolder ${isViewable ? "" : "blurState"}`}>
        {/* Hidden Profile item state */}
        <div className="profileStatsPlaceholderText hiddenMobile">
          Finish setting up your account to access feedback from your judges
        </div>
        <div className="profileStatsPlaceholderText visibleMobile">
          Complete adding Account Info to preview your profile
        </div>
        {feedbacks && feedbacks.length ? (
          <div className="profileFeedbackList">
            <div className="profileFeedbackListWrap">
              {feedbacks.map((feedback, i) => (
                <SingleFeedback
                  editable={editable}
                  feedback={feedback}
                  key={i}
                />
              ))}
            </div>
            {feedbacks?.length < allFeedbacksCount ? (
              <div className="profileMainBlockLinkWrap">
                <Button
                  type="text"
                  className="profileSidebarLinkWrap"
                  onClick={() => {
                    pageOffest.current += 1;
                    fetchFeedbacks(pageOffest.current);
                  }}
                >
                  View All
                </Button>
              </div>
            ) : (
              <div />
            )}
          </div>
        ) : (
          <EmptyProfileSection section={"FEEDBACK"} />
        )}
      </div>
      <FeedBackModal />
    </div>
  );
};

export default Feedback;
