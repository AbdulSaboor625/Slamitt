import { Avatar, Button, Image, Radio, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../../../Redux/Actions";
import { addOrUpdateCompetitionDetails } from "../../../Redux/Actions/competitionAction";
import { EditPencilIcon } from "../../../utility/iconsLibrary";
import { solo, team } from "../../../utility/imageConfig";
import AppChipInput from "../../AppChipInput";
import AppSelect from "../../AppSelect";
import { AppCustomPicker } from "../../index";

const CreateCompetitionPhase2 = ({
  onCancel,
  onSubmit,
  competitionName,
  setCompetitionName,
  checkCompetitionName,
}) => {
  const dispatch = useDispatch();
  const competition = useSelector((state) => state.competition);
  const [subCategories, setSubCategories] = useState([]);
  const [isDefault, setIsDefault] = useState(true);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (competition?.categories) {
      competition.categories.forEach((cat) => {
        if (competition?.create?.categoryName[0]?.includes(cat?.categoryCode)) {
          setSubCategories(cat.subCategory);
        }
      });
    }
  }, [competition.create.categoryName]);

  const onFinish = async () => {
    // const isExist = await checkCompetitionName(competitionName);
    // if (isExist) {
    //   dispatch(
    //     notify({
    //       type: "info",
    //       message:
    //         "Competition Name has already been claimed. Mail us at support@slamitt.com to enquire further",
    //     })
    //   );
    // } else {
    setLoading(true);
    await onSubmit();
    await onCancel();
    setLoading(false);

    // }
  };

  let selectedCategory = {};
  if (
    competition &&
    competition.categories &&
    competition.categories.length &&
    competition.create &&
    competition.create.categoryName &&
    competition.create.categoryName.length
  ) {
    selectedCategory = competition.categories.find((item) =>
      competition.create.categoryName[0].includes(item.categoryCode)
    );
  }

  if (competition && competition.categories && competition.categories.length) {
    competition.categories.forEach((category) => {
      category.image = category.imageUrl;
    });
  }

  return (
    <>
      <AppCustomPicker
        className="tabset"
        popOverClass="m-5"
        tabpaneClass="m-5"
        onImageSelected={(e) => {
          dispatch(addOrUpdateCompetitionDetails({ image: e }));
        }}
        defaultValue={competition.create.image}
      />

      <div className="nameCompetitionForm">
        <Typography.Title
          className="nameCompetitionTitle"
          name="competition-name"
          editable={{
            tooltip: false,
            icon: <EditPencilIcon />,
            onChange: (e) => {
              if (e === "") {
                setCompetitionName(competitionName);
                dispatch(
                  addOrUpdateCompetitionDetails({
                    competitionName: competitionName,
                  })
                );
              } else {
                setCompetitionName(e);
                dispatch(
                  addOrUpdateCompetitionDetails({
                    competitionName: e,
                  })
                );
              }
            },
          }}
        >
          {competitionName}
        </Typography.Title>
      </div>
      <div className="competitionCategoriesWrap">
        {isDefault && selectedCategory && selectedCategory.imageUrl && (
          <Avatar src={selectedCategory.imageUrl} />
        )}
        <AppSelect
          className="competitionFormSelect"
          option={competition?.categories}
          bordered={false}
          showArrow={false}
          defaultValue={
            selectedCategory.categoryName ? selectedCategory.categoryName : ""
          }
          onChange={
            (e) => {
              setIsDefault(false);
              setSubCategories(JSON.parse(e));
            } // dispatch(
            //   addOrUpdateCompetitionDetails({
            //     categoryName: [e],
            //     subCategories: [],
            //   })
            // )
          }
        />
      </div>
      <div className="tagsHolder">
        <AppChipInput
          defaultSelectedCategory={competition.create?.categoryName}
          originaList={subCategories}
          onChange={(e) =>
            dispatch(
              addOrUpdateCompetitionDetails({
                categoryName: e,
              })
            )
          }
        />
      </div>
      <Typography.Text className="subTitle">
        Participation Settings
      </Typography.Text>
      <div className="competitionSelection">
        <Radio.Group
          onChange={(e) =>
            dispatch(
              addOrUpdateCompetitionDetails({
                competitionType: e.target.value,
              })
            )
          }
          buttonStyle={"solid"}
          optionType="button"
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
      <Typography.Text className="subText hide">
        you can edit these settings later
      </Typography.Text>
      <div className="buttonsHolder">
        <Button
          className="buttonCancle"
          type="ghost"
          shape="round"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          className="buttonNext"
          type="primary"
          shape="round"
          onClick={onFinish}
          disabled={
            !Boolean(competition.create.categoryName.length > 0) ||
            !Boolean(competition.create.competitionName) ||
            !Boolean(competition.create.competitionType) ||
            !Boolean(
              competition.create.image?.url || competition.create.image?.emoji
            )
          }
        >
          {loading ? <div className="loader-icon" /> : "Create"}
        </Button>
      </div>
    </>
  );
};

export default CreateCompetitionPhase2;
