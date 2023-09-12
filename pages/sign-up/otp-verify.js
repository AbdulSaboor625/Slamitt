import { AddOtpModule } from "../../modules/sign-up";
import { TestimonialCarousel } from "../../components/";
import { useDispatch } from "react-redux";
import { Layout, Image } from "antd";
import Api from "../../services";
import { useRouter } from "next/router";
import { useState } from "react";
import { routes } from "../../utility/config";
import { addToken } from "../../Redux/Actions";
import { getQueryParamsToString } from "../../utility/common";
import withGuest from "../../components/RouteAuthHandler/withGuest";
import RegistrationTestimonial from "../../components/TestimonialCarousel/registrationTestimonials";
import useMediaQuery from "../../hooks/useMediaQuery";

const OtpVerify = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { email = "", code = "", to = "", participant = "" } = router.query;
  const [misMatchOtp, setMisMatchOtp] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const isMobile = useMediaQuery();

  const verifyOtp = async (otp) => {
    setLoading(true);
    const payload = {
      email: email,
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
        const redirectTo =
          routes.addDetails + getQueryParamsToString({ to, participant });
        router.replace(redirectTo);
        return;
      }
      throw new Error(response.message);
    } catch (error) {
      console.log(error);
      setMisMatchOtp(true);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <Layout.Sider
        className={`onboardingSidebar mobile:hidden mobile:h-screen`}
        // className="testimonialsSlider"
      >
        {/* <div className="sliderLogo">
            <Image
              src="/slamitt-logo.svg"
              alt="img description"
              layout="responsive"
              preview={false}
            />
          </div>
          <TestimonialCarousel /> */}
        <RegistrationTestimonial
          isMobile={isMobile}
          // setOpenRegistration={setOpenRegistration}
        />
      </Layout.Sider>
      <AddOtpModule
        email={email}
        code={code}
        misMatchOtp={misMatchOtp}
        isLoading={isLoading}
        onVerifyOtp={verifyOtp}
      />
      ;
    </Layout>
  );
};

export default withGuest(OtpVerify);
