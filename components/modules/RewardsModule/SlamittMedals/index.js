import { useState } from "react";
import {
  FirstPlace,
  SecondPlace,
  SpecialMention,
  ThirdPlace,
} from "../../../../utility/iconsLibrary";
import AppSelect from "../../../AppSelect";
import { useEffect } from "react";

const SlamittMedals = ({ reward, setReward, placementData }) => {
  const options =
    ((reward?.trophies &&
      reward?.trophies?.[0]?.label &&
      reward?.trophies?.[0]?.image) ||
      (reward?.medals &&
        reward?.medals?.[0]?.label &&
        reward?.medals?.[0]?.image)) &&
    [...(reward?.trophies || []), ...(reward?.medals || [])].map((item) => ({
      label: item?.label,
      value: item?.label,
      image:
        item?.image?.type == "EMOJI" ? item?.image?.emoji : item?.image?.url,
    }));

  const [firstTrophy, setFirstTrophy] = useState([
    { label: "", value: "", image: "" },
  ]);
  const [secondTrophy, setSecondTrophy] = useState([
    { label: "", value: "", image: "" },
  ]);
  const [thirdTrophy, setThirdTrophy] = useState([
    { label: "", value: "", image: "" },
  ]);
  const [specialMentionTrophy, setSpecialMentionTrophy] = useState([
    { label: "", value: "" },
  ]);

  const [mentionPlaces, setMentionPlaces] = useState([]);

  useEffect(() => {
    placementData?.forEach((item) => {
      if (item?.label === "1st Place")
        if (!!item?.trophiesAndMedals?.length)
          setFirstTrophy(item?.trophiesAndMedals);
      if (item?.label === "2nd Place")
        if (!!item?.trophiesAndMedals?.length)
          setSecondTrophy(item?.trophiesAndMedals);
      if (item?.label === "3rd Place")
        if (!!item?.trophiesAndMedals?.length)
          setThirdTrophy(item?.trophiesAndMedals);
    });
    const mentions = placementData?.filter(
      (item) => item?.type !== "placement"
    );
    setMentionPlaces(
      mentions?.map((item) => ({
        ...item,
        trophiesAndMedals: !item?.trophiesAndMedals?.length
          ? [{ label: "", value: "" }]
          : item?.trophiesAndMedals,
      }))
    );
  }, [placementData]);

  return (
    <div className="competitionStandingsBlock">
      <div className="competitionStandingsHolder">
        <div className="competitionStandingsStatsItem">
          <div className="competitionStandingsStatsItemHeader">
            <div className="competitionStandingsStatsItemImage first">
              <FirstPlace />
            </div>
            <div className="competitionStandingsStatsItemTextbox">
              <strong className="title">1st Place</strong>
              <span className="textNote">
                Placing Team codes will show up on the leaderboard
              </span>
            </div>
          </div>
          {options && !!options.length && (
            <div className="competitionStandingsStatsItemForm">
              {firstTrophy?.map((item, idx) => (
                <div className="formColumn" key={idx}>
                  <AppSelect
                    dropdownRender={(menu) => {
                      return (
                        <div>
                          <div style={{ padding: "8px", fontWeight: "bold" }}>
                            You may assign the same prize for multiple
                            placements
                          </div>
                          {menu}
                        </div>
                      );
                    }}
                    option={options}
                    bordered={false}
                    onChange={(e) => {
                      const prize = options?.find((item) => item?.label == e);
                      const newPrize = firstTrophy?.map((data, index) =>
                        index == idx ? prize : data
                      );
                      setFirstTrophy(newPrize);
                      setReward((prev) => ({
                        ...prev,
                        firstPlaceTrophies: newPrize,
                      }));
                    }}
                    value={item}
                  />
                </div>
              ))}
              <div className="formColumn">
                <div
                  className="buttonAssign"
                  onClick={() =>
                    setFirstTrophy([
                      ...firstTrophy,
                      ...[{ label: "", value: "" }],
                    ])
                  }
                >
                  + Assign Another
                </div>
              </div>
            </div>
          )}
        </div>
        {placementData?.length >= 2 && !placementData?.[1]?.isLocked && (
          <div className="competitionStandingsStatsItem">
            <div className="competitionStandingsStatsItemHeader">
              <div className="competitionStandingsStatsItemImage second">
                <SecondPlace />
              </div>
              <div className="competitionStandingsStatsItemTextbox">
                <strong className="title">2nd Place</strong>
                <span className="textNote">
                  Placing Team codes will show up on the leaderboard
                </span>
              </div>
            </div>
            {options && !!options.length && (
              <div className="competitionStandingsStatsItemForm">
                {secondTrophy?.map((item, idx) => (
                  <div className="formColumn" key={idx}>
                    <AppSelect
                      dropdownRender={(menu) => {
                        return (
                          <div>
                            <div style={{ padding: "8px", fontWeight: "bold" }}>
                              You may assign the same prize for multiple
                              placements
                            </div>
                            {menu}
                          </div>
                        );
                      }}
                      option={options}
                      bordered={false}
                      onChange={(e) => {
                        const prize = options?.find((item) => item?.label == e);
                        const newPrize = secondTrophy?.map((data, index) =>
                          index == idx ? prize : data
                        );
                        setSecondTrophy(newPrize);
                        setReward((prev) => ({
                          ...prev,
                          secondPlaceTrophies: newPrize,
                        }));
                      }}
                      value={options?.find((f) => f.value == item.value)}
                    />
                  </div>
                ))}
                <div className="formColumn">
                  <div
                    className="buttonAssign"
                    onClick={() =>
                      setSecondTrophy([
                        ...secondTrophy,
                        ...[{ label: "", value: "" }],
                      ])
                    }
                  >
                    + Assign Another
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {placementData?.length >= 3 && !placementData?.[2]?.isLocked && (
          <div className="competitionStandingsStatsItem">
            <div className="competitionStandingsStatsItemHeader">
              <div className="competitionStandingsStatsItemImage third">
                <ThirdPlace />
              </div>
              <div className="competitionStandingsStatsItemTextbox">
                <strong className="title">3rd Place</strong>
                <span className="textNote">
                  Placing Team codes will show up on the leaderboard
                </span>
              </div>
            </div>
            {options && !!options.length && (
              <div className="competitionStandingsStatsItemForm">
                {thirdTrophy?.map((item, idx) => (
                  <div className="formColumn" key={idx}>
                    <AppSelect
                      dropdownRender={(menu) => {
                        return (
                          <div>
                            <div style={{ padding: "8px", fontWeight: "bold" }}>
                              You may assign the same prize for multiple
                              placements
                            </div>
                            {menu}
                          </div>
                        );
                      }}
                      option={options}
                      bordered={false}
                      onChange={(e) => {
                        const prize = options?.find((item) => item?.label == e);
                        const newPrize = thirdTrophy?.map((data, index) =>
                          index == idx ? prize : data
                        );
                        setThirdTrophy(newPrize);
                        setReward((prev) => ({
                          ...prev,
                          thirdPlaceTrophies: newPrize,
                        }));
                      }}
                      value={item}
                    />
                  </div>
                ))}
                {/* <div>
                <AppSelect
                  option={options}
                  bordered={false}
                  onChange={(e) => setSelected({ ...selected, third: e })}
                  value={selected.third}
                />
              </div> */}
                <div className="formColumn">
                  <div
                    className="buttonAssign"
                    onClick={() =>
                      setThirdTrophy([
                        ...firstTrophy,
                        ...[{ label: "", value: "" }],
                      ])
                    }
                  >
                    + Assign Another
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {!!mentionPlaces?.length &&
          mentionPlaces?.map((data, outerIndex) => (
            <div className="competitionStandingsStatsItem" key={outerIndex}>
              <div className="competitionStandingsStatsItemHeader">
                <div className="competitionStandingsStatsItemImage">
                  <SpecialMention />
                </div>
                <div className="competitionStandingsStatsItemTextbox">
                  <strong className="title">
                    Special Mention {outerIndex + 1}
                  </strong>
                  <span className="textNote">
                    Placing Team codes will show up on the leaderboard
                  </span>
                </div>
              </div>
              {options && !!options.length && (
                <div className="competitionStandingsStatsItemForm">
                  {data.trophiesAndMedals?.map((item, idx) => (
                    <div className="formColumn" key={idx}>
                      <AppSelect
                        dropdownRender={(menu) => {
                          return (
                            <div>
                              <div
                                style={{ padding: "8px", fontWeight: "bold" }}
                              >
                                You may assign the same prize for multiple
                                placements
                              </div>
                              {menu}
                            </div>
                          );
                        }}
                        option={options}
                        bordered={false}
                        onChange={(e) => {
                          const prize = options?.find(
                            (item) => item?.label == e
                          );
                          const newPrizes = data?.trophiesAndMedals?.map(
                            (inner, index) => (index === idx ? prize : inner)
                          );

                          const newMentionTrophies = mentionPlaces?.map(
                            (innerData, i) =>
                              outerIndex === i
                                ? { ...innerData, trophiesAndMedals: newPrizes }
                                : innerData
                          );

                          setMentionPlaces(newMentionTrophies);
                          setReward((prev) => ({
                            ...prev,
                            mentionsTrophies: newMentionTrophies,
                          }));
                        }}
                        value={options?.find((f) => f.value == item.value)}
                      />
                    </div>
                  ))}
                  <div className="formColumn">
                    <div
                      className="buttonAssign"
                      onClick={() =>
                        setMentionPlaces((prev) =>
                          prev?.map((item, i) =>
                            outerIndex === i
                              ? {
                                  ...item,
                                  trophiesAndMedals: [
                                    ...item?.trophiesAndMedals,
                                    ...[{ label: "", value: "" }],
                                  ],
                                }
                              : item
                          )
                        )
                      }
                    >
                      + Assign Another
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default SlamittMedals;
