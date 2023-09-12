/* eslint-disable @next/next/no-img-element */
import { Button, Progress, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  AvatarInfoIcon,
  EditPencilIcon,
} from "../../../../utility/iconsLibrary";
import Activities from "./activities";
import Competitions from "./competitions";
import Feedback from "./feedback";
import { routes } from "../../../../utility/config";
import { useRouter } from "next/router";
import useMediaQuery from "../../../../hooks/useMediaQuery";
import Endorsements from "../right/endorsements";

const LeftSide = ({
  editable,
  details,
  isShowingProfile,
  profileCompletionPercentage,
  setUpdateUser,
  interests = [],
  user,
  onRedirectToMyAccount,
  isUserLoggedIn,
  fetchFeedbacks,
  fetchCompetitions,
  fetchEndorsements,
}) => {
  const router = useRouter();
  const textareaRef = useRef(null);
  const isEmpty = !!interests.length;

  const [active, setActive] = useState(0);

  const autoResize = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  const isMobile = useMediaQuery("(max-width: 767px)");
  useEffect(() => {
    autoResize();
  });

  return (
    <div className="profileContentHolder">
      {/* Bio Empty state */}
      <Typography.Text className="profileUserInfoText">
        <textarea
          ref={textareaRef}
          onBlur={(e) => setUpdateUser({ ...user, about: e.target.value })}
          onInput={autoResize}
          defaultValue={user.about}
          className="ant-input"
          placeholder="Add your bio here..."
          maxLength="250"
        ></textarea>
      </Typography.Text>

      {/* <Typography.Text className="profileUserInfoText" editable={editable}>
        I’ve hosted and organised over 20 fests in 3 years of BBA at SJCC. As a
        student council member, I have planned and organised upskilling events
        for over 400 students.
      </Typography.Text> */}
      {/* Acount Info Empty State */}
      {profileCompletionPercentage !== 100 && isUserLoggedIn && (
        <div className="acountInfoEmptyBoxWrap">
          <div className="acountInfoEmptyBox row-reverse">
            <div className="acountInfoEmptyBoxLeft">
              <Button
                type="primary"
                icon={<AvatarInfoIcon />}
                onClick={onRedirectToMyAccount}
              >
                Account Settings
              </Button>
              <div className="acountInfoEmptyBoxProgress">
                <Progress
                  type="circle"
                  percent={profileCompletionPercentage}
                  width={46}
                />
              </div>
            </div>

            <div className="acountInfoEmptyBoxRight">
              <strong className="accountInfoBoxTitle visibleMobile">
                Acount Info
              </strong>
              <Typography.Text>
                Add all required details to unlock your profile
              </Typography.Text>
            </div>
          </div>
        </div>
      )}
      <Activities editable={editable} counts={details?.counts} />
      {!isEmpty ? (
        <div className="personaliseProfileBlock visibleMobile">
          <Typography.Title level={4} className="personaliseProfileBlockTitle">
            Personalise your Profile
          </Typography.Title>
          <Typography.Text className="competitionPlaceholderText">
            Add your inerests to begin growing your profile and recieving
            recommendations
          </Typography.Text>
          <Button
            className="buttonAdd"
            onClick={() => router.push(routes.addInterest)}
          >
            Add Interests
          </Button>
        </div>
      ) : (
        <div className="interestsBlock visibleMobile">
          <Typography.Title level={4} className="interestsBlockTitle">
            My Interests{" "}
            <EditPencilIcon
              className="editIcon"
              onClick={() => router.push(routes.addInterest)}
            />
          </Typography.Title>
          <ul className="interestsList">
            {interests.map((item) => (
              <li key={JSON.stringify(item)}>
                <div className="interestsListItem">
                  <span className="interestsListItemIcon">
                    <img src={item?.imageUrl} />
                  </span>
                  <strong className="interestsListItemText">
                    {item?.subCategoryName}
                  </strong>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* <div className="profileMainBlock">
        <Gallery />
      </div> */}

      {isMobile ? (
        <>
          <ul className="settingsMobileTabs">
            <li>
              <a
                className={active === 0 ? "active" : "nonActive"}
                onClick={() => setActive(0)}
              >
                Competitions{" "}
                {details?.counts?.competitions
                  ? `(${
                      details?.counts?.competitions > 50
                        ? "50+"
                        : details?.counts?.competitions
                    })`
                  : ""}
              </a>
            </li>
            <li>
              <a
                className={active === 1 ? "active" : "nonActive"}
                onClick={() => setActive(1)}
              >
                Feedback{" "}
                {details?.counts?.feedbacks
                  ? `(${details?.counts?.feedbacks})`
                  : ""}
              </a>
            </li>
            <li>
              <a
                className={active === 2 ? "active" : "nonActive"}
                onClick={() => setActive(2)}
              >
                Endorsements{" "}
                {details?.counts?.competitions
                  ? `(${details?.counts?.competitions})`
                  : ""}
              </a>
            </li>
            {/* <li>
              <a
                className={active === 2 ? "active" : "nonActive"}
                onClick={() => setActive(2)}
              >
                Top Skilss
              </a>
            </li> */}
          </ul>
          {active === 0 && (
            <div className="profileMainBlock">
              <Competitions
                editable={editable}
                competitions={details?.competitions}
                isViewable={isShowingProfile}
                fetchCompetitions={fetchCompetitions}
                allCompetitionsCount={details?.counts?.competitions}
              />
            </div>
          )}
          {active === 1 && (
            <div className="profileMainBlock">
              <Feedback
                feedbacks={details?.feedbacks}
                editable={editable}
                isViewable={isShowingProfile}
                fetchFeedbacks={fetchFeedbacks}
                allFeedbacksCount={details?.counts?.feedbacks}
              />
            </div>
          )}
          {active === 2 && (
            <Endorsements
              data={details?.endorsements}
              editable={editable}
              isViewable={isShowingProfile}
              allEndorsementsCount={details?.counts?.endorsements}
              fetchEndorsements={fetchEndorsements}
              groupedEndorsementsCount={
                details?.counts?.groupedEndorsementsCount
              }
              isMobile={true}
            />
          )}
        </>
      ) : (
        <>
          <div className="profileMainBlock">
            <Competitions
              editable={editable}
              competitions={details?.competitions}
              isViewable={isShowingProfile}
              fetchCompetitions={fetchCompetitions}
              allCompetitionsCount={details?.counts?.competitions}
            />
          </div>
          <div className="profileMainBlock">
            <Feedback
              feedbacks={details?.feedbacks}
              editable={editable}
              isViewable={isShowingProfile}
              fetchFeedbacks={fetchFeedbacks}
              allFeedbacksCount={details?.counts?.feedbacks}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LeftSide;
