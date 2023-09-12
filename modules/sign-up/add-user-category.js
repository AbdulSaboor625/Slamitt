import { Button, Form, Layout, Typography } from "antd";
// import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import "react-multi-carousel/lib/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { notify, updateUser } from "../../Redux/Actions";
import { AppPageHeader, CategoriesCarousel } from "../../components";
import Api from "../../services";
import { routeGenerator, routes } from "../../utility/config";
import styles from "./signup.module.scss";
import InerestsCarousel from "../../components/InterestsCarousel";

const AddUserCategoryModule = ({
  competitionState = null,
  to,
  participant,
  from = "",
}) => {
  const initialRender = useRef(true);
  const router = useRouter();
  const { Header, Content } = Layout;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const { user } = useSelector((state) => state.auth);
  const [categoryCodesSelected, setCategoryCodesSelected] = useState([]);
  const [isLaunchCompetitionModalOpen, setIsLaunchCompetitionModalOpen] =
    useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryCount, setCategoryCount] = useState(
    categoryCodesSelected.length
  );

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
    getUserCategories();
  }, []);

  useEffect(() => {
    if (user?.categoryInterest) {
      setCategoryCodesSelected([...user.categoryInterest]);
      setCategoryCount([...user.categoryInterest].length);
    }
  }, [user]);

  useEffect(() => {
    setCategoryCount(categoryCodesSelected.length);
  }, [categoryCodesSelected]);

  const onFinish = async (value) => {
    const payload = {
      categoryInterest: categoryCodesSelected,
      step: "DASHBOARD",
    };
    try {
      const response = await Api.update(
        `/user/update-user/${user.userCode}`,
        payload
      );
      if (response.code) {
        dispatch(updateUser({ user: response.result }));
        if (router.asPath.includes(routes.addInterest)) router.back();
        else router.replace(to ? to : routes.dashboard);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
    localStorage.clear("tempData");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const skip = async () => {
    const payload = {
      step: "DASHBOARD",
    };

    try {
      const response = await Api.update(
        `/user/update-user/${user.userCode}`,
        payload
      );
      if (response.code) {
        dispatch(updateUser({ user: response.result }));
        if (competitionState)
          router.replace(
            routeGenerator(routes.competitionParticipated, {
              competitionCode: competitionState.competitionCode,
            })
          );
        else router.replace(routes.dashboard);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
    localStorage.clear("tempData");
  };

  const getUserCategories = async () => {
    try {
      const response = await Api.get("/category/");
      if (response.code && response.result) {
        console.log("response.result", response.result);
        const categoryCodes = Object.keys(response.result);
        const category = [];
        categoryCodes.forEach((categoryCode) => {
          const obj = {};
          obj.subCategory = response.result[categoryCode].map((item) => {
            return { ...item, isSelected: false };
          });
          obj.colorCode = response.result[categoryCode][0].colorCode;
          obj.categoryName = response.result[categoryCode][0].categoryName;
          obj.categoryCode = categoryCode;
          obj.isSelected = false;
          obj.imageUrl = response.result[categoryCode][0].imageUrl;
          obj.label = response.result[categoryCode][0].categoryName;
          obj.value = JSON.stringify(obj.subCategory);
          category.push(obj);
        });
        setCategories(category);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(
        notify({
          message: error.message,
          type: "error",
        })
      );
    }
  };

  return (
    <Layout>
      <AppPageHeader
        isLaunchCompetitionModalOpen={isLaunchCompetitionModalOpen}
        setIsLaunchCompetitionModalOpen={setIsLaunchCompetitionModalOpen}
      />
      {/* <Header className="userDetailsHeader">
        <Row>
          <Col></Col>
          <Col className={styles.alignRight} justify="end" align="middle">
            <Button
              className="userlogoutButton"
              type="primary"
              shape="round"
              onClick={() => {
                dispatch(logout());
                // window.location.href = routes.login;
              }}
            >
              Logout
            </Button>
          </Col>
        </Row>
      </Header> */}
      <Content>
        <div className="personaliseContent personaliseInterestsPage">
          <div className="personaliseContainer">
            <header className={[styles.personaliseHeader].join(" ")}>
              <Typography.Title className={styles.mainHeading}>
                Add your Interests
              </Typography.Title>
              <Typography.Text className={styles.mainHeadingText}>
                Add your inerests across various fields. Participate in
                Competitions to grow your interests.
              </Typography.Text>
            </header>
            <div className="interestsCounter">
              <u>
                <strong>Added {categoryCount}</strong>/25
              </u>
            </div>
            <Form
              name="basic"
              className="personaliseContentHolder"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 24 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              form={form}
            >
              <Form.Item name="categories">
                <CategoriesCarousel
                  profileInterest={true}
                  categories={categories}
                  from={from}
                  selected={categoryCodesSelected}
                  setCategoryCount={setCategoryCount}
                  categoryCount={categoryCount}
                  itemOuterContainerClass={"personaliseImageWrap pink"}
                  className="personaliseSlider personalized-cateogry-slider"
                  responsive={{
                    widescreen: {
                      breakpoint: { max: 3000, min: 1600 },
                      items: 5,
                      paritialVisibilityGutter: 60,
                    },
                    desktop: {
                      breakpoint: { max: 1600, min: 1024 },
                      items: 4,
                      paritialVisibilityGutter: 60,
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
                  }}
                  setCategoriesSelected={(e) => {
                    setCategoryCodesSelected(e);
                  }}
                  preloadingParent={true}
                />
              </Form.Item>
              <footer className={[styles.personaliseFooter].join(" ")}>
                <Form.Item
                  className="signupButtonsWrap"
                  // wrapperCol={{ offset: 8, span: 16 }}
                  shouldUpdate
                >
                  <Button
                    type="secondary"
                    htmlType="button"
                    shape="round"
                    onClick={() =>
                      router.asPath.includes(routes.addInterest)
                        ? router.back()
                        : router.push(routes.addProfession)
                    }
                  // href="/auth/dashboard"
                  >
                    cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    shape="round"
                    disabled={!categoryCodesSelected.length}
                  // href="/auth/dashboard"
                  >
                    Save
                  </Button>
                </Form.Item>

                {!router.asPath.includes(routes.addInterest) &&
                  !categoryCodesSelected.length && (
                    <Button className="active" type="text" onClick={skip}>
                      Skip for now
                    </Button>
                  )}
              </footer>
            </Form>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default AddUserCategoryModule;
