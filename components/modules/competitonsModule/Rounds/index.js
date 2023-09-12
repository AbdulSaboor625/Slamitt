import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllContainers,
  getAllRounds,
  getQualifiedContainers,
  judgeSignup,
  notify,
  setRoundStatus,
  updateRound,
} from "../../../../Redux/Actions";
import Api from "../../../../services";
import { weightedScoreCalculator } from "../../../../utility/common";
import { roundStatus } from "../../../../utility/config";
import EmptyContentSection from "../emptyContentSection";
import DraftRound from "./draftRoundModule";
import LiveRound from "./liveRoundModule";

const Rounds = ({
  readOnlyState,
  tabActive,
  detailsOpen,
  setDetailsOpen,
  pusher,
}) => {
  const competition = useSelector((state) => state.competition);
  const { all } = useSelector((state) => state.containers);
  const [containers, setContainers] = React.useState([]);
  const user = useSelector((state) => state.auth.user);

  const rooms = useSelector((state) => state.rooms);
  const dispatch = useDispatch();

  useEffect(() => {
    if (competition.round.details) {
      getContainers();
    }
  }, [competition.round.details, all]);

  const getContainers = async () => {
    const response = await Api.get(
      `/container/${competition.round.details.competitionCode}-${competition.round.details.assignedRoomCode}`
    );
    if (response.code && response?.result) {
      response.result.forEach((container, idx) => {
        container.index = container.index || idx + 1;

        if (container.roundData && container.roundData.length) {
          container.roundScores = {};
          container.points = 0;
          container.adjusted = 0;

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
      });

      // dispatch(setContainerList(response?.result));
      setContainers(response?.result);
    }
  };

  const updateRoundDetails = (payload) => {
    dispatch(
      updateRound({
        ...payload,
        competitionRoundCode: competition.round.details?.competitionRoundCode,
      })
    );
  };

  // useEffect(() => {
  //   dispatch(getAllRounds());
  // }, []);

  useEffect(() => {
    if (competition.rounds)
      setRoundLiveOrDraft(competition.round.details?.isLive);
  }, [competition.rounds]);

  // useEffect(() => {
  //   if (judge && judge.judgeCode) {
  //     const urlBody = encodeBase64({
  //       judgeCode: judge.judgeCode,
  //       competitionRoundCode: judge.competitionRoundCode,
  //       type: "JUDGE",
  //     });

  //     window.open(
  //       `${process.env.NEXT_PUBLIC_NEXT_URL}/login/judge/${urlBody}`,
  //       "_blank"
  //     );
  //   }
  // }, [judge]);

  const handleJudgeThisRound = (competitionRoundCode) => {
    dispatch(
      judgeSignup({
        firstName: user.fName,
        lastName: user.lName,
        email: user.email,
        competitionRoundCode,
        loginType: "SELF",
      })
    );
  };

  const setRoundLiveOrDraft = (status) => {
    const { competitionRoundCode } = competition.round.details;
    dispatch(
      setRoundStatus({ status: status ? roundStatus.LIVE : roundStatus.DRAFT })
    );
    dispatch(
      updateRound({
        isLive: Boolean(status),
        competitionRoundCode,
      })
    );
  };

  const _deleteRound = async (round) => {
    try {
      const response = await Api.get(
        `round/delete/${round.competitionRoundCode}`
      );
      if (response?.code) {
        dispatch(
          notify({ message: "Round deleted successfully!", type: "success" })
        );
        dispatch(getAllRounds({ cCode: round.competitionCode, initial: true }));
        dispatch(getAllContainers());
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ message: error.message, type: "error" }));
    }
  };

  if (!Boolean(competition.round.details)) {
    return <EmptyContentSection tabActive={tabActive} />;
  }
  return (
    <div className={`${detailsOpen ? "block" : "hidden"} tablet:block`}>
      {competition.round.status === roundStatus.LIVE ? (
        <LiveRound
          readOnlyState={readOnlyState}
          pusher={pusher}
          setRoundLiveOrDraft={setRoundLiveOrDraft}
          data={competition.round.details}
          rooms={rooms}
          handleJudgeThisRound={handleJudgeThisRound}
          containers={containers}
          setContainers={setContainers}
          deleteRound={_deleteRound}
        />
      ) : (
        <DraftRound
          readOnlyState={readOnlyState}
          updateRoundImage={(image) =>
            updateRoundDetails({
              imageURL: image.url,
              emojiObject: image.emoji,
            })
          }
          setRoundLiveOrDraft={setRoundLiveOrDraft}
          data={competition.round.details}
          rooms={rooms}
          competition={competition.current}
          containers={containers}
          getContainers={getContainers}
          deleteRound={_deleteRound}
          pusher={pusher}
        />
      )}
    </div>
  );
};

export default Rounds;
