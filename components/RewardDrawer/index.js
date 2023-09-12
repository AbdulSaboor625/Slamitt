import { Drawer } from "antd";

const RewardDrawer = ({
  children,
  open,
  onClose,
  placement = "right",
  closeIcon,
  closable,
  title,
}) => {
  return (
    <div>
      <Drawer
        className="likeditemsDrawer"
        title={title}
        closable={closable}
        closeIcon={closeIcon}
        placement={placement}
        open={open}
        onClose={onClose}
        getContainer={false}
      >
        {children}
      </Drawer>
    </div>
  );
};

export default RewardDrawer;
