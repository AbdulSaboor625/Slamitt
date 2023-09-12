import { Workbook } from "exceljs";
import * as fs from "file-saver";
import Api from "../services";
import { weightedScoreCalculator } from "./common";
import moment from "moment";

export const singleRoundScoreSheet = async (
  roundCode,
  fileName,
  roundWeightage,
  round,
  competitionType
) => {
  let containers = [];
  try {
    const response = await Api.get(
      `/container/get-all-containers/filter?competitionCode=${round.competitionCode}&&roundCode=${round.roundCode}`
    );

    if (response.code && response.result) {
      const cont = response.result;
      cont.forEach(async (container, idx) => {
        container.index = idx + 1;
        if (container.roundData && container.roundData.length) {
          container.roundScores = {};
          container.roundData.forEach((round) => {
            if (round.roundScore && round.roundScore.length) {
              container.points = weightedScoreCalculator(
                round.roundScore.filter(({ submit }) => submit),
                round.Round.roundWeightage
              );
            }
          });
        }
      });
      containers = cont;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.log(error);
    // dispatch(
    //   notify({
    //     message: error.message,
    //     type: "error",
    //   })
    // );
    return;
  }

  let submissions = await getRoundSubmissions(round?.competitionRoundCode);

  let uniqueJudge = [];
  containers.forEach((comp) => {
    const round = comp.roundData.find((rnd) => rnd.roundCode === roundCode);

    round?.roundScore.forEach((data) => {
      if (data.submit) {
        const roundScoresGiven = round?.roundScore?.filter((v) => {
          if (v.submit && v.assessment.find((ass) => ass.points !== null))
            return v;
        });

        uniqueJudge.push({
          ...data,
          round: round?.Round,
          containerName: comp.containerName,
          containerCode: comp.containerCode,
          roomName: comp?.Room?.roomName,
          Container: { ...comp },
          allRoundJudges: round?.roundAllJudges,
          roundScoreLength: roundScoresGiven?.length,
          adjustedScore: round?.adjustedScore || 0,
        });
      }
    });
  });
  // let sameJudCode = [];
  // const judges = [];
  // uniqueJudge.forEach((item) => {
  //   if (!sameJudCode.includes(`${item.containerCode}`)) {
  //     sameJudCode.push(item?.containerCode);
  //     judges.push(item);
  //   }
  // });

  const judges = uniqueJudge;
  // const judges = uniqueJudge.filter(
  //   (subSkill, index, self) =>
  //     index ===
  //     self.findIndex((t) => t.containerName === subSkill.containerName)
  // );
  const judgeGroup = {};

  judges.forEach((eachJudge) => {
    if (!judgeGroup.hasOwnProperty(eachJudge.judgeCode)) {
      judgeGroup[eachJudge.judgeCode] = [];
    }

    judgeGroup[eachJudge.judgeCode].push(eachJudge);
  });

  const workbook = new Workbook();
  await totalsForSingleJudge(
    workbook,
    roundWeightage,
    judgeGroup,
    judges,
    round,
    submissions,
    competitionType
  );
  Object.values(judgeGroup).forEach(async (group) => {
    const worksheet = workbook.addWorksheet(
      `${group[0]?.Judge?.firstName} ${group[0]?.Judge?.lastName} (${group[0]?.Judge?.email})`
      // .replace(
      //   /[^a-zA-Z0-9 ]/g,
      //   ""
      // )
    );
    worksheet.addRow([
      "Ranking",
      competitionType === "SOLO" ? "Participants1" : "Team Code",
      ...group[0].assessment.map((v) => v.label),
      "Feedback",
      "Total",
      // "Adjusted Scores",
      // "Final Score",
      "List",
    ]);

    const scores = group.map((p) => {
      const total = p.assessment.reduce((sum, v) => sum + v.points, 0);
      p.totalScore = total;
      return p;
    });

    scores.sort(function (a, b) {
      return b.totalScore - a.totalScore;
    });

    let rank = 1;
    let prevTotal = null;
    const newRankedUsers = scores.map((cnt, index) => {
      // Assign the same rank to users with the same total score
      if (cnt.totalScore === prevTotal) {
        rank--;
      }
      prevTotal = cnt.totalScore;
      const newCnt = { ...cnt, Ranking: rank };
      rank++;
      return newCnt;
    });

    newRankedUsers.forEach((participant) => {
      const submission = submissions?.find(
        (s) => s.containerCode === participant?.containerCode
      );
      const activeScore = submission?.score ? submission?.score : 0;
      worksheet.addRow([
        participant.Ranking,
        participant.containerName,
        ...participant.assessment.map((v) => v.points || "N/A"),
        participant.feedback.text,
        participant?.totalScore,
        // activeScore,
        // participant?.totalScore + activeScore,
        participant.roomName,
      ]);
    });

    worksheet.addRow([]);
    worksheet.addRow([]);
  });
  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    fs.saveAs(blob, fileName.replace(/[^a-zA-Z0-9 ]/g, ""));
  });
};

