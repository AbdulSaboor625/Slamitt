import { Button, Image, Popconfirm, Space, Tabs, Typography } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCrewPermissions } from "../../../utility/common";
import { CONTAINER_SCORING_EMPTY_STATE } from "../../../utility/config";
import { singleContainerScores } from "../../../utility/excelService";
import { DeleteIcon, DownloadNewIcon } from "../../../utility/iconsLibrary";
import AppModal from "../../AppModal";
import Submission from "../participantsDashboardModule/v2/submission";
import ConfirmDeleteModal from "./confirmDeleteModal";
import JudgesFeedbackModule from "./judgesFeedbackModule";
import MockRoundFeedbackModule from "./mockRoundFeedbackModule";
import Registration from "./registration";
const StatsTabs = ({
  readOnlyState,
  isVisible,
  setVisible,
  container,
  makeAdmin,
  removeUser,
  competition,
  setToAdmin,
  setMakeAdmin,
  setVisibiltyTeamSizeModal,
  pusher,
}) => {
  const [visibleDeleteAdmin, se6tVisibleDeleteAdmin] = useState(false);
  const [containerScores, setContainerScores] = useState(container);
  const [visible, setIsVisible] = useState(false);
  const { email, role } = useSelector((state) => state.auth.user);
  const permissions = getCrewPermissions(competition?.crew, email);

  const deleteAdmin = (admin) => {
    const allUsers = container.users.filter((user) => user.isAdmin !== true);
    if (allUsers.length != 0) se6tVisibleDeleteAdmin(true);
    else removeUser(container.containerCode, admin.email);
  };
  useEffect(() => {
    let all = [];
    container?.roundData?.forEach((round) => all.push(round));
    container?.mockRoundData?.forEach((round) => {
      round.type = "MOCK";
      all.push(round);
    });
    all.sort((a, b) => {
      return new Date(b?.Round?.createdAt) - new Date(a?.Round?.createdAt);
    });
    setContainerScores(all);
  }, [container]);

  const column = [
    {
      title: "Name",
      render: (user) => {
        return (
          <Typography.Text>
            {user.firstName} {user.lastName}
          </Typography.Text>
        );
      },
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "",
      key: "action",
      render: (user) => (
        <Space className="adminCol" size="middle">
          <Actions user={user} />
        </Space>
      ),
    },
  ];

  const DeleteAdminPopup = ({ admin }) => {
    const allUsers = container.users.filter((user) => user.isAdmin !== true);
    const [selectAdmin, setSelectAdmin] = useState({});
    return (
      <AppModal
        className="teamAdminModal"
        isVisible={visibleDeleteAdmin}
        onCancel={() => {
          se6tVisibleDeleteAdmin(false);
          setSelectAdmin({});
        }}
      >
        <div className="teamAdminModalContent">
          <Typography.Text className="teamAdminModalTitle">
            Assign another team Admin
            <br /> before removing ${admin?.firstName}
          </Typography.Text>
          {allUsers &&
            allUsers.map((user, i) => {
              return (
                <div
                  key={i}
                  onClick={() => {
                    setSelectAdmin(user);
                  }}
                  className={`teamAdminMember ${
                    selectAdmin && selectAdmin?.email === user.email
                      ? "bg-[#6808fe]"
                      : "bg-[#ffffff]"
                  }`}
                >
                  <Typography.Text className="teamAdminTeam">
                    {user.firstName} {user.lastName}
                  </Typography.Text>
                  <Typography.Text className="teamAdminEmail">
                    {user?.email}
                  </Typography.Text>
                </div>
              );
            })}
          <Button
            type="primary"
            onClick={() => {
              removeUser(container.containerCode, admin.email);
              makeAdmin(container.containerCode, selectAdmin.email);
              se6tVisibleDeleteAdmin(false);
            }}
            disabled={!selectAdmin.email}
          >
            Make Admin
          </Button>
        </div>
      </AppModal>
    );
  };

  const Actions = ({ user }) => {
    if (user?.isVerified && user?.isAdmin) {
      return (
        <>
          <Typography.Text className="textUnderline">Admin</Typography.Text>
          {!readOnlyState && (
            <Popconfirm
              okText="Yes"
              okType="button"
              cancelText="No"
              onConfirm={() => deleteAdmin(user)}
              title={`Do you wnat to delete ${user.firstName} from Admin`}
            >
              <Button
                // onClick={() => se6tVisibleDeleteAdmin(true)}
                icon={<DeleteIcon />}
                type="text"
              />
            </Popconfirm>
          )}
          {/* Modal for delete an admin admin */}
          <DeleteAdminPopup admin={user} />
        </>
      );
    }
    if (user?.isVerified && !user?.isAdmin) {
      return readOnlyState ? (
        <></>
      ) : (
        <div>
          <Popconfirm
            title={`Do you wnat to make ${user.firstName} as an Admin`}
            onConfirm={() => makeAdmin(container.containerCode, user.email)}
            // onCancel={cancel}
            okText="Yes"
            okType="button"
            cancelText="No"
          >
            <Button className="textUnderline" type="text">
              Make Admin
            </Button>
          </Popconfirm>
          <Button
            icon={<DeleteIcon />}
            type="text"
            onClick={() => setIsVisible(true)}
          />

          <ConfirmDeleteModal
            isModalVisible={visible}
            hideModal={() => setIsVisible(false)}
            description={"Do you want to remove this user?"}
            onConfirm={() => removeUser(container.containerCode, user.email)}
          />
        </div>
      );
    }
    if (!user?.isVerified) {
      return (
        <>
          <Typography.Text>Invite Sent</Typography.Text>
          {!readOnlyState && (
            <Button
              className="textUnderline"
              type="text"
              icon={<DeleteIcon />}
              onClick={() => removeUser(container.containerCode, user.email)}
            />
          )}
        </>
      );
    }
    return <div />;
  };

  const percentage = parseInt(
    (container?.users?.length / competition?.teamSize) * 100
  );

  let isNotScored = true;
  if (container.mockRoundData && container.mockRoundData.length)
    isNotScored = false;
  if (isNotScored && container.roundData && container.roundData.length) {
    for (const round of container.roundData) {
      const { roundScore } = round;
      const isSubmittedByJudge = roundScore.filter(
        ({ submit }) => submit === true
      ).length;
      if (isSubmittedByJudge) {
        isNotScored = false;
        break;
      }
    }
  }

  const DownloadCSV = () => {
    return (
      <div className="participantStatsBar">
        {!!container?.points && (
          <>
            <Button
              className="buttonDownloadScores"
              onClick={() => singleContainerScores(container)}
              disabled={container?.points === 0}
            >
              <span className="btn-text">Download Scores</span>
              <span className="btn-icon">
                <DownloadNewIcon />
              </span>
            </Button>
            <Typography.Text className="participantStatsBarScores">
              Overall:{" "}
              <span className="scores">{container?.points?.toFixed(3)}</span>
            </Typography.Text>
          </>
        )}
      </div>
    );
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 175) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Tabs
      defaultActiveKey="1"
      className={`teamScoringTabs ${isScrolled ? "fixed-tabs" : ""}`}
    >
      {/* <Tabs.TabPane className="tabsetList" tab="Stats" key="1">
      <div className="competitionHolderScroller">
        <div className="competitionPlaceholderBlock">
          <AssignTeamOrParticipantModal
            isVisible={isVisible}
            setVisible={setVisible}
            container={container}
            setToAdmin={setToAdmin}
          />

           <LineChart />
            <Image
              preview={false}
              width={200}
              height={200}
              alt="thumbnail"
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
            <Typography.Text>
              There are no stats to show for this participant
            </Typography.Text> 
        </div>
      </div>
      </Tabs.TabPane> */}
      <Tabs.TabPane tab="Scores" key="1">
        {isNotScored ? (
          <div className="competitionPlaceholderBlock">
            <Image
              preview={false}
              width={200}
              height={200}
              alt="thumbnail"
              src={CONTAINER_SCORING_EMPTY_STATE}
            />
            <Typography.Text className="competitionPlaceholderBlockText">
              The{" "}
              {competition?.competitionType === "SOLO" ? "participant" : "team"}{" "}
              {"hasn't"} been scored in any round
              {/* Turn on Registrations to begin adding participants */}
            </Typography.Text>
          </div>
        ) : (
          <>
            {role === "CREW" ? (
              permissions?.manageScoring ? (
                <DownloadCSV />
              ) : (
                <></>
              )
            ) : (
              <DownloadCSV />
            )}
            {containerScores &&
              containerScores.length > 0 &&
              containerScores.map((round, i) => (
                <div key={i}>
                  {round?.type === "MOCK" ? (
                    <MockRoundFeedbackModule
                      round={round}
                      isRoundWeightageVisible={true}
                      isRoundScoresVisible={true}
                      container={container?.containerName}
                      competition={competition}
                    />
                  ) : (
                    <JudgesFeedbackModule
                      competition={competition}
                      round={round}
                      container={container?.containerName}
                    />
                  )}
                </div>
              ))}

            {/* {container &&
              container.roundData &&
              container.roundData.length > 0 &&
              container.roundData.map((round) => (
                <JudgesFeedbackModule key={round?.roundCode} round={round} container={container?.containerName}/>
              ))}
            {container &&
              container.mockRoundData &&
              container.mockRoundData.length > 0 &&
              container.mockRoundData.map((round) => (
                <MockRoundFeedbackModule key={round?.roundCode} round={round} container={container?.containerName}/>
              ))} */}
          </>
        )}
      </Tabs.TabPane>
      <Tabs.TabPane tab="Submissions" key="2">
        <Submission
          container={container}
          from="ORGANIZER"
          readOnlyState={readOnlyState}
          pusher={pusher}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Registration" key="3">
        <Registration
          readOnlyState={readOnlyState}
          container={container}
          competition={competition}
          setVisibiltyTeamSizeModal={setVisibiltyTeamSizeModal}
        />
      </Tabs.TabPane>
      {/* {competition?.competitionType === "TEAM" && container.users.length && (
        <Tabs.TabPane tab="Team" key="2">
          <Table
            className="settingsTableContent"
            columns={column}
            dataSource={container?.users}
          />
          {competition?.teamSize !== container.users.length && (
            <div className="settingsInviteBlock">
              <Progress percent={percentage} />

              {!readOnlyState && (
                <Typography.Text className="settingsInviteBlockText">
                  <Button
                    type="text"
                    onClick={() => setVisible(true)}
                    icon={<SingleUserIcon />}
                  >
                    Onboard
                  </Button>{" "}
                  Invite {competition?.teamSize - container.users.length} more
                  member to complete registration
                </Typography.Text>
              )}
            </div>
          )}
        </Tabs.TabPane>
      )} */}
    </Tabs>
  );
};

export default StatsTabs;
