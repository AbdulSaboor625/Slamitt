import { Button, Form, Layout, Typography } from "antd";
import { useEffect, useState } from "react";
import { FormField } from "../../";
import AppBar from "../../AppBar";
import styles from "./login.module.scss";

import {
  AppleFilled,
  FacebookFilled,
  GoogleCircleFilled,
  LinkedinFilled,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { addEmail, changePage, notify } from "../../../Redux/Actions";
import { routes } from "../../../utility/config";
import { PASSWORD_MODULE } from "../../../utility/constants";
import Api from "../../../services";
import { useRouter } from "next/router";

const LogInEmailModule = ({ onEmailEntered, email }) => {
  const router = useRouter();
  const { Header, Content } = Layout;
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    forceUpdate({});
  }, []);
  const onFinish = async (values) => {
    try {
      const response = await Api.post(`/user/checkEmail`, {
        email: values.email,
      });
      if (response.code) {
        onEmailEntered(values.email);
        dispatch(addEmail({ email: values.email }));
      } else {
        dispatch(
          notify({
            type: "info",
            message:
              "It seems that you don't have an account with us. Please sign up to continue.",
          })
        );
        dispatch(addEmail({ email: values.email }));
        dispatch(changePage({ page: PASSWORD_MODULE }));
        router.replace(routes.register);
      }
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
        <div className="userFormContent">
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
                          email
                            ? !email
                            : !form.isFieldsTouched(true) ||
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

export default LogInEmailModule;
