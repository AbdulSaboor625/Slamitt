import { Button } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { settings } from "../../utility/config";
import {
  BulletIcon,
  CrewSettingsIcon,
  RegistrationIcon,
  RewardSettingsIcon,
  SlamitCertificatesIcon,
  StarSettingsIcon,
} from "../../utility/iconsLibrary";

const SettingsSection = ({ onChangeSettingSection, setDetailsOpen }) => {
  const { active } = useSelector((state) => state.misc.config);
  return (
    <div className="settingsTabsScroller">
      <div className="flex flex-col mainSettingsTabs">
        <Button
          type={active === settings.COMPETITION ? "primary" : "ghost"}
          icon={<StarSettingsIcon />}
          onClick={() => {
            onChangeSettingSection(settings.COMPETITION);
            setDetailsOpen(true);
          }}
        >
          Competition Settings
        </Button>
        <Button
          type={active === settings.REGISTRATION ? "primary" : "ghost"}
          icon={<RegistrationIcon />}
          onClick={() => {
            onChangeSettingSection(settings.REGISTRATION);
            setDetailsOpen(true);
          }}
        >
          Registration Settings
        </Button>
        <Button
          className="crewButton"
          type={active === settings.CREW ? "primary" : "ghost"}
          icon={<CrewSettingsIcon />}
          onClick={() => {
            onChangeSettingSection(settings.CREW);
            setDetailsOpen(true);
          }}
          disabled={false}
        >
          Crew Settings
        </Button>
        <Button
          type={active === settings.SETUP ? "primary" : "ghost"}
          icon={<BulletIcon />}
          onClick={() => {
            onChangeSettingSection(settings.SETUP);
            setDetailsOpen(true);
          }}
          disabled={true}
        >
          Scoring Preferences
        </Button>

        {/* <Button
          type={active === settings.BANK ? "primary" : "ghost"}
          icon={<RewardSettingsIcon />}
          onClick={() => {
            onChangeSettingSection(settings.BANK);
            setDetailsOpen(true);
          }}
          disabled={true}
        >
          Placements & Rewards
        </Button> */}
        <Button
          type={active === settings.CERTIFICATES ? "primary" : "ghost"}
          icon={<RewardSettingsIcon />}
          onClick={() => {
            onChangeSettingSection(settings.CERTIFICATES);
            setDetailsOpen(true);
          }}
          disabled={false}
        >
          {/* Placements & Rewards */}
          Placements & Certificates
        </Button>
      </div>
    </div>
  );
};

export default SettingsSection;
