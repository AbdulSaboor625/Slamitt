import {
  AppleFilled,
  FacebookFilled,
  GoogleCircleFilled,
  LinkedinFilled,
} from "@ant-design/icons";
import { Button, Form, Layout, Typography, Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { notify } from "../../Redux/Actions/";
import { FormField, AppBar } from "../../components";
import {
  confirmPasswordRule,
  passwordRule,
} from "../../utility/validatationRules";
import styles from "./signup.module.scss";
import Api from "../../services";
import { routes } from "../../utility/config";
import { getQueryParamsToString } from "../../utility/common";

const AddEmailModule = ({
  registerLoading,
  children,
  invitedOrCrew = false,
  email,
  onFinish = () => null,
  isVerifiedState,
  setIsVerifiedState,
}) => {
  const dispatch = useDispatch();
  const { Header, Content } = Layout;
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});

  const router = useRouter();
  const { to = "", participant = "" } = router.query;

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  useEffect(() => {
    if (email) {
      form.setFieldsValue({ email: email });
    }
  }, [email]);

  // this function resend otp email to complete registration process
  const resendOtp = async () => {
    try {
      const payload = { email: form.getFieldValue("email") };
      const response = await Api.post("/user/resend-otp", {
        email: payload.email,
      });

      if (response.code) {
        dispatch(notify({ type: "success", message: response.message }));

        // setting isVerifiedState to true to hide resend otp link button
        setIsVerifiedState(true);

        const redirectTo =
          routes.registerOtp +
          getQueryParamsToString({ email: payload.email, to, participant });
        router.replace(redirectTo);

        form.resetFields();

        return;
      }

      throw new Error(response.message);
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Layout>
      <Header className="signUpPageModule">
        <AppBar isSignUp={true} />
      </Header>
      <Content>
        <div className="slamittLogoIntro">
          <img
            src="https://rethink-competitions.s3.amazonaws.com/1668714261738_slamittlogo.svg"
            alt="Slamitt"
          />
        </div>
        <div className="userFormContent signupPage">
          <div className="userFormContainer">
            <div className={[styles.formContainer].join(" ")}>
              <div className={[styles.formHolder].join(" ")}>
                {children ? (
                  { ...children }
                ) : (
                  <Typography.Title className={styles.headingOne}>
                    GET STARTED
                  </Typography.Title>
                )}

                <ul className={[styles.socialNetworks].join(" ")}>
                  <li>
                    <Button
                      className={styles.socialButton}
                      shape="circle"
                      icon={<AppleFilled />}
                      size={24}
                    />
                  </li>
                  <li>
                    <Button
                      className={styles.socialButton}
                      shape="circle"
                      icon={<LinkedinFilled />}
                      size={24}
                    />
                  </li>
                  <li>
                    <Button
                      className={styles.socialButton}
                      shape="circle"
                      icon={<FacebookFilled />}
                      size={24}
                    />
                  </li>
                  <li>
                    <Button
                      className={styles.socialButton}
                      shape="circle"
                      icon={<GoogleCircleFilled />}
                      size={24}
                    />
                  </li>
                </ul>
                <h6 className={[styles.formLabel].join(" ")}>
                  Sign up with Email
                </h6>
                <Form
                  name="basic"
                  labelCol={{ span: 8 }}
                  // wrapperCol={{ span: 16 }}
                  initialValues={{ remember: false }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  form={form}
                >
                  <FormField
                    type="email"
                    placeholder={"Email"}
                    readOnly={invitedOrCrew && email}
                  />
                  <FormField
                    type="password"
                    placeholder={"Password"}
                    name="password"
                    rules={passwordRule}
                  />
                  <FormField
                    type="password"
                    placeholder={"Repeat Password"}
                    name="repeat-password"
                    dependencies={["password"]}
                    rules={confirmPasswordRule}
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
                        {registerLoading ? (
                          <div className="loader-icon" />
                        ) : (
                          "Request OTP"
                        )}
                      </Button>
                    )}
                  </Form.Item>
                </Form>
                {!isVerifiedState && (
                  <h6
                    id="resendOtpArea"
                    className={[styles.formLabel].join(" ")}
                    style={{ padding: "30px 0" }}
                  >
                    You have an unverified account with Slamitt.
                    <br />
                    <Button
                      type="link"
                      onClick={resendOtp}
                      style={{
                        padding: "0 5px 0 0",
                        color: "#6808fe",
                        fontSize: "inherit",
                        fontWeight: "bold",
                      }}
                    >
                      Click here{" "}
                    </Button>{" "}
                    to request verification OTP.
                  </h6>
                )}
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default AddEmailModule;
