import { Layout } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  AppPageHeader,
  AppSider,
  ContentSection,
} from "../../../../components";
import withAuth from "../../../../components/RouteAuthHandler/withAuth";

import {
  clearCompetitionState,
  clearPersistConfig,
  getAllCompetitionsOrganized,
  getAllCompetitionsParticipated,
  getAllRooms,
  getAllRoomsChat,
  getAllRounds,
  getCategoryAndSubCategory,
  getCompetitionByCompetitionCode,
  getSingleRound,
  notify,
  persitCompetition,
  updateUser,
} from "../../../../Redux/Actions";
import Api from "../../../../services";
import { getPresenceChannelName } from "../../../../utility/common";
import { routes } from "../../../../utility/config";

const Competitions = ({ pusher }) => {
  const router = useRouter();

  const {
    competitionCode,
    email,
    crewStatus,
    content = "",
    compRoundCode = "",
    tab,
  } = router.query;
  const [activeTabKey, setActiveTabKey] = useState(6);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isLaunchCompetitionModalOpen, setIsLaunchCompetitionModalOpen] =
    useState(false);

  const [readOnlyState, setReadOnlyState] = useState(false);
  const [isVisibleTeamSizeModal, setVisibiltyTeamSizeModal] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const state = useSelector((state) => state);
  const [certificate, setCertificate] = useState(null);
  const [placementsData, setPlacementsData] = useState(null);

  const contentTabs = {
    1: "CONTAINERS",
    2: "CHAT",
    3: "ROUND",
    4: "SETTINGS",
    5: "LEADERBOARD",
    6: "REGISTRATION",
  };
  const dispatch = useDispatch();
  const competition = useSelector((state) => state.competition.current);

  // const [firstRender, setFirsRender] = useState(false);
  // const [views, setViews] = useState(0);

  // useEffect(() => {
  //   const countView = async () => {
  //     const res = await Api.get(
  //       `/competition/${competition?.competitionCode}/registration-views`
  //     );
  //     console.log("res", res.result);
  //     setViews(res.result.registrationViews);
  //     setFirsRender(true);
  //   };

  //   if (competition && !firstRender) countView();
  // }, [competition]);

  const handleActiveTab = async () => {
    if (content.toUpperCase() === "CONTAINERS") setActiveTabKey(1);
    else if (content.toUpperCase() === "CHAT") setActiveTabKey(2);
    else if (content.toUpperCase() === "ROUND") {
      setActiveTabKey(3);
      if (compRoundCode) {
        try {
          const response = await Api.get(`/round/code/${compRoundCode}`);
          if (response?.result && response?.code) {
            const oldRound = response.result;
            dispatch(getSingleRound(oldRound));
            setDetailsOpen(true);
          }
        } catch (err) {
          console.log(err);
        }
      }
    } else if (content.toUpperCase() === "SETTINGS") setActiveTabKey(4);
    else if (content.toUpperCase() === "LEADERBOARD") setActiveTabKey(5);
    else if (content.toUpperCase() === "REGISTRATION") setActiveTabKey(6);
  };

  useEffect(() => {
    handleActiveTab();
  }, [content, compRoundCode]);

  useEffect(() => {
    if (competitionCode) {
      dispatch(
        getCompetitionByCompetitionCode({
          competitionCode: competitionCode,
          crew: router.query?.crew || false,
        })
      );
      dispatch(getAllRooms(competitionCode));
      dispatch(getAllRoomsChat(competitionCode));
      dispatch(
        getAllRounds({
          cCode: competitionCode,
          initial: compRoundCode ? false : true,
        })
      );
    }
  }, [competitionCode]);

  useEffect(() => {
    dispatch(getCategoryAndSubCategory());
    dispatch(getAllCompetitionsParticipated());
    dispatch(getAllCompetitionsOrganized());
  }, []);

  let crew = competition?.crew?.find((crw) => crw.userCode === user.userCode);

  if (crew) {
    const channel = pusher.subscribe(getPresenceChannelName(competitionCode));
    channel.bind("receive_message", ({ event }) => {
      switch (event) {
        case "CREW_STATUS_UPDATE":
          //set current competition
          dispatch(
            getCompetitionByCompetitionCode({
              competitionCode: competitionCode,
              crew: router.query?.crew || false,
            })
          );
      }
    });
  }

  useEffect(() => {
    if (competition) {
      let crew = competition.crew.find((crw) => crw.email === user.email);
      if (user.userCode === competition.createdBy || crew) {
        if (crew) {
          dispatch(updateUser({ user: { ...user, role: "CREW" } }));
        } else if (user.userCode === competition.createdBy)
          dispatch(updateUser({ user: { ...user, role: "ORGANIZER" } }));

        dispatch(
          persitCompetition({
            competitionCode,
            organized: true,
            createdBy: competition.createdBy,
            email: user?.email,
          })
        );
        if (competition.status !== "ACTIVE") setReadOnlyState(true);
      } else {
        dispatch(
          notify({
            message: "You are not authorized to access this competition",
            type: "error",
          })
        );
        router.replace(routes.dashboard);

        dispatch(clearPersistConfig());
        dispatch(clearCompetitionState());
        return;
      }
    }
  }, [competition]);

  const qualifiedContainers = useSelector(
    (state) => state.containers.qualified
  );

  useEffect(() => {
    if (competitionCode) {
      const getCertificate = async () => {
        const cert = await Api.get(`/certificate/${competitionCode}`);
        if (cert?.result && cert?.code) {
          const newPlacements = cert?.result?.competition?.placements?.map(
            (plc, i) => {
              const containers = qualifiedContainers?.filter((c) =>
                plc?.containerCodes?.includes(c.containerCode)
              );
              plc.containers = containers;
              return plc;
            }
          );
          cert.result.competition.placements = newPlacements;
          setCertificate(cert?.result);
          // setLoading(false);
        }
      };

      getCertificate();
    }
  }, [competitionCode, qualifiedContainers]);

  useEffect(() => {
    if (competitionCode) {
      const getPlacementsData = async () => {
        try {
          const resp = await Api.get(`/placements/${competitionCode}`);
          if (resp.code && resp.result) {
            setPlacementsData(resp.result);
          }
        } catch (error) {
          throw new Error(error);
        }
      };

      getPlacementsData();
    }
  }, [competitionCode]);

  return (
    <Layout>
      <Layout.Header>
        <AppPageHeader
          isLaunchCompetitionModalOpen={isLaunchCompetitionModalOpen}
          setIsLaunchCompetitionModalOpen={setIsLaunchCompetitionModalOpen}
        />
      </Layout.Header>
      <Layout className="competitionTabsetParent">
        <Layout.Sider
          className={`competitionSidebar ${
            detailsOpen || activeTabKey == "5" || activeTabKey == "6"
              ? "hidden"
              : "block"
          } ${
            activeTabKey == "5" || activeTabKey == "6" ? "" : "tablet:block"
          }`}
        >
          <AppSider
            readOnlyState={readOnlyState}
            isLaunchCompetitionModalOpen={isLaunchCompetitionModalOpen}
            detailsOpen={detailsOpen}
            setDetailsOpen={setDetailsOpen}
            pusher={pusher}
            activeContentTab={contentTabs[activeTabKey]}
            redirectToRound={() => setActiveTabKey(3)}
            redirectToSettings={() => setActiveTabKey(4)}
            isVisibleTeamSizeModal={isVisibleTeamSizeModal}
            setVisibiltyTeamSizeModal={setVisibiltyTeamSizeModal}
          />
        </Layout.Sider>
        <Layout.Content className={`competitionContent`}>
          <ContentSection
            readOnlyState={readOnlyState}
            pusher={pusher}
            detailsOpen={detailsOpen}
            setDetailsOpen={setDetailsOpen}
            onChangeTab={(e) => {
              setActiveTabKey(e);
              setDetailsOpen(false);
              router.push(
                `/auth/competitions/o/${competitionCode}?content=${contentTabs[
                  e
                ]?.toLowerCase()}`
              );
            }}
            activeTabKey={activeTabKey}
            setActiveTabKey={setActiveTabKey}
            activeContentTab={contentTabs[activeTabKey]}
            isVisibleTeamSizeModal={isVisibleTeamSizeModal}
            setVisibiltyTeamSizeModal={setVisibiltyTeamSizeModal}
            certificate={certificate}
            placementsData={placementsData}
            setPlacementsData={(e) => setPlacementsData(e)}
          />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default withAuth(Competitions);
