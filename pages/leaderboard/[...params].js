import { Image, Skeleton, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppPageHeader,
  LeaderBoardContent,
  LeaderBoardHeader,
  Spinner,
} from "../../components";
import withAuth from "../../components/RouteAuthHandler/withAuth";
import {
  getAllCompetitionsOrganized,
  getAllCompetitionsParticipated,
  getCategoryAndSubCategory,
  notify,
} from "../../Redux/Actions";
import Api from "../../services";
import { leaderboardEmptyState } from "../../utility/imageConfig";
const LeaderBoard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const competition = useSelector((state) => state.competition);
  const user = useSelector((state) => state.auth.user);
  const { params = [] } = router.query;
  const [leaderboard, setLeaderboard] = React.useState(null);
  const [load, setLoad] = useState(true);
  const [container, setContainers] = React.useState([]);
  const [isLaunchCompetitionModalOpen, setIsLaunchCompetitionModalOpen] =
    React.useState(false);
  const [compCode, setCompCode] = useState("");

  useEffect(() => {
    if (params.length) {
      getLeaderBoard();
    }
    dispatch(getCategoryAndSubCategory());
    dispatch(getAllCompetitionsParticipated());
    dispatch(getAllCompetitionsOrganized());
  }, [params]);
  useEffect(() => {
    if (user && leaderboard && user?.userCode !== leaderboard?.createdBy)
      window.location.href = `/leaderboard/public/${params[0]}`;
    if (user?.userCode === leaderboard?.createdBy) onUpdateLeaderBoardPressed();
  }, [leaderboard]);

  const [isSwitchActive, setIsSwitchActive] = useState(false);
  useEffect(() => {
    if (leaderboard) {
      setIsSwitchActive(leaderboard?.autoUpdate);
      setCompCode(leaderboard?.competitions?.[0]?.competitionCode);
    }
  }, [leaderboard]);

  const getLeaderBoard = async () => {
    setLoad(true);
    try {
      const response = await Api.get(`/leaderboards/${params[0]}`);
      if (response.code && response.result) {
        setLeaderboard(response.result);
        setCompCode(response.result?.competitions?.[0]?.competitionCode);
        // setContainers(response.result.scoreboard);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ message: error.message, type: "error" }));
    }
    setLoad(false);
  };

  const onUpdateLeaderBoardPressed = async (clickedUpdate = false) => {
    setLoad(true);
    try {
      const response = await Api.get(`/leaderboards/${params?.[0]}/update`);
      if (response.code && response.result) {
        //   const allContainers = response?.result;
        //   const scores = allContainers.map((c) => c.score);
        //   let uniqueScores = [...new Set(scores)];
        //   const containerWithRank = allContainers?.map((c) => {
        //     let currentRank = uniqueScores?.indexOf(c?.score) + 1;
        //     return { ...c, currentRank, prevRank: currentRank };
        //   });
        // setContainers(containerWithRank);
        setContainers(response.result);
        if (clickedUpdate)
          dispatch(
            notify({
              type: "success",
              message: "Leaderboard updated successfully.",
            })
          );
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ message: error.message, type: "error" }));
    }
    setLoad(false);
  };

  const onPublishOrUpdateLeaderBoardPressed = async (body, clickOn = "") => {
    if (params) {
      const payload = {};
      if (body.isPublished) payload.isPublished = body.isPublished;
      if (body.isLive || body.isLive === false) payload.isLive = body.isLive;
      if (body.leaderboardName) payload.leaderboardName = body.leaderboardName;
      if (container.length) payload.scoreboard = container;
      if (body.imageURL) payload.imageURL = body.imageURL;
      if (body.emojiObject) payload.emojiObject = body.emojiObject;
      payload.autoUpdate = body.autoUpdate;
      payload.competitionCode = compCode;
      try {
        const response = await Api.update(
          `/leaderboards/${params?.[0]}`,
          payload
        );
        if (response.code && response.result) {
          setLeaderboard(response.result);
          if (body.update)
            dispatch(
              notify({
                type: "success",
                message: "Leaderboard updated successfully.",
              })
            );
          if (body?.isLive || body?.isLive === false) {
            dispatch(
              notify({
                type: "success",
                message: `Leaderboard is now ${
                  body?.isLive === true ? "live" : "not in live"
                }`,
              })
            );
          } else if (clickOn === "PUBLISH") {
            dispatch(
              notify({
                type: "success",
                message: `Leaderboard published successfully.`,
              })
            );
          }
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        dispatch(notify({ message: error.message, type: "error" }));
      }
    }
  };

  const validForLeaderboard = (containers) => {
    let array = [];
    [...containers].forEach((item) => {
      item.forEach((innerItem) => {
        array.push(innerItem);
      });
    });

    if (array.filter((item) => item.score != 0).length >= 2) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="leaderboardPage">
      {!!container.length && container?.[0]?.[0]?.score != 0 ? (
        !load ? (
          <div className="leaderboardPage">
            <LeaderBoardHeader
              leaderboard={leaderboard}
              onUpdateLeaderBoardPressed={onUpdateLeaderBoardPressed}
              onPublishOrUpdateLeaderBoardPressed={
                onPublishOrUpdateLeaderBoardPressed
              }
              container={container.slice(0, 3)}
              publicLeaderboard={false}
              // competition={competition.current}
              isSwitchActive={isSwitchActive}
              setIsSwitchActive={setIsSwitchActive}
              from="ORGANISER"
              canUpdateLeaderBoard={validForLeaderboard(container)}
            />

            {user.userCode === leaderboard?.createdBy || leaderboard?.isLive ? (
              <LeaderBoardContent
                container={container}
                setContainers={setContainers}
                leaderboard={leaderboard}
                // from="ORGANISER"
              />
            ) : (
              <Skeleton loading={true} avatar />
            )}
          </div>
        ) : (
          <Skeleton loading={true} avatar />
        )
      ) : (
        <div className="organiserLeaderboardPageEmptyState">
          <Image
            alt="Leaderboard Image"
            preview={false}
            // src={leaderboardEmptyState}
            src="https://rethink-competitions.s3.amazonaws.com/1686078590928_leaderboardplaceholder.png"
          />
          <Typography.Text>
            Your competition leaderboard will update in real time here as your{" "}
            {competition?.current?.competitionType == "SOLO"
              ? "Participants"
              : "Teams"}{" "}
            start getting scored
          </Typography.Text>
        </div>
      )}
    </div>
  );
};

export default withAuth(LeaderBoard);
