import { Button, DatePicker, Form, Layout, Radio, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { FormField } from "../../";

import moment from "moment";
import { useDispatch } from "react-redux";
import {
  changePage,
  logout,
  notify,
  refreshToken,
} from "../../../Redux/Actions/";
import Api from "../../../services";
import { gender, routes } from "../../../utility/config";
import { CheckedGreenIcon, MailIcon } from "../../../utility/iconsLibrary";
import styles from "./signup.module.scss";

const InvitedUserDetailsModule = ({ email, children, userCode }) => {
  const dispatch = useDispatch();
  const { Header, Content } = Layout;

  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  const userData = JSON.parse(localStorage.getItem("tempData"));
  const dateU = userData && userData?.dob?.replace("-", "/")?.replace("-", "/");

  const onFinish = async (value) => {
    setLoading(true);
    const payload = {
      fName: value["first-name"],
      lName: value["last-name"],
      gender: value.gender,
      email: email,
      dob: value["dob"]?.format("DD-MM-YYYY"),
    };
    localStorage.setItem("tempData", JSON.stringify(payload));
    updateUserDetails(payload, "PROFESSION_MODULE");
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const updateUserDetails = async (payload, page) => {
    payload.step = page;
    try {
      const response = await Api.update(
        `/user/update-user/${userCode}`,
        payload
      );
      if (response.code) {
        dispatch(refreshToken());
        dispatch(changePage({ page: response.result.step }));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
  };

  const disable = () => {
    if (!!userData?.fName) return false;
    else {
      return (
        !form.isFieldsTouched(true) ||
        !!form.getFieldsError().filter(({ errors }) => errors.length).length
      );
    }
  };

  return (
    <Layout>
      <Header>
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
      </Header>
      <Content>
        <div className="userFormContent text-center">
          <div className="userFormContainer">
            <div className={[styles.formContainer].join(" ")}>
              <div className={[styles.formHolder].join(" ")}>
                {{ ...children }}
                <div className={[styles.userEmailWrap].join(" ")}>
                  <Typography.Text className={styles.userEmail}>
                    <MailIcon className={styles.userEmailIcon} />
                    {email}
                    <CheckedGreenIcon
                      className="userVerifyIcon"
                      style={{
                        color: "#1DDB8B",
                        marginLeft: "auto",
                      }}
                    />
                  </Typography.Text>
                </div>
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
                  <div className="inputWrapper">
                    <FormField
                      defaultValue={userData && userData.fName}
                      type="text"
                      placeholder={"First Name"}
                      name="first-name"
                      rules={[{ required: userData ? false : true }]}
                    />
                  </div>
                  <div className="inputWrapper">
                    <FormField
                      defaultValue={userData && userData.lName}
                      type="text"
                      placeholder={"Last Name"}
                      name="last-name"
                      rules={[{ required: userData ? false : true }]}
                    />
                  </div>
                  <div className="inputWrapper inputWrapperOutlined">
                    <Form.Item name="dob" label="D.O.B">
                      <DatePicker
                        defaultValue={userData && moment(dateU)}
                        format={["DD/MM/YYYY", "DD/MM/YY"]}
                        placeholder={"DD/MM/YYYY"}
                        disabledDate={(current) => {
                          let start = moment("1920-01-01", "YYYY-MM-DD");
                          return (
                            current < start ||
                            moment().add(1, "days") <= current
                          );
                        }}
                      />
                    </Form.Item>
                  </div>
                  <div className="inputWrapper inputWrapperOutlined gendarField">
                    <Form.Item
                      initialValue={userData && userData.gender}
                      name="gender"
                      label="Gender"
                      rules={[{ required: userData ? false : true }]}
                    >
                      <Radio.Group
                        options={gender}
                        defaultValue={userData && userData.gender}
                      />
                    </Form.Item>
                  </div>
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
                          disable()
                          // !form.isFieldsTouched(true) ||
                          // !!form
                          //   .getFieldsError()
                          //   .filter(({ errors }) => errors.length).length
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

export default InvitedUserDetailsModule;
