import { LoadingOutlined } from "@ant-design/icons";
import { Button, Image, Layout, Typography } from "antd";
import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { useDispatch } from "react-redux";
import { changePage, notify } from "../../../Redux/Actions";
import Api from "../../../services";
import { EDIT_EMAIL_MODULE } from "../../../utility/constants";
import { FormIcon, MailIcon } from "../../../utility/iconsLibrary";
import AppBar from "../../AppBar";
import styles from "./styles.module.scss";

const ResetOtpModule = ({
  email,
  verifyOtp,
  isLoading,
  misMatchOtp,
  setMisMatchOtp,
}) => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [second, setSecond] = useState(30);
  const [resend, setResend] = useState(false);
  const { Header, Content } = Layout;

  useEffect(() => {
    if (otp.length === 6) {
      verifyOtp(otp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  useEffect(() => {
    sendOtp();
  }, []);

  const sendOtp = async () => {
    try {
      const response = await Api.post("/user/forget-password", {
        email: email,
      });
      setResend(false);
      setSecond(30);
      if (!response.code) {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };

  useEffect(() => {
    if (second > 0) {
      setTimeout(() => {
        setSecond(second - 1);
      }, 1000);
    } else setResend(true);
  }, [second]);
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

                <Typography.Text
                  className={[styles.formLabel, styles.formLabelSpace]}
                >
                  Click on the Link sent to {email} to verify <br /> ownership
                  of your account or Enter the OTP sent to you
                </Typography.Text>

                <div className={[styles.otpInputHolder].join(" ")}>
                  <OtpInput
                    className={styles.otpInputField}
                    inputStyle={styles.inputStyle}
                    numInputs={6}
                    hasErrored={false}
                    errorStyle={styles.error}
                    onChange={(e) => setOtp(e)}
                    shouldAutoFocus
                    value={otp}
                  />
                  {isLoading && (
                    <LoadingOutlined
                      className={styles.loader}
                      style={{ fontSize: "40px" }}
                    />
                  )}
                </div>
                <div className={[styles.resendOTP].join(" ")}>
                  {misMatchOtp && (
                    <Typography.Text className={styles.otpErrorMessage}>
                      <Image
                        preview={false}
                        src="warning.svg"
                        alt="img description"
                      />{" "}
                      The OTP you have entered does not match
                    </Typography.Text>
                  )}
                  {resend ? (
                    <Typography.Text
                      onClick={sendOtp}
                      className="tertiaryButton"
                    >
                      Resend OTP
                    </Typography.Text>
                  ) : (
                    <Typography.Text className={styles.otpText}>
                      Resend OTP in {`${second < 10 ? `0${second}` : second}`}s
                    </Typography.Text>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ResetOtpModule;
