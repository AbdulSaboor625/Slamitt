import { Avatar, Image, Select } from "antd";
const AppSelect = ({
  option,
  onChange,
  placeholder,
  dropdownRender,
  className,
  defaultValue,
  bordered,
  showArrow,
  mode,
  value,
  showSearch,
  disabled = false,
  onSelect,
  notFoundContent,
}) => {
  return (
    <Select
      disabled={disabled}
      showSearch={showSearch}
      bordered={bordered}
      dropdownRender={dropdownRender}
      mode={mode === "tags" ? mode : null}
      style={{ width: "100%" }}
      placeholder={placeholder}
      onChange={onChange}
      defaultValue={defaultValue}
      className={className}
      showArrow={showArrow}
      value={value}
      onSelect={onSelect}
      notFoundContent={notFoundContent}
    >
      {option &&
        option.map((item, index) => (
          <Select.Option key={item.value} value={item.value}>
            {typeof item.image == "object" && item.image.emoji}
            {item.image && <Avatar size="small" src={item.image} />}
            {item.label}
          </Select.Option>
        ))}
    </Select>
  );
};

export default AppSelect;
