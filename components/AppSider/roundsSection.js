import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown, Image, Input, Menu, Spin, Typography } from "antd";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ScrollHandle,
  changeRoundCategory,
  createRound,
  dragandDropRounds,
  getSingleRound,
  notify,
  setRoundStatus,
  updateCompetitionDetails,
  updateRound,
} from "../../Redux/Actions";
import Api from "../../services";
import { capitalize, getUniqueId } from "../../utility/common";
import { CONTAINER_ROUND_CODE_LIMIT, roundStatus } from "../../utility/config";
import {
  ArrowDownIcon,
  CrossIcon,
  SearchIcon,
} from "../../utility/iconsLibrary";
import { round } from "../../utility/imageConfig";
import AppRoundCard from "../AppRoundCard";
import AssignJudgesModal from "../modules/competitonsModule/Rounds/AssignJudgesModal";
import SortableList, { SortableItem, SortableKnob } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";

const RoundsSection = ({
  readOnlyState,
  setDetailsOpen,
  isLaunchCompetitionModalOpen,
  setFetchData,
}) => {
  const inputRef = useRef();
  const [roundName, setRoundName] = useState("");
  const competition = useSelector((state) => state.competition);
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [allRounds, setAllRounds] = useState(
    competition.allRounds.sort((a, b) => b.sortingOrder - a.sortingOrder)
  );
  const [roundOptionClicked, setRoundOptionClicked] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [openSearch, setOpenSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const rooms = useSelector((state) => state.rooms.all);
  const antIcon = <LoadingOutlined style={{ fontSize: 22 }} spin />;

  const selectedRoundCat = useSelector(
    (state) => state.roundCategory.roundCategory
  );

  // const [selectedRoundCat, setSelectedRoundCat] = useState(selectedRoundCate);
  const router = useRouter();

  const onRoundOptionSelection = (round, option) => {
    setRoundOptionClicked(round);
    if (option === "invite") {
      setIsModalVisible(true);
    } else if (option === "draft") {
      if (round?.roundCode === competition?.round?.details?.roundCode)
        dispatch(setRoundStatus({ status: roundStatus.DRAFT }));
      dispatch(
        updateRound({
          isLive: false,
          competitionRoundCode: round.competitionRoundCode,
        })
      );
    } else if (option === "live") {
      if (round?.roundCode === competition?.round?.details?.roundCode)
        dispatch(setRoundStatus({ status: roundStatus.LIVE }));
      dispatch(
        updateRound({
          isLive: true,
          competitionRoundCode: round.competitionRoundCode,
        })
      );
    } else if (option === "reset") {
      if (round.isLive) {
        dispatch(notify({ message: "Cannot reset live round", type: "error" }));
        return;
      }
      dispatch(
        updateRound({
          criteria: [],
          competitionRoundCode: round.competitionRoundCode,
        })
      );
    }
  };

  const onRoundClicked = (round, id) => {
    dispatch(getSingleRound(round));
    setDetailsOpen(true);
    router.push(
      `/auth/competitions/o/${competition?.current?.competitionCode}?content=round&compRoundCode=${round?.competitionRoundCode}`
    );
    console.log("scrolling........");
    dispatch(ScrollHandle(id));
  };

  const { scrollState } = useSelector((state) => state.pageHandler);

  useEffect(() => {
    if (scrollState) {
      const targetDiv = document.getElementById(scrollState);
      if (targetDiv) {
        targetDiv.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [scrollState]);

  const _addJudge = async (judge) => {
    judge.competitionRoundCode = roundOptionClicked.competitionRoundCode;
    try {
      const response = await Api.post(`/judge/invite-judge`, judge);
      if (response.code && response.result) {
        if (
          competition.round.details.roundCode === roundOptionClicked.roundCode
        )
          dispatch(getSingleRound(roundOptionClicked));
        dispatch(
          notify({
            type: "success",
            message: response.message,
          })
        );
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
  };

  const findCompleteRounds = () => {
    const complereRounds =
      competition?.allRounds &&
      competition?.allRounds.filter((round) => {
        const { Judges } = round;
        if (round.type === "MOCK" && round.isLive) return round;
        if (Judges.length > 0) {
          const completeJudges = Judges.filter(
            (judge) => judge.status === "JUDGED"
          );
          if (completeJudges.length === Judges.length) {
            return round;
          }
        }
      });
    return complereRounds;
  };

  const findLiveRounds = () => {
    const allRounds = competition.allRounds.filter((round) => round.isLive);
    const completeRound = findCompleteRounds();
    return allRounds.filter((item) => {
      return !completeRound.some((item2) => {
        return item2.roundCode === item.roundCode;
      });
    });
  };

  const findListWiseRounds = (listCode) => {
    const listWiseRounds = competition?.allRounds.filter(
      (round) => round?.assignedRoomCode === listCode
    );
    if (listCode === "all") return competition?.allRounds;
    return listWiseRounds;
  };

  const searchRounds = (text) => {
    if (!text) setAllRounds(competition.allRounds);
    const searchRounds = competition?.allRounds.filter((round) =>
      round?.roundName.toLowerCase().includes(text.toLowerCase())
    );
    setAllRounds(searchRounds);
  };

  useEffect(() => {
    switch (selectedRoundCat) {
      case "all":
        setAllRounds(competition?.allRounds);
        break;
      case "live":
        setTimeout(() => {
          setAllRounds(findLiveRounds());
        }, 0);
        break;
      case "draft":
        setTimeout(() => {
          setAllRounds(
            competition?.allRounds.filter((round) => !round?.isLive)
          );
        }, 0);
        break;
      case "complete":
        setTimeout(() => {
          setAllRounds(findCompleteRounds());
        }, 0);
        break;
    }
  }, [selectedRoundCat]);

  useEffect(() => {
    setAllRounds(findListWiseRounds(selectedRoom));
  }, [selectedRoom]);

  const categories = [
    { label: "All Rounds", value: "all" },
    { label: "Draft", value: "draft" },
    { label: "Live", value: "live" },
    { label: "Complete", value: "complete" },
  ];

  const compLists = rooms?.map((room) => {
    return {
      label: `${room.roomName}`,
      value: room.roomCode,
    };
  });
  const allList = [{ label: "All lists", value: "all" }, ...compLists];

  const categorieList = () => {
    const list = categories.map((cat) => {
      return (
        <Menu.Item
          key={cat.value}
          onClick={() => {
            // setSelectedRoundCat(cat.value);
            dispatch(changeRoundCategory(cat.value));
          }}
        >
          {cat.label}
        </Menu.Item>
      );
    });
    return <Menu>{list}</Menu>;
  };

  const roomLists = () => {
    const list = allList.map((room) => {
      return (
        <Menu.Item
          key={room.value}
          onClick={() => {
            setSelectedRoom(room?.value);
          }}
        >
          {room.label}
        </Menu.Item>
      );
    });
    return <Menu>{list}</Menu>;
  };

  const RoundCategoris = () => {
    const active = categories.find((cat) => cat.value === selectedRoundCat);
    return (
      <Dropdown
        overlay={categorieList}
        trigger={["click"]}
        placement="bottomLeft"
        arrow={{ pointAtCenter: true }}
      >
        <a className="ant-dropdown-link">
          {active?.label} <ArrowDownIcon />
        </a>
      </Dropdown>
    );
  };

  const RoomsDropdoen = () => {
    const active = allList.find((room) => room?.value === selectedRoom);
    return (
      <Dropdown
        overlay={roomLists}
        trigger={["click"]}
        placement="bottomLeft"
        arrow={{ pointAtCenter: true }}
      >
        <a className="ant-dropdown-link">
          {active?.label} <ArrowDownIcon />
        </a>
      </Dropdown>
    );
  };

  const createRoundPermisson = true;
  if (competition.current?.crewUser) {
    createRoundPermisson =
      competition.current?.crewUser?.permissions.createRounds;
  }

  const [isListModified, setIsListModified] = useState(false);
  const [oldIndex, setOldIndex] = useState(0);
  const [newIndex, setNewIndex] = useState(0);

  const onSortEnd = (oldIndex, newIndex) => {
    setOldIndex(oldIndex);
    setNewIndex(newIndex);
    setAllRounds((array) => arrayMoveImmutable(array, oldIndex, newIndex));
    setIsListModified(true);
  };

  const saveRearrangment = () => {
    dispatch(dragandDropRounds(allRounds));
    setIsListModified(false);
  };

  return (
    <div className="competitionSidebarContent">
      {!readOnlyState && (
        <div className="competitionCodeField">
          <Typography.Text className="competitionCodeFieldLabel">
            Add Rounds
          </Typography.Text>
          <div className="competitionCodeFieldWrap">
            <Input
              onInput={(e) => (e.target.value = capitalize(e.target.value))}
              // autoFocus={!isLaunchCompetitionModalOpen}
              className="inputstyle"
              type={"text"}
              placeholder="Round01"
              // prefix={<AimOutlined />}
              prefix={
                <Image
                  src="https://rethink-competitions.s3.amazonaws.com/1668021156767_round_icon.png"
                  alt=""
                />
              }
              value={roundName}
              disabled={!createRoundPermisson}
              ref={inputRef}
              maxLength={CONTAINER_ROUND_CODE_LIMIT}
              suffix={
                loading ? (
                  <Spin indicator={antIcon} />
                ) : (
                  <Button
                    icon={<PlusOutlined />}
                    type="text"
                    disabled={!roundName}
                    onClick={async () => {
                      setLoading(true);
                      await dispatch(
                        createRound({
                          roundName,
                          _id: getUniqueId(),
                          competitionCode:
                            competition?.current?.competitionCode,
                          type: "GENERAL",
                        })
                      );
                      setRoundName("");
                      setLoading(false);
                    }}
                  />
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && roundName) {
                  dispatch(
                    createRound({
                      roundName,
                      _id: getUniqueId(),
                      competitionCode: competition?.current?.competitionCode,
                      type: "GENERAL",
                      index: 1,
                    })
                  );
                  setRoundName("");
                }
              }}
              onChange={(e) => {
                setRoundName(e.target.value.trimStart());
              }}
            />
          </div>
        </div>
      )}
      {Boolean(competition.allRounds.length) ? (
        <div className="competitionQualifiedDropdown">
          <div className="competitionSidebarDropdowns">
            <RoundCategoris />
            <RoomsDropdoen />
          </div>
          {!openSearch ? (
            <Button
              type="text"
              className="participantsButtonSearch"
              onClick={() => setOpenSearch(true)}
              icon={<SearchIcon />}
            />
          ) : (
            <Button
              type="text"
              className="participantsButtonSearch"
              onClick={() => {
                searchRounds("");
                setOpenSearch(false);
              }}
              icon={<CrossIcon />}
            />
          )}
        </div>
      ) : null}
      {openSearch && (
        <div className="participantsTeamSearchBox">
          <Input
            className="inputstyle"
            placeholder="Search For round"
            onChange={(e) => searchRounds(e.target.value)}
          />
        </div>
      )}

      {Boolean(competition.allRounds.length) ? (
        <div className="roundCardScroller">
          <div className="">
            {allRounds?.length > 0 ? (
              <>
                {competition.status !== "CONCLUDED" ? (
                  <SortableList
                    className="roundCard-wrapper"
                    draggedItemClassName="dragged"
                    onSortEnd={onSortEnd}
                  >
                    {allRounds?.map((round, index) => (
                      <SortableItem key={index}>
                        <div className="item roundCard-item">
                          <SortableKnob>
                            <AppRoundCard
                              readOnlyState={readOnlyState}
                              round={round}
                              key={round?.roundCode}
                              id={round?.roundCode}
                              onRoundClicked={onRoundClicked}
                              cardColor={index + 1}
                              onRoundOptionSelection={onRoundOptionSelection}
                              activeRoundCode={
                                competition?.round?.details?.roundCode ===
                                round?.roundCode
                              }
                            />
                          </SortableKnob>
                        </div>
                      </SortableItem>
                    ))}
                  </SortableList>
                ) : (
                  allRounds?.map((round, index) => (
                    <AppRoundCard
                      readOnlyState={readOnlyState}
                      round={round}
                      key={round?.roundCode}
                      id={round?.roundCode}
                      onRoundClicked={onRoundClicked}
                      cardColor={index + 1}
                      onRoundOptionSelection={onRoundOptionSelection}
                      activeRoundCode={
                        competition?.round?.details?.roundCode ===
                        round?.roundCode
                      }
                    />
                  ))
                )}
                {isListModified && (
                  <button
                    className="saveChangesFloatingBox"
                    onClick={saveRearrangment}
                  >
                    <Typography.Text className="saveChangesFloatingBoxTitle">
                      Save Changes{" "}
                    </Typography.Text>
                  </button>
                )}
              </>
            ) : (
              <div className="competitionPlaceholderBox roundPlaceholder">
                <Image
                  preview={false}
                  src={
                    // "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1669274084080_noRounds.png"
                    "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1670353926175_noround.png"
                  }
                  alt="img"
                  height={200}
                  width={200}
                />
                <br />
                <Typography.Text className="competitionPlaceholderBoxText">
                  No rounds found
                </Typography.Text>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="competitionPlaceholderBox roundPlaceholder">
          <Image
            preview={false}
            src={round}
            alt="img"
            height={200}
            width={200}
          />
          <br />
          <Typography.Text className="competitionPlaceholderBoxText">
            All your rounds will appear here
          </Typography.Text>
        </div>
      )}
      <AssignJudgesModal
        isVisible={isModalVisible}
        setVisible={setIsModalVisible}
        competitionRoundCode={roundOptionClicked?.competitionRoundCode}
        addJudge={_addJudge}
        round={roundOptionClicked}
      />
    </div>
  );
};

export default RoundsSection;
