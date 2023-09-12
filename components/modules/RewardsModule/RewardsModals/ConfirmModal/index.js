import { Button, Modal } from "antd";
import React from "react";
import {
  PayInrdIcons,
  WalletImage,
  WalletImageWithCoin,
} from "../../../../../utility/iconsLibrary";

const ConfirmModal = ({
  isModalVisible,
  hideModal,
  onSubmit,
  coins,
  payment,
}) => {
  return (
    <div>
      <Modal
        className="confirmPurchaseModal"
        closable={true}
        visible={isModalVisible}
        onOk={hideModal}
        onCancel={hideModal}
        footer={null}
        style={{ borderRadius: "20px" }}
        // afterClose={() => setValue("")}
      >
        <>
          <strong className="confirmPurchaseModalTitle">Confirm Purchase</strong>
          <div className="confirmPurchaseModalImage"><WalletImageWithCoin /></div>
          <p>Change your Wallet with {coins || 0} slam Coins</p>
          <Button
            type="primary"
            onClick={() => {
              onSubmit();
              hideModal();
            }}
          >
            <PayInrdIcons />
            INR {payment?.toFixed(2) || 0}
          </Button>
        </>
      </Modal>
    </div>
  );
};

export default ConfirmModal;
