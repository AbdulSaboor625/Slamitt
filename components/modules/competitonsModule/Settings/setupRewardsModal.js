import { PlusOutlined } from "@ant-design/icons";
import { Button, Image, Input, Modal, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppCustomPicker, AppDropDown, AppSelect } from "../../../";
import { notify } from "../../../../Redux/Actions";
import { rewardsOption } from "../../../../utility/config";
import {
  ArrowBackIcon,
  CrossIcon,
  PlusIcon,
} from "../../../../utility/iconsLibrary";
import {
  concludeFlag,
  prize,
  rewards as rewardsImage,
} from "../../../../utility/imageConfig";

const SetupRewardsModal = ({
  participantsOrTeams,
  isPlacementModalVisible,
  setPlacementModalVisible,
  allContainers,
  competition,
  onConclude,
}) => {
  const [showSetupRewards, setShowSetupRewards] = useState(false);
  const [qualifiedContainers, setQualifiedContainers] = useState([]);
  const [concludeInput, setConcludeInput] = useState("");
  const [rewards, setRewards] = useState({
    placements: [],
    specialMentions: [],
  });
  const [containerNames, setContainerNames] = useState({});
  const [editMode, setEditMode] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (competition && competition.rewards) {
      setRewards({ ...competition.rewards });
    }
  }, [competition]);

  useEffect(() => {
    if (
      qualifiedContainers &&
      qualifiedContainers.length &&
      rewards.placements &&
      !rewards.placements.length
    ) {
      setRewards({
        ...rewards,
        placements: [
          {
            name: "",
            containerCode: qualifiedContainers[0].containerCode,
            position: 1,
            prizes: [],
          },
        ],
      });
    }
  }, [qualifiedContainers]);

  useEffect(() => {
    if (allContainers && allContainers.length) {
      const qualifiedCont = allContainers.filter(
        (container) => container.roomCode === "qualified"
      );

      let allContainerNames = {};
      allContainers.forEach((container) => {
        allContainerNames[container.containerCode] = container.containerName;
      });

      setContainerNames({ ...allContainerNames });
      setQualifiedContainers([...qualifiedCont]);
    }
  }, [allContainers]);

  const _handlePlacementAddition = () => {
    if (rewards && rewards.placements && rewards.placements.length < 3) {
      if (
        qualifiedContainers &&
        qualifiedContainers.length > rewards.placements.length
      ) {
        const newPlacements = [...rewards.placements];
        newPlacements.push({
          name: "",
          containerCode:
            qualifiedContainers[rewards.placements.length].containerCode,
          position: rewards.placements.length + 1,
          prizes: [],
        });
        setRewards({
          placements: newPlacements,
          specialMentions: rewards.specialMentions,
        });
      }
    }
  };

  const _handleSpecialAdditions = () => {
    setRewards({
      ...rewards,
      specialMentions: [
        ...rewards.specialMentions,
        { name: "", containerCode: "", prizes: [] },
      ],
    });
  };

  const _handleUpdatePlacement = ({ index, title, containerCode }) => {
    const updatePlacements = rewards.placements;
    if (containerCode) {
      updatePlacements[index] = { ...updatePlacements[index], containerCode };
      setRewards({ ...rewards, placements: updatePlacements });
    } else if (title) {
      updatePlacements[index] = { ...updatePlacements[index], name: title };
      setRewards({ ...rewards, placements: updatePlacements });
    }
  };

  const _handleUpdateSpecialMentions = ({ index, title, containerCode }) => {
    const updateSpecialMentions = rewards.specialMentions;
    if (containerCode) {
      updateSpecialMentions[index] = {
        ...updateSpecialMentions[index],
        containerCode,
      };
      setRewards({ ...rewards, specialMentions: updateSpecialMentions });
    } else if (title) {
      updateSpecialMentions[index] = {
        ...updateSpecialMentions[index],
        name: title,
      };
      setRewards({ ...rewards, specialMentions: updateSpecialMentions });
    }
  };

  const _handleChangeSetupRewards = () => {
    const updateRewards = rewards;
    updateRewards.placements.forEach((placement) => {
      if (!placement.name) {
        if (placement.position === 1) placement.name = "1st Place";
        else if (placement.position === 2) placement.name = "2nd Place";
        else if (placement.position === 3) placement.name = "3rd Place";
      }
    });
    updateRewards.specialMentions.forEach((specialMention, index) => {
      if (!specialMention.name) {
        specialMention.name = `Special Mention ${index + 1}`;
      }
    });

    updateRewards.placements = updateRewards.placements.filter(
      ({ containerCode, name }) => containerCode && name
    );
    updateRewards.specialMentions = updateRewards.specialMentions.filter(
      ({ containerCode, name }) => containerCode && name
    );

    setRewards({
      ...updateRewards,
    });

    setShowSetupRewards(true);
  };

  const handleRemoveReward = (index, isSpecialMention) => {
    if (isSpecialMention) {
      setRewards({
        placements: rewards.placements,
        specialMentions: [
          ...rewards.specialMentions.filter((sm, i) => i !== index),
        ],
      });
    } else {
      setRewards({
        placements: [...rewards.placements.filter((sm, i) => i !== index)],
        specialMentions: rewards.specialMentions,
      });
    }
  };

  const RewardInput = ({
    reward,
    updateReward,
    containers,
    placeholder,
    index,
    isSpecialMention,
  }) => (
    <>
      <div className="placementFormInput" key={index}>
        <Input
          bordered={false}
          placeholder={placeholder || "Enter position"}
          addonAfter={
            <Typography.Text className="selctOptions">
              {`Goes to:  ${
                isSpecialMention ? "" : containerNames[reward.containerCode]
              }`}
              {isSpecialMention && (
                <AppSelect
                  option={containers}
                  placeholder={`Select ${
                    competition.competitionType === "SOLO"
                      ? "participant"
                      : "team"
                  }`}
                  bordered={false}
                  showArrow={false}
                  value={containerNames[reward.containerCode] || null}
                  onChange={(value) =>
                    updateReward({
                      index: index,
                      containerCode: value,
                    })
                  }
                />
              )}
            </Typography.Text>
          }
          onPressEnter={(e) =>
            updateReward({ index: index, title: e.target.value })
          }
          onBlur={(e) => updateReward({ index: index, title: e.target.value })}
          defaultValue={reward.name}
        />
      </div>
      {(reward.position !== 1 || isSpecialMention) && (
        <Typography.Link
          onClick={() => handleRemoveReward(index, isSpecialMention)}
        >
          Remove
        </Typography.Link>
      )}
    </>
  );

  const PlacementsInput = () => {
    const alreadyAssignedContainers = [
      ...rewards.placements.map((p) => p.containerCode),
      ...rewards.specialMentions.map((s) => s.containerCode),
    ];

    return (
      <>
        {rewards.placements.map((placement, index) => (
          <RewardInput
            isSpecialMention={false}
            key={index}
            reward={placement}
            placeholder={`${
              placement.position === 1
                ? `1st`
                : placement.position === 2
                ? `2nd`
                : placement.position === 3
                ? `3rd`
                : ""
            } place`}
            updateReward={_handleUpdatePlacement}
            containers={qualifiedContainers.filter(
              ({ containerCode }) =>
                !rewards.placements.find(
                  (p) => p.containerCode === containerCode
                )
            )}
            index={index}
          />
        ))}

        {rewards.placements &&
          rewards.placements.length < 3 &&
          qualifiedContainers &&
          qualifiedContainers.length > rewards.placements.length && (
            <div
              style={{ cursor: "pointer" }}
              className="specicalButton"
              onClick={_handlePlacementAddition}
            >
              <Typography.Title className="subheading" level={5}>
                Add another placement
              </Typography.Title>
              <PlusOutlined />
            </div>
          )}

        <div
          style={{ cursor: "pointer" }}
          className="specicalButton"
          onClick={_handleSpecialAdditions}
        >
          <Typography.Title className="subheading" level={5}>
            Add a special mention
          </Typography.Title>
          <PlusOutlined />
        </div>

        {rewards.specialMentions.map((specialMention, index) => (
          <RewardInput
            isSpecialMention={true}
            key={index}
            placeholder={`Special Mention ${index + 1}`}
            reward={specialMention}
            updateReward={_handleUpdateSpecialMentions}
            containers={allContainers.filter(
              (c) => !alreadyAssignedContainers.includes(c.containerCode)
            )}
            index={index}
          />
        ))}
      </>
    );
  };

  const RewardsModule = ({ prizes, containerCode, title, onSave }) => {
    const [modRewardsOption, setModRewardsOption] = useState([
      ...rewardsOption,
    ]);
    const [rewardsCardList, setShowRewardsCardList] = useState([]);

    useEffect(() => {
      if (editMode && prizes && prizes.length) {
        const assignedPrizes = prizes.map((p) => {
          if (p.name === "Trophy")
            return { ...p, id: 1, label: p.name, image: p.imageURL };
          else if (p.name === "Medal")
            return { ...p, id: 2, label: p.name, image: p.imageURL };
          else if (p.name === "Certificate")
            return { ...p, id: 3, label: p.name, image: p.imageURL };
          else
            return {
              ...p,
              id: 4,
              label: p.name,
              image: p.imageURL,
              emojiObject: p.emojiObject,
            };
        });

        const removeIds = [...new Set(assignedPrizes.map((p) => p.id))];

        setShowRewardsCardList([...assignedPrizes]);
        setModRewardsOption(
          modRewardsOption.filter(
            (item) => item.id === 4 || !removeIds.includes(item.id)
          )
        );
      }
    }, [editMode]);

    const _handleAddRewardCard = (e) => {
      const rewardSelected = modRewardsOption[e.key];
      if (rewardSelected.id != 4)
        if (rewardSelected.id != 4)
          setModRewardsOption(
            modRewardsOption.filter((item) => item.id !== rewardSelected.id)
          );
      setShowRewardsCardList([...rewardsCardList, rewardSelected]);
    };
    const _removeReward = (reward) => {
      const filteredRewards = rewardsCardList.filter(
        (item) => item.id !== reward.id
      );
      if (reward.id === 4) {
        reward.label = "Prize";
        reward.image = prize;
      }
      setShowRewardsCardList(filteredRewards);
      setModRewardsOption([...modRewardsOption, reward]);
    };

    const _editPrizeDetails = (val, type) => {
      const newVal = JSON.parse(JSON.stringify(rewardsCardList));
      const editCardList = newVal.map((item) => {
        if (item.id === 4) {
          if (type === "LABEL") {
            item.label = val;
          } else if (type === "EMOJI") {
            item.emojiObject = val.emoji;
            item.image = null;
          } else if (type === "IMAGE") {
            item.image = val.url;
            item.emojiObject = null;
          }
        }
        return item;
      });
      setShowRewardsCardList(editCardList);
    };

    const _onSave = () => {
      const prizes = [];
      rewardsCardList.forEach((item) => {
        const temp = {};
        temp.name = item.label;
        if (item.emojiObject) temp.emojiObject = item.emojiObject;
        else temp.imageURL = item.image;
        prizes.push(temp);
      });
      onSave(prizes, containerCode);
      setEditMode("");
    };

    return editMode === containerCode ? (
      <div className="placementsModalPositionBox">
        <div className="placementsModalEditBox">
          <div className="placementsModalEditBoxHead">
            <Typography.Text className="placementsModalBoxTitle">
              {title}
            </Typography.Text>
            <Typography.Text className="placementsModalBoxText">
              Goes to:{" "}
              <span className="code">
                {containerNames[containerNames[containerCode]]}
              </span>
            </Typography.Text>
          </div>
          <div className="placementsModalRewardsRow">
            {rewardsCardList.map((reward) => (
              <div className="placementsModalRewardBox" key={reward.id}>
                <div className="placementsModalRewardBoxDel">
                  <Button
                    icon={<CrossIcon />}
                    type="text"
                    className="buttonDelete"
                    onClick={() => _removeReward(reward)}
                  />
                </div>
                <div className="placementsModalRewardItem">
                  {reward.id === 4 ? (
                    <AppCustomPicker
                      onImageSelected={(image) =>
                        _editPrizeDetails(image, image.type)
                      }
                      defaultValue={{
                        type: reward.image ? "LINK" : "EMOJI",
                        url: reward?.image || "",
                        emoji: reward?.emojiObject || "",
                      }}
                    />
                  ) : (
                    <Image src={reward.image} alt="reward" preview={false} />
                  )}
                  <p
                    contentEditable={reward.id === 4}
                    onBlur={(e) =>
                      _editPrizeDetails(e.target.innerText, "LABEL")
                    }
                  >
                    {reward.label}
                  </p>
                </div>
              </div>
            ))}
            <div className="placementsModalRewardBox">
              <AppDropDown
                menu={modRewardsOption}
                label={
                  <div className="flex flex-col justify-between items-center cursor-pointer">
                    <PlusIcon className="plusIcon" />
                    <Typography.Text>Add Here</Typography.Text>
                  </div>
                }
                onClick={(e) => _handleAddRewardCard(e)}
              />
            </div>
          </div>
          <div className="placementsModalEditBoxFoot">
            <Button className="linkCancle" type="text" onClick={_onSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    ) : (
      <div
        className="placementsModalPositionBox"
        onClick={() => {
          if (editMode) {
            dispatch(
              notify({
                type: "info",
                message: "Please save changes first!",
              })
            );
          } else {
            setEditMode(containerCode);
          }
        }}
      >
        {prizes.length ? (
          <div className="placementsModalAchivements">
            <div className="placementsModalInfoBox">
              <Typography.Text className="placementsModalBoxText">
                Goes to:{" "}
                <span className="code">{containerNames[containerCode]}</span>
              </Typography.Text>
              <Typography.Text className="placementsModalBoxTitle">
                {title}
              </Typography.Text>
            </div>
            <div className="placementsModalRewardsBox">
              {prizes.map((reward, i) =>
                reward.imageURL ? (
                  <Image
                    key={i}
                    src={reward.imageURL}
                    alt="reward"
                    preview={false}
                    // className="mr-2"
                  />
                ) : (
                  <p
                    key={i}
                    className="emojiIcon"
                    style={{ fontSize: "2rem", marginBottom: 0 }}
                  >
                    {reward.emojiObject.emoji}
                  </p>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="placementsModalBoxWrap">
            <PlusIcon className="plusIcon" />
            <div className="placementsModalBoxTextbox">
              <Typography.Title className="placementsModalBoxTitle" level={5}>
                {title}
              </Typography.Title>
              <Typography.Text className="placementsModalBoxText">
                Goes To:{" "}
                <span className="code">{containerNames[containerCode]}</span>
              </Typography.Text>
            </div>
          </div>
        )}
      </div>
    );
  };

  let allowConclude = false;
  if (
    rewards.placements.length >= 1 &&
    !rewards.placements.filter(({ containerCode }) => !containerCode).length &&
    !rewards.specialMentions.filter(({ containerCode }) => !containerCode)
      .length
  )
    allowConclude = true;

  return (
    <Modal
      className="placementsModal"
      visible={isPlacementModalVisible}
      onCancel={() => {
        setPlacementModalVisible(false);
        onConclude({ rewards });
      }}
      onOk={() => {
        setPlacementModalVisible(false);
        onConclude({ rewards });
      }}
      destroyOnClose={true}
      footer={null}
    >
      <div className="modalHeader">
        <Image
          className="placementImage"
          alt="rewards"
          src={rewardsImage}
          height={107}
          width={122}
          preview={false}
        />
        {showSetupRewards ? (
          <div className="placementsModalTitle">
            <ArrowBackIcon
              onClick={() => setShowSetupRewards(false)}
              style={{ cursor: "pointer", marginRight: "15px" }}
            />
            <Typography.Title className="modalTitle" level={3}>
              Reward your {participantsOrTeams}
            </Typography.Title>
          </div>
        ) : (
          <Typography.Title className="modalTitle" level={3}>
            Set up Placements
          </Typography.Title>
        )}
        {/* <Typography.Text className="modalSubtitle">
          Size up your placements
        </Typography.Text> */}
        <Typography.Text className="modalSubtext">
          Placements will be allotted to Top {participantsOrTeams} from the
          qualified List
        </Typography.Text>
      </div>
      <div className="placementForm">
        {showSetupRewards ? (
          <>
            <div className="placementsModalPosition">
              {rewards.placements.map((item, index) => (
                <RewardsModule
                  key={index}
                  containerCode={item.containerCode}
                  title={item.name}
                  prizes={item.prizes}
                  onSave={(prizes, containerCode) => {
                    const updatePlacements = rewards.placements;
                    updatePlacements.forEach((e) => {
                      if (e.containerCode === containerCode) {
                        e.prizes = prizes;
                      }
                    });
                    setRewards({ ...rewards, placements: updatePlacements });
                  }}
                />
              ))}
            </div>
            <div className="specialMentionBlock">
              {rewards.specialMentions &&
                rewards.specialMentions.length !== 0 && (
                  <Typography.Title
                    className="specialMentionBlockTitle"
                    level={5}
                  >
                    Special Mention
                  </Typography.Title>
                )}
              {rewards.specialMentions.map((item, index) => (
                <RewardsModule
                  prizes={item.prizes}
                  key={index}
                  containerCode={item.containerCode}
                  title={item.name}
                  onSave={(prizes, containerCode) => {
                    const updateSpecialMentions = rewards.specialMentions;
                    updateSpecialMentions.forEach((e) => {
                      if (e.containerCode === containerCode) {
                        e.prizes = prizes;
                      }
                    });
                    setRewards({
                      ...rewards,
                      specialMentions: updateSpecialMentions,
                    });
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <PlacementsInput />
        )}
      </div>
      <div className="placementsModalFooter">
        {showSetupRewards && (
          <>
            <Typography.Title className="placementsModalFooterTitle" level={5}>
              Type CONCLUDE to end this Competition
            </Typography.Title>
            <Typography.Text className="placementsModalFooterText">
              All Profiles will be updated and notified about placement results
            </Typography.Text>
          </>
        )}
        <div className="buttonHolder">
          {/* <Button type="default" disabled={!allowConclude} onClick={onConclude}>
            CONCLUDE
          </Button> */}
          {showSetupRewards ? (
            <Input
              value={concludeInput}
              onChange={(e) => setConcludeInput(e.target.value)}
              // style={{ height: "2.5rem" }}
              size="small"
              placeholder="CONCLUDE"
              suffix={
                <Button
                  className={
                    concludeInput.toLowerCase() === "conclude"
                      ? "concludeCompetition"
                      : ""
                  }
                  type="primary"
                  disabled={concludeInput.toLowerCase() !== "conclude"}
                  onClick={() => {
                    onConclude({ rewards, status: "CONCLUDED" });
                  }}
                >
                  <Image
                    preview={false}
                    src={concludeFlag}
                    alt="conclude button"
                  />
                </Button>
              }
            />
          ) : (
            <Button
              type="primary"
              disabled={!allowConclude}
              onClick={_handleChangeSetupRewards}
            >
              SETUP REWARDS
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SetupRewardsModal;
