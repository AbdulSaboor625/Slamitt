import { Button, Form, Input } from "antd";
import React, { useRef } from "react";
import { capitalize } from "../../utility/common";
import { EditIcon } from "../../utility/iconsLibrary";

const AppBorderLessInput = ({
  placeholder,
  onChange,
  name,
  rules,
  onKeyDown,
  onBlur,
  onPressEnter,
  defaultValue,
  ref,
}) => {
  const [isBorderShowing, setBorderShowing] = React.useState(true);
  const inputRef = useRef(null);

  return (
    <div className="nameCompetitionFormRow">
      <Form.Item rules={rules} name={name}>
        <Input
          onInput={(e) => (e.target.value = capitalize(e.target.value))}
          ref={!ref ? inputRef : ref}
          type={"text"}
          placeholder={placeholder}
          bordered={isBorderShowing}
          onFocus={() => setBorderShowing(true)}
          onBlur={() => setBorderShowing(false)}
          onChange={onChange}
          onKeyDown={onKeyDown}
          autoFocus={isBorderShowing}
          onBlurCapture={onBlur}
          onPressEnter={onPressEnter}
          defaultValue={defaultValue}
        />
      </Form.Item>
      {!isBorderShowing && (
        <Button
          className="nameCompetitionEdit"
          icon={<EditIcon />}
          type="text"
          onClick={() => {
            setBorderShowing(true);
            if (!ref) {
              inputRef.current.focus({
                cursor: "end",
              });
            }
          }}
        />
      )}
    </div>
  );
};

export default AppBorderLessInput;
