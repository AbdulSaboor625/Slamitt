import { LinkedinFilled } from "@ant-design/icons";
import { Avatar, Button, notification, PageHeader } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearJudgeState,
  logoutJudge,
  updateJudge,
  updateRoundContainer,
} from "../../../Redux/Actions";
import { routeGenerator, routes } from "../../../utility/config";
import { slamittLogoSmall } from "../../../utility/imageConfig";
import AppCustomPicker from "../../AppCustomPicker";
import { useRouter } from "next/router";
import { getInitials } from "../../../utility/common";

const Header = ({ pusherChannel, isOnline, competitionRoundCode }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const judgeState = useSelector((state) => state.judge);
  const verified = judgeState.judge?.verified;

  useEffect(() => {
    if (isOnline) {
      notification.destroy();
    } else {
      notification.info({
        closeIcon: <></>,
        style: { zIndex: "1000" },
        duration: 0,
        placement: "top",
        description:
          "Judging offline. Do not close browser until you're online again.",
      });
    }
  }, [isOnline]);

  const updateJudgeImage = (image) => {
    dispatch(
      updateJudge({
        imageURL: image.url,
        emojiObject: image.emoji,
      })
    );
  };

  return (
    <PageHeader
      className="site-page-header dashboardHeader judgesDashboardHeader"
      avatar={{
        src: slamittLogoSmall,
      }}
      extra={[
        <Button
          className="buttonAvatar"
          key="1"
          type="link"
          icon={
            verified && (
              <span className="linkedin-icon">
                <img
                  src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1681843182047_linkedinin.svg"
                  alt=""
                />
              </span>
            )
          }
        >
          {verified ? (
            <Avatar src={judgeState?.judge?.imageURL} />
          ) : (
            <>
              <Avatar icon={getInitials(judgeState?.judge)} />
              {/* <Image preview={false} src={imgHead} alt="" /> */}
              {/* <AppCustomPicker
                imgStyle={{ height: "3rem", width: "3rem", cursor: "pointer" }}
                emojiStyle={{ fontSize: "2.5rem", cursor: "pointer" }}
                className="tabset"
                popOverClass="m-5"
                tabpaneClass="m-5"
                onImageSelected={(e) => updateJudgeImage(e)}
                defaultValue={{
                  type: judgeState.judge?.imageURL ? "LINK" : "EMOJI",
                  url: judgeState.judge?.imageURL || "",
                  emoji: judgeState.judge?.emojiObject || "",
                }}
                showClearButton={false}
              /> */}
              {/* <Typography.Text>
                <strong>Secret Code:</strong> {judgeCode}
              </Typography.Text> */}
            </>
          )}
        </Button>,
        <Button
          className="buttonLogout"
          key="2"
          type="text"
          onClick={() => {
            if (judgeState.containers && judgeState.containers.length)
              dispatch(
                updateRoundContainer({
                  containers: judgeState.containers,
                  callApi: true,
                })
              );
            localStorage.removeItem("judgeState");
            localStorage.removeItem("containers");
            dispatch(updateJudge({ status: "LOGGED OUT" }));
            dispatch(logoutJudge());
            dispatch(clearJudgeState());
            pusherChannel.unsubscribe();
            window.location.replace(
              routeGenerator(routes.judgeLogin, {
                competitionRoundCode: competitionRoundCode,
              })
            );
          }}
        >
          Logout
        </Button>,
      ]}
    />
  );
};

export default Header;
