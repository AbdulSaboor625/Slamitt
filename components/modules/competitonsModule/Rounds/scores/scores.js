import { Button, Image, Input, Tooltip, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { notify } from "../../../../../Redux/Actions";
import Api from "../../../../../services";
import { weightedScoreCalculator } from "../../../../../utility/common";
import { singleRoundScoreSheet } from "../../../../../utility/excelService";
import {
  CheckNewIcon,
  DoneIcon,
  EditPencilIcon,
  ExportSubmissionIcon,
  ReloadIcon,
} from "../../../../../utility/iconsLibrary";

const AdjustContainerScore = ({
  container,
  round,
  handleUpdateContainerScore,
  i,
  competition,
  disableInput,
  judgesList,
}) => {
  const [maxAdjustableNumber, setMaxAdjustableNumber] = useState(0);
  const [minAdjustableNumber, setMinAdjustableNumber] = useState(0);
  const [scoreByRound, setScoreByRound] = useState(0);
  const [editable, setEditable] = useState(false);
  const [adjustableScore, setAdjustableScore] = useState(0.0);
  const [scoredRound, setScoredRound] = useState({});
  const [scoredRound1, setScoredRound1] = useState({});
  const dispatch = useDispatch();

  console.log("Container: ", container);

  useEffect(() => {
    if (scoredRound && scoredRound?.roundScore?.length) {
      const submittedScores = scoredRound?.roundScore?.filter(
        ({ submit }) => submit
      );
      const weightageScore = weightedScoreCalculator(
        submittedScores,
        round?.roundWeightage
      );
      setScoreByRound(Number(weightageScore));
    }
  }, [round, container, scoredRound]);

  useEffect(() => {
    setScoredRound(
      container?.roundData?.find(
        ({ roundCode }) => roundCode === round?.roundCode
      )
    );
    setScoredRound1(
      container?.roundData?.find(
        ({ roundCode }) => roundCode === round?.roundCode
      )
    );
  }, [round, container]);

  useEffect(() => {
    if (round?.roundWeightage && round?.totalPoints) {
      setMaxAdjustableNumber(
        Number(
          (round?.totalPoints * round?.roundWeightage) / 100 - scoreByRound
        ).toFixed(2)
      );
      setMinAdjustableNumber(
        // -((round?.totalPoints * round?.roundWeightage) / 100).toFixed(2)
        -scoreByRound
      );
    }
    setAdjustableScore(scoredRound?.adjustedScore);
  }, [round, container, scoreByRound]);

  const handleUpdateScore = (e, updateScore = false) => {
    // if (Number(e?.target?.value) !== 0) {
    if (
      Number((e?.target?.value * round?.roundWeightage) / 100) >
      maxAdjustableNumber
    ) {
      dispatch(
        notify({
          message: `Adjust score range for ${container?.containerName} is +${
            (maxAdjustableNumber * 100) / round?.roundWeightage
          }/${(minAdjustableNumber * 100) / round?.roundWeightage}`,
          type: "error",
        })
      );
      setAdjustableScore(scoredRound1?.adjustedScore);
      setScoredRound(scoredRound1);
    } else if (
      Number((e?.target?.value * round?.roundWeightage) / 100) <
        minAdjustableNumber &&
      Number(e?.target?.value) < 0
    ) {
      dispatch(
        notify({
          message: `Adjust score range for ${container?.containerName} is +${
            (maxAdjustableNumber * 100) / round?.roundWeightage
          }/-${(minAdjustableNumber * 100) / round?.roundWeightage}`,
          type: "error",
        })
      );
      setAdjustableScore(scoredRound1?.adjustedScore);
      setScoredRound(scoredRound1);
    } else {
      updateScore && handleUpdateContainerScore(i, Number(e.target.value));
    }
    // }
  };

  const disable = () => {
    return (
      !round?.isLive ||
      competition?.status !== "ACTIVE" ||
      disableInput ||
      scoreByRound === 0
    );
  };

  return (
    <div className="roundScoresContentListItem">
      <div className="roundScoresContentListUsername">
        {/* container avatar */}
        <div className="userAvatar">
          {container?.emojiObject ? (
            <p className="submissionTeamEmoji" style={{ fontSize: "2rem" }}>
              {container?.emojiObject.emoji}
            </p>
          ) : (
            <Image
              src={container?.imageURL}
              preview={false}
              width={40}
              heigth={40}
              alt="thumbnail"
            />
          )}
        </div>
        {/* container name and score */}
        <div className="roundScorestUsernameWrap">
          <Typography.Text className="roundScorestUsername">
            {container?.containerName}
          </Typography.Text>
        </div>
      </div>
      {/* adjustable input field */}
      {competition?.status == "CONCLUDED" && !adjustableScore ? (
        <>Points were neither added nor removed</>
      ) : (
        <div className="roundScoresContentListAdjustScores">
          {/* <Typography.Text className="roundScoresLabel">
          Adjust Scores by
        </Typography.Text> */}
          {!judgesList?.filter((item) => item.status === "JUDGED").length ? (
            <Tooltip
              trigger={"hover"}
              placement="top"
              color={"black"}
              title="You will be able to give the scores when at least one judge releases scores"
            >
              <div className="roundScoresTextField">0</div>
            </Tooltip>
          ) : (
            <Input
              disabled={disable() || !editable}
              className="roundScoresTextField"
              type="number"
              max={round?.totalPoints}
              // min={-round?.totalPoints}
              value={adjustableScore}
              onChange={(e) => {
                setAdjustableScore(e.target.value);
                setScoredRound({
                  ...scoredRound,
                  adjustedScore: e.target.value,
                });
              }}
              placeholder={`${
                // `+5/-5`
                !disable() || adjustableScore === 0
                  ? `+${(maxAdjustableNumber * 100) / round?.roundWeightage}/${
                      (minAdjustableNumber * 100) / round?.roundWeightage
                    }`
                  : "0"
              }`}
              // onBlur={(e) => {
              //   scoredRound1?.adjustedScore !== Number(e?.target?.value) &&
              //     handleUpdateScore(e);
              // }}
            />
          )}
          {/* confirm or undo score */}
          {competition?.status !== "CONCLUDED" && (
            <div className="scoresEditButtons">
              {editable && (
                <Button
                  // disabled={!adjustableScore}
                  className="buttonReset"
                  icon={<ReloadIcon />}
                  onClick={() => {
                    setEditable(false);
                    setScoredRound(scoredRound1);
                    setAdjustableScore(scoredRound1?.adjustedScore);
                  }}
                />
              )}
              {competition?.status != "CONCLUDED" ? (
                !editable ? (
                  !!judgesList?.filter((item) => item.status === "JUDGED")
                    .length && (
                    <Button
                      className="buttonEdit"
                      icon={<EditPencilIcon />}
                      onClick={() => setEditable(true)}
                    />
                  )
                ) : (
                  <Button
                    className="buttonSave"
                    disabled={!adjustableScore}
                    icon={<CheckNewIcon />}
                    onClick={() => {
                      setEditable(false);
                      scoredRound1?.adjustedScore !== Number(adjustableScore) &&
                        handleUpdateScore(
                          { target: { value: adjustableScore } },
                          true
                        );
                    }}
                  />
                )
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
      )}
      <div className="roundScoresContentListTakenScores">
        {!disable() ? (
          <Tooltip
            title={
              scoreByRound +
              "/" +
              (round?.totalPoints * round?.roundWeightage) / 100
            }
          >
            <Typography.Text className="roundScoresStatus">
              <strong
                className={
                  adjustableScore
                    ? "roundTakenScores textOrange"
                    : "roundTakenScores "
                }
              >
                {Number(
                  Number(scoreByRound) +
                    Number(
                      scoredRound?.adjustedScore
                        ? (scoredRound?.adjustedScore * round?.roundWeightage) /
                            100
                        : 0
                    )
                ).toFixed(2)}
              </strong>
              /{(round?.totalPoints * round?.roundWeightage) / 100}
            </Typography.Text>
          </Tooltip>
        ) : (
          <Typography.Text className="noScore">0.000</Typography.Text>
        )}
      </div>
    </div>
  );
};

const Scores = ({
  containers,
  setContainers,
  round,
  competition,
  judgesList,
}) => {
  const [isAnyJudgeSubmit, setIsAnyJudgeSubmit] = useState(false);
  const handleUpdateContainerScore = (index, value) => {
    const newContainers = [...containers];
    newContainers[index].adjusted = value;
    const container = newContainers[index];
    const response = Api.update(`container/${container?.containerCode}`, {
      adjustedScore: {
        roundCode: round?.roundCode,
        adjustedScore: value,
      },
    });
    if (response.code && response.result) {
      dispatch(
        notify({
          message: `Score adjusted successfully`,
          type: "success",
        })
      );
    }
    setContainers(newContainers);
  };

  useEffect(() => {
    if (round?.Judges?.length) {
      round?.Judges?.forEach((judge) => {
        judge?.status === "JUDGED" && setIsAnyJudgeSubmit(true);
        return;
      });
    } else {
      setIsAnyJudgeSubmit(false);
    }
  }, [round]);

  return (
    <div className="roundScoresContent">
      {isAnyJudgeSubmit && (
        <div className="submissionsContentHeader roundScoresContentListItem">
          <div className="roundScoresContentListUsername">
            <Button
              className="buttonImportSubmission"
              // onClick={() => exportRoundWithAdjustScore(round, containers)}
              onClick={() => {
                singleRoundScoreSheet(
                  round.roundCode,
                  `${round?.Competition?.competitionName}_${round.roundName}`,
                  round.roundWeightage,
                  round,
                  competition?.competitionType
                );
              }}
            >
              <ExportSubmissionIcon />
              Export Scoresheet
            </Button>
          </div>
          <div className="roundScoresContentListAdjustScores">
            <Typography.Text className="scoresTableTitle">
              Adjust scores upto the round total
            </Typography.Text>
          </div>
          <div className="roundScoresContentListTakenScores">
            <Typography.Text className="scoresTableTitle">
              Final Scores
            </Typography.Text>
          </div>
        </div>
      )}
      {/* {isAnyJudgeSubmit ? ( */}
      <div className="roundScoresContentList">
        {containers.map((container, i) => {
          return (
            <AdjustContainerScore
              key={i}
              container={container}
              handleUpdateContainerScore={handleUpdateContainerScore}
              i={i}
              round={round}
              competition={competition}
              disableInput={!isAnyJudgeSubmit}
              judgesList={judgesList}
            />
          );
        })}
      </div>
      {/* ) : (
        <EmptyState />
      )} */}
    </div>
  );
};

export default Scores;
