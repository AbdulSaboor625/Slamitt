import { Avatar, Button, Form, Image, Input, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppCustomPicker } from "../../components/";

import { checkMember } from "../../requests/competition";
import { userPresentInContainer } from "../../requests/container";
import { checkEmail } from "../../requests/user";

import { notify } from "../../Redux/Actions/notificationActions";

import Api from "../../services";

import {
  getUniqueId,
  isBelongToSameInstitute,
  isValidEmail,
} from "../../utility/common";

import { useRouter } from "next/router";
import { updateUser } from "../../Redux/Actions";
import { routeGenerator, routes } from "../../utility/config";
import CompleteRegistration from "./completeRegistration";
import UsersForm from "./usersForm";

export const getGuidelines = (competition) => {
  const guidelines = [];
  const GuidelinesWrapper = ({ children }) => (
    <Typography.Text className="registrationFormGuidelineText">
      {children}
    </Typography.Text>
  );
  if (competition?.competitionType === "SOLO") {
    guidelines.push(
      <GuidelinesWrapper>This is a solo competition</GuidelinesWrapper>
    );

    if (competition?.useContainerCodePreDefined) {
      guidelines.push(
        <GuidelinesWrapper>
          Choose a Participant ID from given list of IDs
        </GuidelinesWrapper>
      );
    } else {
      guidelines.push(
        <GuidelinesWrapper>
          Come up with your own participant ID
        </GuidelinesWrapper>
      );
    }
  } else {
    if (competition?.useContainerCodePreDefined) {
      guidelines.push(
        <GuidelinesWrapper>
          Choose a Team ID from given list of IDs
        </GuidelinesWrapper>
      );
    } else {
      guidelines.push(
        <GuidelinesWrapper>Come up with your own Team ID</GuidelinesWrapper>
      );
    }
    if (competition?.minTeamSize) {
      guidelines.push(
        <GuidelinesWrapper>
          Register with a{" "}
          <span className="text-primary">
            minimum of {competition?.minTeamSize}{" "}
            {competition?.minTeamSize > 1 ? "participants" : "participant"}
          </span>{" "}
          and maximum of {competition?.teamSize} participants
        </GuidelinesWrapper>
      );
    } else {
      guidelines.push(
        <GuidelinesWrapper>
          {`Register with a team size of ${competition?.teamSize} participants`}
        </GuidelinesWrapper>
      );
    }
    if (competition?.isBelongsToSameOrgOrInstitute) {
      guidelines.push(
        <GuidelinesWrapper>
          Team members need to belong to the same organisation/institute
        </GuidelinesWrapper>
      );
    } else {
      guidelines.push(
        <GuidelinesWrapper>
          Team members can belong to different organisation/institutes
        </GuidelinesWrapper>
      );
    }
  }
  return guidelines;
};

