import React from "react";
import {
  RewardCoinImg,
  RewardIcon,
  TrophyIcons,
  GiftIcon,
  TrophyIcon
} from "../../../../utility/iconsLibrary";
const RewardsSideBar = ({ setScreen, screen }) => {
  return (
    <ul className="certificatesSidebarButtons">
      <li>
        <span
          className={screen == "SLAMCOIN" ? "active" : "disable"}
          onClick={() => setScreen("SLAMCOIN")}
        >
          <RewardCoinImg />
          <span className="visibleTabletMobile"></span>
        </span>
      </li>
      <li>
        <span
          className={screen == "SLAMREWARD" ? "active" : "disable"}
          onClick={() => setScreen("SLAMREWARD")}
        >
          <GiftIcon />
          <span className="visibleTabletMobile"></span>
        </span>
      </li>
      <li>
        <span
          className={screen == "SLAMTROPHY" ? "active" : "disable"}
          onClick={() => setScreen("SLAMTROPHY")}
        >
          <TrophyIcon />
          <span className="visibleTabletMobile"></span>
        </span>
      </li>
    </ul>
  );
};

export default RewardsSideBar;
