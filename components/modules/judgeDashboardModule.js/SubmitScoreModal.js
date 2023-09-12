import { ArrowUpOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Divider,
  Image,
  Input,
  Modal,
  Row,
  Typography,
} from "antd";
import React, { useState } from "react";
import { ArrowBackIcon, CrossIcon } from "../../../utility/iconsLibrary";
import { forgetImage, iconLoading } from "../../../utility/imageConfig";

let participantsOrTeams = "participants";
let notScoredConstant = null;
let maxScoreConstant = 999999999999;

const isAbandon = (str) => str && str.toUpperCase() === "ABANDON";
const isRelease = (str) => str && str.toUpperCase() === "RELEASE";

const NotScoredModal = ({
  containers,
  handleContainerClick,
  setIsReleaseScoresVisible,
  hideModal,
}) => {
  const numContainers = containers.length;
  let containersList = "";
  let headingText = "";
  let subHeadingText = "";

  if (numContainers === 1) {
    const container = containers[0];
    const notScoredCriterias = container.assessment.filter(
      (criteria) => criteria.points === notScoredConstant
    );

    if (notScoredCriterias.length === 1) {
      const notScoredCriteria = notScoredCriterias[0];
      headingText = `${container.containerName} has not been scored for criteria ${notScoredCriteria.label}.`;
      subHeadingText = `Scores for this criteria will be considered as 0pts.`;
    } else {
      headingText = `${container.containerName} has not been scored.`;
      subHeadingText = `Scores will be considered as 0 pts for criteria that have not been marked if you choose to Submit Scores.`;
    }
  } else if (numContainers <= 3) {
    headingText = `Hey looks like you forgot to score few of the ${participantsOrTeams}.`;
    subHeadingText = `These ${participantsOrTeams} will be given 0 pts for criteria that have not been marked if you choose to Submit Scores.`;
  } else {
    headingText = `Hey looks like you forgot to score ${numContainers} ${participantsOrTeams}.`;
    subHeadingText = `These ${participantsOrTeams} will be given 0 pts for criteria that have not been marked if you choose to Submit Scores`;
  }

  if (numContainers <= 3) {
    containersList = containers.map((container, index) => (
      <>
        <Col
          className="mx-0 competitionScoringItem"
          span={24}
          style={{
            cursor: "pointer",
          }}
          key={container.containerCode}
          onClick={() => handleContainerClick(container.containerCode)}
        >
          <div className="competitionScoringItemHolder">
            {container.emojiObject ? (
              <p
                className="competitionScoringItemEmoji"
                style={{ fontSize: "1.5rem" }}
              >
                {container.emojiObject.emoji}
              </p>
            ) : (
              <Image
                src={container.imageURL}
                preview={false}
                width={50}
                heigth={50}
                alt="img"
              />
            )}
            <Typography.Text
              className="teamName"
              style={{ marginLeft: ".5rem" }}
            >
              {container.containerName}
            </Typography.Text>
          </div>
        </Col>
        {index !== numContainers - 1 && (
          <Divider className="competitionScoringItemSeprator" />
        )}
      </>
    ));
  } else {
    containersList = (
      <Col className="mx-0 forgotScoreModalImageGroup" span={24}>
        <Avatar.Group
          maxCount={3}
          size="large"
          maxStyle={{ color: "#000", backgroundColor: "#fff" }}
        >
          {containers.map((container) => (
            <Avatar
              src={
                container.emojiObject
                  ? container.emojiObject.emoji
                  : container.imageURL
              }
              key={container.containerCode}
            />
          ))}
        </Avatar.Group>
      </Col>
    );
  }

  return (
    <Row justify="left">
      <Col className="mx-0" span={24}>
        <div className="forgotScoreModalImage">
          <Image preview={false} src={forgetImage} alt="notScored" />
        </div>
        <Typography.Title>{headingText}</Typography.Title>
      </Col>
      <Col className="mx-0" span={24}>
        <Typography.Text className="forgotScoreModalText">
          {subHeadingText}
        </Typography.Text>
      </Col>
      {containersList}
      <Col
        className="forgotScoreModalFooterButton w-100"
        // xs={{ offset: 6 }}
        // md={{ offset: 8 }}
      >
        <Button type="primary" onClick={hideModal}>
          Continue Judging
        </Button>
      </Col>
      <Col
        className="forgotScoreModalFooterButton w-100"
        // xs={{ offset: 6 }}
        // md={{ offset: 8 }}
      >
        <Button
          type="primary"
          className="outline"
          onClick={() => setIsReleaseScoresVisible(true)}
        >
          Release Scores
        </Button>
      </Col>
    </Row>
  );
};

