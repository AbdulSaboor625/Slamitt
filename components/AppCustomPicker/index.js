import { CloseOutlined } from "@ant-design/icons";
import { Button, Image, Input, Popover, Tabs } from "antd";
import { useEffect, useState } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import {
  CashImage,
  DeleteIcon,
  EditPencilIcon,
  ImageUploadIcon,
} from "../../utility/iconsLibrary";
import AppEmojiPicker from "../AppEmojiPicker";
import AppUploadBox from "../AppUploadBox";

const AppCustomPicker = ({
  className,
  tabpaneClass,
  popOverClass,
  defaultValue,
  onImageSelected,
  showLink = true,
  emojiStyle = null,
  imgStyle = null,
  defaultImage = null,
  showClearButton = true,
  disabled = false,
  showCashPrize = false,
  showHoverButtons = false,
  onDeletePrize,
  index,
  rewardSection = false,
  rewardImage,
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [isVisible, setVisible] = useState(false);

  const type = Object.freeze({
    LINK: "LINK",
    EMOJI: "EMOJI",
  });

  useEffect(() => {
    setImageDetails({
      type: defaultValue?.type || type.LINK,
      url: defaultValue?.url || "",
      emoji: defaultValue?.emoji || "",
    });
  }, [defaultValue]);

  useEffect(() => {
    if (rewardSection && rewardImage) {
      if (rewardImage?.type === "CASH") {
        setImageDetails({
          ...imgDetails,
          url: "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1693937655009_cash.png",
          type: type.LINK,
        });
      } else {
        setImageDetails({
          emoji: rewardImage?.emoji,
          url: rewardImage?.url,
          type: rewardImage?.type,
        });
      }
    }
  }, [rewardImage]);

  const [link, setLink] = useState("");

  const [imgDetails, setImageDetails] = useState({
    type: defaultValue?.type || type.LINK,
    url: defaultValue?.url || "",
    emoji: defaultValue?.emoji || "",
  });

  const onImageSelectedHandler = (objType, obj) => {
    const payload = {
      type: type.LINK,
      url: null,
      emoji: null,
    };
    if (objType === type.LINK) {
      setImageDetails({
        ...imgDetails,
        url: obj.url,
        type: type.LINK,
      });
      payload.url = obj.url;
    } else if (objType === type.EMOJI) {
      setImageDetails({
        ...imgDetails,
        emoji: obj,
        type: type.EMOJI,
      });
      payload.emoji = obj;
      payload.type = type.EMOJI;
    } else if (objType == "CASH") {
      setImageDetails({
        ...imgDetails,
        url: "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1693937655009_cash.png",
        type: type.LINK,
      });
      setVisible(false);
      onImageSelected(obj);
      return;
    }
    setVisible(false);
    onImageSelected(payload);
  };

  const content = (
    <div
      className="editPopupStyles"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#fff8",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className={`emojiPickerHolder ${isMobile && "w-full"}`}
        style={{
          backgroundColor: "#fff",
          zIndex: 99999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "20px",
          borderWidth: "2px",
          padding: "10px",
        }}
      >
        <Button
          className="buttonPopoverClose"
          type="text"
          icon={<CloseOutlined />}
          onClick={() => setVisible(false)}
        />
        <Tabs defaultActiveKey="1" className={(className = "tabset")}>
          <Tabs.TabPane tab="Emojis" key="1" className={tabpaneClass}>
            <AppEmojiPicker
              getEmojiObject={(obj) => onImageSelectedHandler(type.EMOJI, obj)}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Upload Image" key="2" className={tabpaneClass}>
            <AppUploadBox
              setImageUploaded={(file) =>
                onImageSelectedHandler(type.LINK, { url: file.result.location })
              }
            >
              <>
                <Button>Choose an Image</Button>
                <p>Recommended size is 1080 x 1920 pixels</p>
              </>
            </AppUploadBox>
          </Tabs.TabPane>
          {showLink && (
            <Tabs.TabPane tab="Link" key="3" className={tabpaneClass}>
              {/* <FormField type={"text"} placeholder="Paste an image link" /> */}
              <Input
                className="inputstyle pasteLinkField"
                type={"text"}
                placeholder="Paste an image link"
                onChange={(e) => setLink(e.target.value)}
              />
              <Button
                type="primary"
                onClick={() => onImageSelectedHandler(type.LINK, { url: link })}
              >
                Done
              </Button>
              <p>Works with any image from the web</p>
            </Tabs.TabPane>
          )}
          {showCashPrize && (
            <Tabs.TabPane tab="Cash Prize" key="4" className={tabpaneClass}>
              <div className="cashPrizesTab">
                <strong className="title">Cash Prizes</strong>
                <div className="cashPrizesTabImage">
                  <CashImage />
                </div>
                <div className="cashPrizesTabField">
                  <label className="currencySymbol">₹</label>
                  <Input
                    className="inputstyle"
                    type="number"
                    placeholder="00.00"
                    onPressEnter={(e) =>
                      onImageSelectedHandler("CASH", e.target.value)
                    }
                  />
                  <span className="amountText">Amt.</span>
                </div>
              </div>
            </Tabs.TabPane>
          )}
        </Tabs>
        {showClearButton && (
          <Button
            type="secondary"
            className="buttonPopupClear"
            onClick={() => {
              setImageDetails({
                type: type.LINK,
                url: "",
                emoji: "",
              });
              onImageSelected({
                type: type.LINK,
                url: "",
                emoji: "",
              });
              setVisible(false);
            }}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );

  const CompetitionImage = () => {
    if (imgDetails.type === type.LINK) {
      return (
        <Image
          src={imgDetails.url}
          alt="img"
          preview={false}
          style={
            imgStyle || { height: "70px", width: "70px", cursor: "pointer" }
          }
          onClick={() => (disabled ? "" : setVisible(!isVisible))}
        />
      );
    }
    if (imgDetails.type === type.EMOJI) {
      return (
        <span
          className="uploadPrizeBoxEmoji"
          style={
            emojiStyle || {
              fontSize: "70px",
              lineHeight: "1",
              cursor: "pointer",
            }
          }
          onClick={() => (disabled ? "" : setVisible(!isVisible))}
        >
          {imgDetails.emoji.emoji}
        </span>
      );
    }
  };

  return (
    <Popover
      placement="bottom"
      title={null}
      content={content}
      trigger="click"
      className={popOverClass}
      visible={isVisible}
      zIndex={2001}
    >
      <div className="modalUploadSpacer">
        {imgDetails.url || imgDetails.emoji ? (
          <>
            <CompetitionImage />
            {showHoverButtons && (
              <div className="uploadPrizeBoxOptions">
                <Button
                  className="edit"
                  icon={<EditPencilIcon />}
                  onClick={() => setVisible(!isVisible)}
                />
                <Button
                  icon={<DeleteIcon />}
                  onClick={() => onDeletePrize(index)}
                />
              </div>
            )}
          </>
        ) : (
          <div
            className="modalUploadButton"
            onClick={() => (disabled ? "" : setVisible(!isVisible))}
          >
            {defaultImage ? (
              <Image src={defaultImage} alt="default" preview={false} />
            ) : (
              <>
                <ImageUploadIcon />
                <p>Set an Image</p>
              </>
            )}
          </div>
        )}
      </div>
    </Popover>
  );
};

export default AppCustomPicker;
