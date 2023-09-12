import { EllipsisOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Form,
  Input,
  Select,
  Spin,
  Table,
  Typography,
} from "antd";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notify, updateContainer } from "../../../../Redux/Actions";
import useMediaQuery from "../../../../hooks/useMediaQuery";
import { checkMember } from "../../../../requests/competition";
import { userPresentInContainer } from "../../../../requests/container";
import { fetchInstitutes } from "../../../../requests/institutes";
import { checkEmail } from "../../../../requests/user";
import Api from "../../../../services";
import {
  checkLegalRegistration,
  findRegisteredUsers,
  getInitials,
  isBelongToSameInstitute,
  isValidEmail,
} from "../../../../utility/common";
import {
  CheckedGreenIcon,
  DeleteIcon,
  InstituteIcon,
  LockedIcon,
  PlusNewIcon,
  UnlockedIcon,
} from "../../../../utility/iconsLibrary";
import AppModal from "../../../AppModal";
import ConfirmLockModal from "../../competitonsModule/confirmLockModal";
import ProgressBar from "../../competitonsModule/progressBar";
import {
  DeleteMemberModal,
  showStatus,
} from "../../competitonsModule/registration";

const InviteModal = ({
  isVisible,
  setVisible,
  form,
  onFinish,
  institutes,
  emailRule,
  instituteRule,
  disabledFields,
  setDisabledFields,
  container,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [originalInstituteList, setOriginalInstituteList] = useState([]);
  const [searchableInstituteList, setInstitutesList] = useState([]);

  useEffect(() => {
    if (institutes.length) {
      setOriginalInstituteList(institutes);
      setInstitutesList(institutes);
    }
  }, [institutes]);

  useEffect(() => {
    const filteredData = _.chain(originalInstituteList)
      .filter((item) =>
        item?.instituteName?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
      .sortBy("instituteName")
      .take(10)
      .value();
    setInstitutesList([
      ...filteredData,
      {
        instituteName: searchTerm,
        isActive: false,
        profession: "student",
        subProfession: "cgirhpyvay",
      },
    ]);
  }, [originalInstituteList, searchTerm]);

  const handleSearch = useCallback(
    (value) => {
      debouncedSearchTerm(value);
    },
    [debouncedSearchTerm]
  );

  const debouncedSearchTerm = _.debounce((value) => {
    setSearchTerm(value);
  }, 500);

  const onSelectInstitute = (e) => {
    const instituteData = JSON.parse(e);
    form.setFieldsValue({
      [`institute`]: instituteData.institute,
    });

    form.validateFields([`institute`]);
  };

  const validateAllOnSubmit = () => {
    const formPromiseWrapper = new Promise((resolve, reject) => {
      return form
        .validateFields()
        .then(() => resolve())
        .catch((e) => {
          if (e.errorFields.length === 0 && e.outOfDate) return resolve();
          return reject();
        });
    });

    Promise.all([formPromiseWrapper])
      .then(() => onFinish(form.getFieldsValue()))
      .catch((e) => {
        console.log("error", e);
      });
  };

  return (
    <AppModal
      className="assignTeamModalParent addTeamMemberModal"
      isVisible={isVisible}
      onCancel={() => {
        form.resetFields(["email", "firstName", "lastName", "institute"]);
        setDisabledFields({});
        setVisible(false);
      }}
    >
      <div className="assignTeamModal">
        <Typography.Title>
          Invite team member to {container?.containerName}
        </Typography.Title>
        <Form form={form}>
          <Form.Item name={`email`} rules={emailRule}>
            <Input
              onFocus={(e) => {
                // this is for issue of autocomplete as most browsers ignore feature of autocomplet=false
                if (e.target.hasAttribute("readonly")) {
                  e.target.removeAttribute("readonly");
                  // fix for mobile safari to show virtual user.idboard
                  e.target.blur();
                  e.target.focus();
                }
              }}
              type={"email"}
              placeholder="Email"
              suffix={null}
            />
          </Form.Item>

          <Form.Item
            name={`firstName`}
            rules={[
              { required: true, message: "PLease enter your first name" },
            ]}
          >
            <Input
              type={"text"}
              placeholder="First Name"
              disabled={disabledFields.firstName}
            />
          </Form.Item>
          <Form.Item name={`lastName`}>
            <Input
              type={"text"}
              placeholder="Last Name"
              disabled={disabledFields.lastName}
            />
          </Form.Item>
          <Form.Item name={`institute`} rules={instituteRule}>
            <Select
              showArrow={false}
              showSearch={true}
              filterOption={false}
              placeholder={"Choose Institute"}
              onSearch={handleSearch}
              onSelect={onSelectInstitute}
              disabled={disabledFields.institute}
            >
              {searchableInstituteList.map((option, idx) => (
                <Select.Option
                  key={idx}
                  value={JSON.stringify({
                    institute: option.instituteName,
                    isActive: option.isActive,
                  })}
                >
                  {option.instituteName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              // htmlType="submit"
              shape="round"
              onClick={validateAllOnSubmit}
            >
              {loading ? <div className="loader-icon" /> : "INVITE"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AppModal>
  );
};

const MyTeam = ({ container, competition, users }) => {
  const user = useSelector((state) => state.auth.user);
  const [form] = Form.useForm();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const dispatch = useDispatch();
  const [openAddTeamMemberModal, setOpenAddTeamMemberModal] = useState(false);
  const [legalRegistration, setLegalRegistration] = useState(false);
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const [disabledFields, setDisabledFields] = useState({
    firstName: false,
    lastName: false,
    institute: false,
  });

  useEffect(() => {
    setLegalRegistration(checkLegalRegistration(competition, container));
  }, [container]);
  useEffect(() => {
    fetchInstitutes().then((res) => res && setInstitutes(res));
  }, []);

  const emailRule = [
    ({ getFieldValue }) => ({
      validator(data, email) {
        if (!email) return Promise.reject("Please enter an email");

        if (!isValidEmail(email))
          return Promise.reject("Please enter a valid Email!");

        if (email && isValidEmail(email)) {
          async function defaultCase() {
            const result = await userPresentInContainer(
              competition?.competitionCode,
              email
            );
            if (
              result?.isPresent &&
              result?.container?.containerCode !== container?.containerCode
            ) {
              return Promise.reject(
                "This email has been added to another team!"
              );
            } else {
              return checkEmail(email).then((response) => {
                if (response) {
                  form.setFieldsValue({
                    [`firstName`]: response.firstName,
                    [`lastName`]: response.lastName,
                    [`institute`]: response.institute,
                  });
                  setDisabledFields({
                    firstName: true,
                    lastName: true,
                    institute: Boolean(response?.institute),
                  });

                  form.validateFields([`institute`]);
                } else {
                  if (competition?.isBelongsToSameOrgOrInstitute) {
                    form.setFieldsValue({
                      [`institute`]: users?.[0]?.institute,
                    });
                    setDisabledFields({
                      institute: Boolean(users?.[0]?.institute),
                    });

                    form.validateFields([`institute`]);
                  } else {
                    !form.isFieldsValidating() &&
                      form.resetFields(["firstName", "lastName", "institute"]);
                    setDisabledFields({
                      firstName: false,
                      lastName: false,
                      institute: false,
                    });
                  }
                }
                return Promise.resolve();
              });
            }
          }

          const duplicateEmails = users?.find(
            (user, i) => user.email === email
          );

          if (duplicateEmails && users?.length >= 1) {
            return Promise.reject("Team member email IDs need to be unique");
          }
          return checkMember(competition?.competitionCode, email).then(
            ({ message }) => {
              switch (message) {
                case "ORGANIZER":
                  return Promise.reject(
                    "Organising member cannot be added as a participant"
                  );
                case "CREW_MEMBER":
                  return Promise.reject(
                    "Organising member cannot be added as a participant"
                  );
                default:
                  return defaultCase();
              }
            }
          );
        }
      },
    }),
  ];

  const instituteRule = [
    ({ getFieldValue }) => ({
      validator(data, value) {
        if (value) {
          const uniqueInstituteList = [
            ...new Set(
              users
                ?.filter(({ institute }) => institute)
                .map(({ institute }) => institute)
            ),
          ];

          const isBelongsToSameOrgOrInstitute = isBelongToSameInstitute(
            institutes,
            [...uniqueInstituteList, value]
          );
          if (
            competition?.isBelongsToSameOrgOrInstitute &&
            !isBelongsToSameOrgOrInstitute
          ) {
            return Promise.reject(
              "This user belongs to a different institute/Organisation"
            );
          }
          return Promise.resolve();
        } else {
          return Promise.reject("Please select an institute");
        }
      },
    }),
  ];

  const handleLockRegistration = async () => {
    dispatch(
      updateContainer({
        containerCode: container?.containerCode,
        lockRegistration: true,
      })
    );
  };
  const handleUnLockRegistration = async () => {
    dispatch(
      updateContainer({
        containerCode: container?.containerCode,
        lockRegistration: false,
      })
    );
  };

  const deleterUser = async (user) => {
    try {
      const response = await Api.update(
        `/container/${container.containerCode}/crud-container-user`,
        {
          user,
          type: "DELETE",
          competitionCode: competition?.competitionCode,
        }
      );
    } catch (error) {
      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };

  const column = [
    {
      render: ({
        firstName,
        lastName,
        institute,
        status,
        User,
        userCode,
        imageURL,
      }) => (
        <div className="crewAvatarUser">
          {userCode ? (
            <div className="relative">
              <Avatar
                className="crewAvatar"
                src={
                  User?.imageURL ? (
                    User?.imageURL
                  ) : (
                    <Typography.Text>{getInitials(User)}</Typography.Text>
                  )
                }
              />
              <span className="absolute bottom-0 right-2">
                {isMobile &&
                  showStatus(
                    status || "INVITED",
                    "UPDATE",
                    competition?.status
                  )}
              </span>
            </div>
          ) : (
            <div className="relative">
              <Avatar
                className="crewAvatar"
                src={
                  imageURL ? (
                    imageURL
                  ) : (
                    <Typography.Text>
                      {getInitials({ firstName, lastName })}
                    </Typography.Text>
                  )
                }
              />
              <span className="absolute bottom-0 right-2">
                {isMobile &&
                  showStatus(
                    status || "INVITED",
                    "UPDATE",
                    competition?.status
                  )}
              </span>
            </div>
          )}

          <div className="crewInfo">
            <div className="flex items-center">
              {userCode ? (
                <Typography.Text className="crewName">
                  {User?.fName} {User?.lName}
                  {/* {status === "INVITED" ? "(Added)" : ""} */}
                </Typography.Text>
              ) : (
                <Typography.Text className="crewName">
                  {firstName} {lastName}
                  {/* {status === "INVITED" ? "(Added)" : ""} */}
                </Typography.Text>
              )}
              {!isMobile &&
                showStatus(status || "INVITED", "ADD", competition?.status)}
            </div>
            <Typography.Text className="crewInstitute">
              <InstituteIcon /> {userCode ? User?.institute_name : institute}
            </Typography.Text>
          </div>
        </div>
      ),
    },
    {
      render: (User) => (
        <div className="flex crewUserStatus">
          <div className="crewUserStatusWrap">
            <Typography.Text className="crewEmail">
              {User?.email}
            </Typography.Text>
          </div>
          {!container?.lockRegistration &&
            user?.userCode !== User?.userCode && (
              <DeleteIcon
                className="deleteButton"
                onClick={() => {
                  setSelectedUser(user);
                  setIsDeleteMemberModalVisible(true);
                }}
              />
            )}
        </div>
      ),
    },
  ];

  const addMember = async (user) => {
    setLoading(true);
    try {
      const response = await Api.update(
        `/container/${container.containerCode}/crud-container-user`,
        {
          user,
          type: "ADD",
          competitionCode: competition?.competitionCode,
        }
      );

      if (response.code && response.result) {
        setOpenAddTeamMemberModal(false);
        setDisabledFields({
          firstName: false,
          lastName: false,
          institute: false,
        });
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
    setLoading(false);
  };

  const TeamStatus = () => {
    return (
      <div className="myTeamStatusText">
        {competition?.minTeamSize &&
        container?.users?.length <= competition?.minTeamSize ? (
          <div className="flex items-center">
            {container?.users?.length >= competition?.minTeamSize &&
              legalRegistration && <CheckedGreenIcon className="iconGreen" />}
            <Typography.Text>
              {container?.users?.length >= competition?.minTeamSize
                ? `Minimum no. of team members has been ${
                    legalRegistration ? "met" : "invited"
                  }`
                : `A minimum of ${competition?.minTeamSize} team member${
                    competition?.minTeamSize > 1 ? "s" : ""
                  } has to be met`}
            </Typography.Text>
          </div>
        ) : (
          <div>
            {container?.users?.length && (
              <>
                {legalRegistration && container?.lockRegistration ? (
                  <div className="flex items-center">
                    <CheckedGreenIcon className="iconGreen" />
                    <Typography.Text className="textMembersStatus flex items-center">
                      Registration compleated
                    </Typography.Text>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <EllipsisOutlined className="statusIcon" />
                    <Typography.Text className="textMembersStatus flex items-center">
                      Code has been assigned
                    </Typography.Text>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };
  const handleLockModal = () => {
    if (!legalRegistration) {
      dispatch(
        notify({
          message: `You need ${
            competition?.minTeamSize
              ? competition?.minTeamSize -
                findRegisteredUsers(container?.users).userRegistered
              : competition?.teamSize -
                findRegisteredUsers(container?.users).userRegistered
          } more registered members in your team before you can lock your registration`,
          type: "error",
        })
      );
    } else {
      setVisible(true);
    }
  };

  // to make institue field in invite modal autofilled when configuration setting require to same Org/Inst
  useEffect(() => {
    if (competition?.isBelongsToSameOrgOrInstitute) {
      form.setFieldsValue({
        [`institute`]: container?.users?.[0]?.institute,
      });
      setDisabledFields({ ...disabledFields, institute: true });
    }
  }, [competition]);

  const [isDeleteMemberModalVisible, setIsDeleteMemberModalVisible] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="participantDashboardContent">
      <div className="crewSection membersBlock">
        {competition?.competitionType === "TEAM" && (
          <div className="flex items-center justify-between participantTeamTabHeader">
            <div className="membersBlockHeader">
              {competition?.teamSize > users?.length &&
                !container?.lockRegistration && (
                  <Button
                    className="buttonAdd"
                    onClick={() => setOpenAddTeamMemberModal(true)}
                  >
                    <PlusNewIcon /> Member
                  </Button>
                )}
              {competition?.status !== "CONCLUDED" &&
                !container?.lockRegistration && (
                  <>
                    <Button
                      className="buttonImportSubmission"
                      onClick={handleLockModal}
                    >
                      {
                        <>
                          <LockedIcon /> Lock Registration
                        </>
                        // : (
                        //   <>
                        //     <UnlockedIcon /> Unlock Registration
                        //   </>
                        // )
                      }
                    </Button>
                    {/* <Popconfirm
                    disabled={!legalRegistration}
                    title="Are you sure you want to lock registration?"
                    okText="Yes"
                    onConfirm={() => handleLockRegistration()}
                  >
                   
                  </Popconfirm> */}
                    <ConfirmLockModal
                      isModalVisible={visible}
                      hideModal={() => setVisible(false)}
                      onConfirm={() => {
                        !container?.lockRegistration
                          ? handleLockRegistration()
                          : null;
                        // handleUnLockRegistration();
                        setVisible(false);
                      }}
                      deleteState={true}
                      description={`Are you sure you want to ${
                        !container?.lockRegistration ? "lock" : "unlock"
                      } registration?`}
                      locked={container?.lockRegistration}
                    />
                  </>
                )}
            </div>
            <TeamStatus />
          </div>
        )}
        <Table columns={column} dataSource={users} />
        {competition?.competitionType === "TEAM" &&
          !container?.lockRegistration && (
            <ProgressBar competition={competition} container={container} />
          )}
      </div>
      <InviteModal
        isVisible={openAddTeamMemberModal}
        setVisible={setOpenAddTeamMemberModal}
        form={form}
        setDisabledFields={setDisabledFields}
        onFinish={(e) => {
          addMember(e);
        }}
        institutes={institutes}
        emailRule={emailRule}
        instituteRule={instituteRule}
        disabledFields={disabledFields}
        container={container}
        loading={loading}
      />
      <DeleteMemberModal
        setSelectedUser={setSelectedUser}
        isModalVisible={isDeleteMemberModalVisible}
        setIsModalVisible={setIsDeleteMemberModalVisible}
        onSubmit={() => {
          selectedUser && deleterUser(selectedUser);
        }}
      />
    </div>
  );
};

export default MyTeam;
