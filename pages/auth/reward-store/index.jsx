import { useState } from "react";
import AppPageHeader from "../../../components/AppPageHeader";
import BrandingFooter from "../../../components/modules/profileModule/brandingFooter";
import StoreModule from "../../../components/modules/RewardsModule/StoreModule";
import withAuth from "../../../components/RouteAuthHandler/withAuth";

const RewardStore = ({ pusher }) => {
  const [isLaunchCompetitionModalOpen, setIsLaunchCompetitionModalOpen] =
    useState(false);
  const [activeTab, setActiveTab] = useState(1);
  return (
    <div>
      <AppPageHeader
        isLaunchCompetitionModalOpen={isLaunchCompetitionModalOpen}
        setIsLaunchCompetitionModalOpen={setIsLaunchCompetitionModalOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        rewardStore={true}
      />
      <div> {activeTab == 3 && <StoreModule pusher={pusher} />}</div>
      <BrandingFooter />
    </div>
  );
};

export default withAuth(RewardStore);
