import { InfoCircleOutlined, StarFilled } from "@ant-design/icons";
import { Button, Input, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { notify, updateRound } from "../../../../Redux/Actions";
import { DeleteIcon, DragLineIcon } from "../../../../utility/iconsLibrary";
import SkillLibraryModal from "./skillLibraryModal";
import { arrayMoveImmutable } from "array-move";
import SortableList, { SortableItem, SortableKnob } from "react-easy-sort";

const AssesementCriteriaModule = ({
  readOnlyState,
  editMode,
  addCriteria,
  criterias,
  setCriteria,
  data,
  addOrUpdatePoints,
  deleteCriteria,
  skills,
  competition,
}) => {
  const [isVisible, setVisible] = useState(false);
  const [subSkillsList, setSubSkillsList] = useState([]);
  const [criteriaEtitable, setCriteriaEditable] = useState({
    isEditable: false,
    label: "",
  });
  const [isListModified, setIsListModified] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    if (skills && skills.length) {
      const subSkills = [];
      skills.forEach((skill) => {
        skill.subSkills.forEach((subSkill) => {
          subSkill.label = subSkill.subSkillName;
          subSkill.value = subSkill.subSkillName;
          subSkills.push(subSkill);
        });
      });
      const sortedSubSkills = subSkills.sort((a, b) => {
        if (a.skillName === competition?.category?.categoryName) return -1;
        if (b.skillName === competition?.category?.categoryName) return 1;
        return 0;
      });
      const uniqueSubSkills = sortedSubSkills.filter(
        (subSkill, index, self) =>
          index ===
          self.findIndex((t) => t.subSkillName === subSkill.subSkillName)
      );
      setSubSkillsList(uniqueSubSkills);
    }
  }, [skills]);

  const defaultSkill = skills?.filter(
    (skill) => skill.skillName === competition?.category?.categoryName
  );
  let dSkills;
  if (defaultSkill && defaultSkill.length) dSkills = defaultSkill[0];

  const isDuplicate = async (name) => {
    const newName = name?.trimEnd()?.toLowerCase();
    const isFound = await subSkillsList?.some((sub) => {
      if (sub?.subSkillName?.toLowerCase() === newName) {
        return true;
      } else return false;
    });

    if (isFound) {
      dispatch(
        notify({ type: "error", message: `${newName} is already exist` })
      );
      return isFound;
    } else return isFound;
  };

  const editCustomCriteria = (name, id) => {
    const exist = criterias.find((c) => c._id === id);
    const otherCriteria = criterias.filter((c) => c._id !== id);
    const editedCriteria = {
      label: name,
      points: exist.points,
      isCustom: true,
    };
    dispatch(
      updateRound({
        criteria: [...otherCriteria, editedCriteria],
        competitionRoundCode: data.competitionRoundCode,
      })
    );
  };

  const AddSkill = () => {
    return (
      <>
        <div className="roundCriteriaHeaderTitles">
          <Typography.Title className="roundCriteriaHeading hidden" level={3}>
            {"Criteria"}
          </Typography.Title>
          <Typography.Title
            className="roundCriteriaHeading alignRight"
            level={3}
          >
            {!criterias || !criterias.length
              ? // ? "You may add max points here"
                ""
              : "Max Points"}
          </Typography.Title>
        </div>
        <div className="roundCriteriaHeader">
          {!readOnlyState && (
            <>
              <Select
                dropdownStyle={{
                  visibility: `${dSkills?.subSkills ? "visible" : "hidden"}`,
                }}
                bordered={false}
                showArrow={false}
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Type a judgement criteria here..."
                options={subSkillsList}
                notFoundContent=""
                onChange={(e) => {
                  if (e[0].trim() === "") return;
                  !e[0].trim().match(/^[^a-zA-Z0-9]+$/) &&
                    addCriteria(true, {
                      label: e[0],
                      value: e[0],
                    });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim() === "") return;

                  e.key === "Enter" &&
                    !e.target.value.trim().match(/^[^a-zA-Z0-9]+$/) &&
                    addCriteria(true, {
                      label: e.target.value,
                      value: e.target.value,
                    });
                }}
              />
              {!criterias || !criterias.length ? (
                <Typography.Text className="roundCriteriaMaxPoints"></Typography.Text>
              ) : (
                <></>
              )}
            </>
          )}

          {/* <FormField
            type={"text"}
            bordered={false}
            placeholder="Add Assessment Criteria"
            onPressEnter={(e) =>
              addCriteria(true, {
                label: e.target.value,
                value: e.target.value,
              })
            }
          /> */}
          {/* <div className="roundCriteriaHeaderOptions">
            <Button
              type="text"
              className="buttonLibrary"
              icon={<InfoCircleOutlined />}
              onClick={() => setVisible(true)}
            >
              Add from Library
            </Button>
            <p>
              <StarFilled style={{ color: "#FFAA28" }} /> Adding Skills from our
              Library allows your participants to build their profile
            </p>
          </div> */}
        </div>
        <hr />
      </>
    );
  };

  const Skills = ({ criterion, dragger }) => {
    console.log(criterion);
    return (
      <>
        <div className="roundAssessmentItem">
          <div className="roundAssessmentItemTitle">
            {editMode ? (
              <div className="roundAssessmentItemOptionsMobile visibleMobile">
                {!readOnlyState && (
                  <Button
                    icon={<DeleteIcon />}
                    type="text"
                    className="buttonDelete"
                    onClick={() => deleteCriteria(criterion)}
                  />
                )}
              </div>
            ) : (
              <></>
            )}

            {editMode && dragger && (
              <div className="dragBlockIcon">
                <DragLineIcon />
              </div>
            )}

            {!criterion.isCustom && <StarFilled style={{ color: "#FFAA28" }} />}
            {criteriaEtitable.isEditable &&
            criterion.label === criteriaEtitable.label &&
            criterion.isCustom ? (
              <Input
                autoFocus
                bordered={false}
                defaultValue={criterion.label}
                placeholder="Edit Criteria"
                onBlur={async (e) => {
                  if (!(await isDuplicate(e.target.value))) {
                    if (e.target.value !== criterion.label)
                      editCustomCriteria(e.target.value, criterion._id);
                  } else setCriteriaEditable({ isEditable: false, label: "" });
                }}
              />
            ) : (
              <Typography.Text
                onClick={() =>
                  setCriteriaEditable({
                    isEditable: true,
                    label: criterion.label,
                  })
                }
              >
                {criterion.label}
              </Typography.Text>
            )}
          </div>
          {editMode ? (
            <div className="roundAssessmentItemOptions">
              {readOnlyState ? (
                <>
                  <Typography.Text className="roundAssessmentItemPoints">
                    {criterion.points || 0}
                  </Typography.Text>
                  <Typography.Text className="roundAssessmentItemOptionsText">
                    pts
                  </Typography.Text>
                </>
              ) : (
                <>
                  <Input
                    type={"number"}
                    min={0}
                    bordered={false}
                    placeholder={`05 ${!criterion.points ? "pts" : ""}`}
                    maxLength="3"
                    defaultValue={criterion.points}
                    // autoFocus
                    onBlur={(e) => {
                      e.target.value !== "" &&
                        addOrUpdatePoints({
                          _id: criterion._id,
                          points: e.target.value < 5 ? 5 : e.target.value,
                        });
                    }}
                    onKeyDown={(e) => {
                      e.key === "Enter" &&
                        e.target.value !== "" &&
                        addOrUpdatePoints({
                          _id: criterion._id,
                          points: e.target.value < 5 ? 5 : e.target.value,
                        });
                    }}
                  />
                  {Boolean(criterion.points || criterion.points === 0) ? (
                    <Typography.Text className="roundAssessmentItemOptionsText">
                      pts
                    </Typography.Text>
                  ) : (
                    <></>
                  )}
                </>
              )}
              {!readOnlyState && (
                <Button
                  icon={<DeleteIcon />}
                  type="text"
                  className="buttonDelete visibleTablet"
                  onClick={() => deleteCriteria(criterion)}
                />
              )}
            </div>
          ) : (
            <Typography.Text className="roundAssessmentItemPoints">
              {criterion.points || 0} points
            </Typography.Text>
          )}
        </div>
        <hr />
      </>
    );
  };

  const onSortEnd = (oldIndex, newIndex) => {
    const newCreterias = arrayMoveImmutable(criterias, oldIndex, newIndex);
    setCriteria(newCreterias);
    setIsListModified(true);
  };

  const saveRearrangment = () => {
    //replace containers in redux store with new list
    dispatch(
      updateRound({
        criteria: criterias,
        competitionRoundCode: data?.competitionRoundCode,
      })
    );
    setIsListModified(false);
  };

  return (
    <>
      {editMode && <AddSkill />}
      <div className="roundAssessmentItemScroller">
        {editMode ? (
          <>
            <SortableList onSortEnd={onSortEnd}>
              {criterias.map((criterion, index) => (
                <SortableItem key={index}>
                  <div>
                    <SortableKnob>
                      <Skills
                        dragger={criterias?.length > 1}
                        criterion={criterion}
                      />
                    </SortableKnob>
                  </div>
                </SortableItem>
              ))}
            </SortableList>
          </>
        ) : (
          criterias.map((criterion, index) => (
            <Skills
              key={criterion._id}
              dragger={criterias?.length > 1}
              criterion={criterion}
            />
          ))
        )}
        {isListModified && (
          <button
            className="saveChangesFloatingBox static"
            onClick={saveRearrangment}
          >
            <Typography.Text className="saveChangesFloatingBoxTitle">
              Save Changes{" "}
            </Typography.Text>
          </button>
        )}
      </div>

      <SkillLibraryModal
        allSkills={skills}
        data={data}
        allSubSkills={subSkillsList}
        isVisible={isVisible}
        criterias={criterias}
        setVisible={setVisible}
        onFinish={(criteria) => addCriteria(false, criteria)}
        competition={competition}
        defaultSkill={dSkills}
      />
    </>
  );
};

export default AssesementCriteriaModule;
