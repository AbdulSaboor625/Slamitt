import { Image, Layout, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import withGuest from "../../../components/RouteAuthHandler/withGuest";
import RegistrationTestimonial from "../../../components/TestimonialCarousel/registrationTestimonials";
import useMediaQuery from "../../../hooks/useMediaQuery";
import RegisterParticipants from "../../../modules/registrations/publicRegistrations";
import { getCompetition } from "../../../requests/competition";
import { getAllContainers } from "../../../requests/container";
import { fetchInstitutes } from "../../../requests/institutes";
import { getRoom } from "../../../requests/room";
import { decodeBase64 } from "../../../utility/common";
import { CONTAINER_SCORING_EMPTY_STATE } from "../../../utility/config";

const Registerinfo = ({ pusher }) => {
  const router = useRouter();
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
    if (_decoded && _decoded.roomCode && _decoded.competitionCode) {
      setDecoded(_decoded);

      getCompetition(_decoded.competitionCode).then(
        (res) => res && setCompetition(res)
      );
      getAllContainers(`${_decoded.competitionCode}-${_decoded.roomCode}`).then(
        (res) => res && setContainers(res)
      );
      getRoom(`${_decoded.competitionCode}-${_decoded.roomCode}`).then(
        (res) => res && setRoom(res)
      );
      fetchInstitutes().then((res) => res && setInstitutes(res));
    }

    const channel = pusher.subscribe(
      `updates-${competition.competitionCode}-competition`
    );
    channel.bind("receive_message", ({ data }) => {
      getCompetition(_decoded.competitionCode).then((res) => {
        res && setCompetition(res);
      });
    });
  }, [params]);

  return (
    <Layout>
      <Layout.Sider
        className={` z-50 h-screen onboardingSidebar`}
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
        {competition?.status === "ACTIVE" && competition?.allowRegistration ? (
          <RegisterParticipants
            competition={competition}
            room={room}
            pusher={pusher}
            token={decoded?.token ? decodeBase64(decoded.token) : null}
            containers={containers}
            institutes={institutes}
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
      </Layout.Content>
    </Layout>
  );
};

export default withGuest(Registerinfo);
