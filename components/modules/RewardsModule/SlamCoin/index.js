import { Button, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import {
  PayInrdIcons,
  RewardCoinImg,
  WalletCoinIcon,
  WalletImage,
} from "../../../../utility/iconsLibrary";
import ConfirmModal from "../RewardsModals/ConfirmModal";
import ViewTrasactionmodal from "../RewardsModals/ViewTrasactionmodal";
import Api from "../../../../services";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { notify } from "../../../../Redux/Actions";

const SlamCoin = ({ reward, setReward, purchaseHistory, competition }) => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewTrasactionModal, setIsViewTrasactionModal] = useState(false);
  const dispatch = useDispatch();

  const hideConfirmModal = () => {
    setIsModalVisible(false);
  };

  const hideTrasactionModal = () => {
    setIsViewTrasactionModal(false);
  };

  const [coins, setCoins] = useState();
  const [payment, setPayment] = useState();
  useEffect(() => {
    setPayment(
      Number(coins * 10) +
        Number((coins * 10 * 6) / 100) +
        Number((coins * 10 * 12) / 100)
    );
  }, [coins]);

  useEffect(() => {
    if (coins && payment)
      setReward((prev) => ({
        ...prev,
        slamCoins: coins || 0,
        payment: payment || 0,
      }));
  }, [coins, payment]);

  const handlePurchase = async () => {
    const res = await Api.post("/slamCoin/purchase", {
      competitionCode: router?.query?.index,
      coins: coins,
      fee: coins * 10,
      cgst: 6,
      igst: 12,
      totalAmount: payment,
    });
    if (res.code && res?.result) {
      setReward({ ...reward, walletRecharged: true });
      dispatch(
        notify({ type: "success", message: "Wallet Recharged Successfully..." })
      );
    }
  };

  return (
    <>
      <div className="rewardsSidebarContent">
        <strong className="certificatesEditorSidebarTitle">Slam Coins</strong>
        <Button className="certificatesEditorSidebarTag">Buy</Button>
        <div className="rewardCoinsBox">
          <div className="coinImage">
            <RewardCoinImg />
          </div>
          <Input
            placeholder="100"
            value={coins}
            onChange={(e) => setCoins(e.target.value)}
          />
        </div>
        <div className="textRadeemCoins">Radeem 100 slam coins for ₹ 1000</div>
        <ul className="amountCionsList">
          <li>
            <strong className="title bold">Fee</strong>
            <span className="amount">₹ {coins * 10 || 0}</span>
          </li>
          <li>
            <strong className="title">CGST (6%)</strong>
            <span className="amount">
              ₹ {Number((coins * 10 * 6) / 100) || 0}
            </span>
          </li>
          <li>
            <strong className="title">IGST (12%)</strong>
            <span className="amount">
              ₹ {Number((coins * 10 * 12) / 100) || 0}
            </span>
          </li>
          <li className="total">
            <strong className="title">Amount Payable</strong>
            <span className="amount">
              ₹ {payment ? payment?.toFixed(2) : 0}{" "}
            </span>
          </li>
        </ul>
        <div className="rewardsSidebarButtonWrap">
          <Button
            disabled={!coins}
            type="primary"
            onClick={() => setIsModalVisible(true)}
          >
            Recharge my wallet
          </Button>
          {!!purchaseHistory?.length && (
            <label
              className="viewTrasactionButton"
              onClick={() => setIsViewTrasactionModal(true)}
            >
              View Transaction
            </label>
          )}
        </div>
      </div>
      <div className="asideWalletBox">
        <div className="asideWalletBoxLeft">
          <div className="iconWallet">
            {competition?.slamCoins?.coins ? (
              <WalletCoinIcon />
            ) : (
              <WalletImage />
            )}
          </div>
          {competition?.slamCoins?.coins ? (
            <Input placeholder="00" value={competition?.slamCoins?.coins} />
          ) : (
            <Input placeholder="00" value={0} />
          )}
        </div>
        <span className="textWallet">Wallet</span>
      </div>
      <ConfirmModal
        isModalVisible={isModalVisible}
        hideModal={hideConfirmModal}
        onSubmit={handlePurchase}
        // onSubmit={() => setReward({ ...reward, walletRecharged: true })}
        payment={payment}
        coins={coins}
      />
      <ViewTrasactionmodal
        isModalVisible={isViewTrasactionModal}
        hideModal={hideTrasactionModal}
        payment={payment}
        coins={coins}
        purchaseHistory={purchaseHistory}
        competition={competition}
      />
    </>
  );
};

export default SlamCoin;
