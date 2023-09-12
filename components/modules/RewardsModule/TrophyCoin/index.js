import { Input } from "antd";
import React from "react";
import AppCustomPicker from "../../../AppCustomPicker";
import { useState } from "react";
import {
  AddImageButton,
  EditPencilIcon,
} from "../../../../utility/iconsLibrary";
import { useEffect } from "react";

const TrophyCoin = ({
  onMedalSelected,
  onTrophySelected,
  reward,
  setReward,
}) => {

  const [trophies, setTrophies] = useState([{ label: "", editable: false }]);
  const [medals, setMedals] = useState([{ label: "", editable: false }]);
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (!!reward?.trophies?.length) {
      setTrophies(reward?.trophies);
    }
    if (!!reward?.medals?.length) {
      setMedals(reward?.medals);
    }
  }, [reward]);

  const deleteTrophy = (idx) => {
    const filteredPrizes = trophies.filter((item, index) => idx != index);
    setTrophies(filteredPrizes);
    onTrophySelected(filteredPrizes);
  };

  const deleteMedal = (idx) => {
    const filteredPrizes = medals.filter((item, index) => idx != index);
    setMedals(filteredPrizes);
    onMedalSelected(filteredPrizes);
  };

  return (
    <div className="rewardsSidebarContent">
      <strong className="certificatesEditorSidebarTitle">
        TROPHIES AND MEDALS
      </strong>
      <div className="uploadPrizesListCategories">
        <span className="certificatesEditorSidebarTag">Upload TROPHIES</span>
        <div className="uploadPrizesList">
          {trophies.map((item, index) => (
            <div className="uploadPrizeBox" key={index}>
              <AppCustomPicker
                className="tabset"
                popOverClass="m-5"
                tabpaneClass="m-5"
                onImageSelected={(e) => {
                  item.image = {
                    type: e.type,
                    emoji: e.emoji,
                    url: e.url,
                  };
                  setRender(!render);
                  onTrophySelected(trophies);
                }}
                rewardSection={true}
                rewardImage={item?.image}
                showLink={false}
                showHoverButtons={true}
                onDeletePrize={deleteTrophy}
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
                    onTrophySelected(trophies);
                  }}
                  onBlur={() => {
                    item.editable = false;
                    setRender(!render);
                    onTrophySelected(trophies);
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
              setTrophies([...trophies, ...[{ label: "", editable: false }]]);
            }}
          >
            <AddImageButton />
          </div>
        </div>
      </div>
      <div className="uploadPrizesListCategories">
        <span className="certificatesEditorSidebarTag">Upload MEDALS</span>
        <div className="uploadPrizesList">
          {medals.map((item, index) => (
            <div className="uploadPrizeBox" key={index}>
              <AppCustomPicker
                className="tabset"
                popOverClass="m-5"
                tabpaneClass="m-5"
                onImageSelected={(e) => {
                  item.image = {
                    type: e.type,
                    emoji: e.emoji,
                    url: e.url,
                  };
                  setRender(!render);
                  onMedalSelected(medals);
                }}
                rewardSection={true}
                rewardImage={item?.image}
                showLink={false}
                showHoverButtons={true}
                onDeletePrize={deleteMedal}
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
                    onMedalSelected(medals);
                  }}
                  onBlur={() => {
                    item.editable = false;
                    setRender(!render);
                    onMedalSelected(medals);
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
              setMedals([...medals, ...[{ label: "", editable: false }]]);
            }}
          >
            <AddImageButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrophyCoin;
