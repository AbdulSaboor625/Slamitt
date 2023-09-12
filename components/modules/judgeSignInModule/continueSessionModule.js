import { Button, Col, Form, Image, Input, Result, Row, Typography } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { notify } from "../../../Redux/Actions";
import Api from "../../../services";
import { isValidEmail } from "../../../utility/common";
import { judgeSelfInviteModal, stars } from "../../../utility/imageConfig";

const LandingScreen = ({ setIsRequestingLink }) => (
  <>
    <Row className="justify-center visibleMobile">
      <Result
        className="judgeFormResultInfo"
        icon={<Image preview={false} src={stars} alt="" />}
        subTitle="On logging in with LinkedIn your profile will be considered for verification allowing you to leave endorsements & testimonials for your participants."
      />
    </Row>
    <Row className="newSessionSecreen">
      <Col className="newSessionSecreenRow flex">
        <div className="emailNotificationModalIcon">
          <Image
            preview={false}
            width={79}
            height={100}
            // src={judgeSelfInviteModal}
            src="https://rethink-competitions.s3.amazonaws.com/1667402036167_Group_3311.png"
            alt="judge login mail icon"
          />
        </div>
        <Typography.Text className="emailNotificationModalText font-weight-bold">
          {`Your session link has been mailed to you. Access this link to continue your session `}
        </Typography.Text>
      </Col>
      <Col className="newSessionSecreenRow or">OR</Col>
      <Col className="newSessionSecreenRow judgeFormButtonWrap">
        <Button type="primary" onClick={() => setIsRequestingLink(true)}>
          {"RESEND SESSION LINK"}
        </Button>
      </Col>
      <Col className="newSessionSecreenRow or">OR <span className="subtext visibleTablet">{`Contact your Organiser for secret link`}</span></Col>
      <Col className="newSessionSecreenRow visibleMobile">
        <Typography.Text className="emailNotificationModalText font-weight-bold">
          {`Contact your Organiser for secret link`}
        </Typography.Text>
      </Col>
      <Col className="chooseSesstionSlamittColumn">
        <div className="chooseSesstionSlamittLogo">
          <Image src="https://rethink-competitions.s3.amazonaws.com/1667400287389_Frame.png"/>
        </div>
      </Col>
    </Row>
  </>
);

const ContinueSession = ({
  competitionRoundCode,
  setSessionOptionSelected,
}) => {
  const dispatch = useDispatch();
  const [isRequestingLink, setIsRequestingLink] = useState(false);
  const [email, setEmail] = useState("");
  useState(false);
  const [validationMessage, setValidationMessage] = useState(false);

  const resendInvite = async () => {
    if (!email || !isValidEmail(email)) {
      setValidationMessage("Please enter a valid Email!");
    } else if (isValidEmail(email)) {
      try {
        const response = await Api.post("/judge/resend-judge-invitation", {
          competitionRoundCode,
          email,
        });
        if (response && response.result && response.code) {
          dispatch(
            notify({
              type: "success",
              message: "Mail sent successfully!",
            })
          );
        } else {
          setValidationMessage(response.message);
        }
      } catch (err) {
        dispatch(
          notify({
            type: "error",
            message: "Something went wrong!",
          })
        );
      }
    }
  };

  console.log(validationMessage);

  return !isRequestingLink ? (
    <LandingScreen setIsRequestingLink={setIsRequestingLink} />
  ) : (
    <>
      <Row className="justify-center visibleMobile">
        <Result
          className="judgeFormResultInfo"
          icon={<Image preview={false} src={stars} alt="" />}
          subTitle="On logging in with LinkedIn your profile will be considered for verification allowing you to leave endorsements & testimonials for your participants."
        />
      </Row>
      <Form>
        <Row className="newSessionSecreen">
          <Col className="newSessionSecreenRow">
            <Form.Item
              name="email"
              validateStatus={validationMessage ? "error" : ""}
              help={validationMessage}
            >
              <Typography.Text className="formLabel visibleMobile">{"Enter your email ID"}</Typography.Text>
              <Input
                required
                onInput={(e) => (e.target.value = e.target.value.toLowerCase())}
                className="textInput"
                value={email}
                placeholder="Email ID"
                type="email"
                onChange={(e) => {
                  if (validationMessage) setValidationMessage("");
                  setEmail(e.target.value);
                }}
              />
            </Form.Item>
          </Col>
          <Col className="newSessionSecreenRow judgeFormButtonWrap">
            <Button type="primary" onClick={resendInvite} disabled={!email}>
              {"REQUEST SESSION LINK"}
            </Button>
          </Col>

          <Col className="newSessionSecreenRow or visibleMobile">OR</Col>
          <Col className="newSessionSecreenRow visibleMobile">
            <Typography.Text className="emailNotificationModalText font-weight-bold">
              {`Contact your Organiser for secret link`}
            </Typography.Text>
          </Col>
          <Col className="newSessionSecreenRow">
            <Typography.Link
              onClick={() => {
                setEmail("");
                setSessionOptionSelected("NEW");
              }}
              className="emailNotificationModalText textLink"
              // style={{ borderBottom: "2px solid #666" }}
            >
              {`Start a New Session`}
            </Typography.Link>
          </Col>
          <Col className="chooseSesstionSlamittColumn">
            <div className="chooseSesstionSlamittLogo">
              <Image src="https://rethink-competitions.s3.amazonaws.com/1667400287389_Frame.png"/>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default ContinueSession;
