import { Image, Layout } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppCompetitionDetailsHeader,
  TestimonialCarousel,
} from "../../components/";
import withGuest from "../../components/RouteAuthHandler/withGuest";
import { AddEmailModule } from "../../modules/sign-up";
import { addToken, notify } from "../../Redux/Actions";
import { getCompetition } from "../../requests/competition";
import { getContainer } from "../../requests/container";
import { createOrLoginInvitedUser, createUser } from "../../requests/user";
import Api from "../../services";
import { decodeBase64, getQueryParamsToString } from "../../utility/common";
import { routes } from "../../utility/config";
import {
  CATEGORIES_MODULE,
  DETAILS_MODULE,
  PROFESSION_MODULE,
  SOMETHING_WENT_WRONG,
} from "../../utility/constants";
import SegmentHandler from "../../analytics/segment";
import RegistrationTestimonial from "../../components/TestimonialCarousel/registrationTestimonials";
import useMediaQuery from "../../hooks/useMediaQuery";

const SignIn = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { email = "", to = "", participant = "", exist = false } = router.query;
  const [container, setContainer] = useState({});
  const [competition, setCompetition] = useState({});
  const [isVerifiedState, setIsVerifiedState] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(false);
  const { segment } = useSelector((state) => state.misc);
  const isMobile = useMediaQuery();

  useEffect(() => {
    if (participant) {
      const _decoded = participant ? decodeBase64(participant) : {};
      if (_decoded && _decoded.containerCode && _decoded.competitionCode) {
        getContainer(_decoded.containerCode).then((res) => {
          res && setContainer(res);
        });
        getCompetition(_decoded.competitionCode).then((res) => {
          res && setCompetition(res);
        });
      }
    }
  }, [participant]);

  const onFinish = async (values) => {
    setRegisterLoading(true);
    try {
      const response = await Api.post(`/user/checkEmail`, {
        email: values.email,
      });

      if (response.code) {
        if (participant) {
          router.replace(
            routes.registerPassword +
              getQueryParamsToString({
                email: values.email,
                to: to,
                participant: participant,
                exist: true,
              })
          );
          return;
        }

        if (response.result.isVerified) {
          dispatch(
            notify({
              type: "info",
              message:
                "It seems that you have an account with us. Please sign in to continue.",
            })
          );

          router.replace(
            routes.login +
              getQueryParamsToString({ email: values.email }) +
              "&fromSignUp=true"
          );
          return;
        }

        // set isVerifiedState to false to show resend otp link button
        setIsVerifiedState(false);
        document
          .getElementById("resendOtpArea")
          .scrollIntoView({ behavior: "smooth" });

        return;
      } else {
        if (participant) {
          router.replace(
            routes.registerPassword +
              getQueryParamsToString({
                email: values.email,
                to: to,
                participant: participant,
                exist: false,
              })
          );

          return;
        }
        onSubmit(values.email, values.password);
      }
      setRegisterLoading(false);
    } catch (error) {
      setRegisterLoading(false);

      dispatch(notify({ type: "error", message: error.message }));
    }
  };

  const onSubmit = async (email, password) => {
    const payload = { email: email, password: password };
    if (participant) createOrLoginUser(payload);
    else _createUser(payload);
  };

  const createOrLoginUser = (payload) => {
    createOrLoginInvitedUser(payload).then((res) => {
      if (res?.token) {
        dispatch(addToken({ slamittToken: res.token, user: res.user }));
        const routeToRedirect = to;
        switch (res.user.step) {
          case DETAILS_MODULE:
            routeToRedirect =
              routes.addDetails +
              getQueryParamsToString({
                email: res.user.email,
                to,
                participant,
              });
            break;
          case PROFESSION_MODULE:
            routeToRedirect =
              routes.addProfession +
              getQueryParamsToString({
                email: res.user.email,
                to,
                participant,
              });
            break;
          case CATEGORIES_MODULE:
            routeToRedirect =
              routes.addUserCategory +
              getQueryParamsToString({
                email: res.user.email,
                to,
                participant,
              });
            break;
          default:
            break;
        }
        router.replace(routeToRedirect);
      } else {
        router.replace(
          routes.registerOtp +
            getQueryParamsToString({
              email: payload.email,
              to,
              participant,
            })
        );
      }
    });
  };

  const _createUser = (payload) => {
    createUser(payload).then((res) => {
      if (res) {
        const analytics = new SegmentHandler(segment);
        analytics.trackUserEvent(SegmentHandler.EVENTS.SIGN_UP, res);
        const redirectTo =
          routes.registerOtp +
          getQueryParamsToString({ email: payload.email, to, participant });
        router.replace(redirectTo);
      } else {
        dispatch(
          notify({
            type: "error",
            message: SOMETHING_WENT_WRONG,
          })
        );
      }
    });
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
      <AddEmailModule
        registerLoading={registerLoading}
        email={email}
        onFinish={onFinish}
        setIsVerifiedState={setIsVerifiedState}
        isVerifiedState={isVerifiedState}
      >
        {participant && (
          <AppCompetitionDetailsHeader
            competitionState={competition}
            containerState={container}
            crew={false}
          />
        )}
      </AddEmailModule>
    </Layout>
  );
};

export default withGuest(SignIn);
