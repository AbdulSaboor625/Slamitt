import { EllipsisOutlined, InfoCircleOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Spin,
  Table,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  crudMemberContainer,
  notify,
  updateCompetitionDetails,
  updateContainer,
} from "../../../Redux/Actions";
import { GET_CONTAINER } from "../../../Redux/actionTypes";
import useMediaQuery from "../../../hooks/useMediaQuery";
import Api from "../../../services";
import {
  calculateDuration,
  checkLegalRegistration,
  getInitials,
  isBelongToSameInstitute,
  isValidEmail,
  titleCase,
} from "../../../utility/common";
import { CONTAINER_SCORING_EMPTY_STATE } from "../../../utility/config";
import {
  CheckedGreenIcon,
  DeleteIcon,
  DoubleDoneThinIcon,
  EditPencilIcon,
  InfoNewIcon,
  InstituteIcon,
  LockedIcon,
  UnlockedIcon,
  VerifiedIcon,
} from "../../../utility/iconsLibrary";
import { emailRule } from "../../../utility/validatationRules";
import AppModal from "../../AppModal";
import FormField from "../../FormField";
import ConfirmLockModal from "./confirmLockModal";
import ProgressBar, { progressText } from "./progressBar";

export const showStatus = (
  status,
  type = "ADD",
  competitionStatus = "ACTIVE"
) => {
  switch (status) {
    case "EMAIL_FAILED":
      return <InfoNewIcon className="iconError" />;
    case "ONBOARDED":
      return (
        <div className="flex items-center space-x-2">
          <DoubleDoneThinIcon className="iconSuccess" />{" "}
          <Typography.Text className="statusAdded">
            (Registered)
          </Typography.Text>{" "}
        </div>
      );
    case "INVITED":
      return (
        <>
          {type === "ADD" ? (
            <div className="flex items-center space-x-2">
              <EllipsisOutlined className="iconInvited visibleMobile" />{" "}
              <Typography.Text className="statusAdded" type="success">
                {competitionStatus === "ACTIVE"
                  ? `(Invited)`
                  : `(Invitation expired)`}
              </Typography.Text>{" "}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <EllipsisOutlined className="iconInvited visibleMobile" />{" "}
            </div>
            // <PlusGrayIcon className="iconPlus" />
          )}
        </>
      );
    default:
      return (
        <Typography.Text className="statusAdded" type="success">
          {`(${status})`}
        </Typography.Text>
      );
  }
};

