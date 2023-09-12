import { Image, Typography } from "antd";
import { container } from "../../../utility/imageConfig";
import { useSelector } from "react-redux";

const EmptyContentSection = ({ tabActive, isSolo = false }) => {
  const { config } = useSelector((state) => state.misc);
  const Text = () => {
    switch (tabActive) {
      case "CONTAINERS":
        return (
          <Typography.Text className="competitionPlaceholderText">
            Begin adding {isSolo === "SOLO" ? "participants" : "teams"} to
            preview their details
            {/* Select or add a {isSolo === "SOLO" ? "participant" : "team"} to view
            its details */}
            {/* Turn on Registrations to begin adding participants */}
          </Typography.Text>
        );
      case "CHAT":
        return (
          <Typography.Text className="competitionPlaceholderText">
            Select a chat to view its threads
          </Typography.Text>
        );
      case "ROUND":
        return (
          <Typography className="competitionPlaceholderText">
            {" "}
            Select a round to view its threads
          </Typography>
        );
      case "SETTINGS":
        return (
          <Typography.Text className="competitionPlaceholderText">
            {" "}
            {config.active == "CREW"
              ? "Crew members haven't been added to this competition yet"
              : "Settings menu"}
          </Typography.Text>
        );
      case "PARTICIPATED":
        return (
          <Typography.Text className="competitionPlaceholderText">
            Begin Participating in competitions now!
          </Typography.Text>
        );
      case "ORGANISED":
        return (
          <Typography.Text className="competitionPlaceholderText">
            Begin Participating in competitions now!
          </Typography.Text>
        );
      default:
        return <div />;
    }
  };
  return (
    <>
      {/* {config.active === "REGISTRATION" ? (
        ""
      ) : ( */}
        <div className="competitionPlaceholderBlock hiddenTabletMobile">
          <Image
            preview={false}
            width={200}
            height={200}
            alt="thumbnail"
            src={container}
          />
          <Text />
        </div>
      {/* // )} */}
    </>
  );
};

export default EmptyContentSection;
