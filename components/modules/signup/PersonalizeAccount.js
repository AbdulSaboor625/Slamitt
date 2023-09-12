import { Button, Col, Form, Layout, Row, Typography } from "antd";
import { useRouter } from "next/router";
// import Image from "next/image";
import { useEffect, useState } from "react";
import "react-multi-carousel/lib/styles.css";
import { useDispatch } from "react-redux";
import { changePage, logout, notify, updateUser } from "../../../Redux/Actions";
import Api from "../../../services";
import { routeGenerator, routes } from "../../../utility/config";
import { PROFESSION_MODULE } from "../../../utility/constants";
import CategoriesCarousel from "../../CategoriesCarousel";
import styles from "./signup.module.scss";
const PersonaliseAccount = ({ userCode, competitionState = null }) => {
  const router = useRouter();
  const { Header, Content } = Layout;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const [categoryCodesSelected, setCategoryCodesSelected] = useState([]);

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = async (value) => {
    const payload = {
      categoryInterest: categoryCodesSelected,
      step: "DASHBOARD",
    };
    try {
      const response = await Api.update(
        `/user/update-user/${userCode}`,
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

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const skip = async () => {
    const payload = {
      step: "DASHBOARD",
    };

    try {
      const response = await Api.update(
        `/user/update-user/${userCode}`,
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

  return (
    <Layout>
      <Header>
        <Row>
          <Col></Col>
          <Col className={styles.alignRight} justify="end" align="middle">
            <Button
              type="primary"
              shape="round"
              onClick={() => {
                dispatch(logout());
                // window.location.href = routes.register;
              }}
            >
              Logout
            </Button>
          </Col>
        </Row>
      </Header>
      <Content>
        <div className="personaliseContent">
          <div className="personaliseContainer">
            <header className={[styles.personaliseHeader].join(" ")}>
              <Typography.Title className={styles.mainHeading}>
                Personalise your Account
              </Typography.Title>
              <Typography.Text className={styles.mainHeadingText}>
                What Category of competitions would you like us to recommend to
                you?
              </Typography.Text>
            </header>
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
                  selected={categoryCodesSelected}
                  itemOuterContainerClass={"personaliseImageWrap pink"}
                  className="personaliseSlider"
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
                    htmlType="submit"
                    shape="round"
                    onClick={() =>
                      dispatch(changePage({ page: PROFESSION_MODULE }))
                    }
                    // href="/auth/dashboard"
                  >
                    Back
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    shape="round"
                    disabled={!categoryCodesSelected.length}
                    // href="/auth/dashboard"
                  >
                    next
                  </Button>
                </Form.Item>
                {!categoryCodesSelected.length && (
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

export default PersonaliseAccount;
