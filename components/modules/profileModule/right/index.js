import { Button, Typography } from "antd";
import React from "react";
import Endorsements from "./endorsements";
import MyInterests from "./myInterests";
import TopSkill from "./topSkill";
import Synergies from "../synergies";
import { routes } from "../../../../utility/config";
import { useRouter } from "next/router";
import useMediaQuery from "../../../../hooks/useMediaQuery";

const RightSide = ({
  editable,
  details,
  isShowingProfile,
  fetchEndorsements,
  isUserLoggedIn,
}) => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 767px)");
  return (
    <>
      {/* Personalise Box */}

      <MyInterests
        editable={false}
        interests={details?.user?.category}
        isUserLoggedIn={isUserLoggedIn}
      />

      {/* <TopSkill /> */}

      {!isMobile && (
        <Endorsements
          data={details?.endorsements}
          editable={editable}
          isViewable={isShowingProfile}
          allEndorsementsCount={details?.counts?.endorsements}
          fetchEndorsements={fetchEndorsements}
          groupedEndorsementsCount={details?.counts?.groupedEndorsementsCount}
        />
      )}
      {/* <div className="asideSynergies">
        <Synergies editable={editable} />
      </div> */}
    </>
  );
};

export default RightSide;
