import { Button, Modal } from "antd";
import React from "react";
import {
  DownArrowIcons,
  DownloadInvoiceIcon,
  PayInrdIcons,
  PlusIcons,
  RewardCoinImg,
  WalletImage,
  WalletImageWithCoin,
} from "../../../../../utility/iconsLibrary";
import moment from "moment";

const ViewTrasactionmodal = ({
  isModalVisible,
  hideModal,
  payment,
  coins,
  purchaseHistory,
  competition,
}) => {
  return (
    <div>
      <Modal
        className="viewTrasactionsModal"
        closable={true}
        visible={isModalVisible}
        onOk={hideModal}
        onCancel={hideModal}
        footer={null}
        style={{ borderRadius: "20px" }}
        // afterClose={() => setValue("")}
      >
        <strong className="viewTrasactionsModalTitle">View Trasactions</strong>
        <div className="asideWalletBox">
          <div className="asideWalletBoxLeft">
            <div className="iconWallet">
              <WalletImage />
            </div>
            <div className="priceValues">
              <strong className="points">
                {competition?.slamCoins?.coins}
              </strong>
              <span className="price">
                ₹ {competition?.slamCoins?.coins * 10}
              </span>
            </div>
          </div>
          <span className="textWallet">Wallet</span>
        </div>
        <div className="pointsItemBoxesList">
          {purchaseHistory?.map((item ,idx) => (
            <div className="pointsItemBox" key={idx}>
              <div className="pointsItemBoxLeft">
                <span className="date">
                  {moment(item?.createdAt)?.format("D MMM, YYYY")}
                </span>
                <div className="earnedPoints">
                  <PlusIcons />
                  <div className="price">₹ {item?.totalAmount}</div>
                  <DownArrowIcons />
                </div>
              </div>
              <div className="pointsItemBoxRight">
                <div className="iconImage">
                  <RewardCoinImg />
                </div>
                <strong className="pointsCount">{item?.coins}</strong>
              </div>
            </div>
          ))}

          {/* <div className="pointsItemBox">
            <div className="pointsItemBoxLeft">
              <span className="date">13 sep, 2023</span>
              <div className="earnedPoints">
                <PlusIcons />
                <div className="price">₹ 5,900.00</div>
                <DownArrowIcons />
              </div>
            </div>
            <div className="pointsItemBoxRight">
              <div className="iconImage">
                <RewardCoinImg />
              </div>
              <strong className="pointsCount">500</strong>
            </div>
          </div> */}
        </div>
        <div className="viewTrasactionsModalButtons">
          <Button type="secondary">
            <DownloadInvoiceIcon />
            Invoice
          </Button>
          <Button type="secondary">
            <DownloadInvoiceIcon />
            Trasaction history
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ViewTrasactionmodal;
