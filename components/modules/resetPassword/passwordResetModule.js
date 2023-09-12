import { Button, Form, Layout, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FormField } from "../../";
import { changePage } from "../../../Redux/Actions";
import { EDIT_EMAIL_MODULE } from "../../../utility/constants";
import { FormIcon, MailIcon } from "../../../utility/iconsLibrary";
import {
  confirmPasswordRule,
  passwordRule,
} from "../../../utility/validatationRules";
import AppBar from "../../AppBar";
import styles from "./styles.module.scss";

const PasswordResetModule = ({ email, onSubmit, isLoading }) => {
  const dispatch = useDispatch();
  const { Header, Content } = Layout;
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = async (values) => {
    onSubmit(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
              <div className={[styles.formHolder].join(" ")}>
                <Typography.Title className={styles.headingOne}>
                  RESET PASSWORD
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
                    onClick={() =>
                      dispatch(changePage({ page: EDIT_EMAIL_MODULE }))
                    }
                  />
                </div>

                <Typography.Text className={styles.formLabel}>
                  Create new password
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
                        loading={isLoading}
                        disabled={
                          !form.isFieldsTouched(true) ||
                          !!form
                            .getFieldsError()
                            .filter(({ errors }) => errors.length).length
                        }
                      >
                        Submit
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

export default PasswordResetModule;
