import { Button, Image, Typography } from "antd";

import React from "react";

const EmptyProfileSection = ({ section, redirectToInterest }) => {
  const EmptySection = () => {
    switch (section) {
      case "COMPETITIONS":
        return (
          <div className="profileEmptyStateBox">
            <Image
              preview={false}
              alt=""
              // src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1675097744048_image_208.png"
              src="https://rethink-competitions.s3.amazonaws.com/1680026026250_image.png"
            />
            <Typography.Text className="profileEmptyStateBoxText">
              Participate in competitions to start building your profile
            </Typography.Text>
          </div>
        );
      case "FEEDBACK":
        return (
          <div className="profileEmptyStateBox addition">
            <Image
              preview={false}
              alt=""
              src="https://rethink-competitions.s3.amazonaws.com/1675101540034_image_280.png"
            />
            <Typography.Text className="profileEmptyStateBoxText">
              Catalogue feedback you recieve from Judges
            </Typography.Text>
          </div>
        );
      case "SYNERGIES":
        return (
          <div className="flex flex-col justify-center items-center">
            <Image
              preview={false}
              width={200}
              height={200}
              alt="thumbnail"
              src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1655731614840_perticipant.png"
            />
            <Typography.Text className="competitionPlaceholderText">
              Participate and get placed as a team to build synergies
            </Typography.Text>
          </div>
        );
      case "ENDORSEMENTS":
        return (
          <div className="profileEmptyStateBox  addition">
            <Image
              preview={false}
              alt=""
              src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1675102235178_image_282.png"
            />
            <Typography.Text className="profileEmptyStateBoxText">
              Get endorsed for your skills by
              <br /> verified judges!
            </Typography.Text>
          </div>
        );
      case "MYSKILLS":
        return (
          <div className="flex flex-col justify-center items-center personaliseIntrests">
            <Typography.Title className="heading" level={3}>
              Personalise your Profile
            </Typography.Title>
            <Typography.Text className="competitionPlaceholderText">
              Add your interests to begin growing your profile and recieving
              recommendations
            </Typography.Text>
            <Button type="primary" onClick={redirectToInterest}>
              Add Interests
            </Button>
          </div>
        );
    }
  };
  return <EmptySection />;
};

export default EmptyProfileSection;
