import { Button, Image, Switch, Typography } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { singleRoundScoreSheet } from "../../../../utility/excelService";
import JudgeScoringStatusModal from "../JudgeScoringStatusModal";

import {
  ExportSubmissionIcon,
  PlusNewIcon,
} from "../../../../utility/iconsLibrary";
import AssignJudgesModal from "./AssignJudgesModal";
import JudgesCard from "./judgesCard";

const AddJudgeModule = ({
  allowJudgeReEntry,
  readOnlyState,
  handleJudgeThisRound,
  competitionRoundCode,
  addJudge,
  judgesList,
  removejudge,
  updateRoundSettings,
  round,
  resendInvite,
  _getAllJudges,
  pusherChannel,
}) => {
  const { role } = useSelector((state) => state.auth.user);
  const userEmail = useSelector((state) => state.auth.user.email);
  const competition = useSelector((state) => state?.competition?.current);
  const [isVisible, setVisible] = useState(false);
  const [isScoreStatusModalVisible, setScoreStatusModalVisibilty] =
    useState(false);
  const [selectedJudge, setSelectedJudge] = useState({});

  const crewUser = competition?.crew?.find((c) => c.email === userEmail);
  const manageScoring = crewUser && crewUser?.permissions?.manageScoring;

  const _onRemoveJudge = (judge) => removejudge(judge);

  const ExportScoreSheetBtn = () => {
    return (
      <Button
        type="ghost"
        className="ml-5"
        onClick={async () =>
          singleRoundScoreSheet(
            round.roundCode,
            `${round?.Competition?.competitionName}_${round.roundName}`,
            round.roundWeightage,
            round,
            competition?.competitionType
          )
        }
        disabled={!judgesList?.find((item) => item.status === "JUDGED")}
      >
        <ExportSubmissionIcon />
        Export Scoresheet
      </Button>
    );
  };

  return (
    <div className="judgesBlockContent">
      <div className="judgesButtonsHeader">
        {judgesList.length > 0 ? (
          <div className="judgesButtonsHeaderButton">
            {/* <Button type="ghost" onClick={handleJudgeThisRound}>
            Judge this Round
          </Button> */}
            {!readOnlyState && (
              <Button type="primary" onClick={() => setVisible(true)}>
                <PlusNewIcon /> Invite Judge
              </Button>
            )}
            {/* {round && round.isLive && role !== "CREW" ? (
              <ExportScoreSheetBtn />
            ) : (
              <>{manageScoring ? <ExportScoreSheetBtn /> : null}</>
            )} */}
          </div>
        ) : (
          <span></span>
        )}
        {!readOnlyState && (
          <Typography.Text className="allowJudgesSwitcher">
            <Switch
              checked={round.allowJudgeEntry}
              defaultChecked={round.allowJudgeEntry}
              onChange={(e) => {
                updateRoundSettings({
                  allowJudgeEntry: e,
                });
              }}
            />
            Allow Judges Entry
          </Typography.Text>
        )}
      </div>
      {judgesList.length > 0 ? (
        <ul className="judgeCardList judgeCardListUpdate">
          {judgesList.map((judge, idx) => (
            <li key={idx}>
              <JudgesCard
                round={round}
                judgeCode={judge.judgeCode}
                readOnlyState={readOnlyState}
                firstName={judge.firstName}
                lastName={judge.lastName}
                email={judge.email}
                about={judge.about}
                status={judge.status}
                isScoreStatusModalVisible={isScoreStatusModalVisible}
                invitationStatus={round.isLive ? judge?.invitationSent : true}
                onRemoveJudge={() => _onRemoveJudge(judge)}
                imageURL={judge.imageURL}
                emojiObject={judge.emojiObject}
                onResendInvite={() => resendInvite(judge.email)}
                allowJudgeReEntry={() => allowJudgeReEntry(judge.judgeCode)}
                setScoreStatusModalVisibilty={setScoreStatusModalVisibilty}
                crewUser={crewUser}
                judge={judge}
                verified={judge?.verified}
                setSelectedJudge={setSelectedJudge}
                // onClick={() => {
                //   if (
                //     judge?.status !== "INVITED" &&
                //     judge?.status !== "JUDGED"
                //   ) {
                //     crewUser?.email
                //       ? crewUser?.permissions?.manageScoring
                //         ? setScoreStatusModalVisibilty(true)
                //         : null
                //       : setScoreStatusModalVisibilty(true);
                //     setSelectedJudge(judge);
                //   }
                // }}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="judgesEmptyPlaceholder">
          <div className="judgesEmptyPlaceholderBlock">
            <Image
              preview={false}
              width={200}
              height={200}
              alt="thumbnail"
              src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1660154453681_judgesempty.png"
            />
            <Typography.Text className="judgesEmptyPlaceholderTitle">
              {readOnlyState
                ? "No judges were onboarded"
                : round?.isLive
                ? "Onboard Judges to this room to begin scoring the round"
                : "Judges added in this stage will be invited once the round goes live"}
            </Typography.Text>
            <div className="judgesEmptyPlaceholderButtons">
              {!readOnlyState && (
                <Button
                  type="primary"
                  className="ml-5"
                  onClick={() => setVisible(true)}
                >
                  {round?.isLive ? "Invite Judges" : "Add Judges"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      <AssignJudgesModal
        round={round}
        setVisible={setVisible}
        isVisible={isVisible}
        competitionRoundCode={competitionRoundCode}
        addJudge={addJudge}
        judgesList={judgesList}
      />
      <JudgeScoringStatusModal
        readOnlyState={readOnlyState}
        isVisible={isScoreStatusModalVisible}
        setVisibility={setScoreStatusModalVisibilty}
        judges={judgesList}
        judgeCode={selectedJudge.judgeCode}
        judgeStatus={selectedJudge.status}
        getAllJudges={_getAllJudges}
        role={role}
        manageScoring={manageScoring}
        pusherChannel={pusherChannel}
      />
    </div>
  );
};

export default AddJudgeModule;
