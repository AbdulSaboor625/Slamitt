import { Image, Typography } from "antd";
import React from "react";
import { leaderboardEmptyState } from "../../../../utility/imageConfig";

const Leaderboard = () => {
  return (
    <div className="participantDashboardPlaceholder">
      <Image
        className="participantDashboardPlaceholderImage"
        alt=""
        src={leaderboardEmptyState}
        preview={false}
      />
      <Typography.Text className="participantDashboardPlaceholderText">
        You may preview the leaderboard when participants begin getting scored
      </Typography.Text>
    </div>
  );
};

export default Leaderboard;
