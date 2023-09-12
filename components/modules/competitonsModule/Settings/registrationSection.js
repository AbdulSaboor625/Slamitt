import {
  CheckCircleFilled,
  InfoCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Divider,
  Image,
  Input,
  Radio,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { encodeBase64, findUnassigned } from "../../../../utility/common";
import { ERROR_CODES } from "../../../../utility/config";
import {
  EditPencilIcon,
  IndianRupeeSignIcon,
} from "../../../../utility/iconsLibrary";
import { free, paid } from "../../../../utility/imageConfig";
import RegistrationSettingsV1_2, {
  ConfigInterIntra,
  RegistrationForm,
  RegistrationType,
} from "./registrationSettingsV1.2";

const RegistrationSection = ({
  readOnlyState,
  competition,
  updateCompetition,
  institutes,
}) => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);
  const roomState = useSelector((state) => state.rooms);
  const token = encodeBase64(useSelector((state) => state.auth.slamittToken));
  const containers = useSelector((state) => state.containers.all);
  const qualifiedcontainers = useSelector(
    (state) => state.containers.qualified
  );
  const [registrationSetting, setRegistrationSetting] = useState({
    competitionType: competition?.competitionType,
    allowRegistration: competition?.allowRegistration,
    registrationFees: "FREE",
  });
  const [disableBtns, setDisableBtns] = useState({
    decreseTeamsize: false,
    increaseMinTeamsize: false,
    switchSameInstitute: false,
    switchSolo: false,
  });
  const [settingScreen, setSettingScreen] = useState("");

  const [editMode, setEditMode] = useState({
    competitionType: false,
    registrationFees: false,
  });

  const [showMinTeamSizeSetting, setShowMinTeamSizeSetting] = useState(
    competition.minTeamSize == null ? false : true
  );
  const [teamSizeData, setTeamSizeData] = useState({
    minTeamSize: competition.minTeamSize ? competition.minTeamSize : 1,
    teamSize: competition.teamSize === null ? 2 : competition.teamSize,
  });
  const [competitionType, setCompetitionType] = useState(
    competition?.competitionType
  );
  const [sameInstitute, setSameInstitute] = useState(
    competition?.isBelongsToSameOrgOrInstitute
  );
  const [useContainerCodePreDefined, setUseContainerCodePreDefined] = useState(
    competition?.useContainerCodePreDefined || false
  );

  useEffect(() => {
    if (competitionType === "TEAM" && competition?.competitionType === "SOLO") {
      setSameInstitute(true);
    }
  }, [competitionType]);

  useEffect(() => {
    if (containers && containers.length) {
      containers?.forEach((cont) => {
        let flag = false;
        if (flag) return;
        cont?.users &&
          cont?.users?.forEach((user) => {
            if (user?.status === "ONBOARDED" || cont?.users?.length > 1) {
              let result = {
                decreseTeamsize: true,
                increaseMinTeamsize: true,
                switchSameInstitute: false,
                switchSolo: false,
              };
              if (cont?.users.length >= 2) {
                result.switchSolo = true;
                result.switchSameInstitute = true;
              }
              setDisableBtns(result);
              flag = true;
              return;
            }
          });
      });
      setSameInstitute(competition?.isBelongsToSameOrgOrInstitute);
    }
  }, [containers]);

  useEffect(() => {
    if (notification.code === ERROR_CODES.COMPETITION_UPDATE_FAILED)
      setRegistrationSetting({
        competitionType: competition?.competitionType,
        registrationFees: "FREE",
      });
  }, [notification.code]);

  const handleUpdateCompetition = () => {
    if (registrationSetting.competitionType === "SOLO")
      updateCompetition({
        competitionType: "SOLO",
        teamSize: null,
        minTeamSize: null,
        allowRegistration: registrationSetting?.allowRegistration,
        useContainerCodePreDefined:
          findUnassigned(containers).length > 0
            ? useContainerCodePreDefined
            : false,
      });
    else if (registrationSetting.competitionType === "TEAM")
      // if (!showMinTeamSizeSetting) {
      updateCompetition({
        competitionType: "TEAM",
        teamSize: teamSizeData.teamSize,
        minTeamSize: showMinTeamSizeSetting ? teamSizeData.minTeamSize : null,
        allowRegistration: registrationSetting?.allowRegistration,
        isBelongsToSameOrgOrInstitute: sameInstitute,
        useContainerCodePreDefined:
          findUnassigned(containers).length > 0
            ? useContainerCodePreDefined
            : false,
      });
    setEditMode({ competitionType: false, registrationFees: false });
    // } else if (teamSizeData.minTeamSize < teamSizeData.teamSize) {
    //   updateCompetition({
    //     competitionType: "TEAM",
    //     teamSize: teamSizeData.teamSize,
    //     minTeamSize: showMinTeamSizeSetting ? teamSizeData.minTeamSize : null,
    //     isBelongsToSameOrgOrInstitute: sameInstitute,
    //   });
    //   setEditMode({ competitionType: false, registrationFees: false });
    // } else
    //   dispatch(
    //     notify({
    //       type: "error",
    //       message: "Min team size must be less then max team size",
    //     })
    //   );
  };

  const RegistrationFees = () => {
    return editMode.registrationFees ? (
      <section className="regSettingsRow">
        <div className="regSettingsHeader">
          <Typography.Title level={3}>Registration Fees</Typography.Title>

          <div className="regSettingInnerButtons">
            <Button
              icon={<ReloadOutlined />}
              type="ghost"
              onClick={() =>
                setEditMode({ competitionType: false, registrationFees: false })
              }
            >
              Reset Changes
            </Button>
            <Button
              type="primary"
              onClick={() =>
                setEditMode({ competitionType: false, registrationFees: false })
              }
            >
              Save Changes
            </Button>
          </div>

          <Button
            className="buttonEdit"
            icon={<EditPencilIcon />}
            type={"ghost"}
            disabled={true}
          >
            Edit
          </Button>
        </div>

        <div className="regSettingsRowContent">
          <div className="regSettingsTypeButtons">
            <Radio.Group
              onChange={(e) =>
                setRegistrationSetting({
                  ...registrationSetting,
                  registrationFees: e.target.value,
                })
              }
              value={registrationSetting.registrationFees}
            >
              <Radio value={"FREE"}>
                {" "}
                <Image
                  src={free}
                  alt="solo"
                  height={50}
                  width={500}
                  preview={false}
                />
              </Radio>
              <Radio value={"PAID"} /*disabled={true}*/>
                {" "}
                <Image
                  src={paid}
                  alt="solo"
                  height={50}
                  width={500}
                  preview={false}
                />
              </Radio>
            </Radio.Group>
          </div>
          {registrationSetting.registrationFees === "FREE" ? (
            <Typography.Text className="infoText">
              Allowing participants to register for free
            </Typography.Text>
          ) : (
            <div className="regPaidField">
              <div className="regPaidFieldBox">
                <Input
                  placeholder="100"
                  prefix={<IndianRupeeSignIcon />}
                  suffix={
                    <Tooltip
                      placement="bottom"
                      title={
                        <div className="flex flex-col">
                          <div className="flex justify-between redPaidInfoRow">
                            <Typography.Text>Base Fee</Typography.Text>
                            <Typography.Text>
                              <IndianRupeeSignIcon /> 100
                            </Typography.Text>
                          </div>
                          <div className="flex justify-between redPaidInfoRow">
                            <Typography.Text>
                              Service Charge(10%)
                            </Typography.Text>
                            <Typography.Text>
                              <IndianRupeeSignIcon /> 10
                            </Typography.Text>
                          </div>
                          <div className="flex justify-between redPaidInfoRow">
                            <Typography.Text>GST(18%)</Typography.Text>
                            <Typography.Text>
                              <IndianRupeeSignIcon /> 19.80
                            </Typography.Text>
                          </div>
                          <Divider />
                          <div className="flex justify-between redPaidInfoRow">
                            <Typography.Text>Total</Typography.Text>
                            <Typography.Text>
                              <IndianRupeeSignIcon /> 129.80
                            </Typography.Text>
                          </div>
                        </div>
                      }
                    >
                      <Button icon={<InfoCircleOutlined />} type={"text"} />
                    </Tooltip>
                  }
                />
                <p>
                  An addition fees of 10% and a tax amount will be charged to
                  the participant
                </p>
                <div className="regCheckboxWrap">
                  <Checkbox />
                  <Typography.Text>
                    Cover Service fees for Participants
                  </Typography.Text>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    ) : (
      <section className="regSettingsRow feesSettingsRegistration">
        <div className="regSettingsHeader regSettingsHeaderRegistration">
          <Typography.Title level={3}>
            <Image
              src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1676320649954_image_45.png"
              alt="Registration"
              preview={false}
            />
            Registration Fees
          </Typography.Title>
          <Typography.Text className="regSettingsHeaderText">
            Allowing participants to register for free
          </Typography.Text>
          {!readOnlyState && (
            <Button
              className="buttonEdit"
              icon={<EditPencilIcon />}
              type="ghost"
              disabled={true}
              onClick={() =>
                setEditMode({ competitionType: false, registrationFees: true })
              }
            >
              Edit
            </Button>
          )}
        </div>
        {/* <Alert
          message={
            <Typography.Text>
              <WalletIcon /> Set up payment to begin accepting Registrations!
            </Typography.Text>
          }
          className="paymentAlert"
          type="warning"
        /> */}
        <div className="regSettingsHolder" style={{ display: "none" }}>
          {registrationSetting.registrationFees === "FREE" ? (
            <>
              <Image
                src={free}
                alt="solo"
                height={50}
                width={500}
                preview={false}
              />
              <div className="textHolder">
                <Typography.Text className="infoText">
                  Allowing participants to register for free
                </Typography.Text>
              </div>
            </>
          ) : (
            <>
              <div className="regPaidInformation">
                <div className="regPaidInfoLeft">
                  <div className="regPaidInfoQuoteWrap">
                    <Image
                      src={paid}
                      alt="solo"
                      height={50}
                      width={500}
                      preview={false}
                    />
                    <Typography.Text className="regPaidInfoQuote">
                      | <IndianRupeeSignIcon /> 100
                    </Typography.Text>
                  </div>
                  <Typography.Text className="textPaidNote">
                    <CheckCircleFilled
                      style={{
                        color: "#1DDB8B",
                      }}
                    />{" "}
                    Service fees of <IndianRupeeSignIcon /> 10 will be deducted
                  </Typography.Text>
                </div>
                <div className="regPaidInfoRight">
                  <Typography.Text className="title">
                    <InfoCircleOutlined /> Collection
                  </Typography.Text>
                  <div className="regPaidInfoSubrow">
                    <Typography.Text>48 Registrations</Typography.Text>
                    <Typography.Text>48,000</Typography.Text>
                  </div>
                  <div className="regPaidInfoSubrow">
                    <Typography.Text>
                      Service Fee <span>(Covered by you)</span>
                    </Typography.Text>
                    <Typography.Text>4,800</Typography.Text>
                  </div>
                  <Divider />
                  <div>
                    <div className="regPaidInfoSubrow grandTotal">
                      <Typography.Text>48 Registrations</Typography.Text>
                      <Typography.Text>43,200</Typography.Text>
                    </div>
                    <Typography.Text className="yellowNoteText">
                      <CheckCircleFilled
                        style={{
                          color: "#F8CE55",
                        }}
                      />{" "}
                      This amount will be credited to your account
                    </Typography.Text>
                  </div>
                  <div>
                    <div className="regPaidInfoSubrow">
                      <Typography.Text>Amount Received</Typography.Text>
                      <Typography.Text>8,200</Typography.Text>
                    </div>
                    <Typography.Text className="greenNoteText">
                      <CheckCircleFilled
                        style={{
                          color: "#1DDB8B",
                        }}
                      />{" "}
                      This amount will be credited to your account
                    </Typography.Text>
                  </div>
                  <div>
                    <div className="regPaidInfoSubrow">
                      <Typography.Text>Amount Pending</Typography.Text>
                      <Typography.Text>35,000</Typography.Text>
                    </div>
                    <Typography.Text className="grayNoteText">
                      <CheckCircleFilled /> This amount will be disbursed on
                      22/6/22
                    </Typography.Text>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    );
  };

  const screenOpen = () => {
    switch (settingScreen) {
      case "REGISTRATION_TYPE":
        return (
          <RegistrationType
            setSettingScreen={setSettingScreen}
            disableBtns={disableBtns}
            competition={competition}
            setCompetitionType={setCompetitionType}
            competitionType={competitionType}
            sameInstitute={sameInstitute}
          />
        );
      case "CONFIG_INTER_INTRA":
        return (
          <ConfigInterIntra
            setSettingScreen={setSettingScreen}
            institutes={institutes}
            settingScreen={settingScreen}
            interIntraConfig={competition?.interIntraConfig || {}}
            containers={containers}
          />
        );
      case "REGISTRATION_FROM":
        return <RegistrationForm setSettingScreen={setSettingScreen} />;
      default:
        return (
          <div>
            {/* <CompetitionType /> */}
            <RegistrationSettingsV1_2
              registrationSetting={registrationSetting}
              setSettingScreen={setSettingScreen}
              competition={competition}
              roomState={roomState}
              disableBtns={disableBtns}
              containers={containers}
            />
            {/* <RegistrationFees /> */}
          </div>
        );
    }
  };

  return <>{screenOpen()}</>;
};

export default RegistrationSection;
