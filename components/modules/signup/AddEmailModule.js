import {
  AppleFilled,
  FacebookFilled,
  GoogleCircleFilled,
  LinkedinFilled,
} from "@ant-design/icons";
import { Button, Form, Layout, Row, Typography } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormField } from "../../";
import { addEmail, changePage, logout, notify } from "../../../Redux/Actions";
import Api from "../../../services";
import { routes } from "../../../utility/config";
import { PASSWORD_MODULE } from "../../../utility/constants";
import AppBar from "../../AppBar";
import styles from "./signup.module.scss";

const AddEmailModule = ({ children, invitedOrCrew = false, email }) => {
  const router = useRouter();
  const { Header, Content } = Layout;
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const container = useSelector((state) => state.containers.current);
  const pageHandler = useSelector((state) => state.pageHandler);

  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  useEffect(() => {
    if (auth.slamittToken) {
      form.setFieldsValue({ email: auth.user.email });
    } else {
      form.setFieldsValue({ email: pageHandler.email });
    }
  }, [auth]);

  const onFinish = async (values) => {
    try {
      const isExist =
        container &&
        container.users.find(
          ({ email, isVerified }) => email === values?.email && isVerified
        );
      if (isExist && container) {
        dispatch(
          notify({ type: "error", message: "You are already in this Team" })
        );
      } else {
        const response = await Api.post(`/user/checkEmail`, {
          email: values.email,
        });
        if (response.code) {
          if (invitedOrCrew) {
            dispatch(addEmail({ ...values, existingUser: response.result }));
            dispatch(changePage({ page: PASSWORD_MODULE }));
          } else {
            dispatch(
              notify({
                type: "info",
                message: "Your Email already exists! Please login to continue.",
              })
            );
            dispatch(addEmail(values));
            dispatch(changePage({ page: PASSWORD_MODULE }));
            router.replace(routes.login);
          }
        } else {
          dispatch(addEmail(values));
          dispatch(changePage({ page: PASSWORD_MODULE }));
        }
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
        {!auth.slamittToken ? (
          <AppBar isSignUp={true} />
        ) : (
          <Row justify="end" align="middle">
            <Button
              type="primary"
              shape="round"
              onClick={() => {
                dispatch(logout());
              }}
            >
              Logout
            </Button>
          </Row>
        )}
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
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  form={form}
                >
                  <FormField
                    type="email"
                    placeholder={"Email"}
                    readOnly={email}
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
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default AddEmailModule;
