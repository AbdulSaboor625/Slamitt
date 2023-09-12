import { Image, Layout } from "antd";
import { TestimonialCarousel } from "../../components";
import { ForgotPasswordEmailModule } from "../../modules/forgot";
import RegistrationTestimonial from "../../components/TestimonialCarousel/registrationTestimonials";
import useMediaQuery from "../../hooks/useMediaQuery";

const ForgotPassword = () => {
  const isMobile = useMediaQuery();
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
        <ForgotPasswordEmailModule />
      </Layout>
    </>
  );
};

export default ForgotPassword;
