import { Image, Typography } from "antd";
import { MultipleUserIcon } from "../../utility/iconsLibrary";

const AppCompetitionDetailsHeader = ({
  competitionState = {},
  crew = false,
  containerState,
}) => {
  return (
    <>
      {competitionState?.emojiObject ? (
        <p style={{ fontSize: "3.5rem", margin: "0 0 10px" }}>
          {competitionState.emojiObject.emoji}
        </p>
      ) : (
        <Image
          alt="competition-logo"
          src={competitionState?.imageURL}
          preview={false}
          height={60}
          width={60}
        />
      )}
      {crew ? (
        <Typography.Title className="invitationFormTitle">
          <span className="titlePrefix">Register for</span>{" "}
          {competitionState?.competitionName} as crew on Slamitt
        </Typography.Title>
      ) : (
        <Typography.Title className="invitationFormTitle">
          <span className="titlePrefix">Register for</span>{" "}
          {competitionState?.competitionName} as{"  "}
          {containerState?.containerName} on Slamitt.
        </Typography.Title>
      )}
      <div className="invitationFormInfo">
        {/* {!crew && (
          <Typography.Text className="invitationFormNumber">
            <IndianRupeeSignIcon /> 100
          </Typography.Text>
        )}
        |{" "} */}
        <Typography.Text className="invitationFormText">
          <MultipleUserIcon />
          {competitionState?.competitionType === "SOLO" ? "Solo" : "Team"}
          &nbsp;Event
        </Typography.Text>
        {crew && (
          <Typography.Text className="invitationFormText gray">
            {competitionState?.teamSize} Members
          </Typography.Text>
        )}
        {competitionState?.teamSize &&
          competitionState.competitionType === "TEAM" && (
            <Typography.Text className="invitationFormText gray">
              {competitionState?.teamSize} Members
            </Typography.Text>
          )}
      </div>
    </>
  );
};

export default AppCompetitionDetailsHeader;
