import React, { useState } from "react";
import AppCustomPicker from "../../../AppCustomPicker";
import { Input } from "antd";
import {
  AddImageButton,
  EditPencilIcon,
} from "../../../../utility/iconsLibrary";
import { useEffect } from "react";

const RewardsCoin = ({ onRewardSelection, setReward, reward }) => {
  const [render, setRender] = useState(false);
  const [prizes, setPrizes] = useState([
    { label: "", image: { type: "", url: "", emoji: "" }, editable: false },
  ]);

  useEffect(() => {
    if (!!reward?.prizes?.length) setPrizes(reward?.prizes);
  }, [reward]);

  const deletePrize = (idx) => {
    const filteredPrizes = prizes.filter((item, index) => idx != index);
    setPrizes(filteredPrizes);
    onRewardSelection(filteredPrizes);
  };

  return (
    <div className="rewardsSidebarContent">
      <strong className="certificatesEditorSidebarTitle">Prizes</strong>
      <span className="certificatesEditorSidebarTag">Upload Prize</span>
      <div className="uploadPrizesList">
        {prizes.map((item, index) => (
          <div className="uploadPrizeBox" key={index}>
            <AppCustomPicker
              className="tabset"
              popOverClass="m-5"
              tabpaneClass="m-5"
              showCashPrize={true}
              onImageSelected={(e) => {
                if (!e.emoji && !e.url) {
                  item.label = e;
                  item.image = {
                    type: "CASH",
                    url: "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1687787350764_Group_238940.png",
                  };
                  setRender(!render);
                } else {
                  item.image = {
                    type: e.type,
                    emoji: e.emoji,
                    url: e.url,
                  };
                  setRender(!render);
                }
                onRewardSelection(prizes);
              }}
              rewardSection={true}
              rewardImage={item?.image}
              showHoverButtons={true}
              onDeletePrize={deletePrize}
              index={index}
            />
            <div className="uploadPrizeTitle">
              <Input
                type="text"
                disabled={!item.editable}
                placeholder="label"
                value={item.label}
                onChange={(e) => {
                  item.label = e.target.value;
                  setRender(!render);
                }}
                onPressEnter={() => {
                  item.editable = false;
                  setRender(!render);
                  onRewardSelection(prizes);
                }}
                onBlur={() => {
                  item.editable = false;
                  setRender(!render);
                  onRewardSelection(prizes);
                }}
              />

              {!item.editable && (
                <div
                  className="buttonEdit"
                  onClick={() => {
                    item.editable = true;
                    setRender(!render);
                  }}
                >
                  <EditPencilIcon />
                </div>
              )}
            </div>
          </div>
        ))}
        <div
          className="addMoreBox"
          onClick={() => {
            setPrizes([...prizes, ...[{ label: "", editable: false }]]);
          }}
        >
          <AddImageButton />
        </div>
      </div>
    </div>
  );
};

export default RewardsCoin;
