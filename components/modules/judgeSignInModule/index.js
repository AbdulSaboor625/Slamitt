import { LinkedinFilled } from "@ant-design/icons";
import { Button, Steps, Typography } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import useLinkedinLogin from "../../../hooks/useLinkedin";
import { judgeSignup } from "../../../Redux/Actions";
import AddNameModule from "./addNameModule";
import ChooseSession from "./chooseSessionModule";
import ContinueSession from "./continueSessionModule";

const { Step } = Steps;
const JudgeSignInModule = ({
  email,
  sessionOptionSelected,
  setSessionOptionSelected,
  redirectToDashBoard,
  fromEmail,
  judgeCode,
  onStep,
  competitionRoundCode,
  round,
  judge,
  setOnStep,
  addAbout,
  isLoginAsGuestSelected,
  setLoginasGuestSelection
}) => {
  const dispatch = useDispatch();
  const { handleLogin } = useLinkedinLogin({
    competitionRoundCode,
    invitedEmail: email
  });

  if (isLoginAsGuestSelected)
    return sessionOptionSelected === "NEW" ? (
      <AddNameModule
        redirectToDashBoard={redirectToDashBoard}
        competitionRoundCode={competitionRoundCode}
        round={round}
        judge={judge}
        setOnStep={setOnStep}
        handleLinkedinLogin={handleLogin}
      />
    ) : sessionOptionSelected === "OLD" ? (
      <ContinueSession
        setSessionOptionSelected={setSessionOptionSelected}
        competitionRoundCode={competitionRoundCode}
      />
    ) : (
      <ChooseSession setSessionOptionSelected={setSessionOptionSelected} />
    );
  else
    return (
      <>
        <div className="judgesStepsBlockHolder">
          <Steps className="judgesStepsBlock" progressDot current={2}>
            <Step title="Leave Feedback for participants to record" />
            <Step title="Endorse participants for various skills" />
            <Step title="Get verified!" />
          </Steps>
          <Button
            className="buttonLinkedin"
            title="Login with LinkedIn"
            icon={<LinkedinFilled />}
            type="primary"
            onClick={handleLogin}
          >
            Login with LinkedIn
          </Button>
        </div>
        <div className="flex justify-center flex-col judgesStepsBlockButtons">
          <Button
            className="buttonLinkedin"
            title="Login with LinkedIn"
            icon={<LinkedinFilled />}
            type="primary"
            onClick={handleLogin}
          >
            Login with LinkedIn
          </Button>
          <br />
          <Typography.Text className="or">Or</Typography.Text>
          <br />
          <Button
            type="secondary"
            title="Login as guest"
            onClick={() =>
              !fromEmail
                ? setLoginasGuestSelection(true)
                : dispatch(judgeSignup({ judgeCode, competitionRoundCode }))
            }
          >
            Login as guest
          </Button>
        </div>
        <div className="slamittSmallLogo visibleMobile">
          <img src="https://rethink-competitions.s3.amazonaws.com/1683315953582_slamittsm.png" alt="Slamitt" />
        </div>
      </>
    );
  // if (onStep === 0)

  // else if (onStep === 1)
  //   return (
  //     <AddDescriptionModule
  //       judge={judge}
  //       redirectToDashBoard={redirectToDashBoard}
  //       setOnStep={setOnStep}
  //       addAbout={addAbout}
  //     />
  //   );
  // else return <EmojiSelectorModule redirectToDashBoard={redirectToDashBoard} />;
};

export default JudgeSignInModule;
