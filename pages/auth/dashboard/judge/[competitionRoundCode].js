import { useRouter } from "next/router";
import React from "react";
import { JudgeDashboardModule } from "../../../../components";
import withJudgeAuth from "../../../../components/RouteAuthHandler/withJudgeAuth";

const JudgeDashboard = ({ pusher }) => {
  window.history.pushState(null, null, window.location.href);
  window.onpopstate = function () {
    window.history.go(1);
  };
  const router = useRouter();
  const { competitionRoundCode } = router.query;
  return (
    <JudgeDashboardModule
      pusher={pusher}
      competitionRoundCode={competitionRoundCode}
    />
  );
};

export default withJudgeAuth(JudgeDashboard);