const totalsForSingleJudge = async (
  workbook,
  roundWeightage,
  judgeGroup,
  judges,
  round,
  submissions,
  competitionType = "TEAM"
) => {
  const worksheet = workbook.addWorksheet(
    round?.roundName.replace(/[^a-zA-Z0-9 ]/g, "")
  );

  const newJudge = Object.values(judgeGroup).map((item) => item?.[0])?.[0];
  const judgeData = newJudge?.allRoundJudges?.map((item) => ({
    name: `${item?.firstName} ${item?.lastName}`,
    judgeCode: item?.judgeCode,
  }));

  worksheet.addRow([
    "Ranking",
    competitionType === "SOLO" ? "Participants" : "Team Code",
    ...judgeData.map((item) => `${item?.name} (${round?.totalPoints})`),
    `Average (${round?.totalPoints})`,
    `Weighted Average (${roundWeightage}%)`,
    "Adjusted Scores",
    "Final Score",
    "List",
  ]);

  let container = [];
  judges.forEach((cont) => {
    const isScoredContainer = cont.assessment.find((v) => v.points !== null);
    const total = isScoredContainer
      ? cont.assessment.reduce((sum, v) => sum + v.points || 0, 0)
      : cont.assessment.reduce((sum, v) => sum + v.points || NaN, 0);
    container.push({
      containerCode: cont.containerCode,
      total,
      containerName: cont.containerName,
      judgeCode: cont.Judge.judgeCode,
      roomName: cont.roomName,
      allRoundJudges: cont.allRoundJudges,
      roundScoreLength: cont.roundScoreLength,
      adjustedScore: cont.adjustedScore,
    });
  });
  const finalData = [];
  const avgScoresSortedContainers = container.map((cont) => {
    const data = scoreJudge(cont.containerCode, container, judgeData);

    const avg = +(
      data.reduce((sum, v) => sum + (v.total === "N/A" ? 0 : v.total), 0) /
      cont.roundScoreLength
    );
    cont.avgScore = isNaN(avg) ? 0 : avg;
    return cont;
  });

  let rank = 1;
  let prevTotal;
  avgScoresSortedContainers.sort(function (a, b) {
    return b.avgScore + b.adjustedScore - (a.avgScore + a.adjustedScore);
  });

  const uniqueData = avgScoresSortedContainers.filter((item, index, self) => {
    // Return true only for the first occurrence of each unique ID
    return (
      self.findIndex((el) => el.containerCode === item.containerCode) === index
    );
  });
  uniqueData.forEach((cont, index) => {
    const submission = submissions?.find(
      (s) => s?.containerCode === cont?.containerCode
    );
    const activeScore = submission?.score ? submission?.score : 0;
    let canInsert = true;
    const data = scoreJudge(cont.containerCode, container, judgeData);
    let avg = "";
    let wtAvg = "";
    avg = Number.isNaN(cont.avgScore) ? 0 : cont.avgScore.toFixed(3);
    wtAvg = +(avg * (roundWeightage / 100)).toFixed(3);

    finalData.forEach((item) => {
      if (cont.containerCode === item[0]) {
        canInsert = false;
      }
    });
    if (wtAvg === prevTotal) rank = rank - 1;
    if (canInsert) {
      worksheet.addRow([
        rank,
        cont.containerName,
        ...data.map((v) => v.total),
        avg,
        wtAvg,
        cont.adjustedScore,
        wtAvg + cont.adjustedScore * (roundWeightage / 100),
        cont.roomName,
      ]);
    }
    prevTotal = wtAvg;
    rank = rank + 1;
  });
};

export const singleMockRoundScoreSheet = async (roundCode, fileName, round) => {
  let containers = [];
  try {
    const response = await Api.get(
      `/container/get-all-containers/filter?competitionCode=${round.competitionCode}&&roundCode=${round.roundCode}`
    );

    if (response.code && response.result) {
      const cont = response.result;
      cont.forEach((container, idx) => {
        container.index = idx + 1;
        container.points = 0;
        if (container.mockRoundData && container.mockRoundData.length) {
          if (container.mockRoundData && container.mockRoundData.length) {
            container.mockRoundData.forEach((round) => {
              if (round && round.roundCode === roundCode)
                container.points += round.roundScore || 0;
            });
          }
        }
      });
      containers = cont;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.log(error);
    // dispatch(
    //   notify({
    //     message: error.message,
    //     type: "error",
    //   })
    // );
    return;
  }
  const workbook = new Workbook();

  const worksheet = workbook.addWorksheet(
    round?.roundName.replace(/[^a-zA-Z0-9 ]/g, "")
  );

  worksheet.addRow([
    "Ranking",
    "Team Code",
    `Score(${
      containers?.[0]?.mockRoundData?.find(
        (round) => round?.roundCode === roundCode
      )?.Round?.maxPoints
    })`,
    `Weighted Total(${
      containers?.[0]?.mockRoundData?.find(
        (round) => round?.roundCode === roundCode
      )?.Round?.roundWeightage
    }%)`,
    "List",
  ]);

  containers.forEach((cont) => {
    cont.weightedTotal =
      (cont.points *
        cont?.mockRoundData?.find((round) => round?.roundCode === roundCode)
          ?.Round?.roundWeightage) /
      100;
  });
  containers.sort((a, b) => b.weightedTotal - a.weightedTotal);

  let rank = 1;
  let prevTotal = null;
  const newRankedUsers = containers.map((cnt, index) => {
    // Assign the same rank to users with the same total score
    if (cnt.points === prevTotal) {
      rank--;
    }
    prevTotal = cnt.points;
    const newCnt = { ...cnt, Ranking: rank };
    rank++;
    return newCnt;
  });

  newRankedUsers.forEach((container) => {
    worksheet.addRow([
      container.Ranking,
      container.containerName,
      container?.points,
      container?.weightedTotal,
      container.Room.roomName,
    ]);
  });

  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    fs.saveAs(blob, fileName.replace(/[^a-zA-Z0-9 ]/g, ""));
  });
};

