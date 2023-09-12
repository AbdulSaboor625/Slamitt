import { InboxOutlined } from "@ant-design/icons";
import { Button, Form, Layout, Radio, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DragNDrop } from "../..";
import { notify } from "../../../Redux/Actions";
import { changePage, logout, updateUser } from "../../../Redux/Actions/";
import Api from "../../../services";
import { profession, routes } from "../../../utility/config";
import { CATEGORIES_MODULE, DETAILS_MODULE } from "../../../utility/constants";
import { CheckedGreenIcon, MailIcon } from "../../../utility/iconsLibrary";
import InstituteSelect from "./InstituteSelect";
import styles from "./signup.module.scss";

const AddProfessionModule = ({ email, userCode }) => {
  const dispatch = useDispatch();
  const { Header, Content } = Layout;
  const [subProfessionList, setSubProfessionList] = useState([]);
  const [subProfessionValue, setSubProfessionValue] = useState([]);
  const [professionSelected, setProfessionSelection] = useState("");
  const [subProfessionSelected, setSubProfessionSelected] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [institute, setInstitute] = useState("");
  const [otherDefaultValue, setOtherDefaultValue] = useState("");
  const instituteOrOrg = "";
  if (professionSelected) {
    if (professionSelected === "working-professional")
      instituteOrOrg = "Organization";
    if (professionSelected === "student") instituteOrOrg = "Institute";
  }
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  useEffect(() => {
    if (professionSelected) getSubProfession();
  }, [professionSelected]);

  const getSubProfession = async () => {
    try {
      const response = await Api.get(`/profession/${professionSelected}`);
      if (response.code) {
        let list = response.result.subProfession;
        list = list.map((item) => {
          item.label = item.name;
          item.value = item.code;
          return item;
        });
        setSubProfessionList(list);
        const values = [];
        list.map((l) => {
          values.push(l.value);
        });
        setSubProfessionValue(values);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
  };

  const searchInstitutes = async (institute) => {
    if (!subProfessionSelected) return [];
    try {
      const response = await Api.post(`/institute/search`, {
        instituteName: institute
          ? institute
          : instituteName.length
          ? instituteName[0]
          : "",
        subProfession: subProfessionSelected,
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
        professionTypeCode: professionSelected,
        subProfession: subProfessionSelected,
        instituteName,
      };
      const response = await Api.post(`/institute/addInstitute`, payload);
      if (!response.code) {
        throw new Error(response.message);
      }
      setInstitute(instituteName);
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
  };

  const onFinish = async (value) => {
    setLoading(true);

    if (form.getFieldValue("institute")?.toLowerCase() === "other") {
      await createInstitutes(instituteName ? instituteName : otherDefaultValue);
    }
    const payload = {
      professionType: profession
        .find((prf) => prf.value === value.profession)
        .label.toUpperCase(),
      instituteName: institute,
      imageUrl: value.upload,
      step: CATEGORIES_MODULE,
    };
    try {
      const response = await Api.update(
        `/user/update-user/${userCode}`,
        payload
      );
      if (response.code) {
        dispatch(updateUser({ user: response.result }));
        dispatch(changePage({ page: CATEGORIES_MODULE }));
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

  const skip = async () => {
    setLoading(true);
    const payload = {
      step: CATEGORIES_MODULE,
    };

    try {
      const response = await Api.update(
        `/user/update-user/${userCode}`,
        payload
      );
      if (response.code) {
        dispatch(changePage({ page: CATEGORIES_MODULE }));
        dispatch(updateUser({ user: response.result }));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(notify({ type: "error", message: error.message }));
    }
    setLoading(false);
  };

  const disable = () => {
    if (form.getFieldsValue().profession === "currently-not-working") {
      return false;
    } else if (subProfessionSelected === "hbshdjknl") return false;
    else if (institute.trim().toLowerCase() === "other") return false;
    else {
      return (
        // institute.trim().toLowerCase() === "other" ||
        institute.trim() === "" ||
        !!form.getFieldsError().filter(({ errors }) => errors.length).length
      );
    }
  };

  const resetState = () => {
    setInstituteName("");
    setInstitute("");
    // setProfessionSelection("");
    // setSubProfessionSelected("");
    setInstituteName("");
    form.resetFields(["institute"]);
  };

  return (
    <Layout>
      <Header>
        <Row justify="end" align="middle">
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
        </Row>
      </Header>
      <Content>
        <div className="userFormContent">
          <div className="userFormContainer">
            <div className={[styles.formContainer].join(" ")}>
              <div className={[styles.formHolder].join(" ")}>
                <div className={[styles.userEmailWrap].join(" ")}>
                  <Typography.Text className={styles.userEmail}>
                    <MailIcon className={styles.userEmailIcon} />
                    {email}
                    <CheckedGreenIcon
                      className="userVerifyIcon"
                      style={{
                        color: "#1DDB8B",
                        marginLeft: "auto",
                      }}
                    />
                  </Typography.Text>
                  {/* <Button
                    className={styles.emailEditButton}
                    type="text"
                    icon={<FormOutlined />}
                    onClick={() => {
                      dispatch(changePage({ page: EDIT_EMAIL_MODULE }));
                      dispatch(setPrevPage({ page: PROFESSION_MODULE }));
                    }}
                  /> */}
                </div>
                <Typography.Text className={styles.professionalModuleLabel}>
                  I am a
                </Typography.Text>
                <Form
                  className="professionalModuleForm"
                  name="basic"
                  labelCol={{ span: 8 }}
                  // wrapperCol={{ span: 16 }}
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  form={form}
                  onKeyDown={(e) => {
                    e.key === "Enter" && e.preventDefault();
                  }}
                >
                  <Form.Item
                    name="profession"
                    rules={[
                      {
                        required: true,
                        message: "Please select your profession",
                      },
                    ]}
                  >
                    <Radio.Group
                      className="radioOptionsGroup"
                      options={profession}
                      onChange={(e) => {
                        setProfessionSelection(e.target.value);
                        setSubProfessionSelected("");
                        resetState();
                      }}
                    />
                  </Form.Item>
                  {professionSelected !== "currently-not-working" && (
                    <>
                      <Form.Item
                        name="prof-sub-category"
                        rules={[
                          {
                            required: true,
                            message: "Please select your sub profession",
                          },
                        ]}
                      >
                        <Radio.Group
                          className="radioCustom"
                          options={subProfessionList}
                          onChange={(e) => {
                            setSubProfessionSelected(e.target.value);
                            resetState();
                          }}
                        />
                      </Form.Item>

                      {professionSelected &&
                        subProfessionValue.includes(subProfessionSelected) &&
                        subProfessionSelected !== "hbshdjknl" && (
                          <>
                            <Form.Item
                              name="institute"
                              rules={[
                                {
                                  required: true,
                                  message: "You cannot leave it empty",
                                },
                              ]}
                            >
                              <InstituteSelect
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
                                placeholder={`Name of ${instituteOrOrg}*`}
                                fetchOptions={searchInstitutes}
                                onChange={(newValue) => {
                                  form.setFieldsValue({
                                    institute:
                                      newValue.label === "Other"
                                        ? `Other`
                                        : newValue.label,
                                  });
                                  setInstitute(
                                    newValue.label === "Other"
                                      ? ""
                                      : newValue.label
                                  );
                                  setInstituteName("");
                                }}
                                style={{
                                  width: "100%",
                                }}
                                otherDefaultValue={otherDefaultValue}
                                setOtherDefaultValue={setOtherDefaultValue}
                              />
                            </Form.Item>
                            {/* {institute && institute && (
                              <Typography.Text className={styles.formLabel}>
                                {institute}
                              </Typography.Text>
                            )} */}
                            {institute && (
                              <Form.Item
                                // rules={[
                                //   {
                                //     required: true,
                                //     message: "Please upload your id",
                                //   },
                                // ]}
                                name="upload"
                              >
                                <DragNDrop
                                  setImageUploaded={(file) =>
                                    form.setFieldsValue({
                                      upload: file?.result?.location,
                                    })
                                  }
                                >
                                  <>
                                    <p className="ant-upload-drag-icon">
                                      <InboxOutlined />
                                    </p>
                                    {/* <p className="ant-upload-text">Click or drag file to this area to upload</p> */}
                                    <p className="ant-upload-hint">
                                      {`Upload ${instituteOrOrg} ID (*Optional)`}
                                    </p>
                                  </>
                                </DragNDrop>
                              </Form.Item>
                            )}
                          </>
                        )}
                    </>
                  )}
                  {!form.getFieldsValue().profession && (
                    <div className="signupTextButtonsWrap">
                      <Button className="active" type="text" onClick={skip}>
                        skip for now
                      </Button>
                    </div>
                  )}
                  <Form.Item
                    className="signupButtonsWrap"
                    // wrapperCol={{ offset: 8, span: 16 }}
                    // shouldUpdate
                  >
                    <Button
                      type="secondary"
                      // htmlType="submit"
                      shape="round"
                      onClick={() =>
                        dispatch(changePage({ page: DETAILS_MODULE }))
                      }
                    >
                      Back
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      shape="round"
                      loading={isLoading}
                      // disabled={isLoading}
                      disabled={disable()}
                    >
                      complete sign up
                    </Button>
                    {/* <Button
                      type="secondary"
                      htmlType="submit"
                      shape="round"
                      loading={isLoading}
                      disabled={isLoading}
                      // disabled={
                      //   !form.isFieldsTouched(true) ||
                      //   !!form
                      //     .getFieldsError()
                      //     .filter(({ errors }) => errors.length).length
                      // }
                    >
                      Back
                    </Button> */}
                    {/* )} */}
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

export default AddProfessionModule;
