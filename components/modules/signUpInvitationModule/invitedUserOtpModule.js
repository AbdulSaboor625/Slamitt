import { LoadingOutlined } from "@ant-design/icons";
import { Button, Image, Layout, Typography } from "antd";
import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { addToken, changePage, notify } from "../../../Redux/Actions/";
import Api from "../../../services";
import AppBar from "../../AppBar";
import styles from "./signup.module.scss";

import { routeGenerator, routes } from "../../../utility/config";
import { EMAIL_MODULE } from "../../../utility/constants";
import { FormIcon, MailIcon } from "../../../utility/iconsLibrary";
import { useRouter } from "next/router";

const InviteUserOtpModule = ({
  children,
  crew = false,
  email = "",
  code = "",
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pageHandler = useSelector((state) => state.pageHandler);
  const competition = useSelector((state) => state.competition.current);
  const container = useSelector((state) => state.containers.current);
  const [resend, setResend] = useState(false);
  const [misMatchOtp, setMisMatchOtp] = useState(false);
  const [second, setSecond] = useState(30);

  const [otp, setOtp] = useState(code);
  const [isLoading, setLoading] = useState(false);
  const { Header, Content } = Layout;

  useEffect(() => {
    if (otp.length === 6) {
      verifyOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  useEffect(() => {
    if (second > 0) {
      setTimeout(() => {
        setSecond(second - 1);
      }, 1000);
    } else setResend(true);
  }, [second]);

  const verifyOtp = async () => {
    setLoading(true);
    const payload = {
      email: email || pageHandler.email,
      otp: parseInt(otp),
    };
    try {
      const response = await Api.post("/user/create_user_verify_otp", payload);
      if (response.code && response.result.token) {
        dispatch(
          addToken({
            slamittToken: response.result.token,
            user: response.result.user,
          })
        );
        if (crew)
          router.replace(
            routeGenerator(routes.crewGetStarted, {
              competitionCode: competition.competitionCode,
            })
          );
        else
          router.replace(
            routeGenerator(routes.inviteGetStarted, {
              competitionCode: competition.competitionCode,
              containerCode: container.containerCode,
            })
          );
      }
      throw new Error(response.message);
    } catch (error) {
      setMisMatchOtp(true);
    }
    setLoading(false);
  };

  const resendOtp = async () => {
    const payload = {
      email: email || pageHandler.email,
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
    dispatch(changePage({ page: EMAIL_MODULE }));
  };

  return (
    <Layout>
      <Header>
        <AppBar isSignUp={true} />
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
                <Typography.Text className={styles.formText}>
                  An Email has been sent to{" "}
                  <span className={[styles.formTextEmail].join(" ")}>
                    {email || pageHandler.email}
                  </span>
                </Typography.Text>

                <Typography.Text className={styles.formText}>
                  Click on the Link to verify or Enter the OTP sent to you
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
                      onClick={() => resendOtp()}
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

export default InviteUserOtpModule;
