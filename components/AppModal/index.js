import { Modal } from "antd";

const AppModal = ({
  onOk,
  onCancel,
  isVisible,
  children,
  className,
  footer = null,
  closable = true,
}) => {
  return (
    <Modal
      className={className}
      title={null}
      centered
      visible={isVisible}
      onOk={onOk}
      onCancel={onCancel}
      footer={footer}
      destroyOnClose={true}
      zIndex={1049}
      closable={closable}
    >
      {{ ...children }}
    </Modal>
  );
};

export default AppModal;
