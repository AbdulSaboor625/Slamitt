import { Modal } from "antd";

const CustomChildModal = ({
  children,
  open,
  onOk,
  onCancel,
  closable,
  footer,
}) => {
  return (
    <Modal
      className="rewardFormSubmitModal"
      footer={footer}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      closable={closable}
    >
      {children}
    </Modal>
  );
};

export default CustomChildModal;
