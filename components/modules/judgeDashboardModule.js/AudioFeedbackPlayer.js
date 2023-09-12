import React from "react";
import { awsBaseUrl } from "../../../utility/config";
import { DeleteIcon } from "../../../utility/iconsLibrary";

const AudioFeedbackPlayer = ({ onFeedBackChange, containerCode, feedback }) => {
  return (
    <div className="audioPlayerBox">
      <audio
        style={{
          width: "80%",
          display: "inline-block",
          marginTop: "1rem",
        }}
        src={`${awsBaseUrl}${feedback?.audio}`}
        controls
      />
      <DeleteIcon
        onClick={() => onFeedBackChange(containerCode, "", true)}
        style={{
          fontSize: "1.75rem",
          marginLeft: ".5rem",
          marginTop: "2rem",
          color: "red",
        }}
      />
    </div>
  );
};

export default AudioFeedbackPlayer;
