import { Button, Form, Layout, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { FormField } from "../../";
import AppBar from "../../AppBar";
import styles from "../signin/login.module.scss";

import {
  AppleFilled,
  FacebookFilled,
  GoogleCircleFilled,
  LinkedinFilled,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { addEmail, changePage, notify } from "../../../Redux/Actions";
import Api from "../../../services";
import { OTP_MODULE } from "../../../utility/constants";

const EditEmailModule = ({ email }) => {
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
      if (response?.code) {
        dispatch(addEmail({ email: values.email }));
        dispatch(changePage({ page: OTP_MODULE }));
      } else {
        dispatch(
          notify({
            type: "error",
            message: "There are no accounts associated with this email",
          })
        );
      }
    } catch (err) {
      console.log(err);
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
                  RESET PASSWORD
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
                  Edit your Email
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
                  <FormField type="email" placeholder={"email"} />
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

export default EditEmailModule;
