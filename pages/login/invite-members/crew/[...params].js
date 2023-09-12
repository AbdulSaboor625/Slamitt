import { Button, Form, Image, Layout, Typography } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login, notify } from "../../../../Redux/Actions";
import { ADD_TOKEN } from "../../../../Redux/actionTypes";
import { AppBar, FormField, TestimonialCarousel } from "../../../../components";
import styles from "../../../../modules/login/login.module.scss";
import Api from "../../../../services";
import { decodeBase64 } from "../../../../utility/common";
import { routes } from "../../../../utility/config";
import { MailIcon } from "../../../../utility/iconsLibrary";
import {
  confirmPasswordRule,
  passwordRule,
  textRule,
} from "../../../../utility/validatationRules";
import RegistrationTestimonial from "../../../../components/TestimonialCarousel/registrationTestimonials";
import useMediaQuery from "../../../../hooks/useMediaQuery";

const InviteCrewLogin = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    isVerified: true,
  });
  const { params = [] } = router.query;
  const dispatch = useDispatch();
  const [decoded, setDecoded] = useState({});
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [form] = Form.useForm();

  const isMobile = useMediaQuery();

  useEffect(() => {
    const _decoded = params.length ? decodeBase64(params[0]) : {};
    if (Object.keys(_decoded).length > 0 && _decoded.email) {
      setDecoded(_decoded);
      setUser({
        ...user,
        email: _decoded.email,
        firstName: _decoded.firstName,
        lastName: _decoded.lastName,
      });
      // form.setFieldValue("firstName", _decoded.firstName);
      // form.setFieldValue("lastName", _decoded.lastName);
      checkExistingUser(_decoded.email);
    }
  }, [params]);

  const checkExistingUser = async (email) => {
    try {
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

  // const updateCrewStatus = async (email, status, competitionCode) => {

  //   try {
  //     const body = { email, status };
  //     const response = await Api.update(
  //       `/settings/crewSettings/${competitionCode}`,
  //       body
  //     );
  //     if (response?.result && response?.code) {
  //       dispatch(
  //         notify({
  //           type: "success",
  //           message: "Crew status updated successfully",
  //         })
  //       );
  //     } else {
  //       throw new Error(response.message);
  //     }
  //   } catch (err) {
  //     dispatch(notify({ type: "error", message: err.message }));
  //   }
  // };

  const creatUser = async (payload) => {
    try {
      payload.is_verified = true;
      payload.competitionCode = decoded.competitionCode;
      const response = await Api.post("/user/createUser", payload);

      if (response.code && response.result.is_verified) {
        dispatch({
          type: ADD_TOKEN,
          slamittToken: response.result.token,
          user: response.result,
        });

        if (payload.redirectRoute) {
          window.location.href = payload.redirectRoute;
        } else {
          window.location.href = routes.dashboard;
        }
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

  const onFinish = ({ firstName, lastName, password }) => {
    const payload = {
      firstName,
      lastName,
      email: user.email,
      password: password,
      redirectRoute: `/auth/competitions/o/${decoded.competitionCode}`,
      updateCrew: {
        email: user.email,
        status: "ONBOARDED",
        competitionCode: decoded.competitionCode,
      },
    };

    if (isExistingUser) {
      dispatch(login(payload));
      // updateCrewStatus(user.email, "ONBOARDED", decoded.competitionCode)
    } else {
      creatUser(payload);
    }
  };

  const onResetPassword = async () => {
    router.replace(
      `${routes.forgotPassword}${user?.email ? `?email=${user?.email}` : ""}`
    );
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
                    LOGIN
                  </Typography.Title>

                  <div className={[styles.userEmailWrap].join(" ")}>
                    <Typography.Text className={styles.userEmail}>
                      <MailIcon className={styles.userEmailIcon} />
                      {user.email}
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
                      {isExistingUser
                        ? "Enter your password to access your Dashboard"
                        : "Set a Password to access your dashboard"}
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
                    <Button
                      className="forgetPasswordLink"
                      type="link"
                      onClick={onResetPassword}
                    >
                      Forgot Password
                    </Button>
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
                          LOGIN
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

export default InviteCrewLogin;
