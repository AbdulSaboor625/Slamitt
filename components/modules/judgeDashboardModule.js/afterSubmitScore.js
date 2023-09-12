import { Image, Typography } from "antd";
import { Footer } from "antd/lib/layout/layout";
import React from "react";
import { slamittLogoSmall } from "../../../utility/imageConfig";

const AfterSubmitScore = () => {
  return (
    <div className="scoreSubmittedScreen">
      <div className="scoreSubmittedScreenContent">
        <Image
          alt="submission image"
          src={
            // "https://rethink-competitions.s3.amazonaws.com/1667222368672_submitScores.png"
            "/submitScores.png"
          }
        />
        <Typography.Title className="scoreSubmittedScreenTite">Hurray!</Typography.Title>
        <Typography.Text className="scoreSubmittedScreenText">
          Your Scores have been sucessfully released.
        </Typography.Text>
      </div>
      <Footer className="scoreSubmittedScreenFooter">
        <Image alt="footer image" src={slamittLogoSmall} />
      </Footer>
    </div>
  );
};

export default AfterSubmitScore;
