import { Button, Form, Image, Layout, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FormField, AppBar } from "../../components";
import styles from "./login.module.scss";

import {
  AppleFilled,
  FacebookFilled,
  GoogleCircleFilled,
  LinkedinFilled,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { notify } from "../../Redux/Actions";

import Api from "../../services";
import { passwordRule } from "../../utility/validatationRules";
import { routes } from "../../utility/config";
import { getQueryParamsToString } from "../../utility/common";

const Email = ({
  onSubmit,
  email,
  onEmailNotFound,
  onResetPassword = () => null,
  setEmail,
}) => {
  const { Header, Content } = Layout;
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const dispatch = useDispatch();

  const router = useRouter();
  const [isVerifiedState, setIsVerifiedState] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    forceUpdate({});
  }, []);

  useEffect(() => {
    if (email && form) form.setFieldsValue({ email: email.trim() });
  }, [email]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await Api.post(`/user/checkEmail`, {
        email: values.email,
      });

      if (response.code) {
        if (!response.result.isVerified) {
          // set isVerifiedState to false to show resend otp link button
          setIsVerifiedState(false);
          document
            .getElementById("resendOtpArea")
            .scrollIntoView({ behavior: "smooth" });
          return;
        }

        await onSubmit({ email: values.email, password: values.password });
      } else {
        await dispatch(
          notify({
            type: "info",
            message:
              "It seems that you don't have an account with us. Please sign up to continue.",
          })
        );
        await onEmailNotFound(values.email);
      }
      setLoading(false);
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
      setLoading(false);
    }
  };

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
          routes.registerOtp + getQueryParamsToString({ email: payload.email });
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
      <Header>
        <AppBar />
      </Header>
      <Content>
        <div className="slamittLogoIntro">
          <Image
            preview={false}
            src="https://rethink-competitions.s3.amazonaws.com/1668714261738_slamittlogo.svg"
            alt="Slamitt"
          />
        </div>
        <div className="userFormContent loginPage">
          <div className="userFormContainer">
            <div className={[styles.formContainer].join(" ")}>
              <div className={[styles.formHolder].join(" ")}>
                <Typography.Title className={styles.headingOne}>
                  LOGIN
                </Typography.Title>

                <ul className={[styles.socialNetworks].join(" ")}>
                  <li>
                    <Button
                      className={styles.socialButton}
                      shape="circle"
                      icon={<AppleFilled />}
                    />
                  </li>
                  <li>
                    <Button
                      className={styles.socialButton}
                      shape="circle"
                      icon={<LinkedinFilled />}
                    />
                  </li>
                  <li>
                    <Button
                      className={styles.socialButton}
                      shape="circle"
                      icon={<FacebookFilled />}
                    />
                  </li>
                  <li>
                    <Button
                      className={styles.socialButton}
                      shape="circle"
                      icon={<GoogleCircleFilled />}
                    />
                  </li>
                </ul>

                <h6 className={[styles.formLabel].join(" ")}>
                  Login with Email
                </h6>
                <Form
                  name="basic"
                  labelCol={{ span: 8 }}
                  // wrapperCol={{ span: 16 }}
                  initialValues={{ email: email, remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  form={form}
                  onChange={(e) => {
                    console.log(e.target.value, e.target.type);
                    if (e.target.type === "email") {
                      setEmail(e.target.value);
                    }
                  }}
                >
                  <FormField type="email" placeholder={"Email"} />
                  <FormField
                    type="password"
                    placeholder={"Password"}
                    name="password"
                    rules={passwordRule}
                  />
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
                          email
                            ? !email
                            : !form.isFieldsTouched(true) ||
                              !!form
                                .getFieldsError()
                                .filter(({ errors }) => errors.length).length
                        }
                      >
                        {loading ? <div className="loader-icon" /> : "login"}
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

export default Email;
