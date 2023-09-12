import { LinkOutlined } from "@ant-design/icons";
import { Button, Form, Tabs, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notify, updateContainer } from "../../../Redux/Actions";
import Api from "../../../services";
import { routeGenerator, routes } from "../../../utility/config";
import { AppModal, AppQrCode, FormField } from "../../index";

const AssignTeamOrParticipantModal = ({
  isVisible,
  setVisible,
  container,
  setToAdmin,
}) => {
  const competition = useSelector((state) => state.competition.current);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { TabPane } = Tabs;
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const [qrUrl, setQrUrl] = useState(null);

  useEffect(() => {
    forceUpdate({});
  }, []);

  const validateTeamSize = () => {
    const { competitionType, teamSize } = competition;

    if (competitionType === "TEAM" && container.users.length <= teamSize) {
      return true;
    } else {
      if (competitionType === "SOLO") return true;
      dispatch(notify({ type: "error", message: "Team is full!" }));
      return false;
    }
  };
  const onFinish = async (values) => {
    if (!values.email && (!values.firstName || !values.lastName)) {
      dispatch(
        notify({
          type: "error",
          message: "Please add full name and/or email",
        })
      );
      return;
    }
    const body = {
      email: values?.email,
      competitionCode: competition?.competitionCode,
    };
    try {
      if (values.email) {
        const responce = await Api.post(
          "/container/check-user-container",
          body
        );
        if (responce?.result) {
          if (responce?.result?.isPresent) {
            dispatch(
              notify({
                type: "error",
                message: `This email id is already registered to ${responce?.result?.container?.containerName}`,
              })
            );
          } else {
            if (values.email === user.email) {
              dispatch(
                notify({
                  type: "error",
                  message: "You cant join in your Organised Competition",
                })
              );
            } else {
              const isValidated = validateTeamSize();
              if (isValidated) {
                const payload = {};
                payload.users = [values];
                payload.containerCode = container.containerCode;
                // payload.addUser = true;
                payload.makeAdmin = setToAdmin;

                dispatch(updateContainer(payload));
                setVisible(false);
                // setMakeAdmin(false);
                form.resetFields();
              }
            }
          }
        }
      } else {
        const isValidated = validateTeamSize();
        if (isValidated) {
          const payload = {};
          payload.users = [values];
          payload.containerCode = container.containerCode;
          // payload.addUser = true;
          payload.makeAdmin = setToAdmin;

          dispatch(updateContainer(payload));
          setVisible(false);
          // setMakeAdmin(false);
          form.resetFields();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
            {competition?.competitionType === "TEAM"
              ? `Assign a ${setToAdmin ? "Team Admin" : "Participant"} to ${
                  container?.containerName
                }`
              : `Assign an Account to ${container?.containerName}`}
          </Typography.Title>
          <Tabs defaultActiveKey="1" centered>
            <TabPane tab="Add Manually" key="1">
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
                  placeholder={"Email ID"}
                  rules={[{ required: false }]}
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
                        // !form.isFieldsTouched(true) ||
                        !!form
                          .getFieldsError()
                          .filter(({ errors }) => errors.length).length
                      }
                    >
                      {form.getFieldValue("email")
                        ? "Send Invite"
                        : "Add Participant"}
                    </Button>
                  )}
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane
              tab={`Invite ${setToAdmin ? "Admin" : "Participant"}`}
              key="2"
            >
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
                      routes.inviteParticipantPublic,
                      {
                        competitionCode: competition?.competitionCode,
                        containerCode: container?.containerCode,
                        makeAdmin: setToAdmin,
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
                  Scan QR Code
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
                    routes.inviteLogin,
                    {
                      competitionCode: competition?.competitionCode,
                      containerCode: container?.containerCode,
                      makeAdmin: setToAdmin,
                    },
                    true
                  )}
                  setUrl={(e) => setQrUrl(e)}
                />
              </div>
              <div className="attentionMessageBlock">
                <strong className="attentionMessageBlockTitle">ATTENTION:</strong>
                1. Do not use iPhone&apos;s default QR code scanner as
                it is unreliable for prolonged sessions.<br/>
                2. Try to avoid using
                Slamitt on an in-app browser (like within Gmail, Instagram, etc).
                Instead, launch the link into a completely new browser session for
                uninterrupted use.
              </div>
            </TabPane>
          </Tabs>
        </div>
      </AppModal>
    </div>
  );
};
export default AssignTeamOrParticipantModal;
