import { Button, Checkbox, Image, Input, Tooltip } from "antd";
import {
  EditPencilIcon,
  FirstPlace,
  LockedIcon,
  Participation,
  RewardCoinImg,
  SecondPlace,
  SlamittCoinImg,
  SlamittParticipants,
  SpecialMention,
  ThirdPlace,
  TickIcon,
  TrophyIcon,
  TrophyIcons,
  UnlockedIcon,
} from "../../../../utility/iconsLibrary";
import { useState } from "react";
import { useEffect } from "react";
import Api from "../../../../services";
import { notify } from "../../../../Redux/Actions";
import { useDispatch } from "react-redux";

const RewardContentSection = ({
  setReward,
  reward,
  placementData,
  purchaseHistory,
  competition,
}) => {
  const dispatch = useDispatch();

  const [participants, setParticipants] = useState({
    editable: false,
    percentage: 100,
    coins: 1500,
  });
  const [placements, setPlacements] = useState({
    editable: false,
    percentage: 0,
    coins: 0,
  });

  useEffect(() => {
    setParticipants((prev) => ({
      ...prev,
      coins: competition?.slamCoins?.distribution?.participants,
      percentage:
        (competition?.slamCoins?.distribution?.participants /
          competition?.slamCoins?.coins) *
        100,
    }));
    setPlacements((prev) => ({
      ...prev,
      coins: competition?.slamCoins?.distribution?.placements,
      percentage:
        (competition?.slamCoins?.distribution?.placements /
          competition?.slamCoins?.coins) *
        100,
    }));
  }, [competition]);

  const [participantPercentage, setParticipantPercentage] = useState(
    participants?.percentage
  );
  const [placementPercentage, setPlacementPercentage] = useState(
    placements?.percentage
  );

  useEffect(() => {
    if (participants.percentage) {
      setParticipantPercentage(participants.percentage);
    }
    if (placements.percentage) {
      setPlacementPercentage(placements.percentage);
    }
  }, [participants.percentage, placements.percentage]);

  const [specialMention, setSpecialMention] = useState([]);
  useEffect(() => {
    setSpecialMention(
      placementData?.filter?.((item) => item?.type !== "placement")
    );
  }, [placementData]);

  const getCoinsDistribution = async (participant, placement) => {
    setReward((prev) => ({
      ...prev,
      competitionCode: competition?.competitionCode,
      placements: placement,
      participants: participant,
    }));
  };

  return (
    <div className="slamCoinsDistributionContainer">
      {!competition?.slamCoins ? (
        <div className="slamCoinsPalceholder">
          <div className="image">
            <SlamittCoinImg />
          </div>
          <p>
            Slam coins will be distributed amongst Participants
            <br /> based on their performance
          </p>
        </div>
      ) : (
        <div className="slamCoinsDistributionBlock">
          <div className="slamCoinsDistributionBlockHeader">
            <div className="slamCoinsDistributionBlockHeaderLeft">
              <strong className="title">Slam Coin Distribution</strong>
              <p>
                Grow your Registrations by offering participants Slam coins. You
                may distribute your charged wallet between both pools.
              </p>
            </div>
            <div className="slamCoinsDistributionBlockHeaderRight">
              <Button type="secondary">View Leaderboard</Button>
            </div>
          </div>
          <div className="slamCoinsDistributionColumns">
            <div className="slamCoinsDistributionCol">
              <div className="slamCoinsDistributionColHead">
                <div className="slamCoinsDistributionColHeadleft">
                  <div className="icon">
                    <img
                      src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1687552126529_image_531.png"
                      alt="Image"
                    />
                  </div>
                  <strong className="title">Participants</strong>
                </div>
                <div className="slamCoinsDistributionColHeadRight">
                  <div className="inputWrap">
                    {participants.editable ? (
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        onChange={(e) => {
                          if (e.target.value <= 100 && e.target.value >= 0)
                            setParticipantPercentage(e.target.value);
                        }}
                        value={participantPercentage}
                      />
                    ) : (
                      <div>{Number(participants?.percentage)?.toFixed(2)}</div>
                    )}{" "}
                    %
                    <div className="buttonEdit">
                      {!participants.editable ? (
                        <div
                          onClick={() => {
                            setParticipants({
                              ...participants,
                              editable: true,
                            });
                          }}
                        >
                          <EditPencilIcon />
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setParticipants((prev) => ({
                              ...prev,
                              editable: false,
                              percentage: participantPercentage,
                              coins:
                                (competition?.slamCoins?.coins *
                                  participantPercentage) /
                                100,
                            }));
                            setPlacements((prev) => ({
                              ...prev,
                              percentage: 100 - participantPercentage,
                              coins:
                                (competition?.slamCoins?.coins *
                                  (100 - participantPercentage)) /
                                100,
                            }));

                            getCoinsDistribution(
                              (competition?.slamCoins?.coins *
                                participantPercentage) /
                                100,
                              (competition?.slamCoins?.coins *
                                (100 - participantPercentage)) /
                                100
                            );
                          }}
                        >
                          <TickIcon />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="slamCoinsDistributionPoints">
                <div className="slamCoinsDistributionPointsHolder">
                  <div className="coinIcon">
                    <RewardCoinImg />
                  </div>
                  <div className="slamCoinsDistributionPointsText">
                    <strong className="ponitsNumber">
                      <Input
                        type="number"
                        value={participants.coins}
                        placeholder=""
                        onChange={(e) => {
                          if (e.target.value <= competition?.slamCoins?.coins)
                            setParticipants((prev) => ({
                              ...prev,
                              coins: e.target.value,
                            }));
                        }}
                        onPressEnter={() => {
                          setParticipants((prev) => ({
                            ...prev,
                            percentage:
                              (prev.coins / competition?.slamCoins?.coins) *
                              100,
                          }));
                          setPlacements((prev) => ({
                            ...prev,
                            coins:
                              competition?.slamCoins?.coins -
                              participants.coins,
                            percentage:
                              ((competition?.slamCoins?.coins -
                                participants.coins) /
                                competition?.slamCoins?.coins) *
                              100,
                          }));

                          getCoinsDistribution(
                            participants.coins,
                            competition?.slamCoins?.coins - participants.coins
                          );
                        }}
                        onBlur={() => {
                          setParticipants((prev) => ({
                            ...prev,
                            percentage:
                              (prev.coins / competition?.slamCoins?.coins) *
                              100,
                          }));
                          setPlacements((prev) => ({
                            ...prev,
                            coins:
                              competition?.slamCoins?.coins -
                              participants.coins,
                            percentage:
                              ((competition?.slamCoins?.coins -
                                participants.coins) /
                                competition?.slamCoins?.coins) *
                              100,
                          }));

                          getCoinsDistribution(
                            participants.coins,
                            competition?.slamCoins?.coins - participants.coins
                          );
                        }}
                      />
                    </strong>{" "}
                    of {competition?.slamCoins?.coins}
                  </div>
                  <div className="excludePlacedCheckbox">
                    <Checkbox
                      onChange={(e) =>
                        setReward((prev) => ({
                          ...prev,
                          excludePlacements: e.target.checked,
                        }))
                      }
                      checked={reward?.excludePlacements}
                    >
                      Exclude Placed{" "}
                      {competition?.type === "SOLO" ? "Participants" : "Teams"}{" "}
                    </Checkbox>
                  </div>
                </div>
              </div>
              <div className="slamCoinsDistributionNoteBox">
                <div className="imageIcon">
                  <Participation />
                </div>
                <div className="text">
                  This pool will be divided amongst participants who do not
                  place. Participants will receive Slam coins based on their
                  final scores.
                </div>
              </div>
            </div>
            <div className="slamCoinsDistributionCol">
              <div className="slamCoinsDistributionColHead">
                <div className="slamCoinsDistributionColHeadleft">
                  <div className="icon">
                    <img
                      src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1687552088988_image_7.png"
                      alt="Image"
                    />
                  </div>
                  <strong className="title">Placements</strong>
                </div>
                <div className="slamCoinsDistributionColHeadRight">
                  <div className="inputWrap">
                    {placements.editable ? (
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        onChange={(e) => {
                          if (e.target.value <= 100 && e.target.value >= 0)
                            setPlacementPercentage(e.target.value);
                        }}
                        value={placementPercentage}
                      />
                    ) : (
                      <div>{Number(placements?.percentage)?.toFixed(2)}</div>
                    )}{" "}
                    %
                    <div className="buttonEdit">
                      {!placements.editable ? (
                        <div
                          onClick={() => {
                            setPlacements({ ...placements, editable: true });
                          }}
                        >
                          <EditPencilIcon />
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setPlacements({
                              ...placements,
                              editable: false,
                              percentage: placementPercentage,
                              coins:
                                (competition?.slamCoins?.coins *
                                  placementPercentage) /
                                100,
                            });
                            setParticipants((prev) => ({
                              ...prev,
                              percentage: 100 - placementPercentage,
                              coins:
                                (competition?.slamCoins?.coins *
                                  (100 - placementPercentage)) /
                                100,
                            }));
                            getCoinsDistribution(
                              (competition?.slamCoins?.coins *
                                (100 - placementPercentage)) /
                                100,
                              (competition?.slamCoins?.coins *
                                placementPercentage) /
                                100
                            );
                          }}
                        >
                          <TickIcon />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="slamCoinsDistributionPoints">
                <div className="slamCoinsDistributionPointsHolder">
                  <div className="coinIcon">
                    <RewardCoinImg />
                  </div>
                  <div className="slamCoinsDistributionPointsText">
                    <strong className="ponitsNumber">
                      <Input
                        type="number"
                        value={placements.coins}
                        placeholder=""
                        onChange={(e) => {
                          if (e.target.value <= competition?.slamCoins?.coins)
                            setPlacements({
                              ...placements,
                              coins: e.target.value,
                            });
                        }}
                        onPressEnter={(e) => {
                          setPlacements((prev) => ({
                            ...prev,
                            percentage:
                              (prev?.coins / competition?.slamCoins?.coins) *
                              100,
                          }));
                          setParticipants({
                            ...placements,
                            coins:
                              competition?.slamCoins?.coins - placements.coins,
                            percentage:
                              ((competition?.slamCoins?.coins -
                                placements.coins) /
                                competition?.slamCoins?.coins) *
                              100,
                          });
                          getCoinsDistribution(
                            competition?.slamCoins?.coins - placements.coins,
                            placements.coins
                          );
                        }}
                        onBlur={(e) => {
                          setPlacements((prev) => ({
                            ...prev,
                            percentage:
                              (prev?.coins / competition?.slamCoins?.coins) *
                              100,
                          }));
                          setParticipants({
                            ...placements,
                            coins:
                              competition?.slamCoins?.coins - placements.coins,
                            percentage:
                              ((competition?.slamCoins?.coins -
                                placements.coins) /
                                competition?.slamCoins?.coins) *
                              100,
                          });
                          getCoinsDistribution(
                            competition?.slamCoins?.coins - placements.coins,
                            placements.coins
                          );
                        }}
                      />
                    </strong>{" "}
                    of {competition?.slamCoins?.coins}
                  </div>
                </div>
              </div>
              <ul className="slamCoinsDistributionPositions">
                <li>
                  <div className="positionItem first">
                    <FirstPlace />
                  </div>
                </li>

                <li>
                  <div className="positionItem second lock">
                    <SecondPlace />
                    {(placementData?.length < 2 ||
                      placementData?.[1]?.isLocked) && (
                      <Tooltip
                        title="Unlock within Placements"
                        trigger={"hover"}
                        color="black"
                      >
                        <div className="statusIcon">
                          <span className="iconLock">
                            <LockedIcon />
                          </span>
                        </div>
                      </Tooltip>
                    )}
                  </div>
                </li>

                <li>
                  <div className="positionItem third lock">
                    <ThirdPlace />
                    {(placementData?.length < 3 ||
                      placementData?.[2]?.isLocked) && (
                      <Tooltip
                        title="Unlock within Placements"
                        trigger={"hover"}
                        color="black"
                      >
                        <div className="statusIcon">
                          <span className="iconLock">
                            <LockedIcon />
                          </span>
                        </div>
                      </Tooltip>
                    )}
                  </div>
                </li>
                {!!specialMention?.length && (
                  <li>
                    <div className="positionItem">
                      <SpecialMention />
                      {specialMention?.length > 1 && (
                        <div className="statusIcon">
                          <span className="iconLock">
                            {specialMention?.length}
                          </span>
                        </div>
                      )}
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardContentSection;
