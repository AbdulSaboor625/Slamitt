import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppModal from ".";
import { getAllCompetitionsOrganized, notify } from "../../Redux/Actions";
import Api from "../../services";
import { routeGenerator, routes } from "../../utility/config";
import CreateCompetitionPhase1 from "../modules/dashboardModule/createCompetitionPhase1";
import CreateCompetitionPhase2 from "../modules/dashboardModule/createCompetitionPhase2";
import CreateCompMobilePhase from "./createCompMobilePhase";
import SegmentHandler from "../../analytics/segment";

const CreateCompetitionModal = ({
  isVisible,
  setVisible,
  isSecondPhaseVisible,
  setSecondPhaseVisible,
}) => {
  const competition = useSelector((state) => state.competition);
  const [competitionName, setCompetitionName] = useState(
    `${competition?.create?.competitionName}`
  );
  const dispatch = useDispatch();
  const { segment } = useSelector((state) => state.misc);
  const onCreateCompetition = async () => {
    const payload = {
      competitionName: competition.create.competitionName,
      categoryArray: competition.create.categoryName,
      competitionType: competition.create.competitionType,
      status: "ACTIVE",
    };
    if (competition.create.competitionType === "TEAM") payload.minTeamSize = 2;
    else payload.isBelongsToSameOrgOrInstitute = false;
    if (competition.create.image.type === "EMOJI") {
      payload.imageURL = null;
      payload.emojiObject = competition.create.image.emoji;
    } else {
      payload.imageURL = competition.create.image.url;
      payload.emojiObject = null;
    }
    try {
      const response = await Api.post(
        "/competition/createCompetition",
        payload
      );

      if (response.code) {
        const analytics = new SegmentHandler(segment);
        analytics.trackUserEvent(
          SegmentHandler.EVENTS.COMPETITION_CREATE_PHASE_3,
          payload
        );
        dispatch(
          notify({
            message: "Competition created successfully",
            type: "success",
          })
        );
        dispatch(getAllCompetitionsOrganized());
        window.location.href = routeGenerator(
          routes.competitionOrganised,
          {
            competitionCode: response.result.competitionCode,
          },
          true
        );
      } else throw new Error(response.message);
    } catch (error) {
      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };

  const checkCompetitionName = async (name) => {
    const compName = name.trimStart().trimEnd();
    try {
      const response = await Api.get(
        `competition/check-existing-competition/${compName}`
      );
      if (response.result) return true;
      else return false;
    } catch (error) {
      dispatch(notify({ message: error.message, type: "error" }));
    }
  };

  return (
    <AppModal
      className="m-5 launchCompetitionModal"
      isVisible={isVisible}
      onOk={() => setVisible(false)}
      onCancel={() => {
        setVisible(false);
        setSecondPhaseVisible(false);
      }}
    >
      <div>
        <div className="mobile:hidden largeScreen:visible">
          {isSecondPhaseVisible ? (
            <CreateCompetitionPhase2
              checkCompetitionName={checkCompetitionName}
              competitionName={competitionName}
              setCompetitionName={setCompetitionName}
              onCancel={() => {
                setVisible(false);
                setCompetitionName("");
              }}
              onSubmit={onCreateCompetition}
            />
          ) : (
            <CreateCompetitionPhase1
              checkCompetitionName={checkCompetitionName}
              competitionName={competitionName}
              setCompetitionName={setCompetitionName}
              onCancel={() => {
                setVisible(false);
                setCompetitionName("");
              }}
              onNext={() => {
                setSecondPhaseVisible(true);
                const analytics = new SegmentHandler(segment);
                analytics.trackUserEvent(
                  SegmentHandler.EVENTS.COMPETITION_CREATE_PHASE_2,
                  competition.create
                );
              }}
            />
          )}
        </div>
        <div className="largeScreen:hidden mobile:visible launchCompetitionModalMobile">
          <CreateCompMobilePhase
            competition={competition}
            createCompetition={onCreateCompetition}
          />
        </div>
      </div>
    </AppModal>
  );
};

export default CreateCompetitionModal;