const RegisterParticipants = ({
  room,
  competition,
  pusher,
  containers,
  institutes,
  containerCode,
  invitedUser,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [form] = Form.useForm();
  const user = useSelector((state) => state.auth.user);
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
          email: false,
          firstName: false,
          lastName: false,
          institute: false,
        },
      },
    ],
  });
  const [isAddMoreDisabled, setAddMoreDisabled] = useState(true);

  const [submitWasInitiated, setSubmitInitiation] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkUserValidation = async () => {
    if (containerCode && invitedUser && containers?.length) {
      const container = containers.find(
        (cnt) => cnt.containerCode === containerCode
      );
      if (container) {
        setContainerData({
          containerName: container.containerName,
          containerCode: container.competitionCode,
          emojiObject: container.emojiObject,
          imageURL: container.imageURL,
        });
        const firstUsersID = containerUser.users[0].id;

        //check if user already present then use his default details
        const user = await checkEmail(invitedUser.email);
        form.setFieldsValue({
          [`email-${firstUsersID}`]: invitedUser.email || "",
          [`firstName-${firstUsersID}`]:
            user.firstName || invitedUser.firstName || "",
          [`lastName-${firstUsersID}`]:
            user.lastName || invitedUser.lastName || "",
          [`institute-${firstUsersID}`]:
            user.institute || invitedUser.institute || null,
        });

        const adminUser = {
          id: containerUser.users[0].id,
          email: invitedUser.email || "",
          firstName: user.firstName || invitedUser.firstName || "",
          lastName: user.lastName || invitedUser.lastName || "",
          institute: user.institute || invitedUser.institute || null,
          lock: {
            email: true,
            firstName: Boolean(user.firstName || invitedUser.firstName),
            lastName: Boolean(user.lastName || invitedUser.lastName),
            institute: Boolean(user.institute || invitedUser.institute),
          },
        };

        setContainerUser({
          users: [adminUser],
        });

        if (
          adminUser.lock.firstName &&
          adminUser.lock.institute &&
          container.containerName
        )
          setAddMoreDisabled(false);
        else setAddMoreDisabled(true);
      }
    }
  };

  useEffect(() => {
    checkUserValidation();
  }, [containerCode, invitedUser, containers]);

  const getTeamSizeLeft = () => {
    if (competition?.competitionType === "SOLO") {
      return 0;
    } else {
      return competition?.teamSize - containerUser.users.length;
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
          // setting the email to the field for further valdation making sure memory location is not updated,if updated component will get destroyed and rebuilt
          containerUser.users.forEach((user) => {
            if (user.id === userId) {
              user.email = email;
            }
          });
          async function defaultCase() {
            const result = await userPresentInContainer(
              competition?.competitionCode,
              email
            );
            if (
              result?.isPresent &&
              result?.container?.containerCode !== containerCode
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
                        institute: response.institute
                          ? response.institute
                          : user?.institute?.institute,
                        isActive: Boolean(
                          institutes.find(
                            (institute) =>
                              institute.instituteName ===
                              (response.institute || user?.institute?.institute)
                          )
                        ),
                      };
                      user.lock.firstName = true;
                      user.lock.lastName = true;
                      user.lock.institute = Boolean(response?.institute);
                    }
                    if (!response?.institute) {
                      form.setFieldsValue({
                        [`institute-${user.id}`]: user?.institute?.institute,
                      });
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
                              institute: activeInstitute?.institute?.institute,
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
                // validateOtherFieldsOnEmailChange(userId);
                return Promise.resolve();
              });
            }
          }

          const duplicateEmails = containerUser?.users?.filter(
            (user, i) => user.email === email
          );

          if (duplicateEmails.length > 1 && containerUser?.users?.length > 1) {
            setContainerUser(containerUser);
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
        setAddMoreDisabled(true);

        if (value) {
          const userId = data.field.split("-")[1];
          const uniqueInstituteList = [
            ...new Set(
              containerUser?.users
                ?.filter(({ institute }) => institute)
                .map(({ institute }) =>
                  typeof institute === "string"
                    ? institute
                    : institute.institute
                )
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

    // this wrapper is provided since the form validation promise handling was having library issues
    const formPromiseWrapper = new Promise((resolve, reject) => {
      return form
        .validateFields()
        .then(() => resolve())
        .catch((e) => {
          if (e.errorFields.length === 0 && e.outOfDate) return resolve();
          return reject();
        });
    });

    Promise.all([formPromiseWrapper, finalValidationPromise])
      .then(onSubmit)
      .catch((e) => {
        setSubmitInitiation(false);
        console.log("error", e);
      });
  };

  const onSubmit = async () => {
    const payload = {
      ...containerData,
      containerCode,
      competitionCode: competition?.competitionCode,
      roomCode: room?.roomCode,
      invitedUserEmail: containerUser.users[0].email,
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

    // if container is present then update container
    const updateContainerWithUsers = async () => {
      delete payload.containerName;
      const response = await Api.post(
        `/container/invited-container-update/`,
        payload
      );
      if (response && response.code && response.result) {
        const res = await Api.get(`/user/${user?.userCode}`);
        if (res?.result) dispatch(updateUser({ user: res.result }));
        router.replace(
          routeGenerator(
            routes.competitionParticipated,
            {
              competitionCode: competition?.competitionCode,
            },
            true
          )
        );
        setUpdatedOrCreatedContainer({ ...response.result, ...payload });
        dispatch(notify({ message: response.message, type: "success" }));
      } else {
        if (response?.message === "Team not found!") {
          dispatch(
            notify({ message: "Invitation has expired", type: "error" })
          );
        } else dispatch(notify({ message: response.message, type: "error" }));
      }
      setLoading(false);
    };
    setLoading(true);
    // if container is present then update container
    if (oldContainer?.result?.containerCode) {
      updateContainerWithUsers();
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
                          competition will be able to update your details
                        </Typography.Text>
                      </div>
                    </div>

                    <div className="registrationFormCodeField">
                      <AppCustomPicker
                        imgStyle={{
                          marginTop: "1rem",
                          height: "4rem",
                          width: "4rem",
                          cursor: "default",
                        }}
                        emojiStyle={{
                          fontSize: "3rem",
                          lineHeight: "1.2",
                          cursor: "default",
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
                        disabled={true}
                      />
                      <div className="codeInputField">
                        <Input
                          value={containerData.containerName}
                          type="text"
                          placeholder={
                            competition?.competitionType
                              ? "Team ID"
                              : "Participant ID"
                          }
                          disabled={true}
                        />
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
