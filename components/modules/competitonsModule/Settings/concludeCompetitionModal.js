import { Avatar, Button, Image, Input, Tooltip, Typography } from "antd";
import React, { useEffect, useState } from "react";
import {
  ArrowBackIcon,
  CrossIcon,
  EditPencilIcon,
  PlusCircleIcon,
} from "../../../../utility/iconsLibrary";
import {
  placementCrownImages,
  placementImage,
  rewardsImage,
} from "../../../../utility/imageConfig";
import AppNameAvater from "../../../AppAvatar/AppNameAvater";
import AppCustomPicker from "../../../AppCustomPicker";
import AppDropDown from "../../../AppDropdown";
import AppModal from "../../../AppModal";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../../../../Redux/Actions";

// remove an element from an array by index
const removeByIndex = (arr, index) => {
  return arr.filter((_, i) => i !== index);
};

const defaultSpecialMentionImage =
  "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673290093255_specialMention.png";

export const ContainersView = ({ placement }) => {
  const UserDropDown = ({ users, container, type = "" }) => {
    return (
      <>
        {users?.length > 1 ? (
          <AppDropDown
            menu={users}
            label={
              <>
                <Avatar
                  src={
                    container?.emojiObject
                      ? container?.emojiObject.emoji
                      : container?.imageURL
                  }
                  icon={
                    container?.emojiObject
                      ? container?.emojiObject.emoji
                      : container?.imageURL
                  }
                />
                <Typography.Text>{container?.containerName}</Typography.Text>
              </>
            }
          />
        ) : (
          <>
            <Avatar
              className=""
              icon={
                container?.emojiObject
                  ? container?.emojiObject.emoji
                  : container?.imageURL
              }
              src={
                container?.emojiObject
                  ? container?.emojiObject.emoji
                  : container?.imageURL
              }
            />

            {type !== "multiple" && (
              <>
                <div className="avatarsPlacementListImageTextbox">
                  <Typography.Text className="avatarsPlacementListImageText">
                    {container?.containerName}
                  </Typography.Text>
                </div>
              </>
            )}
          </>
        )}
      </>
    );
  };
  return (
    <div className="concludeCompetitionModalPlacementTeamOptions">
      <div className="concludeCompetitionModalPlacementTeamAvatars">
        <div className="concludeCompetitionModalPlacementTeamAvatarsWrap">
          {placement?.containers?.map((container, i) => {
            const containerName = container?.containerName;
            const users = container?.users?.length
              ? container?.users?.map((user, i) => {
                  return {
                    label: `${user?.firstName} ${user?.lastName}`,
                    key: i + 1,
                    icon: <AppNameAvater user={user} />,
                  };
                })
              : [{ label: "No users" }];
            return (
              <div key={i} className="avatarsPlacementItem">
                {placement?.containers?.length > 1 ? (
                  <Tooltip
                    title={containerName}
                    trigger={"hover"}
                    placement="top"
                    color={"black"}
                  >
                    <UserDropDown
                      users={users}
                      container={container}
                      type="multiple"
                    />
                  </Tooltip>
                ) : (
                  <>
                    <UserDropDown users={users} container={container} />
                  </>
                )}
              </div>
            );
          })}
        </div>
        <Typography.Text className="avatarsPlacementListImageText points">
          <img
            className="avatarsPlacementListImageTextImage"
            src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1681753595904_bult.png"
            alt=""
          />
          <span className="avatarsPlacementListImageTextNumbers">
            {placement?.containers[0]?.points}
          </span>
          <span className="avatarsPlacementListImageTextPts">pts</span>
        </Typography.Text>
      </div>
    </div>
  );
};