const totals = async (
  workbook,
  roundWeightage,
  judgeGroup,
  judges,
  round,
  submissions,
  competitionType = "TEAM"
) => {
  const worksheet = workbook.addWorksheet(
    round?.roundName.replace(/[^a-zA-Z0-9 ]/g, "")
  );
  const judgeData = Object.values(judgeGroup).map((item) => ({
    name: `${item[0].Judge.firstName} ${item[0].Judge.lastName}`,
    judgeCode: item[0].Judge.judgeCode,
  }));
  worksheet.addRow([
    "Ranking",
    competitionType === "SOLO" ? "Participants" : "Team Code",
    // "Participants",
    ...judgeData.map((item) => `${item?.name} (${round?.totalPoints})`),
    `Average (${round?.totalPoints})`,
    // "Adjusted Scores",
    // "Finat Score",
    `Weighted Average (${roundWeightage}%)`,
    "List",
  ]);
  const container = [];
  judges.forEach((cont) => {
    const isScoredContainer = cont.assessment.find((v) => v.points !== null);
    const total = isScoredContainer
      ? cont.assessment.reduce((sum, v) => sum + v.points || 0, 0)
      : cont.assessment.reduce((sum, v) => sum + v.points || NaN, 0);
    container.push({
      containerCode: cont.containerCode,
      // participants: cont.Container?.users
      //   ?.map(({ firstName, lastName }) => `${firstName} ${lastName}`)
      //   .join(),
      total,
      containerName: cont.containerName,
      judgeCode: cont.Judge.judgeCode,
      roomName: cont.roomName,
      allRoundJudges: cont.allRoundJudges,
      roundScoreLength: cont.roundScoreLength,
    });
  });
  const finalData = [];
  const avgScoresSortedContainers = container.map((cont) => {
    const data = scoreJudge(cont.containerCode, container, judgeData);

    const avg = +(
      data.reduce((sum, v) => sum + (v.total === "N/A" ? 0 : v.total), 0) /
      cont.roundScoreLength
    );
    // if (cont.allRoundJudges.length === cont.roundScoreLength)
    cont.avgScore = isNaN(avg) ? 0 : avg;
    // else cont.avgScore = "N/A";
    return cont;
  });

  let rank = 1;
  let prevTotal;
  avgScoresSortedContainers.sort(function (a, b) {
    return b.avgScore - a.avgScore;
  });

  avgScoresSortedContainers.forEach((cont) => {
    const submission = submissions?.find(
      (s) => s?.containerCode === cont?.containerCode
    );
    const activeScore = submission?.score ? submission?.score : 0;
    let canInsert = true;
    const data = scoreJudge(cont.containerCode, container, judgeData);
    let avg = "";
    let wtAvg = "";
    // if (cont.allRoundJudges.length === cont.roundScoreLength) {
    avg = Number.isNaN(cont.avgScore) ? 0 : cont.avgScore.toFixed(3);
    wtAvg = +(avg * (roundWeightage / 100)).toFixed(3);
    // } else {
    //   avg = "N/A";
    //   wtAvg = "N/A";
    // }

    finalData.forEach((item) => {
      if (cont.containerCode === item[0]) {
        canInsert = false;
      }
    });
    if (wtAvg === prevTotal) rank = rank - 1;
    if (canInsert)
      // finalData.push([
      //   cont.containerCode,
      //   cont.containerName,
      //   // cont.participants,
      //   ...data.map((v) => v.total),
      //   avg,
      //   // activeScore,
      //   // avg + activeScore,
      //   wtAvg,
      //   cont.roomName,
      // ]);
      worksheet.addRow([
        rank,
        cont.containerName,
        // cont.participants,
        ...data.map((v) => v.total),
        avg,
        // activeScore,
        // avg + activeScore,
        wtAvg,
        cont.roomName,
      ]);
    prevTotal = wtAvg;
    rank = rank + 1;
  });
  // finalData.forEach((item) => {
  //   item.shift();
  //   worksheet.addRow([...item]);
  // });
};

const scoreJudge = (containerCode, containers, judgeData) => {
  const arr = [];
  judgeData.forEach((judge) => {
    const cont = containers.find(
      (v) =>
        v.containerCode === containerCode && judge.judgeCode === v.judgeCode
    );

    if (cont)
      arr.push({
        judgeCode: judge.judgeCode,
        total: Number.isNaN(parseFloat(cont.total)) ? "N/A" : cont.total,
      });
    else arr.push({ judgeCode: judge.judgeCode, total: 0 });
  });
  return arr;
};

