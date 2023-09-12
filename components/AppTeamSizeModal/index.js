import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Image,
  Input,
  Radio,
  Row,
  Switch,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { findUnassigned, getCrewPermissions } from "../../utility/common";
import { CheckedGreenIcon } from "../../utility/iconsLibrary";
import AppModal from "../AppModal";

export const CounterInput = ({
  onChange = () => null,
  minCount,
  defaultValue = 2,
  label,
  type,
  disableBtns,
  teamSizeData,
  competition,
  setupMinTeamSize,
}) => {
  const [count, setCount] = useState(defaultValue);
  useEffect(() => {
    onChange(count);
  }, [count]);

  useEffect(() => {
    setCount(defaultValue);
  }, [defaultValue]);
  return (
    <div className="flex flex-col counterFormElement">
      <Typography.Text>{label}</Typography.Text>
      <strong className="lbl-text">
        {type !== "MIN"
          ? `${setupMinTeamSize ? "Max" : ""} Team Size`
          : "Min Team Size"}
      </strong>
      <Input
        min={minCount || 1}
        addonAfter={
          <Button
            icon={<PlusOutlined />}
            disabled={
              type === "MIN" &&
              (count + 1 >= teamSizeData?.teamSize ||
                disableBtns?.increaseMinTeamsize)
            }
            type="text"
            onClick={() => setCount(count + 1)}
          />
        }
        readOnly={true}
        value={count}
        addonBefore={
          <Button
            icon={<MinusOutlined />}
            type="text"
            disabled={
              count === minCount ||
              (type !== "MIN" &&
                ((disableBtns?.decreseTeamsize &&
                  count <= competition?.teamSize) ||
                  count - 1 <= teamSizeData?.minTeamSize))
            }
            onClick={() => setCount(count - 1)}
          />
        }
      />
    </div>
  );
};

