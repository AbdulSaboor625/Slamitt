import { Avatar, Button, Typography, Image } from "antd";
import React, { useRef, useState } from "react";
import {
  ArrowLinkIcon,
  ArrowViewIcon,
  EyeHideIcon,
  EyeIcon,
  LikeSVGIcon,
  CheckCircleIcon,
} from "../../../../utility/iconsLibrary";
import AppNameAvater from "../../../AppAvatar/AppNameAvater";
import EmptyProfileSection from "../emptyProfileSection";

const EndorsedCard = ({ endorsement }) => {
  return (
    <li>
      <div className="profileEndorsementItem">
        <div className="profileEndorsementItemUpper">
          <div className="profileEndorsementAvatar">
            {endorsement?.judge?.imageURL?.includes("media.licdn") ? (
              <Avatar src={endorsement?.judge?.imageURL} alt="img" size={100} />
            ) : (
              <AppNameAvater
                user={{
                  firstName: endorsement?.judge?.name?.split(" ")[0],
                  lastName: endorsement?.judge?.name?.split(" ")[1],
                }}
              />
            )}
            <div className="iconVerified">
              <CheckCircleIcon />
            </div>
            {/* <LikeSVGIcon className="iconLike" /> */}
            {/* {editable && (
            <span className="profileEndorsementViewButton">
              <EyeIcon className="iconShow" />
              <EyeHideIcon className="iconHide" />
            </span>
          )} */}
          </div>
          <div className="profileEndorsementTextbox">
            <Typography.Title className="profileEndorsementTitle" level={5}>
              {endorsement?.judge?.name}
              {/* <ArrowLinkIcon /> */}
            </Typography.Title>
            {/* <Typography.Paragraph className="profileEndorsementText">
              Co-Founder & CEO · Ola cabs
            </Typography.Paragraph> */}
          </div>
        </div>

        <div className="profileEndorsementItemBelow">
          {endorsement?.skills?.map((skill) => (
            <Button
              className="profileEndorsementButton"
              key={JSON.stringify(skill)}
            >
              {skill?.name}
              <LikeSVGIcon />
            </Button>
          ))}
        </div>
      </div>
    </li>
  );
};

const Endorsements = ({
  editable,
  data,
  isViewable,
  allEndorsementsCount,
  fetchEndorsements,
  groupedEndorsementsCount,
  isMobile = false,
}) => {
  const pageOffest = useRef(1);
  const endorsements = data;
  return (
    <div className="profileEndorsementBox">
      <div className="profileSidebarHead">
        <Typography.Title className="heading" level={3}>
          {!isMobile &&
            `Endorsements ${
              allEndorsementsCount ? `(${allEndorsementsCount})` : ""
            }`}
        </Typography.Title>
        {/* {editable && (
          <ul className="profileCompetitionsViews">
            <li>
              <EyeIcon />
              <Typography.Text className="viewCount">12</Typography.Text>
            </li>
            <li>
              <EyeHideIcon />
              <Typography.Text className="viewCount">06</Typography.Text>
            </li>
          </ul>
        )} */}
      </div>
      <div className={`profileStatsHolder ${isViewable ? "" : "blurState"}`}>
        {/* Hidden Profile item state */}
        <div className="profileStatsPlaceholderText hiddenMobile">
          Finish setting up your account to access endorsements from your judges
        </div>
        <div className="profileStatsPlaceholderText visibleMobile">
          Complete adding Account Info to preview your profile
        </div>

        {endorsements && endorsements.length ? (
          <div className="profileEndorsementWrap">
            <ul className="profileEndorsementList">
              {endorsements.map((data, idx) => (
                <EndorsedCard key={idx} endorsement={data} />
              ))}
            </ul>
            {endorsements?.length < groupedEndorsementsCount ? (
              <Button
                type="text"
                className="profileSidebarLinkWrap"
                onClick={() => {
                  pageOffest.current += 1;
                  fetchEndorsements(pageOffest.current);
                }}
              >
                View All
                {/* <Typography.Text underline={true}>View All</Typography.Text> */}
              </Button>
            ) : (
              <div />
            )}
          </div>
        ) : (
          <EmptyProfileSection section={"ENDORSEMENTS"} />
        )}
      </div>
    </div>
  );
};

export default Endorsements;
