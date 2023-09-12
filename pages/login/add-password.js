import { TestimonialCarousel } from "../../components";
import { AddPassword } from "../../modules/login";
import { Layout, Image } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/Actions";
import withGuest from "../../components/RouteAuthHandler/withGuest";
import RegistrationTestimonial from "../../components/TestimonialCarousel/registrationTestimonials";
import useMediaQuery from "../../hooks/useMediaQuery";

const LoginPassword = () => {
  const router = useRouter();
  const { email } = router.query;
  const [emailID, setEmail] = useState(email || "");
  const dispatch = useDispatch();
  const isMobile = useMediaQuery();

  useEffect(() => {
    if (email?.trim()) setEmail(email);
  }, [email]);

  const onFinish = (password) => {
    dispatch(login({ email: emailID, password: password }));
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

      <AddPassword
        email={emailID}
        onPasswordEntered={onFinish}
        onEmailEditClicked={() => {
          router.push(`/login?email=${email}`);
        }}
      />
    </Layout>
  );
};

export default withGuest(LoginPassword);
