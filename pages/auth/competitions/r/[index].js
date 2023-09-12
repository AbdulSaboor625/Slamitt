import { Button, Layout, Typography } from "antd";
import { AppPageHeader } from "../../../../components";
import { useEffect, useState } from "react";
import RewardsSideBar from "../../../../components/modules/RewardsModule/RewardsSidebar";
import RewardsContent from "../../../../components/modules/RewardsModule/RewardsContent";
import {
  ArrowBackIcon,
  CrossThickIcon,
  ReloadIcon,
  TickIcon,
  TickThickIcon,
} from "../../../../utility/iconsLibrary";
import BrandingFooter from "../../../../components/modules/profileModule/brandingFooter";
import { useRouter } from "next/router";
import Api from "../../../../services";
import { useDispatch, useSelector } from "react-redux";
import {
  getCompetitionByCompetitionCode,
  notify,
} from "../../../../Redux/Actions";
import withAuth from "../../../../components/RouteAuthHandler/withAuth";
import { socketEvents } from "../../../../utility/config";

const Reward = ({ pusher }) => {
  const user = useSelector((state) => state.auth.user);
  const competition = useSelector((state) => state?.competition?.current);
  const [screen, setScreen] = useState("SLAMCOIN");
  const [placements, setPlacements] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [reward, setReward] = useState();
  const router = useRouter();

  const dispatch = useDispatch();
  useEffect(() => {
    if (router?.query?.index) {
      dispatch(
        getCompetitionByCompetitionCode({
          competitionCode: router?.query?.index,
        })
      );
    }
  }, [router]);

  const getPlacement = async (competitionCode) => {
    const res = await Api.get(`/placements/${competitionCode}`);
    if (res?.code && !!res?.result?.places?.length) {
      setPlacements(res?.result?.places);
      setReward((prev) => ({
        ...prev,
        prizes: res?.result?.prizes,
        medals: res?.result?.medals,
        trophies: res?.result?.trophies,
      }));
    } else {
      setPlacements([
        {
          containerCodes: [],
          isLocked: false,
          label: "1st Place",
          type: "placement",
        },
      ]);
    }
  };
  useEffect(() => {
    if (competition?.status === "CONCLUDED") {
      dispatch(
        notify({ type: "info", message: "This competition has been Concluded" })
      );
      router.push("/auth/dashboard");
    }
    if (competition?.competitionCode) {
      getPlacement(competition?.competitionCode);
    }
    if (competition?.slamCoins) {
      setReward((prev) => ({
        ...prev,
        excludePlacements: competition?.slamCoins?.excludePlacements,
      }));
    }
  }, [competition]);

  const getPurchaseHistory = async (competitionCode) => {
    const res = await Api.get(`/slamCoin/purchaseHistory/${competitionCode}`);
    if (res?.code && res?.result) {
      setPurchaseHistory(res?.result);
    }
  };

  useEffect(() => {
    if (competition?.competitionCode) {
      const channel = pusher.subscribe(competition?.competitionCode);

      channel.bind("receive_message", (payload) => {
        if (payload.event === socketEvents.UPDATE_SLAM_COINS) {
          getPurchaseHistory(competition?.competitionCode);
          dispatch(
            getCompetitionByCompetitionCode({
              competitionCode: competition?.competitionCode,
            })
          );
        } else if (payload?.event === socketEvents.PLACEMENTS_UPDATED) {
          getPlacement(competition?.competitionCode);
        }
      });
    }
  }, [competition]);

  useEffect(() => {
    if (competition?.competitionCode) {
      getPurchaseHistory(competition?.competitionCode);
    }
  }, [competition]);

  const rewardSave = async () => {
    setLoading(true);
    const arr1 = reward?.mentionsPrizes || [];
    const arr2 = reward?.mentionsTrophies || [];

    const mergedMentions = arr1?.map((item) => ({
      ...item,
      trophiesAndMedals:
        arr2?.find((inner) => item?._id === inner?._id)?.trophiesAndMedals ||
        [],
    }));
    if (screen === "SLAMCOIN") {
      const res = await Api.post("/slamCoin/distribution", {
        competitionCode: competition?.competitionCode,
        placements: reward?.placements || competition?.slamCoins?.placements,
        participants:
          reward?.participants || competition?.slamCoins?.participants,
        excludePlacements: reward?.excludePlacements,
      });
      if (res?.code) {
        setLoading(false);
        dispatch(
          notify({
            type: "success",
            message: "Slam Coins have been distributed Successfully",
          })
        );
      }
    } else if (screen === "SLAMREWARD") {
      let places = placements
        ?.filter((item) => item.type === "placement")
        ?.map((item) =>
          item?.label === "1st Place"
            ? {
                ...item,
                trophiesAndMedals: !!reward?.firstPlaceTrophies?.length
                  ? reward?.firstPlaceTrophies
                  : item?.trophiesAndMedals,
                prizes: !!reward?.firstPlacePrizes?.length
                  ? reward?.firstPlacePrizes
                  : item?.prizes,
              }
            : item?.label === "2nd Place"
            ? {
                ...item,
                trophiesAndMedals: !!reward?.secondPlaceTrophies?.length
                  ? reward?.secondPlaceTrophies
                  : item?.trophiesAndMedals,
                prizes: !!reward?.secondPlacePrizes?.length
                  ? reward?.secondPlacePrizes
                  : item?.prizes,
              }
            : item?.label === "3rd Place"
            ? {
                ...item,
                trophiesAndMedals: !!reward?.thirdPlaceTrophies?.length
                  ? reward?.thirdPlaceTrophies
                  : item?.trophiesAndMedals,
                prizes: !!reward?.thirdPlacePrizes?.length
                  ? reward?.thirdPlacePrizes
                  : item?.prizes,
              }
            : item
        );

      const mentionplaces = !!mergedMentions?.length
        ? mergedMentions
        : placements?.filter((item) => item.type !== "placement");
      const payload = {
        places: [...places, ...mentionplaces],
        prizes: reward?.prizes || [],
        trophies: reward?.trophies || [],
        medals: reward?.medals || [],
      };
      const response = await Api?.update(
        `/placements/${competition?.competitionCode}`,
        payload
      );

      if (response.code && response?.result) {
        setReward((prev) => ({
          ...prev,
          prizes: response?.result?.prizes,
          medals: response?.result?.medals,
          trophies: response?.result?.trophies,
        }));
        setPlacements(response?.result?.places);
        setLoading(false);
        dispatch(
          notify({
            type: "success",
            message: "Prizes has been assigned successfully",
          })
        );
      }
    } else {
      let places = placements
        ?.filter((item) => item.type === "placement")
        ?.map((item) =>
          item?.label === "1st Place"
            ? {
                ...item,
                trophiesAndMedals: !!reward?.firstPlaceTrophies?.length
                  ? reward?.firstPlaceTrophies
                  : item?.trophiesAndMedals,
                prizes: !!reward?.firstPlacePrizes?.length
                  ? reward?.firstPlacePrizes
                  : item?.prizes,
              }
            : item?.label === "2nd Place"
            ? {
                ...item,
                trophiesAndMedals: !!reward?.secondPlaceTrophies?.length
                  ? reward?.secondPlaceTrophies
                  : item?.trophiesAndMedals,
                prizes: !!reward?.secondPlacePrizes?.length
                  ? reward?.secondPlacePrizes
                  : item?.prizes,
              }
            : item?.label === "3rd Place"
            ? {
                ...item,
                trophiesAndMedals: !!reward?.thirdPlaceTrophies?.length
                  ? reward?.thirdPlaceTrophies
                  : item?.trophiesAndMedals,
                prizes: !!reward?.thirdPlacePrizes?.length
                  ? reward?.thirdPlacePrizes
                  : item?.prizes,
              }
            : item
        );

      const mentionplaces = !!mergedMentions?.length
        ? mergedMentions
        : placements?.filter((item) => item.type !== "placement");
      const payload = {
        places: [...places, ...mentionplaces],
        prizes: reward?.prizes || [],
        trophies: reward?.trophies || [],
        medals: reward?.medals || [],
      };
      const response = await Api?.update(
        `/placements/${competition?.competitionCode}`,
        payload
      );

      if (response.code && response?.result) {
        setReward((prev) => ({
          ...prev,
          prizes: response?.result?.prizes,
          medals: response?.result?.medals,
          trophies: response?.result?.trophies,
        }));
        setPlacements(response?.result?.places);
        setLoading(false);
        dispatch(
          notify({
            type: "success",
            message: "Trophies and Medals has been assigned successfully",
          })
        );
      }
    }
  };

  return (
    <div className="certificatesPage">
      <Layout>
        {/* <Layout.Header>
          <AppPageHeader />
        </Layout.Header> */}

        <div className="certificatesPageWrapper">
          <div className="certificatesPageHeader">
            <div className="certificatesPageHeaderLeft">
              <Button
                className="certificatesPageBackButton"
                icon={<ArrowBackIcon />}
                onClick={() => window.history.back()}
              />
              <Typography.Title
                level={3}
                className="certificatesPageHeaderTitle"
              >
                Competition Rewards
              </Typography.Title>
            </div>
            <div className="certificatesPageHeaderRight">
              <div className="certificatesPageHeaderButtons">
                <Button
                  className="certificatesPageButton buttonSave"
                  icon={<TickIcon />}
                  onClick={rewardSave}
                >
                  {!isLoading ? (
                    <>
                      {" "}
                      <span className="iconTick visibleTabletMobile">
                        <TickThickIcon />
                      </span>
                      Save
                    </>
                  ) : (
                    <div className="loader-icon" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div className="certificatesPageScroller rewardsPage">
            <div className="certificatesPageContainer">
              <Layout className="certificatesPageHolder">
                <Layout.Sider className="certificatesPageSidebar">
                  <RewardsSideBar setScreen={setScreen} screen={screen} />
                </Layout.Sider>
                <Layout.Content className="certificatesPageContent">
                  <RewardsContent
                    screen={screen}
                    placementData={placements}
                    purchaseHistory={purchaseHistory}
                    competition={competition}
                    reward={reward}
                    setReward={setReward}
                  />
                </Layout.Content>
              </Layout>
            </div>
            <BrandingFooter />
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default withAuth(Reward);