const AddTeamSizeModal = ({
  isVisibleModal,
  setVisibleModal,
  setVisibleCSVModal,
  switchSolo,
  isSolo,
  size,
  setSize,
  setupMinTeamSize,
  competition,
  setSetupMinTeamSize,
  isBelongsToSameOrgOrInstitute,
  setBelongsToSameOrgOrInstitute,
  handleSubmit = false,
  containers = [],
  setUseContainerCodePreDefined,
  useContainerCodePreDefined,
}) => {
  const { role, email, institute_name } = useSelector(
    (state) => state.auth.user
  );
  const crewPermissions = getCrewPermissions(competition?.crew, email);
  const [disableBtns, setDisableBtns] = useState({
    decreseTeamsize: false,
    increaseMinTeamsize: false,
    switchSameInstitute: false,
    switchSolo: false,
  });
  const [interIntraType, setInterIntraType] = useState(
    competition?.interIntraConfig?.type || "INTER"
  );
  const [sameInstitute, setSameInstitute] = useState(
    competition?.isBelongsToSameOrgOrInstitute
  );

  useEffect(() => {
    if (!isSolo) {
      setSetupMinTeamSize(true);
    }
    if (!isSolo && competition?.competitionType === "SOLO") {
      setBelongsToSameOrgOrInstitute(true);
    }
  }, [isSolo]);

  useEffect(() => {
    if (containers && containers?.length) {
      containers?.forEach((cont) => {
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
              return;
            }
          });
      });
    }
    if (competition) {
      setSetupMinTeamSize(competition?.minTeamSize);
    }
    setBelongsToSameOrgOrInstitute(competition?.isBelongsToSameOrgOrInstitute);
  }, [containers, competition]);

  const SwitchCompType = () => {
    return (
      <div className="soloSwitchLabel">
        <div className="switchLabelWrap switchCompTypeOptions">
          {/* <Typography.Text>
              {" "}
              Switch to {isSolo ? "Team" : "Solo"}
            </Typography.Text>
            <Switch
              // defaultChecked={
              //   competition?.competitionType === "SOLO" ? true : false
              // }
              checked={isSolo}
              onChange={(e) => switchSolo(e)}
            /> */}
          <Radio.Group
            onChange={(e) => {
              switchSolo(e.target.value);
            }}
            defaultValue={isSolo}
          >
            <Radio value={false}>
              {" "}
              <Image
                // src={teamTag}
                src="https://rethink-competitions.s3.amazonaws.com/1675703047665_teamimage.png"
                alt="Team"
                height={50}
                width={500}
                preview={false}
              />
            </Radio>
            <Radio
              value={true}
              disabled={
                disableBtns.switchSolo &&
                competition?.competitionType === "TEAM"
              }
            >
              {" "}
              <Image
                // src={soloTag}
                src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1675703108855_soloimage.png"
                alt="solo"
                height={50}
                width={500}
                preview={false}
              />
            </Radio>
          </Radio.Group>
        </div>
      </div>
    );
  };

  const ContainerPredefinedSwitch = () => {
    return (
      <div>
        {findUnassigned(containers).length === 0 ? (
          <Tooltip
            title={`Add unassigned ${
              competition?.competitionType === "SOLO" ? "participant" : "team"
            } codes to turn this feature on`}
            trigger={"hover"}
            placement="top"
            color={"black"}
          >
            <Switch
              disabled={findUnassigned(containers).length === 0}
              onChange={(e) => {
                setUseContainerCodePreDefined(e);
              }}
              defaultChecked={useContainerCodePreDefined}
            />
          </Tooltip>
        ) : (
          <Switch
            disabled={findUnassigned(containers).length === 0}
            onChange={(e) => {
              setUseContainerCodePreDefined(e);
            }}
            defaultChecked={useContainerCodePreDefined}
          />
        )}
      </div>
    );
  };

  const ModalFotterButtons = () => {
    return (
      <div className="flex buttonWraper">
        <Button
          className="btn-sm"
          type="secondary"
          onClick={() => setVisibleModal(false)}
        >
          Cancel
        </Button>
        <Button
          className="btn-sm"
          type="primary"
          onClick={() => {
            if (handleSubmit) {
              handleSubmit();
            } else {
              setVisibleCSVModal(true);
            }
            setVisibleModal();
          }}
        >
          Done
        </Button>
      </div>
    );
  };

  const InterIntraStatus = () => {
    return (
      <div className="switchLabelWrap border-style">
        {role === "CREW" ? (
          !crewPermissions?.manageRegistrations ? (
            <div className="flex items-center">
              <CheckedGreenIcon
                className={`${sameInstitute ? "text-green-500" : ""}`}
              />
              <Typography.Text>
                {interIntraType === "INTER"
                  ? "Entry is open to all Organisations/Institutes"
                  : `This competition is only open to ${competition?.interIntraConfig?.intraInstitute}`}
              </Typography.Text>
            </div>
          ) : null
        ) : (
          <div className="flex items-center">
            <CheckedGreenIcon
              className={`${sameInstitute ? "text-green-500" : ""}`}
            />
            <Typography.Text>
              {interIntraType === "INTER"
                ? "Entry is open to all Organisations/Institutes"
                : `This competition is only open to ${competition?.interIntraConfig?.intraInstitute}`}
            </Typography.Text>
          </div>
        )}
      </div>
    );
  };

  const SameInstituteSwitch = () => {
    const ConfiguredSwitch = () => {
      return (
        <>
          {!sameInstitute && disableBtns.switchSameInstitute ? (
            <Tooltip
              title={"Already different institutes users are onboarded"}
              trigger={"hover"}
              placement="top"
              color={"black"}
            >
              <Switch
                onChange={(e) => {
                  setBelongsToSameOrgOrInstitute(e);
                  setSameInstitute(e);
                }}
                checked={isBelongsToSameOrgOrInstitute}
                disabled={true}
              />
            </Tooltip>
          ) : (
            <Switch
              onChange={(e) => {
                setBelongsToSameOrgOrInstitute(e);
                setSameInstitute(e);
              }}
              checked={isBelongsToSameOrgOrInstitute}
              disabled={false}
            />
          )}
        </>
      );
    };
    return (
      <div className="switchLabelWrap border-style">
        {role === "CREW" ? (
          crewPermissions?.manageRegistrations ? (
            <Typography.Text>
              Require participants within a team to belong to the same
              Organisation/Institute
            </Typography.Text>
          ) : (
            <div className="flex items-start">
              <CheckedGreenIcon
                className={`${
                  sameInstitute ? "text-green-500" : "text-green-500"
                }`}
              />
              <Typography.Text>
                Require participants within a team to belong to the same
                Organisation/Institute
              </Typography.Text>
            </div>
          )
        ) : (
          <Typography.Text>
            Require participants within a team to belong to the same
            Organisation/Institute
          </Typography.Text>
        )}

        {role === "CREW" ? (
          crewPermissions?.manageRegistrations ? (
            <ConfiguredSwitch />
          ) : null
        ) : (
          <ConfiguredSwitch />
        )}
      </div>
    );
  };

  return (
    <AppModal
      className="setupTeamSizeModal"
      isVisible={isVisibleModal}
      onCancel={setVisibleModal}
    >
      <>
        <div className="setupTeamSizeModalHolder">
          <Row className="justify-center">
            <div className="setupTeamVisibleMobile">
              {role === "CREW" && !crewPermissions?.manageRegistrations && (
                <Image
                  preview={false}
                  alt="config"
                  src="https://rethink-competitions.s3.amazonaws.com/1677505445555_config.png"
                />
              )}
              <Typography.Title className="modalTitle" level={5}>
                {role === "CREW" && !crewPermissions?.manageRegistrations
                  ? `${isSolo ? "Participant" : "Team"} Configuration`
                  : "Setup Team Size"}
              </Typography.Title>
              {role === "CREW" && !crewPermissions?.manageRegistrations ? (
                <Typography.Text className="textPermissionsNote">
                  Request Registration permissions from organiser to edit team
                  settings
                </Typography.Text>
              ) : null}
              <Typography.Text className="textInfo textEditSettings">
                You may edit these settings later.
              </Typography.Text>
            </div>
            <Col span={isSolo ? 24 : 12}>
              {role === "CREW" ? (
                crewPermissions?.manageRegistrations ? (
                  <SwitchCompType />
                ) : null
              ) : (
                <SwitchCompType />
              )}
            </Col>
            <Col span={12}>
              {!isSolo && (
                <div className="setupTeamCrewBlock">
                  <div className="setupTeamVisibleTablet">
                    <Typography.Title className="modalTitle" level={5}>
                      Setup Team Size
                    </Typography.Title>
                    {role === "CREW" &&
                    !crewPermissions?.manageRegistrations ? (
                      <Typography.Text className="textPermissionsNote">
                        Request Registration permissions from organiser to edit
                        team settings
                      </Typography.Text>
                    ) : null}
                    <Typography.Text className="textInfo textEditSettings">
                      You may edit these settings later.
                    </Typography.Text>
                  </div>
                  {role === "CREW" ? (
                    crewPermissions?.manageRegistrations ? (
                      <div className="flex items-center">
                        {setupMinTeamSize && (
                          <CounterInput
                            disableBtns={disableBtns}
                            type="MIN"
                            minCount={1}
                            onChange={(e) =>
                              setSize({
                                teamSize: size?.teamSize,
                                minTeamSize: e,
                              })
                            }
                            defaultValue={size?.minTeamSize || 1}
                            teamSizeData={size}
                            competition={competition}
                            setupMinTeamSize={setupMinTeamSize}
                          />
                        )}

                        <CounterInput
                          disableBtns={disableBtns}
                          minCount={2}
                          onChange={(e) =>
                            setSize({
                              minTeamSize: size?.minTeamSize,
                              teamSize: e,
                            })
                          }
                          defaultValue={size?.teamSize || 2}
                          teamSizeData={size}
                          competition={competition}
                          setupMinTeamSize={setupMinTeamSize}
                        />
                      </div>
                    ) : (
                      <div className="switchLabelWrap">
                        <CheckedGreenIcon className="text-green-500" />
                        {competition?.teamSize && !competition?.minTeamSize ? (
                          <Typography.Text className="setupTeamSizeModalInfoText">
                            {`Teams need to register with ${size?.teamSize} participants`}
                          </Typography.Text>
                        ) : null}
                        {competition?.teamSize &&
                        competition?.minTeamSize > 0 ? (
                          <Typography.Text>
                            {`Teams need to register with a minimum of ${size?.minTeamSize} & maximum of ${size?.teamSize} participants`}
                          </Typography.Text>
                        ) : null}
                      </div>
                    )
                  ) : (
                    <div className="flex items-center">
                      {setupMinTeamSize && (
                        <CounterInput
                          disableBtns={disableBtns}
                          type="MIN"
                          minCount={1}
                          onChange={(e) =>
                            setSize({
                              teamSize: size?.teamSize,
                              minTeamSize: e,
                            })
                          }
                          defaultValue={size?.minTeamSize || 1}
                          teamSizeData={size}
                          competition={competition}
                          setupMinTeamSize={setupMinTeamSize}
                        />
                      )}

                      <CounterInput
                        disableBtns={disableBtns}
                        minCount={2}
                        onChange={(e) =>
                          setSize({
                            minTeamSize: size?.minTeamSize,
                            teamSize: e,
                          })
                        }
                        defaultValue={size?.teamSize || 2}
                        teamSizeData={size}
                        competition={competition}
                        setupMinTeamSize={setupMinTeamSize}
                      />
                    </div>
                  )}
                  {role === "CREW" ? (
                    crewPermissions?.manageRegistrations ? (
                      <div className="switchLabelWrap">
                        <div>
                          <Typography.Text>
                            {"Set min/max team size"}
                          </Typography.Text>
                          <Switch
                            onChange={(e) => setSetupMinTeamSize(e)}
                            checked={setupMinTeamSize}
                          />
                        </div>
                      </div>
                    ) : null
                  ) : (
                    <div className="switchLabelWrap">
                      <div className="switchLabelWrapHolder">
                        <div className="switchLabelWrapRow">
                          <Typography.Text>
                            {"Set min/max team size"}
                          </Typography.Text>
                          <Switch
                            onChange={(e) => setSetupMinTeamSize(e)}
                            checked={setupMinTeamSize}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <SameInstituteSwitch />
                </div>
              )}
              <div className="switchLabelWrap">
                {role === "CREW" ? (
                  crewPermissions?.manageRegistrations ? (
                    <Typography.Text>
                      Require {isSolo ? "participants" : "teams"} to pick from
                      unassigned {!isSolo ? "team" : "participant codes"}{" "}
                      {findUnassigned(containers).length > 0
                        ? `(${findUnassigned(containers).length})`
                        : ""}
                    </Typography.Text>
                  ) : (
                    <div className="flex items-start">
                      <CheckedGreenIcon
                        className={`${
                          useContainerCodePreDefined
                            ? "text-green-500"
                            : "text-green-500"
                        }`}
                      />
                      <Typography.Text>
                        {" "}
                        Require {isSolo ? "participants" : "teams"} to pick from
                        unassigned {!isSolo ? "team" : "participant codes"}{" "}
                        {findUnassigned(containers).length > 0
                          ? `(${findUnassigned(containers).length})`
                          : ""}{" "}
                      </Typography.Text>
                    </div>
                  )
                ) : (
                  <Typography.Text>
                    Require {isSolo ? "participants" : "teams"} to register by
                    choosing from unassigned{" "}
                    {!isSolo ? "team" : "participant codes"}{" "}
                    {findUnassigned(containers).length > 0
                      ? `(${findUnassigned(containers).length})`
                      : ""}
                  </Typography.Text>
                )}
                {role === "CREW" ? (
                  crewPermissions?.manageRegistrations ? (
                    <ContainerPredefinedSwitch />
                  ) : null
                ) : (
                  <ContainerPredefinedSwitch />
                )}
              </div>
              {role !== "CREW" && useContainerCodePreDefined && (
                <Typography.Text className="warningText">
                  Warning: This feature will automatically be turned off if{" "}
                  {competition?.competitionType === "TEAM" ? "there" : ""} all
                  the unassigned{" "}
                  {competition?.competitionType === "TEAM"
                    ? "team"
                    : "participant"}{" "}
                  codes are exhausted.
                </Typography.Text>
              )}
            </Col>
            {role === "CREW" ? (
              crewPermissions?.manageRegistrations ? (
                <ModalFotterButtons />
              ) : null
            ) : (
              <ModalFotterButtons />
            )}
          </Row>
        </div>
      </>
    </AppModal>
  );
};

export default AddTeamSizeModal;
