import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Image, Layout, Typography } from "antd";
import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { useDispatch } from "react-redux";
import { notify } from "../../Redux/Actions/";
import Api from "../../services";
import { FormIcon, MailIcon } from "../../utility/iconsLibrary";
import { AppBar } from "../../components/";
import styles from "./signup.module.scss";
import { routes } from "../../utility/config";
import { useRouter } from "next/router";

const AddOtpModule = ({
  email = "",
  code = "",
  onVerifyOtp = () => null,
  misMatchOtp = false,
  isLoading = false,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(code);
  const [resend, setResend] = useState(false);
  const [second, setSecond] = useState(30);
  const { Header, Content } = Layout;

  useEffect(() => {
    if (otp.length === 6) {
      onVerifyOtp(otp);
    }
  }, [otp]);

  useEffect(() => {
    if (code.length === 6) {
      setOtp(code);
    }
  }, [code]);

  const onResendOtp = async () => {
    const payload = {
      email: email,
    };
    try {
      const response = await Api.post("/user/resend-otp", payload);
      if (response.code) {
        dispatch(notify({ type: "success", message: response.message }));
        setSecond(30);
        setResend(false);
        return;
      }
      throw new Error(response.message);
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
  };

  const handleOpenEmailModule = () => {
    router.replace(routes.register + "?email=" + email);
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
        <AppBar isSignUp={true} />
      </Header>
      <Content>
        <div className="slamittLogoIntro">
          <img
            src="https://rethink-competitions.s3.amazonaws.com/1668714261738_slamittlogo.svg"
            alt="Slamitt"
          />
        </div>
        <div className="userFormContent">
          <div className="userFormContainer">
            <div className={[styles.formContainer].join(" ")}>
              <div className={[styles.formHolder].join(" ")}>
                <div className="userFormHolderHead">
                  <Typography.Text
                    className="tertiaryButton"
                    onClick={() => router.push(`/sign-up?email=${email}`)}
                  >
                    <ArrowLeftOutlined />
                  </Typography.Text>
                  <Typography.Title className={styles.headingOne}>
                    GET STARTED
                  </Typography.Title>
                </div>
                <div
                  className={[styles.userEmailWrap, styles.hidden].join(" ")}
                >
                  <Typography.Text className={styles.userEmail}>
                    <MailIcon className={styles.userEmailIcon} />
                    {email}
                  </Typography.Text>
                  <Button
                    className={styles.emailEditButton}
                    type="text"
                    icon={<FormIcon />}
                    onClick={handleOpenEmailModule}
                    htmlType="button"
                  />
                </div>
                <Typography.Text className={[styles.formText, styles.textGray]}>
                  An Email has been sent to{" "}
                  <span className={[styles.formTextEmail].join(" ")}>
                    {email}
                  </span>
                </Typography.Text>

                <Typography.Text
                  className={[styles.formText, styles.hideOnMobile]}
                >
                  Click on the Link to verify or Enter the OTP sent to you
                </Typography.Text>
                <Typography.Text
                  className={[styles.formLabel, styles.visibleOnMobile]}
                >
                  Enter the OTP sent to you
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
                        src="/warning.svg"
                        alt="img description"
                      />{" "}
                      The OTP you have entered does not match
                    </Typography.Text>
                  )}
                  {resend ? (
                    <Typography.Text
                      className="tertiaryButton"
                      onClick={onResendOtp}
                    >
                      Resend OTP
                    </Typography.Text>
                  ) : (
                    <>
                      <Typography.Text className={styles.otpText}>
                        Resend OTP in {`${second < 10 ? `0${second}` : second}`}
                        s
                      </Typography.Text>
                    </>
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

export default AddOtpModule;
