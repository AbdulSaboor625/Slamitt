import {
  Button,
  Checkbox,
  Input,
  Layout,
  Tag,
  TreeSelect,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notify, updateRound } from "../../../../Redux/Actions";
import AppModal from "../../../AppModal";
import AppSelect from "../../../AppSelect";

const SkillLibraryModal = ({
  allSkills,
  allSubSkills,
  isVisible,
  setVisible,
  onFinish,
  criterias,
  defaultSkill,
  data,
}) => {
  const roundState = useSelector((state) => state.competition.round);
  const dispatch = useDispatch();
  const [skills, setSkills] = useState([]);
  const [subSkills, setSubSkills] = useState(defaultSkill?.subSkills);
  const [skillSelected, setSkillSelected] = useState(defaultSkill?.skillName);
  const [subSkillSelected, setSubSkillSelected] = useState("");
  const [updatedSubSkills, setUpdatedSubSkills] = useState([]);
  const [searchSkills, setSearchSkills] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const assesment = data?.assessmentCriteria?.map((c) => c.label);
    setUpdatedSubSkills(assesment);
  }, [data]);

  useEffect(() => {
    if (allSkills && allSkills.length) {
      allSkills.forEach((skill) => {
        skill.label = skill.skillName;
        skill.value = skill.skillName;
        if (skill.imageUrl) skill.image = skill.imageUrl;
        skill.subSkills.forEach((subSkill) => {
          subSkill.label = subSkill.subSkillName;
          subSkill.value = subSkill.subSkillName;
        });
      });

      setSkills([...allSkills]);
    }
  }, [allSkills]);

  useEffect(() => {
    if (allSubSkills && allSubSkills.length) {
      allSubSkills.forEach((subSkill) => {
        subSkill.label = subSkill.subSkillName;
        subSkill.value = subSkill.subSkillName;
      });
      setSubSkills([...allSubSkills]);
    }
  }, [allSubSkills]);

  useEffect(() => {
    if (skillSelected && skillSelected.length) {
      handleSubmit();
      const newSkill = allSkills.filter(
        (skill) => skill.skillName === skillSelected
      );
      setSkills([...newSkill]);
      if (newSkill.length) {
        setSubSkills([...newSkill[0].subSkills]);

        const curSkillSubSkills = newSkill[0].subSkills.map(
          ({ subSkillName }) => subSkillName
        );
        const alreadySelectedSubSkills = criterias
          .filter((criteria) => curSkillSubSkills.includes(criteria.label))
          .map(({ label }) => label);
        setUpdatedSubSkills(alreadySelectedSubSkills);
      }
    } else if (allSkills && allSkills.length) {
      setSubSkillSelected("");
      setSkills([...allSkills]);
    }
  }, [skillSelected]);

  useEffect(() => {
    if (subSkillSelected && subSkillSelected.length) {
      const newSubSkill = allSubSkills.filter(
        (subSkill) => subSkill.subSkillName === subSkillSelected
      );

      if (newSubSkill.length) {
        const newSkill = allSkills.filter(
          (skill) => skill.skillName === newSubSkill[0].skillName
        );
        setSkillSelected(newSkill[0].skillName);
        setSkills([...newSkill]);
        if (newSkill.length) {
          setSubSkills([...newSkill[0].subSkills]);
        }
      }
    } else if (allSubSkills && allSubSkills.length) {
      if (defaultSkill?.subSkills) {
        setSubSkills([...defaultSkill?.subSkills]);
      }
    }
  }, [subSkillSelected]);

  const handleSubmit = () => {
    if (skillSelected && skillSelected.length) {
      const assesementCriteria = [...criterias];

      const selectedSubSkills = subSkills.filter(({ subSkillName }) =>
        updatedSubSkills?.includes(subSkillName)
      );

      const notSelectedSubSkills = subSkills
        .filter(({ subSkillName }) => !updatedSubSkills?.includes(subSkillName))
        .map(({ subSkillName }) => subSkillName);

      selectedSubSkills.forEach((subSkill) => {
        const foundSubSkill = criterias.find(
          ({ label }) => label === subSkill.subSkillName
        );
        if (!foundSubSkill) assesementCriteria.push(subSkill);
      });

      const finalCriterias = assesementCriteria.filter(
        (criteria) => !notSelectedSubSkills.includes(criteria.label)
      );

      dispatch(
        updateRound({
          competitionRoundCode: roundState.details.competitionRoundCode,
          criteria: finalCriterias,
        })
      );
    }
  };

  // useEffect(() => {
  //   if (!isVisible) {
  //     // setSkillSelected("");
  //     // setSubSkillSelected("");
  //     // setSubSkills(allSubSkills);
  //   }
  // }, [isVisible]);

  const handleSelectSkill = (skillName) => {
    setSkillSelected(skillName);
    // const obj = {};
    // value.forEach((item) => {
    //   item.label = item.subCategoryName;
    //   item.value = JSON.stringify(item);
    // });
    // obj.subCategory = value;
    // obj.categoryName = value[0].categoryName;
    // obj.categoryCode = value[0].categoryCode;
    // obj.isSelected = false;
    // obj.imageUrl = value[0].imageUrl;
    // obj.label = value[0].categoryName;
    // obj.value = JSON.stringify(obj.subCategory);
    // setCategorySelected(obj);
  };

  const handleChangeSubSkills = (checkedValues) => {
    if (checkedValues.length > 0) {
      const lastIndex = checkedValues.length - 1;
      setSubSkillSelected(checkedValues[lastIndex]);
    }
    const newSubSkillArr = checkedValues.filter(
      (label) => !updatedSubSkills?.includes(label)
    );
    if (newSubSkillArr && newSubSkillArr.length) {
      const newSubSkill = newSubSkillArr[0];
      const isSelected = criterias.filter(
        ({ label }) => label === newSubSkill
      ).length;
      if (isSelected) {
        dispatch(
          notify({
            type: "error",
            message:
              "This criteria has already been added from another category",
          })
        );
      } else {
        setUpdatedSubSkills(checkedValues);
      }
    } else {
      setUpdatedSubSkills(checkedValues);
    }
  };

  const ModalHeader = () => {
    const treeData = [
      {
        title: "Soft Skills",
        value: "soft",
        children:
          skillSelected && skillSelected.length
            ? subSkills
            : defaultSkill?.subSkills,
      },
      {
        title: "Hard Skills",
        value: "hard",
        children: [{ label: "No data found" }],
      },
    ];
    const skillSearch = (value) => {
      setSearchText(value);
      const searchSkills = allSubSkills.filter((s) =>
        s.subSkillName.toLowerCase().includes(value.toLowerCase())
      );
      const unique = [
        ...new Map(searchSkills?.map((m) => [m?.subSkillName, m]))?.values(),
      ];
      setSearchSkills(unique);
    };
    return (
      <div className="skillModalHeader">
        <AppSelect
          placeholder={"All Skills"}
          onChange={(skillName) => {
            setSkillSelected(skillName);
            setSearchText("");
          }}
          option={[{ label: "All Skills", value: "" }, ...allSkills]}
          bordered={true}
          showArrow={true}
          value={skillSelected}
        />
        {/* <AppSelect
          placeholder={"All Criterias"}
          onChange={(subSkillName) => setSubSkillSelected(subSkillName)}
          option={[{ label: "All Criterias", value: "" }, ...subSkills]}
          bordered={true}
          showArrow={true}
          value={subSkillSelected}
        /> */}
        <TreeSelect
          placeholder="All Criterias"
          treeData={treeData}
          value={subSkillSelected ? subSkillSelected : "All Criterias"}
          onChange={(subSkillName) => {
            setSubSkillSelected(subSkillName);
          }}
        />
        <Input.Search
          // showSearch
          defaultValue={searchText}
          placeholder="Search criterias"
          onSearch={(e) => {
            skillSearch(e);
          }}
          // optionFilterProp="options"
          // onChange={onChange}
          // onSearch={onSearch}
          // options={subSkills}
          // filterOption={(input, option) =>
          //   option.label.toLowerCase().includes(input.toLowerCase())
          // }
        />
      </div>
    );
  };

  const ModalSider = () => {
    return (
      <div
        id="scrollableDiv"
        style={{
          height: 400,
          overflow: "auto",
        }}
      >
        {/* <List
          header={null}
          footer={null}
          // bordered
          dataSource={skills}
          renderItem={(item) => (
            <List.Item>
              <Button type="text" onClick={() => handleSelectSkill(item.value)}>
                {item.label}
              </Button>
            </List.Item>
          )}
        /> */}
        {/* <hr /> */}
        <Typography.Title className="skillModalTitle">
          Selected
        </Typography.Title>
        <div className="tagsList">
          {updatedSubSkills && updatedSubSkills?.length > 0 && (
            <div className="tagsListWrap">
              {updatedSubSkills?.map((subSkill) => {
                const sub = allSubSkills.find((s) => s?.value === subSkill);
                return (
                  <Tag
                    closable
                    style={{
                      background: `linear-gradient(${sub?.colorCode})`,
                    }}
                    key={subSkill}
                    onClose={() =>
                      setUpdatedSubSkills([
                        ...updatedSubSkills?.filter((sub) => sub !== subSkill),
                      ])
                    }
                  >
                    {subSkill}
                  </Tag>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const DefaulOrSearchtSkills = () => {
    return (
      <div>
        <Typography.Title className="skillModalTitle">
          {defaultSkill?.skillName}
        </Typography.Title>
        {defaultSkill?.subSkills && searchText === "" && (
          <Checkbox.Group
            className="checkboxCustom"
            options={defaultSkill?.subSkills}
            value={updatedSubSkills}
            onChange={(checkedValues) => {
              handleChangeSubSkills(checkedValues);
            }}
          />
        )}
        {/* <Typography.Text className="skillModalTitle">
      Select a skill
    </Typography.Text> */}
        {searchSkills && searchText !== "" && (
          <div>
            <Typography.Text className="mb-5">
              Search result for {searchText}
            </Typography.Text>
            <Checkbox.Group
              className="checkboxCustom"
              options={searchSkills}
              value={updatedSubSkills}
              onChange={(checkedValues) => {
                handleChangeSubSkills(checkedValues);
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const ModalContent = () => {
    return (
      <div>
        <div>
          {skillSelected &&
          skillSelected !== defaultSkill?.skillName &&
          searchText === "" ? (
            <div>
              <Typography.Title className="skillModalTitle">
                {skillSelected}
              </Typography.Title>
              <div className="checkboxCustomHolder">
                <Checkbox.Group
                  className="checkboxCustom"
                  options={subSkills}
                  value={updatedSubSkills}
                  onChange={(checkedValues) => {
                    handleChangeSubSkills(checkedValues);
                  }}
                />
              </div>
            </div>
          ) : (
            <DefaulOrSearchtSkills />
          )}
        </div>
      </div>
    );
  };

  return (
    <AppModal
      className="skillsModal"
      isVisible={isVisible}
      onOk={() => setVisible(false)}
      onCancel={() => {
        setVisible(false);
        setSearchText("");
      }}
    >
      <Layout>
        <div className="skillModalHeaderParent">
          <Layout.Header>
            <ModalHeader />
          </Layout.Header>
        </div>
        <div className="skillModalContentParent">
          <Layout>
            <Layout.Sider>
              <ModalSider />
            </Layout.Sider>
            <Layout.Content>
              <ModalContent />
              <Layout.Footer>
                <Button
                  type="primary"
                  onClick={() => {
                    handleSubmit();
                    setVisible(false);
                  }}
                >
                  Done
                </Button>
              </Layout.Footer>
            </Layout.Content>
          </Layout>
        </div>
      </Layout>
    </AppModal>
  );
};

export default SkillLibraryModal;
