import { Button, Image, Layout, Skeleton, Typography } from "antd";
import { Footer } from "antd/lib/layout/layout";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../../../Redux/Actions";
import {
  clearJudgeState,
  getCompetitionRound,
  judgeSignup,
  updateJudge,
} from "../../../Redux/Actions/judgeActions";
import { JudgeSignInModule } from "../../../components";
import JudgeTestimonialCarosel from "../../../components/TestimonialCarousel/judgeTestimonialCarosel";
import DeletedRound from "../../../components/modules/judgeDashboardModule.js/DeletedRound";
import AfterSubmitScore from "../../../components/modules/judgeDashboardModule.js/afterSubmitScore";
import useMediaQuery from "../../../hooks/useMediaQuery";
import Api from "../../../services";
import {
  decodeBase64,
  getPresenceChannelName,
  titleCase,
} from "../../../utility/common";
import { ArrowBackIcon } from "../../../utility/iconsLibrary";
import {
  loginUsingLinkIcon,
  slamittLogoSmall,
} from "../../../utility/imageConfig";

const JudgeLogin = ({ pusher }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const judgeState = useSelector((state) => state.judge);
  const auth = useSelector((state) => state.auth);
  const initialRender = useRef(true);
  const { round } = judgeState;
  const [competitionRoundCodeState, setCompetitionRoundCodeState] =
    useState("");
  const [competition, setCompetition] = useState({});
  const [openSignup, setOpenSignUp] = useState(false);
  const [isOldJudge, setIsOldJudge] = useState(false);
  const [fromEmail, setFromEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [judgeCode, setJudgeCode] = useState("");
  const isMobile = useMediaQuery("(max-width: 766px)");

  const [isLoginAsGuestSelected, setLoginasGuestSelection] = useState(false);

  // const { competitionRoundCode } = router.query.data;
  const getCompetition = async () => {
    if (round && round.Competition && round.Competition.competitionCode) {
      const response = await Api.get(
        `/competition/${round?.Competition?.competitionCode}`
      );
      setCompetition(response?.result);
    }
  };
  useEffect(() => {
    getCompetition();
  }, [round]);

  useEffect(() => {
    if (router.query.data) {
      const { competitionRoundCode, judgeCode, fromEmail, email } =
        decodeBase64(router.query.data[0]);
      console.log("email from judge invite link: ", email);
      if (email) setEmail(email);
      if (fromEmail && judgeCode) {
        setFromEmail(true);
        setJudgeCode(judgeCode);
      }
      if (judgeCode && !fromEmail)
        dispatch(judgeSignup({ judgeCode, competitionRoundCode }));
      if (competitionRoundCode) {
        setCompetitionRoundCodeState(competitionRoundCode);
        dispatch(getCompetitionRound(competitionRoundCode));
      }
    }
  }, [router.query]);

  useEffect(() => {
    if (router.query.data) {
      const { competitionRoundCode, judgeCode } = decodeBase64(
        router.query.data[0]
      );

      const channel = pusher.subscribe(
        getPresenceChannelName(`round_${competitionRoundCode}`)
      );

      channel.bind("receive_message", ({ data }) => {
        dispatch(getCompetitionRound(competitionRoundCode));
      });
    }
  }, [router.query]);

  useEffect(() => {
    if (initialRender.current && auth.judgeToken) {
      setOnStep(1);
      initialRender.current = false;
    }
  }, [auth.judgeToken]);

  const [sessionOptionSelected, setSessionOptionSelected] = useState("");
  const [onStep, setOnStep] = useState(0);
  const { judge } = judgeState;

  const onUpdate = (val) => {
    if (val.trim().length) dispatch(updateJudge({ about: val }));
  };

  useEffect(() => {
    if (
      round &&
      judge &&
      judge.firstName &&
      // judge.lastName &&
      judge.email &&
      judge.judgeCode &&
      judge.status !== "JUDGED" &&
      judge.status !== "ABANDONED" &&
      round.isLive
    ) {
      redirectToDashBoard();
    } else if (round && judge && judge.email && judge.isOldJudge) {
      setIsOldJudge(true);
    }
  }, [judge, round]);

  useEffect(() => {
    if (round) {
      const judge = round?.Judges?.find(
        (judge) => judge?.judgeCode === judgeCode
      );
      if (judge && judge?.status === "LOGGED OUT") {
        dispatch(
          judgeSignup({
            judgeCode,
            competitionRoundCode: round?.competitionRoundCode,
          })
        );
      } else if (judge && judge?.status === "JUDGED") {
        dispatch(
          notify({
            message: "You have already completed your session",
            type: "info",
          })
        );
      }
    }
  }, [round]);

  const redirectToDashBoard = () => {
    // localStorage.removeItem("containers");
    if (competitionRoundCodeState)
      router.push(
        `/auth/dashboard/judge/${competitionRoundCodeState}`,
        undefined,
        { shallow: true }
      );
  };

  let judgeName = "";
  if (judge && judge.firstName && judge.lastName)
    judgeName = judge.firstName + " " + judge.lastName;
  return (
    <div>
      {router?.query?.submitted ? (
        <AfterSubmitScore />
      ) : router?.query?.deleted ? (
        <DeletedRound />
      ) : (
        <Layout>
          <Layout.Sider
            className={` z-50 h-screen onboardingSidebar`}
            style={{
              display: isMobile ? (!openSignup ? "block" : "none") : "block",
              position: isMobile ? "absolute" : "static",
            }}
          >
            <JudgeTestimonialCarosel
              setOpenSignUp={setOpenSignUp}
              isMobile={isMobile}
            />
          </Layout.Sider>
          <Layout.Content
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {
              // isOldJudge ? (
              //   <div className="scoreSubmittedScreen">
              //     {isMobile && (
              //       <Button
              //         className="backButton"
              //         type="text"
              //         icon={<ArrowBackIcon />}
              //         onClick={() => {
              //           dispatch(clearJudgeState());
              //           setIsOldJudge(false);
              //         }}
              //       />
              //     )}
              //     <div className="scoreSubmittedScreenContent">
              //       <Image
              //         preview={false}
              //         alt="Login using link image"
              //         src={loginUsingLinkIcon}
              //       />
              //       <Typography.Title className="scoreSubmittedScreenTite">
              //         Access the link sent to {judge?.email} to login to your
              //         session
              //       </Typography.Title>
              //     </div>
              //     {/* {!isMobile && (
              //       <Typography.Link
              //         style={{ textDecoration: "underline" }}
              //         onClick={() => {
              //           dispatch(clearJudgeState());
              //           setIsOldJudge(false);
              //         }}
              //       >
              //         Back to Login
              //       </Typography.Link>
              //     )} */}
              //     <Footer className="scoreSubmittedScreenFooter">
              //       <Image alt="footer image" src={slamittLogoSmall} />
              //     </Footer>
              //   </div>
              // ) :
              !round ? (
                ""
              ) : round.isLive ? (
                <div className="judgeFormContent">
                  {isMobile && (
                    <Button
                      className="backButton"
                      type="text"
                      icon={<ArrowBackIcon />}
                      onClick={() => {
                        if (sessionOptionSelected) {
                          setSessionOptionSelected("");
                        } else {
                          if (isLoginAsGuestSelected) {
                            setLoginasGuestSelection(false);
                          } else {
                            setOpenSignUp(false);
                          }
                        }
                      }}
                    />
                  )}
                  <div className="judgeFormContainer">
                    <div className="judgeFormCompetitionHead">
                      <Typography.Title className="judgeFormTitle" level={1}>
                        <div className="judgeFormIconImage">
                          {round?.emojiObject ? (
                            <p
                              className="judgeIcon"
                              style={{ fontSize: "1.5rem" }}
                            >
                              {round?.emojiObject?.emoji}
                            </p>
                          ) : (
                            <Image
                              src={
                                round.imageURL &&
                                !round.imageURL.includes(
                                  "https://avataaars.io/"
                                )
                                  ? round.imageURL
                                  : "https://rethink-competitions.s3.amazonaws.com/1665134509262_roundicon.png"
                              }
                              preview={false}
                              width={100}
                              heigth={100}
                              alt="img"
                            />
                          )}
                        </div>
                        Welcome to {titleCase(round?.roundName)}
                      </Typography.Title>
                      {/* <div className="judgeFormIcon">
                      <img src={judgeIcon} alt="" />
                      </div> */}
                      {/* <Image
                        className="text-left"
                        src="https://rethink-competitions.s3.amazonaws.com/1650367093301_judge.png"
                        alt="judge emoji"
                        height={76}
                        width={76}
                        preview={false}
                      /> */}
                      <div className="judgeFormCompetitionName">
                        <div
                          className="judgeFormIconImage"
                          style={{ display: "inline-block" }}
                        >
                          {round?.Competition?.emojiObject ? (
                            <p
                              className="judgeIcon"
                              style={{ fontSize: "1.5rem" }}
                            >
                              {round?.Competition?.emojiObject?.emoji}
                            </p>
                          ) : (
                            <Image
                              src={round?.Competition?.imageURL}
                              preview={false}
                              width={100}
                              heigth={100}
                              alt="img"
                            />
                          )}
                        </div>
                        <Typography.Text>
                          <strong className="hidden">
                            {titleCase(round?.roundName)}
                          </strong>
                          <strong>{round?.Competition?.competitionName}</strong>{" "}
                          <span className="seprator"></span>
                          <span className="judgeFormCompetitionCategory">
                            {round && competition
                              ? competition?.category?.categoryName
                              : ""}
                          </span>
                        </Typography.Text>
                      </div>
                    </div>
                    <div className="judgeFormCompetitionJudgeBlock">
                      <Typography.Title className="judgeFormsubTitle" level={3}>
                        {judgeName ? `Hey ${judgeName},` : ""}
                      </Typography.Title>
                    </div>
                    <JudgeSignInModule
                      email={email}
                      fromEmail={fromEmail}
                      judgeCode={judgeCode}
                      sessionOptionSelected={sessionOptionSelected}
                      setSessionOptionSelected={setSessionOptionSelected}
                      round={round}
                      redirectToDashBoard={redirectToDashBoard}
                      competitionRoundCode={competitionRoundCodeState}
                      onStep={onStep}
                      setOnStep={setOnStep}
                      judge={judge}
                      addAbout={onUpdate}
                      isLoginAsGuestSelected={isLoginAsGuestSelected}
                      setLoginasGuestSelection={setLoginasGuestSelection}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center judgingNotLiveScreen">
                  <Image
                    // src={judgeSelfInviteModal}
                    src="/judge.png"
                    preview={false}
                    alt="round not live"
                  />
                  <Typography.Title className="judgingNotLiveScreenTite">
                    Judging will begin once this round goes live
                  </Typography.Title>
                  <Typography.Text className="judgingNotLiveScreenText">
                    Access this link to begin judging once the organiser takes
                    the round live.
                  </Typography.Text>
                  <Footer
                    className="judgingNotLiveScreenFooter"
                    style={{ background: "#fff" }}
                  >
                    <Image
                      preview={false}
                      alt="Footer-Image"
                      src={
                        "https://rethink-competitions.s3.amazonaws.com/1667493885589_slamittlogomin.png"
                      }
                    />
                  </Footer>
                </div>
              )
            }
          </Layout.Content>
        </Layout>
      )}
    </div>
  );
};

export default JudgeLogin;
