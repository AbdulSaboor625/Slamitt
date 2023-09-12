import { useState } from "react";
import {
  FirstPlace,
  SecondPlace,
  SpecialMention,
  ThirdPlace,
} from "../../../../utility/iconsLibrary";
import AppSelect from "../../../AppSelect";
import { useEffect } from "react";

const SlamittPrizes = ({ reward, setReward, placementData }) => {
  const options =
    reward?.prizes &&
    reward?.prizes?.[0]?.label &&
    reward?.prizes?.[0]?.image &&
    reward?.prizes?.map((item) => ({
      label: item?.label,
      value: item?.label,
      image:
        item?.image?.type == "EMOJI" ? item?.image?.emoji : item?.image?.url,
    }));

  const [mentionPlaces, setMentionPlaces] = useState([]);

  const [first, setFirst] = useState([{ label: "", value: "", image: "" }]);
  const [second, setSecond] = useState([{ label: "", value: "", image: "" }]);
  const [third, setThird] = useState([{ label: "", value: "", image: "" }]);

  useEffect(() => {
    placementData?.forEach((item) => {
      if (item?.label === "1st Place")
        if (!!item?.prizes?.length) setFirst(item?.prizes);
      if (item?.label === "2nd Place")
        if (!!item?.prizes?.length) setSecond(item?.prizes);
      if (item?.label === "3rd Place")
        if (!!item?.prizes?.length) setThird(item?.prizes);
    });

    const mentions = placementData?.filter(
      (item) => item?.type !== "placement"
    );
    setMentionPlaces(
      mentions?.map((item) => ({
        ...item,
        prizes: !item?.prizes?.length
          ? [{ label: "", value: "" }]
          : item?.prizes,
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
              {first?.map((item, idx) => (
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
                      const newPrize = first?.map((data, index) =>
                        index == idx ? prize : data
                      );
                      setFirst(newPrize);
                      setReward((prev) => ({
                        ...prev,
                        firstPlacePrizes: newPrize,
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
                    setFirst([...first, ...[{ label: "", value: "" }]])
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
                {second?.map((item, idx) => (
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
                        const newPrize = second?.map((data, index) =>
                          index == idx ? prize : data
                        );
                        setSecond(newPrize);
                        setReward((prev) => ({
                          ...prev,
                          secondPlacePrizes: newPrize,
                        }));
                      }}
                      value={options?.find((f) => f.value == item.value)}
                    />
                  </div>
                ))}
                {/* <div>
                <AppSelect
                  option={options}
                  bordered={false}
                  onChange={(e) => setSelected({ ...selected, second: e })}
                  value={selected.second}
                />
              </div> */}
                <div className="formColumn">
                  <div
                    className="buttonAssign"
                    onClick={() =>
                      setSecond([...second, ...[{ label: "", value: "" }]])
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
                {third?.map((item, idx) => (
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
                        const newPrize = third?.map((data, index) =>
                          index == idx ? prize : data
                        );
                        setThird(newPrize);
                        setReward((prev) => ({
                          ...prev,
                          thirdPlacePrizes: newPrize,
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
                      setThird([...third, ...[{ label: "", value: "" }]])
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
                  {data.prizes?.map((item, idx) => (
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
                          const newPrizes = data?.prizes?.map((inner, index) =>
                            index === idx ? prize : inner
                          );

                          const newMentionPrizes = mentionPlaces?.map(
                            (innerData, i) =>
                              outerIndex === i
                                ? { ...innerData, prizes: newPrizes }
                                : innerData
                          );

                          setMentionPlaces(newMentionPrizes);
                          setReward((prev) => ({
                            ...prev,
                            mentionsPrizes: newMentionPrizes,
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
                            outerIndex == i
                              ? {
                                  ...item,
                                  prizes: [
                                    ...item?.prizes,
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

export default SlamittPrizes;
