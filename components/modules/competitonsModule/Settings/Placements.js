import { Avatar, Button, Image, Input, Tooltip } from "antd";
import {
  TickIcon,
  EditCertificatesIcon,
  UnlockedIcon,
  LockedIcon,
  PlacementImage,
  EditPencilIcon,
  LeaderBoardThunderBoltIcon,
  CheckedGreenIcon,
  DotsIcon,
  CrossNewIcon,
} from "../../../../utility/iconsLibrary";
import { useState } from "react";
import { useEffect } from "react";
import ContainerSelectionModal from "../../RewardsModule/RewardsModals/ContainerSelectionModal";
import { useSelector } from "react-redux";
import Api from "../../../../services";
import { toast } from "react-toastify";

const Placements = ({ placementsData, setPlacementsData }) => {
  const competition = useSelector((state) => state.competition);
  const [placementsEditable, setPlacementsEditable] = useState(false);

  const containerState = useSelector((state) =>
    state.containers.all.sort((a, b) => b.points - a.points)
  );

  const [ranks, setRanks] = useState({
    firstRank: null,
    secondRank: null,
    thirdRank: null,
  });

  useEffect(() => {
    let prevScore = 0;
    let rank = 1;
    const getContainerRanks = async () => {
      for await (let container of containerState) {
        if (container.points === prevScore) {
          rank = rank - 1;
        }

        container.rank = rank;
        rank++;
        prevScore = container.points;
      }

      setRanks({
        firstRank: containerState.filter((item) => item.rank === 1),
        secondRank: containerState.filter((item) => item.rank === 2),
        thirdRank: containerState.filter((item) => item.rank === 3),
      });
    };

    if (containerState) {
      getContainerRanks();
    }
  }, [containerState]);

  const [configure, setConfigure] = useState(false);
  const [lockState, setLockState] = useState({
    // first: true,
    second: true,
    third: true,
  });
  const [showModal, setShowModal] = useState(false);
  const [mentions, setMentions] = useState([
    {
      lock: true,
      label: "",
      editable: false,
    },
  ]);
  const [index, setIndex] = useState();
  const [render, setRender] = useState(false);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (placementsData) {
      console.log("Placements Data: ", placementsData);
      setConfigure(true);
      const { places } = placementsData;
      if (!!places?.length) {
        setLockState({
          second: places?.[1]?.isLocked,
          third: places?.[2]?.isLocked,
        });

        let mentionPlaces = places.filter((item) => item.type != "placement");

        // mentionPlaces.forEach((item) => {
        //   item.isEditable = false;
        //   containerState.forEach((e) => {
        //     if (e.containerCode == item?.containerCodes?.[0]) {
        //       item.score = e.points;
        //       item.emojiObject = e.emojiObject;
        //       item.imageURL = e.imageURL;
        //     }
        //   });
        // });
        mentionPlaces = mentionPlaces.map((item) => {
          const newItem = { ...item, isEditable: false };
          newItem.containerCodes = [item?.containerCodes?.[0]];
          newItem.container = {};
          containerState.forEach((e) => {
            if (e.containerCode === item?.containerCodes?.[0]) {
              newItem.container.score = e.points;
              newItem.container.containerCodes = [item?.containerCodes?.[0]];
              newItem.container.emojiObject = e.emojiObject;
              newItem.container.imageURL = e.imageURL;
              newItem.container.name = e.containerName;
              newItem.container.status = !e.users.length
                ? "Unassigned"
                : !!e.users.filter((item) => item.status == "ONBOARDED").length
                ? "ONBOARDED"
                : "INVITED";
            }
          });
          return newItem;
        });
        console.log("mentionPlaces", mentionPlaces);
        if (mentionPlaces?.length == 3) {
          setMentions(mentionPlaces);
        } else if (mentionPlaces?.length < 3) {
          setMentions([
            ...mentionPlaces,
            ...[
              {
                lock: true,
                label: "",
                editable: false,
              },
            ],
          ]);
        }
      }
    }
  }, [placementsData]);

  const handlePlacements = async () => {
    setLoading(true);
    const array = [
      {
        label: "1st Place",
        type: "placement",
        isLocked: false,
        prizes: placementsData?.places?.find(
          (item) => item.label === "1st Place"
        ).prizes,
        trophiesAndMedals: placementsData?.places?.find(
          (item) => item.label === "1st Place"
        ).trophiesAndMedals,
      },
      {
        label: "2nd Place",
        type: "placement",
        isLocked: lockState.second,
        prizes: placementsData?.places?.find(
          (item) => item.label === "2nd Place"
        ).prizes,
        trophiesAndMedals: placementsData?.places?.find(
          (item) => item.label === "2nd Place"
        ).trophiesAndMedals,
      },
      {
        label: "3rd Place",
        type: "placement",
        isLocked: lockState.third,
        prizes: placementsData?.places?.find(
          (item) => item.label === "3rd Place"
        ).prizes,
        trophiesAndMedals: placementsData?.places?.find(
          (item) => item.label === "3rd Place"
        ).trophiesAndMedals,
      },
    ];

    mentions.forEach((item) => {
      if (!item?.lock) {
        const obj = {
          label: item?.label || "Special Mention",
          type: "specialMention",
          isLocked: item?.lock ?? item?.isLocked,
          containerCodes: item?.container?.containerCodes,
          prizes: item?.prizes,
          trophiesAndMedals: item?.trophiesAndMedals,
        };
        array.push(obj);
      }
    });

    try {
      const res = await Api.update(
        `/placements/${competition?.current?.competitionCode}`,
        { places: array }
      );
      if (res?.code && res?.result) {
        setLoading(false);
        setPlacementsEditable(false);
        console.log("mentionPlaces", res?.result);
        setPlacementsData(res?.result);
        toast.success(res?.message);
      } else {
        setLoading(false);
        toast.error(res?.result?.error?.message);
      }
    } catch (error) {
      setLoading(false);
      console.log("Placement Result Error: ", error);
    }
  };

  return (
    <div className="certificatesSettings placementsSettingsBlock">
      <div className="visibleTabletMobile certificatesMobileHead">
        <div className="certificatesSettingsIcon">
          <PlacementImage />
        </div>
        <span className="visibleTabletMobileText">Placements</span>
      </div>
      <div className="certificatesSettingsHeader">
        <div className="certificatesSettingsHeaderTitle">
          <div className="certificatesSettingsIcon">
            <PlacementImage />
          </div>
          <strong className="certificatesSettingsTitle">Placements</strong>
        </div>
        <div className="certificatesSettingsHeaderButton">
          {competition?.current?.status != "CONCLUDED" ? (
            configure ? (
              <Button
                className={
                  placementsEditable ? "buttonSave" : "buttonConfigure"
                }
                icon={
                  !loading && placementsEditable ? (
                    <TickIcon />
                  ) : (
                    <EditPencilIcon />
                  )
                }
                onClick={() => {
                  if (placementsEditable) {
                    handlePlacements();
                  } else {
                    setPlacementsEditable(true);
                  }
                }}
              >
                {loading ? (
                  <div className="loader-icon" />
                ) : placementsEditable ? (
                  "Save"
                ) : (
                  "Edit"
                )}
              </Button>
            ) : (
              <Button
                className="buttonConfigure"
                onClick={() => {
                  setConfigure(true);
                  setPlacementsEditable(true);
                }}
              >
                Configure
              </Button>
            )
          ) : (
            <></>
          )}
          <Button className="buttonCircle visibleMobile">
            <EditCertificatesIcon />
          </Button>
        </div>
      </div>
      <div className="certificatesSettingsContent">
        <div className="placementsInfoText">
          Select the placements you would like to activate for this competition
          by unlocking them. You will be able to set up certificates and Rewards
          based on the placements you set up.
        </div>
        <div className="placementItemsBlock">
          <div
            className={`placementItem firstPlace unlock`}
            // className={`placementItem firstPlace ${lockState.first ? "lock" : "unlock"}`}
            // onClick={() =>
            //   setLockState({ ...lockState, first: !lockState.first })
            // }
          >
            <strong className="placementItemTitle">1st Place</strong>
            <div className="placementItemImage">
              {/* <div className="statusIcon">
                <span className="iconLock">
                  <LockedIcon />
                </span>
                <span className="iconUnLock">
                  <UnlockedIcon />
                </span>
              </div> */}
              <Image
                src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1684419254600_image_444_2.png"
                alt="1st place"
                preview={false}
              />
              {configure &&
                ranks?.firstRank?.map((item) => (
                  <div className="placementItemAvatar">
                    {item.emojiObject ? (
                      <p
                        className="competitionTeamsEmoji"
                        style={{ fontSize: "1.5rem", marginBottom: 0 }}
                      >
                        {item?.emojiObject?.emoji}
                      </p>
                    ) : (
                      <Avatar src={item?.imageURL} />
                    )}
                  </div>
                ))}
            </div>
            {ranks?.firstRank && ranks?.firstRank?.length > 0 && configure && (
              <div className="placementItemTextbox">
                {ranks?.firstRank?.length > 1 ? (
                  ranks?.firstRank?.map((rnk, index) => (
                    <div key={index} className="placementItemUserName">
                      <div className="userNameTitle">{rnk?.containerName}</div>{" "}
                      {!rnk?.users.length ? (
                        <span className="textUnassigned">(Unassigned)</span>
                      ) : !!rnk?.users.filter(
                          (item) => item.status == "ONBOARDED"
                        ) ? (
                        <CheckedGreenIcon className="checkIcon" />
                      ) : (
                        <Tooltip
                          trigger={"hover"}
                          placement="top"
                          color={"black"}
                          title={"Request team to onboard to receive Accolades"}
                        >
                          INVITED
                        </Tooltip>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="placementItemUserName">
                    <div className="userNameTitle">
                      {ranks?.firstRank?.[0]?.containerName}
                    </div>{" "}
                    {!ranks?.firstRank?.[0]?.users.length ? (
                      <span className="textUnassigned">(Unassigned)</span>
                    ) : !!ranks?.firstRank?.[0]?.users.filter(
                        (item) => item.status == "ONBOARDED"
                      ) ? (
                      <CheckedGreenIcon className="checkIcon" />
                    ) : (
                      <Tooltip
                        trigger={"hover"}
                        placement="top"
                        color={"black"}
                        title={"Request team to onboard to receive Accolades"}
                      >
                        INVITED
                      </Tooltip>
                    )}
                  </div>
                )}
                <div className="placementItemUserPoints">
                  <LeaderBoardThunderBoltIcon />
                  <span className="placementItemUserPointsText">
                    {ranks?.firstRank?.[0]?.points}
                  </span>
                </div>
              </div>
            )}
          </div>
          {configure && (
            <>
              {!(!placementsEditable && lockState.second) &&
                !(
                  competition?.current?.status == "CONCLUDED" &&
                  lockState.second
                ) && (
                  <div
                    className={`placementItem secondPlace ${
                      lockState.second ? "lock" : "unlock"
                    }`}
                  >
                    <strong className="placementItemTitle">2nd Place</strong>
                    <div className="placementItemImage">
                      {competition?.current?.status !== "CONCLUDED" &&
                        placementsEditable && (
                          <div
                            className="statusIcon"
                            onClick={() => {
                              if (lockState.second)
                                setLockState({
                                  second: false,
                                  third: lockState.third,
                                });
                              else setLockState({ third: true, second: true });
                            }}
                          >
                            <span className="iconLock">
                              <LockedIcon />
                            </span>
                            <span className="iconUnLock">
                              <UnlockedIcon />
                            </span>
                          </div>
                        )}
                      <Image
                        src="https://rethink-competitions.s3.amazonaws.com/1685464874140_medal.png"
                        alt="1st place"
                        preview={false}
                      />
                      {ranks?.secondRank?.map((item) => (
                        <div className="placementItemAvatar">
                          {item.emojiObject ? (
                            <p
                              className="competitionTeamsEmoji"
                              style={{ fontSize: "1.5rem", marginBottom: 0 }}
                            >
                              {item?.emojiObject?.emoji}
                            </p>
                          ) : (
                            <Avatar src={item?.imageURL} />
                          )}
                        </div>
                      ))}
                    </div>
                    {ranks?.secondRank && ranks?.secondRank?.length > 0 && (
                      <div className="placementItemTextbox">
                        {ranks?.secondRank?.length > 1 ? (
                          ranks?.secondRank?.map((rnk, index) => (
                            <div key={index} className="placementItemUserName">
                              <div className="userNameTitle">
                                {rnk?.containerName}
                              </div>{" "}
                              {!rnk?.users.length ? (
                                <span className="textUnassigned">
                                  (Unassigned)
                                </span>
                              ) : !!rnk?.users.filter(
                                  (item) => item.status == "ONBOARDED"
                                ) ? (
                                <CheckedGreenIcon className="checkIcon" />
                              ) : (
                                <Tooltip
                                  trigger={"hover"}
                                  placement="top"
                                  color={"black"}
                                  title={
                                    "Request team to onboard to receive Accolades"
                                  }
                                >
                                  INVITED
                                </Tooltip>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="placementItemUserName">
                            <div className="userNameTitle">
                              {ranks?.secondRank?.[0]?.containerName}
                            </div>{" "}
                            {!ranks?.secondRank?.[0]?.users.length ? (
                              <span className="textUnassigned">
                                (Unassigned)
                              </span>
                            ) : !!ranks?.secondRank?.[0]?.users.filter(
                                (item) => item.status == "ONBOARDED"
                              ) ? (
                              <CheckedGreenIcon className="checkIcon" />
                            ) : (
                              <Tooltip
                                trigger={"hover"}
                                placement="top"
                                color={"black"}
                                title={
                                  "Request team to onboard to receive Accolades"
                                }
                              >
                                INVITED
                              </Tooltip>
                            )}
                          </div>
                        )}
                        <div className="placementItemUserPoints">
                          <LeaderBoardThunderBoltIcon />
                          <span className="placementItemUserPointsText">
                            {ranks?.secondRank?.[0]?.points}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              {!(!placementsEditable && lockState.third) &&
                !(
                  competition?.current?.status == "CONCLUDED" && lockState.third
                ) && (
                  <div
                    className={`placementItem thirdPlace ${
                      lockState.third ? "lock" : "unlock"
                    }`}
                  >
                    <strong className="placementItemTitle">3rd Place</strong>
                    <div className="placementItemImage">
                      {competition?.current?.status !== "CONCLUDED" &&
                        placementsEditable && (
                          <div
                            className="statusIcon"
                            onClick={() =>
                              setLockState({
                                third: !lockState.third,
                                second: false,
                              })
                            }
                          >
                            <span className="iconLock">
                              <LockedIcon />
                            </span>
                            <span className="iconUnLock">
                              <UnlockedIcon />
                            </span>
                          </div>
                        )}
                      <Image
                        src="https://rethink-competitions.s3.amazonaws.com/1684418825982_image_445_1.png"
                        alt="1st place"
                        preview={false}
                      />
                      {ranks?.thirdRank?.map((item) => (
                        <div className="placementItemAvatar">
                          {item.emojiObject ? (
                            <p
                              className="competitionTeamsEmoji"
                              style={{ fontSize: "1.5rem", marginBottom: 0 }}
                            >
                              {item?.emojiObject?.emoji}
                            </p>
                          ) : (
                            <Avatar src={item?.imageURL} />
                          )}
                        </div>
                      ))}
                    </div>
                    {ranks?.thirdRank && ranks?.thirdRank?.length > 0 && (
                      <div className="placementItemTextbox">
                        {ranks?.thirdRank?.length > 1 ? (
                          ranks?.thirdRank?.map((rnk, index) => (
                            <div key={index} className="placementItemUserName">
                              <div className="userNameTitle">
                                {rnk?.containerName}
                              </div>{" "}
                              {!rnk?.users.length ? (
                                <span className="textUnassigned">
                                  (Unassigned)
                                </span>
                              ) : !!rnk?.users.filter(
                                  (item) => item.status == "ONBOARDED"
                                ) ? (
                                <CheckedGreenIcon className="checkIcon" />
                              ) : (
                                <Tooltip
                                  trigger={"hover"}
                                  placement="top"
                                  color={"black"}
                                  title={
                                    "Request team to onboard to receive Accolades"
                                  }
                                >
                                  INVITED
                                </Tooltip>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="placementItemUserName">
                            <div className="userNameTitle">
                              {ranks?.thirdRank?.[0]?.containerName}
                            </div>{" "}
                            {!ranks?.thirdRank?.[0]?.users.length ? (
                              <span className="textUnassigned">
                                (Unassigned)
                              </span>
                            ) : !!ranks?.thirdRank?.[0]?.users.filter(
                                (item) => item.status == "ONBOARDED"
                              ) ? (
                              <CheckedGreenIcon className="checkIcon" />
                            ) : (
                              <Tooltip
                                trigger={"hover"}
                                placement="top"
                                color={"black"}
                                title={
                                  "Request team to onboard to receive Accolades"
                                }
                              >
                                INVITED
                              </Tooltip>
                            )}
                          </div>
                        )}
                        <div className="placementItemUserPoints">
                          <LeaderBoardThunderBoltIcon />
                          <span className="placementItemUserPointsText">
                            {ranks?.thirdRank?.[0]?.points}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              {mentions.map((item, index) => {
                return !(!placementsEditable && item?.lock) &&
                  !(
                    competition?.current?.status == "CONCLUDED" && item?.lock
                  ) ? (
                  <div
                    className={`placementItem ${item.lock ? "lock" : "unlock"}`}
                  >
                    <strong className="placementItemTitle">
                      {item.editable ? (
                        <Input
                          type="text"
                          placeholder="Special Mention"
                          value={item.label}
                          onChange={(e) => {
                            item.label = e.target.value;
                            setRender(!render);
                          }}
                          onPressEnter={() => {
                            item.editable = false;
                            setRender(!render);
                          }}
                        />
                      ) : (
                        <div className="specialText">
                          {item.label ? item.label : "Special Mention"}
                        </div>
                      )}
                      {competition?.current?.status !== "CONCLUDED" &&
                        placementsEditable &&
                        !item.editable && (
                          <div
                            className="editButton"
                            onClick={() => {
                              item.editable = true;
                              setRender(!render);
                            }}
                          >
                            <EditPencilIcon />
                          </div>
                        )}
                    </strong>
                    <div className="placementItemImage">
                      {competition?.current?.status !== "CONCLUDED" &&
                        placementsEditable && (
                          <div
                            className="statusIcon"
                            onClick={() => {
                              if (index == mentions.length - 1 && item.lock) {
                                if (mentions.length < 3)
                                  setMentions([
                                    ...mentions,
                                    ...[{ lock: true, editable: false }],
                                  ]);
                                item.lock = !item.lock;
                                setRender(!render);
                              } else if (!item.lock) {
                                item.lock = true;
                                const array = [...mentions];
                                array.splice(array.length - 2, 1);
                                setMentions(array);
                              }
                            }}
                          >
                            <span className="iconLock">
                              <LockedIcon />
                            </span>
                            <span className="iconUnLock">
                              <UnlockedIcon />
                            </span>
                          </div>
                        )}
                      <Image
                        src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1684418869052_image_444_1.png"
                        alt="1st place"
                        preview={false}
                      />
                      <div className="placementItemAvatar">
                        {item?.container?.emojiObject ||
                        item?.container?.imageURL ? (
                          item?.container?.emojiObject ? (
                            <p
                              className="competitionTeamsEmoji"
                              style={{ fontSize: "1.5rem", marginBottom: 0 }}
                            >
                              {item?.container?.emojiObject?.emoji}
                            </p>
                          ) : (
                            <Avatar src={item?.container?.imageURL} />
                          )
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    {item?.container?.name ? (
                      <div className="placementItemTextbox">
                        <div className="placementItemUserName">
                          <div className="userNameTitle">
                            {item.container.name}{" "}
                          </div>{" "}
                          {item.container.status == "ONBOARDED" ? (
                            <CheckedGreenIcon className="checkIcon" />
                          ) : item.container.status == "INVITED" ? (
                            <Tooltip
                              trigger={"hover"}
                              placement="top"
                              color={"black"}
                              title={
                                "Request team to onboard to receive Accolades"
                              }
                            >
                              <DotsIcon className="dotsIcon" />
                            </Tooltip>
                          ) : (
                            <span className="textUnassigned">(Unassigned)</span>
                          )}{" "}
                          {competition?.current?.status !== "CONCLUDED" &&
                            placementsEditable && (
                              <div
                                className="placementItemUserCrossIcon"
                                onClick={() => {
                                  item.container = null;
                                  setRender(!render);
                                }}
                              >
                                <CrossNewIcon />
                              </div>
                            )}
                        </div>
                        <div className="placementItemUserPoints">
                          <LeaderBoardThunderBoltIcon />
                          <span className="placementItemUserPointsText">
                            {item.container.score}
                          </span>
                        </div>
                      </div>
                    ) : (
                      placementsEditable && (
                        <div className="placementItemTextbox">
                          <div
                            className="buttonAssign"
                            onClick={() => {
                              setIndex(index);
                              setShowModal(true);
                            }}
                          >
                            Assign ID
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <></>
                );
              })}{" "}
            </>
          )}
        </div>
      </div>
      <ContainerSelectionModal
        isModalVisible={showModal}
        containerState={containerState}
        hideModal={() => setShowModal(false)}
        mentions={mentions}
        index={index}
        onSubmit={(index, data) => {
          mentions.forEach((item, idx) => {
            if (index == idx) {
              item.container = {
                name: data.containerName,
                imageURL: data.imageURL,
                emojiObject: data.emojiObject,
                containerCodes: [data.containerCode],
                score: data.points,
                status: !data.users.length
                  ? "Unassigned"
                  : !!data.users.filter((item) => item.status == "ONBOARDED")
                      .length
                  ? "ONBOARDED"
                  : "INVITED",
              };
            }
          });
        }}
      />
    </div>
  );
};

export default Placements;
