import { Button, Form, Layout, Typography } from "antd";
import { useEffect, useState } from "react";
import { FormField, AppBar } from "../../components";
import { FormIcon, MailIcon } from "../../utility/iconsLibrary";
import { passwordRule } from "../../utility/validatationRules";
import styles from "./login.module.scss";

const AddPassword = ({ onPasswordEntered, onEmailEditClicked, email }) => {
  const { Header, Content } = Layout;
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = (values) => {
    onPasswordEntered(values.password);
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
          <img src="https://rethink-competitions.s3.amazonaws.com/1668714261738_slamittlogo.svg" alt="Slamitt"/>
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
                    {email}
                  </Typography.Text>

                  <Button
                    className={styles.emailEditButton}
                    type="text"
                    icon={<FormIcon />}
                    onClick={onEmailEditClicked}
                  />
                </div>

                <Typography.Text className={styles.formLabel}>
                  Enter a valid Password
                </Typography.Text>
                <Form
                  name="basic"
                  labelCol={{ span: 8 }}
                  // wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  form={form}
                >
                  <FormField
                    type="password"
                    placeholder={"Password"}
                    name="password"
                    rules={passwordRule}
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
                        next
                      </Button>
                    )}
                  </Form.Item>
                </Form>
                {/* <Button
                  className="forgetPasswordLink"
                  type="link"
                  onClick={onResetPassword}
                >
                  Forgot Password
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default AddPassword;
