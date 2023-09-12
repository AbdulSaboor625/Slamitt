import { Button, Form, Input, Select, Typography } from "antd";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { CrossIcon } from "../../utility/iconsLibrary";

const UsersForm = ({
  user,
  form,
  institutes,
  emailRule,
  instituteRule,
  containerUser,
  setContainerUser,
  membersLength,
  index,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [originalInstituteList, setOriginalInstituteList] = useState([]);
  const [searchableInstituteList, setInstitutesList] = useState([]);
  
  useEffect(() => {
    if (institutes.length) {
      setOriginalInstituteList(institutes);
      setInstitutesList(institutes);
    }
  }, [institutes]);

  useEffect(() => {
    const filteredData = _.chain(originalInstituteList)
      .filter((item) =>
        item.instituteName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sortBy("instituteName")
      .take(10)
      .value();
    setInstitutesList([
      ...filteredData,
      {
        instituteName: searchTerm,
        isActive: false,
        profession: "student",
        subProfession: "cgirhpyvay",
      },
    ]);
  }, [originalInstituteList, searchTerm]);

  const handleSearch = useCallback(
    (value) => {
      debouncedSearchTerm(value);
    },
    [debouncedSearchTerm]
  );

  const debouncedSearchTerm = _.debounce((value) => {
    setSearchTerm(value);
  }, 500);

  const onSelectInstitute = (e) => {
    const instituteData = JSON.parse(e);
    form.setFieldsValue({
      [`institute-${user.id}`]: instituteData.institute,
    });
    const modUsers = containerUser?.users?.map((usr) => {
      if (usr.id === user.id) {
        usr.institute = instituteData;
      }
      return usr;
    });
    form.validateFields([`institute-${user.id}`]);
    setContainerUser({ ...containerUser, users: [...modUsers] });
  };

  return (
    <div className="registrationFormGroup">
      <div className="registrationFormGroupHead">
        {index > 0 && (
          <Typography.Text className="registrationFormGroupTitle">
            {`Team Member #${index + 1}`}
          </Typography.Text>
        )}
        {index > 0 && (
          <Button
            icon={<CrossIcon />}
            type="text"
            className="buttonDelete"
            onClick={() => {
              form.resetFields([
                `email-${user.id}`,
                `firstName-${user.id}`,
                `lastName-${user.id}`,
                `institute-${user.id}`,
              ]);

              setContainerUser({
                users: containerUser?.users.filter((u) => u.id !== user.id),
              });
              form.validateFields();
            }}
          />
        )}
      </div>
      <Form.Item name={`email-${user.id}`} rules={emailRule}>
        <Input
          onFocus={(e) => {
            // this is for issue of autocomplete as most browsers ignore feature of autocomplet=false
            if (e.target.hasAttribute("readonly")) {
              e.target.removeAttribute("readonly");
              // fix for mobile safari to show virtual user.idboard
              e.target.blur();
              e.target.focus();
            }
          }}
          type={"email"}
          placeholder="Email"
          suffix={null}
          disabled={user?.lock?.email}
        />
      </Form.Item>

      <div className="registrationFormTwoFields">
        <Form.Item
          name={`firstName-${user.id}`}
          rules={[{ required: true, message: "PLease enter your first name" }]}
        >
          <Input
            type={"text"}
            placeholder="First Name"
            disabled={user?.lock?.firstName}
          />
        </Form.Item>
        <Form.Item name={`lastName-${user.id}`}>
          <Input
            type={"text"}
            placeholder="Last Name"
            disabled={user?.lock?.lastName}
          />
        </Form.Item>
      </div>

      <Form.Item name={`institute-${user.id}`} rules={instituteRule}>
        <Select
          showArrow={false}
          showSearch={true}
          filterOption={false}
          placeholder={"Choose Institute"}
          onSearch={handleSearch}
          onSelect={onSelectInstitute}
          disabled={user?.lock?.institute}
        >
          {searchableInstituteList.map((option, idx) => (
            <Select.Option
              key={idx}
              value={JSON.stringify({
                institute: option.instituteName,
                isActive: option.isActive,
              })}
            >
              {option.instituteName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      {/* {JSON.stringify(user?.institute)}
      <Typography.Text>
        {user?.institute?.isActive ? <VerifiedIcon /> : null}
      </Typography.Text> */}
    </div>
  );
};

export default UsersForm;
