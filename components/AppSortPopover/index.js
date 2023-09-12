import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckSquareOutlined,
  LeftOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import { Button, Input, Popover, Typography } from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useMediaQuery from "../../hooks/useMediaQuery";
import {
  rearrangeContainers,
  selectContainers,
  setSelectionOfContainers,
} from "../../Redux/Actions";

import {
  CheckNewIcon,
  SortingIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  LowToHighIcon,
  HighToLowIcon,
} from "../../utility/iconsLibrary";
import AppModal from "../AppModal";

const AppSortPopOver = ({
  readOnlyState,
  children,
  containers,
  setContainers,
  handleCancelSelection,
  setisContainerListRerranged,
  crewUser,
  role,
  menuActive,
  setMenuActive,
  filter,
  setFilter,
  setPage,
}) => {
  const sortType = {
    ASCENDING: "ASCENDING",
    DESCENDING: "DESCENDING",
  };
  const dispatch = useDispatch();
  const [isShow, setShowing] = useState({
    points: false,
    rank: false,
  });
  const [isabove, setIsAbove] = useState(true);
  const [isTop, setIsTop] = useState(false);

  const [data, setData] = useState({
    points: 0,
    ranking: 0,
  });
  const [openSelectModal, setOpenSelectModal] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  // ranking scoring method
  const getTotalScoreOfaSingleContainer = (container) => {
    // const scores = container?.roundScores;
    // const total = 0;
    // if (!scores) {
    //   scores = { default: 0 };
    // }
    // const points = Object.values(scores);
    // for (let i of points) {
    //   total += i;
    // }
    return Number(container?.points);
  };
  const allContainerPoints = containers.map((container) => {
    const total = getTotalScoreOfaSingleContainer(container);
    return total;
  });
  const handleSelection = (type, value = null, above) => {
    if (type === "ALL") {
      dispatch(setSelectionOfContainers());
      const selected = containers.map((container) => ({
        ...container,
        isSelected: true,
      }));
      setContainers(selected);
      dispatch(selectContainers(selected));
    } else if (type === "ASSIGNED") {
      dispatch(setSelectionOfContainers());
      const selected = containers.map((container) => {
        if (container?.users?.length > 0) {
          container.isSelected = true;
        }
        return container;
      });
      setContainers(selected);
      dispatch(selectContainers(selected));
    } else if (type === "UNASSIGNED") {
      dispatch(setSelectionOfContainers());
      const selected = containers.map((container) => {
        if (container?.users?.length === 0) {
          container.isSelected = true;
        }
        return container;
      });
      setContainers(selected);
      dispatch(selectContainers(selected));
    } else if (type === "MANUALLY") {
      dispatch(setSelectionOfContainers());
    } else if (type === "POINTS") {
      dispatch(setSelectionOfContainers());
      const selected = containers.map((container) => {
        if (above) {
          if (container.points >= value) {
            container.isSelected = true;
          }
        } else if (!above) {
          if (container.points <= value) {
            container.isSelected = true;
          }
        }
        return container;
      });
      setContainers(selected);
      dispatch(selectContainers(selected));
    } else if (type === "RANKING") {
      dispatch(setSelectionOfContainers());
      if (isTop) {
        const sortedPoints = [...allContainerPoints].sort((a, b) => b - a);
        const top = [...new Set(sortedPoints)][value - 1];
        const selected = containers.map((container) => {
          const pointsTotal = getTotalScoreOfaSingleContainer(container);
          if (pointsTotal >= top) {
            container.isSelected = true;
          }
          return container;
        });
        // const sorted = [...containers]
        //   .sort((a, b) => b.points - a.points)
        //   .slice(0, value);
        // const selected = containers.map((container) => {
        //   sorted.forEach((sortedContainer) => {
        //     if (container.containerCode === sortedContainer.containerCode) {
        //       container.isSelected = true;
        //     }
        //   });
        //   return container;
        // });
        setContainers(selected);
        dispatch(selectContainers(selected));
      } else {
        const sortedPoints = [...allContainerPoints].sort((a, b) => a - b);
        const top = [...new Set(sortedPoints)][value - 1];
        const selected = containers.map((container) => {
          const pointsTotal = getTotalScoreOfaSingleContainer(container);
          if (pointsTotal <= top) {
            container.isSelected = true;
          }
          return container;
        });
        setContainers(selected);
        dispatch(selectContainers(selected));
      }

      // const selected = containers.map((container) => {
    }
  };

  const handleSorting = (type, value = null) => {
    setisContainerListRerranged(true);
    if (type === "MANUALLY") {
    } else if (type === "ALPHABETICAL") {
      if (value === sortType.ASCENDING) {
        dispatch(rearrangeContainers(containers, sortType.ASCENDING));
      }
      if (value === sortType.DESCENDING) {
        dispatch(rearrangeContainers(containers, sortType.DESCENDING));
      }
    } else if (type === "POINTS") {
      if (value === sortType.ASCENDING) {
        dispatch(rearrangeContainers(containers, null, sortType.ASCENDING));
      }
      if (value === sortType.DESCENDING) {
        dispatch(rearrangeContainers(containers, null, sortType.DESCENDING));
      }
    }
  };

  const menuInitial = (
    <ul className="sortPopOverLinks flex items-center">
      {!readOnlyState && (
        <li>
          <Button
            icon={<CheckSquareOutlined />}
            type="text"
            onClick={() => {
              setMenuActive("select");
            }}
          />
          {/* Select
          </Button> */}
        </li>
      )}
      <li>
        <Button
          icon={<SortDescendingOutlined />}
          type="text"
          onClick={() => {
            setMenuActive("sort");
          }}
        />
        {/* Sort
        </Button> */}
      </li>
    </ul>
  );

  const selectMenu = (
    <ul
      style={{ minWidth: isMobile ? "85vw" : "160px" }}
      className="sortPopOverLinks style-width"
    >
      <li>
        <Button
          className="sortPopOverBAck"
          icon={<LeftOutlined />}
          type="text"
          onClick={() => setMenuActive("")}
        >
          Select
        </Button>
      </li>
      <li>
        <Button type="text" onClick={() => handleSelection("ALL")}>
          All
        </Button>
      </li>
      <li>
        <Button type="text" onClick={() => handleSelection("MANUALLY")}>
          Manually
        </Button>
      </li>
      <li>
        <Button
          type="text"
          onClick={() => handleSelection("ASSIGNED")}
          disabled={
            containers.filter((container) => container?.users?.length > 0)
              .length === 0
          }
        >
          Assigned Codes
        </Button>
      </li>
      <li>
        <Button
          type="text"
          onClick={() => handleSelection("UNASSIGNED")}
          disabled={
            containers.filter((container) => container?.users?.length === 0)
              .length === 0
          }
        >
          Unassigned Codes
        </Button>
      </li>
      <li>
        <Button
          type="text"
          onClick={() => setShowing({ points: true, rank: false })}
        >
          Points Threshold
        </Button>
        {isShow.points && (
          <div className="pointsThresholdInfo">
            <Typography.Text>
              select every participant{" "}
              <span
                className="cursor-pointer font-bold underline textLink"
                onClick={() => setIsAbove(!isabove)}
              >
                {isabove ? "above" : "below"}
              </span>{" "}
              <Input
                bordered={false}
                placeholder={0}
                onChange={(e) =>
                  setData({ ranking: 0, points: e.target.value || 0 })
                }
              />{" "}
              points
            </Typography.Text>
            <div className="pointsThresholdInfoButtons">
              <Button
                className="btnCancle"
                type="text"
                onClick={handleCancelSelection}
              >
                Cancel
              </Button>
              <Button
                className="btnApply"
                type="primary"
                onClick={() => handleSelection("POINTS", data.points, isabove)}
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </li>
      <li>
        <Button
          type="text"
          onClick={() => setShowing({ points: false, rank: true })}
        >
          Ranking
        </Button>
        {isShow.rank && (
          <div className="pointsThresholdInfo">
            <Typography.Text>
              select{" "}
              <span
                className="cursor-pointer font-bold underline textLink"
                onClick={() => setIsTop(!isTop)}
              >
                {isTop ? "top" : "bottom"}{" "}
              </span>
              <Input
                bordered={false}
                placeholder={0}
                onChange={(e) =>
                  setData({ points: 0, ranking: e.target.value || 0 })
                }
                max={containers.length}
                type="number"
              />{" "}
              participants
            </Typography.Text>
            <div className="pointsThresholdInfoButtons">
              <Button
                className="btnCancle"
                type="text"
                onClick={handleCancelSelection}
              >
                Cancel
              </Button>
              <Button
                className="btnApply"
                type="primary"
                onClick={() => handleSelection("RANKING", data.ranking, isTop)}
              >
                {" "}
                apply
              </Button>
            </div>
          </div>
        )}
      </li>
    </ul>
  );

  const containerState = useSelector((state) => state.containers);
  const [points, setPoints] = useState(0);
  useEffect(() => {
    // containerState?.all?.map((container) => {
    //   setPoints(points += container?.points)
    // })
    const sum = containerState?.all.reduce((accumulator, currentValue) => {
      return accumulator + currentValue?.points;
    }, 0);
    setPoints(sum);
  }, [containerState]);

  const SortByPoints = () => {
    return (
      <li>
        <div className="sortPopOverSorting">
          <Button type="text">Points</Button>
          <div className="sortPopOverSortingButtons">
            <Button
              disabled={!points}
              className="btnSorting"
              type="primary"
              icon={<LowToHighIcon />}
              // onClick={() => handleSorting("POINTS", sortType.ASCENDING)}
              onClick={() => {
                setPage(1);
                setFilter(() => ({
                  sortBy: "points",
                  type: "ASCENDING",
                }));
              }}
            />
            <Button
              disabled={!points}
              className="btnSorting"
              type="primary"
              icon={<HighToLowIcon />}
              // onClick={() => handleSorting("POINTS", sortType.DESCENDING)}
              onClick={() => {
                setPage(1);
                setFilter(() => ({
                  sortBy: "points",
                  type: "DESCENDING",
                }));
              }}
            />
          </div>
        </div>
      </li>
    );
  };
  const sortMenu = (
    <ul className="sortPopOverLinks style-width">
      <li>
        <Button
          className="sortPopOverBAck"
          icon={<LeftOutlined />}
          type="text"
          onClick={() => {
            setMenuActive("");
          }}
        >
          Sort By
        </Button>
      </li>
      {/* <li>
        <Button type="text" onClick={() => handleSorting("MANUALLY")}>
          Manually
        </Button>
      </li> */}
      <li>
        <div className="sortPopOverSorting">
          <Button type="text">Alphabetical Order</Button>
          <div className="sortPopOverSortingButtons">
            <Button
              className="btnSorting"
              type="primary"
              icon={<SortDescendingIcon />}
              // onClick={() => handleSorting("ALPHABETICAL", sortType.ASCENDING)}
              onClick={() => {
                setPage(1);
                setFilter((prev) => ({
                  sortBy: "code",
                  type: "ASCENDING",
                }));
              }}
            />
            <Button
              className="btnSorting"
              type="primary"
              icon={<SortAscendingIcon />}
              // onClick={() => handleSorting("ALPHABETICAL", sortType.DESCENDING)}
              onClick={() => {
                setPage(1);
                setFilter((prev) => ({
                  sortBy: "code",
                  type: "DESCENDING",
                }));
              }}
            />
          </div>
        </div>
      </li>
      {role === "CREW" ? (
        crewUser?.permissions?.manageScoring ? (
          <SortByPoints />
        ) : null
      ) : (
        <SortByPoints />
      )}
    </ul>
  );

  const mainMenu = () => {
    switch (menuActive) {
      case "select":
        return selectMenu;
      case "sort":
        return sortMenu;
      default:
        return menuInitial;
    }
  };

  const SelectModal = ({ isVisible, setVisible }) => {
    return (
      <AppModal isVisible={isVisible} onCancel={() => setVisible(false)}>
        {selectMenu}
      </AppModal>
    );
  };

  return (
    <div className="competitionQualifiedSortingButtons">
      <Popover
        placement="bottom"
        content={selectMenu}
        title={null}
        trigger="click"
      >
        {!readOnlyState &&
          (role === "CREW" ? (
            crewUser?.permissions?.manageScoring ? (
              <Button
                className="competitionQualifiediconButton"
                icon={<CheckNewIcon />}
                type="text"
                onClick={() => {
                  setMenuActive("select");
                }}
              />
            ) : null
          ) : (
            <Button
              className="competitionQualifiediconButton"
              icon={<CheckNewIcon />}
              type="text"
              onClick={() => {
                setMenuActive("select");
              }}
            />
          ))}
      </Popover>
      <Popover
        placement="bottom"
        content={sortMenu}
        title={null}
        trigger="click"
      >
        <Button
          className="competitionQualifiediconButton"
          icon={<SortingIcon />}
          type="text"
          onClick={() => {
            setMenuActive("sort");
          }}
        />
      </Popover>
    </div>
  );
  // <Popover content={mainMenu} title={null} trigger="click">
  //   {children}
  // </Popover>
};

export default AppSortPopOver;
