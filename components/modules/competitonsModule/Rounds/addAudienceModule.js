import { Button, Image, Typography } from "antd";
import React, { useState } from "react";
import AddAudienceModal from "./addAudienceModal";

const AddAudienceModule = () => {
  const [isVisible, setVisible] = useState(false);

  return (
    <div className="competitionPlaceholderBlock audienceJudgeRound">
      <Image
        preview={false}
        width={200}
        height={200}
        alt="thumbnail"
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />
      <Typography.Title className="audienceJudgeRoundTitle">
        Allow audience to judge this round
      </Typography.Title>
      <Typography.Text className="audienceJudgeRoundText">
        Engage your audience! Allow Audience to react to performances.
      </Typography.Text>
      <Button type="ghost" onClick={() => setVisible(true)}>
        Set up
      </Button>
      <AddAudienceModal isVisible={isVisible} setVisible={setVisible} />
    </div>
  );
};

export default AddAudienceModule;
