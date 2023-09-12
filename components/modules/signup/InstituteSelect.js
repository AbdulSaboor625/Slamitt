import { InfoCircleFilled } from "@ant-design/icons";
import { Input, Select, Typography } from "antd";
import "antd/dist/antd.css";
import debounce from "lodash/debounce";
import { useMemo, useRef, useState } from "react";
import { capitalize } from "../../../utility/common";

function InstituteSelect({
  createInstitutes,
  fetchOptions,
  value,
  debounceTimeout = 800,
  other,
  onSelect,
  otherDefaultValue,
  setOtherDefaultValue,
  ...props
}) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const [otherSelected, setOtherSelected] = useState(other || false);
  const fetchRef = useRef(0);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        newOptions.forEach((option) => {
          option.label = option.instituteName;
          option.value = option.code;
          option.isVerified = option.isVerified;
        });
        if (newOptions.length === 0) {
          setOptions([{ label: "Other", value: "other" }, ...newOptions]);
        } else {
          setOptions([...newOptions, { label: "Other", value: "other" }]);
        }
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  const propsModified = value
    ? {
        ...props,
        value,
      }
    : props;

  return (
    <>
      <Select
        {...propsModified}
        autoClearSearchValue
        labelInValue
        // value={value}
        filterOption={false}
        // onKeyDown={(e) => {
        //   if (e.key === "Enter") {
        //     if (e.target.value) {
        //       createInstitutes(e.target.value);
        //       selectRef.current.blur();
        //     }
        //   }
        // }}
        onSearch={(e) => {
          debounceFetcher(e);
          setOtherDefaultValue(e);
        }}
        notFoundContent={fetching ? null : null}
        onSelect={(value) => {
          setOtherSelected(value.value.toLowerCase() === "other");
          onSelect(value.value);
        }}
        suffixIcon={null}
      >
        {options.map((option) => (
          <Select.Option key={option.code} value={option.label}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
      {otherSelected && (
        <>
          <Input
            onInput={(e) => (e.target.value = capitalize(e.target.value))}
            type={"text"}
            onChange={(e) => createInstitutes(e.target.value)}
            placeholder="Enter Institute Name"
            defaultValue={otherDefaultValue}
            style={{
              marginTop: "1rem",
              fontSize: "1.5rem",
              borderRadius: "0.5rem",
            }}
          />

          <div className="flex items-center mt-3">
            <InfoCircleFilled style={{ marginRight: "0.5rem" }} />
            <Typography.Text>
              Your organisation Or institute will be verified soon.
            </Typography.Text>
          </div>
        </>
      )}
    </>
  );
} // Usage of DebounceSelect

export default InstituteSelect;
