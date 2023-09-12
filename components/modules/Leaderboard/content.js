import { Button, Carousel, Col, Empty, Row, Typography } from "antd";
import React from "react";
import ScoreCard from "./scoreCard";

import { useEffect, useState } from "react";
import { ArrowBackIcon } from "../../../utility/iconsLibrary";

const LeaderBoardContent = ({
  container,
  setContainers,
  leaderboard,
  setActiveTabKey,
  showScore,
  from = "PARTICIPANT",
}) => {
  const carouselRef = React.useRef(null);
  const [click, setClick] = useState(false);

  // useEffect(() => {
  //   if (!!container?.length) {
  //     const scores = container.map((c) => {
  //       if (!c?.isHidden) return c.score;
  //     });
  //     let uniqueScores = [...new Set(scores)];
  //     const contScores = uniqueScores.filter((s) => s !== undefined);
  //     const containerWithRank = container?.map((c) => {
  //       let currentRank = contScores?.indexOf(c?.score) + 1;
  //       return { ...c, currentRank };
  //     });
  //     setContainers(containerWithRank);
  //   }
  // }, [click]);

  const _onHideContainer = (cnt, isHidden) => {
    const newContainer = container.map((c) => {
      if (c.containerName === cnt.containerName) c.isHidden = isHidden;
      return c;
    });
    setContainers(newContainer);
    // container.forEach(
    //   (c) => c.containerName === cnt.containerName && (c.isHidden = isHidden)
    // );
    setClick(!click);
  };

  const CarouselSection = ({ containers }) => {
    return (
      <Row className="leaderboardStatsBlock">
        <Col span={12}>
          {/* {containers.slice(0, 10).map((container) => { */}
          {containers.map((container, i) => {
            if (i % 2 === 0)
              return (
                <ScoreCard
                  container={container}
                  key={container.containerName}
                  onHideContainer={_onHideContainer}
                  leaderboard={leaderboard}
                  setActiveTabKey={setActiveTabKey}
                  showScore={showScore}
                  from={from}
                />
              );
          })}
        </Col>
        <Col span={12}>
          {/* {containers.slice(10, 20).map((container) => { */}
          {containers.map((container, i) => {
            if (i % 2 !== 0)
              return (
                <ScoreCard
                  container={container}
                  key={container.containerName}
                  onHideContainer={_onHideContainer}
                  leaderboard={leaderboard}
                  setActiveTabKey={setActiveTabKey}
                  showScore={showScore}
                  from={from}
                />
              );
          })}
        </Col>
      </Row>
    );
  };

  const pages = parseInt(container.slice(3).length / 20 + 1);
  let sections = [];
  for (let i = 0; i < pages; i++) {
    const secContainer = container.slice(3).slice(i * 20, i * 20 + 20);
    sections.push(secContainer);
  }

  return (
    <div className="leaderboardStatsContent">
      <Carousel ref={carouselRef}>
        {sections?.map((items, index) => {
          return (
            <div key={index}>
              <CarouselSection containers={items} key={index} />
            </div>
          );
        })}
      </Carousel>
      {container.length ? (
        container.length - 3 > 20 && (
          <div className="slickSliderArrows">
            <Button
              className="btnPrev"
              type="text"
              icon={<ArrowBackIcon />}
              onClick={() => carouselRef.current.prev()}
            />
            <Typography.Text></Typography.Text>
            <Button
              className="btnNext"
              type="text"
              icon={<ArrowBackIcon />}
              onClick={() => carouselRef.current.next()}
            />
          </div>
        )
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default LeaderBoardContent;
