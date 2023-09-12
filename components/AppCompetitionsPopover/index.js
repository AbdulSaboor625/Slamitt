import {
  AimOutlined,
  CloseOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import {
  Button,
  Image,
  Input,
  List,
  Popover,
  Tabs,
  Tag,
  Typography,
} from "antd";
import moment from "moment";
import VirtualList from "rc-virtual-list";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";
import useMediaQuery from "../../hooks/useMediaQuery";
import { getAllCompetitionsParticipated, notify } from "../../Redux/Actions";
import Api from "../../services";
import { capitalize } from "../../utility/common";
import { competitionsMenu, routeGenerator, routes } from "../../utility/config";
import {
  AdminIcon,
  ArrowBackIcon,
  CrewNewIcon,
  OtherIcon,
  SearchIcon,
} from "../../utility/iconsLibrary";
import {
  abandonFlag,
  background1,
  background2,
  concludeFlag,
} from "../../utility/imageConfig";
import { AppDropDown } from "../index";
import { useRouter } from "next/router";
import {
  rejectInvitation,
  removeUserFromContainer,
  verifyUserInContainer,
} from "../../requests/container";

const AppCompetitionsPopover = ({
  children,
  className,
  setVisible,
  isPopVisible,
  setIsPopVisible,
  setLeaderboardVisible,
  leaderBoardIsVisible,
}) => {
  const router = useRouter();
  const competition = useSelector((state) => state.competition);
  const user = useSelector((state) => state.auth.user);
  const [crewinCompetitions, setCrewinCompetitions] = useState([]);
  const [leaderboards, setLeaderboards] = useState([]);
  const [updateCrew, setUpdateCrew] = useState(false);
  const [searchResult, setSearchResult] = useState({ result: {}, text: "" });
  const [viewSearch, setViewSearch] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [allCompetitions, setAllCompetitions] = useState([
    ...competition.organized,
  ]);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const dispatch = useDispatch();
  const getLeaderBoard = async () => {
    try {
      const response = await Api.get("/leaderboards");
      if (response?.result && response?.code) {
        setLeaderboards(response?.result);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getLeaderBoard();
  }, [leaderBoardIsVisible]);

  const getCrews = async () => {
    try {
      const response = await Api.get("/competition/crew");
      if (response?.result && response?.code) {
        const acceptedCrewComp = response?.result.filter((comp) => {
          const crew = comp?.crew?.find((crew) => crew?.email === user?.email);
          if (crew?.status === "ONBOARDED") return comp;
        });
        const nonAcceptedCrewComp = response?.result.filter((comp) => {
          if (comp?.status === "ACTIVE") {
            const crew = comp?.crew?.find(
              (crew) => crew?.email === user?.email
            );
            if (crew?.status === "INVITED") return comp;
          }
        });
        setCrewinCompetitions(response?.result);
        const dateSortComp = [
          ...acceptedCrewComp,
          ...competition?.organized,
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAllCompetitions([...nonAcceptedCrewComp, ...dateSortComp]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCrews();
  }, [updateCrew, competition.organized]);

  const findCompetition = (searchText) => {
    const allComp = [
      ...competition?.organized,
      ...competition?.participated,
      ...leaderboards,
    ];
    let searchComp = [];
    let searchLeaderboards = [];
    allComp?.forEach((comp) => {
      if (
        (comp?.competitionName &&
          comp?.competitionName
            .toLowerCase()
            .includes(searchText.toLowerCase())) ||
        (comp?.competitionCode &&
          comp?.competitionCode
            .toLowerCase()
            .includes(searchText.toLowerCase()))
      ) {
        searchComp.push(comp);
      } else if (
        comp?.leaderboardName &&
        comp?.leaderboardName.toLowerCase().includes(searchText.toLowerCase())
      ) {
        searchLeaderboards.push(comp);
      }
    });
    return { comps: searchComp, leaderboards: searchLeaderboards };
  };

  const handleUpdateCrewStatus = async (email, status, item) => {
    const body = { email, status };
    console.log(body);
    try {
      const response = await Api.update(
        `/settings/crewSettings/${item?.competitionCode}`,
        body
      );
      if (response?.result && response?.code) {
        dispatch(
          notify({
            type: "success",
            message: "Crew status updated successfully",
          })
        );
        setUpdateCrew(!updateCrew);
      } else {
        dispatch(notify({ type: "error", message: "Something went wrong" }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAcceptInvitation = async ({ containerCode }, url) => {
    setLoading(true);
    const response = await verifyUserInContainer(containerCode);
    if (response) {
      router.push(url);
    } else {
      dispatch(
        notify({ message: "Failed to accept invitation!", type: "error" })
      );
    }
    setLoading(false);
  };

  const handleRejectInvitation = async ({ containerCode }, email) => {
    setLoading(true);
    const response = await rejectInvitation(containerCode, email);
    if (!response) {
      dispatch(
        notify({ message: "Failed to accept invitation!", type: "error" })
      );
    }
    dispatch(getAllCompetitionsParticipated());
    setLoading(false);
  };

  const CompetitionList = ({ type, data }) => {
    const emptyText = (type) => {
      switch (type) {
        case "ORGANISED":
          return (
            <Typography.Text className="competitionPlaceholderText">
              All competitions organised by you will show up here
            </Typography.Text>
          );
          break;
        case "SEARCH":
          return (
            <Typography.Text className="competitionPlaceholderText">
              No competitions found
            </Typography.Text>
          );
        case "NOTHING":
          return (
            <Typography.Text className="competitionPlaceholderText">
              No competitions or leaderboards found
            </Typography.Text>
          );
          break;
        default:
          return (
            <Typography.Text className="competitionPlaceholderText">
              No competitions
            </Typography.Text>
          );
      }
    };
    if (!Boolean(data.length)) {
      return (
        <>
          {type.toUpperCase() === "PARTICIPATED" ? (
            <div className="competitionPlaceholderBlock">
              <Image
                preview={false}
                width={200}
                height={200}
                alt="thumbnail"
                src={background1}
              />
              <Typography.Text className="competitionPlaceholderText">
                No participated competitions
              </Typography.Text>
            </div>
          ) : (
            <div className="competitionPlaceholderBlock">
              <Image
                preview={false}
                width={200}
                height={200}
                alt="thumbnail"
                src={background2}
              />
              {emptyText(type.toUpperCase())}
            </div>
          )}
        </>
      );
    }
    return (
      <List className="dashboardCompetitionList">
        <VirtualList data={data} itemHeight={47} itemKey="email">
          {(item) => {
            const url = routeGenerator(
              type.toUpperCase() === "PARTICIPATED"
                ? routes.competitionParticipated
                : routes.competitionOrganised,
              {
                competitionCode: item.competitionCode,
              }
            );

            const participatedUser = item?.users?.find(
              (usr) =>
                usr.email === user.email &&
                usr.status !== "ONBOARDED" &&
                item.containerCode
            );
            const crewUser = item?.crew?.find(
              (crew) => crew?.email === user?.email
            );

            const formsLinkEncodedValue = {
              competitionCode: item.competitionCode,
              containerCode: item?.users && item.containerCode,
              email: item?.users && item?.users?.length && item.users[0].email,
              user: item?.users && item?.users?.length && item.users[0],
              type: "PARTICIPANT",
              verifiedFlag: true,
            };
            const formsLink =
              item?.users && item?.users?.length === 1
                ? routeGenerator(
                    routes.authRegistrations,
                    formsLinkEncodedValue,
                    true
                  )
                : "";
            return (
              <div className="relative" key={item?.competitionCode}>
                <a
                  className={`${
                    crewUser && crewUser?.status === "DENIED" ? "hidden" : ""
                  }`}
                  onClick={(e) => {
                    if (
                      (crewUser && crewUser?.status === "INVITED") ||
                      (participatedUser &&
                        participatedUser?.status !== "ONBOARDED")
                    )
                      e.stopPropagation();
                  }}
                  href={
                    (crewUser && crewUser?.status === "INVITED") ||
                    (participatedUser &&
                      participatedUser?.status !== "ONBOARDED")
                      ? "#"
                      : url
                  }
                >
                  <List.Item.Meta
                    className="dashboardPopoverTabsRow current"
                    avatar={
                      item?.emojiObject ? (
                        <p
                          className="dashboardPopoverEmoji"
                          style={{ fontSize: "2rem" }}
                        >
                          {item?.emojiObject.emoji}
                        </p>
                      ) : (
                        <Image
                          src={item?.imageURL}
                          preview={false}
                          width={100}
                          heigth={100}
                          alt="img"
                        />
                      )
                    }
                    title={
                      <>
                        {item.competitionName}{" "}
                        {item.competitionCode ===
                          competition.current?.competitionCode && (
                          <Tag>Active</Tag>
                        )}
                        {(item.status === "ABANDON" ||
                          item.status === "ABANDONED" ||
                          item.status === "CONCLUDED") && (
                          <>
                            <Image
                              src={
                                item?.status === "CONCLUDED"
                                  ? concludeFlag
                                  : abandonFlag
                              }
                              alt={item?.status}
                              preview={false}
                              width={16}
                              height={16}
                            />
                          </>
                        )}
                      </>
                    }
                    description={
                      <>
                        <div className="dashboardPopoverTabsRowSubtext">
                          {!Array.isArray(item.category) ? (
                            <Image
                              height={20}
                              alt="competition category image"
                              src={item?.category?.imageUrl}
                              preview={false}
                            />
                          ) : item?.category?.[0]?.imageUrl ? (
                            <Image
                              height={20}
                              alt="competition category image"
                              src={item.category[0].imageUrl}
                              preview={false}
                            />
                          ) : (
                            <OtherIcon className="otherIcon" />
                          )}{" "}
                          <span className="hideText">
                            {type?.toUpperCase() === "PARTICIPATED"
                              ? "Participated"
                              : "Organised"}{" "}
                            on:{" "}
                          </span>
                          {moment(item.createdAt).format(
                            isMobile ? "DD/MM/YY" : "DD MMM, YYYY"
                          )}
                          {(item.status === "ABANDON" ||
                            item.status === "ABANDONED" ||
                            item.status === "CONCLUDED") && (
                            <>
                              <div className="dashboardPopoverTabsRowSubtext">
                                {` - ${moment(item.updatedAt).format(
                                  isMobile ? "DD/MM/YY" : "DD MMM, YYYY"
                                )}`}
                              </div>
                            </>
                          )}
                          {type === "Organised" ? (
                            crewUser?.status === "ONBOARDED" ? (
                              <Typography.Text className="dashboardPopoverTabsCategory">
                                {" "}
                                | <CrewNewIcon className="crewIcon" />{" "}
                                <span className="text">Crew</span>
                              </Typography.Text>
                            ) : crewUser?.status === "INVITED" ? null : (
                              <Typography.Text className="dashboardPopoverTabsCategory">
                                {" "}
                                | <AdminIcon className="adminIcon" />{" "}
                                <span className="text">Admin</span>
                              </Typography.Text>
                            )
                          ) : null}
                        </div>
                      </>
                    }
                  />
                </a>
                {crewUser ? (
                  <div className="crewApproveButtons">
                    {crewUser?.status === "ONBOARDED" ||
                    crewUser?.status === "DENIED" ? null : (
                      <div>
                        <Button
                          className="buttonApprove"
                          onClick={() =>
                            handleUpdateCrewStatus(
                              crewUser?.email,
                              "ONBOARDED",
                              item
                            )
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          className="buttonDeny"
                          onClick={() =>
                            handleUpdateCrewStatus(
                              crewUser?.email,
                              "DENIED",
                              item
                            )
                          }
                        >
                          Deny
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <AppDropDown
                    label={<EllipsisOutlined />}
                    iconShow={false}
                    menu={competitionsMenu(url, type, item?.competitionType)}
                  />
                )}
                {participatedUser &&
                participatedUser.status !== "ONBOARDED" &&
                item.status === "ACTIVE" ? (
                  <div className="crewApproveButtons">
                    <div>
                      <Button
                        className="buttonApprove"
                        onClick={() =>
                          formsLink
                            ? router.push(formsLink)
                            : handleAcceptInvitation(item, url)
                        }
                        disabled={isLoading}
                      >
                        {formsLink ? "Onboard" : "Approve"}
                      </Button>
                      <Button
                        className="buttonDeny"
                        onClick={() =>
                          handleRejectInvitation(item, participatedUser.email)
                        }
                        disabled={isLoading}
                      >
                        Deny
                      </Button>
                    </div>
                  </div>
                ) : (
                  <AppDropDown
                    label={<EllipsisOutlined />}
                    iconShow={false}
                    menu={competitionsMenu(url, type, item?.competitionType)}
                  />
                )}
              </div>
            );
          }}
        </VirtualList>
      </List>
    );
  };

  const Leaderboards = ({ allLeaderboards, type = "" }) => {
    if (!allLeaderboards?.length) {
      return (
        <div>
          {type !== "SEARCH" ? (
            <div className="competitionPlaceholderBlock">
              <Image
                preview={false}
                width={200}
                height={200}
                alt="thumbnail"
                // src={background2}
                src="https://rethink-competitions.s3.amazonaws.com/1672078146919_image_357.png"
              />
              <Typography.Text className="competitionPlaceholderText">
                All your leaderboards will show up here
              </Typography.Text>
            </div>
          ) : null}
        </div>
      );
    }
    if (allLeaderboards?.length) {
      return (
        <List className="dashboardLeaderboardsList">
          <VirtualList data={allLeaderboards} itemHeight={47} itemKey="email">
            {(item) => {
              const url = routeGenerator(routes.leaderboard, {
                leaderboardID: item._id,
              });
              return (
                <div className="relative" key={item._id}>
                  <a href={url}>
                    <List.Item.Meta
                      className="dashboardPopoverTabsRow current"
                      avatar={
                        item?.emojiObject ? (
                          <p
                            className="dashboardPopoverEmoji"
                            style={{ fontSize: "2rem" }}
                          >
                            {item?.emojiObject.emoji}
                          </p>
                        ) : (
                          <Image
                            src={item?.imageURL}
                            preview={false}
                            width={100}
                            heigth={100}
                            alt="img"
                          />
                        )
                      }
                      title={<>{item.leaderboardName}</>}
                      description={
                        <>
                          {/* <AimOutlined />  */}
                          {"Created"} on:{" "}
                          {moment(item.createdAt).format(
                            isMobile ? "DD/MM/YY" : "DD MMM, YYYY"
                          )}
                        </>
                      }
                    />
                  </a>
                </div>
              );
            }}
          </VirtualList>
        </List>
      );
    }
  };

  const tabs = (
    <>
      <div className="mobile:flex items-center justify-between largeScreen:hidden dashboardCompetitionPopoverMobileHeader">
        <div className="mobile:flex items-center justify-between dashboardCompetitionPopoverMobileWrap">
          <Button
            className="dashboardCompetitionPopoverMobileClose"
            onClick={() => setIsPopVisible(false)}
            icon={<ArrowBackIcon />}
          />
          <Typography.Text className="dashboardCompetitionPopoverMobileTitle">
            My Dashboard
          </Typography.Text>
        </div>
        {!viewSearch && (
          <Button
            className="buttonCompetitionSearch"
            type="secondary"
            icon={<SearchIcon />}
            onClick={() => setViewSearch(true)}
          />
        )}
      </div>
      {viewSearch && (
        <Input
          onInput={(e) => (e.target.value = capitalize(e.target.value))}
          className="dashboardPopoverSearch"
          autoFocus={true}
          placeholder="Search Dashboard"
          onChange={(e) => {
            const result = findCompetition(e.target.value);
            setSearchResult({ result, text: e.target.value });
          }}
          suffix={
            <Button
              className="closeButton"
              onClick={() => {
                setViewSearch(false);
                setSearchResult({ result: [], text: "" });
              }}
              icon={<CloseOutlined />}
            />
          }
        />
      )}

      {searchResult?.text === "" ? (
        <Tabs className="dashboardPopoverTabs" defaultActiveKey="1">
          <Tabs.TabPane tab="Compete" key="1">
            <CompetitionList
              type={"Participated"}
              data={competition.participated}
            />
            <div />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Organise" key="2">
            <div className="relative dashboardPopoverTabsContent">
              <CompetitionList type={"Organised"} data={allCompetitions} />
              <Button
                className="absolute bottom-0 z-50 buttonCreateCompetition"
                onClick={() => {
                  setVisible(true);
                }}
              >
                + Create Competition
              </Button>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Leaderboard" key="3">
            <div className="relative dashboardPopoverTabsContent">
              <Leaderboards allLeaderboards={leaderboards} />
              <Button
                className="absolute bottom-0 z-50 buttonCreateCompetition"
                onClick={() => setLeaderboardVisible(true)}
              >
                + Create Leaderboard
              </Button>
            </div>
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab="Crew" key="4">
          <CompetitionList type={"Crew"} data={crewinCompetitions} />
        </Tabs.TabPane> */}
        </Tabs>
      ) : (
        <div className="dashboardPopoverTabs">
          <div className="dashboardPopoverTabsScroller">
            {searchResult?.result?.comps.length ? (
              <Typography.Text className="dashboardPopoverTabsSubtitle">
                Competitions
              </Typography.Text>
            ) : null}
            <CompetitionList
              type={`${
                Boolean(
                  searchResult?.result?.leaderboards.length ||
                    searchResult?.result?.comps.length
                )
                  ? "SEARCH"
                  : "NOTHING"
              }`}
              data={searchResult?.result?.comps}
            />
            {searchResult?.result?.leaderboards.length ? (
              <Typography.Text className="dashboardPopoverTabsSubtitle">
                Leaderboards
              </Typography.Text>
            ) : null}
            <Leaderboards
              type="SEARCH"
              allLeaderboards={searchResult?.result?.leaderboards}
            />
          </div>
        </div>
      )}
      {!viewSearch && !isMobile && (
        <Button
          className="buttonCompetitionSearch"
          type="secondary"
          icon={<SearchIcon />}
          onClick={() => setViewSearch(true)}
        />
      )}
    </>
  );
  return (
    <Popover
      overlayClassName="dashboardCompetitionPopover"
      placement="bottomLeft"
      title={null}
      content={tabs}
      trigger={["click"]}
      visible={isPopVisible}
      onVisibleChange={(visible) => {
        setIsPopVisible(visible);
        setViewSearch(false);
      }}
      className={className}
    >
      {{ ...children }}
    </Popover>
  );
};

export default AppCompetitionsPopover;
