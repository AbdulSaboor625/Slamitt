import { Button, Image, Input, Radio, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AppModal from ".";
import { addOrUpdateCompetitionDetails } from "../../Redux/Actions";
import { getCategories } from "../../requests/category";
import { capitalize } from "../../utility/common";
import { EditIcon, EditPencilIcon } from "../../utility/iconsLibrary";
import { solo, team } from "../../utility/imageConfig";
import AppCustomPicker from "../AppCustomPicker";
import AppSelect from "../AppSelect";

const SelectSubCategory = ({
  isVisible,
  setVisible,
  subCategories,
  setSelected,
  selected,
  setShowSubSelect,
}) => {
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const dispatch = useDispatch();

  const selectSubCat = (c) => {
    if (selectedSubCategories.includes(c?.categoryNameSubCategoryNameCode)) {
      setSelectedSubCategories(
        selectedSubCategories.filter(
          (sc) => sc !== c?.categoryNameSubCategoryNameCode
        )
      );
    } else {
      setSelectedSubCategories([
        ...selectedSubCategories,
        c?.categoryNameSubCategoryNameCode,
      ]);
    }
  };

  const onDone = () => {
    const allSelected = [...selectedSubCategories];
    const subCat = subCategories.filter((sc) =>
      allSelected.includes(sc?.categoryNameSubCategoryNameCode)
    );
    dispatch(
      addOrUpdateCompetitionDetails({
        categoryName: selectedSubCategories,
      })
    );
    setSelected(subCat);
    setSelectedSubCategories([]);
    setVisible(false);
  };

  useEffect(() => {
    setSelectedSubCategories(
      selected.map((sel) => sel?.categoryNameSubCategoryNameCode)
    );
  }, [selected]);

  return (
    <AppModal
      className="mobileSubCategoriesModal"
      isVisible={isVisible}
      onOk={() => {
        setVisible(false);
      }}
      onCancel={() => {
        setVisible(false);
      }}
      footer={
        <>
          <Button
            type="primary"
            disabled={selectedSubCategories.length < 1}
            onClick={() => {
              setShowSubSelect(false);
              onDone();
            }}
          >
            Done
          </Button>
        </>
      }
    >
      <div className="mobileSubCategoriesModalContent">
        <Typography.Text className="mobileSubCategoriesTitle">
          Select sub categories
        </Typography.Text>
        <div className="mobileSubCategoriesList">
          {subCategories
            ? subCategories.map((c, i) => {
                return (
                  <div
                    key={i}
                    className={`mobileSubCategoriesListItem ${
                      selectedSubCategories.includes(
                        c?.categoryNameSubCategoryNameCode
                      )
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                    onClick={() => selectSubCat(c)}
                  >
                    <Typography.Text>{c?.subCategoryName}</Typography.Text>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </AppModal>
  );
};

export default function CreateCompMobilePhase({
  competition,
  createCompetition,
}) {
  const [categories, setCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [previousCategory, setPreviousCategory] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [visibleSubCategory, setVisibleSubCategory] = useState(false);
  const [showSubSelect, setShowSubSelect] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchData() {
      const categories = await getCategories();
      if (categories) {
        setCategories(categories?.map((c) => ({ ...c, image: c?.imageUrl })));
      }
    }

    fetchData();
  }, []);

  return (
    <div className="launchCompetitionModalMobileContent">
      <Typography.Title level={4} className="launchCompetitionModalMobileTitle">
        Launch Competition
      </Typography.Title>
      <Typography.Text className="launchCompetitionModalMobilesubTitle">
        You can edit these settings later.
      </Typography.Text>
      <AppCustomPicker
        className="tabset"
        popOverClass="m-5"
        tabpaneClass="m-5"
        onImageSelected={(e) => {
          dispatch(addOrUpdateCompetitionDetails({ image: e }));
        }}
      />
      <Input
        className="nameCompetitionField"
        onInput={(e) => (e.target.value = capitalize(e.target.value))}
        placeholder="Name Your Competition"
        onBlur={(e) =>
          dispatch(
            addOrUpdateCompetitionDetails({ competitionName: e.target.value })
          )
        }
      />
      <Typography.Text className="lbl">Select a Category</Typography.Text>
      <AppSelect
        option={categories}
        onSelect={(e) => {
          //replace onChange with onSelect
          const selected = categories.find((c) => c.value === e);
          if (selected?.categoryCode !== subCategories?.[0]?.categoryCode) {
            !!selectedSubCategory.length &&
              setPreviousCategory(selectedSubCategory);
            setShowSubSelect(true);
            setTimeout(() => {
              setSelectedSubCategory([]);
            }, 0);
          }
          if (!!previousCategory.length) {
            if (previousCategory[0].categoryCode === selected.categoryCode) {
              setTimeout(() => {
                setSelectedSubCategory(previousCategory);
                setShowSubSelect(false);
              }, 0);
            }
          }

          selected?.categoryCode === "other"
            ? setSelectedSubCategory([])
            : setSubCategories(selected.subCategory);
        }}
        iconShow={true}
        bordered={false}
        placeholder="Select Category"
      />
      {((!!subCategories.length && !selectedSubCategory.length) ||
        showSubSelect) && (
        <div onClick={() => setVisibleSubCategory(true)}>
          <AppSelect
            notFoundContent={null}
            placeholder={"Select Sub-Category"}
          />
        </div>
      )}
      <div className="mobileSubCategoriesListSelected">
        {!!selectedSubCategory.length &&
          !showSubSelect &&
          selectedSubCategory.map((sub, i) => (
            <div key={i} className="mobileSubCategoriesListSelectedItem">
              <Typography.Text>{sub?.subCategoryName}</Typography.Text>
            </div>
          ))}
        {selectedSubCategory.length > 0 && (
          <Button
            className="buttonEdit"
            icon={<EditPencilIcon />}
            onClick={() => setVisibleSubCategory(true)}
          />
        )}
      </div>
      <Typography.Text className="lbl">
        Select Participation Type
      </Typography.Text>
      <div className="competitionSelection">
        <Radio.Group
          buttonStyle={"solid"}
          optionType="button"
          onChange={(e) =>
            dispatch(
              addOrUpdateCompetitionDetails({ competitionType: e.target.value })
            )
          }
        >
          <Radio value={"SOLO"}>
            {" "}
            <Image
              preview={false}
              src={solo}
              height={100}
              width={100}
              alt="thumbnail"
            />
          </Radio>
          <Radio value={"TEAM"}>
            {" "}
            <Image
              preview={false}
              src={team}
              height={100}
              width={100}
              alt="thumbnail"
            />
          </Radio>
        </Radio.Group>
      </div>
      <Button
        type="primary"
        onClick={() => {
          createCompetition();
          setVisibleSubCategory(false);
        }}
        disabled={
          !Boolean(competition.create.categoryName.length > 0) ||
          !Boolean(competition.create.competitionName) ||
          !Boolean(competition.create.competitionType) ||
          !Boolean(
            competition.create.image?.url || competition.create.image?.emoji
          )
        }
      >
        CREATE COMPETITION
      </Button>
      <SelectSubCategory
        setSelected={setSelectedSubCategory}
        selected={selectedSubCategory}
        subCategories={subCategories}
        isVisible={visibleSubCategory}
        setVisible={setVisibleSubCategory}
        setShowSubSelect={setShowSubSelect}
      />
    </div>
  );
}