const ReleaseScoresModal = ({
  containers,
  abandon,
  onSubmit,
  sessionTimer,
  maxPoints,
  withinTopThreeRank,
  hideModal,
}) => {
  const [value, setValue] = useState("");
  const [isRankListVisible, setIsRankListVisible] = useState(false);
  const releaseText = <span style={{ color: "#6808FE" }}>RELEASE</span>;
  function removeDuplicates(arr) {
    const seen = new Set();
    return arr.filter((obj) => {
      if (seen.has(obj.rank)) {
        return false;
      }
      seen.add(obj.rank);
      return true;
    });
  }

  // Remove duplicates based on the "rank" property
  const uniqueData = removeDuplicates(containers);
  const numContainers = uniqueData.length;

  if (isRankListVisible)
    return (
      <Row className="releaseModalScoresBlock" justify="left">
        <Col className="mx-0 releaseModalScoreHeader" span={24}>
          <ArrowBackIcon
            className="releaseModalScoresBack"
            onClick={() => setIsRankListVisible(false)}
          />
        </Col>
        <Col className="mx-0 releaseModalScoresBlockSubhead" span={24}>
          <Typography.Title>{`Rankings`}</Typography.Title>
          <Typography.Text className="forgotScoreModalText">
            {`These ranking have been allotted based on the ${participantsOrTeams} scores given by you.`}
          </Typography.Text>
        </Col>

        <div className="forgotScoreModalRanksBlock">
          {containers.map((container, index) => (
            <>
              {index !== 0 && (
                <Divider
                  className="competitionScoringItemSeprator full"
                  style={{
                    borderTop: `${
                      container.rank > withinTopThreeRank &&
                      containers[index - 1].rank <= withinTopThreeRank
                        ? "1px solid black"
                        : ""
                    }`,
                    background: `${
                      container.rank > withinTopThreeRank &&
                      containers[index - 1].rank <= withinTopThreeRank
                        ? "black"
                        : ""
                    }`,
                  }}
                />
              )}
              <Col
                className="competitionScoringItem"
                key={container.containerCode}
              >
                <div className="competitionScoringItemHolder">
                  <strong
                    className="competitionScoringItemRank"
                    style={{
                      color: `${
                        container.rank <= withinTopThreeRank ? "#6808FE" : ""
                      }`,
                    }}
                  >{`#${container.rank}`}</strong>

                  {container.emojiObject ? (
                    <p
                      className="competitionScoringItemEmoji"
                      style={{ fontSize: "2rem" }}
                    >
                      {container.emojiObject.emoji}
                    </p>
                  ) : (
                    <Image
                      src={container.imageURL}
                      preview={false}
                      width={100}
                      heigth={100}
                      alt="img"
                    />
                  )}
                  <div className="competitionScoringItemTextbox">
                    <strong className="teamName">
                      {container.containerName}
                    </strong>
                    <p className="points">
                      <strong>{container?.scoredPoints}</strong>
                      {` /  ${maxPoints}`}
                    </p>
                  </div>
                </div>
              </Col>
            </>
          ))}
        </div>
      </Row>
    );

  const calculatePoint = (container) => {
    let totalPoints = 0;

    container?.roundData.forEach((obj) => {
      const roundScores = obj.roundScore;

      // Iterate over each roundScore array
      roundScores.forEach((roundScore) => {
        const assessmentArray = roundScore.assessment;

        // Iterate over each assessment object
        assessmentArray.forEach((assessment) => {
          totalPoints += assessment.points;
        });
      });
    });

    const totalRoundScore = container?.mockRoundData.reduce(
      (accumulator, currentValue) => accumulator + currentValue.roundScore,
      0
    );
    return Number(totalPoints) + Number(totalRoundScore);
  };

  return (
    <Row className="releaseModalScoresBlock" justify="left">
      <div className="releaseModalScoreHeader">
        <Col className="mx-0">
          <ArrowBackIcon
            className="releaseModalScoresBack"
            onClick={hideModal}
          />
        </Col>

        <Col className="completedScoringTimer">
          <div className="loaderIcon">
            <Image preview={false} src={iconLoading} alt="session timer" />
          </div>
          <strong className="timeDuration">{sessionTimer}</strong>
        </Col>
      </div>
      <Col className="mx-0" span={24}>
        <Typography.Text className="forgotScoreModalText">
          {`Hurray! You have completed scoring.`}
        </Typography.Text>
      </Col>

      <Col className="mx-0" span={24}>
        <Typography.Title>
          {`Type`} {releaseText} {`to release scores to Organiser`}
        </Typography.Title>
      </Col>
      <Col className="forgotScoreModalFooterField">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value.trim())}
          style={{ height: "2.5rem" }}
          size="small"
          placeholder="RELEASE"
          suffix={
            <Button
              className={
                isRelease(value)
                  ? "judgeSubmit"
                  : isAbandon(value)
                  ? "judgeAbandon"
                  : ""
              }
              type="primary"
              disabled={!(isRelease(value) || isAbandon(value))}
              onClick={() => {
                isAbandon(value) ? abandon() : onSubmit();
              }}
            >
              {isAbandon(value) ? <CrossIcon /> : <ArrowUpOutlined />}
            </Button>
          }
        />
      </Col>
      <Col className="forgotScoreModalFooterLabel">
        <Typography.Text className="textAbandon">
          To abandon the session, type <strong> ABANDON </strong>
        </Typography.Text>
      </Col>

      <div className="forgotScoreModalRanksBlock">
        <div className="forgotScoreModalRanksRow">
          {containers
            .filter((container) => container.rank <= 3)
            .map((container, index) => (
              <>
                <Col
                  className="ant-row competitionScoringItem"
                  key={container.containerCode}
                >
                  <div className="competitionScoringItemHolder">
                    <strong
                      className="competitionScoringItemRank"
                      style={{ color: "#6808FE" }}
                    >{`#${container.rank}`}</strong>

                    {container.emojiObject ? (
                      <p
                        className="competitionScoringItemEmoji"
                        style={{ fontSize: "2rem" }}
                      >
                        {container.emojiObject.emoji}
                      </p>
                    ) : (
                      <Image
                        src={container.imageURL}
                        preview={false}
                        width={100}
                        heigth={100}
                        alt="img"
                      />
                    )}
                    <div className="competitionScoringItemTextbox">
                      <strong className="teamName">
                        {container.containerName}
                      </strong>

                      <p className="points">
                        <strong>{container?.scoredPoints}</strong>
                        {` /  ${maxPoints}`}
                      </p>
                    </div>
                  </div>
                </Col>
                {true && <Divider className="competitionScoringItemSeprator" />}
              </>
            ))}
        </div>
      </div>
      {numContainers > 3 && (
        <Col
          className="forgotScoreModalFooterButton"
          // xs={{ offset: 6 }}
          // md={{ offset: 8 }}
        >
          <Typography.Link
            className="viewAllLink"
            onClick={() => setIsRankListVisible(true)}
            // style={{ textDecoration: "underline" }}
          >{`View all`}</Typography.Link>
        </Col>
      )}
    </Row>
  );
};

