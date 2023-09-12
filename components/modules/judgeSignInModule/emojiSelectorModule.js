import { ReloadOutlined } from "@ant-design/icons";
import { Button, Image, Input, Slider, Typography } from "antd";
import React, { useState } from "react";
import {
  scoreSliderEmojis,
  initialSliderEmojis,
} from "../../../utility/config";
import { ReloadIcon } from "../../../utility/iconsLibrary";

const EmojiSelectorModule = ({ redirectToDashBoard }) => {
  let urls = scoreSliderEmojis;
  const [curVal, setCurVal] = useState(0);
  const [emojiUrl, setEmojiUrl] = useState(urls[0]);
  const [isTouched, setIsTouched] = useState(false);

  const onChange = (val) => {
    setCurVal(val);
    setEmojiUrl(urls[Math.floor(val / 5)]);
  };

  const handleTouch = (i) => {
    setEmojiUrl(urls[i]);
    setCurVal((i * 20) / 5);
    setIsTouched(true);
  };

  return (
    <div className="judgeFormEmojiRatings">
      <Typography.Title className="judgeFormEmojiRatingsTitle" level={5}>
        {!isTouched ? "Tap to pick an emoji" : "Move slider to assign points"}
      </Typography.Title>
      <div
        className={`judgeFormEmojiHolder ${
          !isTouched ? "judgeInitialEmoji" : ""
        }`}
      >
        <div
          className="judgeFormEmojiWrap"
          style={{
            position: "relative",
          }}
        >
          {isTouched && (
            <Button
              onClick={() => {
                setIsTouched(false);
                setCurVal(0);
                setEmojiUrl(urls[0]);
              }}
              icon={<ReloadIcon />}
              type="text"
              // style={{ paddingTop: "2.5rem" }}
              className="judgeFormEmojiResetButtona"
            />
          )}
          <div
            className="justify-between judgeFormEmojiView"
            style={{
              display: `${isTouched ? "none" : "flex"}`,
              zIndex: "1",
              position: "absolute",
              width: "100%",
              height: "100%",
              // backgroundColor: "red",
              marginTop: "-10px",
              // pointerEvents: "none",
            }}
          >
            {initialSliderEmojis.map((url, index) => (
              <Image
                key={url}
                src={url}
                onClick={() => handleTouch(index)}
                style={{ height: "40px", width: "40px" }}
                preview={false}
                alt="emoji"
              />
            ))}
          </div>
          <Slider
            style={{
              visibility: `${isTouched ? "visible" : "hidden"}`,
            }}
            className="score-slider w-full addStyles"
            tooltipVisible={false}
            handleStyle={{
              height: "90px",
              width: "90px",
              marginTop: "-59px",
              border: "0px",
              background: `url("${emojiUrl}") no-repeat`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "100%",
              backgroundColor: "transparent",
              backgroundPosition: "center",
            }}
            onChange={onChange}
            range={false}
            min={1}
            max={20}
            value={curVal}
            // step={10}
            defaultValue={1}
          />
        </div>
        <Typography.Text className="judgeFormEmojiCurrent">1</Typography.Text>
        <Typography.Text className="judgeFormEmojiFull">20</Typography.Text>
      </div>
      <div className="judgeFormLinkWrap">
        <Button
          style={{ marginTop: "3rem" }}
          className="tertiaryButton"
          type="text"
          onClick={redirectToDashBoard}
        >
          Skip and Enter Room
        </Button>
      </div>
    </div>
  );
};

export default EmojiSelectorModule;
