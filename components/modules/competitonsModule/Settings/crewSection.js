import { ReloadOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Divider,
  Form,
  Image,
  Input,
  Popconfirm,
  Space,
  Spin,
  Switch,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCompetitionByCompetitionCode,
  notify,
  setCompetition,
} from "../../../../Redux/Actions";
import Api from "../../../../services";
import {
  getPresenceChannelName,
  isValidEmail,
} from "../../../../utility/common";
import { socketEvents } from "../../../../utility/config";
import {
  CrewIcon,
  CrossIcon,
  CrossNewIcon,
  DeleteIcon,
  DeniedIcon,
  DoubleDoneIcon,
  DoubleDoneThinIcon,
  EditPencilIcon,
  MailIcon,
  PaperPlaneNewIcon,
  VerifiedIcon,
} from "../../../../utility/iconsLibrary";
import AppNameAvater from "../../../AppAvatar/AppNameAvater";
import AppModal from "../../../AppModal";
import FormField from "../../../FormField";
import EmptyContentSection from "../emptyContentSection";

const ConfirmDeletePopUp = ({ user, handleRemoveCrew }) => {
  const [confirmDelete, setConfirmDelete] = useState("");
  return (
    <Popconfirm
      className="crewUserStatusButtons"
      title={
        <>
          <Typography.Text>
            Are you sure? Type DELETE for delete the crew.
          </Typography.Text>
          <Input
            type={"text"}
            autoFocus={true}
            placeholder="Type DELETE"
            value={confirmDelete}
            onChange={(e) => {
              setConfirmDelete(e.target.value.toUpperCase());
            }}
          />
        </>
      }
      onConfirm={() => {
        handleRemoveCrew(user);
      }}
      okText={<Button disabled={confirmDelete !== "DELETE"}>Yes</Button>}
      okType="button"
      cancelText="No"
    >
      <Button className="deleteButton">
        <DeleteIcon /> Delete Member
      </Button>
    </Popconfirm>
  );
};

