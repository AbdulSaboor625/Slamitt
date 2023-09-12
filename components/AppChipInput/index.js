import { PlusCircleOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import React, { useEffect, useState } from "react";
import { PlusIcon } from "../../utility/iconsLibrary";

import AppDropDown from "../AppDropdown";

const AppChipInput = ({ defaultSelectedCategory, originaList, onChange }) => {
  const [showingList, setShowingList] = useState(originaList);
  const [list, setList] = useState(originaList);
  const [dropDownList, setDropDownList] = useState(originaList);

  useEffect(() => {
    const modList = originaList.filter((item) => {
      const found = defaultSelectedCategory.find(
        (val) => val === item.categoryNameSubCategoryNameCode
      );
      if (found) {
        item.label = item.subCategoryName;
        item.value = item.categoryNameSubCategoryNameCode;
        return item;
      }
    });
    const originaModList = originaList.map((item) => {
      item.label = item.subCategoryName;
      item.value = item.categoryNameSubCategoryNameCode;
      return item;
    });
    setShowingList(modList);
    setList(modList);

    setDropDownList(
      originaModList.filter((val) => {
        return !modList.find(
          (item) =>
            item.categoryNameSubCategoryNameCode ===
            val.categoryNameSubCategoryNameCode
        );
      })
    );
  }, [originaList]);

  const onCloseTag = (tagValue) => {
    const newShowingList = showingList.filter(
      (item) => item.categoryNameSubCategoryNameCode !== tagValue
    );
    const temp = showingList.find(
      (item) => item.categoryNameSubCategoryNameCode === tagValue
    );
    setShowingList(newShowingList);
    setDropDownList([...dropDownList, temp]);
    onChange(
      newShowingList.map((item) => item.categoryNameSubCategoryNameCode)
    );
  };

  return (
    <div className="tagsList">
      {showingList.map((item) => (
        <Tag
          closable
          key={item.categoryNameSubCategoryNameCode}
          onClose={() => onCloseTag(item.categoryNameSubCategoryNameCode)}
        >
          {item.subCategoryName}
        </Tag>
      ))}{" "}
      {dropDownList.length ? (
        <AppDropDown
          iconShow={false}
          label={<PlusIcon />}
          menu={dropDownList}
          onClick={(item) => {
            const newShowingList = [...showingList, dropDownList[item.key]];
            setShowingList(newShowingList);
            setDropDownList(
              dropDownList.filter((val) => {
                return !newShowingList.find(
                  (item) =>
                    item.categoryNameSubCategoryNameCode ===
                    val.categoryNameSubCategoryNameCode
                );
              })
            );
            onChange(
              newShowingList.map((item) => item.categoryNameSubCategoryNameCode)
            );
          }}
        />
      ) : (
        <div />
      )}
    </div>
  );
};

export default AppChipInput;
