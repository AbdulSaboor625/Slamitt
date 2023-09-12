import React, { useEffect, useState } from "react";
import withAuth from "../../components/RouteAuthHandler/withAuth";
import { LikeFilled, UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Typography, Skeleton, Button } from "antd";
import { routes } from "../../utility/config";
import { useRouter } from "next/router";
import Api from "../../services";
import { defaultUserAvatar } from "../../utility/imageConfig";
import {
  CheckCircleIcon,
  LikeIcon,
  LikeSVGIcon,
} from "../../utility/iconsLibrary";
const UserCard = ({ data }) => {
  const router = useRouter();
  return (
    <Card
      className={`judgesCard   hover:selected scoredCard`}
      onClick={() => {
        router.push(`${routes.profile}/${data.userCode}`);
      }}
      style={{ border: "none" }}
      key="1"
    >
      {data?.emojiObject ? (
        <p className="judgesCardEmoji">{data?.emojiObject.emoji}</p>
      ) : (
        <Avatar src={data?.imageURL || defaultUserAvatar} />
      )}
      <div className="flex flex-row justify-center items-center	">
        <Typography.Title
          className="judgesCardSubtitle"
          style={{ margin: "0" }}
          level={5}
        >
          {data?.fName || ""} {data?.lName || ""}{" "}
        </Typography.Title>
        <Typography.Text
          className="judgesCardSubtitle"
          style={{ margin: "0" }}
          level={5}
        >
          {data.hasProfile ? (
            <div className="iconVerified ml-2">
              {" "}
              <CheckCircleIcon />
            </div>
          ) : (
            <></>
          )}
        </Typography.Text>
      </div>

      <Typography.Text className="judgesCardSubtext" style={{ margin: "0" }}>
        {data?.institute_name}
      </Typography.Text>
    </Card>
  );
};

const AllProfiles = () => {
  const [isLoading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({ registered: 0, profile: 0 });

  const setProfilesAndCount = async () => {
    setLoading(true);
    try {
      const response = await Api.get("/profile/all/profile-users");
      if (response.code && response.result) {
        setUsers(response.result.users);
        setCounts({
          registered: response.result.registeredUserCount,
          profile: response.result.profileCount,
        });
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    setProfilesAndCount();
  }, []);
  return isLoading ? (
    <Skeleton loading={isLoading} active avatar />
  ) : (
    <div className="bg-violet-400">
      <h1
        style={{ textAlign: "center" }}
        className="text-black text-5xl antialiased font-medium"
      >
        Profiles
      </h1>
      <h6 className="text-black text-1xl antialiased font-medium">
        Total Registered users : {counts.registered}
      </h6>
      <h6 className="text-black text-1xl antialiased font-medium">
        Total users with profile : {counts.profile}
      </h6>
      <div className="grid grid-cols-5 gap-5 overflow-y-scroll h-screen pt-20 pb-20">
        {users.map((data) => (
          <UserCard key={data._id} data={data} />
        ))}
      </div>
    </div>
  );
};

export default withAuth(AllProfiles);
