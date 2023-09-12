import { DatePicker, Form, Radio, Select, Table, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Api from "../../../../services";
import { capitalize } from "../../../../utility/common";
import { AGE_LIMIT } from "../../../../utility/config";
import {
  CalendarIcon,
  CheckedGreenIcon,
  HatIcon,
  MailIcon,
} from "../../../../utility/iconsLibrary";
import FormField from "../../../FormField";

const BasicInfo = ({ editable, user, setUpdateUser, form }) => {
  const [instituteOptions, setInstituteOptions] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState(user?.institute);
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

  const { Column } = Table;
  const tableData = [
    // name
    {
      key: "1",
      title: <Typography.Text>Name</Typography.Text>,
      info: (
        <div className="basicInformationUserFields">
          {editable ? (
            <div className="basicInformationUserFieldsWrap">
              <FormField
                type="text"
                name="fName"
                placeholder={user?.fName || "First Name"}
              />
              <FormField
                type="text"
                name="lName"
                placeholder={user?.lName || "Last Name"}
              />
            </div>
          ) : (
            <Typography.Text>
              {user?.fName} {user?.lName}
            </Typography.Text>
          )}
        </div>
      ),
    },
    // email
    {
      key: "2",
      title: <Typography.Text>Email</Typography.Text>,
      info: (
        <div className="emailInfo">
          <div className="emailInfoWrap">
            <Typography.Text className="">
              <MailIcon className="emailIcon" />
              {user?.email}
            </Typography.Text>
            {/* {editable ? (
              <Button
                className="editButton"
                type="text"
                icon={<EditPencilIcon />}
                htmlType="button"
              />
            ) : ( */}
            <CheckedGreenIcon className="verifedIcon" />
            {/* )} */}
          </div>
        </div>
      ),
    },
    // institute
    {
      key: "3",
      title: (
        <Typography.Text className={`${user?.institute_name ? "bg-red" : ""}`}>
          Institute Name
        </Typography.Text>
      ),
      info: (
        <div className="basicInformationUserInstitute">
          {editable ? (
            <Form.Item name="institute_name">
              <Select
                disabled={true}
                value={selectedInstitute}
                name="institute_name"
                showArrow={false}
                showSearch={true}
                filterOption={false}
                placeholder={
                  user?.institute_name || "Institute/Organisation Name*"
                }
                onSearch={(value) => {
                  if (value) {
                    const newInstituteOptions = institutes.filter((i) =>
                      i.label?.toLowerCase().includes(value.toLowerCase())
                    );
                    setInstituteOptions([
                      ...newInstituteOptions,
                      {
                        isVerified: false,
                        label: value,
                        value,
                      },
                    ]);
                  } else {
                    setInstituteOptions([...institutes]);
                  }
                }}
                onSelect={(value) => {
                  setSelectedInstitute(value);
                }}
              >
                {(instituteOptions || []).map((option) => (
                  <Select.Option key={option.code} value={option.label}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          ) : (
            <Typography.Text className="basicInformationUserInstituteWrap">
              <HatIcon className="hatIcon" />
              <span className="basicInformationUserInstituteName">
                {user?.institute_name}
              </span>
              <CheckedGreenIcon className="verifedIcon" />
            </Typography.Text>
          )}
        </div>
      ),
    },
    // gender
    {
      key: "4",
      title: (
        <Typography.Text className={`${!user?.gender ? "text-error" : ""}`}>
          Gender
        </Typography.Text>
      ),
      info: (
        <div className="basicInformationUserGender">
          {editable ? (
            <Form.Item
              name="gender"
              label=" Gender"
              rules={[{ required: true }]}
              requiredMark={"optional"}
            >
              <Radio.Group
                defaultValue={user?.gender}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
              />
            </Form.Item>
          ) : (
            <Typography.Text>{capitalize(user?.gender)}</Typography.Text>
          )}
        </div>
      ),
    },
    // dob
    {
      key: "5",
      title: (
        <Typography.Text className={`${!user?.dob ? "text-error" : ""}`}>
          D.O.B
        </Typography.Text>
      ),
      info: (
        <div className="basicInformationUserDate">
          {editable ? (
            <Form.Item name="dob" label="D.O.B">
              <DatePicker
                defaultPickerValue={moment().subtract(AGE_LIMIT, "years")}
                defaultValue={user?.dob ? moment(user?.dob) : null}
                format={["DD/MM/YYYY", "DD/MM/YY"]}
                placeholder={
                  user?.dob
                    ? moment(user?.dob).format("DD/MM/YYYY")
                    : "Not Filled"
                }
                disabledDate={(current) => {
                  return (
                    current.valueOf() > moment().subtract(AGE_LIMIT, "years")
                  );
                }}
              />
            </Form.Item>
          ) : (
            <Typography.Text>
              <CalendarIcon className="calendarIcon" />
              {user?.dob
                ? moment(user?.dob).format("DD MMM, YYYY")
                : "Not Filled"}
            </Typography.Text>
          )}
        </div>
      ),
    },
    // profession
    // {
    //   key: "6",
    //   title: "I am a",
    //   info: (
    //     <div className="basicInformationUserProfession">
    //       {editable ? (
    //         <Form.Item name="profession">
    //           <Radio.Group className="radioOptionsGroup" options={profession} />
    //         </Form.Item>
    //       ) : (
    //         <Typography.Text>
    //           {capitalize(user?.professionType)}
    //         </Typography.Text>
    //       )}
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="basicInformationContent">
      <Form form={form}>
        <Table
          className="basicInformationTable"
          dataSource={tableData}
          pagination={false}
        >
          <Column dataIndex="title" key="title" />
          <Column dataIndex="info" key="info" />
        </Table>
      </Form>
      {/* <div className="basicInformationContentID">
        <Typography.Title level={5}>ID Card</Typography.Title>
        {editable ? (
          <div className="basicInformationContentIDImage">
            <DragNDrop>
              <>
                <p className="ant-upload-drag-icon">
                  <UploadIcon />
                </p>
                <p className="ant-upload-hint">Upload</p>
              </>
            </DragNDrop>
          </div>
        ) : (
          <div className="basicInformationContentIDImage">
            <Image
              width={215}
              height={140}
              // className="ml-48"
              src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1658755590013_image_1.png"
              alt=""
              preview={false}
            />
          </div>
        )}
      </div> */}
    </div>
  );
};

export default BasicInfo;
