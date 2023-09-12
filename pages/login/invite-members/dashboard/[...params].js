import { Button, Form, Image, Layout, Typography } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, notify, signUpParticipant } from "../../../../Redux/Actions";
import { AppBar, FormField, TestimonialCarousel } from "../../../../components";
import withGuest from "../../../../components/RouteAuthHandler/withGuest";
import styles from "../../../../modules/login/login.module.scss";
import { getCompetition } from "../../../../requests/competition";
import Api from "../../../../services";
import { decodeBase64 } from "../../../../utility/common";
import { routeGenerator, routes } from "../../../../utility/config";
import { MailIcon } from "../../../../utility/iconsLibrary";
import {
  confirmPasswordRule,
  passwordRule,
  textRule,
} from "../../../../utility/validatationRules";
import RegistrationTestimonial from "../../../../components/TestimonialCarousel/registrationTestimonials";
import useMediaQuery from "../../../../hooks/useMediaQuery";

const InviteParticipantDashboardLogin = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
  });
  const { params = [], to = "" } = router.query;

  const isMobile = useMediaQuery();

  const [email, setEmail] = useState("");
  const loggedInUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [competition, setCompetition] = useState({});
  const [isPresent, setIsPresent] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [containerCode, setContainerCode] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const _decoded = params.length ? decodeBase64(params[0]) : {};

    if (
      _decoded &&
      _decoded.email &&
      _decoded.competitionCode &&
      _decoded.containerCode
    ) {
      setContainerCode(_decoded.containerCode);

      getCompetition(_decoded.competitionCode).then((res) => {
        res && setCompetition(res);
      });

      checkExistingUser(_decoded.email);

      checkUserContainer(_decoded.competitionCode, _decoded.email);
    }
    if (
      loggedInUser &&
      _decoded?.email &&
      loggedInUser.email !== _decoded.email
    ) {
      dispatch(
        notify({
          message:
            "You are logged in from another account, Please log out and try again!",
          type: "error",
        })
      );
      router.replace(routes.dashboard);
    }
  }, [params]);

  const checkUserContainer = async (competitionCode, email) => {
    const containerResponse = await Api.post(
      "/container/check-user-container",
      {
        competitionCode,
        email,
      }
    );

    if (
      containerResponse &&
      containerResponse.code &&
      containerResponse.result?.isPresent &&
      containerResponse.result?.container
    ) {
      const currentUser = containerResponse.result.container?.users.find(
        (u) => u.email === email
      );
      setIsPresent(containerResponse.result.isPresent);
      if (currentUser) {
        setUser(currentUser);
      }
    }
  };

  useEffect(() => {
    if (!user?.userCode && user?.firstName) {
      form.resetFields();
    }
  });

  const checkExistingUser = async (email) => {
    try {
      setEmail(email);
      const response = await Api.post(`/user/checkEmail`, {
        email,
      });
      if (response.code) {
        setIsExistingUser(true);
      } else {
        setIsExistingUser(false);
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
  };
  const onFinish = ({ firstName, lastName, password }) => {
    if (!isPresent) {
      dispatch(
        notify({ type: "error", message: "Your invitation has expired" })
      );
    }

    const route = () => {
      if (competition?.status === "ACTIVE") {
        if (to) {
          if (!isPresent) {
            return routeGenerator(routes.dashboard, null, true);
          } else return to;
        } else if (competition?.competitionCode)
          return routeGenerator(
            routes.competitionParticipated,
            {
              competitionCode: competition?.competitionCode,
            },
            true
          );
        else if (!competition?.competitionCode)
          return routeGenerator(routes.dashboard, null, true);
      } else {
        return routeGenerator(routes.dashboard, null, true);
      }
    };

    const payload = {
      firstName,
      lastName,
      email,
      password: password,
      containerCode,
      competitionCode: competition?.competitionCode || "",
      redirectRoute: route(),
    };

    if (isExistingUser) {
      dispatch(login(payload));
    } else {
      dispatch(signUpParticipant(payload));
    }
    if (competition?.status !== "ACTIVE") {
      dispatch(notify({ type: "error", message: "Invitation Expired" }));
    } else {
    }
  };

  const onResetPassword = async () => {
    router.replace(`${routes.forgotPassword}${email ? `?email=${email}` : ""}`);
  };

  return (
    <Layout>
      <Layout.Sider
        className={`onboardingSidebar mobile:hidden mobile:h-screen`}
      >
        <RegistrationTestimonial isMobile={isMobile} />
      </Layout.Sider>

      <Layout>
        <Layout.Header>
          <AppBar />
        </Layout.Header>
        <Layout.Content>
          <div className="slamittLogoIntro">
            <Image
              preview={false}
              src="https://rethink-competitions.s3.amazonaws.com/1668714261738_slamittlogo.svg"
              alt="Slamitt"
            />
          </div>
          <div className="userFormContent">
            <div className="userFormContainer">
              <div className={[styles.formContainer].join(" ")}>
                <div className={[styles.formHolder].join(" ")}>
                  <Typography.Title className={styles.headingOne}>
                    {isExistingUser ? "LOGIN" : "SIGN UP"}
                  </Typography.Title>

                  <div className={[styles.userEmailWrap].join(" ")}>
                    <Typography.Text className={styles.userEmail}>
                      <MailIcon className={styles.userEmailIcon} />
                      {email}
                    </Typography.Text>
                  </div>

                  {/* <Typography.Text className={styles.formLabel}>
                    {isExistingUser
                      ? "Login with Email to access your dashboard"
                      : "Set a Password to access your dashboard"}
                  </Typography.Text> */}
                  <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    // wrapperCol={{ span: 16 }}
                    initialValues={{
                      remember: true,
                      firstName: user?.firstName,
                      lastName: user?.lastName,
                    }}
                    onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    form={form}
                  >
                    {!isExistingUser && (
                      <>
                        <div className="loginFormNameFields">
                          <FormField
                            type="text"
                            placeholder={"First Name*"}
                            name="firstName"
                            rules={textRule}
                            defaultValue={user?.firstName}
                          />

                          <FormField
                            type="text"
                            placeholder={"Last Name*"}
                            name="lastName"
                            defaultValue={user?.lastName}
                            rules={textRule}
                          />
                        </div>
                      </>
                    )}

                    <Typography.Text className={styles.formLabel}>
                      {`${
                        isExistingUser ? "Enter" : "Create"
                      } your password and register for ${
                        competition.competitionName
                      }`}
                      {/* {isExistingUser
                        ? `Enter your password and register for ${competition.competitionName}`
                        : "Set a Password to access your dashboard"} */}
                    </Typography.Text>

                    <FormField
                      type="password"
                      placeholder={"Password"}
                      name="password"
                      rules={passwordRule}
                    />

                    {!isExistingUser && (
                      <FormField
                        type="password"
                        placeholder={"Repeat Password"}
                        name="repeat-password"
                        dependencies={["password"]}
                        rules={confirmPasswordRule}
                      />
                    )}
                    {isExistingUser && (
                      <Button
                        className="forgetPasswordLink"
                        type="link"
                        onClick={onResetPassword}
                      >
                        Forgot Password
                      </Button>
                    )}
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
                            isExistingUser
                              ? !form.getFieldValue("password") ||
                                !!form
                                  .getFieldsError()
                                  .filter(({ errors }) => errors.length).length
                              : !form.getFieldValue("firstName") ||
                                !form.getFieldValue("lastName") ||
                                !form.getFieldValue("password") ||
                                !form.getFieldValue("repeat-password") ||
                                !!form
                                  .getFieldsError()
                                  .filter(({ errors }) => errors.length).length
                          }
                        >
                          {isExistingUser ? "LOGIN" : "SIGN UP"}
                        </Button>
                      )}
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default withGuest(InviteParticipantDashboardLogin);