export const AddTeamMemberModal = ({
  container,
  user,
  setUser,
  type,
  isTeamCompetition,
  setType,
  crudMember,
  openAddTeamMember,
  setOpenAddTeamMember,
  setIsDeleteMemberModalVisible,
  resendInviteEmail,
  checkUser,
  competition,
  checkUserError,
  emailValidationStatus,
  setEmailValidationStatus,
}) => {
  const isDisabled = user?.userCode;
  const [institutes, setInstitutes] = useState([]);
  const [instituteOptions, setInstituteOptions] = useState([]);
  const [form] = Form.useForm();
  const [selectedInstitute, setSelectedInstitute] = useState("");
  const [varifiedInstitute, setVarifiedInstitute] = useState(false);
  const [hasFirstName, setHasFirstName] = useState(false);
  const [hasInstitute, setHasInstitute] = useState(false);
  const [oldEmailValue, setOldEmailValue] = useState("");
  const [checkEmailValidation, setCheckEmailValidation] = useState(false);
  const [loadding, setLoadding] = useState(false);
  const dispatch = useDispatch();

  const isNameHidden = user?.userCode;

  const onFinish = async (res) => {
    const { email } = res;
    if (
      type !== "UPDATE" &&
      (!checkEmailValidation ||
        (checkUserError.error && checkUserError.email === email))
    ) {
      checkUser(email);
      setCheckEmailValidation(true);
    } else {
      setLoadding(true);
      if (!form.getFieldsError().find((f) => f.errors.length)) {
        await crudMember(
          {
            ...res,
            firstName: res?.firstName || user?.firstName,
            lastName: res?.lastName || user?.lastName,
            imageURL: res?.imageURL || user?.imageURL,
            email: res?.email || user?.email,
            institute:
              competition.isBelongsToSameOrgOrInstitute &&
              container?.users?.length
                ? container.users[0].institute
                : res.institute || user?.institute,
          },
          type
        );
        setUser(null);
        setType("ADD");
        setLoadding(false);
        setEmailValidationStatus("");
        setInstituteOptions([...institutes]);
        form.resetFields();
        setCheckEmailValidation(false);
        setOpenAddTeamMember(false);
      }
    }
  };

  useEffect(() => {
    async function fetchInstitutesData() {
      try {
        const response = await Api.get(`/institute/cgirhpyvay`);
        if (response.code && response.result && response.result.length) {
          const instituteOptions = response.result.map((i) => ({
            label: i.instituteName?.split("(Id")[0],
            value: i.code,
            isActive: i?.isActive,
          }));

          setInstitutes(instituteOptions);
          setInstituteOptions(instituteOptions);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchInstitutesData();
  }, []);

  const checkInstitute = (institute) => {
    const instituteObj = institutes.find((i) => i.label === institute);
    if (instituteObj) {
      return instituteObj.isActive;
    }
    return false;
  };

  useEffect(() => {
    if (user?.userCode) setVarifiedInstitute(checkInstitute(user?.institute));
    else setVarifiedInstitute(checkInstitute(form.getFieldValue("institute")));
  }, [form.getFieldValue("institute"), user]);

  useEffect(() => {
    form.validateFields(["email", "institute"]);
    if (user) {
      form.setFieldsValue({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        institute: user?.institute,
      });
    }
  }, [checkUserError, form, user]);

  return (
    <AppModal
      className="assignTeamModalParent addTeamMemberModal"
      isVisible={openAddTeamMember}
      footer={
        type === "ADD" ? null : (
          <div className="flex items-center justify-between addTeamMemberModalFooter">
            <div className="addTeamMemberModalFooterStatuIicon">
              {showStatus(user?.status || "INVITED", type, competition.status)}
            </div>
            <div className="flex items-center addTeamMemberModalFooterButtons">
              {user?.status !== "ONBOARDED" && (
                <Button
                  className="buttonPopup"
                  // icon={<DeleteIcon />}
                  onClick={() => resendInviteEmail(user)}
                >
                  Resend Email
                </Button>
              )}
              <Button
                className="buttonPopup"
                icon={<DeleteIcon />}
                onClick={() => {
                  setUser(user);
                  setOpenAddTeamMember(false);
                  setIsDeleteMemberModalVisible(true);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        )
      }
      onCancel={() => {
        setOpenAddTeamMember(false);
        setUser({});
        setType("ADD");
        setInstituteOptions([...institutes]);
        form.resetFields();
        setEmailValidationStatus("");
        setCheckEmailValidation(false);
      }}
    >
      <div className="assignTeamModal">
        {(type === "UPDATE" || emailValidationStatus === "success") && (
          <Typography.Title level={4}>
            {container?.containerName} member details
          </Typography.Title>
        )}
        {isNameHidden && (
          <Typography.Title level={4}>{`${titleCase(
            type
          )} Team Member`}</Typography.Title>
        )}
        {!isNameHidden && (
          <Typography.Title level={4}>
            Invite {isTeamCompetition ? "team member" : "participant"} to{" "}
            {container?.containerName}
          </Typography.Title>
        )}
        <Form
          onFinish={onFinish}
          form={form}
          onFieldsChange={(_, allFields) => {
            const firstNameField = allFields.find((f) =>
              f.name.includes("firstName")
            );
            if (firstNameField && firstNameField.value) {
              setHasFirstName(true);
            } else {
              setHasFirstName(false);
            }

            const emailField = allFields.find((f) => f.name.includes("email"));
            if (emailField && emailField.value !== oldEmailValue) {
              setOldEmailValue(emailField?.value);
              if (emailValidationStatus !== "validating") {
                setEmailValidationStatus("validating");
                setHasFirstName(false);
                setHasInstitute(false);
                form.setFieldsValue({
                  firstName: "",
                  lastName: "",
                  institute: null,
                });
              }
            }
          }}
        >
          <FormField
            type={"email"}
            name="email"
            placeholder={"Email ID*"}
            disabled={type === "UPDATE"}
            onPressEnter={(e) => {
              checkUser(e);
              // setCheckEmailValidation(true);
            }}
            onBlur={(e) => {
              checkUser(e);
              // setCheckEmailValidation(true);
            }}
            defaultValue={user?.email}
            rules={
              user?.email
                ? []
                : [
                    ...emailRule,
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (
                          type !== "UPDATE" &&
                          checkUserError.error &&
                          checkUserError.email === value
                        ) {
                          return Promise.reject(
                            new Error(checkUserError.error)
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]
            }
            suffix={user?.userCode ? <VerifiedIcon /> : null}
          />
          {(type === "UPDATE" || emailValidationStatus === "success") && (
            <>
              {!isNameHidden && (
                <FormField
                  rules={[
                    { required: true, message: "Please enter first name" },
                  ]}
                  type={"text"}
                  name="firstName"
                  placeholder={user?.firstName || "First Name*"}
                  disabled={isDisabled}
                  defaultValue={user && user?.firstName}
                />
              )}
              {!isNameHidden && (
                <FormField
                  type={"text"}
                  name="lastName"
                  placeholder={user?.lastName || "Last Name"}
                  disabled={isDisabled}
                  defaultValue={user && user?.lastName}
                />
              )}
              <Form.Item
                name="institute"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        container?.users?.length &&
                        competition?.isBelongsToSameOrgOrInstitute &&
                        user?.userCode &&
                        !isBelongToSameInstitute(institutes, [
                          ...new Set(
                            container?.users
                              ?.filter(({ institute }) => institute)
                              .map(({ institute }) => institute)
                          ),
                          user?.institute,
                        ]) &&
                        user?.institute !== container?.users[0]?.institute
                      ) {
                        return Promise.reject(
                          new Error(
                            "This user belongs to a different institute/Organisation"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                validateTrigger={["onChange", "onBlur"]}
              >
                <Select
                  name="institute"
                  showArrow={false}
                  showSearch={true}
                  filterOption={false}
                  defaultValue={user?.institute || null}
                  disabled={
                    isDisabled ||
                    (competition?.isBelongsToSameOrgOrInstitute &&
                      container?.users?.length)
                  }
                  placeholder={
                    !competition?.isBelongsToSameOrgOrInstitute
                      ? user?.institute || "Institute/Organisation Name"
                      : user?.userCode
                      ? user?.institute || "Institute/Organisation Name"
                      : container?.users[0]?.institute ||
                        "Institute/Organisation Name"
                  }
                  onSearch={(value) => {
                    if (value) {
                      const newInstituteOptions = institutes.filter((i) =>
                        i.label?.toLowerCase().includes(value.toLowerCase())
                      );
                      setInstituteOptions([
                        ...newInstituteOptions,
                        {
                          isActive: false,
                          label: value,
                          value,
                        },
                      ]);
                    } else {
                      setInstituteOptions([...institutes]);
                    }
                  }}
                  onSelect={(value) => {
                    if (value) setHasInstitute(value);
                    setSelectedInstitute(value);
                    form.setFieldsValue({
                      institute: value,
                    });
                  }}
                >
                  {(instituteOptions || []).map((option) => (
                    <Select.Option key={option.code} value={option.label}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
                {varifiedInstitute ? (
                  // !!form.getFieldsError().find((f) => f?.errors?.length)
                  <VerifiedIcon className="verifiedIcon" />
                ) : (
                  <>
                    {user?.userCode ? (
                      <div className="verifiedFormText small">
                        {!varifiedInstitute && (
                          <Typography.Text>
                            <InfoCircleOutlined /> Your Organisation/Institute
                            will be verified soon.
                          </Typography.Text>
                        )}
                      </div>
                    ) : (
                      Boolean(form.getFieldValue("institute")) && (
                        <div className="verifiedFormText small">
                          {!varifiedInstitute && (
                            <Typography.Text>
                              <InfoCircleOutlined /> Your Organisation/Institute
                              will be verified soon.
                            </Typography.Text>
                          )}
                        </div>
                      )
                    )}
                  </>
                )}
                {type === "ADD" && (
                  <div className="addTeamMemberModalOrganisationNote">
                    {competition?.isBelongsToSameOrgOrInstitute &&
                    container?.users?.length ? (
                      <Typography.Text className="text-yellow-400">
                        This participant must also belong to the same
                        organisation/institute.
                      </Typography.Text>
                    ) : null}
                  </div>
                )}
              </Form.Item>
            </>
          )}
          <Form.Item>
            {!(isDisabled && type === "UPDATE") && (
              <Button
                type="primary"
                disabled={
                  type === "UPDATE"
                    ? form.getFieldsError().find((f) => f?.errors?.length)
                    : emailValidationStatus !== "success" ||
                      !isValidEmail(form.getFieldValue("email")) ||
                      form.getFieldsError().find((f) => f?.errors?.length)
                    ? true
                    : user?.userCode
                    ? false
                    : !(
                        hasFirstName &&
                        Boolean(
                          hasInstitute ||
                            (competition?.isBelongsToSameOrgOrInstitute &&
                              container?.users?.length &&
                              container?.users[0]?.institute)
                        )
                      )
                }
                htmlType="submit"
                shape="round"
              >
                {loadding ? (
                  <div className="loader-icon" />
                ) : type === "ADD" ? (
                  "INVITE"
                ) : (
                  type
                )}
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
    </AppModal>
  );
};

export const DeleteMemberModal = ({
  isModalVisible,
  setIsModalVisible,
  onSubmit,
  setSelectedUser,
}) => {
  const [inputValue, setInputValue] = useState("");
  return (
    <Modal
      className="abandonCompetitionModal"
      visible={isModalVisible}
      closable={false}
      onCancel={() => {
        setIsModalVisible(false);
        setSelectedUser("");
        setInputValue("");
      }}
      footer={null}
      destroyOnClose
    >
      <div className="abandonCompetitionModalConcludeOption">
        <Typography.Title level={2}>
          Type
          <span style={{ color: "#6808FE" }}>{` DELETE `}</span>
          to delete this participant
        </Typography.Title>
        <Input
          className="formInput"
          placeholder={"DELETE"}
          addonAfter={
            <Button
              type="primary"
              disabled={inputValue.toUpperCase() !== "DELETE"}
              onClick={() => {
                onSubmit();
                setInputValue("");
              }}
            >
              {"DELETE"}
            </Button>
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.trim())}
        />
      </div>
    </Modal>
  );
};

export default function Registration({
  readOnlyState,
  container,
  competition,
  setVisibiltyTeamSizeModal,
}) {
  const user = useSelector((state) => state?.auth?.user);
  const dispatch = useDispatch();
  const [modalType, setModalType] = useState("ADD");

  const { role, email } = useSelector((state) => state?.auth?.user);
  const [openAddTeamMember, setOpenAddTeamMember] = useState(false);
  const [isDeleteMemberModalVisible, setIsDeleteMemberModalVisible] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const isTeamCompetition = competition?.competitionType === "TEAM";
  const membersLeft = competition?.teamSize - container?.users?.length;
  const [checkUserError, setCheckUserError] = useState({
    email: "",
    error: "",
  });
  const [legalRegistration, setLegalRegistration] = useState(false);
  const crewUser = competition?.crew?.find((c) => c.email === email);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const [emailValidationStatus, setEmailValidationStatus] = useState("");
  const [visibleLockModal, setVisibleLockModal] = useState(false);
  const [durationOfTime, setDurationTime] = useState(
    calculateDuration(competition?.updatedAt, 48)
  );

  useEffect(() => {
    setLegalRegistration(checkLegalRegistration(competition, container));
  }, [container]);

  const handleLockRegistration = async () => {
    dispatch(
      updateContainer({
        containerCode: container?.containerCode,
        lockRegistration: Boolean(!container?.lockRegistration),
      })
    );
  };

  setTimeout(() => {
    if (competition?.status !== "ACTIVE")
      setDurationTime(calculateDuration(competition?.updatedAt, 48));
  }, 1000);

  const allRounds = useSelector((state) => state.competition?.allRounds);
  // const [resendTime, setResendTime] = useState(30);
  // const [intervalId, setIntervalId] = useState(null);
  // const [timerState, settimerState] = useState(false);
  // const [timerIndex, settimerIndex] = useState(null);

  // useEffect(() => {
  //   return () => clearInterval(intervalId);
  // }, []);

  // useEffect(() => {
  //   if (resendTime == 0) {
  //     settimerState(false);
  //     setResendTime(30);
  //     clearInterval(intervalId);
  //   }
  // }, [resendTime]);
  const checkUser = async (email) => {
    const judges = allRounds
      ?.map((round) => {
        if (round?.Competition?._id === competition?._id) {
          return round?.Judges;
        }
        return null; // added this line to always return a value
      })
      .filter((value) => value !== undefined);
    let judge = false;
    judges[0]?.forEach((item) => {
      if (item?.email === email) {
        judge = true;
      }
    });

    try {
      if (email && isValidEmail(email)) {
        if (container?.users?.find((u) => u.email === email)) {
          setCheckUserError({
            email,
            error: "This Member has already been added",
          });
          setSelectedUser(null);
          setEmailValidationStatus("error");
        } else if (user?.email === email) {
          setCheckUserError({
            email,
            error: "Organising member cannot be added as a participant",
          });
          setSelectedUser(null);
          setEmailValidationStatus("error");
        } else if (competition?.crew?.find((c) => c.email === email)) {
          setCheckUserError({
            email,
            error: "Organising member cannot be added as a participant",
          });
          setSelectedUser(null);
          setEmailValidationStatus("error");
        } else if (judge) {
          setCheckUserError({
            email,
            error: "Judges cannot be added as a participant",
          });
          setSelectedUser(null);
          setEmailValidationStatus("error");
        } else {
          const containerResponse = await Api.post(
            "/container/check-user-container",
            {
              competitionCode: competition?.competitionCode,
              email,
            }
          );

          if (
            containerResponse &&
            containerResponse.code &&
            containerResponse.result?.isPresent &&
            containerResponse.result?.container?.containerCode !==
              container?.containerCode
          ) {
            setCheckUserError({
              email,
              error: "This email has been added to another team!",
            });
            setEmailValidationStatus("error");
            setSelectedUser(null);
          } else {
            const response = await Api.post(`/user/checkEmail`, {
              email,
            });
            if (response.code && response.result && response.result.userCode) {
              setSelectedUser(response.result);
              setEmailValidationStatus("success");
            } else {
              setSelectedUser(null);
              setEmailValidationStatus("success");

              // throw new Error(response.message);
            }
          }
        }
      } else {
        setSelectedUser(null);
        setEmailValidationStatus("error");
      }
    } catch (error) {
      // dispatch(
      //   notify({
      //     message: error.message,
      //     type: "error",
      //   })
      // );
    }
  };

  const resendInviteEmail = async (user) => {
    // settimerState(true);
    try {
      const response = await Api.post(
        `/container/resend-participant-invititation`,
        {
          user,
          containerCode: container?.containerCode,
        }
      );

      if (response.code && response.result) {
        dispatch(
          notify({
            message: response.message,
            type: "success",
          })
        );
        // const timer = setInterval(() => {
        //   setResendTime((prevTime) => prevTime - 1);
        // }, 1000);
        // setIntervalId(timer);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      // settimerState(false);
      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };

  const crudMember = async (user, type) => {
    try {
      const response = await Api.update(
        `/container/${container.containerCode}/crud-container-user`,
        {
          user,
          type,
          competitionCode: competition?.competitionCode,
        }
      );

      if (response.code && response.result) {
        if (!competition.allowRegistration && type === "ADD") {
          // OpenRegistrationConfirmationModal();
        }
        dispatch({
          type: GET_CONTAINER,
          container: response.result,
        });
        dispatch(crudMemberContainer(response.result, user, type));
        dispatch(
          notify({
            message: response.message,
            type: "success",
          })
        );
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };

  const showAddTeamMemberModalButton = (fromEmptyState = false) => {
    if (fromEmptyState) return true;
    if (competition?.competitionType === "SOLO") {
      return true;
    }
    if (
      competition?.competitionType === "TEAM" &&
      !container?.lockRegistration &&
      container?.users[0]?.status === "ONBOARDED"
    ) {
      return true;
    }
    return false;
  };

  const EditDeleteIconForUser = ({ user }) => {
    const EditIcon = () => {
      return (
        <>
          {!container?.lockRegistration ? (
            <EditPencilIcon
              className={`deleteButton edit`}
              onClick={() => {
                setSelectedUser(user);
                setModalType("UPDATE");
                setOpenAddTeamMember(true);
              }}
            />
          ) : null}
        </>
      );
    };

    const DeleteBtn = () => {
      return (
        <>
          {!container?.lockRegistration && (
            <DeleteIcon
              className="deleteButton"
              onClick={() => {
                setSelectedUser(user);
                setIsDeleteMemberModalVisible(true);
              }}
            />
          )}
        </>
      );
    };
    return (
      <div className="flex items-center space-x-2">
        {!readOnlyState && (
          <>
            {role === "CREW" ? (
              crewUser?.permissions?.manageRegistrations ? (
                <EditIcon />
              ) : null
            ) : (
              <EditIcon />
            )}
            {role === "CREW" ? (
              crewUser?.permissions?.manageRegistrations ? (
                <DeleteBtn />
              ) : null
            ) : (
              <DeleteBtn />
            )}
          </>
        )}
      </div>
    );
  };

  const column = [
    {
      render: ({
        userCode,
        User,
        imageURL,
        firstName,
        lastName,
        institute,
        status,
      }) => (
        <div className="crewAvatarUser">
          <div className="relative">
            {(userCode && User?.imageURL) || imageURL ? (
              <Avatar
                className="crewAvatar"
                alt="Avatar"
                src={!imageURL ? User?.imageURL : imageURL}
              />
            ) : (
              <Avatar
                alt="Avatar"
                className="crewAvatar"
                src={
                  <Typography.Text>{`${getInitials(
                    Boolean(userCode && User?.firstName)
                      ? User
                      : { firstName, lastName }
                  )}`}</Typography.Text>
                }
              />
            )}
            <span className="absolute bottom-0 right-2">
              {isMobile &&
                showStatus(status || "INVITED", "UPDATE", competition?.status)}
            </span>
          </div>
          <div className="crewInfo">
            <div className="flex items-center">
              <Typography.Text className="crewName">
                <Tooltip
                  title={`${!firstName ? User?.fName : firstName} ${
                    !lastName ? (User?.lName ? User?.lName : "") : lastName
                  }`}
                  trigger={"hover"}
                  placement="top"
                  color={"blue"}
                >
                  {`${!firstName ? User?.fName : firstName} ${
                    !lastName ? (User?.lName ? User?.lName : "") : lastName
                  }`}
                </Tooltip>
              </Typography.Text>
              {!isMobile &&
                showStatus(status || "INVITED", "ADD", competition?.status)}
            </div>
            {!institute && !User?.institute_name ? null : (
              <Typography.Text className="crewInstitute">
                <InstituteIcon />{" "}
                {!institute ? User?.institute_name : institute}
              </Typography.Text>
            )}
          </div>
        </div>
      ),
    },
    {
      render: (user, index, i) => (
        <div>
          {user?.status === "ONBOARDED" ? null : (
            <div>
              {competition?.status === "ACTIVE" ? (
                <div>
                  <Button
                    className="buttonInvite"
                    // disabled={resendTime != 30 ? true : false}
                    onClick={() => resendInviteEmail(user)}
                  >
                    Resend Email
                    {/* {timerState && timerIndex === i
                      ? `Resend email in ${resendTime}`
                      : "Resend Email"} */}
                  </Button>
                </div>
              ) : (
                //
                <div className="participantOnboardStatus">
                  <Typography.Text>Participant didn’t onboard</Typography.Text>
                </div>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      render: (user) => (
        <div className="flex crewUserStatus">
          <div className="crewUserStatusWrap">
            <Typography.Text className="crewEmail">
              {user?.email}
            </Typography.Text>
            <EditDeleteIconForUser user={user} />
          </div>
        </div>
      ),
    },
  ];

  const progresText = progressText(competition, container);

  const AddMemberButtonOnTop = () => {
    return (
      <div className="crewSectionHeader">
        {/* {showAddTeamMemberModalButton() && ( */}
        {!container?.lockRegistration && (
          <Button
            className="competitionPlaceholderButton"
            onClick={() => setOpenAddTeamMember(true)}
          >
            {`+ Members`}
          </Button>
        )}
        {/* // )} */}
        {competition?.minTeamSize && (
          <div className="textMembersStatusWrap">
            {container?.users?.length >= competition?.minTeamSize &&
              legalRegistration && (
                <CheckedGreenIcon className="bg-green-600" />
              )}
            <Typography.Text className="textMembersStatus flex items-center">
              {container?.users?.length >= competition?.minTeamSize
                ? `Minimum no. of team members has been ${
                    legalRegistration ? "met" : "invited"
                  }`
                : `A minimum of ${competition?.minTeamSize} team member${
                    competition?.minTeamSize > 1 ? "s" : ""
                  } has to be met`}
            </Typography.Text>
          </div>
        )}
      </div>
    );
  };

  const AddMemberAndSettingsButton = () => {
    const AddMember = () => {
      return (
        <Button
          className="buttonInviteMember"
          onClick={() => {
            competition?.competitionType !== "SOLO"
              ? competition?.teamSize
                ? setOpenAddTeamMember(true)
                : setVisibiltyTeamSizeModal(true)
              : setOpenAddTeamMember(true);
          }}
        >
          Invite{" "}
          {competition?.competitionType === "SOLO" ? "Participant" : "Members"}
        </Button>
      );
    };
    const OpenSettings = () => {
      return (
        <Button
          className="buttonInviteMember"
          onClick={() => setVisibiltyTeamSizeModal(true)}
        >
          Registration Settings
        </Button>
      );
    };

    const OpenSettingsOrAddMember = () => {
      return (
        <div>
          {progresText?.condition === "notConfigured" ? (
            <OpenSettings />
          ) : (
            showAddTeamMemberModalButton(true) && <AddMember />
          )}
        </div>
      );
    };
    return (
      <div>
        {!readOnlyState &&
          (role === "CREW" ? (
            crewUser?.permissions?.manageRegistrations ? (
              <OpenSettingsOrAddMember />
            ) : null
          ) : (
            <OpenSettingsOrAddMember />
          ))}
      </div>
    );
  };

  const OpenRegistrationConfirmationModal = () => {
    Modal.confirm({
      title: "Do you want to open registrations?",
      // icon: <ExclamationCircleOutlined />,
      content:
        "Inviting this participant will require you to open registration",
      okText: "Open",
      onOk() {
        dispatch(
          updateCompetitionDetails({
            allowRegistration: true,
          })
        );
      },
      onCancel() {},
    });
  };
  return (
    <div>
      {!container || !container.users || !container.users.length ? (
        <div className="competitionPlaceholderBlock">
          <Image
            preview={false}
            width={200}
            height={200}
            alt="thumbnail"
            src={CONTAINER_SCORING_EMPTY_STATE}
          />
          <Typography.Text className="competitionPlaceholderBlockText">
            {!readOnlyState
              ? role === "CREW"
                ? crewUser?.permissions?.manageRegistrations
                  ? progresText.emptyText
                  : `No participant${
                      competition?.competitionType === "SOLO" ? "" : "s"
                    } ${
                      competition?.competitionType === "SOLO" ? "has" : "have"
                    } been assigned to this code`
                : progresText.emptyText
              : `No participant${
                  isTeamCompetition ? "s" : ""
                } registered under this ${
                  isTeamCompetition ? "teamcode" : "code"
                }`}
          </Typography.Text>
          {/* empty states buttons */}
          <AddMemberAndSettingsButton />
        </div>
      ) : (
        <div className="crewSection membersBlock">
          <div className="registrationCompletedHead">
            {/* {isTeamCompetition && legalRegistration && ( */}
            <>
              <div className="registrationCompletedHeadWrap">
                <ConfirmLockModal
                  isModalVisible={visibleLockModal}
                  hideModal={() => setVisibleLockModal(false)}
                  onConfirm={() => {
                    handleLockRegistration();
                    setVisibleLockModal(false);
                  }}
                  deleteState={true}
                  locked={container?.lockRegistration}
                  description="Are you sure you want to lock registration?"
                />
                {competition.status !== "CONCLUDED" && (
                  <Button
                    className="buttonRegistration"
                    // onClick={() => handleLockRegistration()}
                    onClick={() => setVisibleLockModal(true)}
                  >
                    {container?.lockRegistration ? (
                      <UnlockedIcon />
                    ) : (
                      <LockedIcon />
                    )}{" "}
                    {container?.lockRegistration ? "Unlock" : "Lock"}{" "}
                    Registration
                  </Button>
                )}
                {/* <Popconfirm
                  title={
                    container?.lockRegistration
                      ? "Do you want to unlock registration?"
                      : "Do you want to lock registration?"
                  }
                  okText="Yes"
                  onConfirm={() => handleLockRegistration()}
                >
                  <Button
                    className="buttonRegistration"
                    // onClick={() => handleLockRegistration()}
                  >
                    {container?.lockRegistration ? (
                      <UnlockedIcon />
                    ) : (
                      <LockedIcon />
                    )}{" "}
                    {container?.lockRegistration ? "Unlock" : "Lock"} Registration
                  </Button>
                </Popconfirm> */}
                {isTeamCompetition && membersLeft ? (
                  <div className="membersMobileBlock">
                    {!readOnlyState && (
                      <div>
                        {role === "CREW" ? (
                          crewUser?.permissions?.manageRegistrations ? (
                            <AddMemberButtonOnTop />
                          ) : null
                        ) : (
                          <AddMemberButtonOnTop />
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="codeAssignedNote">
                    <div className="crewSectionHeader">
                      <div className="textMembersStatusWrap">
                        {container?.users?.length && (
                          <>
                            {legalRegistration &&
                            container?.lockRegistration ? (
                              <>
                                <CheckedGreenIcon className="bg-green-600" />
                                <Typography.Text className="textMembersStatus flex items-center">
                                  Registration completed
                                </Typography.Text>
                              </>
                            ) : (
                              <>
                                <EllipsisOutlined className="statusIcon" />
                                <Typography.Text className="textMembersStatus flex items-center">
                                  Code has been assigned
                                </Typography.Text>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
            {/* // )} */}

            {/* {isTeamCompetition && membersLeft ? (
              <div className="membersMobileBlock">
                {!readOnlyState && (
                  <div>
                    {role === "CREW" ? (
                      crewUser?.permissions?.manageRegistrations ? (
                        <AddMemberButtonOnTop />
                      ) : null
                    ) : (
                      <AddMemberButtonOnTop />
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="codeAssignedNote">
                <div className="crewSectionHeader">
                  <div className="textMembersStatusWrap">
                    {container?.users?.length && (
                      <>
                        {legalRegistration && container?.lockRegistration ? (
                          <>
                            <CheckedGreenIcon className="bg-green-600" />
                            <Typography.Text className="textMembersStatus flex items-center">
                              Registration compleated
                            </Typography.Text>
                          </>
                        ) : (
                          <>
                            <EllipsisOutlined className="statusIcon" />
                            <Typography.Text className="textMembersStatus flex items-center">
                              Code has been assigned
                            </Typography.Text>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )} */}
          </div>
          <div className="membersBlockDirection">
            <Table columns={column} dataSource={container?.users || []} />
            {isTeamCompetition && !container?.lockRegistration ? (
              <ProgressBar competition={competition} container={container} />
            ) : (
              competition?.status !== "ACTIVE" &&
              container?.users.length && (
                <div>
                  {/* {findRegisteredUsers(container?.users).userRegistered > 0 ? (
                    <Typography.Text>Participant onboard</Typography.Text>
                  ) : (
                    <Typography.Text>
                      Participant did not onboard
                    </Typography.Text>
                  )} */}
                </div>
              )
            )}
          </div>
        </div>
      )}
      <AddTeamMemberModal
        user={selectedUser}
        setUser={setSelectedUser}
        isTeamCompetition={isTeamCompetition}
        type={modalType}
        setType={setModalType}
        crudMember={crudMember}
        setOpenAddTeamMember={setOpenAddTeamMember}
        setIsDeleteMemberModalVisible={setIsDeleteMemberModalVisible}
        openAddTeamMember={openAddTeamMember}
        container={container}
        checkUser={checkUser}
        resendInviteEmail={resendInviteEmail}
        competition={competition}
        checkUserError={checkUserError}
        emailValidationStatus={emailValidationStatus}
        setEmailValidationStatus={setEmailValidationStatus}
      />
      <DeleteMemberModal
        setSelectedUser={setSelectedUser}
        isModalVisible={isDeleteMemberModalVisible}
        setIsModalVisible={setIsDeleteMemberModalVisible}
        onSubmit={() => {
          selectedUser && crudMember(selectedUser, "DELETE");
          setSelectedUser({});
          setIsDeleteMemberModalVisible(false);
          setModalType("ADD");
        }}
      />
    </div>
  );
}
