import {
  CompetitionDetailsHeaderModule,
  InvitedUserDetailsModule,
  InvitedUserProfessionModule,
  PersonaliseAccount,
  TestimonialCarousel,
} from "../../../../components";
import { useDispatch, useSelector } from "react-redux";
import { Layout, Carousel, Image } from "antd";
import {
  PROFESSION_MODULE,
  DETAILS_MODULE,
  CATEGORIES_MODULE,
  EDIT_EMAIL_MODULE,
  INVITE_MEMBERS_MODULE,
} from "../../../../utility/constants";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  changePage,
  getCategoryAndSubCategory,
  getCompetitionByCompetitionCode,
  getSingleContainer,
  notify,
  refreshToken,
  updateUser,
} from "../../../../Redux/Actions";
import Api from "../../../../services";
import { decodeBase64 } from "../../../../utility/common";
import { routes } from "../../../../utility/config";
import withAuth from "../../../../components/RouteAuthHandler/withAuth";

const GetStartedInvited = () => {
  const initialRender = useRef(true);
  const dispatch = useDispatch();
  const pageHandler = useSelector((state) => state.pageHandler);
  const auth = useSelector((state) => state.auth);
  const competition = useSelector((state) => state.competition.current);
  const container = useSelector((state) => state.containers.current);
  const [canSetAdmin, setAdmin] = useState(false);

  const router = useRouter();
  useEffect(() => {
    if (router.query.data) {
      const { competitionCode, containerCode, email, makeAdmin } = decodeBase64(
        router.query.data[0]
      );
      setAdmin(makeAdmin);
      if (email) {
        verifyInvitation(containerCode, email);
      }
      dispatch(getCompetitionByCompetitionCode({ competitionCode }));
      dispatch(getSingleContainer(containerCode));
      dispatch(getCategoryAndSubCategory());
    }
    if (auth.slamittToken) dispatch(refreshToken());
    if (auth.slamittToken && auth.user?.step === "DASHBOARD") {
      auth.user.step = INVITE_MEMBERS_MODULE;
      dispatch(updateUser({ ...auth.user }));
    }
  }, [router.query]);

  useEffect(() => {
    history.pushState(null, document.title, location.href);
    window.addEventListener("popstate", function (event) {
      history.pushState(null, document.title, location.href);
    });
    if (initialRender.current && auth.user) {
      dispatch(changePage({ page: auth.user?.step }));
      // dispatch(changePage({ page: PROFESSION_MODULE }));
      initialRender.current = false;
    }
  }, []);

  const verifyInvitation = async (containerCode, email) => {
    try {
      const response = await Api.get(
        `/container/check-invitation/${containerCode}/${email}`
      );
      if (response.code) {
        dispatch(addEmail({ email }));
        setEmail(email);
      } else {
        router.replace(routes.register);
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
  };

  const Module = () => {
    switch (pageHandler.page) {
      case DETAILS_MODULE:
        return (
          <InvitedUserDetailsModule
            email={auth?.user?.email}
            userCode={auth?.user?.userCode}
          >
            <CompetitionDetailsHeaderModule
              competitionState={competition}
              containerState={container}
            />
          </InvitedUserDetailsModule>
        );
      case PROFESSION_MODULE:
        return (
          <InvitedUserProfessionModule
            email={auth?.user?.email}
            userCode={auth?.user?.userCode}
          >
            <CompetitionDetailsHeaderModule
              competitionState={competition}
              containerState={container}
            />
          </InvitedUserProfessionModule>
        );
      case CATEGORIES_MODULE:
        return (
          <PersonaliseAccount
            competitionState={competition}
            userCode={auth?.user?.userCode}
          />
        );
      default:
        return <></>;
    }
  };
  return (
    <Layout>
      {pageHandler.page !== CATEGORIES_MODULE && (
        <Layout.Sider className="testimonialsSlider">
          <div className="sliderLogo">
            <Image
              src="/slamitt-logo.svg"
              alt="img description"
              layout="responsive"
              preview={false}
            />
          </div>
          <TestimonialCarousel />
        </Layout.Sider>
      )}
      <Module />
    </Layout>
  );
};

export default withAuth(GetStartedInvited);
