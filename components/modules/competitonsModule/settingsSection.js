import { FileFilled } from "@ant-design/icons";
import { Button, Image, Layout, Typography } from "antd";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setSettingSectionActive } from "../../../Redux/Actions";
import { settingsParticipated } from "../../../utility/config";
import { MultipleUserIcon } from "../../../utility/iconsLibrary";
import RegistrationSettings from "../dashboardModule/registrationSettings";
import TeamSettings from "../dashboardModule/teamSettings";

const SettingsSection = ({
  container,
  isAdmin,
  makeAdmin,
  removeUser,
  competition,
}) => {
  const dispatch = useDispatch();
  const { active } = useSelector((state) => state.misc.config);

  useEffect(() => {
    dispatch(setSettingSectionActive(settingsParticipated.TEAM));
  }, []);

  const onChangeSettingSection = (section) => {
    dispatch(setSettingSectionActive(section));
  };

  const Sections = () => {
    switch (active) {
      case settingsParticipated.REGISTRATION:
        return <RegistrationSettings />;
      case settingsParticipated.TEAM:
        return (
          <TeamSettings
            users={
              isAdmin
                ? container?.users
                : container?.users.filter((user) => user.isVerified)
            }
            isAdmin={isAdmin}
            makeAdmin={makeAdmin}
            removeUser={removeUser}
            container={container}
            competition={competition}
          />
        );
      default:
        return (
          <div className="competitionPlaceholderBlock">
            <Image
              preview={false}
              width={200}
              height={200}
              alt="thumbnail"
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
            <Typography.Text className="competitionPlaceholderText">
              {" "}
              Settings menu
            </Typography.Text>
          </div>
        );
    }
  };

  return (
    <Layout>
      <Layout.Sider className="competitionSidebar">
        <div className="flex flex-col mainSettingsTabs">
          {/* <Button
            type={
              active === settingsParticipated.REGISTRATION ? "primary" : "ghost"
            }
            icon={<FileFilled />}
            onClick={() =>
              onChangeSettingSection(settingsParticipated.REGISTRATION)
            }
          >
            Registration Overview
          </Button> */}
          <Button
            type={active === settingsParticipated.TEAM ? "primary" : "ghost"}
            icon={<MultipleUserIcon />}
            onClick={() => onChangeSettingSection(settingsParticipated.TEAM)}
          >
            Team Settings
          </Button>
        </div>
      </Layout.Sider>
      <Layout.Content className="competitionContent">
        <Sections />
      </Layout.Content>
    </Layout>
  );
};

export default SettingsSection;
