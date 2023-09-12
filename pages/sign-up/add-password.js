import { AddPasswordModule } from "../../modules/sign-up";
import {
  AppCompetitionDetailsHeader,
  TestimonialCarousel,
} from "../../components/";
import { useDispatch, useSelector } from "react-redux";
import { Layout, Image } from "antd";
import { addToken, notify } from "../../Redux/Actions";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { routes } from "../../utility/config";
import { decodeBase64, getQueryParamsToString } from "../../utility/common";
import { getContainer } from "../../requests/container";
import { getCompetition } from "../../requests/competition";
import { createOrLoginInvitedUser, createUser } from "../../requests/user";
import {
  CATEGORIES_MODULE,
  DETAILS_MODULE,
  PROFESSION_MODULE,
  SOMETHING_WENT_WRONG,
} from "../../utility/constants";
import withGuest from "../../components/RouteAuthHandler/withGuest";
import RegistrationTestimonial from "../../components/TestimonialCarousel/registrationTestimonials";
import useMediaQuery from "../../hooks/useMediaQuery";

const AddPassword = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { email = "", to = "", participant = "", exist = false } = router.query;
  const initialRender = useRef(true);
  const [container, setContainer] = useState({});
  const [competition, setCompetition] = useState({});
  const isMobile = useMediaQuery();

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    if (!initialRender.current && !email) {
      router.replace(routes.register);
    }
  }, [email]);

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

  const onSubmit = async (password) => {
    const payload = { email: email, password: password };
    if (participant) createOrLoginUser(payload);
    else _createUser(payload);
  };

  const _createUser = (payload) => {
    createUser(payload).then((res) => {
      if (res) {
        const redirectTo =
          routes.registerOtp +
          getQueryParamsToString({ email, to, participant });
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
                email,
                to,
                participant,
              });
            break;
          case PROFESSION_MODULE:
            routeToRedirect =
              routes.addProfession +
              getQueryParamsToString({
                email,
                to,
                participant,
              });
            break;
          case CATEGORIES_MODULE:
            routeToRedirect =
              routes.addUserCategory +
              getQueryParamsToString({
                email,
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
              email,
              to,
              participant,
            })
        );
      }
    });
  };

  return (
    <Layout>
      {/* <Layout.Sider className="testimonialsSlider">
        <div className="sliderLogo">
          <Image
            src="/slamitt-logo.svg"
            alt="img description"
            layout="responsive"
            preview={false}
          />
        </div>
        <TestimonialCarousel />
      </Layout.Sider> */}
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
      <AddPasswordModule email={email} onSubmit={onSubmit} exist={exist}>
        {participant && (
          <AppCompetitionDetailsHeader
            competitionState={competition}
            containerState={container}
            crew={false}
          />
        )}
      </AddPasswordModule>
    </Layout>
  );
};

export default withGuest(AddPassword);
