import { Button, Image, Layout, Typography } from "antd";
import { useState } from "react";
import { dashboardEmptyPlaceholder } from "../../../utility/imageConfig";
import CreateCompetitionModal from "../../AppModal/createCompetitionModal";
import AppPageHeader from "../../AppPageHeader";

const DashBoardModule = () => {
  const [isVisible, setVisible] = useState(false);
  const [isSecondPhaseVisible, setSecondPhaseVisible] = useState(false);
  const EmptySection = () => {
    return (
      <div className="dashboardContentArea">
        <div className="dashboardPlaceHolder">
          <Image
            className="dashboardContentImage"
            preview={false}
            src={dashboardEmptyPlaceholder}
            layout="fill"
            alt="img"
            style={{ height: "20rem", width: "20rem" }}
          />

          <Typography.Text className="textBegin">
            Begin Creating a Competition
          </Typography.Text>

          <Button
            className="btnSmallRadius"
            type="primary"
            shape="round"
            onClick={() => setVisible(true)}
          >
            Launch Competition
          </Button>
          <div className="mobileDemoBlock">
            <span className="mobileDemoBlockTitle">New to Slamitt?</span>
            <div className="mobileDemoBlockButton">
              <button className="ant-btn ant-btn-secondary mobileDemoBlockButton">Schedule a demo</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <Layout.Header>
        <AppPageHeader />
      </Layout.Header>
      <Layout.Content>
        <EmptySection />
      </Layout.Content>
      <CreateCompetitionModal
        isVisible={isVisible}
        setVisible={setVisible}
        isSecondPhaseVisible={isSecondPhaseVisible}
        setSecondPhaseVisible={setSecondPhaseVisible}
      />
    </Layout>
  );
};

export default DashBoardModule;