export const allRoundsScoreSheet = async (competitionCode, competitionType) => {
  let containers = [];
  let allRounds = [];
  try {
    const response = await Api.get(
      `/container/get-all-containers/filter?competitionCode=${competitionCode}`
    );
    allRounds = await Api.get(`/round/${competitionCode}?live=true`);
    if (allRounds.code && allRounds.result) allRounds = allRounds.result;
    else throw new Error(allRounds.message);

    if (response.code && response.result) {
      const cont = response.result;
      cont.forEach((container, idx) => {
        container.index = idx + 1;
        if (container.roundData && container.roundData.length) {
          container.roundScores = {};
          container.roundData.forEach((round) => {
            if (round.roundScore && round.roundScore.length) {
              container.points = weightedScoreCalculator(
                round.roundScore.filter(({ submit }) => submit),
                round.Round.roundWeightage
              );
            }
          });
        }
      });
      containers = cont;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.log(error);
    // dispatch(
    //   notify({
    //     message: error.message,
    //     type: "error",
    //   })
    // );
    return;
  }
  let aRounds = [];
  allRounds.map((rnd) => {
    if (rnd.type === "GENERAL") {
      if (!!rnd.Judges.length) aRounds.push(rnd);
    } else {
      aRounds.push(rnd);
    }
  });
  allRounds = aRounds;

  const allSubmissions = await getLiveRoundsSubmissions(allRounds);
  const allRoundsSubmissions = await Promise.all(allSubmissions);
  const workbook = new Workbook();

  allRounds.forEach((round) => {
    containers.forEach((cont) => {
      cont?.mockRoundData?.reverse();
      if (round.assignedRoomCode === cont.roomCode) {
        if (round.type !== "MOCK") {
          if (cont.roundData && cont.roundData.length) {
            const data = cont.roundData.find(
              (v) => v.roundCode === round.roundCode
            );
            const roundScoresGiven = data
              ? data?.roundScore?.filter((v) => {
                  if (
                    v.submit &&
                    v.assessment.find((ass) => ass.points !== null)
                  )
                    return v;
                })
              : [];

            const weightedScore = data
              ? parseFloat(
                  weightedScoreCalculator(
                    roundScoresGiven,
                    round.roundWeightage
                  )
                )
              : 0;
            if (cont.rndScore)
              cont.rndScore.push(
                weightedScore +
                  (data?.adjustedScore
                    ? (data?.adjustedScore * round.roundWeightage) / 100
                    : 0) ?? 0
              );
            else
              cont.rndScore = [
                weightedScore +
                  (data?.adjustedScore
                    ? (data?.adjustedScore * round.roundWeightage) / 100
                    : 0) ?? 0,
              ];
          } else {
            if (!cont.rndScore) cont.rndScore = [0];
            else cont.rndScore.push(0);
          }
        } else {
          if (cont.mockRoundData && cont.mockRoundData.length) {
            const mockRoundData = cont.mockRoundData.filter(
              (cnt) => cnt.roundCode === round.roundCode
            );
            if (cont.rndScore)
              cont.rndScore.push(
                (mockRoundData[0]?.roundScore *
                  mockRoundData[0]?.Round?.roundWeightage) /
                  100 ?? 0
              );
            else
              cont.rndScore = [
                (mockRoundData[0]?.roundScore *
                  mockRoundData[0]?.Round?.roundWeightage) /
                  100 ?? 0,
              ];
          } else {
            if (!cont.rndScore) cont.rndScore = [0];
            else cont.rndScore.push(0);
          }
        }
      } else {
        if (!cont.rndScore) cont.rndScore = [0];
        else cont.rndScore.push(0);
      }
    });
  });
  const allRoundWorkSheet = workbook.addWorksheet("All Rounds");
  allRoundWorkSheet.addRow([
    "Ranking",
    competitionType === "SOLO" ? "Participants" : "Team Code",
    ...allRounds.map((rnd) => `${rnd.roundName} (${rnd.roundWeightage}%)`),
    "Total",
    "List",
  ]);

  const roundTotalSorted = containers.map((cnt) => {
    console.log("adjust", cnt);
    const total = cnt.rndScore.reduce(
      (acc, val) => acc + (!val || val === "N/A" ? 0 : val),
      0
    );
    // .reduce((sum, v) => {
    //   return sum + (!v || v === "N/A" ? 0 : v), 0;
    // });
    cnt.roundTotal = total;
    return cnt;
  });

  roundTotalSorted.sort(function (a, b) {
    return b.roundTotal - a.roundTotal;
  });

  let rank = 1;
  let prevTotal = null;
  const newRankedUsers = roundTotalSorted.map((cnt, index) => {
    // Assign the same rank to users with the same total score
    if (cnt.roundTotal === prevTotal) {
      rank--;
    }
    prevTotal = cnt.roundTotal;
    const newCnt = { ...cnt, Ranking: rank };
    rank++;
    return newCnt;
  });

  newRankedUsers.forEach((cnt) => {
    allRoundWorkSheet.addRow([
      cnt?.Ranking,
      cnt.containerName,
      ...cnt.rndScore,
      cnt?.roundTotal,
      cnt.Room.roomName,
    ]);
  });

  allRounds.forEach(async (rndM) => {
    const judges = [];
    containers.forEach((comp) => {
      const round = comp.roundData.find(
        (rnd) => rnd.roundCode === rndM.roundCode
      );

      round?.roundScore.forEach((data) => {
        if (data.submit) {
          const roundScoresGiven = round?.roundScore?.filter((v) => {
            if (v.submit && v.assessment.find((ass) => ass.points !== null))
              return v;
          });
          judges.push({
            ...data,
            round: round?.Round,
            containerName: comp.containerName,
            containerCode: comp.containerCode,
            roomName: comp.Room.roomName,
            Container: { ...comp },
            allRoundJudges: round?.roundAllJudges,
            roundScoreLength: roundScoresGiven?.length,
          });
        }
      });
    });

    const judgeGroup = {};

    judges.forEach((eachJudge) => {
      if (!judgeGroup.hasOwnProperty(eachJudge.judgeCode)) {
        judgeGroup[eachJudge.judgeCode] = [];
      }

      judgeGroup[eachJudge.judgeCode].push(eachJudge);
    });

    const sub = allRoundsSubmissions.find(
      (s) => s?.competitionRoundCode === rndM?.competitionRoundCode
    );

    allRoundsTotals(
      workbook,
      rndM.roundWeightage,
      judgeGroup,
      judges,
      rndM,
      sub?.submissions,
      competitionType,
      newRankedUsers
    );
  });
  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    fs.saveAs(blob, "All Rounds");
  });
};