const TiedScoresModal = ({
  tiedPairs,
  setIsReleaseScoresVisible,
  handleContainerClick,
  hideModal,
}) => {
  let headingText = "";
  if (tiedPairs.length === 1 && tiedPairs[0].length === 2)
    headingText = `${tiedPairs[0][0].containerName} & ${tiedPairs[0][1].containerName} have been alloted the same Scores `;
  else headingText = `Multiple teams have been alloted the same Scores.`;

  const calculatePoint = (container) => {
    let totalPoints = 0;

    container?.roundData.forEach((obj) => {
      const roundScores = obj.roundScore;

      // Iterate over each roundScore array
      roundScores.forEach((roundScore) => {
        const assessmentArray = roundScore.assessment;

        // Iterate over each assessment object
        assessmentArray.forEach((assessment) => {
          totalPoints += assessment.points;
        });
      });
    });

    const totalRoundScore = container?.mockRoundData.reduce(
      (accumulator, currentValue) => accumulator + currentValue.roundScore,
      0
    );
    return Number(totalPoints) + Number(totalRoundScore);
  };
  return (
    <Row justify="left">
      <Col className="mx-0" span={24}>
        <div className="forgotScoreModalImage">
          <Image preview={false} src={forgetImage} alt="notScored" />
        </div>
        <Typography.Title>{headingText}</Typography.Title>
      </Col>
      <Col className="mx-0" span={24}>
        <Typography.Text className="forgotScoreModalText">
          {`Continue Judging to update scores.`}
        </Typography.Text>
      </Col>
      <Col
        className="forgotScoreModalFooterButton w-100"
        // xs={{ offset: 6 }}
        // md={{ offset: 8 }}
      >
        <Button type="primary" onClick={hideModal}>
          Continue Judging
        </Button>
      </Col>
      <Col
        className="forgotScoreModalFooterButton w-100"
        // xs={{ offset: 6 }}
        // md={{ offset: 8 }}
      >
        <Button
          type="primary"
          className="outline"
          onClick={() => setIsReleaseScoresVisible(true)}
        >
          Release Scores
        </Button>
      </Col>

      <Col className="my-2 mx-0 forgotScoreModalRanksBlock" span={24}>
        <Typography.Text className="forgotScoreModalText">
          {tiedPairs.map((containers, idx2) => (
            <>
              <Row className="forgotScoreModalRanksRow" key={idx2}>
                {containers.map((container, index) => (
                  <>
                    <Col
                      style={{
                        cursor: "pointer",
                      }}
                      className="competitionScoringItem"
                      span={24}
                      key={container.containerCode}
                      onClick={() =>
                        handleContainerClick(container.containerCode)
                      }
                    >
                      <div className="competitionScoringItemHolder">
                        <strong
                          className="competitionScoringItemRank"
                          style={{ color: "#6808FE" }}
                        >{`#${container.rank}`}</strong>

                        {container.emojiObject ? (
                          <p
                            className="competitionScoringItemEmoji"
                            style={{ fontSize: "1.5rem" }}
                          >
                            {container.emojiObject.emoji}
                          </p>
                        ) : (
                          <Image
                            src={container.imageURL}
                            preview={false}
                            width={50}
                            heigth={50}
                            alt="img"
                          />
                        )}
                        <div className="competitionScoringItemTextbox">
                          <strong className="teamName">
                            {container.containerName}
                          </strong>
                          <p className="points">
                            {container?.scoredPoints}
                            <span>pts</span>
                          </p>
                        </div>
                      </div>
                    </Col>
                    {index !== containers.length - 1 && (
                      <Divider className="competitionScoringItemSeprator" />
                    )}
                  </>
                ))}
                {/* <Typography.Text className="teamName"></Typography.Text> */}
              </Row>
              {idx2 !== tiedPairs.length - 1 && (
                <Divider
                  className="speratorBlackRanks"
                  style={{
                    borderTop: "1px solid #000",
                    background: "#000",
                  }}
                />
              )}
            </>
          ))}
        </Typography.Text>
      </Col>
    </Row>
  );
};

