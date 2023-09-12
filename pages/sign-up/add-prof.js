import {
  AppCompetitionDetailsHeader,
  TestimonialCarousel,
} from "../../components";
import { Layout, Image } from "antd";
import { AddProfessionModule } from "../../modules/sign-up";
import { getContainer } from "../../requests/container";
import { getCompetition } from "../../requests/competition";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { decodeBase64 } from "../../utility/common";
import withAuth from "../../components/RouteAuthHandler/withAuth";
import RegistrationTestimonial from "../../components/TestimonialCarousel/registrationTestimonials";
import useMediaQuery from "../../hooks/useMediaQuery";

const AddProf = () => {
  const router = useRouter();
  const isMobile = useMediaQuery();

  const { to = "", participant = "" } = router.query;
  const [container, setContainer] = useState({});
  const [competition, setCompetition] = useState({});

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
      <AddProfessionModule to={to} participant={participant}>
        {participant && (
          <AppCompetitionDetailsHeader
            competitionState={competition}
            containerState={container}
            crew={false}
          />
        )}
      </AddProfessionModule>
    </Layout>
  );
};

export default withAuth(AddProf);
