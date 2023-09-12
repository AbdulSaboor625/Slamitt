import { Button, DatePicker, Form, Layout, Radio, Row, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { FormField } from "../../";

import { useDispatch, useSelector } from "react-redux";
import {
  changePage,
  logout,
  notify,
  updateUser,
} from "../../../Redux/Actions/";
import Api from "../../../services";
import { gender, routes } from "../../../utility/config";
import { PROFESSION_MODULE } from "../../../utility/constants";
import { CheckedGreenIcon, MailIcon } from "../../../utility/iconsLibrary";
import styles from "./signup.module.scss";

const AddDetailsModule = ({ userCode, email }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { Header, Content } = Layout;

  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const [picker, setPicker] = useState("year");
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (!user || user.step === DETAILS_MODULE);
  //   else dispatch(changePage({ page: user.step }));
  // }, []);

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
      step: PROFESSION_MODULE,
    };
    localStorage.setItem("tempData", JSON.stringify(payload));
    try {
      const response = await Api.update(
        `/user/update-user/${userCode}`,
        payload
      );
      if (response.code) {
        dispatch(updateUser({ user: response.result }));
        dispatch(changePage({ page: PROFESSION_MODULE }));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
              // window.location.href = routes.register;
            }}
          >
            Logout
          </Button>
        </Row>
      </Header>
      <Content>
        <div className="userFormContent">
          <div className="userFormContainer">
            <div className={[styles.formContainer].join(" ")}>
              <div className={[styles.formHolder].join(" ")}>
                <div className={[styles.profileHeading].join(" ")}>
                  <Typography.Title className={styles.headingOne}>
                    SET UP YOUR PROFILE
                  </Typography.Title>
                </div>
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
                  {/* <Button
                    className={styles.emailEditButton}
                    type="text"
                    icon={<FormOutlined />}
                    onClick={() => {
                      dispatch(setPrevPage({ page: DETAILS_MODULE }));
                      dispatch(changePage({ page: EDIT_EMAIL_MODULE }));
                    }}
                  /> */}
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
                  <div className="formTwoFields">
                    <div className="inputWrapper">
                      <FormField
                        type="text"
                        placeholder={"First Name"}
                        defaultValue={userData && userData.fName}
                        name="first-name"
                        rules={[{ required: userData ? false : true }]}
                      />
                    </div>
                    <div className="inputWrapper">
                      <FormField
                        type="text"
                        placeholder={"Last Name"}
                        defaultValue={userData && userData.lName}
                        name="last-name"
                        rules={[{ required: userData ? false : true }]}
                      />
                    </div>
                  </div>
                  <div className="inputWrapper inputWrapperOutlined">
                    <Form.Item
                      name="dob"
                      label="D.O.B"
                      // initialValue={userData && dateU}
                    >
                      <DatePicker
                        // open={open}
                        // onClick={() => setOpen(!open)}
                        // picker={picker}
                        // onChange={() => {
                        //   if (picker === "year") setPicker("month");
                        //   if (picker === "month") setPicker("date");
                        //   if (picker === "date") setOpen(false);
                        // }}
                        format={["DD/MM/YYYY", "DD/MM/YY"]}
                        placeholder={"DD/MM/YYYY"}
                        defaultValue={userData && moment(dateU)}
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
                      name="gender"
                      label=" Gender"
                      rules={[{ required: userData ? false : true }]}
                      requiredMark={"optional"}
                      initialValue={userData && userData.gender}
                    >
                      <Radio.Group
                        defaultValue={userData && userData.gender}
                        options={gender}
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
                          // || !form.isFieldsTouched(true)
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

export default AddDetailsModule;
