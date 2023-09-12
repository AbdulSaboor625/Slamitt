import { Button, Image, Modal, Typography } from "antd";
import React from "react";

const TakeRoundLiveConfirmationModal = ({ isVisible, onConfirm, onCancel }) => {
  return (
    <Modal
      className="sessionEmailPopup"
      visible={isVisible}
      onCancel={onCancel}
      onOk={onConfirm}
      okText={"CONFIRM"}
    >
      <div className="sessionEmailPopupContent">
        <Image src="/img-email.png" preview={false} />
        <Typography.Text className="sessionEmailPopupText">
          Taking this round live will automatically send all the added judges an
          email invite
        </Typography.Text>
      </div>
    </Modal>
  );
};

export default TakeRoundLiveConfirmationModal;
