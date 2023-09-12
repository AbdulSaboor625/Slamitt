import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Image, Menu } from "antd";

const AppDropDown = ({ label, menu, iconShow, onClick, className = "" }) => {
  const menuList = (
    <Menu onClick={onClick}>
      {menu.map((item, index) => (
        <Menu.Item
          key={index}
          disabled={item?.disabled}
          icon={
            item?.image ? (
              <Image
                preview={false}
                src={item?.image}
                height={20}
                width={20}
                alt="categories"
              />
            ) : item?.icon ? (
              item?.icon
            ) : null
          }
        >
          <a target="_blank" rel="noopener noreferrer" href={item?.url}>
            {item?.label}
          </a>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown
      className={className}
      overlay={menuList}
      trigger={["click"]}
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
    >
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        {label} {iconShow && <DownOutlined />}
      </a>
    </Dropdown>
  );
};

export default AppDropDown;