const allRoundsTotals = async (
  workbook,
  roundWeightage,
  judgeGroup,
  judges,
  round,
  submissions,
  competitionType = "TEAM",
  containers
) => {
  const worksheet = workbook.addWorksheet(
    round?.roundName.replace(/[^a-zA-Z0-9 ]/g, "")
  );

  if (round.type !== "MOCK") {
    const judgeData = Object.values(judgeGroup).map((item) => ({
      name: `${item[0].Judge.firstName} ${item[0].Judge.lastName}`,
      judgeCode: item[0].Judge.judgeCode,
    }));

    worksheet.addRow([
      "Ranking",
      competitionType === "SOLO" ? "Participants" : "Team Code",
      // "Participants",
      ...judgeData.map((item) => `${item.name} (${round?.totalPoints})`),
      `Average (${round?.totalPoints})`,
      // "Adjusted Scores",
      // "Finat Score",
      "Adjustable Scores",
      `Weighted Average (${roundWeightage}%)`,
      "List",
    ]);
    const container = [];
    judges.forEach((cont) => {
      const isScoredContainer = cont.assessment.find((v) => v.points !== null);
      const total = isScoredContainer
        ? cont.assessment.reduce((sum, v) => sum + v.points || 0, 0)
        : cont.assessment.reduce((sum, v) => sum + v.points || NaN, 0);

      container.push({
        containerCode: cont.containerCode,
        // participants: cont.Container?.users
        //   ?.map(({ firstName, lastName }) => `${firstName} ${lastName}`)
        //   .join(),
        total,
        adjustedScore: !!cont?.Container?.roundData?.length
          ? cont?.Container?.roundData.find(
              ({ roundCode }) => roundCode === round?.roundCode
            )?.adjustedScore
          : 0,
        containerName: cont.containerName,
        judgeCode: cont.Judge.judgeCode,
        roomName: cont.roomName,
        allRoundJudges: cont.allRoundJudges,
        roundScoreLength: cont.roundScoreLength,
      });
    });

    const finalData = [];
    const avgScoresSortedContainers = container.map((cont) => {
      const data = scoreJudge(cont.containerCode, container, judgeData);

      const avg = +(
        data.reduce((sum, v) => sum + (v.total === "N/A" ? 0 : v.total), 0) /
        cont.roundScoreLength
      );
      // if (cont.allRoundJudges.length === cont.roundScoreLength)
      cont.avgScore = isNaN(avg) ? 0 : avg;
      // else cont.avgScore = "N/A";
      return cont;
    });
    avgScoresSortedContainers.forEach((item) => {
      item.totalAdjustable = item.avgScore + item.adjustedScore;
    });

    avgScoresSortedContainers.sort(function (a, b) {
      return b.totalAdjustable - a.totalAdjustable;
    });
    // avgScoresSortedContainers.sort(function (a, b) {
    //   return b.avgScore - a.avgScore;
    // });

    let rank = 1;
    let prevTotal;

    const uniqueData = avgScoresSortedContainers.filter((item, index, self) => {
      // Return true only for the first occurrence of each unique ID
      return (
        self.findIndex((el) => el.containerCode === item.containerCode) ===
        index
      );
    });
    uniqueData.forEach((cont) => {
      const submission = submissions?.find(
        (s) => s?.containerCode === cont?.containerCode
      );
      const activeScore = submission?.score ? submission?.score : 0;
      let canInsert = true;
      const data = scoreJudge(cont.containerCode, container, judgeData);
      let avg = "";
      let wtAvg = "";
      // if (cont.allRoundJudges.length === cont.roundScoreLength) {
      avg = Number.isNaN(cont.avgScore) ? 0 : cont.avgScore.toFixed(3);
      wtAvg = +(
        avg * (roundWeightage / 100) +
        cont?.adjustedScore * (roundWeightage / 100)
      ).toFixed(3);
      // } else {
      //   avg = "N/A";
      //   wtAvg = "N/A";
      // }

      finalData.forEach((item) => {
        if (cont.containerCode === item[1]) {
          canInsert = false;
        }
      });
      if (prevTotal === wtAvg) rank = rank - 1;
      if (canInsert)
        worksheet.addRow([
          rank,
          // cont.containerCode,
          cont.containerName,
          // cont.participants,
          ...data.map((v) => v.total),
          avg,
          // activeScore,
          // avg + activeScore,
          cont?.adjustedScore,
          wtAvg,
          cont.roomName,
        ]);
      // finalData.push([
      //   rank,
      //   // cont.containerCode,
      //   cont.containerName,
      //   // cont.participants,
      //   ...data.map((v) => v.total),
      //   avg,
      //   // activeScore,
      //   // avg + activeScore,
      //   wtAvg,
      //   cont.roomName,
      // ]);
      prevTotal = wtAvg;
      rank = rank + 1;
    });
    // finalData.forEach((item) => {
    //   console.log([...item])
    //   item.shift();
    //   worksheet.addRow([...item]);
    // });
  } else {
    worksheet.addRow([
      "Ranking",
      competitionType === "SOLO" ? "Participants4" : "Team Code",
      `Totals (${round?.maxPoints})`,
      `Weighted Total (${roundWeightage}%)`,
      "List",
    ]);
    containers.forEach((cnt) => {
      delete cnt.points;
      delete cnt.rndScore;
      delete cnt.roundTotal;
    });
    containers.forEach((cont) => {
      cont?.mockRoundData?.reverse();
      if (round.type === "MOCK") {
        if (cont.mockRoundData && cont.mockRoundData.length) {
          const mockRoundData = cont.mockRoundData.filter(
            (cnt) => cnt.roundCode === round.roundCode
          );
          if (cont.rndScore)
            cont.rndScore.push(mockRoundData[0]?.roundScore ?? 0);
          else cont.rndScore = [mockRoundData[0]?.roundScore ?? 0];
        } else {
          if (!cont.rndScore) cont.rndScore = [0];
          else cont.rndScore.push(0);
        }
      }
    });

    containers.forEach((cnt) => {
      const total = cnt.rndScore.reduce(
        (sum, v) => sum + (v === undefined || v === "N/A" ? 0 : v),
        0
      );
      cnt.roundTotal = total;
      return cnt;
    });

    containers.sort(function (a, b) {
      return b.roundTotal - a.roundTotal;
    });

    let rank = 1;
    let prevTotal = null;
    const newRankedUsers = containers.map((cnt, index) => {
      // Assign the same rank to users with the same total score
      if (cnt.roundTotal === prevTotal) {
        rank--;
      }
      prevTotal = cnt.roundTotal;
      const newCnt = { ...cnt, Ranking: rank };
      rank++;
      return newCnt;
    });

    newRankedUsers.forEach((cnt) => {
      worksheet.addRow([
        cnt?.Ranking,
        cnt.containerName,
        ...cnt.rndScore,
        (cnt.roundTotal * round.roundWeightage) / 100,
        cnt.Room.roomName,
      ]);
    });
  }
};

