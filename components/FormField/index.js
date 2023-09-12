import { Form, Input } from "antd";
import { useState } from "react";
import { capitalize } from "../../utility/common";
import { MailIcon } from "../../utility/iconsLibrary";
import { emailRule } from "../../utility/validatationRules";

const FormField = ({
  type,
  placeholder,
  name,
  dependencies,
  rules,
  prefix,
  suffix,
  label,
  defaultValue,
  onKeyDown,
  disabled,
  value,
  readOnly,
  bordered,
  onPressEnter,
  minLength,
  onBlur = false,
}) => {
  const [emailValidateType, setEmailValidateType] = useState("onBlur");

  switch (type) {
    case "email":
      return (
        <Form.Item
          name="email"
          rules={rules || emailRule}
          validateTrigger={emailValidateType}
        >
          <Input
            type="email"
            placeholder={placeholder}
            suffix={suffix || <MailIcon />}
            defaultValue={defaultValue}
            onInput={(e) =>
              (e.target.value = e.target.value.toLocaleLowerCase())
            }
            disabled={disabled}
            onPressEnter={(e) => {
              if (onPressEnter) onPressEnter(e.target.value);
            }}
            onBlur={(e) => {
              if (onBlur) {
                onBlur(e.target.value);
              }
              setEmailValidateType("onChange");
            }}
            readOnly={readOnly}
          />
        </Form.Item>
      );
    case "password":
      return (
        <Form.Item name={name} dependencies={dependencies} rules={rules}>
          <Input.Password
            minLength={minLength}
            placeholder={placeholder}
            readOnly={readOnly}
          />
        </Form.Item>
      );
    case "text":
      return (
        <Form.Item
          name={name}
          rules={rules}
          label={label}
          initialValue={defaultValue}
        >
          <Input
            className="inputstyle"
            type={"text"}
            placeholder={placeholder}
            prefix={prefix}
            suffix={suffix}
            onInput={(e) => (e.target.value = capitalize(e.target.value))}
            onKeyDown={onKeyDown}
            disabled={disabled}
            readOnly={readOnly}
            defaultValue={defaultValue}
            bordered={bordered}
            onPressEnter={onPressEnter}
          />
        </Form.Item>
      );
    default:
      return <p>No such input type present</p>;
  }
};

export default FormField;
