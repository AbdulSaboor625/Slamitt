import { Button, Form, Layout, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormField } from "../../";
import { changePage } from "../../../Redux/Actions/";
import { EMAIL_MODULE } from "../../../utility/constants";
import { FormIcon, MailIcon } from "../../../utility/iconsLibrary";
import {
  confirmPasswordRule,
  passwordRule,
} from "../../../utility/validatationRules";
import AppBar from "../../AppBar";
import styles from "./signup.module.scss";

const AddPasswordModule = ({ onSubmit, children }) => {
  const dispatch = useDispatch();
  const pageHandler = useSelector((state) => state.pageHandler);
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
    dispatch(changePage({ page: EMAIL_MODULE }));
  };

  return (
    <Layout>
      <Header>
        <AppBar isSignUp={true} />
      </Header>
      <Content>
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
                    {pageHandler.email}
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
                  {!pageHandler.existingUser && (
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
