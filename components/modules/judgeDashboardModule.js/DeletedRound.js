import { Image, Typography } from "antd";
import { Footer } from "antd/lib/layout/layout";
import React from "react";
import { slamittLogoSmall } from "../../../utility/imageConfig";

const DeletedRound = () => {
  return (
    <div className="scoreSubmittedScreen">
      <div className="scoreSubmittedScreenContent">
        <Image
          preview={false}
          alt="submission image"
          src={
            "https://rethink-competitions.s3.amazonaws.com/1670256535453_Group_3371.svg"
          }
        />
        <Typography.Text className="scoreSubmittedScreenText">
          {"The Round you were judging was discontinued by the organiser"}
        </Typography.Text>
      </div>
      <Footer className="scoreSubmittedScreenFooter">
        <Image alt="footer image" src={slamittLogoSmall} />
      </Footer>
    </div>
  );
};

export default DeletedRound;
