import { Image, Layout } from "antd";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TestimonialCarousel } from "../../components";
import { notify } from "../../Redux/Actions";
import Api from "../../services";
import { NewPasswordModule } from "../../modules/forgot";
import { routes } from "../../utility/config";
import SegmentHandler from "../../analytics/segment";
import RegistrationTestimonial from "../../components/TestimonialCarousel/registrationTestimonials";
import useMediaQuery from "../../hooks/useMediaQuery";

const NewPassword = () => {
  const router = useRouter();
  const { email = "", code = "" } = router.query;
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const initialRender = useRef(true);
  const { segment } = useSelector((state) => state.misc);
  const isMobile = useMediaQuery();

  useEffect(() => {
    if (initialRender.current && email && code) {
      initialRender.current = false;
      return;
    }
    if (!initialRender.current) {
      router.replace("/login");
      dispatch(
        notify({ type: "info", message: "Invalid Reset Password link" })
      );
      return;
    }
  }, [email]);

  const onSubmit = async (values) => {
    setLoading(true);
    const payload = {
      email: email,
      newPassword: values.password,
      confirmPassword: values["repeat-password"],
      otp: code,
    };
    try {
      const response = await Api.post("/user/change_forget_password", payload);
      if (response.code) {
        const analytics = new SegmentHandler(segment);
        analytics.trackUserEvent(
          SegmentHandler.EVENTS.FORGOT_PASSWORD,
          response.result
        );
        dispatch(notify({ type: "success", message: response.message }));
        router.replace(routes.login);
      } else {
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
    setLoading(false);
  };

  return (
    <>
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
        <NewPasswordModule
          email={email}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </Layout>
    </>
  );
};

export default NewPassword;
