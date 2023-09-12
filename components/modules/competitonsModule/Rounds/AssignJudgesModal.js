import { LinkOutlined } from "@ant-design/icons";
import { Button, Form, Tabs, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../../../../Redux/Actions";
import { titleCase } from "../../../../utility/common";
import { routeGenerator, routes } from "../../../../utility/config";
import { AppModal, AppQrCode, FormField } from "../../../index";
import { DownloadIcon } from "../../../../utility/iconsLibrary";

const AssignJudgesModal = ({
  isVisible,
  setVisible,
  competitionRoundCode,
  addJudge,
  judgesList,
  round,
}) => {
  const { TabPane } = Tabs;
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const [qrUrl, setQrUrl] = useState(null);
  const userEmail = useSelector((state) => state.auth.user.email);
  const containers = useSelector((state) => state.containers.all);
  const [emailError, setEmailError] = useState({ email: "", error: "" });
  const [oldEmailValue, setOldEmailValue] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = (values) => {
    let found = false;
    if (judgesList.length) {
      found = judgesList.find((f) => f.email === values.email);
    }
    if (found) {
      dispatch(
        notify({
          type: "error",
          message: `${values.email} is already add for judge ${titleCase(
            round?.roundName
          )}`,
        })
      );
    } else {
      addJudge(values);
      form.resetFields();
      setVisible(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const isOnAnyContainer = (email) => {
    let found = false;
    if (containers?.length) {
      found = containers.find((cont) =>
        cont?.users?.find((user) => user.email === email)
      );
    }
    return found;
  };

  const checkEmail = (email) => {
    // if (email === userEmail) {
    //   setEmailError({
    //     email: email,
    //     error: "You can't add yourself as a judge",
    //   });
    // } else
    if (judgesList.find((f) => f.email === email)) {
      setEmailError({
        email: email,
        error: `This email is already add for judge this round`,
      });
    } else if (isOnAnyContainer(email)) {
      setEmailError({
        email: email,
        // error: `This email is already add for a team in this competition`,
        error: `Participating member cannot be invited as a judge`,
      });
    }
  };
  return (
    <div>
      <AppModal
        className="assignTeamModalParent"
        isVisible={isVisible}
        onOk={() => setVisible(false)}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
      >
        <div className="assignTeamModal">
          <Typography.Title level={4}>
            {" "}
            Add Judges to {titleCase(round?.roundName)}
          </Typography.Title>
          {!round?.isLive ? (
            <Form
              // name="basic"
              labelCol={{ span: 8 }}
              // initialValues={{ remember: true }}
              onFinish={onFinish}
              // onFinishFailed={onFinishFailed}
              autoComplete="off"
              form={form}
            >
              <FormField
                type="email"
                placeholder={"Email"}
                onBlur={(e) => checkEmail(e)}
                onPressEnter={(e) => checkEmail(e)}
                rules={[
                  {
                    type: "email",
                    message: "Please enter a valid Email!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (emailError.error && emailError.email === value) {
                        return Promise.reject(new Error(emailError.error));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              />
              <FormField
                type="text"
                placeholder={"First Name"}
                rules={[{ required: false }]}
                name="firstName"
              />
              <FormField
                type="text"
                placeholder={"Last Name"}
                rules={[{ required: false }]}
                name="lastName"
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
                      !form.getFieldsValue().firstName ||
                      !form.getFieldValue().email ||
                      !!form
                        .getFieldsError()
                        .filter(({ errors }) => errors.length).length
                    }
                  >
                    {round && round.isLive ? "Send Invite" : "Add Judge"}
                  </Button>
                )}
              </Form.Item>
            </Form>
          ) : (
            <Tabs defaultActiveKey="1" centered>
              <TabPane tab="Invite via Email" key="1">
                <Form
                  // name="basic"
                  labelCol={{ span: 8 }}
                  // initialValues={{ remember: true }}
                  onFinish={onFinish}
                  // onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  form={form}
                >
                  <FormField
                    type="email"
                    placeholder={"Email"}
                    onBlur={(e) => checkEmail(e)}
                    onPressEnter={(e) => checkEmail(e)}
                    rules={[
                      {
                        type: "email",
                        message: "Please enter a valid Email!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (emailError.error && emailError.email === value) {
                            return Promise.reject(new Error(emailError.error));
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  />
                  <FormField
                    type="text"
                    placeholder={"First Name"}
                    rules={[{ required: false }]}
                    name="firstName"
                  />
                  <FormField
                    type="text"
                    placeholder={"Last Name"}
                    rules={[{ required: false }]}
                    name="lastName"
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
                          !form.getFieldsValue().firstName ||
                          !form.getFieldValue().email ||
                          !!form
                            .getFieldsError()
                            .filter(({ errors }) => errors.length).length
                        }
                      >
                        {round && round.isLive ? "Send Invite" : "Add Judge"}
                      </Button>
                    )}
                  </Form.Item>
                </Form>
              </TabPane>
              <TabPane tab="Invite via Link" key="2">
                <div className="qrCodeInfo">
                  <Typography.Text className="qrCodeInfoTextLink">
                    {" "}
                    <LinkOutlined /> Invite via Link
                  </Typography.Text>
                </div>
                <div className="invitelinkField">
                  <div className="qrCodeInfoText">
                    <Typography.Text copyable={{ tooltips: false }}>
                      {routeGenerator(
                        routes.judgeLogin,
                        {
                          competitionRoundCode: competitionRoundCode,
                        },
                        true
                      )}
                    </Typography.Text>
                  </div>
                </div>
                <div className="qrCodeInfo">
                  <Typography.Text className="qrCodeInfoText or">
                    Or
                  </Typography.Text>
                  <Typography.Text className="qrCodeInfoTextLink">
                    <a href={qrUrl} download>
                      <DownloadIcon />
                    </a>
                  </Typography.Text>
                  <Typography.Text className="qrCodeInfoTextLink none">
                    Scan or{" "}
                    <a
                      href={qrUrl}
                      download
                      style={{
                        marginRight: "0.2rem",
                        marginLeft: "0.2rem",
                        color: "#666",
                        textDecoration: "underline",
                      }}
                    >
                      Download
                    </a>{" "}
                    QR Code
                  </Typography.Text>
                </div>
                <div className="qrCodeBox">
                  <AppQrCode
                    value={routeGenerator(
                      routes.judgeLogin,
                      {
                        competitionRoundCode: competitionRoundCode,
                      },
                      true
                    )}
                    setUrl={(e) => setQrUrl(e)}
                  />
                </div>
                <div className="attentionMessageBlock">
                  <strong className="attentionMessageBlockTitle">ATTENTION:</strong>
                  1. Do not use iPhone&apos;s default QR code scanner as it is
                  unreliable for prolonged sessions.<br/>
                  2. Try to avoid using
                  Slamitt on an in-app browser (like within Gmail, Instagram,
                  etc). Instead, launch the link into a completely new browser
                  session for uninterrupted use.
                </div>
              </TabPane>
            </Tabs>
          )}
        </div>
      </AppModal>
    </div>
  );
};
export default AssignJudgesModal;
