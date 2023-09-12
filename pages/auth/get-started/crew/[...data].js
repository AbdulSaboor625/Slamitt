import {
  CompetitionDetailsHeaderModule,
  InvitedUserDetailsModule,
  InvitedUserProfessionModule,
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
  getCompetitionByCompetitionCode,
  getSingleContainer,
  notify,
  updateUser,
} from "../../../../Redux/Actions";
import Api from "../../../../services";
import { decodeBase64 } from "../../../../utility/common";
import withAuth from "../../../../components/RouteAuthHandler/withAuth";

const GetStartedInvited = () => {
  const initialRender = useRef(true);
  const dispatch = useDispatch();
  const pageHandler = useSelector((state) => state.pageHandler);
  const auth = useSelector((state) => state.auth);
  const competition = useSelector((state) => state.competition.current);
  const container = useSelector((state) => state.containers.current);

  const [subProfessionList, setSubProfessionList] = useState([]);
  const [institutesList, setInstitutesList] = useState([]);
  const [professionSelected, setProfessionSelection] = useState(
    "623e23cf31c1022777cee146"
  );
  const [subProfessionSelected, setSubProfessionSelected] = useState(
    "623e23cf31c1022777cee147"
  );

  const router = useRouter();
  useEffect(() => {
    if (pageHandler.page === PROFESSION_MODULE) getSubProfession();
    if (router.query.data) {
      const { competitionCode } = decodeBase64(router.query.data[0]);

      dispatch(getCompetitionByCompetitionCode({ competitionCode }));
    }
  }, [router.query]);

  useEffect(() => {
    if (initialRender.current && auth.user) {
      auth.user?.wasRegistered
        ? dispatch(changePage({ page: INVITE_MEMBERS_MODULE }))
        : dispatch(changePage({ page: DETAILS_MODULE }));
      // dispatch(changePage({ page: PROFESSION_MODULE }));
      initialRender.current = false;
    }
  }, []);

  useEffect(() => {
    if (pageHandler.page === PROFESSION_MODULE) getSubProfession();
  }, [professionSelected]);

  useEffect(() => {
    if (pageHandler.page === PROFESSION_MODULE) getInstitutes();
  }, [subProfessionSelected]);

  const updateUserDetails = async (payload, page) => {
    try {
      const response = await Api.update(
        `/user/update-user/${auth.user.userCode}`,
        payload
      );
      if (response.code) {
        dispatch(updateUser({ user: response.result }));
        // page === "DETAILS_MODULE"
        //   ? dispatch(changePage({ page: PROFESSION_MODULE }))
        //   :
        dispatch(changePage({ page: INVITE_MEMBERS_MODULE }));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
  };

  const getSubProfession = async () => {
    try {
      const response = await Api.get(`/profession/sub-profession`);
      if (response.code) {
        let list = response.result.subProfession;
        list = list.map((item) => {
          item.label = item.name;
          item.value = item.name;
          return item;
        });
        setSubProfessionList(list);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
  };

  const getInstitutes = async () => {
    try {
      const response = await Api.get(`/institute/${subProfessionSelected}`);
      if (response.code) {
        setInstitutesList(response.result);
      } else {
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
            updateUserDetails={updateUserDetails}
          >
            <CompetitionDetailsHeaderModule
              competitionState={competition}
              containerState={container}
              crew={true}
            />
          </InvitedUserDetailsModule>
        );
      case PROFESSION_MODULE:
        return (
          <InvitedUserProfessionModule
            email={auth?.user?.email}
            updateUserDetails={updateUserDetails}
            subProfessionList={subProfessionList}
            setSubProfessionList={setSubProfessionList}
            institutesList={institutesList}
            setInstituteList={setInstitutesList}
            professionSelected={professionSelected}
            setProfessionSelection={setProfessionSelection}
            subProfessionSelected={subProfessionSelected}
            setSubProfessionSelected={setSubProfessionSelected}
          >
            <CompetitionDetailsHeaderModule
              competitionState={competition}
              containerState={container}
              crew={true}
            />
          </InvitedUserProfessionModule>
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