const SelectTeamSpecialMention = ({
  placementsCount,
  sortedContainer,
  setVisibleScreen,
  setPlacemensCount,
  specialPlace,
  setSpecialPlace,
  updatePlacements,
  editSpecialMention,
  setShowSpecial,
  setEditSpecialMention,
}) => {
  const [restContainers, setRestContainers] = useState([]);

  useEffect(() => {
    setRestContainers(sortedContainer);
  }, [placementsCount]);

  const handleAddSpecialMention = (container) => {
    if (editSpecialMention?.isEdit) {
      updatePlacements(
        placementsCount?.placements,
        editSpecialMention?.index,
        {
          ...editSpecialMention.placement,
          containers: [container],
          // rewards: [
          //   {
          //     label: "Slamitt Certificate",
          //     default: true,
          //     key: 4,
          //     imageURL: rewardsImage.certificate,
          //     icon: <Avatar alt="Certificate" src={rewardsImage.certificate} />,
          //     // disabled: isDisable("Certificate"),
          //   },
          // ],
        },
        true
      );
    } else {
      setPlacemensCount({
        placements: [
          ...placementsCount?.placements,
          {
            containers: [container],
            place: specialPlace,
            type: "specialMention",
            imageURL: defaultSpecialMentionImage,
            rewards: [
              {
                label: "Slamitt Certificate",
                default: true,
                key: 4,
                imageURL: rewardsImage.certificate,
                icon: (
                  <Avatar alt="Certificate" src={rewardsImage.certificate} />
                ),
                // disabled: isDisable("Certificate"),
              },
            ],
          },
        ],
        count: placementsCount?.count + 1,
        placementAdded: placementsCount?.placementAdded,
      });
      setShowSpecial(false);
    }
    setSpecialPlace("Special Mention 1");
    setVisibleScreen("placement");
  };
  return (
    <div className="concludeCompetitionModalTeamsBlock">
      <div className="concludeCompetitionModalTeamsBlockHead">
        <Button
          className="buttonBack"
          icon={<ArrowBackIcon />}
          onClick={() => {
            if (!editSpecialMention?.isEdit) {
              setShowSpecial(true);
              setEditSpecialMention({ ...editSpecialMention });
            }
            setVisibleScreen("placement");
          }}
        />
        <Typography.Text>Select a Team (Special Mention) </Typography.Text>
      </div>
      <div className="concludeCompetitionModalTeamsList">
        {restContainers?.map((container, i) => {
          return (
            <div
              onClick={() => handleAddSpecialMention(container, true, i)}
              key={i}
              className="concludeCompetitionModalTeamsListItem"
            >
              {container?.emojiObject ? (
                <p
                  className="competitionTeamsEmoji"
                  style={{ fontSize: "2rem", marginBottom: 0 }}
                >
                  {container?.emojiObject?.emoji}
                </p>
              ) : (
                <Avatar
                  src={
                    container?.imageURL || "https://joeschmoe.io/api/v1/random"
                  }
                />
              )}
              <div className="concludeCompetitionModalTeamInfo">
                <Typography.Text className="concludeCompetitionModalTeamName">
                  {container?.containerName}
                </Typography.Text>
                <Typography.Text className="concludeCompetitionModalTeamPoints">
                  {container?.points.toFixed(2)}
                </Typography.Text>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Phase1 = ({
  sortedContainer,
  placementsCount,
  setPlacemensCount,
  setVisibleScreen,
  setSpecialPlace,
  placeSelect,
  updatePlacements,
  topScores,
  setEditSpecialMention,
  containerCount,
  competition,
  showSpecial,
  setShowSpecial,
  specialPlace,
}) => {
  const [isPlaceEditable, setIsPlaceEditable] = useState({
    edit: false,
    id: null,
  });

  const handleEditPlace = (e, i, placement) => {
    if (e.target.value.length === 0)
      setIsPlaceEditable({ edit: false, id: null });
    else {
      updatePlacements(placementsCount?.placements, i, {
        ...placement,
        containers: [...placement],
        place: e.target.value,
      });
      setIsPlaceEditable({ edit: false, id: null });
    }
  };

  const addPlacement = (containers) => {
    const placements = placementsCount?.placements?.filter((placement) => {
      if (placement?.type === "placement") {
        return placement;
      }
    });
    const specialMention = placementsCount?.placements?.filter((placement) => {
      if (placement?.type === "specialMention") {
        return placement;
      }
    });
    setPlacemensCount({
      placements: [
        ...placements,
        {
          containers,
          place: placeSelect(placementsCount?.placementAdded + 1)?.place,
          type: "placement",
          imageURL: placeSelect(placementsCount?.placementAdded + 1)?.imageURL,
          rewards: [
            {
              label: "Slamitt Certificate",
              default: true,
              key: 4,
              imageURL: rewardsImage.certificate,
              icon: <Avatar alt="Certificate" src={rewardsImage.certificate} />,
              // disabled: isDisable("Certificate"),
            },
          ],
        },
        ...specialMention,
      ],
      count: placementsCount?.count + 1,
      placementAdded: placementsCount?.placementAdded + 1,
    });
  };

  const handleDeletePlacements = (i, isPlacement = false) => {
    const placements = placementsCount?.placements?.filter(
      (placement, index) => {
        if (index !== i) {
          return placement;
        }
      }
    );
    setPlacemensCount({
      placements: placements,
      count: placementsCount?.count - 1,
      placementAdded: isPlacement
        ? placementsCount?.placementAdded - 1
        : placementsCount?.placementAdded,
    });
  };

  const containersMenu = sortedContainer?.map((container, i) => {
    return {
      label: `${container?.containerName} || ${container?.points.toFixed(2)}`,
      value: container?.containerCode,
      key: i,
      icon: <Avatar src={container?.imageURL} />,
    };
  });

  return (
    <div className="concludeCompetitionModalContent">
      <div className="concludeCompetitionModalIntroHead">
        <Image
          width={100}
          preview={false}
          alt="placement icon"
          src={placementImage}
        />
        <Typography.Text className="concludeCompetitionModalIntroHeadTitle">
          Set up Placements
        </Typography.Text>
        <Typography.Text className="concludeCompetitionModalIntroHeadSubtext">
          Placements will be allotted to top{" "}
          {competition?.competitionType === "SOLO" ? "participants" : "teams"}{" "}
          from the qualified List
        </Typography.Text>
      </div>
      <div className="concludeCompetitionModalForm">
        {/* all placements */}
        {placementsCount?.placements?.map((placement, i) => {
          return (
            <div key={i} className="concludeCompetitionModalPlacement">
              {placementsCount?.placements?.length === i + 1 && i !== 0 ? (
                <Button
                  className={`buttonDelete`}
                  icon={<CrossIcon />}
                  onClick={() => {
                    const isPlacement = placement?.type === "placement";
                    handleDeletePlacements(i, isPlacement);
                  }}
                />
              ) : null}
              <div className="concludeCompetitionModalPlacementStats">
                <Avatar
                  className="concludeCompetitionModalPlacementCrownicon"
                  style={{
                    color: "#808080",
                  }}
                  alt="plscements"
                  src={placement?.imageURL}
                />
                {/* placements title and edit placements */}
                <div className="concludeCompetitionModalPlacementholder">
                  {isPlaceEditable.edit && isPlaceEditable.id === i ? (
                    <Input
                      placeholder={placement?.place}
                      autoFocus={true}
                      onBlur={(e) =>
                        handleEditPlace(e, i, placement?.containers)
                      }
                      onPressEnter={(e) =>
                        handleEditPlace(e, i, placement?.containers)
                      }
                    />
                  ) : (
                    <Typography.Text
                      className="concludeCompetitionModalPlacementPosition"
                      onClick={() => setIsPlaceEditable({ edit: true, id: i })}
                    >
                      {placement?.place}
                    </Typography.Text>
                  )}
                </div>
              </div>
              {/* containers inside a placements */}
              <ContainersView placement={placement} />
              {placement?.type === "specialMention" ? (
                <Button
                  onClick={() => {
                    setVisibleScreen("specialMention");
                    setEditSpecialMention({
                      isEdit: true,
                      index: i,
                      placement: placement,
                    });
                  }}
                  className="editButton"
                  icon={<EditPencilIcon />}
                />
              ) : // <AppDropDown
              //   menu={containersMenu}
              //   onClick={(e) => {
              //     const select = containersMenu.find(
              //       (r) => Number(r.key) === Number(e.key)
              //     );
              //     const selectCont = sortedContainer?.find(
              //       (cont) => cont?.containerCode === select?.value
              //     );
              //     updatePlacements(
              //       placementsCount?.placements,
              //       i,
              //       {
              //         ...placement,
              //         containers: [selectCont],
              //       },
              //       true
              //     );
              //   }}
              //   label={
              //     <>
              //       <EditPencilIcon className="editButton" />
              //     </>
              //   }
              // />
              null}
            </div>
          );
        })}
        {
          // special mention adding box
          showSpecial && (
            <div className="concludeCompetitionModalPlacement">
              <div className="concludeCompetitionModalPlacementStats">
                <Avatar
                  className="concludeCompetitionModalPlacementCrownicon specialMention"
                  alt="Special mention"
                  src={defaultSpecialMentionImage}
                />
                <div className="concludeCompetitionModalPlacementholder">
                  <Input
                    autoFocus={true}
                    value={
                      specialPlace !== "Special Mention 1" ? specialPlace : null
                    }
                    onChange={(e) => {
                      if (e.target.value.length > 0) {
                        setSpecialPlace(e.target.value);
                      } else {
                        setSpecialPlace("Special Mention 1");
                      }
                    }}
                    placeholder="Special Mention 1"
                  />
                </div>
              </div>
              <div className="concludeCompetitionModalPlacementTeamOptions">
                <Button
                  className="btn-select"
                  onClick={() => setVisibleScreen("specialMention")}
                >
                  Select a{" "}
                  {competition?.competitionType === "SOLO"
                    ? "participant"
                    : "team"}
                </Button>
                <Button
                  className="buttonDelete"
                  icon={<CrossIcon />}
                  onClick={() => setShowSpecial(false)}
                />
              </div>
            </div>
          )
        }
        {/* buttons for add special mention and placements */}
        <div className="mt-1 cursor-pointer">
          <div className="concludeCompetitionModalButtons">
            {/* add more placements */}
            {placementsCount?.placementAdded < topScores?.length &&
            containerCount !== sortedContainer?.length ? (
              <Button
                className="placementButton"
                onClick={() => {
                  const containers = sortedContainer?.filter((cont) => {
                    if (
                      cont?.points ===
                      topScores[placementsCount?.placementAdded]
                    ) {
                      return cont;
                    }
                  });
                  addPlacement(containers);
                }}
              >
                <span className="plusIcon"></span>
                <Typography.Text>Placement</Typography.Text>
                {/* <PlusCircleIcon /> */}
              </Button>
            ) : null}
            {/* Add special Mentions */}
            <Button
              disabled={showSpecial}
              className="placementButton"
              onClick={() => setShowSpecial(true)}
            >
              <span className="plusIcon"></span>
              <Typography.Text>Special Mention</Typography.Text>
              {/* <PlusCircleIcon /> */}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Phase2 = ({ setVisibleScreen, containers, updatePlacements }) => {
  const competition = useSelector((state) => state.competition);
  const dispatch = useDispatch();

  const handleAddReewards = (reward, i, container) => {
    if (reward.label == "Prize") {
      reward.fixed = "fixedPrize";
    }
    updatePlacements(
      containers,
      i,
      {
        ...container,
        rewards: container?.rewards
          ? [...container?.rewards, ...[reward]]
          : [reward],
      },
      true
    );
  };

  const removePlacements = (rewardIndex, i, container) => {
    const restRewards = container?.rewards?.filter(
      (_, index) => index !== rewardIndex
    );
    updatePlacements(
      containers,
      i,
      {
        ...container,
        rewards: restRewards,
      },
      true
    );
  };

  const handleEditRewards = (rewardIndex, i, container, e) => {
    const newArray = [...container?.rewards];
    newArray[rewardIndex] = {
      ...newArray[rewardIndex],
      ...e,
    };
    updatePlacements(
      containers,
      i,
      {
        ...container,
        rewards: newArray,
      },
      true
    );
  };

  return (
    <div className="concludeCompetitionModalRewardsSetup">
      <Button
        className="buttonBack"
        icon={<ArrowBackIcon />}
        onClick={() => setVisibleScreen("placement")}
      />
      <div className="concludeCompetitionModalIntroHead">
        <Image
          width={100}
          preview={false}
          alt="placement icon"
          src={placementImage}
        />
        <Typography.Text className="concludeCompetitionModalIntroHeadTitle">
          Add Rewards for placements
        </Typography.Text>
      </div>
      {/* rewards for a placement */}
      <div className="concludeCompetitionModalRewardsSetupList">
        {containers?.map((container, i) => {
          console.log("containers2", container);
          const isDisable = (label) =>
            container?.rewards?.find((reward) => {
              if (reward?.label === label) {
                return true;
              } else false;
            });
          const rewaards = [
            {
              label: "Trophy",
              default: true,
              key: 0,
              imageURL: rewardsImage.throphy,
              icon: <Avatar alt="Throphy" src={rewardsImage.throphy} />,
              disabled: isDisable("Trophy"),
            },
            {
              label: "Medal",
              default: true,
              key: 1,
              imageURL: rewardsImage.medel,
              icon: <Avatar alt="Medak" src={rewardsImage.medel} />,
              disabled: isDisable("Medal"),
            },
            {
              label: "Certificate",
              default: true,
              key: 2,
              imageURL: rewardsImage.certificate,
              icon: <Avatar alt="Certificate" src={rewardsImage.certificate} />,
              disabled: isDisable("Certificate"),
            },
            {
              label: "Prize",
              default: false,
              key: 3,
              imageURL: rewardsImage.prize,
              icon: <Avatar alt="Prize" src={rewardsImage.prize} />,
            },
          ];

          const handleImageHandler = (url) => {
            if (
              !url ||
              url ==
                "https://rethink-competitions.s3.amazonaws.com/1673539259785_trophy.png" ||
              url ==
                "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673539308759_medal.png" ||
              url ==
                "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673539099105_certificate.png" ||
              url ==
                "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673539367224_prize.png"
            ) {
              return false;
            } else {
              return true;
            }
          };

          return (
            <div
              className="concludeCompetitionModalRewardsSetupListItem"
              key={i}
            >
              {container?.rewards?.length > 0 ? (
                <div className="concludeCompetitionModalRewardsPlacement">
                  <div className="concludeCompetitionModalRewardsPlacementHead">
                    <div className="concludeCompetitionModalPlacementStats">
                      <Avatar
                        className="concludeCompetitionModalPlacementCrownicon"
                        alt="Placement Image"
                        src={container?.imageURL}
                      />
                      <Typography.Text className="concludeCompetitionModalPlacementPosition">
                        {container?.place}
                      </Typography.Text>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ContainersView placement={container} />
                    </div>
                  </div>
                  <div className="concludeCompetitionModalRewardsPlacementItemsList">
                    {/* <div className="concludeCompetitionModalRewardsPlacementItem relative">
                      {/* <div className="absolute top-1 right-3">
                                    <CrossIcon
                                      className="iconDelete"
                                      onClick={() =>
                                        removePlacements(ri, i, container)
                                      }
                                    />
                                  </div> 
                      <div className="concludeCompetitionModalRewardsPlacementItemBox">
                        <Avatar
                          alt="Prize"
                          src={
                            "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673539099105_certificate.png"
                          }
                          size={40}
                        />
                        <Typography.Text>Slamitt Certificate</Typography.Text>
                      </div>
                    </div> */}
                    {container?.rewards
                      ? container?.rewards?.map((reward, ri) => {
                          return (
                            <>
                              {reward?.default ? (
                                <>
                                  <div
                                    key={ri}
                                    className="concludeCompetitionModalRewardsPlacementItem relative"
                                  >
                                    {reward.key != 4 && (
                                      <div className="absolute top-1 right-3">
                                        <CrossIcon
                                          className="iconDelete"
                                          onClick={() =>
                                            removePlacements(ri, i, container)
                                          }
                                        />
                                      </div>
                                    )}
                                    <div className="concludeCompetitionModalRewardsPlacementItemBox">
                                      <Avatar
                                        alt="Prize"
                                        src={reward?.imageURL}
                                        size={40}
                                      />
                                      <Typography.Text>
                                        {reward?.label}
                                      </Typography.Text>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div
                                  key={ri}
                                  className="concludeCompetitionModalRewardsPlacementItem relative"
                                >
                                  <div className="absolute top-1 right-3">
                                    <CrossIcon
                                      className="iconDelete"
                                      onClick={() =>
                                        removePlacements(ri, i, container)
                                      }
                                    />
                                  </div>
                                  <div className="concludeCompetitionModalRewardsPlacementItemBox">
                                    {/* <Avatar
                                      alt="Prize"
                                      src={reward?.imageURL}
                                      size={40}
                                    /> */}
                                    <div
                                      className={
                                        handleImageHandler(reward?.imageURL)
                                          ? "prizeSection"
                                          : ""
                                      }
                                    >
                                      <AppCustomPicker
                                        defaultImage={reward?.imageURL}
                                        defaultValue={
                                          reward?.emojiObject
                                            ? {
                                                type: "EMOJI",
                                                emoji: reward?.emojiObject,
                                              }
                                            : {
                                                type: "LINK",
                                                url: reward?.imageURL,
                                              }
                                        }
                                        onImageSelected={(e) => {
                                          handleEditRewards(ri, i, container, {
                                            ...reward,
                                            imageURL:
                                              e?.type === "LINK"
                                                ? e?.url !== ""
                                                  ? e?.url
                                                  : rewardsImage.prize
                                                : null,
                                            emojiObject:
                                              e?.type === "EMOJI"
                                                ? e?.emoji
                                                : null,
                                          });
                                        }}
                                      />
                                    </div>
                                    <Typography.Text
                                      editable={{
                                        maxLength: 16,
                                        onChange: (e) => {
                                          handleEditRewards(ri, i, container, {
                                            ...reward,
                                            label: e,
                                          });
                                        },
                                      }}
                                    >
                                      {reward?.label}
                                    </Typography.Text>
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })
                      : null}
                    <AppDropDown
                      menu={rewaards}
                      onClick={(e) => {
                        const selectReward = rewaards.find(
                          (r) => r.key === Number(e.key)
                        );
                        if (selectReward.key === 2) {
                          if (!competition?.current?.certificateConfigured) {
                            dispatch(
                              notify({
                                type: "error",
                                message: "Certificates are not configured.",
                              })
                            );
                            return false;
                          }
                        }
                        handleAddReewards(selectReward, i, container);
                      }}
                      label={
                        <div className="addButton">
                          <PlusCircleIcon />
                          <Typography.Text>Add Here</Typography.Text>
                        </div>
                      }
                    />
                  </div>
                </div>
              ) : (
                // empty rewards container
                <div className="concludeCompetitionModalRewardsSetupListItemInfo">
                  <div className="concludeCompetitionModalRewardsSetupListItemPosition">
                    <Avatar alt="Placement Image" src={container?.imageURL} />
                    <Typography.Text>{container?.place}</Typography.Text>
                  </div>
                  <div className="concludeCompetitionModalRewardsSetupListItemTeamsList">
                    {container?.containers?.length > 1 ? (
                      <div className="concludeCompetitionModalRewardsSetupListItemTeamsList">
                        {container?.containers.map((cont, i) => (
                          <div
                            className="concludeCompetitionModalRewardsSetupListItemTeamsListTeam"
                            key={i}
                          >
                            <Avatar
                              alt="Placement Image"
                              icon={
                                cont?.emojiObject
                                  ? cont?.emojiObject.emoji
                                  : cont?.imageURL
                              }
                              src={
                                cont?.emojiObject
                                  ? cont?.emojiObject.emoji
                                  : cont?.imageURL
                              }
                            />
                            <Typography.Text className="teamName">
                              {cont?.containerName}
                            </Typography.Text>
                            {/* {container?.containers?.length === i + 1 ? null : (
                              <Typography.Text>|</Typography.Text>
                            )} */}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="concludeCompetitionModalRewardsSetupListItemTeamsListTeam">
                        <Avatar
                          alt="Placement Image"
                          icon={
                            container?.containers[0]?.emojiObject
                              ? container?.containers[0]?.emojiObject.emoji
                              : container?.containers[0]?.imageURL
                          }
                          src={
                            container?.containers[0]?.emojiObject
                              ? container?.containers[0]?.emojiObject.emoji
                              : container?.containers[0]?.imageURL
                          }
                        />
                        <Typography.Text className="teamName">
                          {container?.containers[0]?.containerName}
                        </Typography.Text>
                      </div>
                    )}
                  </div>
                  <div className="concludeCompetitionModalRewardsSetupAwardButtons">
                    <Typography.Text className="concludeCompetitionModalRewardsSetupPlaceholder">
                      No rewards have been added for this placement
                    </Typography.Text>
                    <AppDropDown
                      menu={rewaards}
                      onClick={(e) => {
                        const selectReward = rewaards.find(
                          (r) => r.key === Number(e.key)
                        );
                        if (!competition?.current?.certificateConfigured) {
                          dispatch(
                            notify({
                              type: "error",
                              message: "Certificates are not configured.",
                            })
                          );
                          return false;
                        }
                        handleAddReewards(selectReward, i, container);
                      }}
                      label={
                        <div className="concludeCompetitionModalRewardsSetupAddButton">
                          {/* <PlusCircleIcon /> */}
                          <span className="plusIcon"></span>
                          Add Reward
                        </div>
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function ConcludeCompetitionModal({
  isVisible,
  setVisible,
  containers,
  competition,
  setEndCompetitionModalType,
  setIsEndCompetitionModalVisible,
  placementsCount,
  setPlacemensCount,
  placementsData,
  setPlacementsData,
}) {
  let sortedContainer =
    containers && containers?.sort((a, b) => b?.points - a?.points);

  const [visibleScreen, setVisibleScreen] = useState("placement");
  const [specialPlace, setSpecialPlace] = useState("Special Mention 1");
  const [topScores, setTopScores] = useState([]);
  const [containerCount, setContainerCount] = useState(0);
  const [showSpecial, setShowSpecial] = useState(false);
  const [editSpecialMention, setEditSpecialMention] = useState({
    isEdit: false,
    index: null,
    placement: {},
  });

  const getPlacements = async () => {
    if (placementsCount) {
      let prevScore = 0;
      let rank = 1;
      sortedContainer =
        containers && containers?.sort((a, b) => b?.points - a?.points);
      setTopScores(
        [
          ...new Set(
            sortedContainer?.map((cont) => {
              if (!isNaN(cont?.points)) return cont?.points;
            })
          ),
        ].slice(0, 3)
      );
      for await (let container of sortedContainer) {
        if (container.points === prevScore) {
          rank = rank - 1;
        }

        container.rank = rank;
        rank++;
        prevScore = container.points;
      }

      const places = placementsData?.places
        ? placementsData?.places
        : [{ label: "1st Place", isEditable: false, type: "placement" }];
      let newPlaces = places?.slice(0, 3)?.filter((item) => !item.isLocked);
      newPlaces?.forEach((item, index) => {
        item.containers = sortedContainer.filter(
          (item) => item.rank === index + 1
        );
        item.place = item.label.toLowerCase();
        item.imageURL =
          index == 0
            ? placementCrownImages._1stPlacw
            : index == 1
            ? placementCrownImages._2ndPlace
            : index == 2
            ? placementCrownImages._3rdPlace
            : "";
        item.rewards = [
          {
            label: "Slamitt Certificate",
            default: true,
            key: 4,
            imageURL: rewardsImage.certificate,
            icon: <Avatar alt="Certificate" src={rewardsImage.certificate} />,
          },
        ];
      });

      let mentions = places.filter((item) => item.type != "placement");
      mentions.forEach((item, index) => {
        item.imageURL =
          "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673290093255_specialMention.png";
        item.place = `${item.label} ${index + 1}`;
        item.rewards = [
          {
            label: "Slamitt Certificate",
            default: true,
            key: 4,
            imageURL: rewardsImage.certificate,
            icon: <Avatar alt="Certificate" src={rewardsImage.certificate} />,
          },
        ];
        item.containers = sortedContainer.filter(
          ({ containerCode }) => containerCode == item?.containerCodes?.[0]
        );
      });

      setPlacemensCount({
        placements: [...newPlaces, ...mentions],
        count: newPlaces?.length + mentions?.length,
        placementAdded: newPlaces?.length,
      });
    }
  };

  useEffect(() => {
    getPlacements();
  }, [containers, placementsData]);

  // useEffect(() => {
  //   sortedContainer =
  //     containers && containers?.sort((a, b) => b?.points - a?.points);
  //   setTopScores(
  //     [
  //       ...new Set(
  //         sortedContainer?.map((cont) => {
  //           if (!isNaN(cont?.points)) return cont?.points;
  //         })
  //       ),
  //     ].slice(0, 3)
  //   );
  //   const _1stPlace = sortedContainer?.filter((cont) => {
  //     if (cont?.points === topScores[0]) {
  //       return cont;
  //     }
  //   });
  //   if (placementsCount?.count > 1) {
  //     // set
  //   } else {
  //     const firstPlacePlacement = placementsCount.placements.find(
  //       (p) => p.place === "1st place"
  //     );
  //     setPlacemensCount({
  //       placements: [
  //         {
  //           containers: [..._1stPlace],
  //           place: "1st place",
  //           type: "placement",
  //           imageURL: placementCrownImages._1stPlacw,
  //           rewards: firstPlacePlacement?.rewards || [],
  //         },
  //       ],
  //       count: 1,
  //       placementAdded: 1,
  //     });
  //   }
  // }, [containers, isVisible]);

  useEffect(() => {
    const allConts = placementsCount?.placements
      ?.map((plac) => {
        return plac?.containers;
      })
      .flat();
    setContainerCount(allConts?.length);
  }, [placementsCount]);

  const placeSelect = (rank) => {
    switch (rank) {
      case 1:
        return { place: `1st place`, imageURL: placementCrownImages._1stPlacw };
      case 2:
        return { place: `2nd place`, imageURL: placementCrownImages._2ndPlace };
      case 3:
        return { place: `3rd place`, imageURL: placementCrownImages._3rdPlace };
      default:
        return { place: `${rank}th place`, imageURL: "" };
    }
  };

  const updatePlacements = (array, index, value, fromRewards = false) => {
    const setUpdates = () => {
      const newArray = [...array];
      newArray[index] = value;
      setPlacemensCount({
        placements: newArray,
        count: placementsCount?.count,
        placementAdded: placementsCount?.placementAdded,
      });
    };
    if (fromRewards) {
      setUpdates();
    } else if (index < 3) {
      let samePlace = false;
      array?.forEach((place) => {
        if (place?.place.toLowerCase() === value?.place.toLowerCase()) {
          samePlace = true;
        }
      });
      if (samePlace) {
        return;
      } else {
        setUpdates();
      }
    } else {
      setUpdates();
    }
  };

  const screenHandler = (screen) => {
    switch (screen) {
      case "placement":
        return (
          <Phase1
            sortedContainer={sortedContainer}
            placementsCount={placementsCount}
            setPlacemensCount={setPlacemensCount}
            setVisibleScreen={setVisibleScreen}
            setSpecialPlace={setSpecialPlace}
            specialPlace={specialPlace}
            placeSelect={placeSelect}
            updatePlacements={updatePlacements}
            topScores={topScores}
            setEditSpecialMention={setEditSpecialMention}
            containerCount={containerCount}
            competition={competition}
            showSpecial={showSpecial}
            setShowSpecial={setShowSpecial}
          />
        );
      case "specialMention":
        return (
          <SelectTeamSpecialMention
            setVisibleScreen={setVisibleScreen}
            placementsCount={placementsCount}
            sortedContainer={sortedContainer}
            setPlacemensCount={setPlacemensCount}
            specialPlace={specialPlace}
            setSpecialPlace={setSpecialPlace}
            updatePlacements={updatePlacements}
            setEditSpecialMention={setEditSpecialMention}
            editSpecialMention={editSpecialMention}
            setShowSpecial={setShowSpecial}
          />
        );
      case "rewards":
        return (
          <Phase2
            setVisibleScreen={setVisibleScreen}
            containers={placementsCount?.placements}
            updatePlacements={updatePlacements}
          />
        );
    }
  };

  return (
    <AppModal
      className="concludeCompetitionModal"
      isVisible={isVisible}
      onCancel={() => {
        setVisible(false);
        // setPlacemensCount({
        //   placements: [],
        //   count: 1,
        //   placementAdded: 1,
        // });
        setVisibleScreen("placement");
      }}
      footer={
        <>
          {visibleScreen !== "specialMention" ? (
            <div className="concludeCompetitionModalButtonsHolder">
              <Button
                type="secondary"
                onClick={() => {
                  setEndCompetitionModalType("CONCLUDE");
                  setIsEndCompetitionModalVisible(true);
                  setVisible(false);
                }}
              >
                CONCLUDE
              </Button>
              {visibleScreen === "rewards" ? null : (
                <Button
                  disabled={showSpecial}
                  type="primary"
                  onClick={() => {
                    setVisibleScreen("rewards");
                  }}
                >
                  SETUP REWARDS
                </Button>
              )}
            </div>
          ) : null}
        </>
      }
    >
      <div>{screenHandler(visibleScreen)}</div>
    </AppModal>
  );
}
