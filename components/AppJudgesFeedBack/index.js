import { Card, Tabs, Typography } from "antd";
import React from "react";
import { LikeIcon, LikeSVGIcon } from "../../utility/iconsLibrary";

const AppJudgesFeedBack = ({
  round,
  onClickCard = null,
  activeCard = false,
}) => {
  const { roundCode, roundScore } = round;

  const EmojiSection = ({ assessment }) => (
    <>
      <ul className="roundStatsReactList">
        {assessment &&
          assessment.length &&
          assessment.map(({ label, points, endorse }) => (
            <li key={label}>
              <Typography.Text className="roundStatsReactEmoji">
                😐 {endorse && <LikeSVGIcon />}
              </Typography.Text>
              <Typography.Text className="roundStatsReactSkill">
                {label}
              </Typography.Text>
              <Typography.Text className="roundStatsReactNumber">
                {points}
              </Typography.Text>
            </li>
          ))}
      </ul>
    </>
  );


  return (
    <Card
      className="roundStatsBlock"
      onClick={onClickCard}
      style={activeCard ? { backgroundColor: "#3b3b3b" } : {}}
    >
      <div className="roundStatsBlockTitle">
        <Typography.Title>{roundCode}</Typography.Title>
        <Typography.Title className="roundStatsBlockTitlePoints">
          70/100 pts
        </Typography.Title>
      </div>
      <Tabs tabPosition={"left"}>
        {roundScore &&
          roundScore.length &&
          roundScore.map(({ judgeCode, submit, feedback, assessment }) => {
            let totalJudgePoints = 0;
            assessment.forEach(({ points }) => (totalJudgePoints += points));
            if (!submit) return null;
            else
              return (
                <Tabs.TabPane
                  key={judgeCode}
                  tab={
                    <>
                      <Typography.Text className="roundStatsName">
                        {judgeCode}
                      </Typography.Text>
                      <Typography.Text className="roundStatsPoints">
                        {totalJudgePoints} pts
                      </Typography.Text>
                    </>
                  }
                >
                  <EmojiSection assessment={assessment} />
                  <Typography.Paragraph className="roundStatsBlockText">
                    {feedback.text || ""}
                  </Typography.Paragraph>
                </Tabs.TabPane>
              );
          })}
      </Tabs>
    </Card>
  );
};

export default AppJudgesFeedBack;
