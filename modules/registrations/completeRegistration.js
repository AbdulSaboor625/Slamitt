import { Avatar, Image, Typography } from "antd";
import React from "react";
import { EmailAddedIcon } from "../../utility/iconsLibrary";

const CompleteRegistration = ({ competition, container }) => {
  return (
    <div className="registrationSuccessfulScreen mt-10">
      <div className="registrationSuccessfulScreenContent">
        <div className="registrationSuccessfulComHead">
          <div className="registrationSuccessfulComHeadTeamInfo">
            {competition?.emojiObject?.emoji ? (
              <span
                className="registrationSuccessfulComHeadEmoji"
                style={{ fontSize: "2.5rem" }}
              >
                {competition?.emojiObject?.emoji}
              </span>
            ) : (
              <Avatar
                className="registrationSuccessfulIcon"
                src={competition?.imageURL}
              />
            )}
            <div className="registrationSuccessfulTextbox">
              <Typography.Text className="registrationSuccessfulComHeading">
                {competition?.competitionName}
              </Typography.Text>
              <Typography.Text className="registrationSuccessfulCategory">
                {competition?.category?.categoryName}
              </Typography.Text>
            </div>
          </div>
          <div className="registrationSuccessfulComHeadStatusIcon">
            <Image
              preview={false}
              width={"273px"}
              alt="success"
              src="https://rethink-competitions.s3.amazonaws.com/1668967364078_regSuccess.png"
            />
          </div>
        </div>
        <Typography.Title level={3} className="registrationSuccessfulTitle">
          <img
            className="mailIcon"
            src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1680722457697_mail.svg"
            alt=""
          />{" "}
          Check your email!
        </Typography.Title>
        <Typography.Text className="registrationSuccessfulText">
          {competition?.competitionType === "SOLO"
            ? "We have sent you an email with a link to complete your registration and acess live updates to track incoming tasks, make submissions and track your performance during this competition"
            : "We have sent your team an email with a link to complete your registration and acess live updates to track incoming tasks, make submissions and track your performance during this competition"}
        </Typography.Text>
        {/* <Divider className="border-b-[1px] border-b-black" /> */}
        <div className="registrationSuccessfulUserInfo">
          <div className="registrationSuccessfulUserBox">
            {container?.emojiObject?.emoji ? (
              <span className="teamEmoji">{container?.emojiObject?.emoji}</span>
            ) : (
              <Avatar src={container?.imageURL} />
            )}
            <div
              className={`registrationSuccessfulUserBoxTextbox ${
                competition.competitionType === "SOLO" &&
                "flex items-center justify-between AlignForSoloCompetition"
              }`}
            >
              <div className="left-col">
                <Typography.Text className="registrationSuccessfulUserName">
                  {container?.containerName}
                </Typography.Text>
                <Typography.Text className="registrationSuccessfulUserCode">
                  Team code
                </Typography.Text>
              </div>
              {competition.competitionType === "SOLO" &&
                container?.users.map((user, index) => (
                  <div
                    key={index}
                    className="registrationSuccessfulUserEmails p-0"
                  >
                    <Typography.Text className="registrationSuccessfulUserSubName mb-0">
                      {user?.firstName} {user?.lastName}
                    </Typography.Text>
                    <div className="registrationSuccessfulUserSubInfo">
                      <EmailAddedIcon />
                      <Typography.Text className="registrationSuccessfulUserEmail">
                        {user?.email}
                      </Typography.Text>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="registrationSuccessfulUserEmailsList">
          {/* <div className="registrationSuccessfulUserEmails">
              <Typography.Text className="registrationSuccessfulUserSubName">
                John Doe
              </Typography.Text>
              <div className="registrationSuccessfulUserSubInfo">
                <EmailAddedIcon />
                <Typography.Text className="registrationSuccessfulUserEmail">
                  kgf@mailinator.com
                </Typography.Text>
              </div>
            </div> */}
          {competition.competitionType !== "SOLO" &&
            container?.users.map((user, index) => (
              <div key={index} className="registrationSuccessfulUserEmails">
                <Typography.Text className="registrationSuccessfulUserSubName">
                  {user?.firstName} {user?.lastName}
                </Typography.Text>
                <div className="registrationSuccessfulUserSubInfo">
                  <EmailAddedIcon />
                  <Typography.Text className="registrationSuccessfulUserEmail">
                    {user?.email}
                  </Typography.Text>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CompleteRegistration;
