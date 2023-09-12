import { Button, Form, Layout, Spin, Typography } from "antd";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { notify } from "../../Redux/Actions";
import Api from "../../services";

import { useRouter } from "next/router";
import { AppBar, FormField } from "../../components";
import styles from "./styles.module.scss";
import SegmentHandler from "../../analytics/segment";

const ForgotPasswordEmailModule = () => {
  const dispatch = useDispatch();
  const { segment } = useSelector((state) => state.misc);

  const { Header, Content } = Layout;
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const [mailSent, setMailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { email } = router.query;
  useEffect(() => {
    forceUpdate({});
  }, []);

  useEffect(() => {
    if (email && form) form.setFieldsValue({ email: email.trim() });
  }, [email]);

  const sendOtp = async (value, resend = false) => {
    setLoading(true);
    try {
      const isUser = await Api.post("/user/checkEmail", { email: value.email });
      if (!isUser.code) {
        router.push(`/sign-up?email=${value.email}`);
        throw new Error("User not found");
      } else {
        const response = await Api.post("/user/forget-password", {
          email: value.email,
        });

        if (!response.code) {
          throw new Error(response.message);
        }
        const analytics = new SegmentHandler(segment);
        analytics.trackUserEvent(
          SegmentHandler.EVENTS.RESET_PASSWORD,
          response.result
        );
        setMailSent(true);
        resend &&
          dispatch(
            notify({
              message: "Reset password link sent successfully",
              type: "success",
            })
          );
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };

  return (
    <Layout>
      <Header>
        <AppBar isSignUp={false} />
      </Header>
      <Content>
        <div className="userFormContent">
          <div className="userFormContainer">
            <div className={[styles.formContainer].join(" ")}>
              {mailSent ? (
                <div className={[styles.formHolder].join(" ")}>
                  <Typography.Title className={styles.headingOne}>
                    {" "}
                    RESET PASSWORD
                  </Typography.Title>
                  <Typography.Text className={styles.formLabel}>
                    We have sent you a reset password link to{" "}
                    {form.getFieldValue("email") || email}. Follow the link to
                    reset your password.
                  </Typography.Text>
                  <Button
                    type="primary"
                    shape="round"
                    className={styles.formButton}
                    onClick={() =>
                      sendOtp(
                        { email: form.getFieldValue("email") || email },
                        true
                      )
                    }
                  >
                    {loading ? <div className="loader-icon" /> : "Resend Email"}
                  </Button>
                </div>
              ) : (
                <div className={[styles.formHolder].join(" ")}>
                  <Typography.Title className={styles.headingOne}>
                    RESET PASSWORD
                  </Typography.Title>

                  <Typography.Text
                    className={[styles.formLabel, styles.formLabelSpace]}
                  >
                    Enter you email to recieve a reset password link
                  </Typography.Text>

                  {/* <div className={[styles.otpInputHolder].join(" ")}> */}
                  <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    // wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={sendOtp}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    form={form}
                  >
                    <FormField type="email" placeholder={"Email"} />

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
                          {loading ? (
                            <div className="loader-icon" />
                          ) : (
                            "Send Link"
                          )}
                        </Button>
                      )}
                    </Form.Item>
                  </Form>
                </div>
              )}
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ForgotPasswordEmailModule;
