import { Button, Image, Layout } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { TestimonialCarousel } from "../../components";
import withGuest from "../../components/RouteAuthHandler/withGuest";
import { Email } from "../../modules/login";
import { login } from "../../Redux/Actions";
import { routes } from "../../utility/config";
import { ArrowBackIcon } from "../../utility/iconsLibrary";
import RegistrationTestimonial from "../../components/TestimonialCarousel/registrationTestimonials";
import useMediaQuery from "../../hooks/useMediaQuery";

const Login = () => {
  const router = useRouter();
  const { email } = router.query;
  const [emailD, setEmail] = useState(email || "");
  const [showLogin, setShowLogin] = useState(false);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    if (email?.trim()) setEmail(email);
  }, [email]);

  useEffect(() => {
    if (router?.query?.fromSignUp) {
      setShowLogin(true);
    }
  }, [router]);

  const onSubmit = (payload) => {
    console.log("login/index ~ line 30 [PAYLOAD] ", payload);
    dispatch(
      login({ email: payload.email || email || "", password: payload.password })
    );
  };

  return (
    <Layout>
      <Layout.Sider
        className={`onboardingSidebar mobile:${
          showLogin ? "hidden" : "absolute"
        } mobile:h-screen`}
      >
        <RegistrationTestimonial
          isMobile={isMobile}
          setOpenRegistration={setShowLogin}
        />
        {/* <div className="sliderLogo">
          <Image
            src="/slamitt-logo.svg"
            alt="img description"
            layout="responsive"
            preview={false}
          />
        </div>
        <TestimonialCarousel setShowLogin={setShowLogin} /> */}
      </Layout.Sider>
      <Layout.Content
        className={`block mobile:${
          showLogin || router?.query?.fromSignUp ? "visible" : "hidden"
        }`}
      >
        <Button
          className={`laptop:hidden mobile:${
            router?.query?.fromSignUp ? "hidden" : "visible"
          } buttonStartBack`}
          icon={<ArrowBackIcon />}
          onClick={() => setShowLogin(false)}
        />
        {/* {isEmailEntered ? (
        <AddPassword
          email={emailD}
          onPasswordEntered={onSubmit}
          onEmailEditClicked={() => {
            setEmailEntered(false);
          }}
        />
      ) : ( */}
        <Email
          email={emailD}
          setEmail={setEmail}
          onSubmit={onSubmit}
          onEmailNotFound={(data) => {
            router.push(`/sign-up?email=${data}`);
          }}
          onResetPassword={() =>
            router.push(
              `${routes.forgotPassword}${emailD ? `?email=${emailD}` : ""}`
            )
          }
        />
      </Layout.Content>
    </Layout>
  );
};

export default withGuest(Login);