export const allRoomsScoreSheet = async (competitionCode) => {
  const containers = [];
  let allRooms = [];
  let allRounds = [];
  try {
    const response = await Api.get(
      `/container/get-all-containers/filter?competitionCode=${competitionCode}`
    );
    allRooms = await Api.get(`/room/${competitionCode}`);

    allRounds = await Api.get(`/round/${competitionCode}?live=true`);

    if (allRounds.code && allRounds.result) allRounds = allRounds.result;
    else throw new Error(allRounds.message);

    if (allRooms.code && allRooms.result) allRooms = allRooms.result;
    else throw new Error(allRooms.message);

    if (response.code && response.result) {
      const cont = response.result;
      cont.forEach((container, idx) => {
        container.index = idx + 1;
        if (container.roundData && container.roundData.length) {
          container.roundScores = {};
          container.roundData.forEach((round) => {
            if (round.roundScore && round.roundScore.length) {
              container.points = weightedScoreCalculator(
                round.roundScore.filter(({ submit }) => submit),
                round.Round.roundWeightage
              );
            }
          });
        }
      });
      containers = cont;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.log(error);
    // dispatch(
    //   notify({
    //     message: error.message,
    //     type: "error",
    //   })
    // );
    return;
  }
  const workbook = new Workbook();
  allRooms.forEach((room) => {
    const allRoundWorkSheet = workbook.addWorksheet(room.roomName);
    allRoundWorkSheet.addRow([
      "Team Code (alphabetically)",
      ...allRounds.map((rnd) => `${rnd.roundName} (${rnd.roundWeightage}%)`),
      "Total",
    ]);
    containers.forEach((cont) => {
      if (
        cont.roomCode === room.roomCode &&
        cont.roundData &&
        cont.roundData.length
      ) {
        if (cont.roundData.length !== allRounds.length) {
          for (let i = 0; i < allRounds.length; i++) {
            if (
              !cont.roundData[i] ||
              cont.roundData[i].roundCode !== allRounds[i].roundCode
            ) {
              cont.roundData = insert(cont.roundData, i, null);
            }
          }
        }
        cont.roundData.forEach((data) => {
          const weightedScore = allRounds.find(
            (round) => round.roundCode === data?.roundCode
          )
            ? parseFloat(
                weightedScoreCalculator(
                  data.roundScore,
                  data?.Round?.roundWeightage
                )
              )
            : "N/A";
          if (cont.rndScore) cont.rndScore.push(weightedScore);
          else cont.rndScore = [weightedScore];
        });
      }
    });
    containers.forEach((cnt) => {
      if (cnt.roomCode === room.roomCode && cnt.rndScore) {
        allRoundWorkSheet.addRow([
          cnt.containerName,
          ...cnt.rndScore,
          cnt.rndScore.reduce((sum, v) => sum + (v === "N/A" ? 0 : v), 0),
        ]);
      }
    });
  });
  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    fs.saveAs(blob, "All Rooms");
  });
};

