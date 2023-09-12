import { Form } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDetails } from "../../../Redux/Actions/authActions";
import { notify } from "../../../Redux/Actions/notificationActions";
import {
  getCompetitions,
  getEndorsements,
  getFeedbacks,
  getProfileDetails,
} from "../../../requests/profile";
import { routes } from "../../../utility/config";
import { SOMETHING_WENT_WRONG } from "../../../utility/constants";
import BasicInfo from "./basicInfo";
import BrandingFooter from "./brandingFooter";
import CoverAndDetails from "./coverAndDetails";
import LeftSide from "./left";
import RightSide from "./right";

const ProfileContent = ({ useOnlyBasicInfo = false, userDetails }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { slamittToken, user } = useSelector((state) => state.auth);
  const { userId } = router.query;
  const [editable, setEditable] = useState(false);
  const [form] = Form.useForm();
  const [, setBasicInfoOpen] = useState(false);
  const [profile, setProfile] = useState({ user: {} });
  const [isShowingProfile, setShowProfile] = useState(false);
  const [profileCompletionPercentage, setProfileCompletionPercentage] =
    useState(0);
  // useEffect(() => {
  //   if (user?._id === userId) {
  //     setBasicInfoOpen(true);
  //   } else setBasicInfoOpen(false);
  // }, [userId]);

  useEffect(() => {
    if (userId && !useOnlyBasicInfo) getProfileData();
  }, [userId]);

  const getProfileData = async () => {
    const profile = await getProfileDetails(userId);
    if (profile?.user) {
      calculateProfileCompletitionPercentage(profile.user);
      setProfile({
        user: profile.user,
        competitions: profile.competition,
        feedbacks: profile.feedbacks,
        endorsements: profile.endorsements,
        counts: profile.counts,
      });
    } else {
      dispatch(notify({ type: "error", message: SOMETHING_WENT_WRONG }));
    }
  };

  const calculateProfileCompletitionPercentage = (user) => {
    if (
      user.fName &&
      user.lName &&
      user.email &&
      user.dob &&
      user.gender &&
      user.institute_name
    ) {
      setShowProfile(true);
    }
    let sum = 0;
    const totalCount = 6;
    if (user.fName) sum += 1;
    if (user.lName) sum += 1;
    if (user.email) sum += 1;
    if (user.dob) sum += 1;
    if (user.gender) sum += 1;
    if (user.institute_name) sum += 1;
    // if (user.about) sum += 1;
    sum = (sum * 100) / totalCount;
    setProfileCompletionPercentage(parseInt(sum));
  };

  const _updateUserDetails = (payload) => {
    dispatch(updateUserDetails(payload));
  };

  const fetchEndorsements = async (pageOffest) => {
    try {
      const endorsements = await getEndorsements(userId, pageOffest);
      if (endorsements) {
        setProfile((state) => ({
          ...profile,
          endorsements: [...state.endorsements, ...endorsements.endorsements],
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFeedbacks = async (pageOffest) => {
    try {
      const feedbacks = await getFeedbacks(userId, pageOffest);
      if (feedbacks) {
        setProfile((state) => ({
          ...profile,
          feedbacks: [...state.feedbacks, ...feedbacks.feedbacks],
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCompetitions = async (pageOffest) => {
    try {
      const competitions = await getCompetitions(userId, pageOffest);
      if (competitions) {
        setProfile((state) => ({
          ...profile,
          competitions: [...state.competitions, ...competitions.competitions],
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="profilePageWrapper">
      <div className="profilePageContainer">
        <CoverAndDetails
          setBasicInfoOpen={setBasicInfoOpen}
          editable={editable}
          setEditable={setEditable}
          basicInfoOpen={useOnlyBasicInfo}
          setUpdateUser={_updateUserDetails}
          form={form}
          user={useOnlyBasicInfo ? userDetails : profile.user}
          onSubmit={() => {
            const values = Object.values(form.getFieldsValue());
            const isAllEmpty = values.filter((value) => value);
            if (!isAllEmpty.length) {
              setEditable(false);
              form.resetFields();
            } else {
              const obj = {};
              const { fName, lName, dob, gender, institute_name } =
                form.getFieldsValue();
              if (fName) obj.fName = fName;
              if (lName) obj.lName = lName;
              if (dob) obj.dob = dob;
              if (gender) obj.gender = gender;
              if (institute_name) obj.instituteName = institute_name;
              _updateUserDetails(obj);
              // setUpdateUser(user);
              form.resetFields();
              setEditable(false);
            }
          }}
        />
        {useOnlyBasicInfo ? (
          <BasicInfo
            editable={editable}
            user={userDetails}
            // setUpdateUser={_updateUserDetails}
            form={form}
          />
        ) : (
          <div className="profilePageContent">
            <div className="profilePageColumns">
              <div className="profileContent">
                <LeftSide
                  interests={profile?.user?.category}
                  details={profile}
                  editable={editable}
                  isShowingProfile={isShowingProfile}
                  profileCompletionPercentage={profileCompletionPercentage}
                  setUpdateUser={_updateUserDetails}
                  user={profile.user}
                  onRedirectToMyAccount={() =>
                    (window.location.href = `${routes.accountInfo}/${profile?.user?.userCode}`)
                  }
                  isUserLoggedIn={
                    Boolean(slamittToken) &&
                    profile.user.userCode === user.userCode
                  }
                  fetchFeedbacks={fetchFeedbacks}
                  fetchCompetitions={fetchCompetitions}
                  fetchEndorsements={fetchEndorsements}
                />
              </div>
              <div className="profileSidebar">
                <RightSide
                  details={profile}
                  editable={editable}
                  isShowingProfile={isShowingProfile}
                  fetchEndorsements={fetchEndorsements}
                  isUserLoggedIn={
                    Boolean(slamittToken) &&
                    profile.user?.userCode === user.userCode
                  }
                />
              </div>
            </div>
            {/* <div className="profileMainBlock">
              <Synergies editable={editable} />
            </div> */}
            {/* <div className="profileMainBlock">
              <Gallery />
            </div> */}
            <BrandingFooter />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileContent;