const CrewStatus = ({ readOnlyState, user, handleRemoveCrew }) => {
  return (
    <Space size="middle" className="crewUserStatus">
      {user?.status === "ONBOARDED" && (
        <div className="crewUserStatusWrap">
          <div className="flex items-center crewStatusBox">
            <DoubleDoneThinIcon className="iconDone" />
            <Typography.Text className="textStatus onboarded">
              Onboarded
            </Typography.Text>
          </div>
          {!readOnlyState && (
            <ConfirmDeletePopUp
              user={user}
              handleRemoveCrew={handleRemoveCrew}
            />
          )}
        </div>
      )}
      {user?.status === "INVITED" && (
        <div className="crewUserStatusWrap">
          <div className="flex items-center crewStatusBox">
            <PaperPlaneNewIcon className="iconSend" />
            <Typography.Text className="textStatus inviteSent">
              Invite Sent
            </Typography.Text>
          </div>
          <Button
            onClick={() => handleUpdateCrewStatus(user?.email, "INVITED")}
            className="buttonInvite"
          >
            <ReloadOutlined />
            Resend Invite
          </Button>
          {!readOnlyState && (
            <Popconfirm
              className="crewUserStatusButtons"
              title="Are you sure to delete this crew?"
              onConfirm={() => {
                handleRemoveCrew(user);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button className="removeButton" icon={<CrossNewIcon />}>
                Cancel Invite
              </Button>
            </Popconfirm>
          )}
          {/* <Button className="editButton" icon={<EditPencilIcon />} /> */}
        </div>
      )}
      {user?.status === "DENIED" && (
        <div className="crewUserStatusWrap">
          <div className="flex items-center crewStatusBox">
            <DeniedIcon className="iconDenied" />
            <Typography.Text className="textStatus denied">
              Denied
            </Typography.Text>
          </div>
          <Button
            onClick={() => handleUpdateCrewStatus(user?.email, "INVITED")}
            className="buttonInvite"
          >
            <ReloadOutlined />
            Resend Invite
          </Button>
          {!readOnlyState && (
            <ConfirmDeletePopUp
              user={user}
              handleRemoveCrew={handleRemoveCrew}
            />
          )}
          <Button className="editButton" icon={<EditPencilIcon />}>
            Edit
          </Button>
        </div>
      )}
    </Space>
  );
};

const CrewManage = ({ crew, competition }) => {
  const dispatch = useDispatch();
  const [manageScoring, setManageScoring] = useState(
    crew?.permissions?.manageScoring
  );
  const [manageRegistrations, setManageRegistrations] = useState(
    crew?.permissions?.manageRegistrations
  );
  const handleUpdatePermissons = async (member) => {
    try {
      const response = await Api.update(
        `/settings/crewSettings/${competition.competitionCode}`,
        member
      );
      if (response.code && response.result) {
        // dispatch(setCompetition(response.result));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      notify({
        message: error.message,
        type: "error",
      });
    }
  };
  return (
    <div size="middle" className="crewUserManageOptions">
      <div className="crewUserManageToggle">
        <Typography.Text className="crewUserManageToggleTitle">
          Manage Scoring
        </Typography.Text>
        <Switch
          checked={manageScoring}
          onClick={(e) => {
            setManageScoring(e);
            handleUpdatePermissons({
              ...crew,
              permissions: { ...crew.permissions, manageScoring: e },
            });
          }}
        />
      </div>
      <div className="crewUserManageToggle">
        <Typography.Text className="crewUserManageToggleTitle">
          Manage Registrations
        </Typography.Text>
        <Switch
          checked={manageRegistrations}
          onClick={(e) => {
            setManageRegistrations(e);
            handleUpdatePermissons({
              ...crew,
              permissions: { ...crew.permissions, manageRegistrations: e },
            });
          }}
        />
      </div>
    </div>
  );
};

const CrewSection = ({ competition, pusher, readOnlyState }) => {
  const [isVisibleCrewModal, setVisibleCrewModal] = useState(false);
  const [isVisibleCrewDetailsModal, setVisibleCrewDetailsModal] =
    useState(false);
  const [isVisiblePermissonsModal, setVisiblePermissionsModal] =
    useState(false);
  const [selectedCrew, setSelectedCrew] = useState(null);
  const container = useSelector((state) => state.containers);
  const userEmail = useSelector((state) => state.auth.user.email);
  const [activeMember, setMemberActive] = useState({});

  const dispatch = useDispatch();
  const onBoardedCrew = competition?.crew?.filter(
    (c) => c?.status === "ONBOARDED"
  );

  useEffect(() => {
    if (competition && competition.competitionCode) {
      const channel = pusher.subscribe(
        getPresenceChannelName(competition.competitionCode)
      );

      channel.bind("receive_message", (payload) => {
        if (payload.event === socketEvents.crew_status_update)
          dispatch(
            getCompetitionByCompetitionCode({
              competitionCode: competition.competitionCode,
            })
          );
      });
    }
  }, [competition]);

  const handleUpdateCrewStatus = async (email, status) => {
    const body = { email, status };
    try {
      const response = await Api.update(
        `/settings/crewSettings/${competition.competitionCode}`,
        body
      );
      if (response?.result && response?.code) {
        dispatch(
          notify({
            type: "success",
            message: "Invitation sent successfully",
          })
        );
        // dispatch({
        //   type: SET_COMPETITION_SELECTED,
        //   competition: response.result,
        // });
      } else {
        dispatch(notify({ type: "error", message: "Something went wrong" }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveCrew = async (member) => {
    try {
      const response = await Api.update(
        `/settings/crewSettings/removeCrew/${competition.competitionCode}`,
        member
      );
      if (response.code && response.result) {
        dispatch(setCompetition(response.result));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      notify({
        message: error.message,
        type: "error",
      });
    }
  };

  const AssignCrewModal = ({ isVisible, setVisible }) => {
    const [form] = Form.useForm();
    const [manageScoring, setManageScoring] = useState(true);
    const [manageRegistrations, setManageRegistrations] = useState(false);
    const [user, setUser] = useState({});
    const competition = useSelector((state) => state.competition.current);
    const container = useSelector((state) => state.containers);
    const [showName, setShowName] = useState(false);
    const [loading, setLoading] = useState(false);

    const findUser = async (email) => {
      try {
        const response = await Api.post(`/user/checkEmail`, {
          email,
        });
        // if (response.code && response.result && response.result.userCode) {
        //   return response.result;
        // }
        return response;
      } catch (err) {
        console.log(err);
      }
    };

    const handleAddCrew = async (payload) => {
      setLoading(true);
      console.log(payload);
      if (payload.email === userEmail) {
        dispatch(
          notify({
            message: "You can't add yourself as a crew member",
            type: "error",
          })
        );
      } else {
        const foundUser = await findUser(payload.email);

        if (!foundUser.code && !showName) {
          setShowName(true);
        } else {
          try {
            const body = {
              crew: [
                {
                  email: payload.email,
                  firstName: payload.firstName ?? "",
                  lastName: payload.lastName ?? "",
                  imageURL: foundUser?.imageURL,
                  permissions: {
                    manageScoring: manageScoring,
                    manageRegistrations: manageRegistrations,
                  },
                },
              ],
            };
            const response = await Api.post(
              `/settings/crewSettings/${competition.competitionCode}`,
              body
            );
            if (response.code && response.result) {
              dispatch(setCompetition(response.result));
              dispatch(
                notify({
                  message: response.message,
                  type: "success",
                })
              );
            }
          } catch (error) {
            dispatch(
              notify({
                message: error.message,
                type: "error",
              })
            );
          }
        }
        //  else {
        //   dispatch(notify({ type: "error", message: "User not found" }));
        // }
      }
      setLoading(false);
    };

    const [checkUserError, setCheckUserError] = useState({
      error: "",
      email: "",
    });
    const [storUserEmail, setStorUserEmail] = useState("");
    // useEffect(() => {
    //   let email;
    //   if (storUserEmail && isValidEmail(storUserEmail)) {
    //     if (manageScoring || manageRegistrations) {
    //       email = "";
    //       setCheckUserError({
    //         email,
    //         error: "",
    //       });
    //       return;
    //     }

    //     if (!manageScoring || !manageRegistrations) {
    //       setCheckUserError({
    //         email: storUserEmail,
    //         error: "You have to give crew at least one Permission",
    //       });
    //       return;
    //     }
    //   }
    // }, [manageScoring, manageRegistrations, storUserEmail]);

    const checkUser = async (email) => {
      setStorUserEmail(email);
      // try {
      if (email && isValidEmail(email)) {
        if (!manageScoring && !manageRegistrations) {
          setCheckUserError({
            email: email,
            error: "You have to give crew at least one Permission",
          });
        } else if (
          container?.all?.find((cont, i) =>
            cont.users.find((u) => u.email === email)
          )
        ) {
          setCheckUserError({
            email,
            error: "Participating member cannot be added as a crew",
          });
        } else if (email === competition?.Organizer?.email) {
          setCheckUserError({
            email,
            error: "Organising member cannot be added as a crew",
          });
        } else if (competition?.crew?.find((c) => c.email === email)) {
          setCheckUserError({
            email,
            error: "This Member has already been added",
          });
        }
        // else {
        //   const response = await Api.post(`/user/checkEmail`, {
        //     email,
        //   });

        //   if (response.code && response.result && response.result.userCode) {
        //     setUser(response.result);

        //     form.setFieldsValue({
        //       firstName: response.result.firstName,
        //     });
        //     form.setFieldsValue({
        //       lastName: response.result.lastName,
        //     });
        //   }
        // }
      }
      // } catch (error) {
      // }
    };

    return (
      <div>
        <AppModal
          className="assignTeamModalParent crewModal"
          isVisible={isVisible}
          onOk={() => setVisible(false)}
          onCancel={() => {
            setVisible(false);
            form.resetFields();
          }}
        >
          <div className="assignTeamModal">
            <Typography.Title level={4}>Invite your Crew</Typography.Title>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              // wrapperCol={{ span: 16 }}
              initialValues={{ remember: true }}
              onFinish={handleAddCrew}
              // onFinishFailed={onFinishFailed}
              autoComplete="off"
              form={form}
            >
              <FormField
                type="email"
                placeholder={"email"}
                rules={[
                  {
                    type: "email",
                    message: "Please enter a valid Email!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        checkUserError.error &&
                        checkUserError.email === value
                      ) {
                        console.log(checkUserError.error, value);
                        return Promise.reject(new Error(checkUserError.error));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                onBlur={(e) => checkUser(e)}
                onPressEnter={(e) => checkUser(e)}
                disabled={user?.userCode}
                suffix={user.userCode ? <VerifiedIcon /> : null}
              />
              {showName && (
                <>
                  <FormField
                    type="text"
                    placeholder={"First Name"}
                    rules={[{ required: false }]}
                    name="firstName"
                  />
                  <FormField
                    type="text"
                    placeholder={"Last Name"}
                    rules={[{ required: false }]}
                    name="lastName"
                  />
                </>
              )}
              {/* {(!(manageScoring ||
                manageRegistrations) && !form
                  .getFieldsError()
                  .filter(({ errors }) => errors.length).length) && (
                  <div>You have two give crew at least one Permission</div>
                )} */}
              <div className="inviteCrewOptions">
                <Typography.Text className="subtitle">
                  Allow user to:
                </Typography.Text>
                {/* <Divider className="border-b-2 border-b-black" /> */}
                <div className="inviteCrewOptionsSwitch">
                  <Typography.Text className="text-label">
                    Manage Scoring
                  </Typography.Text>
                  <Switch
                    defaultChecked={manageScoring}
                    onChange={(e) => setManageScoring(e)}
                  />
                </div>
                <div className="inviteCrewOptionsSwitch">
                  <Typography.Text className="text-label">
                    Manage Registrations
                  </Typography.Text>
                  <Switch
                    defaultChecked={manageRegistrations}
                    onChange={(e) => setManageRegistrations(e)}
                  />
                </div>
              </div>
              <Form.Item
                // wrapperCol={{ offset: 8, span: 16 }}
                shouldUpdate
              >
                {() => (
                  <Tooltip
                    title={
                      checkUserError.error ==
                      "You have to give crew at least one Permission"
                        ? "You have two give crew at least one Permission"
                        : ""
                    }
                    trigger={"hover"}
                    placement="top"
                    color={"black"}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      shape="round"
                      disabled={
                        loading ||
                        !form.isFieldTouched("email") ||
                        !!form
                          .getFieldsError()
                          .filter(({ errors }) => errors.length).length ||
                        (!manageScoring && !manageRegistrations)
                      }
                    >
                      {loading ? <div className="loader-icon" /> : "Invite"}
                    </Button>
                  </Tooltip>
                )}
              </Form.Item>
            </Form>
            {/* <Tabs defaultActiveKey="1" centered>
              <Tabs.TabPane tab="Add Manually" key="1">
                <Form
                  name="basic"
                  labelCol={{ span: 8 }}
                  // wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={handleAddCrew}
                  // onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  form={form}
                >
                  <FormField type="email" placeholder={"email"} />
                  <FormField
                    type="text"
                    placeholder={"First Name"}
                    rules={[{ required: false }]}
                    name="firstName"
                  />
                  <FormField
                    type="text"
                    placeholder={"Last Name"}
                    rules={[{ required: false }]}
                    name="lastName"
                  />
  
                  <Form.Item
                    // wrapperCol={{ offset: 8, span: 16 }}
                    shouldUpdate
                  >
                    {() => (
                      <Button
                        type="primary"
                        htmlType="submit"
                        shape="round"
                        disabled={
                          !form.isFieldsTouched(true) ||
                          !!form
                            .getFieldsError()
                            .filter(({ errors }) => errors.length).length
                        }
                      >
                        Send Invite
                      </Button>
                    )}
                  </Form.Item>
                </Form>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Invite" key="2">
                <div className="qrCodeBox">
                  <AppQrCode
                    value={routeGenerator(
                      routes.crewLogin,
                      {
                        competitionCode: competition?.competitionCode,
                      },
                      true
                    )}
                  />
                </div>
                <div className="qrCodeInfo">
                  <Typography.Text className="qrCodeInfoText">
                    Scan QR Code
                  </Typography.Text>
  
                  <Typography.Text className="qrCodeInfoText or">
                    Or
                  </Typography.Text>
  
                  <Typography.Text className="qrCodeInfoText">
                    {" "}
                    <LinkOutlined /> Invite via Link
                  </Typography.Text>
                </div>
                <div className="invitelinkField">
                  <div className="qrCodeInfoText">
                    <Typography.Text copyable>
                      {routeGenerator(
                        routes.crewLogin,
                        {
                          competitionCode: competition?.competitionCode,
                        },
                        true
                      )}
                      link
                    </Typography.Text>
                  </div>
                </div>
              </Tabs.TabPane>
            </Tabs> */}
          </div>
        </AppModal>
      </div>
    );
  };

  const CrewDetailsModal = ({ readOnlyState, isVisible, setVisible, crew }) => {
    const [manageScoring, setManageScoring] = useState(
      crew?.permissions?.manageScoring
    );
    const [manageRegistrations, setManageRegistrations] = useState(
      crew?.permissions?.manageRegistrations
    );
    const handleUpdatePermissons = async (member) => {
      try {
        const response = await Api.update(
          `/settings/crewSettings/${competition.competitionCode}`,
          member
        );
        if (response.code && response.result) {
          dispatch(setCompetition(response.result));
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        notify({
          message: error.message,
          type: "error",
        });
      }
    };
    return (
      <AppModal
        className="crewMemberModal"
        isVisible={isVisible}
        // onOk={() => setVisible(false)}
        onCancel={() => {
          setVisible(false);
          if (
            crew?.permissions?.manageScoring !== manageScoring ||
            crew?.permissions?.manageRegistrations !== manageRegistrations
          ) {
            handleUpdatePermissons({
              email: crew?.email,
              permissions: { manageRegistrations, manageScoring },
            });
          }
        }}
      >
        <div className="flex flex-col crewMemberModalContent">
          <Typography.Title className="heading" level={3}>
            Member Details
          </Typography.Title>
          <Typography.Text className="crewEmail">
            <MailIcon />
            {crew?.email}
          </Typography.Text>
          <Typography.Text className="textInfo">
            {crew?.User?.firstName || crew?.firstName}
          </Typography.Text>
          <Typography.Text className="textInfo">
            {crew?.User?.lastName || crew?.lastName}
          </Typography.Text>
          <div className="flex items-center justify-between crewMemberModalStatusWrap">
            <Typography.Text className="textsubTitle">Status:</Typography.Text>
            <div className="crewMemberModalStatus">
              {crew?.status === "INVITED" && (
                <div className="flex items-center justify-end">
                  <div className="flex items-center">
                    <PaperPlaneNewIcon className="iconSend" />
                    <Typography.Text className="textStatus inviteSent">
                      Invite Send
                    </Typography.Text>
                  </div>
                  {!readOnlyState && (
                    <Popconfirm
                      title="Are you sure to delete this crew?"
                      onConfirm={() => {
                        handleRemoveCrew(crew);
                      }}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button className="removeButton" icon={<CrossIcon />} />
                    </Popconfirm>
                  )}
                </div>
              )}
              {crew?.status === "ONBOARDED" && (
                <div className="flex items-center justify-end">
                  <div className="flex items-center">
                    <DoubleDoneIcon className="iconDone" />
                    <Typography.Text className="textStatus onboarded">
                      Onboarded
                    </Typography.Text>
                  </div>
                  {!readOnlyState && (
                    <ConfirmDeletePopUp
                      user={crew}
                      handleRemoveCrew={handleRemoveCrew}
                    />
                  )}
                </div>
              )}
              {crew?.status === "DENIED" && (
                <div className="flex items-center justify-end">
                  <div className="flex items-center">
                    <DeniedIcon className="iconDenied" />
                    <Typography.Text className="textStatus denied">
                      Denied
                    </Typography.Text>
                  </div>
                  {/* <Popconfirm
                    title="Are you sure to delete this crew?"
                    onConfirm={() => {
                      handleRemoveCrew(crew);
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button icon={<DeleteIcon />} />
                  </Popconfirm> */}
                </div>
              )}
            </div>
          </div>
          {crew?.status !== "DENIED" && (
            <>
              <div className="inviteCrewOptions">
                <Typography.Text className="subtitle">
                  Allow user to:
                </Typography.Text>
                {/* <Divider className="border-b-2 border-b-black" /> */}
                <div className="inviteCrewOptionsSwitch">
                  <Typography.Text className="text-label">
                    Manage Scoring
                  </Typography.Text>
                  <Switch
                    disabled={readOnlyState}
                    onChange={(e) => {
                      setManageScoring(e);
                      // handleUpdatePermissons({
                      //   email: crew?.email,
                      //   permissions: { manageScoring: e },
                      // });
                    }}
                    defaultChecked={manageScoring}
                  />
                </div>
                <div className="inviteCrewOptionsSwitch">
                  <Typography.Text className="text-label">
                    Manage Registrations
                  </Typography.Text>
                  <Switch
                    disabled={readOnlyState}
                    onChange={(e) => {
                      setManageRegistrations(e);
                    }}
                    defaultChecked={manageRegistrations}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </AppModal>
    );
  };

  const EmptySection = () => {
    return (
      <div className="competitionPlaceholderBlock" style={{ display: "none" }}>
        <div className="crewPlaceholder">
          <Image
            preview={false}
            width={200}
            height={200}
            alt="thumbnail"
            src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1665573354664_image_91.png"
          />
          {competition?.status === "ACTIVE" ? (
            <Typography.Text className="crewPlaceholderText">
              Invite team members to help you organize this competition.
            </Typography.Text>
          ) : (
            <Typography.Text className="crewPlaceholderText">
              No crew members were added
            </Typography.Text>
          )}
          {!readOnlyState && (
            <Button
              type="primary"
              className="competitionPlaceholderButton"
              onClick={() => setVisibleCrewModal(true)}
            >
              Invite crew
            </Button>
          )}
        </div>
      </div>
    );
  };

  const PermissionsModal = ({ isVisible, setVisible }) => {
    return (
      <AppModal
        isVisible={isVisible}
        onOk={() => setVisible(false)}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <>
          <div className="flex justify-center">
            <Avatar src="https://avatars1.githubusercontent.com/u/8186664?s=460&v=4" />
            <Typography.Text className="ml-4">
              {"TeamMate's Permission"}
            </Typography.Text>
          </div>
          <div className="flex justify-between">
            <Typography.Text>Take Round Live</Typography.Text>
            <Switch
              defaultChecked={activeMember?.permissions?.takeRoundLive}
              onChange={(e) => {
                const temp = { ...activeMember };
                temp.permissions.takeRoundLive = e;
                handleUpdatePermissons(temp);
              }}
            />
          </div>
          <Divider />
          <div className="flex justify-between">
            <Typography.Text>Create Rounds</Typography.Text>
            <Switch
              defaultChecked={activeMember?.permissions?.createRounds}
              onChange={(e) => {
                const temp = { ...activeMember };
                temp.permissions.createRounds = e;
                handleUpdatePermissons(temp);
              }}
            />
          </div>
          <Divider />
          <div className="flex justify-between">
            <Typography.Text>Share Scoresheets</Typography.Text>
            <Switch
              defaultChecked={activeMember?.permissions?.shareScoresheets}
              onChange={(e) => {
                const temp = { ...activeMember };
                temp.permissions.shareScreenshots = e;
                handleUpdatePermissons(temp);
              }}
            />
          </div>
          <Divider />
          <div className="flex justify-between">
            <Typography.Text>Eliminate Participants</Typography.Text>
            <Switch
              defaultChecked={activeMember?.permissions?.eliminateParticipants}
              onChange={(e) => {
                const temp = { ...activeMember };
                temp.permissions.eliminateParticipants = e;
                handleUpdatePermissons(temp);
              }}
            />
          </div>
        </>
      </AppModal>
    );
  };

  const column = [
    {
      // title: "Name",
      key: "name",
      render: (user) => (
        <div
          className="crewAvatarUser"
          // onClick={() => {
          //   setVisibleCrewDetailsModal(true);
          //   setSelectedCrew(user);
          // }}
        >
          {user?.imageURL ? (
            <Avatar
              className="crewAvatar"
              src={user?.User?.imageURL || user?.imageURL}
            />
          ) : (
            <AppNameAvater user={user} />
          )}
          {/* Please Use below line for Emoji Option which is wrapped in comment */}
          {/* <p className="crewEmoji">🤗</p> */}
          <div className="crewInfo">
            {user?.firstName ? (
              <Typography.Text className="crewName">
                {(user?.User?.firstName || user?.firstName) +
                  " " +
                  (user?.User?.lastName || user?.lastName)}
              </Typography.Text>
            ) : (
              <span></span>
            )}
            {/* <br /> */}
            <Typography.Text type="secondary" className="crewEmail">
              {user?.email}
            </Typography.Text>
          </div>
          {/* <Button
            type="link"
            onClick={() => {
              setVisiblePermissionsModal(true);
              setMemberActive(user);
            }}
          >
            view permissions
          </Button> */}
        </div>
      ),
    },
    {
      render: (user) => {
        if (user?.status !== "ONBOARDED" && !readOnlyState) {
          return (
            <>
              <Button
                onClick={() => handleUpdateCrewStatus(user?.email, "INVITED")}
                className="buttonInvite"
              >
                <ReloadOutlined />
                Resend Invite
              </Button>
              <Button className="buttonCancle">
                <CrossNewIcon />
                Cancel Invite
              </Button>
            </>
          );
        }
      },
    },
    {
      // title: "Action",
      key: "action",
      render: (user) => (
        <CrewStatus
          readOnlyState={readOnlyState}
          user={user}
          handleRemoveCrew={handleRemoveCrew}
        />
      ),
    },
    {
      key: "action",
      render: (user) => <CrewManage crew={user} competition={competition} />,
    },
  ];

  const toolTipText =
    competition?.status === "CONCLUDED"
      ? "You cannot add crew members to concluded competitions"
      : "";

  return (
    <div className="crewSection">
      <div className="mobileSettingHeader visibleTabletMobile">
        <CrewIcon />
        <strong className="mobileSettingTitle">Competition Settings</strong>
      </div>
      {(competition?.status !== "CONCLUDED" || !competition?.crew?.length) && (
        <div className="crewSectionHeader">
          <div className="crewSectionHeaderLeft">
            <Typography.Title level={3}>
              <Image
                preview={false}
                alt="thumbnail"
                src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1676401577641_crewicon.png"
              />
              My Crew &nbsp;
              {competition.crew.length > 0 && !readOnlyState && (
                <>({competition.crew.length})</>
                // <>({onBoardedCrew?.length})</>
              )}
            </Typography.Title>
            <Typography.Text className="subText">
              {/* Tap on crew Member card to view Permissions */}
              {competition?.status === "CONCLUDED"
                ? "No crew members were invited for this competition"
                : "Add or remove crew members to manage this competition"}
            </Typography.Text>
          </div>
          {competition?.status !== "CONCLUDED" && (
            <Tooltip
              title={toolTipText}
              trigger={"hover"}
              placement="bottom"
              color={"black"}
            >
              <Button
                type="primary"
                className="competitionPlaceholderButton"
                onClick={() => setVisibleCrewModal(true)}
                disabled={competition?.status === "CONCLUDED"}
              >
                Invite crew
              </Button>
            </Tooltip>
          )}

          {/* {competition?.status == "CONCLUDED" && (
            <Tooltip
              title={toolTipText}
              trigger={"hover"}
              placement="bottom"
              color={"black"}
            >
              <Button
                type="primary"
                className="competitionPlaceholderButton"
                onClick={() => setVisibleCrewModal(true)}
                disabled={competition?.status === "CONCLUDED"}
              >
                Invite crew
              </Button>
            </Tooltip>
          )} */}

          {/* {competition.crew.length > 0 && !readOnlyState && (
          <Button
            type="primary"
            className="competitionPlaceholderButton"
            onClick={() => setVisibleCrewModal(true)}
          >
            Invite crew
          </Button>
        )} */}
        </div>
      )}
      <div className="crewSectionContent">
        {/* <Divider /> */}
        {/* {competition.crew.length ? (
          <Typography.Text className="subText">
            Tap on crew Member card to view Permissions
          </Typography.Text>
        ) : null} */}
        <div>
          {!!competition?.crew?.length ? (
            <Table columns={column} dataSource={competition.crew} />
          ) : (
            <EmptyContentSection tabActive={"SETTINGS"} />
          )}
        </div>
      </div>
      {/* <EmptySection /> */}
      <AssignCrewModal
        isVisible={isVisibleCrewModal}
        setVisible={setVisibleCrewModal}
      />
      <PermissionsModal
        isVisible={isVisiblePermissonsModal}
        setVisible={setVisiblePermissionsModal}
      />

      <CrewDetailsModal
        readOnlyState={readOnlyState}
        crew={selectedCrew}
        isVisible={isVisibleCrewDetailsModal}
        setVisible={setVisibleCrewDetailsModal}
      />
    </div>
  );
};

export default CrewSection;