const insert = (arr, index, newItem) => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index),
];

const getRoundSubmissions = async (competitionRoundCode) => {
  let submissions = [];
  try {
    const response = await Api.post("/submissions/getSubmissions", {
      competitionRoundCode: competitionRoundCode,
    });
    if (response.result.length) {
      submissions = response.result;
    }
  } catch (err) {
    console.log(err);
  }
  return submissions;
};

const getLiveRoundsSubmissions = async (rounds = []) => {
  if (rounds?.length) {
    const result = rounds.map(async (round) => {
      const submissions = await getRoundSubmissions(
        round?.competitionRoundCode
      );
      return {
        submissions,
        competitionRoundCode: round?.competitionRoundCode,
      };
    });
    return result;
  }
};

export const singleContainerScores = (container) => {
  const fileName = `${container?.containerName} scores`;

  const workbook = new Workbook();

  const overAllWorksheet = workbook.addWorksheet(
    `Overall`.replace(/[^a-zA-Z0-9 ]/g, "")
  );

  overAllWorksheet.addRow([
    "Round Name (Weightage)",
    "Judges Average",
    "Weighted Average",
  ]);

  const allRounds = [];
  container?.roundData.forEach((round) => {
    allRounds.push(round);
  });
  container?.mockRoundData.forEach((round) => {
    round.type = "MOCK";
    if (round?.Round?.isLive) allRounds.push(round);
  });
  let overAllScore = 0;
  let totalWeightedScore = 0;
  allRounds.forEach((round) => {
    let judgesAvg = 0;

    if (round?.type !== "MOCK") {
      round?.roundScore.forEach((scores) => {
        if (scores?.submit)
          scores?.assessment?.forEach(
            (criteria) => (judgesAvg += +criteria?.points)
          );
      });
    } else {
      judgesAvg = round?.roundScore;
    }

    round?.type !== "MOCK"
      ? (judgesAvg /= round?.roundScore?.length)
      : judgesAvg;
    overAllScore += judgesAvg;
    const weightedAvg = judgesAvg * (+round?.Round?.roundWeightage / 100);
    totalWeightedScore += weightedAvg;

    overAllWorksheet.addRow([
      `${round?.Round?.roundName} (${round?.Round?.roundWeightage}%)`,
      judgesAvg.toFixed(3),
      weightedAvg.toFixed(3),
    ]);
  });

  overAllWorksheet.addRow([
    "Total",
    overAllScore.toFixed(3),
    totalWeightedScore.toFixed(3),
  ]);

  container?.roundData.forEach((round) => {
    const worksheet = workbook.addWorksheet(
      `${round?.Round?.roundName}`.replace(/[^a-zA-Z0-9 ]/g, "")
    );

    worksheet.addRow(["Judge Name", "Weighted Average"]);

    let allJudgesTotal = 0;
    round?.roundScore.forEach((scores) => {
      if (scores?.submit) {
        let judgeTotal = 0;
        scores?.assessment?.forEach(
          (criteria) => (judgeTotal += +criteria?.points)
        );

        allJudgesTotal += judgeTotal;

        worksheet.addRow([
          `${scores?.Judge?.firstName} ${scores?.Judge?.lastName}`,
          judgeTotal,
        ]);
      }
    });

    worksheet.addRow([`Total`, allJudgesTotal]);
  });

  container?.mockRoundData.forEach((round) => {
    const worksheet = workbook.addWorksheet(
      `${round?.Round?.roundName}`.replace(/[^a-zA-Z0-9 ]/g, "")
    );

    worksheet.addRow(["Weighted Total"]);
    worksheet.addRow([round?.roundScore]);
  });

  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    fs.saveAs(blob, fileName.replace(/[^a-zA-Z0-9 ]/g, ""));
  });
};

