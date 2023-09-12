import { Button, Input, Typography } from "antd";
import React, { useEffect, useState } from "react";

const AddDescriptionModule = ({
  addAbout,
  setOnStep,
  redirectToDashBoard,
  judge,
}) => {
  const [about, setAbout] = useState("");

  useEffect(() => {
    if (judge.about) setAbout(judge.about);
  }, [judge]);

  const handleSubmit = () => {
    addAbout(about);
  };

  return (
    <>
      {/* <Typography.Title className="judgeFormsubTitle" level={3}>
        Hey {judge ? judge.firstName + " " + judge.lastName : ""},
      </Typography.Title> */}
      <p className="judgeFormInfoText">
        Let your partiticipants know more about you
      </p>
      <Input.TextArea
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addAbout(e.target.value);
          }
        }}
        className="textTextarea"
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        showCount
        maxLength={100}
        rows={4}
        placeholder={"Introduce Yourself"}
      />
      <div className="judgeFormButtonWrap">
        <Button
          type="primary"
          onClick={() => {
            handleSubmit();
            setOnStep(2);
          }}
          set
        >
          Take a Trial
        </Button>
      </div>
      <div className="judgeFormLinkWrap">
        <Button
          type="text"
          className="tertiaryButton"
          onClick={() => {
            handleSubmit();
            redirectToDashBoard();
          }}
        >
          Skip and Enter Room
        </Button>
      </div>
    </>
  );
};

export default AddDescriptionModule;
