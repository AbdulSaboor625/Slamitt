import { CopyOutlined, LinkOutlined } from "@ant-design/icons";
import { Button, Checkbox, Image, Input, Typography } from "antd";
import React, { useState } from "react";
import AppModal from "../../../AppModal";
import AppQrCode from "../../../AppQrCode";
import FormField from "../../../FormField";

const AddAudienceModal = ({ isVisible, setVisible }) => {
  const [isChecked, setChecked] = useState(false);
  const [iconShow, setIconShow] = useState(false);
  const [isshowQrShowing, setQrShowShowing] = useState(false);

  const AudienceQrScreen = () => {
    return (
      <div className="assignTeamModal">
        <Typography.Title level={4}>Invite audience to Round 02</Typography.Title>
        <div className="qrCodeBox">
          <AppQrCode />
        </div>
        <div className="qrCodeInfo">
          <Typography.Text className="qrCodeInfoText">Scan QR Code</Typography.Text>

          <Typography.Text className="qrCodeInfoText or">Or</Typography.Text>

          <Typography.Text className="qrCodeInfoText">
            {" "}
            <LinkOutlined /> Invite via Link
          </Typography.Text>
        </div>
        <div className="invitelinkField">
          <FormField
            type="text"
            defaultValue={"ashis@slamitt.com"}
            readOnly={true}
            suffix={<Button icon={<CopyOutlined />} type="ghost" />}
          />
        </div>
      </div>
    );
  };

  const AudienceSetupScreen = () => {
    return (
      <div className="audienceTeamModal">
        <Image
          preview={false}
          width={150}
          height={150}
          alt="thumbnail"
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
        <Typography.Title level={3}>Setup Audience Engagement</Typography.Title>
        <div className="audienceTeamScore">
          <div className="audienceTeamCheckbox">
            <Checkbox onChange={(e) => setChecked(e.target.checked)}>
              Allow audience to score with Points
            </Checkbox>
          </div>
          <div className="audienceTeamScoreStats">
            {isChecked && (
              <>
                <Typography.Text className="audienceTeamScoreStatsTitle">Audience Score Weightage</Typography.Text>
                <div className="audienceTeamScoreInput">
                  <Input
                    className="inputstyle"
                    type={"number"}
                    placeholder={"100%"}
                    onChange={(e) => setIconShow(Boolean(e.target.value))}
                    bordered={false}
                    min={0}
                    max={100}
                  />
                </div>
                {iconShow && <p className="audiencePercent">%</p>}
              </>
            )}
          </div>
        </div>
        <Button type="primary" onClick={() => setQrShowShowing(true)}>
          Begin Engaging
        </Button>
        <Typography.Text className="audienceInfoText">
          This will make the judgement criterias public
        </Typography.Text>
      </div>
    );
  };
  return (
    <div>
      <AppModal
        isVisible={isVisible}
        onOk={() => setVisible(false)}
        onCancel={() => {
          setVisible(false);
        }}
      >
        {isshowQrShowing ? <AudienceQrScreen /> : <AudienceSetupScreen />}
      </AppModal>
    </div>
  );
};

export default AddAudienceModal;
