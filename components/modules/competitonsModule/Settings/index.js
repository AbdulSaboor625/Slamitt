import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useRouter } from "next/router";
import {
  getQualifiedContainers,
  notify,
  setSettingSectionActive,
} from "../../../../Redux/Actions";
import Api from "../../../../services";
import { weightedScoreCalculator } from "../../../../utility/common";
import { settings } from "../../../../utility/config";
import BankAccountSection from "./bankAccountSection";
import Certificates from "./certificates";
import CompetitionSection from "./competitionSection";
import CrewSection from "./crewSection";
import RegistrationSection from "./registrationSection";
import SetUpPaymentSection from "./setUpPaymentSection";
import Placements from "./Placements";
import Rewards from "./Rewards";

const Settings = ({
  readOnlyState,
  updateCompetition,
  competitionState,
  pusher,
  detailsOpen,
  certificate,
  placementsData,
  setPlacementsData,
}) => {
  const router = useRouter();
  const { query } = router;
  const { active } = useSelector((state) => state.misc.config);
  const dispatch = useDispatch();
  const [allContainers, setAllContainers] = useState([]);
  const [institutes, setInstitutes] = useState([]);

  let participantsOrTeams = "Teams";
  if (competitionState?.current?.type === "SOLO")
    participantsOrTeams = "Participants";

  useEffect(() => {
    async function fetchInstitutesData() {
      try {
        const response = await Api.get(`/institute/cgirhpyvay`);
        if (response.code && response.result && response.result.length) {
          const instituteOptions = response.result.map((i) => ({
            label: i.instituteName?.split("(Id")[0],
            value: i.code,
            isActive: i?.isActive,
          }));

          setInstitutes(instituteOptions);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchInstitutesData();
  }, []);

  useEffect(() => {
    if (query?.tab === "registration") {
      dispatch(setSettingSectionActive(settings.REGISTRATION));
    }
    if (query?.tab === "certificates") {
      dispatch(setSettingSectionActive(settings.CERTIFICATES));
    }
  }, [query]);

  useEffect(() => {
    if (competitionState.current) getAllContainers();
    dispatch(getQualifiedContainers());
  }, [competitionState.current]);
  const getAllContainers = async () => {
    try {
      const response = await Api.get(
        `/container/get-all-containers/filter?competitionCode=${competitionState.current.competitionCode}`
      );
      if (response.code && response.result) {
        const containers = response.result;
        if (containers && containers.length)
          containers.forEach((container, idx) => {
            container.value = container.containerCode;
            container.label = container.containerName;

            if (container.roundData && container.roundData.length) {
              container.roundScores = {};
              container.points = 0;
              container.roundData.forEach((round) => {
                if (round.roundScore && round.roundScore.length) {
                  container.points += parseFloat(
                    weightedScoreCalculator(
                      round.roundScore.filter(({ submit }) => submit),
                      round.Round.roundWeightage
                    )
                  );
                }
              });
            }

            containers.sort((c1, c2) => c2.points - c1.points);
          });

        setAllContainers([...containers]);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ message: error.message, type: "error" }));
    }
  };

  const Section = () => {
    switch (active) {
      case settings.COMPETITION:
        return (
          <CompetitionSection
            readOnlyState={readOnlyState}
            updateCompetition={updateCompetition}
            competition={competitionState.current}
            competitionState={competitionState}
            allContainers={allContainers}
            participantsOrTeams={participantsOrTeams}
            placementsData={placementsData}
            setPlacementsData={setPlacementsData}
          />
        );
      case settings.REGISTRATION:
        return (
          <RegistrationSection
            readOnlyState={readOnlyState}
            updateCompetition={updateCompetition}
            competition={competitionState.current}
            institutes={institutes}
          />
        );
      case settings.CREW:
        return (
          <CrewSection
            readOnlyState={readOnlyState}
            competition={competitionState.current}
            pusher={pusher}
          />
        );
      case settings.BANK:
        return <BankAccountSection />;
      case settings.SETUP:
        return <SetUpPaymentSection />;
      case settings.CERTIFICATES:
        return (
          <>
            <Placements
              placementsData={placementsData}
              setPlacementsData={setPlacementsData}
            />
            <Certificates
              certificate={certificate}
              placements={placementsData}
            />
            {console.log(placementsData)}
            <Rewards
              competition={competitionState.current}
              placements={placementsData}
            />
          </>
        );
      default:
        return <CompetitionSection />;
    }
  };

  return (
    <div className={`${detailsOpen ? "block" : "hidden"} tablet:block`}>
      <Section />
    </div>
  );
};

export default Settings;
