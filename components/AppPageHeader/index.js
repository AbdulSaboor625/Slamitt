import { Avatar, Button, PageHeader, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUserDetails } from "../../Redux/Actions";
import { competitionsListDummy, routes } from "../../utility/config";
import {
  ArrowDownSmallSVGIcon,
  LogoutIcon,
  MyAccountIcon,
  ProfileIcon,
  CartIcon,
} from "../../utility/iconsLibrary";
import { defaultUserAvatar, slamittLogoSmall } from "../../utility/imageConfig";
import AppCompetitionsPopover from "../AppCompetitionsPopover";
import AppDropDown from "../AppDropdown";
import CreateCompetitionModal from "../AppModal/createCompetitionModal";
import CreateLeaderboardModal from "../AppModal/createLeaderboardModal";
import StoreModule from "../modules/RewardsModule/StoreModule";

const AppPageHeader = ({
  participantSection = false,
  isLaunchCompetitionModalOpen = false,
  setIsLaunchCompetitionModalOpen = false,
  setActiveTab,
  activeTab,
  rewardStore = false,
}) => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.auth.user);
  const [isVisible, setVisible] = useState(false);
  const [isPopVisible, setIsPopVisible] = useState(false);
  const [leaderBoardIsVisible, setLeaderboardVisible] = useState(false);
  const [isSecondPhaseVisible, setSecondPhaseVisible] = useState(false);

  const updateUser = (payload) => {
    dispatch(updateUserDetails(payload));
  };

  useEffect(() => {
    if (setIsLaunchCompetitionModalOpen) {
      if (isVisible != isLaunchCompetitionModalOpen) {
        setIsLaunchCompetitionModalOpen(isVisible);
      }
    }
  }, [isVisible]);

  const dropdownMenu = [
    {
      label: "Profile",
      value: "profile",
      icon: <ProfileIcon />,
    },
    {
      label: "My Account",
      value: "myAccount",
      icon: <MyAccountIcon />,
    },
    {
      label: "Logout",
      value: "logout",
      icon: <LogoutIcon />,
    },
  ];

  return (
    <>
      <PageHeader
        className={`site-page-header dashboardHeader ${
          rewardStore && "rewardsPageHeader"
        }`}
        avatar={{
          src: slamittLogoSmall,
        }}
        extra={[
          // <Button
          //   key="1"
          //   className="btnSmallRadius"
          //   type="primary"
          //   shape="round"
          //   onClick={() => setVisible(true)}
          // >
          //   Launch Competition
          // </Button>,

          //Reward Store Header

          rewardStore && (
            <div className="rewardsPageHeaderContent">
              <Tabs
                className=""
                defaultActiveKey={activeTab}
                onChange={(e) => setActiveTab(e)}
              >
                <Tabs.TabPane tab="Organise" key="1">
                  <div />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Compete" key="2">
                  <div />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Reward Store" key="3">
                  {/* <StoreModule /> */}
                </Tabs.TabPane>
              </Tabs>
              {/* <Button className="cartButton">
                <CartIcon /> Cart
              </Button> */}
            </div>
          ),

          <Button
            onClick={() => {
              // if (!participantSection)
            }}
            className="userLoggedinDropdownButton"
            key="2"
            type="link"
          >
            {/* {participantSection ? (
              <AppCustomPicker
                imgStyle={{ height: "3rem", width: "3rem", cursor: "pointer" }}
                emojiStyle={{ fontSize: "2.3rem", cursor: "pointer" }}
                className="tabset"
                popOverClass="m-5"
                tabpaneClass="m-5"
                onImageSelected={(image) =>
                  updateUser({
                    imageURL: image.url,
                    emojiObject: image.emoji,
                  })
                }
                defaultValue={{
                  type: userState?.imageURL ? "LINK" : "EMOJI",
                  url: userState?.imageURL || "",
                  emoji: userState?.emojiObject || "",
                }}
                showClearButton={false}
              />
            ) : ( */}
            <Avatar
              src={
                userState && userState.imageURL
                  ? userState.imageURL
                  : defaultUserAvatar
              }
            />
            {/* )} */}
          </Button>,
          <AppDropDown
            key={"3"}
            iconShow={true}
            menu={dropdownMenu}
            onClick={(e) => {
              const select = dropdownMenu[e.key];
              if (select.value === "logout") {
                dispatch(logout());
                window.location.href = routes.login;
              } else if (select.value === "profile")
                window.location.href = `${routes.profile}/${userState?.userCode}`;
              else
                window.location.href = `${routes.accountInfo}/${userState?.userCode}`;
            }}
          />,
          // <Button
          //   className="userLoggedinDropdownText"
          //   key="3"
          //   type="text"
          //   onClick={() => {
          //     dispatch(logout());
          //     window.location.href = routes.register;
          //   }}
          // >
          //   Logout
          // </Button>,
        ]}
        tags={
          !rewardStore && [
            <AppCompetitionsPopover
              leaderBoardIsVisible={leaderBoardIsVisible}
              key={1}
              data={competitionsListDummy}
              className="m-5"
              setLeaderboardVisible={setLeaderboardVisible}
              setVisible={setVisible}
              setIsPopVisible={setIsPopVisible}
              isPopVisible={isPopVisible}
            >
              <Button
                className="dashboardLink"
                type="text"
                onClick={() => setIsPopVisible(true)}
              >
                Dashboard <ArrowDownSmallSVGIcon />{" "}
              </Button>
            </AppCompetitionsPopover>,
          ]
        }
      />
      <CreateCompetitionModal
        isVisible={isVisible}
        setVisible={setVisible}
        isSecondPhaseVisible={isSecondPhaseVisible}
        setSecondPhaseVisible={setSecondPhaseVisible}
      />
      <CreateLeaderboardModal
        isVisible={leaderBoardIsVisible}
        setVisible={setLeaderboardVisible}
        setIsLaunchCompetitionModalOpen={setVisible}
      />
    </>
  );
};

export default AppPageHeader;
