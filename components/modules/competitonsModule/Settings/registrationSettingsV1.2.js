/* eslint-disable @next/next/no-img-element */
import {
  Button,
  Checkbox,
  Image,
  Input,
  Radio,
  Select,
  Switch,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCompetitionDetails } from "../../../../Redux/Actions";
import {
  encodeBase64,
  findUnassigned,
  isOnboardedUsers,
} from "../../../../utility/common";
import { routeGenerator, routes } from "../../../../utility/config";
import { exportRegistration } from "../../../../utility/excelService";
import {
  ArrowBackIcon,
  CalendarIcon,
  CheckCircleIcon,
  CrossNewIcon,
  DeleteIcon,
  DownloadIcon,
  DragDotsIcon,
  EditPencilIcon,
  ExpandSquareIcon,
  ImageThumbIcon,
  MapPinIcon,
  PlusCircleIcon,
  PlusIcon,
  RegistrationIcon,
  ReloadIcon,
  StarIcon,
  TickIcon,
} from "../../../../utility/iconsLibrary";
import AppSelect from "../../../AppSelect";
import { CounterInput } from "../../../AppTeamSizeModal";

export const ConfigDiscoveribility = ({ setSettingScreen }) => {
  return (
    <div className="registrationSublevelBlock">
      <div className="registrationSublevelBlockHeader">
        <div className="registrationSublevelBlockHeaderLeft">
          <Button
            className="registrationSublevelBlockBack"
            icon={<ArrowBackIcon />}
            onClick={() => setSettingScreen("")}
          />
          <Typography.Title
            level={3}
            className="registrationSublevelBlockHeading"
          >
            Discoverability
          </Typography.Title>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <Button
            className="registrationSublevelResetButton"
            // onClick={handleResetConfig}
            icon={<ReloadIcon />}
          >
            Reset Changes
          </Button>
          <Button
            className="registrationSublevelResetButton saveButton"
            icon={<TickIcon />}
            onClick={() => {
              // handleUpdateCompetition();
              setSettingScreen("");
            }}
          >
            Save
          </Button>
        </div>
      </div>
      <div className="registrationSublevelBlockContent">
        <div className="registrationSublevelBlockType">
          <div className="registrationSublevelBlockTextbox">
            <Typography.Text className="registrationSublevelBlockSubtitle">
              Choose Discoverability
            </Typography.Text>
            <Typography.Text className="registrationPreferencesTextItalic">
              Choose how you would like to be discovered
            </Typography.Text>
          </div>
          <div className="registrationPreferencesInterOptions">
            <Radio.Group>
              <Radio value={"Private"}>
                {" "}
                <Typography.Text className="registrationPreferencesInterOptionsItem">
                  <Image
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1682625005968_image_434.png"
                    alt=""
                    preview={false}
                  />
                  Private
                </Typography.Text>
              </Radio>
              <Radio value={"Public"}>
                <Typography.Text className="registrationPreferencesInterOptionsItem">
                  <Image
                    src="https://rethink-competitions.s3.amazonaws.com/1683570513848_public.png"
                    alt=""
                    preview={false}
                  />
                  Public
                </Typography.Text>
              </Radio>
            </Radio.Group>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConfigTimeLine = ({ setSettingScreen }) => {
  return (
    <div className="registrationSublevelBlock">
      <div className="registrationSublevelBlockHeader">
        <div className="registrationSublevelBlockHeaderLeft">
          <Button
            className="registrationSublevelBlockBack"
            icon={<ArrowBackIcon />}
            onClick={() => setSettingScreen("")}
          />
          <Typography.Title
            level={3}
            className="registrationSublevelBlockHeading"
          >
            Timeline
          </Typography.Title>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <Button
            className="registrationSublevelResetButton"
            // onClick={handleResetConfig}
            icon={<ReloadIcon />}
          >
            Reset Changes
          </Button>
          <Button
            className="registrationSublevelResetButton saveButton"
            icon={<TickIcon />}
            // onClick={() => {
            //   handleUpdateCompetition();
            //   setSettingScreen("");
            // }}
          >
            Save
          </Button>
        </div>
      </div>
      <div className="registrationSublevelBlockContent timelineFieldsContent">
        <div className="registrationSublevelBlockType">
          <div className="registrationSublevelBlockTextbox">
            <Typography.Text className="registrationSublevelBlockSubtitle">
              Select Competition Dates
            </Typography.Text>
            <Typography.Text className="registrationPreferencesTextItalic">
              Set up a timeline for your competition
            </Typography.Text>
          </div>
          <div className="registrationPreferencesInterOptions timelineFields">
            <div className="timelineField">
              <CalendarIcon />
              <input
                className="timelineTextfield"
                type="text"
                placeholder="DD/MM/YYYY"
              />
              <span className="dateFieldLabel">Start date</span>
            </div>
            <div className="timelineField">
              <CalendarIcon />
              <input
                className="timelineTextfield"
                type="text"
                placeholder="DD/MM/YYYY"
              />
              <span className="dateFieldLabel">End date</span>
            </div>
          </div>
        </div>
        <ul className="registrationPreferencesList mb-0">
          <li>
            <Typography.Text>
              <span className="text-gray">or Mark as</span> Coming Soon
            </Typography.Text>
            <Switch />
          </li>
        </ul>
      </div>
    </div>
  );
};

export const ConfigCompetitionMode = ({ setSettingScreen }) => {
  return (
    <div className="registrationSublevelBlock">
      <div className="registrationSublevelBlockHeader">
        <div className="registrationSublevelBlockHeaderLeft">
          <Button
            className="registrationSublevelBlockBack"
            icon={<ArrowBackIcon />}
            onClick={() => setSettingScreen("")}
          />
          <Typography.Title
            level={3}
            className="registrationSublevelBlockHeading"
          >
            Competition Mode
          </Typography.Title>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <Button
            className="registrationSublevelResetButton"
            // onClick={handleResetConfig}
            icon={<ReloadIcon />}
          >
            Reset Changes
          </Button>
          <Button
            className="registrationSublevelResetButton saveButton"
            icon={<TickIcon />}
            // onClick={() => {
            //   handleUpdateCompetition();
            //   setSettingScreen("");
            // }}
          >
            Save
          </Button>
        </div>
      </div>
      <div className="registrationSublevelBlockContent competitionModeContent">
        <div className="registrationSublevelBlockType">
          <div className="registrationSublevelBlockTextbox">
            <Typography.Text className="registrationSublevelBlockSubtitle">
              Select Conducting Mode(s)
            </Typography.Text>
            <Typography.Text className="registrationPreferencesTextItalic">
              Your Rounds may be conducted in these modes
            </Typography.Text>
          </div>

          <div className="registrationPreferencesInterOptions">
            <Checkbox.Group className="registrationPreferencesChecboxesOptions">
              <Checkbox value={"Online"}>
                {" "}
                <Typography.Text className="registrationPreferencesInterOptionsItem">
                  <Image
                    src="https://rethink-competitions.s3.amazonaws.com/1683575328205_online.png"
                    alt=""
                    preview={false}
                  />
                  Online
                </Typography.Text>
              </Checkbox>
              <Checkbox value={"Offline"}>
                <Typography.Text className="registrationPreferencesInterOptionsItem">
                  <Image
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1682625510829_image_37.png"
                    alt=""
                    preview={false}
                  />
                  Offline
                </Typography.Text>
              </Checkbox>
            </Checkbox.Group>
          </div>
        </div>
        <div className="registrationSublevelBlockType locationFieldWrapper">
          <div className="registrationSublevelBlockTextbox">
            <Typography.Text className="registrationSublevelBlockSubtitle">
              Add location for offline mode
            </Typography.Text>
          </div>
          <div className="registrationPreferencesInterOptions">
            <div className="locationField">
              <MapPinIcon />
              <input
                className="locationTextfield"
                type="text"
                placeholder="Add Location"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConfigInterIntra = ({
  setSettingScreen,
  institutes,
  settingScreen,
  interIntraConfig,
  containers,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [config, setConfig] = useState(interIntraConfig?.type || "INTER");
  const [interInstitutes, setInterInstitutes] = useState(
    interIntraConfig?.interInstitutes || [
      {
        value: "none",
        label: "Select Institute",
      },
      {
        value: "none",
        label: "Select Institute",
      },
    ]
  );
  const [instituteOptions, setInstituteOptions] = useState([]);
  const [
    restrictEntryToSpesificInstitutes,
    setRestrictEntryToSpesificInstitutes,
  ] = useState(interIntraConfig?.restrictEntryToSpesificInstitutes || false);

  useEffect(() => {
    const options = institutes.map((i) => {
      const values = [...interInstitutes?.map((i) => i?.value)];
      if (values.includes(i.value)) {
        i.disabled = true;
        return i;
      } else {
        i.disabled = false;
        return i;
      }
    });
    setInstituteOptions(options);
  }, [interInstitutes, settingScreen]);

  const removeInterInstitute = (index) => {
    const newInterInstitutes = [...interInstitutes];
    newInterInstitutes.splice(index, 1);
    setInterInstitutes(newInterInstitutes);
  };

  const handleUpdateConfig = () => {
    console.log("save");
    const insts = interInstitutes?.filter((i) => i?.value !== "none");
    // if (config === "INTER" && insts.length < 2) {
    //   dispatch(
    //     notify({
    //       type: "error",
    //       message: "Please select atleast 2 institutes",
    //     })
    //   );
    // } else {
    let interIntraConfig;
    config === "INTER"
      ? (interIntraConfig = {
          type: config,
          interInstitutes: interInstitutes?.filter((i) => i?.value !== "none"),
          restrictEntryToSpesificInstitutes,
        })
      : (interIntraConfig = {
          type: config,
          intraInstitute: user?.institute_name,
          interInstitutes: [],
          restrictEntryToSpesificInstitutes: false,
        });
    dispatch(updateCompetitionDetails({ interIntraConfig }));
    // }
  };

  const handleResetConfig = () => {
    setConfig(interIntraConfig?.type || "INTER");
    setInterInstitutes(
      interIntraConfig?.interInstitutes || [
        { value: "none", label: "Select Institute" },
        { value: "none", label: "Select Institute" },
      ]
    );
    setRestrictEntryToSpesificInstitutes(
      interIntraConfig?.restrictEntryToSpesificInstitutes || false
    );
  };

  return (
    <>
      <div className="registrationSublevelBlock">
        <div className="registrationSublevelBlockHeader">
          <div className="registrationSublevelBlockHeaderLeft">
            <Button
              className="registrationSublevelBlockBack"
              icon={<ArrowBackIcon />}
              onClick={() => setSettingScreen("")}
            />
            <Typography.Title
              level={3}
              className="registrationSublevelBlockHeading"
            >
              Configure Competition
            </Typography.Title>
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            <Button
              className="registrationSublevelResetButton"
              onClick={handleResetConfig}
              icon={<ReloadIcon />}
            >
              Reset Changes
            </Button>
            <Button
              className="registrationSublevelResetButton saveButton"
              icon={<TickIcon />}
              onClick={() => {
                handleUpdateConfig();
              }}
            >
              Save
            </Button>
          </div>
        </div>
        <div className="registrationSublevelBlockContent">
          <div className="registrationSublevelBlockType">
            <div className="registrationSublevelBlockTextbox">
              <Typography.Text className="registrationSublevelBlockSubtitle">
                Choose Participation type
              </Typography.Text>
              {config === "INTER" ? (
                <Typography.Text className="registrationPreferencesTextItalic">
                  This competition will be open to All organisations/Institutes
                </Typography.Text>
              ) : (
                <Typography.Text className="registrationPreferencesTextItalic">
                  This competition entry will be restricted{" "}
                  {user?.institute_name}
                </Typography.Text>
              )}
            </div>
            <div className="registrationPreferencesInterOptions">
              <Radio.Group
                value={config}
                onChange={(e) => setConfig(e.target.value)}
              >
                <Radio value={"INTER"}>
                  {" "}
                  <Typography.Text className="registrationPreferencesInterOptionsItem">
                    <Image
                      src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1676921981470_image_426.png"
                      alt=""
                      preview={false}
                    />
                    Inter
                  </Typography.Text>
                </Radio>
                <Radio
                  value={"INTRA"}
                  disabled={
                    interIntraConfig?.type === "INTER" &&
                    isOnboardedUsers(containers)
                  }
                >
                  {" "}
                  <Tooltip
                    title={`no participants should be added to switch to intra`}
                    trigger={"hover"}
                    placement="top"
                    color={"black"}
                  >
                    <Typography.Text className="registrationPreferencesInterOptionsItem">
                      <Image
                        src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1676922200568_image_425.png"
                        alt=""
                        preview={false}
                      />
                      Intra
                    </Typography.Text>
                  </Tooltip>
                </Radio>
              </Radio.Group>
            </div>
          </div>
          {/* {config === "INTER" && (
          <div>
            <div>
              <Typography.Text>
                Restrict entry to specific Organisations/Institutes
              </Typography.Text>
              <Switch
                checked={restrictEntryToSpesificInstitutes}
                onChange={(e) => setRestrictEntryToSpesificInstitutes(e)}
              />
            </div>
            <Row>
              {interInstitutes.map((institute, index) => (
                <Col key={index} span={12} className="relative">
                  {index > 1 ? (
                    <Button
                      className="absolute top-0 right-0 z-50"
                      onClick={() => removeInterInstitute(index)}
                      icon={<CrossCircleIcon />}
                    />
                  ) : null}
                  <Select
                    showSearch
                    value={institute}
                    style={{
                      width: "100%",
                    }}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    onSelect={(value) => {
                      const selected = institutes.find(
                        (option) => option.value === value
                      );
                      const newInterInstitutes = [...interInstitutes];
                      newInterInstitutes[index] = selected;
                      setInterInstitutes(newInterInstitutes);
                    }}
                    options={instituteOptions || []}
                  />
                </Col>
              ))}
              {!interInstitutes.map((i) => i?.value)?.includes("none") && (
                <Col span={12}>
                  <Select
                    showSearch
                    value={{ label: "Select Institute", value: "none" }}
                    style={{
                      width: "100%",
                    }}
                    onSelect={(value) => {
                      const selected = institutes.find(
                        (option) => option.value === value
                      );
                      setInterInstitutes([...interInstitutes, selected]);
                    }}
                    options={instituteOptions || []}
                  />
                </Col>
              )}
            </Row>
          </div>
        )} */}
        </div>
      </div>

      {/* Discoverability Content */}

      {/* Timeline Content */}

      {/* Competition Mode Content */}

      {/* Gallery Content */}
      <div className="registrationSublevelBlock">
        <div className="registrationSublevelBlockHeader">
          <div className="registrationSublevelBlockHeaderLeft">
            <Button
              className="registrationSublevelBlockBack"
              icon={<ArrowBackIcon />}
              onClick={() => handleUpdateConfig()}
            />
            <Typography.Title
              level={3}
              className="registrationSublevelBlockHeading"
            >
              Gallery
            </Typography.Title>
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            <Button
              className="registrationSublevelResetButton"
              onClick={handleResetConfig}
              icon={<ReloadIcon />}
            >
              Reset Changes
            </Button>
            <Button
              className="registrationSublevelResetButton saveButton"
              icon={<TickIcon />}
              onClick={() => {
                handleUpdateCompetition();
                setSettingScreen("");
              }}
            >
              Save
            </Button>
          </div>
        </div>
        <div className="comGalleryContent">
          <div className="comGalleryContentRow">
            <div className="comGalleryContentHeader">
              <div className="comGalleryContentHeaderLeft">
                <strong className="comGalleryContentTitle">
                  <StarIcon className="iconStar" /> Banner Image
                </strong>
                <span className="comGalleryContentText">
                  Add an image that is preferably 1360x400 px up to 7mb
                </span>
              </div>
            </div>
            <div className="galleryBannerImage">
              <ImageThumbIcon className="iconImage" />
              <DragDotsIcon className="iconDrag" />
              <span className="galleryBannerPlaceholderText">
                Preferably 1360x400 px (7mb)
              </span>
              <div className="galleryBannerImageWrap">
                <img
                  src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1683656364937_banner.jpg"
                  alt=""
                />
              </div>
            </div>
          </div>

          <div className="comGalleryContentRow">
            <div className="comGalleryContentHeader">
              <div className="comGalleryContentHeaderLeft">
                <strong className="comGalleryContentTitle">
                  <StarIcon className="iconStar" /> Banner Image
                </strong>
                <span className="comGalleryContentText">
                  Add an image that is preferably 1360x400 px up to 7mb
                </span>
              </div>
              <div className="comGalleryContentHeaderRight">
                <Button className="linkEdit" icon={<EditPencilIcon />}>
                  Edit
                </Button>
                <Button className="linkDelete" icon={<DeleteIcon />}>
                  Delete
                </Button>
              </div>
            </div>
            <div className="galleryBannerImage imageUploaded">
              <ImageThumbIcon className="iconImage" />
              <DragDotsIcon className="iconDrag" />
              <span className="galleryBannerPlaceholderText">
                Preferably 1360x400 px (7mb)
              </span>
              <div className="galleryBannerImageWrap">
                <img
                  src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1683656364937_banner.jpg"
                  alt=""
                />
              </div>
            </div>
          </div>

          <div className="comGalleryContentRow">
            <div className="comGalleryContentHeader">
              <div className="comGalleryContentHeaderLeft">
                <strong className="comGalleryContentTitle">Media</strong>
                <span className="comGalleryContentText">
                  Add up to 5 media files
                </span>
              </div>
            </div>
            <ul className="mediaImagesList">
              <li>
                <div className="mediaImage">
                  <ImageThumbIcon className="iconImage" />
                  <DragDotsIcon className="iconDrag" />
                  <div className="mediaImageHolder">
                    <img
                      src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1683656794588_thumbnail01.jpg"
                      alt=""
                    />
                  </div>
                </div>
              </li>
              <li>
                <div className="mediaImage addNewItem">
                  <PlusCircleIcon className="iconUpload" />
                </div>
              </li>
            </ul>
          </div>

          <div className="comGalleryContentRow">
            <div className="comGalleryContentHeader">
              <div className="comGalleryContentHeaderLeft">
                <strong className="comGalleryContentTitle">Media</strong>
                <span className="comGalleryContentText">
                  Add up to 5 media files
                </span>
              </div>
              <div className="comGalleryContentHeaderRight">
                <Button className="linkEdit" icon={<EditPencilIcon />}>
                  Edit
                </Button>
                <Button className="linkDelete" icon={<DeleteIcon />}>
                  Delete
                </Button>
              </div>
            </div>
            <ul className="mediaImagesList">
              <li>
                <div className="mediaImage imageUploaded">
                  <ImageThumbIcon className="iconImage" />
                  <DragDotsIcon className="iconDrag" />
                  <div className="mediaImageHolder">
                    <img
                      src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1683656794588_thumbnail01.jpg"
                      alt=""
                    />
                  </div>
                  <Checkbox className="mediaCheckbox"></Checkbox>
                  <ExpandSquareIcon className="iconExpand" />
                </div>
              </li>
              <li>
                <div className="mediaImage imageUploaded">
                  <ImageThumbIcon className="iconImage" />
                  <DragDotsIcon className="iconDrag" />
                  <div className="mediaImageHolder">
                    <img
                      src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1683656881529_thumbnail02.jpg"
                      alt=""
                    />
                  </div>
                  <Checkbox className="mediaCheckbox"></Checkbox>
                  <ExpandSquareIcon className="iconExpand" />
                </div>
              </li>
              <li>
                <div className="mediaImage addNewItem">
                  <PlusCircleIcon className="iconUpload" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* </div> */}

      {/* About Content */}
      <div className="registrationSublevelBlock">
        <div className="registrationSublevelBlockHeader">
          <div className="registrationSublevelBlockHeaderLeft">
            <Button
              className="registrationSublevelBlockBack"
              icon={<ArrowBackIcon />}
              onClick={() => handleUpdateConfig()}
            />
            <Typography.Title
              level={3}
              className="registrationSublevelBlockHeading"
            >
              About
            </Typography.Title>
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            <Button
              className="registrationSublevelResetButton"
              onClick={handleResetConfig}
              icon={<ReloadIcon />}
            >
              Reset Changes
            </Button>
            <Button
              className="registrationSublevelResetButton saveButton"
              icon={<TickIcon />}
              onClick={() => {
                handleUpdateCompetition();
                setSettingScreen("");
              }}
            >
              Save
            </Button>
          </div>
        </div>
        <div className="registrationSublevelBlockContent aboutContentEditor">
          <div className="aboutContentEditorBlock">
            <img
              className="placeholderImage"
              src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1683743976933_Group_1352.png"
              alt="Editor"
            />
          </div>
        </div>
      </div>

      {/* Contact Details Content */}
      <div className="registrationSublevelBlock">
        <div className="registrationSublevelBlockHeader">
          <div className="registrationSublevelBlockHeaderLeft">
            <Button
              className="registrationSublevelBlockBack"
              icon={<ArrowBackIcon />}
              onClick={() => handleUpdateConfig()}
            />
            <Typography.Title
              level={3}
              className="registrationSublevelBlockHeading"
            >
              Contact Details
            </Typography.Title>
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            <Button
              className="registrationSublevelResetButton"
              onClick={handleResetConfig}
              icon={<ReloadIcon />}
            >
              Reset Changes
            </Button>
            <Button
              className="registrationSublevelResetButton saveButton"
              icon={<TickIcon />}
              onClick={() => {
                handleUpdateCompetition();
                setSettingScreen("");
              }}
            >
              Save
            </Button>
          </div>
        </div>
        <div className="registrationSublevelBlockContent contactInfoContent">
          <div className="registrationSublevelBlockType">
            <div className="registrationSublevelBlockTextbox">
              <Typography.Text className="registrationSublevelBlockSubtitle">
                Add contact details of your support team
              </Typography.Text>
              <Typography.Text className="registrationPreferencesTextItalic">
                These details will be available to people visiting your
                competition page.
              </Typography.Text>
            </div>
            <div className="registrationPreferencesInterOptions">
              <Button className="ant-btn ant-btn-primary btnAddContact">
                Add Contact
              </Button>
            </div>
          </div>
          <ul className="contactInformationList">
            <li>
              <div className="contactInformationBox">
                <div className="contactInformationBoxLeft">
                  <strong className="contactInformationName">John Doe</strong>
                  <span className="contactInformationEmail">
                    johndoe@gmail.com
                  </span>
                  <Button className="ant-btn ant-btn-default btnAddInfo">
                    + Add your Contact No.
                  </Button>
                </div>
                <div className="contactInformationBoxRight">
                  <div className="contactInformationBoxButtons">
                    <Button
                      className="buttonCircle editButton"
                      icon={<EditPencilIcon />}
                    ></Button>
                    <Button
                      className="buttonCircle removeButton"
                      icon={<CrossNewIcon />}
                    ></Button>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="contactInformationBox">
                <div className="contactInformationBoxLeft">
                  <strong className="contactInformationName">John Doe</strong>
                  <span className="contactInformationEmail">
                    johndoe@gmail.com
                  </span>
                  <span className="contactInformationNumber">
                    +91 90000 00000
                  </span>
                </div>
                <div className="contactInformationBoxRight">
                  <div className="contactInformationBoxButtons">
                    <Button
                      className="buttonCircle editButton"
                      icon={<EditPencilIcon />}
                    ></Button>
                    <Button
                      className="buttonCircle removeButton"
                      icon={<CrossNewIcon />}
                    ></Button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Custom Guidelines Content */}
      <div className="registrationSublevelBlock">
        <div className="registrationSublevelBlockHeader">
          <div className="registrationSublevelBlockHeaderLeft">
            <Button
              className="registrationSublevelBlockBack"
              icon={<ArrowBackIcon />}
              onClick={() => handleUpdateConfig()}
            />
            <Typography.Title
              level={3}
              className="registrationSublevelBlockHeading"
            >
              Custom Guidelines
            </Typography.Title>
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            {/* <Button
            className="registrationSublevelResetButton"
            onClick={handleResetConfig}
            icon={<ReloadIcon />}
          >
            Reset Changes
          </Button> */}
            <Button
              className="registrationSublevelResetButton saveButton"
              icon={<TickIcon />}
              onClick={() => {
                handleUpdateCompetition();
                setSettingScreen("");
              }}
            >
              Save
            </Button>
          </div>
        </div>
        <div className="registrationSublevelBlockContent guidelinesInfoContent">
          <div className="registrationSublevelBlockType">
            <div className="registrationSublevelBlockTextbox">
              <Typography.Text className="registrationSublevelBlockSubtitle">
                These guidelines will be viewed by the contestants while
                registering for this competition
              </Typography.Text>
            </div>
          </div>
          <ul className="guidelinesInfoList">
            <li>Type up to 69 words...</li>
            <li></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export const RegistrationType = ({
  setSettingScreen,
  disableBtns,
  competition,
  setCompetitionType,
  competitionType,
  sameInstitute,
}) => {
  const [setUpMinTeamSize, setSetUpMinTeamSize] = useState(
    competition?.minTeamSize ? true : false
  );
  const [size, setSize] = useState({
    teamSize: competition?.teamSize,
    minTeamSize: competition?.minTeamSize,
  });

  // useEffect(() => {
  //   if (competitionType === "TEAM") {
  //     setSetUpMinTeamSize(true);
  //   }
  // }, [competitionType]);

  const dispatch = useDispatch();
  const handleUpdateCompetition = () => {
    dispatch(
      updateCompetitionDetails({
        competitionType: competitionType,
        teamSize: size.teamSize,
        minTeamSize: size.minTeamSize,
        isBelongsToSameOrgOrInstitute:
          competitionType === "SOLO" ? false : sameInstitute,
      })
    );
  };

  const handleResetChanges = () => {
    setCompetitionType(competition?.competitionType);
    setSize({
      teamSize: competition?.teamSize,
      minTeamSize: competition?.minTeamSize,
    });
    setSetUpMinTeamSize(competition?.minTeamSize ? true : false);
  };

  return (
    <div className="registrationSublevelBlock">
      <div className="registrationSublevelBlockHeader">
        <div className="registrationSublevelBlockHeaderLeft">
          <Button
            className="registrationSublevelBlockBack"
            icon={<ArrowBackIcon />}
            onClick={() => {
              // handleUpdateCompetition();
              setSettingScreen("");
            }}
          />
          <Typography.Title
            level={3}
            className="registrationSublevelBlockHeading"
          >
            Registration Type
          </Typography.Title>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <Button
            className="registrationSublevelResetButton"
            icon={<ReloadIcon />}
            onClick={handleResetChanges}
          >
            Reset Changes
          </Button>
          <Button
            className="registrationSublevelResetButton saveButton"
            icon={<TickIcon />}
            onClick={() => {
              handleUpdateCompetition();
              setSettingScreen("");
            }}
          >
            Save
          </Button>
        </div>
      </div>
      <div className="registrationSublevelBlockContent">
        <div className="registrationSublevelBlockType">
          <Typography.Text className="registrationSublevelBlockSubtitle">
            Choose Participation type
          </Typography.Text>
          <div className="registrationSublevelBlockOptions">
            <Radio.Group
              value={competitionType}
              onChange={(e) => setCompetitionType(e.target.value)}
            >
              <Radio value={"TEAM"}>
                {" "}
                <Image
                  src="https://rethink-competitions.s3.amazonaws.com/1675703047665_teamimage.png"
                  alt="Team"
                  height={50}
                  width={500}
                  preview={false}
                />
              </Radio>
              <Radio
                value={"SOLO"}
                disabled={
                  disableBtns.switchSolo &&
                  competition?.competitionType === "TEAM"
                }
              >
                {" "}
                <Image
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
        {competitionType === "TEAM" && (
          <div className="counterFormElementWrapper">
            {setUpMinTeamSize && (
              <CounterInput
                competition={competition}
                minCount={1}
                type="MIN"
                defaultValue={size?.minTeamSize || 1}
                teamSizeData={size}
                setupMinTeamSize={setUpMinTeamSize}
                disableBtns={disableBtns}
                onChange={(value) => {
                  setSize({ ...size, minTeamSize: value });
                }}
              />
            )}
            <CounterInput
              competition={competition}
              minCount={2}
              defaultValue={size.teamSize || 2}
              teamSizeData={size}
              setupMinTeamSize={setUpMinTeamSize}
              disableBtns={disableBtns}
              onChange={(value) => {
                setSize({ ...size, teamSize: value });
              }}
            />
          </div>
        )}
        {competitionType === "TEAM" && (
          <div className="registrationSublevelBlockSwitcher">
            <Typography.Text className="registrationSublevelBlockSubtitle">
              Set Up a max/min team Size
            </Typography.Text>
            <Switch
              checked={setUpMinTeamSize}
              onChange={(e) => {
                setSetUpMinTeamSize(e);
                if (!e) {
                  setSize({ ...size, minTeamSize: null });
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const RegistrationForm = ({ setSettingScreen }) => {
  const [formOptionalFields, setFormOptionalFields] = useState([]);

  const addNewField = () => {
    const newField = {
      isActive: true,
      fieldName: "Untitled Field",
      isRequired: false,
      fieldType: "short answer",
      fieldOptions: ["Option 1", "Option 2"],
    };
    setFormOptionalFields([...formOptionalFields, newField]);
  };

  const deleteField = (index) => {
    const newFormOptionalFields = [...formOptionalFields];
    newFormOptionalFields.splice(index, 1);
    setFormOptionalFields(newFormOptionalFields);
  };

  const updateField = (index, value) => {
    const newFormOptionalFields = [...formOptionalFields];
    newFormOptionalFields[index] = value;
    setFormOptionalFields(newFormOptionalFields);
  };

  const typeOptins = [
    { label: "Short Answer", value: "short answer" },
    { label: "Paragrapg", value: "paragraph" },
    { label: "Multiple Choice", value: "multiple choice" },
    { label: "Checkbox", value: "checkbox" },
    { label: "Dropdown", value: "dropdown" },
    { label: "File Upload", value: "file upload" },
    { label: "Date", value: "date" },
    { label: "Time", value: "time" },
  ];

  return (
    <div>
      <div>
        <Button icon={<ArrowBackIcon />} onClick={() => setSettingScreen("")} />
        <Typography.Text> Registration Form </Typography.Text>
      </div>
      <div className="space-y-2 mt-4">
        <div className="border-y-2">
          <CheckCircleIcon />
          <Typography.Text>Name</Typography.Text>
        </div>
        <div className="border-y-2">
          <CheckCircleIcon />
          <Typography.Text>Email</Typography.Text>
        </div>
        <div className="border-y-2">
          <CheckCircleIcon />
          <Typography.Text>Organisation/Institute</Typography.Text>
          {/* <div>
            <Checkbox />
            <Typography.Text>Request Organisation/institute ID</Typography.Text>
          </div> */}
        </div>
        <div className="border-y-2">
          <CheckCircleIcon />
          <Typography.Text>Date of Birth (D.O.B)</Typography.Text>
        </div>
        <div className="border-y-2">
          {/* <Checkbox /> */}
          <Typography.Text>Phone Number</Typography.Text>
        </div>
        {formOptionalFields.map((field, index) => {
          return (
            <div className="border-y-2 py-3" key={index}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={field?.isActive}
                    onChange={(e) =>
                      updateField(index, {
                        ...field,
                        isActive: e.target.checked,
                      })
                    }
                  />
                  <Input
                    value={field?.fieldName}
                    onChange={(e) =>
                      updateField(index, {
                        ...field,
                        fieldName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Typography.Text>Required</Typography.Text>
                  <Switch
                    checked={field?.isRequired}
                    onChange={(e) =>
                      updateField(index, { ...field, isRequired: e })
                    }
                  />
                  <Button
                    icon={<DeleteIcon />}
                    onClick={() => deleteField(index)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Select
                  style={{ width: "40%" }}
                  value={field?.fieldType}
                  onChange={(value) =>
                    updateField(index, { ...field, fieldType: value })
                  }
                  options={typeOptins}
                />
                {field?.fieldType === "multiple choice" ? (
                  <div className="w-[50%]">
                    {field?.fieldOptions?.map((option, i) => {
                      const updateOption = (value) => {
                        const newFieldOptions = [...field?.fieldOptions];
                        newFieldOptions[i] = value;
                        updateField(index, {
                          ...field,
                          fieldOptions: newFieldOptions,
                        });
                      };

                      const deleteOption = () => {
                        const newFieldOptions = [...field?.fieldOptions];
                        newFieldOptions.splice(i, 1);
                        updateField(index, {
                          ...field,
                          fieldOptions: newFieldOptions,
                        });
                      };

                      return (
                        <Input
                          key={i}
                          placeholder="Enter Option"
                          value={option}
                          addonAfter={
                            i > 1 && (
                              <Button
                                icon={<DeleteIcon />}
                                onClick={() => deleteOption(i)}
                              />
                            )
                          }
                          onChange={(e) => updateOption(e.target.value)}
                        />
                      );
                    })}
                    <Button
                      icon={<PlusIcon />}
                      onClick={() =>
                        updateField(index, {
                          ...field,
                          fieldOptions: [
                            ...field?.fieldOptions,
                            `Option ${field?.fieldOptions?.length + 1}`,
                          ],
                        })
                      }
                    >
                      Add Option
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
        {/* <Button icon={<PlusIcon />} onClick={addNewField}>
          Add a Custom Field
        </Button> */}
      </div>
    </div>
  );
};

const RegistrationSettingsV1_2 = ({
  registrationSetting,
  setSettingScreen,
  competition,
  roomState,
  disableBtns,
  containers,
}) => {
  const token = encodeBase64(useSelector((state) => state.auth.slamittToken));
  const dispatch = useDispatch();
  const [selectExportRegistration, setSelectExportRegistration] = useState({
    value: "all",
    label: "All Registrations",
    competitionCode: competition?.competitionCode,
  });
  const [limitRegistrationPerInstitute, setLimitRegistrationPerInstitute] =
    useState(
      !competition?.interIntraConfig?.limitRegistrationPerInstitute
        ? false
        : true
    );
  const [interIntraConfig, setInterIntraConfig] = useState(
    competition?.interIntraConfig || {
      type: "INTER",
    }
  );

  let exportRegistrationOptions = [
    {
      label: "All Registrations",
      value: "all",
      competitionCode: competition?.competitionCode,
    },
  ];
  roomState?.all?.map((room) => {
    exportRegistrationOptions.push({
      label: `${room?.roomName} List (${room?.containersCount || 0})`,
      value: room?.competitionRoomCode,
      competitionCode: room?.competitionCode,
    });
  });

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
              disabled={
                findUnassigned(containers).length === 0 ||
                competition?.status !== "ACTIVE"
              }
              onChange={(e) => {
                dispatch(
                  updateCompetitionDetails({ useContainerCodePreDefined: e })
                );
              }}
              defaultChecked={competition?.useContainerCodePreDefined}
            />
          </Tooltip>
        ) : (
          <Switch
            disabled={
              findUnassigned(containers).length === 0 ||
              competition?.status !== "ACTIVE"
            }
            onChange={(e) => {
              dispatch(
                updateCompetitionDetails({ useContainerCodePreDefined: e })
              );
            }}
            defaultChecked={competition?.useContainerCodePreDefined}
          />
        )}
      </div>
    );
  };

  return (
    <div className="settingsNewWrapper">
      <div className="mobileSettingHeader visibleTabletMobile">
        <RegistrationIcon />
        <strong className="mobileSettingTitle">Registration Settings</strong>
      </div>{" "}
      {/* registration on or off */}
      <div className="regSettingsRow bgRow">
        <div
          className={`regSettingsHeader ${
            competition?.allowRegistration ? "" : "closed"
          }`}
        >
          {competition?.status === "ACTIVE" ? (
            <>
              <Typography.Title level={3}>
                Registrations are{" "}
                {competition?.allowRegistration ? "Open" : "Closed"}
              </Typography.Title>
              {competition?.allowRegistration && (
                <Typography.Text
                  copyable={{
                    text: routeGenerator(
                      routes.inviteParticipantRegistration,
                      {
                        competitionCode: competition?.competitionCode,
                        roomCode: roomState?.selected?.roomCode || "qualified",
                        token: token,
                      },
                      true
                    ),
                  }}
                  className="linkCopy"
                >
                  <span className="linkCopyText">
                    <img
                      src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1676919440568_Vector.svg"
                      alt=""
                    />
                    <span className="linkCopyTextLink">
                      {routeGenerator(
                        routes.inviteParticipantRegistration,
                        {
                          competitionCode: competition?.competitionCode,
                          roomCode:
                            roomState?.selected?.roomCode || "qualified",
                          token: token,
                        },
                        true
                      )}
                    </span>
                  </span>
                </Typography.Text>
              )}
            </>
          ) : (
            <Typography.Text className="textConcludedNote">
              Registrations concluded at{" "}
              {moment(competition?.updatedAt).format("hh:mm A")} on{" "}
              {moment(competition?.updatedAt).format("DD/MM/YYYY")}
            </Typography.Text>
          )}
          {competition?.status === "ACTIVE" && (
            <Switch
              checked={competition?.allowRegistration}
              disabled={competition?.status !== "ACTIVE"}
              onChange={(e) => {
                if (
                  competition?.competitionType === "TEAM" &&
                  !competition?.teamSize
                ) {
                  setSettingScreen("REGISTRATION_TYPE");
                } else
                  dispatch(
                    updateCompetitionDetails({
                      allowRegistration: e,
                    })
                  );
              }}
            />
          )}
        </div>
      </div>
      {/* inter or intra college */}
      {/* <div className="regSettingsRow">
        <div className="regSettingsHeader">
          <Typography.Title level={3}>Configure Competition</Typography.Title>
          <div className="regSettingsInteraInfo">
            {interIntraConfig?.type === "INTER" ? (
              <Image
                src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1676921981470_image_426.png"
                alt=""
                preview={false}
              />
            ) : (
              <Image
                src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1676922200568_image_425.png"
                alt=""
                preview={false}
              />
            )}
            <div className="regSettingsInteraInfoTextbox">
              <Typography.Text className="regSettingsInteraInfoTitle">
                {interIntraConfig?.type === "INTER" ? "Inter" : "Intra"}
              </Typography.Text>
              <Typography.Text className="regSettingsInteraInfoText">
                {interIntraConfig?.type === "INTER"
                  ? "Competition will be open to ALL organisations/Institutes"
                  : `This competition entry will be restricted ${interIntraConfig?.interInstitutes[0]?.label}`}
              </Typography.Text>
            </div>
          </div>
          <Button
            className="linkEdit"
            onClick={() => setSettingScreen("CONFIG_INTER_INTRA")}
            icon={<EditPencilIcon />}
          >
            Edit
          </Button>
        </div>

        {interIntraConfig?.type === "INTER" && (
          <div className="regSettingsHolder">
            <div className="regSettingsInteraInfoStatus">
              <CheckedGreenIcon
                className={`${
                  !interIntraConfig?.restrictEntryToSpesificInstitutes
                    ? "checkIcon text-green-600"
                    : ""
                }`}
              />
              <Typography.Text>
                Entry is{" "}
                {!interIntraConfig?.restrictEntryToSpesificInstitutes
                  ? "open"
                  : "closed"}{" "}
                to all Organisations/Institutes
              </Typography.Text>
            </div>
          </div>
        )}
      </div> */}
      {/* config commpetition type */}
      {/* <div className="regSettingsRow registrationComType">
        <div className="regSettingsHeader">
          <Typography.Title level={3}>Registration Type</Typography.Title>
          <div className="regSettingsInteraInfo comType">
            {competition?.competitionType === "SOLO" ? (
              <Image
                src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1676923409112_image_30.png"
                alt=""
                preview={false}
              />
            ) : (
              <Image
                src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1676923350999_image_31.png"
                alt=""
                preview={false}
              />
            )}
            <div className="regSettingsInteraInfoTextbox">
              <Typography.Text className="regSettingsInteraInfoTitle">
                {competition?.competitionType === "SOLO" ? "Solo" : "Team"}
              </Typography.Text>
              <Typography.Text className="regSettingsInteraInfoText">
                {competition?.minTeamSize
                  ? `Min ${competition?.minTeamSize} Max ${competition?.teamSize} Members`
                  : competition?.teamSize
                  ? `Team Size ${competition?.teamSize} Members`
                  : ""}
              </Typography.Text>
            </div>
          </div>
          {competition?.competitionType === "SOLO" ? (
            <Button
              className="linkEdit"
              icon={<EditPencilIcon />}
              onClick={() => setSettingScreen("REGISTRATION_TYPE")}
            >
              Edit
            </Button>
          ) : (
            <Button
              className={`linkEdit ${
                competition?.teamSize ? "" : "configureButton"
              }`}
              icon={<EditPencilIcon />}
              onClick={() => setSettingScreen("REGISTRATION_TYPE")}
            >
              {competition?.teamSize ? "Edit" : "Configure Team Settings"}
            </Button>
          )}
        </div>
      </div> */}
      {/* registration preferences */}
      <div className="regSettingsRow">
        <div className="regSettingsHeader preferencesHeader">
          <Typography.Title level={3}>
            <Image
              preview={false}
              src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1676925950738_image_419.png"
              alt="Basic Settings"
            />
            Registration Preferences
          </Typography.Title>
        </div>
        {/* preferences */}

        <div className="regSettingsHolder">
          <div className="regSettingsRow registrationComType">
            <div className="regSettingsHeader">
              <Typography.Title level={3}>Registration Type</Typography.Title>
              <div className="regSettingsInteraInfo comType">
                {competition?.competitionType === "SOLO" ? (
                  <Image
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1676923409112_image_30.png"
                    alt=""
                    preview={false}
                  />
                ) : (
                  <Image
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1676923350999_image_31.png"
                    alt=""
                    preview={false}
                  />
                )}
                <div className="regSettingsInteraInfoTextbox">
                  <Typography.Text className="regSettingsInteraInfoTitle">
                    {competition?.competitionType === "SOLO"
                      ? "Solo"
                      : `Team ${
                          competition?.minTeamSize
                            ? `(${competition?.minTeamSize} - ${competition?.teamSize} Members)`
                            : competition?.teamSize
                            ? `of ${competition?.teamSize}`
                            : ""
                        }`}
                  </Typography.Text>
                  <Typography.Text className="regSettingsInteraInfoText">
                    {competition?.minTeamSize
                      ? `(Team of  ${competition?.minTeamSize} - ${competition?.teamSize} Members)`
                      : competition?.teamSize
                      ? `Team of ${competition?.teamSize}`
                      : ""}
                  </Typography.Text>
                </div>
              </div>
              {competition?.status === "ACTIVE" && (
                <>
                  {competition?.competitionType === "SOLO" ? (
                    <Button
                      className="linkEdit"
                      icon={<EditPencilIcon />}
                      onClick={() => setSettingScreen("REGISTRATION_TYPE")}
                    >
                      Edit
                    </Button>
                  ) : (
                    <Button
                      className={`linkEdit ${
                        competition?.teamSize ? "" : "configureButton"
                      }`}
                      icon={<EditPencilIcon />}
                      onClick={() => setSettingScreen("REGISTRATION_TYPE")}
                    >
                      {competition?.teamSize
                        ? "Edit"
                        : "Configure Team Settings"}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
          {/* Need to remove mb-0 when we uncomment export registration  */}
          <ul className="registrationPreferencesList mb-0">
            {interIntraConfig?.type === "INTER" &&
              competition?.competitionType !== "SOLO" && (
                <li>
                  <Typography.Text>
                    Require participants within a team to belong to the same
                    Organisation/Institute
                  </Typography.Text>
                  {disableBtns?.switchSameInstitute ? (
                    <Tooltip
                      title={"Already different institutes users are onboarded"}
                      trigger={"hover"}
                      placement="top"
                      color={"black"}
                    >
                      <Switch
                        // defaultChecked={competition?.isBelongsToSameOrgOrInstitute}
                        defaultChecked={
                          competition?.isBelongsToSameOrgOrInstitute
                        }
                        disabled={
                          disableBtns?.switchSameInstitute ||
                          competition?.status !== "ACTIVE"
                        }
                        onChange={(e) => {
                          dispatch(
                            updateCompetitionDetails({
                              isBelongsToSameOrgOrInstitute: e,
                            })
                          );
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <Switch
                      // defaultChecked={competition?.isBelongsToSameOrgOrInstitute}
                      defaultChecked={
                        competition?.isBelongsToSameOrgOrInstitute
                      }
                      disabled={
                        disableBtns?.switchSameInstitute ||
                        competition?.status !== "ACTIVE"
                      }
                      onChange={(e) => {
                        dispatch(
                          updateCompetitionDetails({
                            isBelongsToSameOrgOrInstitute: e,
                          })
                        );
                      }}
                    />
                  )}
                </li>
              )}
            {/* {interIntraConfig?.type === "INTER" && (
              <li>
                <Typography.Text>
                  Limit number of registrations per Organisation/Institute
                </Typography.Text>
                <Switch
                  value={limitRegistrationPerInstitute}
                  onChange={(e) => setLimitRegistrationPerInstitute(e)}
                />
                {limitRegistrationPerInstitute && (
                  <div className="registrationPreferencesCounterWrap">
                    <span className="registrationPreferencesTextItalic">
                      Maximum registrations that can be received from a
                      particular organisation/institute will be limited to this
                      number
                    </span>
                    <div className="counterFormElement">
                      <Input
                        min={1}
                        addonAfter={
                          <Button type="text" icon={<PlusOutlined />} />
                        }
                        readOnly={true}
                        value={4}
                        addonBefore={
                          <Button type="text" icon={<MinusOutlined />} />
                        }
                      />
                    </div>
                    <Button
                      className="registrationPreferencesButton"
                      type="text"
                      icon={<CheckOuntlineIcon />}
                    />
                  </div>
                )}
              </li>
            )} */}
            <li>
              <Typography.Text>
                Require{" "}
                {registrationSetting?.competitionType === "SOLO"
                  ? "participants"
                  : "teams"}{" "}
                to register by choosing from unassigned{" "}
                {registrationSetting?.competitionType === "TEAM"
                  ? "team"
                  : "participant"}{" "}
                codes{" "}
                <span className="text-gray">
                  ({findUnassigned(containers).length})
                </span>
              </Typography.Text>
              <ContainerPredefinedSwitch />
            </li>
          </ul>
          {/* export registrations */}
          <div className="basicSettingRow">
            <div className="basicSettingSubrow">
              <Typography.Text className="title">
                Export Registrations
              </Typography.Text>
              <div className="basicSettingHolder">
                <div className="basicSettingCVBox">
                  <div className="flex">
                    <AppSelect
                      className="settingsSelect"
                      placeholder={"Set Up"}
                      value={selectExportRegistration}
                      onChange={(e) => {
                        const selected = exportRegistrationOptions.find(
                          (option) => option.value === e
                        );
                        setSelectExportRegistration(selected);
                      }}
                      option={[...exportRegistrationOptions]}
                    />
                  </div>
                  <Button
                    className="downloadButton"
                    type="primary"
                    onClick={() => exportRegistration(selectExportRegistration)}
                    disabled={
                      findUnassigned(containers)?.length == containers?.length
                    }
                  >
                    <span className="hiddenMobile">Download</span>
                    <span className="visibleMobile">
                      <DownloadIcon />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
            {/* ggogle sync */}
            {/* <div className="basicSettingSubrow">
              <Typography.Text className="title">
                Sync Registrations
              </Typography.Text>
              <div className="basicSettingHolder">
                <Button className="buttonSync" type={"ghost"}>
                  Sync with Google Sheets
                </Button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      {/* registrations form */}
      {/* <div
        onClick={() => setSettingScreen("REGISTRATION_FROM")}
        className="regSettingsRow registrationFormSetting"
      >
        <div className="regSettingsHeader">
          <Typography.Title level={3}>
            <Image
              preview={false}
              src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1676926166563_image_424.png"
              alt="Basic Settings"
            />
            Registration Form
          </Typography.Title>
          <ArrowRightIcon classID="iconArrow" className="registrationIconArrow" />
        </div>
      </div> */}
    </div>
  );
};

export default RegistrationSettingsV1_2;
