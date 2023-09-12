import { Button, Carousel, Image } from "antd";
import { judgeTestimonials } from "../../utility/config";
import { slamittLogoSmall } from "../../utility/imageConfig";

const JudgeTestimonialCarosel = ({ isMobile, setOpenSignUp }) => (
  <Carousel autoplay fade dotPosition="bottom">
    {judgeTestimonials.map((testimonial, i) => (
      <div
        key={i}
        className={`h-screen z-50 bg-[${testimonial.bg}] flex items-center justify-center space-y-6 pt-32 onboardingSidebarItem`}
      >
        <div className="onboardingSidebarItemWrap">
          <div className="flex items-center justify-center onboardingSidebarLogoDesktop">
            <Image
              // src={slamittLogoSmall}
              src="https://rethink-competitions.s3.amazonaws.com/1667391766613_slamittlogomin.png"
              alt="img description"
              layout="responsive"
              preview={false}
            />
          </div>
          <div className="flex items-center justify-center onboardingSidebarLogoMobile">
            <Image
              // src={slamittLogoSmall}
              src="https://rethink-competitions.s3.amazonaws.com/1666890941671_logoslamit.png"
              alt="img description"
              layout="responsive"
              preview={false}
            />
          </div>
          <div className="flex items-center justify-center onboardingSidebarImage">
            <Image
              alt="card"
              src={testimonial.img}
              layout="responsive"
              preview={false}
            />
          </div>
          <div>
            <div className="flex items-center justify-center">
              <p className="text-white onboardingSidebarText">
                {testimonial.text}
              </p>
            </div>
            <div
              className={`${
                isMobile ? "block" : "hidden"
              } flex items-center justify-center`}
            >
              <Button
                className="button-Judging"
                onClick={() => setOpenSignUp(true)}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </Carousel>
);

export default JudgeTestimonialCarosel;
