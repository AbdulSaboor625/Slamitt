import { Button, Form, Image, Layout, Row, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, notify, updateUser } from "../../Redux/Actions/";
import { FormField } from "../../components";
import Api from "../../services";
import { routes } from "../../utility/config";

import { useRouter } from "next/router";
import {
  CheckedGreenIcon,
  MailIcon,
  VerifiedIcon,
} from "../../utility/iconsLibrary";
import styles from "./signup.module.scss";
import SegmentHandler from "../../analytics/segment";

const AddDetailsModule = ({ children, to = "", participant = "" }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { Header, Content } = Layout;

  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [instituteName, setInstituteName] = useState("");
  const [institute, setInstitute] = useState("");
  const [institutes, setInstitutes] = useState([]);
  const [instituteOptions, setInstituteOptions] = useState([]);
  const { segment } = useSelector((state) => state.misc);
  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
    searchInstitutes();
  }, []);

  useEffect(() => {
    async function fetchInstitutesData() {
      try {
        const response = await Api.get(`/institute/cgirhpyvay`);
        if (response.code && response.result && response.result.length) {
          const instituteOptions = response.result.map((i) => ({
            label: i.instituteName?.split("(Id")[0],
            value: i.code,
            isActive: i?.isActive,
          }));

          setInstitutes(instituteOptions);
          setInstituteOptions(instituteOptions);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchInstitutesData();
  }, []);

  const userData = JSON.parse(localStorage.getItem("tempData"));
  // const dateU = userData && userData?.dob?.replace("-", "/")?.replace("-", "/");

  const onFinish = async (value) => {
    setLoading(true);
    if (
      !institutes.find((i) =>
        i.label
          ?.toLowerCase()
          .includes(form.getFieldValue("institute")?.toLowerCase())
      )
    ) {
      await createInstitutes(
        instituteName ? instituteName : form.getFieldValue("institute")
      );
    }
    const payload = {
      fName: value["first-name"],
      lName: value["last-name"],
      // gender: value.gender,
      // email: user.email,
      // dob: value["dob"]?.format("DD-MM-YYYY"),
      instituteName: institute,
      step: "DASHBOARD",
    };

    console.log("sign-up / add-detail page ~ ln # 88: ", payload);

    localStorage.setItem("tempData", JSON.stringify(payload));
    try {
      const response = await Api.update(
        `/user/update-user/${user.userCode}`,
        payload
      );
      if (response.code) {
        const analytics = new SegmentHandler(segment);
        analytics.trackUserEvent(
          SegmentHandler.EVENTS.SIGN_UP_COMPLETED,
          response.result
        );
        dispatch(updateUser({ user: response.result }));
        router.push(routes.dashboard);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const disable = () => {
    if (!!userData?.fName) return false;
    else {
      return (
        !form.isFieldsTouched(true) ||
        !!form.getFieldsError().filter(({ errors }) => errors.length).length
      );
    }
  };

  const searchInstitutes = async (institute) => {
    try {
      const response = await Api.post(`/institute/search`, {
        instituteName: institute
          ? institute
          : instituteName.length
          ? instituteName[0]
          : "",
      });
      if (response.code) {
        return response.result;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      return [];
    }
  };

  const createInstitutes = async (instituteName) => {
    try {
      const payload = {
        instituteName,
      };

      console.log("sing-up/add-detail ~ ln 147: [PAYLOAD]", payload);

      const response = await Api.post(`/institute/addInstitute`, payload);
      if (!response.code) {
        throw new Error(response.message);
      }
      setInstitute(instituteName);
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
  };

  // const onFinish = async (value) => {
  //   setLoading(true);

  //   if (form.getFieldValue("institute")?.toLowerCase() === "other") {
  //     await createInstitutes(instituteName ? instituteName : otherDefaultValue);
  //   }
  //   const payload = {
  //     professionType: profession
  //       .find((prf) => prf.value === value.profession)
  //       .label.toUpperCase(),
  //     instituteName: institute,
  //     imageUrl: value.upload,
  //     step: CATEGORIES_MODULE,
  //   };
  //   try {
  //     const response = await Api.update(
  //       `/user/update-user/${user?.userCode}`,
  //       payload
  //     );
  //     if (response.code) {
  //       const redirectTo =
  //         routes.addUserCategory + getQueryParamsToString({ to, participant });
  //       dispatch(updateUser({ user: response.result }));
  //     } else {
  //       throw new Error(response.message);
  //     }
  //   } catch (error) {
  //     dispatch(notify({ type: "error", message: error.message }));
  //   }
  //   setLoading(false);
  // };

  return (
    <Layout className="userDetailsPage">
      <Header className="userDetailsHeader">
        <Row justify="end" align="middle">
          <Button
            className="userlogoutButton"
            type="primary"
            shape="round"
            onClick={() => {
              dispatch(logout());
              window.location.href = routes.login;
            }}
          >
            Logout
          </Button>
        </Row>
      </Header>
      <Content>
        <div className="slamittLogoIntro">
          <Image
            preview={false}
            src="https://rethink-competitions.s3.amazonaws.com/1668714261738_slamittlogo.svg"
            alt="Slamitt"
          />
        </div>
        <div className="userFormContent">
          <div className="userFormContainer">
            <div className={[styles.formContainer].join(" ")}>
              <div className={[styles.formHolder].join(" ")}>
                {children ? (
                  { ...children }
                ) : (
                  <div className={[styles.profileHeading].join(" ")}>
                    <Typography.Title className={styles.headingOne}>
                      SET UP YOUR PROFILE
                    </Typography.Title>
                  </div>
                )}
                <div className={[styles.userEmailWrap].join(" ")}>
                  <Typography.Text className={styles.userEmail}>
                    <MailIcon className={styles.userEmailIcon} />
                    {user?.email}
                    <CheckedGreenIcon
                      className={[styles.userVerifyIcon]}
                      style={{
                        color: "#1DDB8B",
                        marginLeft: "8px",
                      }}
                    />
                  </Typography.Text>
                  {/* <Button
                    className={styles.emailEditButton}
                    type="text"
                    icon={<FormOutlined />}
                    onClick={() => {
                      dispatch(setPrevPage({ page: DETAILS_MODULE }));
                      dispatch(changePage({ page: EDIT_EMAIL_MODULE }));
                    }}
                  /> */}
                </div>
                <Form
                  name="basic"
                  labelCol={{ span: 8 }}
                  // wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  form={form}
                >
                  <div className="formTwoFields">
                    <div className="inputWrapper">
                      <FormField
                        type="text"
                        placeholder={"First Name"}
                        defaultValue={userData && userData.fName}
                        name="first-name"
                        rules={[{ required: userData ? false : true }]}
                      />
                    </div>
                    <div className="inputWrapper">
                      <FormField
                        type="text"
                        placeholder={"Last Name"}
                        defaultValue={userData && userData.lName}
                        name="last-name"
                        rules={[{ required: userData ? false : true }]}
                      />
                    </div>
                  </div>
                  {/* <div className="inputWrapper inputWrapperOutlined">
                    <Form.Item
                      name="dob"
                      label="D.O.B"
                      // initialValue={userData && dateU}
                    >
                      <DatePicker
                        // open={open}
                        // onClick={() => setOpen(!open)}
                        // picker={picker}
                        // onChange={() => {
                        //   if (picker === "year") setPicker("month");
                        //   if (picker === "month") setPicker("date");
                        //   if (picker === "date") setOpen(false);
                        // }}
                        format={["DD/MM/YYYY", "DD/MM/YY"]}
                        placeholder={"DD/MM/YYYY"}
                        defaultValue={userData && moment(dateU)}
                        disabledDate={(current) => {
                          return (
                            current.valueOf() >
                            moment().subtract(AGE_LIMIT, "years")
                          );
                        }}
                      />
                    </Form.Item>
                  </div>
                  <div className="inputWrapper inputWrapperOutlined gendarField">
                    <Form.Item
                      name="gender"
                      label=" Gender"
                      rules={[{ required: userData ? false : true }]}
                      requiredMark={"optional"}
                      initialValue={userData && userData.gender}
                    >
                      <Radio.Group
                        defaultValue={userData && userData.gender}
                        options={gender}
                      />
                    </Form.Item>
                  </div> */}
                  <Form.Item
                    name="institute"
                    rules={[
                      {
                        required: true,
                        message: "You cannot leave it empty",
                      },
                    ]}
                  >
                    <Select
                      name={`institute`}
                      showArrow={false}
                      showSearch={true}
                      filterOption={false}
                      value={institute || "Name of Institution/Organization*"}
                      placeholder={"Name of Institution/Organization*"}
                      onSearch={(value) => {
                        if (value) {
                          const newInstituteOptions = institutes.filter((i) =>
                            i.label?.toLowerCase().includes(value.toLowerCase())
                          );
                          setInstituteOptions([
                            ...newInstituteOptions,
                            {
                              isActive: false,
                              label: value,
                              value,
                            },
                          ]);
                        } else {
                          setInstituteOptions([...institutes]);
                        }
                      }}
                      onSelect={(value) => {
                        setInstitute(value);
                        form.setFieldsValue({
                          institute: value,
                        });
                      }}
                    >
                      {(instituteOptions || []).map((option) => (
                        <Select.Option key={option.code} value={option.label}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                    {institute &&
                    institutes.find((i) => i.label === institute)?.isActive ? (
                      <VerifiedIcon className="instituteVerifiedIcon" />
                    ) : null}
                  </Form.Item>

                  {/* <Form.Item
                    name="institute"
                    rules={[
                      {
                        required: true,
                        message: "You cannot leave it empty",
                      },
                    ]}
                  >
                    <AppInstituteSelect
                      createInstitutes={(instituteName) => {
                        // createInstitutes(instituteName);
                        // form.setFieldsValue({
                        //   institute: instituteName,
                        // });
                        setInstitute(instituteName);
                        // setInstituteName([]);
                      }}
                      onSelect={(instituteName) => {
                        setInstitute(instituteName);
                      }}
                      addIn={instituteName}
                      showSearch
                      // mode="multiple"
                      value={institute}
                      placeholder={`Name of Institution/Organization*`}
                      fetchOptions={searchInstitutes}
                      onChange={(newValue) => {
                        form.setFieldsValue({
                          institute:
                            newValue.label === "Other"
                              ? `Other`
                              : newValue.label,
                        });
                        setInstitute(
                          newValue.label === "Other" ? "" : newValue.label
                        );
                        setInstituteName("");
                      }}
                      style={{
                        width: "100%",
                      }}
                      otherDefaultValue={otherDefaultValue}
                      setOtherDefaultValue={setOtherDefaultValue}
                    />
                  </Form.Item> */}
                  <Form.Item
                    // wrapperCol={{ offset: 8, span: 16 }}
                    shouldUpdate
                  >
                    {() => (
                      <Button
                        type="primary"
                        htmlType="submit"
                        shape="round"
                        loading={isLoading}
                        disabled={
                          disable()
                          // || !form.isFieldsTouched(true)
                          // !!form
                          //   .getFieldsError()
                          //   .filter(({ errors }) => errors.length).length
                        }
                      >
                        next
                      </Button>
                    )}
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default AddDetailsModule;
