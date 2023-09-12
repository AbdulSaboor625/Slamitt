import {
  selectHMSMessages,
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { SettingFilled } from "@ant-design/icons";
import { Layout, Tabs, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addGroupChat,
  addOrganiserChat,
  getAllCompetitionsOrganized,
  getAllCompetitionsParticipated,
  getCategoryAndSubCategory,
  getChat,
  getChatToken,
  getCompetitionParticipatedByCompetitionCode,
  getParticipantContainer,
  makeUserAdminFromContainer,
  notify,
  persitCompetition,
  removeUserFromContainer,
  setContainerSelectedChat,
} from "../../../../Redux/Actions";
import Api from "../../../../services";
import ParticipantChatSider from "../../../ParticipantChatSider";
import ChatsSection from "../../competitonsModule/Chats";
import SettingsSection from "../../competitonsModule/settingsSection";
import CompetitionSection from "../../dashboardModule/competitionSection";

const ParticipantsV1 = ({ pusher }) => {
  const router = useRouter();
  const [activeTabKey, setActiveTabKey] = useState("1");

  const { content = "" } = router.query;

  const [scoresList, setScoresList] = useState([]);

  const dispatch = useDispatch();
  const hmsActions = useHMSActions();

  const competition = useSelector((state) => state.competition);
  const container = useSelector((state) => state.containers);
  const chatState = useSelector((state) => state.chat);
  const user = useSelector((state) => state.auth.user);
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const storeMessages = useHMSStore(selectHMSMessages);

  const contentTabs = {
    1: "DASHBOARD",
    2: "CHAT",
    3: "SETTINGS",
  };

  useEffect(() => {
    if (content.toUpperCase() === "DASHBOARD") setActiveTabKey("1");
    else if (content.toUpperCase() === "CHAT") setActiveTabKey("2");
    else if (content.toUpperCase() === "SETTINGS") setActiveTabKey("3");
  }, [content]);

  useEffect(() => {
    if (!router.query.data) return;
    const [competitionCode] = router.query.data;
    if (competitionCode) {
      dispatch(
        getCompetitionParticipatedByCompetitionCode({
          competitionCode,
          callApi: true,
        })
      );
      dispatch(getParticipantContainer(competitionCode));
      dispatch(
        persitCompetition({
          competitionCode,
          organized: false,
          email: user?.email,
        })
      );
      dispatch(getCategoryAndSubCategory());
    }
  }, [router.query]);

  useEffect(() => {
    if (!router.query.data) return;
    const [competitionCode] = router.query.data;

    if (competitionCode) fetchCompetitionScores(competitionCode);
  }, [router.query, competition.round.details]);

  useEffect(() => {
    dispatch(getAllCompetitionsParticipated());
    dispatch(getAllCompetitionsOrganized());
  }, []);

  useEffect(() => {
    if (
      competition &&
      competition.current &&
      competition.current.competitionCode
    ) {
      const competitionCode = competition.current.competitionCode;
      const channel = pusher.subscribe(competitionCode);
      console.log("channel", channel);

      channel.bind("receive_message", (payload) => {
        console.log("payload", payload);
        if (payload.event === socketEvents.update_competition_setting)
          dispatch(
            getCompetitionParticipatedByCompetitionCode({
              competitionCode,
              callApi: true,
            })
          );
        else if (payload.event === socketEvents.container_fetch_score) {
          fetchCompetitionScores(competitionCode);
          dispatch(
            getCompetitionParticipatedByCompetitionCode({
              competitionCode,
              callApi: true,
            })
          );
        } else if (payload.event === socketEvents.weightage_change) {
          fetchCompetitionScores(competitionCode);
        }
      });

      if (container && container.current && container.current.containerCode) {
        const containerCode = container.current.containerCode;
        const channel = pusher.subscribe(containerCode);
        console.log("channel", channel);

        channel.bind("receive_message", (payload) => {
          console.log("payload", payload);
          if (payload.event === socketEvents.room_containers_update)
            dispatch(
              getCompetitionParticipatedByCompetitionCode({
                competitionCode,
                callApi: true,
              })
            );
          else if (payload.event === socketEvents.participant_invitation) {
            if (
              user &&
              payload.userCodes &&
              payload.userCodes.length &&
              payload.userCodes.find((userCode) => userCode === user.userCode)
            ) {
              dispatch(
                notify({
                  type: "error",
                  message: `${
                    payload.isAdmin ? "Team Leader" : "Organiser"
                  } has removed you from this competition`,
                })
              );
            } else {
              dispatch(
                getCompetitionParticipatedByCompetitionCode({
                  competitionCode,
                  callApi: true,
                })
              );
            }
          }
        });
      }
    }
  }, [
    competition && competition.current && competition.current.competitionCode,
    container && container.current && container.current.containerCode,
  ]);

  // TODO: Fix notification issue assignee:Vaibhab
  useEffect(() => {
    let role = "";
    if (window.location.pathname.includes("/o/")) role = "organizer";
    else if (window.location.pathname.includes("/c/")) role = "crew";
    else if (window.location.pathname.includes("/p/")) role = "participant";
    // if (chatState.container.containerCode || chatState.container.roomCode) {
    dispatch(getChatToken(role));
    dispatch(getChat(chatState.container));

    // }
  }, [chatState.container.containerCode || chatState.container.roomCode]);

  useEffect(() => {
    if (chatState.token) {
      if (isConnected) {
        hmsActions.leave().then((r) =>
          hmsActions.join({
            userName: user.userCode,
            authToken: chatState.token,
            settings: {
              isAudioMuted: true,
            },
          })
        );
      } else {
        hmsActions.join({
          userName: user.userCode,
          authToken: chatState.token,
          settings: {
            isAudioMuted: true,
          },
        });
      }
    }
  }, [chatState.token]);

  const addChat = (payload) => {
    if (chatState.container?.roomCode) dispatch(addGroupChat(payload));
    else dispatch(addOrganiserChat(payload));

    hmsActions.sendBroadcastMessage(JSON.stringify(payload));
  };

  const onChatSelectContainer = (container, isGroupChat) => {
    dispatch(setContainerSelectedChat(container, isGroupChat));
  };

  const fetchCompetitionScores = async (competitionCode) => {
    try {
      const response = await Api.get(`/container/scores/${competitionCode}`);
      if (response.code && response.result) {
        // const allScores = response?.result;
        // allScores.sort((a, b) => parseInt(b?.scores) - parseInt(a?.scores));
        setScoresList(response?.result);
        return;
      }
      throw new Error(response.message);
    } catch (error) {
      dispatch(notify({ message: error.message, type: "error" }));
    }
  };

  const _makeAdmin = (containerCode, email) => {
    dispatch(makeUserAdminFromContainer(containerCode, email));
  };

  const _removeUser = (containerCode, email) => {
    dispatch(removeUserFromContainer(containerCode, email));
  };

  const isAdmin = container.current?.users?.find(
    (u) => u?.isAdmin && u?.userCode === user?.userCode
  );
  return (
    <div className="participantsDashboard">
      <Typography.Text className="participantsDashboardOptionText">
        🏆 <strong>{competition?.current?.competitionName}</strong> |{" "}
        {competition?.current?.category?.categoryName}
      </Typography.Text>

      {competition.current?.competitionType === "SOLO" && (
        <Tabs
          defaultActiveKey="1"
          activeKey={activeTabKey}
          className="competitionTabset soloTabset"
          onChange={(e) => {
            setActiveTabKey(e.key);
            router.push(
              `/auth/competitions/p/${
                router.query.data[0]
              }?content=${contentTabs[e].toLowerCase()}`
            );
          }}
        >
          <Tabs.TabPane tab="Dashboard" key="1">
            <CompetitionSection
              isAdmin={isAdmin}
              round={competition.round.details}
              allRounds={competition.allRounds}
              scores={scoresList}
              competition={competition.current}
              container={container.current}
              setActiveTabKey={setActiveTabKey}
              fetchCompetitionScores={fetchCompetitionScores}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Chats" key="2">
            <Layout className="chatsLayoutContainer">
              <Layout.Sider className="competitionSidebar">
                <ParticipantChatSider
                  {...chatState}
                  onChatSelectContainer={onChatSelectContainer}
                />
              </Layout.Sider>
              <Layout.Content className="competitionContent">
                {chatState.container &&
                (chatState.container.containerCode ||
                  chatState.container.roomCode) ? (
                  <ChatsSection
                    addChat={addChat}
                    container={chatState.container}
                    chat={chatState.chat}
                    storeMessages={storeMessages}
                  />
                ) : (
                  <Typography className="competitionPlaceholderText">
                    Select a chat to view its threads
                  </Typography>
                )}
              </Layout.Content>
            </Layout>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<SettingFilled />} key="3" className="gas">
            <SettingsSection
              container={container.current}
              isAdmin={isAdmin}
              makeAdmin={_makeAdmin}
              removeUser={_removeUser}
              competition={competition.current}
            />
          </Tabs.TabPane>
        </Tabs>
      )}

      {competition.current?.competitionType === "TEAM" && (
        <Tabs
          defaultActiveKey="1"
          activeKey={activeTabKey}
          className="competitionTabset"
          onChange={(e) => {
            setActiveTabKey(e.key);
            router.push(
              `/auth/competitions/p/${
                router.query.data[0]
              }?content=${contentTabs[e].toLowerCase()}`
            );
          }}
        >
          <Tabs.TabPane tab="Dashboard" key="1">
            <CompetitionSection
              isAdmin={isAdmin}
              round={competition.round.details}
              allRounds={competition.allRounds}
              scores={scoresList}
              competition={competition.current}
              container={container.current}
              setActiveTabKey={setActiveTabKey}
              fetchCompetitionScores={fetchCompetitionScores}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Chats" key="2">
            <Layout className="chatsLayoutContainer">
              <Layout.Sider className="competitionSidebar">
                <ParticipantChatSider
                  {...chatState}
                  onChatSelectContainer={onChatSelectContainer}
                />
              </Layout.Sider>
              <Layout.Content className="competitionContent">
                {chatState.container &&
                (chatState.container.containerCode ||
                  chatState.container.roomCode) ? (
                  <ChatsSection
                    addChat={addChat}
                    container={chatState.container}
                    chat={chatState.chat}
                    storeMessages={storeMessages}
                  />
                ) : (
                  <Typography className="competitionPlaceholderText">
                    Select a chat to view its threads
                  </Typography>
                )}
              </Layout.Content>
            </Layout>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<SettingFilled />} key="3" className="gas">
            <SettingsSection
              container={container.current}
              isAdmin={isAdmin}
              makeAdmin={_makeAdmin}
              removeUser={_removeUser}
              competition={competition.current}
            />
          </Tabs.TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default ParticipantsV1;