const SubmitScoreModal = ({
  sessionTimer,
  openSelectedContainerModal,
  isModalVisible,
  setIsSubmitModalVisible,
  hideModal,
  onSubmit,
  containers,
  maxPoints,
  abandon,
}) => {
  const [isReleaseScoresVisible, setIsReleaseScoresVisible] = useState(false);

  let inProgressContainers = containers.filter((c) => !c.scored);
  let scoredContainers = containers.filter((container) => container.scored);

  const isInProgress = inProgressContainers && inProgressContainers.length;
  const sortedScored = scoredContainers.sort(
    (c1, c2) => c2.scoredPoints - c1.scoredPoints
  );

  const lastContainer = {
    rank: 0,
    scoredPoints: maxScoreConstant,
  };
  let withinTopThreeRank = 1;

  sortedScored.forEach((container, i) => {
    if (container.scoredPoints < lastContainer.scoredPoints) {
      lastContainer.rank += 1;
      lastContainer.scoredPoints = container.scoredPoints;
    }

    container.rank = lastContainer.rank;
    if (i < 3) withinTopThreeRank = lastContainer.rank;
  });

  let isDrawn = false;
  const scoreTies = {};
  sortedScored.forEach((container) => {
    const { scoredPoints } = container;
    if (!scoreTies.hasOwnProperty(scoredPoints)) scoreTies[scoredPoints] = [];
    scoreTies[scoredPoints].push(container);
    if (scoreTies[scoredPoints].length > 1) isDrawn = true;
  });

  let tiedPairs = "";
  if (isDrawn) {
    tiedPairs = Object.values(scoreTies).filter((containers) => {
      return containers.length > 1;
    });

    tiedPairs.sort((t1, t2) => t2[0].scoredPoints - t1[0].scoredPoints);
  }

  const hideSubmitModal = () => {
    hideModal();
    setIsReleaseScoresVisible(false);
  };

  const CloseSubmitModal = () => {
    if (!isInProgress && !isDrawn) {
      hideModal();
    } else {
      setIsReleaseScoresVisible(false);
      setIsSubmitModalVisible(true);
    }
    // setIsSubmitModalVisible(true)
    // hideModal()
  };

  const handleContainerClick = (containerCode) => {
    hideModal();
    openSelectedContainerModal(containerCode);
  };

  return (
    <Modal
      className="forgotScoreModal"
      closable={false}
      visible={isModalVisible}
      onOk={hideSubmitModal}
      onCancel={hideSubmitModal}
      footer={false}
      style={{ borderRadius: "20px" }}
    >
      {isReleaseScoresVisible || !(isInProgress || isDrawn) ? (
        <ReleaseScoresModal
          maxPoints={maxPoints}
          sessionTimer={sessionTimer}
          abandon={abandon}
          onSubmit={onSubmit}
          containers={sortedScored}
          withinTopThreeRank={withinTopThreeRank}
          hideModal={CloseSubmitModal}
          setIsSubmitModalVisible={setIsSubmitModalVisible}
        />
      ) : isInProgress ? (
        <NotScoredModal
          setIsReleaseScoresVisible={setIsReleaseScoresVisible}
          containers={inProgressContainers}
          handleContainerClick={handleContainerClick}
          hideModal={hideSubmitModal}
        />
      ) : isDrawn ? (
        <TiedScoresModal
          tiedPairs={tiedPairs}
          setIsReleaseScoresVisible={setIsReleaseScoresVisible}
          handleContainerClick={handleContainerClick}
          hideModal={hideSubmitModal}
        />
      ) : (
        <></>
      )}
    </Modal>
  );
};

export default SubmitScoreModal;
