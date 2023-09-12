import { Input, Modal, Typography } from "antd";
import React, { useState } from "react";
import { capitalize } from "../../../../utility/common";
import AppCustomPicker from "../../../AppCustomPicker";
import CategoriesCarousel from "../../../CategoriesCarousel";
const EditBasicSettingsModal = ({
  editName,
  isVisible,
  setVisibility,
  competition,
  updateCompetiton,
  selected,
}) => {
  const [data, setData] = useState({
    competitionName: "",
    imageURL: null,
    emojiObject: null,
    subCategoryArray: [],
    categoryArray: [],
  });
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      paritialVisibilityGutter: 0,
    },
    tablet: {
      breakpoint: { max: 1024, min: 699 },
      items: 2,
      paritialVisibilityGutter: 50,
    },
    mobile: {
      breakpoint: { max: 699, min: 0 },
      items: 1,
      paritialVisibilityGutter: 30,
    },
  };
  const onUpdateDetails = () => {
    const payload = {};
    if (data.competitionName) payload.competitionName = data.competitionName;
    if (data.imageURL) {
      payload.imageURL = data.imageURL;
      payload.emojiObject = null;
    }
    if (data.emojiObject) {
      payload.emojiObject = data.emojiObject;
      payload.imageURL = null;
    }
    if (data.subCategoryArray.length)
      payload.subCategoryArray = data.subCategoryArray;
    if (data.categoryArray.length) payload.categoryArray = data.categoryArray;
    setData({
      competitionName: "",
      imageURL: null,
      emojiObject: null,
      subCategoryArray: [],
      categoryArray: [],
    });
    updateCompetiton(payload);
    setVisibility(false);
  };

  return (
    <Modal
      visible={isVisible}
      open={isVisible}
      className="nameCompetitionModal"
      // open={isVisible} // new version uses open instead of visible
      // visible={isVisible}
      onCancel={() => {
        setVisibility(false);
        setData({
          competitionName: "",
          imageURL: null,
          emojiObject: null,
          subCategoryArray: [],
          categoryArray: [],
        });
      }}
      onOk={onUpdateDetails}
      okText={"Save"}
      destroyOnClose
    >
      {editName ? (
        <>
          <Typography.Title className="modalHeading" level={3}>
            Update Competition Name and Logo
          </Typography.Title>
          <br />
          <AppCustomPicker
            className="tabset"
            popOverClass="m-5"
            tabpaneClass="m-5"
            defaultValue={{
              type: data?.imageURL
                ? "LINK"
                : data?.emojiObject
                ? "EMOJI"
                : competition?.imageURL
                ? "LINK"
                : "EMOJI",
              url: data.imageURL ? data.imageURL : competition.imageURL,
              emoji: data.emojiObject
                ? data.emojiObject
                : competition.emojiObject,
            }}
            onImageSelected={(image) =>
              image.type === "LINK"
                ? setData({ ...data, imageURL: image.url, emojiObject: null })
                : setData({ ...data, imageURL: null, emojiObject: image.emoji })
            }
          />
          <br />
          <div className="nameCompetitionForm largeText">
            <Input
              onInput={(e) => (e.target.value = capitalize(e.target.value))}
              placeholder="Name of Competition"
              defaultValue={competition.competitionName}
              onChange={(e) =>
                setData({ ...data, competitionName: e.target.value })
              }
            />
          </div>
        </>
      ) : (
        <>
          <Typography.Text className="subTitle">
            Select a Category
          </Typography.Text>
          <CategoriesCarousel
            competition={competition}
            responsive={responsive}
            itemOuterContainerClass="personaliseImageWrap"
            className="personaliseSlider"
            selectOneCategory={true}
            setCategoriesSelected={(categoryArray) => {
              setData({ ...data, categoryArray });
            }}
            selected={selected}
            preloadingParent={true}
          />
        </>
      )}
    </Modal>
  );
};

export default EditBasicSettingsModal;
