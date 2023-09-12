import { Image, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LeaderBoardContent,
  LeaderBoardHeader,
  Spinner,
} from "../../../components";
import { notify } from "../../../Redux/Actions";
import Api from "../../../services";
import { leaderboardEmptyState } from "../../../utility/imageConfig";
const LeaderBoard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { params = [] } = router.query;
  const [leaderboard, setLeaderboard] = React.useState(null);
  const [container, setContainers] = React.useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (params.length) {
      getLeaderBoard();
    }
  }, [params]);

  const getLeaderBoard = async () => {
    setLoad(true);
    try {
      const response = await Api.get(`/leaderboards/${params[0]}`);
      if (response.code && response.result) {
        setLeaderboard(response.result);
        // const cont = response.result.scoreboard.filter(
        //   (item) => !item.isHidden
        // );
        // const allContainers = cont;
        // const scores = allContainers.map((c) => c.score);
        // let uniqueScores = [...new Set(scores)];
        // const containerWithRank = allContainers?.map((c) => {
        //   let currentRank = uniqueScores?.indexOf(c?.score) + 1;
        //   return { ...c, currentRank };
        // });
        // setContainers(containerWithRank);
        setContainers(response.result.scoreboard);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ message: error.message, type: "error" }));
    }
    setLoad(false);
  };
  return (
    <div className="leaderboardPage">
      <LeaderBoardHeader
        leaderboard={leaderboard}
        container={container.slice(0, 3)}
        from="PUBLIC"
      />
      {user.userCode === leaderboard?.createdBy || leaderboard?.isLive ? (
        <LeaderBoardContent
          container={container}
          setContainers={setContainers}
          leaderboard={leaderboard}
          from="PUBLIC"
        />
      ) : (
        <>
          {!load ? (
            <div
              className={`leaderboardPageEmptyState ${
                !leaderboard?.isLive &&
                user.userCode !== leaderboard?.createdBy &&
                "empty-leaderboard"
              }`}
            >
              <Image preview={false} alt="" src={leaderboardEmptyState} />
              <Typography.Text>
                The Organiser has disabled the leaderboard at the moment
              </Typography.Text>
            </div>
          ) : (
            <Spinner />
          )}
        </>
      )}
    </div>
  );
};
export default LeaderBoard;
