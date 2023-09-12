import { Image, Layout, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { notify } from "../../../Redux/Actions";
import RegistrationTestimonial from "../../../components/TestimonialCarousel/registrationTestimonials";
import useMediaQuery from "../../../hooks/useMediaQuery";
import RegisterParticipants from "../../../modules/registrations/authRegistrations";
import { getCompetition } from "../../../requests/competition";
import { getAllContainers, getContainer } from "../../../requests/container";
import { fetchInstitutes } from "../../../requests/institutes";
import { getRoom } from "../../../requests/room";
import Api from "../../../services";
import { decodeBase64 } from "../../../utility/common";
import {
  CONTAINER_SCORING_EMPTY_STATE,
  routeGenerator,
  routes,
} from "../../../utility/config";

const Registerinfo = ({ pusher }) => {
  const router = useRouter();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { params = [] } = router.query;
  const [competition, setCompetition] = useState({});
  const [containers, setContainers] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [openRegistration, setOpenRegistration] = useState(false);
  const [room, setRoom] = useState(null);
  const [decoded, setDecoded] = useState({});
  const isMobile = useMediaQuery("(max-width: 766px)");

  useEffect(() => {
    const _decoded = params.length ? decodeBase64(params[0]) : {};
    if (_decoded && _decoded.competitionCode) {
      if (auth.slamittToken) {
        // if the invite is for some other user redirect him to dashboard
        if (auth.user && auth.user.email !== _decoded.email) {
          dispatch(
            notify({
              message:
                "You are logged in from another account, Please log out and try again!",
              type: "error",
            })
          );
          router.replace(routes.dashboard);
          return;
        }
        setDecoded(_decoded);
        getCompetition(_decoded.competitionCode).then((res) => {
          if (res) {
            setCompetition(res);
          }
          if (res?.status !== "ACTIVE") {
            dispatch(
              notify({ message: "Invitation Expired !", type: "error" })
            );
            router.replace(routes.dashboard);
            return;
          }
        });

        getContainer(_decoded.containerCode).then((container) => {
          if (container) {
            getAllContainers(
              `${_decoded.competitionCode}-${container.roomCode}`
            ).then((res) => res && setContainers(res));

            getRoom(`${_decoded.competitionCode}-${container.roomCode}`).then(
              (res) => res && setRoom(res)
            );
          }
        });

        fetchInstitutes().then((res) => res && setInstitutes(res));
        const channel = pusher.subscribe(
          `updates-${competition.competitionCode}-competition`
        );
        channel.bind("receive_message", ({ data }) => {
          getCompetition(_decoded.competitionCode).then((res) => {
            res && setCompetition(res);
          });
        });
      } else {
        router.replace(
          routeGenerator(routes.inviteParticipant, _decoded, true)
        );
      }
    }
  }, [params]);

  const [firstRender, setFirsRender] = useState(false);

  useEffect(() => {
    const countView = async () => {
      await Api.get(
        `/competition/${competition?.competitionCode}/registration-views`
      );
      setFirsRender(true);
    };

    if (competition?.competitionCode && !firstRender) countView();
  }, [competition]);

  const getSingleContainer = async () => {
    if (decoded?.containerCode) {
      const oldContainer = await Api.get(
        `/container/get-single-container/${decoded?.containerCode}`
      );
      if (oldContainer?.result && oldContainer?.code) {
        const userMatch = oldContainer?.result?.users?.find(
          (u) => u.email === auth?.user?.email
        );
        if (!userMatch) {
          dispatch(
            notify({ message: "Invitation has expired", type: "error" })
          );
          router.replace(routes.dashboard);
        }
      } else {
        dispatch(notify({ message: "Invitation has expired", type: "error" }));
      }
    }
  };

  useEffect(() => {
    getSingleContainer();
  }, [decoded]);

  return (
    <Layout>
      <Layout.Sider
        className={`z-50 h-screen onboardingSidebar`}
        style={{
          display: isMobile ? (!openRegistration ? "block" : "none") : "block",
          position: isMobile ? "absolute" : "static",
        }}
      >
        <RegistrationTestimonial
          isMobile={isMobile}
          setOpenRegistration={setOpenRegistration}
        />
      </Layout.Sider>
      <Layout.Content>
        {competition?.status === "ACTIVE" ? (
          <RegisterParticipants
            competition={competition}
            room={room}
            pusher={pusher}
            containers={containers}
            institutes={institutes}
            containerCode={decoded?.containerCode}
            invitedUser={decoded?.user}
          />
        ) : (
          <>
            {competition?.status === "CONCLUDED" ? (
              <RegisterParticipants
                competition={competition}
                room={room}
                pusher={pusher}
                containers={containers}
                institutes={institutes}
                containerCode={decoded?.containerCode}
                invitedUser={decoded?.user}
              />
            ) : (
              <div className="registrationFormPage">
                <div className="registrationFormPageContainer">
                  <div
                    className="registrationFormPageHolder placeholderImage"
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      preview={false}
                      width={200}
                      height={200}
                      alt="thumbnail"
                      src={CONTAINER_SCORING_EMPTY_STATE}
                    />
                    <Typography.Title level={5}>
                      {"Competition is not open for registration!"}
                    </Typography.Title>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Layout.Content>
    </Layout>
  );
};

export default Registerinfo;
