import {
  Avatar,
  Button,
  Form,
  Image,
  Input,
  Select,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppCustomPicker } from "../../components/";

import UsersForm from "./usersForm";

import { notify } from "../../Redux/Actions/notificationActions";
import { checkMember } from "../../requests/competition";
import {
  checkContainerName,
  userPresentInContainer,
} from "../../requests/container";
import { checkEmail } from "../../requests/user";
import Api from "../../services";
import {
  getUniqueId,
  isBelongToSameInstitute,
  isValidEmail,
} from "../../utility/common";
import { getGuidelines } from "./authRegistrations";
import CompleteRegistration from "./completeRegistration";
const ERROR_MESSAGES = Object.freeze({
  CONTAINER_NAME_PRESENT: "",
});

const RegisterParticipants = ({
  room,
  competition,
  token,
  pusher,
  containers,
  institutes,
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [updatedOrCreatedContainer, setUpdatedOrCreatedContainer] =
    useState(null);
  const [containerData, setContainerData] = useState({
    containerName: "",
    imageURL: null,
    emojiObject: null,
  });
  const [containerUser, setContainerUser] = useState({
    users: [
      {
        id: getUniqueId(),
        firstName: "",
        lastName: "",
        email: "",
        institute: null,
        imageURL: null,
        lock: {
          firstName: false,
          lastName: false,
          institute: false,
        },
      },
    ],
  });
  const [isAddMoreDisabled, setAddMoreDisabled] = useState(true);
  const [containerDataError, setContainerDataError] = useState({
    containerName: "",
    imageURL: "",
  });
  const [filteredContainers, setFilteredContainers] = useState([]);
  const [submitWasInitiated, setSubmitInitiation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useContainerCodePreDefined, setUseContainerCodePreDefined] =
    useState();

  useEffect(() => {
    if (containers && containers.length) {
      const containerWithNoUserAssigned = containers.filter(
        (cnt) => cnt.users.length === 0
      );
      setFilteredContainers(containerWithNoUserAssigned);
    }
  }, [containers]);

  useEffect(() => {
    setUseContainerCodePreDefined(
      competition?.useContainerCodePreDefined &&
        filteredContainers?.length !== 0
    );
  }, [filteredContainers, competition?.useContainerCodePreDefined]);

  const getTeamSizeLeft = () => {
    if (competition?.competitionType === "SOLO") {
      return 0;
    } else {
      return competition?.teamSize - containerUser.users.length;
    }
  };

  const validateContainerNameRule = async ({
    e,
    targetValue = null,
    onValidationSuccess = () => null,
    onValidationFailed = () => null,
    fromSelect = false,
  }) => {
    try {
      const value = targetValue || e?.target?.value;
      if (!value)
        throw new Error(
          useContainerCodePreDefined
            ? "Please select an unique code"
            : "Please enter an unique code"
        );
      if (fromSelect) {
        const containerCodeselected = filteredContainers.find(
          (cnt) => cnt.containerCode === targetValue
        );
        setContainerData({
          containerName: containerCodeselected.containerName,
          containerCode: containerCodeselected.containerCode,
        });
      } else {
        setContainerData({ ...containerData, containerName: value });
      }
      if (!useContainerCodePreDefined) {
        const isContainerPresent = await checkContainerName(
          value,
          competition.competitionCode
        );
        if (!isContainerPresent)
          throw new Error("Register with a unique code!");

        setContainerDataError({
          ...containerDataError,
          containerName: "",
        });
      }
      setAddMoreDisabled(false);
      onValidationSuccess();
    } catch (error) {
      setAddMoreDisabled(true);

      setContainerDataError({
        ...containerDataError,
        containerName: error.message,
      });
      onValidationFailed();
    }
  };

  const emailRule = [
    ({ getFieldValue }) => ({
      validator(data, email) {
        setAddMoreDisabled(true);

        if (!email) return Promise.reject("Please enter an email");

        if (!isValidEmail(email))
          return Promise.reject("Please enter a valid Email!");

        const userId = data.field.split("-")[1];
        if (email && isValidEmail(email)) {
          async function defaultCase() {
            return userPresentInContainer(
              competition?.competitionCode,
              email
            ).then((result) => {
              if (
                result?.isPresent &&
                result?.container?.containerCode !==
                  containerData?.containerCode
              ) {
                return Promise.reject(
                  "This email has been added to another team!"
                );
              } else {
                return checkEmail(email).then((response) => {
                  if (response) {
                    form.setFieldsValue({
                      [`firstName-${userId}`]: response.firstName,
                      [`lastName-${userId}`]: response.lastName,
                      [`institute-${userId}`]: response.institute,
                    });
                    containerUser.users.forEach((user) => {
                      if (user.id === userId) {
                        user.email = email;
                        user.userCode = response.userCode;
                        user.firstName = response.firstName;
                        user.lastName = response.lastName;
                        user.institute = {
                          institute: response.institute,
                          isActive: Boolean(
                            institutes.find(
                              (institute) =>
                                institute.instituteName === response.institute
                            )
                          ),
                        };
                        user.lock.firstName = true;
                        user.lock.lastName = true;
                        user.lock.institute = true;
                      }
                    });
                    form.validateFields([`institute-${userId}`]);
                    setContainerUser({ ...containerUser });
                    setAddMoreDisabled(false);
                  } else {
                    let activeInstitute = null;
                    if (competition?.isBelongsToSameOrgOrInstitute) {
                      activeInstitute = containerUser.users.length
                        ? containerUser.users[0]
                        : null;

                      // this is to prevent setting of institute to non slamitt user on submit
                      if (activeInstitute && !submitWasInitiated)
                        form.setFieldsValue({
                          [`institute-${userId}`]:
                            activeInstitute?.institute?.institute,
                        });
                    }
                    let userCodeAlreadySetToNull = false;
                    containerUser.users.forEach((user) => {
                      if (user.id === userId) {
                        user.email = email;
                        user.userCode = null;

                        user.lock.firstName = false;
                        user.lock.lastName = false;
                        // user.lock.institute = Boolean(activeInstitute);
                        user.lock.institute = false;
                        userCodeAlreadySetToNull = true;

                        // this is to prevent setting of institute to non slamitt user on submit
                        if (!submitWasInitiated) {
                          user.institute = activeInstitute
                            ? {
                                institute:
                                  activeInstitute?.institute?.institute,
                                isActive: activeInstitute?.institute?.isActive,
                              }
                            : null;
                        }
                      }
                    });
                    setContainerUser(
                      userCodeAlreadySetToNull
                        ? { ...containerUser }
                        : containerUser
                    );
                    form.validateFields([`institute-${userId}`]);
                    setAddMoreDisabled(false);
                  }
                  validateOtherFieldsOnEmailChange(userId);
                });
              }
            });
          }

          const duplicateEmails = containerUser?.users?.filter(
            (user, i) => user.email === email
          );
          return checkMember(competition?.competitionCode, email).then(
            ({ message }) => {
              if (
                duplicateEmails.length > 1 &&
                containerUser?.users?.length > 1
              ) {
                return Promise.reject(
                  "Team member email IDs need to be unique"
                );
              } else {
                switch (message) {
                  case "ORGANIZER":
                    return Promise.reject(
                      "Organising member cannot be added as a participant"
                    );
                  case "CREW_MEMBER":
                    return Promise.reject(
                      "Organising member cannot be added as a participant"
                    );
                  case "PARTICIPANT":
                    return Promise.reject("This Member has already been added");
                  default:
                    defaultCase();
                }
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
        setAddMoreDisabled(true);

        if (value) {
          const userId = data.field.split("-")[1];
          const uniqueInstituteList = [
            ...new Set(
              containerUser?.users
                ?.filter(({ institute }) => institute)
                .map(({ institute }) => institute.institute)
            ),
          ];

          const isBelongsToSameOrgOrInstitute = isBelongToSameInstitute(
            institutes,
            uniqueInstituteList
          );
          if (
            competition?.isBelongsToSameOrgOrInstitute &&
            !isBelongsToSameOrgOrInstitute
          ) {
            return Promise.reject(
              "This user belongs to a different institute/Organisation"
            );
          }
          setAddMoreDisabled(false);
          return Promise.resolve();
        } else {
          return Promise.reject("Please select an institute");
        }
      },
    }),
  ];

  const validateOtherFieldsOnEmailChange = (userId) => {
    containerUser.users.forEach((usr, idx) => {
      if (usr.id !== userId && idx !== 0) {
        form.validateFields([`institute-${usr.id}`]);
        // form.validateFields([`email-${usr.id}`]);
      }
    });
  };

  const validateAllOnSubmit = () => {
    setSubmitInitiation(true);
    const validationPromise = new Promise((resolve, reject) => {
      validateContainerNameRule({
        targetValue: containerData.containerName,
        onValidationSuccess: () => {
          resolve();
        },
        onValidationFailed: () => {
          reject();
        },
      });
    });

    const finalValidationPromise = new Promise((resolve, reject) => {
      if (competition?.competitionType === "TEAM") {
        if (
          competition?.minTeamSize &&
          containerUser.users.length < competition?.minTeamSize
        ) {
          dispatch(
            notify({
              message: `Legal team size of ${competition?.minTeamSize} has not been met`,
              type: "error",
            })
          );
          return reject("You didn't fulfill the min team size");
        } else if (
          !competition?.minTeamSize &&
          containerUser.users.length < competition?.teamSize
        ) {
          dispatch(
            notify({
              message: `Legal team size of ${competition?.teamSize} has not been met`,
              type: "error",
            })
          );

          return reject("You didn't fulfill the team size");
        }
      }
      return resolve(1);
    });

    Promise.all([
      form.validateFields(),
      validationPromise,
      finalValidationPromise,
    ])
      .then(onSubmit)
      .catch((e) => {
        setSubmitInitiation(false);
        console.log("error", e);
      });
  };

  const onSubmit = async () => {
    const payload = {
      ...containerData,
      competitionCode: competition?.competitionCode,
      roomCode: room?.roomCode,
      publicRegistration: true,
      users: containerUser.users.map((u) => {
        return {
          ...u,
          firstName:
            u.firstName || form.getFieldValue(`firstName-${u.id}`) || "",
          lastName: u.lastName || form.getFieldValue(`lastName-${u.id}`) || "",
          institute: u.institute?.institute,
        };
      }),
    };

    // get existing container
    const oldContainer = await Api.get(
      `/container/get-single-container/${payload?.containerCode}`
    );

    // if container is not present then create new container
    const createContainerWithUsers = async () => {
      const response = await Api.post(
        "/container/create-container-participant",
        payload
      );
      if (response && response.code && response.result) {
        setUpdatedOrCreatedContainer({ ...response.result });
        // dispatch(notify({ message: response.message, type: "success" }));
      } else {
        dispatch(notify({ message: response.message, type: "error" }));
      }
      setLoading(false);
    };

    // if container is present then update container
    const updateContainerWithUsers = async () => {
      delete payload.containerName;
      const response = await Api.update(
        `/container/${payload?.containerCode}`,
        payload,
        {
          Authorization: token ? `Bearer ${token}` : null,
          "Content-Type": "application/json",
        }
      );
      if (response && response.code && response.result) {
        setUpdatedOrCreatedContainer({ ...response.result, ...payload });
        // dispatch(notify({ message: response.message, type: "success" }));
      } else {
        dispatch(notify({ message: response.message, type: "error" }));
      }
      setLoading(false);
    };
    setLoading(true);
    // if container is present then update container else create new container
    if (oldContainer?.result?.containerCode) {
      updateContainerWithUsers();
    } else {
      createContainerWithUsers();
    }
  };

  return (
    <>
      <div className="registrationFormPage" id="content">
        <div className="registrationFormPageContainer">
          {updatedOrCreatedContainer ? (
            updatedOrCreatedContainer?.containerName && (
              <CompleteRegistration
                competition={competition}
                container={updatedOrCreatedContainer}
              />
            )
          ) : (
            <div
              className="registrationFormPageHolder h-screen overflow-y-scroll"
              style={{ display: "block" }}
            >
              <div className="registrationFormPageContent">
                <>
                  <div className="registrationFormHeader">
                    <div className="registrationFormAvatar">
                      {competition?.emojiObject ? (
                        <p
                          className="competitionSidebarTitleEmoji"
                          style={{
                            fontSize: "2.5rem",
                          }}
                        >
                          {competition?.emojiObject.emoji}
                        </p>
                      ) : (
                        <Image
                          src={competition?.imageURL}
                          preview={false}
                          width={100}
                          heigth={100}
                          alt="img"
                        />
                      )}
                    </div>
                    <div className="registrationFormHeaderTextbox">
                      <Typography.Text className="registrationCompetitionName">
                        {competition?.competitionName}
                      </Typography.Text>
                      <Typography.Text className="registrationCompetitionCategory">
                        <Avatar src={competition?.category?.imageUrl} />
                        {competition?.category?.categoryName}
                      </Typography.Text>
                    </div>
                  </div>

                  <div className="registrationFormContent">
                    {/* Guidelines */}
                    <div className="">
                      <div className="registrationFormGuideline">
                        <Typography.Text className="registrationFormGuidelineTitle">
                          Guidelines:
                        </Typography.Text>
                        <div className="flex flex-col justify-start">
                          {getGuidelines(competition)?.map(
                            (element) => element
                          )}
                        </div>
                      </div>
                      <div className="registrationFormSubHeader">
                        <Typography.Text className="registrationCompetitionTitle">
                          {/* Register as a{" "}
                          {competition?.competitionType
                            ? "Team"
                            : "Participant"} */}
                          Complete your registration
                        </Typography.Text>
                        <Typography.Text className="registrationCompetitionInfo">
                          Once you register only the organiser of the
                          competition will be able to update your registrations
                          details
                        </Typography.Text>
                      </div>
                    </div>
                    {/* <Form form={form2}>
                      <ContainerForm />
                    </Form> */}
                    <div className="registrationFormCodeField">
                      {!useContainerCodePreDefined && (
                        <AppCustomPicker
                          imgStyle={{
                            marginTop: "1rem",
                            height: "4rem",
                            width: "4rem",
                            cursor: useContainerCodePreDefined
                              ? "default"
                              : "pointer",
                          }}
                          emojiStyle={{
                            fontSize: "3rem",
                            lineHeight: "1.2",
                            cursor: useContainerCodePreDefined
                              ? "default"
                              : "pointer",
                          }}
                          className="tabset"
                          popOverClass="m-5"
                          tabpaneClass="m-5"
                          onImageSelected={(image) => {
                            if (image.type === "EMOJI")
                              setContainerData({
                                ...containerData,
                                emojiObject: image.emoji,
                                imageURL: null,
                              });
                            else
                              setContainerData({
                                ...containerData,
                                imageURL: image.url,
                                emojiObject: null,
                              });
                          }}
                          defaultValue={{
                            type: containerData?.emojiObject ? "EMOJI" : "LINK",
                            url: containerData?.imageURL || "",
                            emoji: containerData?.emojiObject || "",
                          }}
                          showClearButton={false}
                          disabled={useContainerCodePreDefined}
                        />
                      )}
                      <div className="codeInputField">
                        {useContainerCodePreDefined ? (
                          <Form.Item
                            name={`containerName`}
                            help={containerDataError.containerName}
                            validateStatus={
                              containerDataError.containerName
                                ? "error"
                                : "success"
                            }
                          >
                            <Select
                              name={"containerName"}
                              showArrow={false}
                              filterOption={false}
                              placeholder={`Please select a ${
                                competition?.competitionType === "TEAM"
                                  ? "Team"
                                  : "Participant"
                              } ID`}
                              onSearch={(value) => {}}
                              onSelect={(value) => {
                                validateContainerNameRule({
                                  targetValue: value,
                                  fromSelect: true,
                                });
                              }}
                            >
                              {filteredContainers.map((cnt) => (
                                <Select.Option
                                  key={cnt.containerName}
                                  value={cnt.containerCode}
                                >
                                  <div className="flex items-center">
                                    {cnt?.emojiObject ? (
                                      <p
                                        className="regTeamEmoji"
                                        style={{ fontSize: "1.25rem" }}
                                      >
                                        {cnt?.emojiObject?.emoji}
                                      </p>
                                    ) : (
                                      <Avatar
                                        className="regTeamAvatar"
                                        src={cnt?.imageURL}
                                      />
                                    )}
                                    <Typography.Text className="regTeamCode">
                                      {cnt?.containerName}
                                    </Typography.Text>
                                  </div>
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        ) : (
                          <div>
                            <Form.Item
                              name="containerName"
                              help={containerDataError.containerName}
                              validateStatus={
                                containerDataError.containerName
                                  ? "error"
                                  : "success"
                              }
                            >
                              <Input
                                // autoFocus={true}
                                value={containerData.containerName}
                                onFocus={(e) => {
                                  // this is for issue of autocomplete as most browsers ignore feature of autocomplet=false
                                  if (e.target.hasAttribute("readonly")) {
                                    e.target.removeAttribute("readonly");
                                    // fix for mobile safari to show virtual user.idboard
                                    e.target.blur();
                                    e.target.focus();
                                  }
                                }}
                                type="text"
                                placeholder={
                                  competition?.competitionType === "TEAM"
                                    ? "Team ID"
                                    : "Participant ID"
                                }
                                onBlur={(e) => validateContainerNameRule({ e })}
                                onPressEnter={(e) =>
                                  validateContainerNameRule({ e })
                                }
                              />
                            </Form.Item>
                          </div>
                        )}
                      </div>
                    </div>

                    <Form form={form}>
                      <div className="">
                        {containerUser?.users?.map((user, i) => (
                          <UsersForm
                            key={user.id}
                            user={user}
                            form={form}
                            institutes={institutes}
                            emailRule={emailRule}
                            instituteRule={instituteRule}
                            setContainerUser={setContainerUser}
                            containerUser={containerUser}
                            membersLength={getTeamSizeLeft()}
                            index={i}
                          />
                        ))}

                        {/* {competition?.competitionType === "TEAM" && (
                          <ProgressBar
                            competition={competition}
                            container={containerUser}
                          />
                        )} */}

                        <div className="registrationFormButtons">
                          {getTeamSizeLeft() ? (
                            <Button
                              type="secondary"
                              disabled={isAddMoreDisabled || loading}
                              onClick={() => {
                                const firstUsersInstitute =
                                  containerUser?.users[0]?.institute;
                                setContainerUser({
                                  users: [
                                    ...containerUser.users,
                                    {
                                      id: getUniqueId(),
                                      firstName: "",
                                      lastName: "",
                                      email: "",
                                      institute:
                                        competition?.isBelongsToSameOrgOrInstitute
                                          ? firstUsersInstitute
                                          : null,
                                      lock: {
                                        firstName: false,
                                        lastName: false,
                                        institute: false,
                                      },
                                    },
                                  ],
                                });
                                setAddMoreDisabled(true);
                              }}
                            >{`+ADD TEAM MEMBER (${getTeamSizeLeft()})`}</Button>
                          ) : (
                            <div />
                          )}
                          <Button
                            type="primary"
                            onClick={validateAllOnSubmit}
                            // htmlType="submit"

                            disabled={loading}
                          >
                            {loading ? (
                              <div className="loader-icon" />
                            ) : (
                              "Register"
                            )}
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </div>
                </>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RegisterParticipants;
