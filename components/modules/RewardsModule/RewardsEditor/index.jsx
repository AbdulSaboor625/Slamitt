import React, { useState } from "react";

import SlamCoin from "../SlamCoin";
import RewardsCoin from "../RewardCoin";
import TrophyCoin from "../TrophyCoin";

const RewardsEditor = ({
  screen,
  reward,
  setReward,
  purchaseHistory,
  competition,
}) => {
  const onRewardSelection = (prizes) => {
    setReward({
      ...reward,
      prizes,
    });
  };

  const onTrophySelected = (trophies) => {
    setReward({
      ...reward,
      trophies,
    });
  };
  const onMedalSelected = (medals) => {
    setReward({
      ...reward,
      medals,
    });
  };

  switch (screen) {
    case "SLAMCOIN":
      return (
        <SlamCoin
          reward={reward}
          setReward={setReward}
          purchaseHistory={purchaseHistory}
          competition={competition}
        />
      );
    case "SLAMREWARD":
      return (
        <RewardsCoin
          reward={reward}
          setReward={setReward}
          onRewardSelection={onRewardSelection}
        />
      );
    case "SLAMTROPHY":
      return (
        <TrophyCoin
          reward={reward}
          setReward={setReward}
          onTrophySelected={onTrophySelected}
          onMedalSelected={onMedalSelected}
        />
      );
    default:
      return <></>;
  }
};
export default RewardsEditor;
