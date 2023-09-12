import { Button, Image, Modal } from "antd";
import { useState } from "react";

const ConfirmLockModal = ({
  isModalVisible,
  hideModal,
  onConfirm,
  description,
  locked = false,
}) => {
  const [value, setValue] = useState("");
  return (
    <Modal
      className="confirmLockModal"
      closable={false}
      visible={isModalVisible}
      onOk={hideModal}
      onCancel={hideModal}
      footer={null}
      style={{ borderRadius: "20px" }}
      afterClose={() => setValue("")}
    >
      <div className="confirmLockModalContent">
        <Image
          alt="Lock Modal"
          preview={false}
          width={100}
          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1684916437516_image_515.png"
        />
        <strong className="title">Confirming Registrations will lock your team.</strong>
        <p>
          You will be required to contact the organiser to make any updates to
          your team
        </p>
        <div className="confirmLockModalButtons">
          <Button onClick={hideModal} type="default">
            Cancel
          </Button>
          <Button type="primary" onClick={() => onConfirm()}>
            {locked ? "UNLOCK" : "LOCK"}
          </Button>
        </div>
      </div>
      {/* <Row justify="center">
        <Col span={24}>
          <Typography.Title className="deleteScoreModalTitle">
            Are you sure?
          </Typography.Title>
          <Typography.Text className="deleteScoreModalText">
            {description}
          </Typography.Text>
        </Col>
        <Col className="mt-5">
          <Typography.Text className="deleteScoreModalText">
            Type LOCK to confirm
          </Typography.Text>
          <div className="deleteScoreModalFooterField">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{ height: "2.5rem" }}
              size="small"
              placeholder="LOCK"
              suffix={
                <>
                  <Button
                    className={
                      value.toLowerCase() == "lock"
                        ? "deleteContainerButton"
                        : ""
                    }
                    type="primary"
                    disabled={value.toLowerCase() !== "lock"}
                    onClick={() => {
                      if (value.toLowerCase() === "lock") onConfirm();
                    }}
                  >
                    LOCK
                  </Button>
                  <Button onClick={hideModal} type="primary">
                    Cancel
                  </Button>
                </>
              }
            />
          </div>
        </Col>
      </Row> */}
    </Modal>
  );
};

export default ConfirmLockModal;
