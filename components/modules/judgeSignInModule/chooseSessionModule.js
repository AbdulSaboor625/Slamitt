import { Col, Image, Result, Row, Tooltip, } from "antd";
import { useSelector } from "react-redux";
import {
  continueJudgeSession,
  newJudgeSession,
  stars,
} from "../../../utility/imageConfig";
import {
  titleCase,
} from "../../../utility/common";
import { ArrowNextIcon, InformationIcon } from "../../../utility/iconsLibrary";

const ChooseSession = ({ setSessionOptionSelected }) => {
  const judgeState = useSelector((state) => state.judge);
  const { round } = judgeState;
  return (
    <>
      <Row className="justify-center visibleMobile">
        <Result
          className="judgeFormResultInfo"
          icon={<Image preview={false} src={stars} alt="" />}
          subTitle="On logging in with LinkedIn your profile will be considered for verification allowing you to leave endorsements & testimonials for your participants."
        />
      </Row>
      <Row className="justify-center chooseSesstionItems">
        <div className="chooseSesstionItemsWrap">
          <Col className="chooseSesstionItemsColumn">
            {/* <Image
              onClick={() => setSessionOptionSelected("NEW")}
              style={{ borderRadius: "1rem", cursor: "pointer" }}
              preview={false}
              src={newJudgeSession}
              height={150}
              width={150}
              alt="thumbnail"
            /> */}
            <div
              onClick={() => setSessionOptionSelected("NEW")}
              className="chooseSesstionItemsBox newSesstion">
                <div className="chooseSesstionItemsBoxImage">
                  <Image
                    preview={false}
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1675882532139_image_387.png"
                    height={76}
                    width={66}
                    alt="thumbnail"
                  />
                </div>
                <div className="chooseSesstionItemsBoxTextbox">
                  <strong className="chooseSesstionItemsBoxTitle">
                    <div className="chooseSesstionItemsBoxImage">
                      <Image
                        preview={false}
                        src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1675882532139_image_387.png"
                        height={76}
                        width={66}
                        alt="thumbnail"
                      />
                    </div>
                    <span className="chooseSesstionItemsBoxTitleText">Judge this round</span>
                    <ArrowNextIcon className="arrowNewSesstion" />
                  </strong>
                  <span className="chooseSesstionItemsBoxSubtitle">Start a new session to begin judging the participants of {titleCase(round?.roundName)}</span>
                  <ArrowNextIcon className="arrowNewSesstion" />
                </div>
            </div>
          </Col>
          <Col className="chooseSesstionItemsColumn">
            {/* <Image
              onClick={() => setSessionOptionSelected("OLD")}
              // style={{
              //   borderRadius: "1rem",
              //   border: "1px solid #000",
              //   cursor: "pointer",
              // }}
              preview={false}
              src={continueJudgeSession}
              height={150}
              width={150}
              alt="thumbnail"
            /> */}
            <div
              onClick={() => setSessionOptionSelected("OLD")}
              className="chooseSesstionItemsBox newStyles">
                <div className="chooseSesstionItemsBoxImage">
                  <Image
                    preview={false}
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1675882762739_Group_3319.png"
                    height={76}
                    width={66}
                    alt="thumbnail"
                  />
                </div>
                <div className="chooseSesstionItemsBoxTextbox">
                  <strong className="chooseSesstionItemsBoxTitle">Got Logged out?</strong>
                  <span className="chooseSesstionItemsBoxSubtitle">Continue your session</span>
                  <Tooltip
                    title={"Continue where you left by entering your previously entered email"}
                    trigger={"hover"}
                    placement="bottom"
                  >
                    <InformationIcon className="informationIcon" />
                  </Tooltip>
                </div>
            </div>
          </Col>
        </div>
        <Col className="chooseSesstionSlamittColumn">
            <div
              onClick={() => setSessionOptionSelected("OLD")}
              className="chooseSesstionItemsBox newStyles">
                <div className="chooseSesstionItemsBoxImage">
                  <Image
                    preview={false}
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1675882762739_Group_3319.png"
                    height={76}
                    width={66}
                    alt="thumbnail"
                  />
                </div>
                <div className="chooseSesstionItemsBoxTextbox">
                  <strong className="chooseSesstionItemsBoxTitle">Got Logged out?</strong>
                  <span className="chooseSesstionItemsBoxSubtitle">Continue your session</span>
                  <Tooltip
                    title={"Continue where you left by entering your previously entered email"}
                    trigger={"hover"}
                    placement="bottom"
                  >
                    <InformationIcon className="informationIcon" />
                  </Tooltip>
                </div>
            </div>
          <div className="chooseSesstionSlamittLogo">
            <Image src="https://rethink-competitions.s3.amazonaws.com/1667400287389_Frame.png"/>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ChooseSession;
