import { EyeFilled } from "@ant-design/icons";
import { Typography } from "antd";
import React from "react";
import {
  ChatMicIcon,
  LikeSVGIcon,
  StarCircleIcon,
  EyeHideIcon,
  ChatNewIcon,
} from "../../../../utility/iconsLibrary";

const Activities = ({ editable, counts }) => {
  return (
    <>
      {/* Stats Empty State */}
      <div className="profileUserStatsHolder">
        {/* {editable && (
          <div className="hideCounterBlock">
            <Typography.Text>
              <EyeHideIcon /> <span>Hide counter</span>
            </Typography.Text>
          </div>
        )} */}
        <div className="profileUserStatsBox">
          <div className="profileUserStatsColumn blue">
            <div className={`profileUserStatsHead ${counts?.endorsements === 0 ? 'emptyStats' : ''}`}>
              <LikeSVGIcon className="likeIcon" />
              <Typography.Text className="profileUserStatsNumers">
                {counts?.endorsements === 0 ? "00" : counts?.endorsements}
              </Typography.Text>
            </div>
            <Typography.Text className="profileUserStatsTitle">
              Endorsements
            </Typography.Text>
          </div>
          <div className="profileUserStatsColumn yellow">
            <div className={`profileUserStatsHead ${counts?.feedbacks === 0 ? 'emptyStats' : ''}`}>
              <ChatNewIcon className="chatIcon" />
              <Typography.Text className="profileUserStatsNumers">
                {counts?.feedbacks === 0 ? "00" : counts?.feedbacks}
              </Typography.Text>
            </div>
            <Typography.Text className="profileUserStatsTitle">
              Feedback
            </Typography.Text>
          </div>
          <div className="profileUserStatsColumn purple">
            <div className={`profileUserStatsHead ${counts?.placements === 0 ? 'emptyStats' : ''}`}>
              <StarCircleIcon className="starIcon" />
              <Typography.Text className="profileUserStatsNumers">
                {counts?.placements === 0 ? "00" : counts?.placements}
              </Typography.Text>
            </div>
            <Typography.Text className="profileUserStatsTitle">
              Placements
            </Typography.Text>
          </div>
          <div className="profileUserStatsColumn red">
            <div className={`profileUserStatsHead ${counts?.damn === 0 ? 'emptyStats' : ''}`}>
              <span className="emojiIcon">
                <img
                  src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1674667246062_emoji.png"
                  alt=""
                />
              </span>
              <Typography.Text className="profileUserStatsNumers">
                {counts?.damn === 0 ? "00" : counts?.damn}
              </Typography.Text>
            </div>
            <Typography.Text className="profileUserStatsTitle">
              DAMN!
            </Typography.Text>
          </div>
          <div className="emptyStatsNote">
            <Typography.Text>
              Count up with every competition you take part in
            </Typography.Text>
          </div>
        </div>
      </div>
    </>
  );
};

export default Activities;
