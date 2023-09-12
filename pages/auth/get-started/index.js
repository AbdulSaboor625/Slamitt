import {
  AddDetailsModule,
  AddEmailModule,
  AddProfessionModule,
  PersonaliseAccount,
  TestimonialCarousel,
} from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { Layout, Carousel, Image, Typography } from "antd";
import {
  PROFESSION_MODULE,
  DETAILS_MODULE,
  CATEGORIES_MODULE,
  EDIT_EMAIL_MODULE,
} from "../../../utility/constants";
import { useEffect } from "react";
import { changePage, getCategoryAndSubCategory } from "../../../Redux/Actions";
import withAuth from "../../../components/RouteAuthHandler/withAuth";

const GetStarted = () => {
  const dispatch = useDispatch();
  const pageHandler = useSelector((state) => state.pageHandler);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    history.pushState(null, document.title, location.href);
    window.addEventListener("popstate", function (event) {
      history.pushState(null, document.title, location.href);
    });
    // dispatch(changePage({ page: DETAILS_MODULE }));
    dispatch(getCategoryAndSubCategory());
  }, []);

  useEffect(() => {
    if (auth.user.step) dispatch(changePage({ page: auth.user.step }));
  }, [auth.user]);

  const Module = () => {
    switch (pageHandler.page) {
      case DETAILS_MODULE:
        return (
          <AddDetailsModule
            userCode={auth?.user?.userCode}
            email={auth?.user?.email}
          />
        );
      case PROFESSION_MODULE:
        return (
          <AddProfessionModule
            userCode={auth?.user?.userCode}
            email={auth?.user?.email}
          />
        );
      case CATEGORIES_MODULE:
        return (
          <PersonaliseAccount
            userCode={auth?.user?.userCode}
            email={auth?.user?.email}
          />
        );
      case EDIT_EMAIL_MODULE:
        return (
          <AddEmailModule>
            <Typography.Title>GET STARTED</Typography.Title>
          </AddEmailModule>
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

export default withAuth(GetStarted);
