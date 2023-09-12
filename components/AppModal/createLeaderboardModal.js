import { Button, Image, Input, Typography } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppModal from ".";
import { notify } from "../../Redux/Actions";
import Api from "../../services";
import { capitalize } from "../../utility/common";
import { routeGenerator, routes } from "../../utility/config";
import { PlusCircleIcon } from "../../utility/iconsLibrary";
import { background2 } from "../../utility/imageConfig";
import AppCustomPicker from "../AppCustomPicker";

const CreateLeaderboardModal = ({
  isVisible,
  setVisible,
  setIsLaunchCompetitionModalOpen,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const competition = useSelector((state) => state.competition);
  const [leaderboardName, setLeaderboardName] = useState("");
  const [leaderboardImage, setLeaderboardImage] = useState({});
  const [leaderboardCompetitions, setLeaderboardCompetitions] = useState([]);
  const [allLeaderboards, setAllLeaderboards] = useState([]);
  const addOrRemoveToLeaderboard = (competitionCode) => {
    if (leaderboardCompetitions.includes(competitionCode)) {
      const rest = leaderboardCompetitions?.filter(
        (c) => c !== competitionCode
      );
      setLeaderboardCompetitions(rest);
    } else {
      setLeaderboardCompetitions([...leaderboardCompetitions, competitionCode]);
    }
  };

  const getAllLeaderBoards = async () => {
    const response = await Api.get("/leaderboards");
    if (response?.result && response?.code) {
      const names = response?.result?.map((leaderboard) =>
        leaderboard?.leaderboardName?.toLowerCase()
      );
      setAllLeaderboards(names);
    }
  };

  useEffect(() => {
    getAllLeaderBoards();
  }, [isVisible]);

  const onCreateLeaderboard = async () => {
    const body =
      leaderboardImage?.type === "LINK"
        ? {
            leaderboardName: leaderboardName,
            imageURL: leaderboardImage?.url,
            competitions: leaderboardCompetitions,
          }
        : {
            leaderboardName: leaderboardName,
            emojiObject: leaderboardImage?.emoji,
            competitions: leaderboardCompetitions,
          };
    try {
      const response = await Api.post("/leaderboards", body);
      if (response?.code && response?.result) {
        setLeaderboardName("");
        setLeaderboardImage({});
        setLeaderboardCompetitions([]);
        setVisible(false);
        router.push(
          routeGenerator(routes.leaderboard, {
            leaderboardID: response?.result._id,
          })
        );
      } else {
        dispatch(notify({ type: "error", message: "Something went wrong" }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkExistName = (name) => {
    const isExist = allLeaderboards?.includes(name?.toLowerCase());
    if (isExist) {
      dispatch(
        notify({
          type: "error",
          message: `Leaderboard with name ${name} already exists!`,
        })
      );
      setLeaderboardName("");
    } else {
      setLeaderboardName(name);
    }
  };

  return (
    <AppModal
      className={`createLeaderboardModal ${
        competition?.organized?.length > 0 ? "" : "notOrganisedCompetitions"
      }`}
      isVisible={isVisible}
      onOk={() => setVisible(false)}
      onCancel={() => {
        setLeaderboardName("");
        setLeaderboardImage({});
        setLeaderboardCompetitions([]);
        setVisible(false);
      }}
      footer={
        competition?.organized?.length > 0 && [
          <div className="group createLeaderboardNotifications" key="1">
            <div className="createLeaderboardNotificationsMessages">
              {!leaderboardName && (
                <Typography.Text>
                  You have to insert the Leaderboard name.
                </Typography.Text>
              )}
              {!leaderboardImage?.type && (
                <Typography.Text>
                  You have to select or upload the Image of Leaderboard.
                </Typography.Text>
              )}
              {!leaderboardCompetitions?.length && (
                <Typography.Text>
                  You have to select at least one Competition.
                </Typography.Text>
              )}
            </div>
            <Button
              type="primary"
              onClick={() => onCreateLeaderboard()}
              style={{ fontSize: "1rem" }}
              size="small"
              className="p-1 text-sm "
              disabled={
                !leaderboardCompetitions?.length ||
                !Boolean(leaderboardName && leaderboardImage?.type)
              }
            >
              Create Leaderboard
            </Button>
          </div>,
        ]
      }
    >
      {competition?.organized?.length > 0 ? (
        <div className="createLeaderboardModalHolder">
          <div className="createLeaderboardModalHeader">
            <AppCustomPicker
              className="tabset"
              popOverClass="m-5"
              tabpaneClass="m-5"
              onImageSelected={(e) => {
                setLeaderboardImage(e);
              }}
            />
            <div className="createLeaderboardModalInput">
              <Input
                onInput={(e) => (e.target.value = capitalize(e.target.value))}
                placeholder="Name your Leaderboard"
                onPressEnter={(e) => checkExistName(e.target.value)}
                onBlur={(e) => checkExistName(e.target.value)}
              />
            </div>
          </div>
          <div className="createLeaderboardModalContent">
            <Typography.Title className="heading" level={3}>
              Select Compititions
            </Typography.Title>
            <Typography.Text className="introText">
              Multiselect to match codes and create contingent leaderboard
            </Typography.Text>
            <div className="createLeaderboardCompititions">
              {competition?.organized?.map((comp, i) => (
                <div
                  key={i}
                  onClick={() =>
                    addOrRemoveToLeaderboard(comp?.competitionCode)
                  }
                  className={`createLeaderboardCompititionsItem ${
                    leaderboardCompetitions?.includes(comp?.competitionCode)
                      ? "bg-purple-400"
                      : ""
                  }`}
                >
                  <div className="createLeaderboardCompititionsItemLeft">
                    <div className="createLeaderboardCompititionsIcon">
                      {/* competion Image / Emoji */}
                      {comp?.emojiObject ? (
                        <p style={{ fontSize: "2rem" }}>
                          {comp?.emojiObject.emoji}
                        </p>
                      ) : (
                        <Image
                          src={comp?.imageURL}
                          preview={false}
                          width={100}
                          heigth={100}
                          alt="img"
                        />
                      )}
                      {/* <img
                      src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663613817685_trophy.png"
                      alt=""
                    /> */}
                    </div>
                    <div className="createLeaderboardCompititionsTextbox">
                      <Typography.Title
                        className="compititionNameTitle"
                        level={5}
                      >
                        {comp?.competitionName}
                      </Typography.Title>
                      <div className="compititionMeta">
                        <Typography.Text className="compititionDate">
                          <Image
                            preview={false}
                            src={comp?.category[0]?.imageUrl}
                            alt=""
                          />
                          {comp?.category[0]?.categoryName}
                        </Typography.Text>
                        <Typography.Text className="compititionDate">
                          {moment(comp?.createdAt)?.format("DD/MM/YYYY")}
                        </Typography.Text>
                      </div>
                    </div>
                  </div>
                  <div className="createLeaderboardCompititionsItemRight">
                    <ul>
                      <li>
                        <span className="icon">
                          <Image
                            preview={false}
                            src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663614760042_group.svg"
                            alt=""
                          />
                        </span>
                        <Typography.Text className="compititionTeamsText">
                          {comp?.containers?.length} Teams
                        </Typography.Text>
                      </li>
                      <li>
                        <span className="icon">
                          <Image
                            preview={false}
                            src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663614836020_round.svg"
                            alt=""
                          />
                        </span>
                        <Typography.Text className="compititionTeamsText">
                          {comp?.rounds?.length} Rounds
                        </Typography.Text>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center popup-createCompetition">
          <Image
            alt="Leaderboard"
            src={background2}
            preview={false}
            rootClassName="popup-image"
          />
          <Typography.Text className="heading">
            Set up competitions to create a Leaderboard
          </Typography.Text>
          <Typography.Text className="paragraph">
            You have not organised any competitions yet
          </Typography.Text>
          <Button
            type="primary"
            onClick={() => {
              setIsLaunchCompetitionModalOpen(true);
              setVisible(false);
            }}
          >
            + Create Competition
          </Button>
        </div>
      )}
    </AppModal>
  );
};

export default CreateLeaderboardModal;
