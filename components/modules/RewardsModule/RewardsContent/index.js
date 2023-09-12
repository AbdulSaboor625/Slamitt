import { useRouter } from "next/router";
import React from "react";
import RewardsEditor from "../RewardsEditor";
import RewardContentHeader from "../RewardContentHeader";
import RewardContentSection from "../RewardContentSection";
import { useState } from "react";
import SlamittMedals from "../SlamittMedals";
import SlamittPrizes from "../SlamittPrizes";

const ScreenContent = ({
  reward,
  setReward,
  screen,
  placementData,
  purchaseHistory,
  competition,
}) => {
  switch (screen) {
    case "SLAMCOIN":
      return (
        <>
          <div className="attractParticipantsBlock">
            <RewardContentHeader />
          </div>
          <div className="slamCoinStatsContent">
            <RewardContentSection
              reward={reward}
              setReward={setReward}
              placementData={placementData}
              purchaseHistory={purchaseHistory}
              competition={competition}
            />
          </div>
        </>
      );
    case "SLAMREWARD":
      return (
        <SlamittPrizes
          reward={reward}
          setReward={setReward}
          placementData={placementData}
        />
      );
    case "SLAMTROPHY":
      return (
        <SlamittMedals
          reward={reward}
          setReward={setReward}
          placementData={placementData}
        />
      );
    default:
      return <></>;
  }
};

const RewardsContent = ({
  screen,
  placementData,
  purchaseHistory,
  competition,
  reward,
  setReward,
}) => {
  const router = useRouter();
  const { query } = router;

  return (
    <div className="certificatesEditorBlock">
      <div className="certificatesEditorSidebar rewardsEditorSidebar">
        <RewardsEditor
          reward={reward}
          setReward={setReward}
          screen={screen}
          purchaseHistory={purchaseHistory}
          competition={competition}
        />
      </div>
      <div className="certificatesEditorContent">
        <ScreenContent
          reward={reward}
          setReward={setReward}
          screen={screen}
          placementData={placementData}
          purchaseHistory={purchaseHistory}
          competition={competition}
        />
      </div>
    </div>
  );
};

export default RewardsContent;
