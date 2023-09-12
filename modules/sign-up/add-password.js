import { Button, Form, Layout, Typography } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FormField, AppBar } from "../../components";
import { routes } from "../../utility/config";
import { FormIcon, MailIcon } from "../../utility/iconsLibrary";
import {
  confirmPasswordRule,
  passwordRule,
} from "../../utility/validatationRules";
import styles from "./signup.module.scss";

const AddPasswordModule = ({ onSubmit, children, email, exist }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { Header, Content } = Layout;

  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = async (values) => {
    onSubmit(values.password);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleOpenEmailModule = () => {
    router.replace(routes.register + "?email=" + email);
  };

  return (
    <Layout>
      <Header>
        <AppBar isSignUp={true} />
      </Header>
      <Content>
        <div className="slamittLogoIntro">
          <img
            src="https://rethink-competitions.s3.amazonaws.com/1668714261738_slamittlogo.svg"
            alt="Slamitt"
          />
        </div>
        <div className="userFormContent">
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
                <div className={[styles.userEmailWrap].join(" ")}>
                  <Typography.Text className={styles.userEmail}>
                    <MailIcon className={styles.userEmailIcon} />
                    {email}
                  </Typography.Text>
                  <Button
                    className={styles.emailEditButton}
                    type="text"
                    icon={<FormIcon />}
                    onClick={handleOpenEmailModule}
                    htmlType="button"
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
                  {!exist && (
                    <FormField
                      type="password"
                      placeholder={"Repeat Password"}
                      name="repeat-password"
                      dependencies={["password"]}
                      rules={confirmPasswordRule}
                    />
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
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default AddPasswordModule;
