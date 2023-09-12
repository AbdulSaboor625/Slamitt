import { LinkedinFilled } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Image,
  Input,
  Result,
  Row,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { notify } from "../../../Redux/Actions";
import { judgeSignup } from "../../../Redux/Actions/judgeActions";
import { capitalize, isValidEmail } from "../../../utility/common";
import { stars } from "../../../utility/imageConfig";
import AppModal from "../../AppModal";

const AddNameModule = ({
  judge,
  redirectToDashBoard,
  competitionRoundCode,
  round,
  handleLinkedinLogin,
}) => {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [visibleJudgePresentModal, setVisibleJudgePresentModal] =
    useState(false);

  const [isVerified, setVerified] = useState(false);

  useEffect(() => {
    if (judge && judge.judgeCode) {
      setFirstName(judge.firstName);
      setLastName(judge.lastName);
      setEmail(judge.email);
    }
  }, [judge]);

  useEffect(() => {
    if (judge && judge.judgeCode && hasSubmitted) redirectToDashBoard();
  }, [judge || hasSubmitted]);

  // const checkJudge = async () => {
  //   if (firstName && lastName) {
  //     try {
  //       const response = await Api.get(
  //         `judge/check-judge/${competitionRoundCode}?firstname=${firstName}&lastname=${lastName}`
  //       );
  //       if (response?.result && response?.code) {
  //         setVisibleJudgePresentModal(true);
  //       } else {
  //         handleSubmit();
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   } else {
  //     dispatch(
  //       notify({
  //         type: "error",
  //         message: "You have to enter firstname and lastname",
  //       })
  //     );
  //   }
  // };

  const handleSubmit = async () => {
    if (firstName && email) {
      setHasSubmitted(true);
      dispatch(
        judgeSignup({
          firstName,
          lastName,
          email,
          competitionRoundCode,
          round,
          loginType: "SELF",
          status: "JUDGING",
          verified: isVerified,
        })
      );
    } else {
      dispatch(
        notify({
          type: "INFO",
          message: "Please enter firstname and email",
        })
      );
    }
  };

  const AlreadyJudgePresentModal = () => {
    return (
      <AppModal
        className="alreadyJudgePresentModal"
        isVisible={visibleJudgePresentModal}
        onCancel={() => setVisibleJudgePresentModal(false)}
      >
        <div className="flex flex-col items-center justify-center">
          <Image
            src="https://rethink-competitions.s3.amazonaws.com/1663576276583_judge.svg"
            alt=""
          />
          <Typography.Text>
            A Judge by this name has already logged into this round. Would you
            like to continue this session or start a new one.
          </Typography.Text>
          <div className="flex flex-col">
            <Button
              type="primary"
              onClick={() => {
                setShowSecretCode(true);
                setFirstName("");
                setLastName("");
                setVisibleJudgePresentModal(false);
              }}
            >
              CONTINUE SESSON
            </Button>
            <Button
              type="secondary"
              onClick={() => {
                handleSubmit();
                setVisibleJudgePresentModal(false);
              }}
            >
              Log in as a new judge
            </Button>
          </div>
        </div>
      </AppModal>
    );
  };

  return (
    <>
      <Row className="justify-center visibleMobile">
        <Result
          className="judgeFormResultInfo"
          icon={<Image preview={false} src={stars} alt="" />}
          subTitle="On logging in with LinkedIn your profile will be considered for verification allowing you to leave endorsements & testimonials for your participants."
        />
      </Row>
      <Form>
        <Row className="justify-center">
          <Col span={12} className="judgeFormHalfField">
            <Input
              onInput={(e) => (e.target.value = capitalize(e.target.value))}
              required
              className="textInput"
              value={firstName}
              placeholder="First name"
              type={"text"}
              disabled={judge && judge.firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Col>
          <Col span={12} className="judgeFormHalfField">
            <Input
              onInput={(e) => (e.target.value = capitalize(e.target.value))}
              required
              className="textInput"
              value={lastName}
              placeholder="Last name"
              type={"text"}
              disabled={judge && judge.lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Col>
          <Col span={24} className="mt-4">
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "Please enter a valid Email!",
                },
              ]}
            >
              <Input
                required
                onInput={(e) =>
                  (e.target.value = e.target.value.toLocaleLowerCase())
                }
                className="textInput"
                value={email}
                disabled={judge && judge.email}
                placeholder="Email ID"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Typography.Title className="spamEmailTest" level={5}>
            {"😎 Don’t worry! We do not spam you with unnecessary mails"}
          </Typography.Title>
          <Col span={24} className="mt-4 judgesStepsBlockLinks">
            <Typography.Text className="or">or</Typography.Text>
            <Button
              className="linkedinLink"
              icon={<LinkedinFilled />}
              type="text"
              onClick={handleLinkedinLogin}
            >
              Login with LinkedIn
            </Button>
          </Col>
          <Col span={24} className="judgeFormButtonWrap">
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={!(firstName && isValidEmail(email))}
            >
              START JUDGING
            </Button>
          </Col>
          <Col className="chooseSesstionSlamittColumn">
            <div className="chooseSesstionSlamittLogo">
              <Image src="https://rethink-competitions.s3.amazonaws.com/1667400287389_Frame.png" />
            </div>
          </Col>
        </Row>
      </Form>
      {/* <AlreadyJudgePresentModal /> */}
    </>
  );
};

export default AddNameModule;
