import { Button, Form, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOrUpdateCompetitionDetails } from "../../../Redux/Actions/competitionAction";
import { EditPencilIcon } from "../../../utility/iconsLibrary";
import { textRule } from "../../../utility/validatationRules";
import {
  AppBorderLessInput,
  AppCustomPicker,
  CategoriesCarousel,
} from "../../index";

const EditCategorySection = ({
  onCancel,
  onNext,
  competitionName,
  setCompetitionName,
  checkCompetitionName,
}) => {
  const inputRef = useRef();
  const [isVisibleSection, setVisibileSection] = useState(false);
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const dispatch = useDispatch();
  const competition = useSelector((state) => state.competition);

  useEffect(() => {
    forceUpdate({});
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const onFinish = async (values) => {
    // const isExist = await checkCompetitionName(competitionName);
    // if (isExist) {
    //   dispatch(
    //     notify({
    //       type: "info",
    //       message:
    //         "Competition Name has already been claimed. Mail us at support@slamitt.com to enquire further",
    //     })
    //   );
    // } else
    onNext();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
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

  return (
    <>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
      >
        <Typography.Title className="modalHeading">
          Launch Competition
        </Typography.Title>
        <Typography.Text className="subTitle textBlack">
          All your competitions will appear on your Dashboard
        </Typography.Text>

        <AppCustomPicker
          className="tabset"
          popOverClass="m-5"
          tabpaneClass="m-5"
          onImageSelected={(e) => {
            dispatch(addOrUpdateCompetitionDetails({ image: e }));
          }}
        />
        {/* <div className="nameCompetitionForm">
          {isVisibleSection ? (
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
          ) : (
            <AppBorderLessInput
              name="competition-name"
              placeholder={"Competition Name"}
              rules={textRule}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
              onPressEnter={(e) => e.preventDefault()}
              onChange={(e) => {
                setCompetitionName(e.target.value);
                dispatch(
                  addOrUpdateCompetitionDetails({
                    competitionName: e.target.value,
                  })
                );
              }}
            />
          )}
          <p className="modalNoteText">You can edit these settings later.</p>
          {!isVisibleSection && (
            <div className="group relative">
              <div className="absolute z-50 inset-x-0 -bottom-10 bg-white hidden group-hover:flex flex-col items-center">
                {!Boolean(
                  competition.create.image?.url ||
                    competition.create.image?.emoji
                ) && (
                  <Typography.Text>
                    You have to select or upload the Image of the Competition.
                  </Typography.Text>
                )}
                {!Boolean(competition?.create?.competitionName) && (
                  <Typography.Text>
                    You have to enter the name of the Competition.
                  </Typography.Text>
                )}
              </div>
              <Button
                className="buttonNext"
                type="primary"
                disabled={
                  !Boolean(competition.create.competitionName) ||
                  !Boolean(
                    competition.create.image?.url ||
                      competition.create.image?.emoji
                  )
                }
                onClick={async () => {
                  // const isExist = await checkCompetitionName(competitionName);
                  // if (isExist) {
                  //   dispatch(
                  //     notify({
                  //       type: "info",
                  //       message:
                  //         "Competition Name has already been claimed. Mail us at support@slamitt.com to enquire further",
                  //     })
                  //   );
                  // } else
                  setVisibileSection(true);
                }}
              >
                next
              </Button>
            </div>
          )}
        </div> */}
        {
          <>
            <Typography.Text className="subTitle">
              Select a Category
            </Typography.Text>
            <CategoriesCarousel
              responsive={responsive}
              itemOuterContainerClass="personaliseImageWrap"
              className="personaliseSlider"
              selectOneCategory={true}
              setCategoriesSelected={(e) =>
                dispatch(
                  addOrUpdateCompetitionDetails({
                    categoryName: e,
                  })
                )
              }
            />

            <Typography.Text className="subText hide">
              you can edit these settings later
            </Typography.Text>
            <div className="buttonsHolder">
              <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
                <Button
                  className="buttonCancle"
                  type="ghost"
                  shape="round"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 0, span: 24 }} shouldUpdate>
                {() => (
                  <Button
                    className="buttonNext"
                    type="primary"
                    htmlType="submit"
                    shape="round"
                    disabled={
                      !form.isFieldsTouched(true) ||
                      !!form
                        .getFieldsError()
                        .filter(({ errors }) => errors.length).length ||
                      !Boolean(competition.create.categoryName.length > 0) ||
                      !Boolean(
                        competition.create.image?.url ||
                          competition.create.image?.emoji
                      )
                    }
                  >
                    Next
                  </Button>
                )}
              </Form.Item>
            </div>
          </>
        }
      </Form>
    </>
  );
};

export default EditCategorySection;