export const exportRegistration = async ({
  value,
  competitionCode,
  competitionType,
}) => {
  let rooms = [];
  if (value === "all") {
    const roomResponse = await Api.get(`room/${competitionCode}`);
    if (roomResponse?.result) rooms = roomResponse?.result;
  } else {
    const roomResponse = await Api.get(`room/code/${value}`);
    if (roomResponse?.result && roomResponse?.code)
      rooms.push(roomResponse?.result);
  }

  // file name
  const fileName = `${
    value !== "all" ? rooms[0]?.roomName : "All"
  } registration`;

  const workbook = new Workbook();

  const result = rooms.map(async (room) => {
    await getSingleRoomRegistration(workbook, room, competitionType);
  });

  await Promise.all(result);

  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    fs.saveAs(blob, fileName.replace(/[^a-zA-Z0-9 ]/g, ""));
  });
};

const getSingleRoomRegistration = async (workbook, room, competitionType) => {
  const worksheet = workbook.addWorksheet(
    `${room?.roomName}`.replace(/[^a-zA-Z0-9 ]/g, "")
  );

  worksheet.addRow([
    competitionType === "SOLO" ? "Participant" : "Team" + " Code",
    "Email",
    "First Name",
    "Last Name",
    "Institute",
    "Registered On",
    "status",
  ]);
  let containers = [];
  const response = await Api.get(`container/${room?.competitionRoomCode}`);

  if (response?.result && response?.code) {
    containers = response?.result;
  }
  const cont = containers.filter((item) => !!item.users.length);
  cont.forEach((container) => {
    // if (container?.users?.length) {
    container?.users?.forEach((user) => {
      worksheet.addRow([
        container?.containerName,
        user?.email,
        user?.firstName,
        user?.lastName,
        user?.institute,
        user?.createdAt
          ? moment(user?.createdAt).format("DD/MM/YYYY hh:mm A")
          : null,
        user?.status === "ONBOARDED" ? "REGISTERED" : user?.status,
      ]);
    });
    // }
    // else {
    //   worksheet.addRow([
    //     container?.containerName,
    //     "N/A",
    //     "N/A",
    //     "N/A",
    //     "N/A",
    //     "N/A",
    //     "UNASSIGNED",
    //   ]);
    // }
  });
};

export const exportSkippedContainer = async (data) => {
  const fileName = `Skipped Containers`;

  const workbook = new Workbook();

  const worksheet = workbook.addWorksheet(
    `${fileName}`.replace(/[^a-zA-Z0-9 ]/g, "")
  );

  worksheet.addRow([
    "Team Code",
    "Email",
    "First Name",
    "Last Name",
    "reasons",
  ]);

  data?.forEach((container) => {
    if (
      container?.firstName === "" &&
      container?.lastName === "" &&
      container?.email === "" &&
      container?.containerName === ""
    ) {
    } else {
      worksheet.addRow([
        container?.containerName,
        container?.email || "N/A",
        container?.firstName || "N/A",
        container?.lastName || "N/A",
        container?.reasons?.join(","),
      ]);
    }
  });

  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    fs.saveAs(blob, fileName.replace(/[^a-zA-Z0-9 ]/g, ""));
  });
};

export const exportRoundWithAdjustScore = (round, containers) => {
  const fileName = `${round?.roundName} Score`;

  const workbook = new Workbook();

  const worksheet = workbook.addWorksheet(
    `${fileName}`.replace(/[^a-zA-Z0-9 ]/g, "")
  );

  const judges = [];
  round?.Judges?.forEach((judge) => {
    judges.push({
      judgeCode: judge.judgeCode,
      name: `${judge.firstName} ${judge.lastName}`,
    });
  });

  worksheet.addRow([
    "Team Code",
    ...judges?.map((j) => j?.name),
    "Average",
    `Weighted Total (${round?.roundWeightage}%)`,
    "Adjusted Score",
    "Final Score",
  ]);

  containers?.forEach((container) => {
    const roundData = container?.roundData?.find(
      (roundData) => roundData?.roundCode === round?.roundCode
    );

    if (roundData) {
      const judgesScore = [];

      roundData?.roundScore?.forEach(({ assessment }) => {
        let point = 0;
        assessment?.forEach(({ points }) => {
          point += points;
        });
        judgesScore.push(point / assessment?.length);
      });

      const weightedScore = Number(
        weightedScoreCalculator(roundData?.roundScore, round?.roundWeightage)
      );

      const adjustedScore = Number(roundData?.adjustedScore);

      worksheet.addRow([
        container?.containerName,
        ...judgesScore,
        judgesScore.reduce((a, b) => a + b, 0) / judgesScore?.length,
        weightedScore,
        adjustedScore ? adjustedScore : "N/A",
        adjustedScore ? weightedScore + adjustedScore : weightedScore,
      ]);
    } else {
      worksheet.addRow([
        container?.containerName,
        ...judges?.map(() => "N/A"),
        "N/A",
        "N/A",
        "N/A",
        "N/A",
      ]);
    }
  });

  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    fs.saveAs(blob, fileName.replace(/[^a-zA-Z0-9 ]/g, ""));
  });
};
