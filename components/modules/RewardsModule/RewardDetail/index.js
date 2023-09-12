import { Avatar, Button, Image, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import RewardDrawer from "../../../RewardDrawer";
import {
  ArrowBackIcon,
  HeartIcon,
  PinIcon,
} from "../../../../utility/iconsLibrary";
import OtpInput from "react-otp-input";
import CustomChildModal from "../RewardsModals/CustomChildModal";
import {
  BagIcon,
  EyeViewIcon,
  HeartOutlineIcon,
  LikedIcon,
  PlayIcon,
  ShareIcon,
} from "../../../../utility/iconsLibrary";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import firebase from "firebase/app";
import { auth } from "../../../../services/firebase.config";
import { useDispatch } from "react-redux";
import { notify } from "../../../../Redux/Actions";
import Api from "../../../../services";
import { useRouter } from "next/router";
import moment from "moment";

const RewardDetail = ({ rewardDetail, handleLiked, userCoins }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [rewardsList, setRewardsList] = useState([]);
  const [isOpenDrawer, setOpenDrawer] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);

  const [purchaseModal, setPurchaseModal] = useState(false);
  const [otp, setOtp] = useState();
  const [phone, setPhone] = useState();
  const [otpVerified, setOtpVerified] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState();
  const [addAddress, setAddAddress] = useState({});

  const handleRewardViews = async (productCode) => {
    const res = await Api.get(`/rewardStore/products/${productCode}/views`);
  };

  const getRewardsByCategory = async (categoryCode) => {
    const res = await Api.get(`/rewardStore/products/all/${categoryCode}`);
    if (res?.code && !!res?.result?.length) setRewardsList(res?.result);
  };

  const getAllAddressesAdded = async () => {
    const res = await Api.get(`/user/addresses`);
    if (res?.code && !!res?.result?.length) setAddresses(res?.result);
  };

  useEffect(() => {
    if (rewardDetail?.categoryCode) {
      getRewardsByCategory(rewardDetail?.categoryCode);
    }
    if (rewardDetail?.productCode) {
      handleRewardViews(rewardDetail?.productCode);
    }
    getAllAddressesAdded();
  }, [rewardDetail]);

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      }
    );
  };

  const requestOtp = async (phoneNumber) => {
    if (phoneNumber?.length === 13) {
      if (!window.recaptchaVerifier) generateRecaptcha();
      let appVerifier = window.recaptchaVerifier;
      await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((response) => {
          dispatch(
            notify({
              message: `OTP sent Successfully to ${phoneNumber}`,
              type: "success",
            })
          );
          window.confirmationResult = response;
          setCheckoutStep(4);
        })
        .catch((error) => console.log("ee", error));
    } else {
      dispatch(
        notify({
          message: `Enter a valid phone number`,
          type: "info",
        })
      );
    }
  };

  const verifyOtp = (otp) => {
    if (otp?.length === 6) {
      let confirmationResult = window.confirmationResult;
      confirmationResult
        .confirm(otp)
        .then((result) => {
          setCheckoutStep(2);
          setOtpVerified(true);
          dispatch(
            notify({
              message: `OTP Verified successfully`,
              type: "success",
            })
          );
          setOtp("");
        })
        .catch((error) => {
          dispatch(
            notify({
              message: `Wrong OTP`,
              type: "info",
            })
          );
        });
    }
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      paritialVisibilityGutter: 0,
    },
    tablet: {
      breakpoint: { max: 1024, min: 699 },
      items: 2,
      paritialVisibilityGutter: 50,
    },
    mobile: {
      breakpoint: { max: 699, min: 0 },
      items: 1,
      paritialVisibilityGutter: 30,
    },
  };

  const indianStates = [
    {
      label: "Andaman and Nicobar Islands",
      value: "Andaman and Nicobar Islands",
    },
    { label: "Andhra Pradesh", value: "Andhra Pradesh" },
    { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
    { label: "Assam", value: "Assam" },
    { label: "Bihar", value: "Bihar" },
    { label: "Chandigarh", value: "Chandigarh" },
    { label: "Chhattisgarh", value: "Chhattisgarh" },
    {
      label: "Dadra and Nagar Haveli and Daman and Diu",
      value: "Dadra and Nagar Haveli and Daman and Diu",
    },
    { label: "Delhi", value: "Delhi" },
    { label: "Goa", value: "Goa" },
    { label: "Gujarat", value: "Gujarat" },
    { label: "Haryana", value: "Haryana" },
    { label: "Himachal Pradesh", value: "Himachal Pradesh" },
    { label: "Jammu and Kashmir", value: "Jammu and Kashmir" },
    { label: "Jharkhand", value: "Jharkhand" },
    { label: "Karnataka", value: "Karnataka" },
    { label: "Kerala", value: "Kerala" },
    { label: "Ladakh", value: "Ladakh" },
    { label: "Lakshadweep", value: "Lakshadweep" },
    { label: "Madhya Pradesh", value: "Madhya Pradesh" },
    { label: "Maharashtra", value: "Maharashtra" },
    { label: "Manipur", value: "Manipur" },
    { label: "Meghalaya", value: "Meghalaya" },
    { label: "Mizoram", value: "Mizoram" },
    { label: "Nagaland", value: "Nagaland" },
    { label: "Odisha", value: "Odisha" },
    { label: "Puducherry", value: "Puducherry" },
    { label: "Punjab", value: "Punjab" },
    { label: "Rajasthan", value: "Rajasthan" },
    { label: "Sikkim", value: "Sikkim" },
    { label: "Tamil Nadu", value: "Tamil Nadu" },
    { label: "Telangana", value: "Telangana" },
    { label: "Tripura", value: "Tripura" },
    { label: "Uttar Pradesh", value: "Uttar Pradesh" },
    { label: "Uttarakhand", value: "Uttarakhand" },
    { label: "West Bengal", value: "West Bengal" },
  ];

  const indianCities = [
    { label: "Mumbai", value: "Mumbai" },
    { label: "Delhi", value: "Delhi" },
    { label: "Bangalore", value: "Bangalore" },
    { label: "Hyderabad", value: "Hyderabad" },
    { label: "Chennai", value: "Chennai" },
    { label: "Kolkata", value: "Kolkata" },
    { label: "Pune", value: "Pune" },
    { label: "Ahmedabad", value: "Ahmedabad" },
    { label: "Jaipur", value: "Jaipur" },
    { label: "Lucknow", value: "Lucknow" },
    { label: "Surat", value: "Surat" },
    { label: "Nagpur", value: "Nagpur" },
    { label: "Indore", value: "Indore" },
    { label: "Bhopal", value: "Bhopal" },
    { label: "Kochi", value: "Kochi" },
    { label: "Patna", value: "Patna" },
    { label: "Vadodara", value: "Vadodara" },
    { label: "Thiruvananthapuram", value: "Thiruvananthapuram" },
    { label: "Coimbatore", value: "Coimbatore" },
    { label: "Visakhapatnam", value: "Visakhapatnam" },
    // Add more cities as needed
  ];

  // Check if all the properties of an object are empty or not
  function areAllPropertiesNotEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (!obj[key]) {
          return false;
        }
      }
    }
    return true;
  }

  const onSaveAddress = async () => {
    const res = await Api.post("/user/createAddress", addAddress);
    if (res?.code && res?.result) {
      getAllAddressesAdded();
      setCheckoutStep(2);
    }
  };

  const onPurchaseReward = async () => {
    const payload = {
      productCode: rewardDetail?.productCode,
      addressCode: selectedAddress?.addressCode,
      phoneNumber: `+91${phone}`,
      isPhoneVerified: otpVerified,
      deliveryCharges: 100,
      totalAmount: 100,
    };
    const res = await Api.post(`/rewardStore/claim`, payload);
    if (res?.code) {
      setPurchaseModal(true);
      setOpenDrawer(false);
      setOtpVerified(false);
      setSelectedAddress(null);
      setPhone("");
    }
  };

  return (
    <div className="rewardExploreDetailContent">
      {" "}
      <div className="rewardProductExplore">
        <div className="rewardProductImages">
          {rewardDetail?.gallery?.map((file) => (
            <div className="imageHolder">
              {file?.mediaType === "IMAGE" ? (
                <Image src={file?.mediaSource} alt="image" />
              ) : (
                <video src={file?.mediaSource} controls />
              )}
              {/* <span className="playButton">
                <PlayIcon />
              </span> */}
            </div>
          ))}

          {/* <div className="imageHolder">
            <img
              src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1692895085587_image02.jpg"
              alt="Image Description"
            />
          </div> */}
        </div>
        <div className="rewardProductDetails">
          <div className="rewardProductDetailsInfo">
            <h1 className="productHeading">{rewardDetail?.title}</h1>
            <strong className="itemType">{rewardDetail?.brand}</strong>
            <ul className="metaItems">
              <li>
                <HeartOutlineIcon className="heartIcon" />{" "}
                <span
                  className="text"
                  onClick={() => handleLiked(rewardDetail?.productCode)}
                >
                  Mark as Facourite
                </span>
              </li>
              <li>
                <ShareIcon className="shareIcon" />{" "}
                <span className="text">Share</span>
              </li>
            </ul>
            <div className="textbox">{rewardDetail?.description}</div>
            <span className="readMoreLink">Read More</span>
            <div className="itemExploreInfoWrap">
              <div className="itemInfoStats">
                <span className="textViews">
                  <EyeViewIcon /> {rewardDetail?.views} Views
                </span>
                <span className="textlikes">
                  <LikedIcon /> {rewardDetail?.likes} likes
                </span>
              </div>
              <span className="itemInfoStats">
                <BagIcon /> {rewardDetail?.orders?.length || 0}/
                {rewardDetail?.total} claimed
              </span>
            </div>
            <div className="likedDrawerItemButton">
              <Button
                className="buttonClaim"
                onClick={() => setOpenDrawer(true)}
              >
                Claim for{" "}
                <img
                  src="https://rethink-competitions.s3.amazonaws.com/1692726095439_image_151.png"
                  alt="Image Description"
                />{" "}
                {rewardDetail?.claimCoins}
              </Button>
            </div>
          </div>
          {!!rewardDetail?.orders?.length && (
            <div className="itemClaimedBlock">
              <strong className="title">Claimed By</strong>
              <Carousel responsive={responsive} autoplay={false}>
                {rewardDetail?.orders?.map((item) => (
                  <div className="itemClaimedBox">
                    <div className="itemClaimedAvatar">
                      <Avatar src={item?.user?.imageURL} />
                    </div>
                    <div className="itemClaimedTextbox">
                      <strong className="userName">
                        {item?.user?.fName} {item?.user?.lName}
                      </strong>
                      <time className="date">
                        {moment(item?.createdAt).format("DD MMM, YYYY")}
                      </time>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          )}
        </div>
      </div>
      {!!rewardsList?.length && (
        <div className="similarRewardsBlock">
          <div className="similarRewardsBlockHeader">
            <h2>Similar Rewards</h2>
            <p>People who viewed Vision Pro also viewed these products</p>
          </div>
          <div className="similarRewardsBlockSlider">
            <Carousel responsive={responsive} autoplay={false}>
              {rewardsList?.map((data) => (
                <div
                  className="rewardExploreListItem textWhite"
                  onClick={() =>
                    router.push(
                      `/auth/reward-store?rewardId=${data?.productCode}`
                    )
                  }
                >
                  <div className="rewardImage">
                    <img src={data?.cardImage} alt="Image Description" />
                  </div>
                  <div className="rewardImageCaption">
                    <div className="rewardInfoHead">
                      <span className="textViews">
                        <EyeViewIcon />
                        {data?.views}
                      </span>
                      <strong className="itemTitle">{data?.title}</strong>
                      <span className="itemType">{data?.brand}</span>
                    </div>
                    <div className="rewardInfoFoot">
                      <div className="rewardPoints">
                        <img
                          src="https://rethink-competitions.s3.amazonaws.com/1692726095439_image_151.png"
                          alt="Image Description"
                        />
                        {data?.coins}
                      </div>
                      <div className="buttonLiked">
                        <HeartOutlineIcon />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      )}
      <RewardDrawer
        closable={false}
        open={isOpenDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        {checkoutStep === 1 && (
          <div className="rewardCheckoutDrawer">
            <div className="rewardCheckoutDrawerWrap">
              <div className="rewardCheckoutDrawerHeader">
                <div className="rewardCheckoutDrawerImage">
                  <Image src={rewardDetail?.cardImage} />
                </div>
                <div className="rewardCheckoutDrawerHeaderTextbox">
                  <h1 className="productTitle">{rewardDetail?.name}</h1>
                  <strong className="brandName">{rewardDetail?.brand}</strong>
                  <div className="earnedCoins">
                    <div className="iconImg">
                      <img
                        src="https://rethink-competitions.s3.amazonaws.com/1692726095439_image_151.png"
                        alt="Image Description"
                      />
                    </div>
                    <span className="points">{rewardDetail?.claimCoins}</span>
                  </div>
                </div>
              </div>
              <div className="rewardCheckoutDrawerContent">
                <div className="cartItemRow">
                  <div className="cartItemTextbox">
                    <strong className="title">Product Total</strong>
                    <span className="taxNote">*Inclusive of Taxes</span>
                  </div>
                  <div className="cartItemPrice">
                    <div className="earnedCoins">
                      <div className="iconImg">
                        <img
                          src="https://rethink-competitions.s3.amazonaws.com/1692726095439_image_151.png"
                          alt="Image Description"
                        />
                      </div>
                      <span className="points">{rewardDetail?.claimCoins}</span>
                    </div>
                  </div>
                </div>
                <div className="cartItemRow">
                  <div className="cartItemTextbox">
                    <strong className="title">Delivery Fee</strong>
                  </div>
                  <div className="cartItemPrice">
                    <strong className="price">₹ 100</strong>
                  </div>
                </div>
                <div className="cartItemRow cartItemRowTotal">
                  <div className="cartItemTextbox">
                    <strong className="title">Product Total</strong>
                  </div>
                  <div className="cartItemPrice">
                    <div className="rewardWallet">
                      <img src="https://rethink-competitions.s3.amazonaws.com/1692284689449_image_527.png" />
                      <span className="text">
                        {userCoins}
                        <span> -{rewardDetail?.claimCoins}</span>{" "}
                      </span>
                    </div>
                    <strong className="price">₹ 100</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="rewardCheckoutDrawerFooter">
              <Button
                className="buttonCheckout"
                onClick={() => setCheckoutStep(2)}
              >
                Checkout
              </Button>
            </div>
          </div>
        )}
        {checkoutStep === 2 && (
          <div className="rewardCheckoutDrawer">
            <div className="rewardCheckoutDrawerWrap">
              <div className="rewardCheckoutDrawerBackHead">
                <ArrowBackIcon
                  className="iconBack"
                  onClick={() => setCheckoutStep(1)}
                />
                <strong className="subtitle">Billing</strong>
              </div>
              <div className="rewardCheckoutDrawerHeader">
                <div className="rewardCheckoutDrawerImage">
                  <Image src={rewardDetail?.cardImage} />
                </div>
                <div className="rewardCheckoutDrawerHeaderTextbox">
                  <h1 className="productTitle">{rewardDetail?.name}</h1>
                  <strong className="brandName">{rewardDetail?.brand}</strong>
                  <div className="earnedCoins">
                    <div className="iconImg">
                      <img
                        src="https://rethink-competitions.s3.amazonaws.com/1692726095439_image_151.png"
                        alt="Image Description"
                      />
                    </div>
                    <span className="points">{rewardDetail?.claimCoins}</span>
                  </div>
                </div>
              </div>
              <div className="rewardCheckoutDrawerContent">
                <div className="shippingBlock">
                  <strong className="title">Select Delivery Address</strong>
                  {addresses?.map((item) => (
                    <div className="addressBox">
                      <Button
                        className={`btnSelect ${
                          selectedAddress?.adderessCode ===
                            item?.adderessCode && "activeAddress"
                        }`}
                        onClick={() => setSelectedAddress(item)}
                      >
                        Select
                      </Button>
                      <address>
                        <PinIcon />
                        <span>
                          {item?.house}, {item?.city}, {item?.state}
                        </span>
                      </address>
                      <span className="text">{item?.street}</span>
                      <span className="text">{item?.pinCode}</span>
                    </div>
                  ))}
                </div>
                <div className="buttonWrap">
                  <Button
                    className="buttonOutline"
                    onClick={() => setCheckoutStep(3)}
                  >
                    + Add Address
                  </Button>
                </div>
                <div className="shippingBlock">
                  <strong className="title">Enter Contact Detail</strong>
                  <div className="shippingNumberInput">
                    <strong className="code">91</strong>
                    <div className="inputWrap">
                      <Input
                        type="number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="00000 00000"
                      />
                    </div>
                    {!otpVerified && (
                      <Button
                        className="btnVerify"
                        id="sign-in-button"
                        onClick={() => requestOtp(`+91${phone}`)}
                      >
                        verify
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="rewardCheckoutDrawerFooter">
              <Button
                className="buttonCheckout"
                disabled={!selectedAddress || !otpVerified}
                onClick={() => setCheckoutStep(5)}
              >
                Make Payment
              </Button>
            </div>
          </div>
        )}
        {checkoutStep === 3 && (
          <div className="rewardCheckoutDrawer">
            <div className="rewardCheckoutDrawerWrap">
              <div className="rewardCheckoutDrawerBackHead">
                <ArrowBackIcon
                  className="iconBack"
                  onClick={() => setCheckoutStep(2)}
                />
                <strong className="subtitle">Add New Address</strong>
              </div>
              <div className="rewardCheckoutDrawerContent">
                <div className="rewardCheckoutAddressForm">
                  <div className="rewardCheckoutAddressFormFiled">
                    <label>House/flat/floor No.</label>
                    <Input
                      type="text"
                      placeholder="Eg: No. 64, 5th Floor, E block"
                      value={addAddress?.house}
                      onChange={(e) =>
                        setAddAddress((prev) => ({
                          ...prev,
                          house: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="rewardCheckoutAddressFormFiled">
                    <label>Apartment/Road/Area</label>
                    <Input
                      type="text"
                      placeholder="Eg: Sannidhi Apartments, Rajkumar Road, Rajajinagar"
                      value={addAddress?.street}
                      onChange={(e) =>
                        setAddAddress((prev) => ({
                          ...prev,
                          street: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="rewardCheckoutAddressFormFiled">
                    <label>State</label>
                    <Select
                      options={indianStates}
                      placeholder="Eg: No. 64, 5th Floor, E block"
                      value={
                        addAddress?.state
                          ? {
                              label: addAddress?.state,
                              value: addAddress?.state,
                            }
                          : null
                      }
                      onChange={(e) =>
                        setAddAddress((prev) => ({
                          ...prev,
                          state: e,
                        }))
                      }
                    />
                  </div>
                  <div className="rewardCheckoutAddressFormFiled cityField">
                    <label>City</label>
                    <Select
                      options={indianCities}
                      value={
                        addAddress?.city
                          ? { label: addAddress?.city, value: addAddress?.city }
                          : null
                      }
                      onChange={(e) =>
                        setAddAddress((prev) => ({
                          ...prev,
                          city: e,
                        }))
                      }
                      placeholder="Your City"
                    />
                  </div>
                  <div className="rewardCheckoutAddressFormFiled pinField">
                    <label>Pin Code</label>
                    <Input
                      type="number"
                      value={addAddress?.pinCode}
                      onChange={(e) =>
                        setAddAddress((prev) => ({
                          ...prev,
                          pinCode: e.target.value,
                        }))
                      }
                      placeholder="000 000"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="rewardCheckoutDrawerFooter">
              <Button
                className="buttonCheckout"
                disabled={!areAllPropertiesNotEmpty(addAddress)}
                onClick={onSaveAddress}
              >
                Save Address
              </Button>
            </div>
          </div>
        )}
        {checkoutStep === 4 && (
          <div className="rewardCheckoutDrawer">
            <div className="rewardCheckoutDrawerWrap">
              <div className="rewardCheckoutDrawerBackHead">
                <ArrowBackIcon
                  className="iconBack"
                  onClick={() => setCheckoutStep(2)}
                />
                <strong className="subtitle">OTP Verification</strong>
              </div>
              <div className="rewardCheckoutDrawerContent">
                <div className="shippingBlock optForm">
                  <strong className="title">
                    Verify with OTP sent to +91 {phone}
                  </strong>
                  <div className="optInputGroup">
                    <OtpInput
                      className="optInputFiled"
                      hasErrored={false}
                      numInputs={6}
                      onChange={(e) => {
                        setOtp(e);
                        verifyOtp(e);
                      }}
                      value={otp}
                      shouldAutoFocus
                    />
                  </div>
                  <span
                    className="linkText"
                    onClick={() => requestOtp(`+91${phone}`)}
                  >
                    Resend OTP
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {checkoutStep === 5 && (
          <div className="rewardCheckoutDrawer">
            <div className="rewardCheckoutDrawerWrap">
              <div className="rewardCheckoutDrawerHeader">
                <div className="rewardCheckoutDrawerImage">
                  {/* <Image src={rewardDetail?.image} /> */}
                  <Image src={rewardDetail?.cardImage} />
                </div>
                <div className="rewardCheckoutDrawerHeaderTextbox">
                  <h1 className="productTitle">{rewardDetail?.name}</h1>
                  <strong className="brandName">{rewardDetail?.brand}</strong>
                  <div className="earnedCoins">
                    <div className="iconImg">
                      <img
                        src="https://rethink-competitions.s3.amazonaws.com/1692726095439_image_151.png"
                        alt="Image Description"
                      />
                    </div>
                    <span className="points">
                      {rewardDetail?.claimCoins + 100}
                    </span>
                  </div>
                </div>
              </div>
              <div className="rewardCheckoutDrawerContent">
                <div className="cartItemRow">
                  <div className="cartItemTextbox">
                    <strong className="title">Product Total</strong>
                    <span className="taxNote">*Inclusive of Taxes</span>
                  </div>
                  <div className="cartItemPrice">
                    <div className="earnedCoins">
                      <div className="iconImg">
                        <img
                          src="https://rethink-competitions.s3.amazonaws.com/1692726095439_image_151.png"
                          alt="Image Description"
                        />
                      </div>
                      <span className="points">
                        {rewardDetail?.claimCoins + 100}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="cartItemRow cartItemRowTotal">
                  <div className="cartItemTextbox">
                    <strong className="title">Product Total</strong>
                  </div>
                  <div className="cartItemPrice">
                    <div className="rewardWallet">
                      <img src="https://rethink-competitions.s3.amazonaws.com/1692284689449_image_527.png" />
                      <span className="text">
                        {userCoins} <span> -{rewardDetail?.claimCoins}</span>{" "}
                      </span>
                    </div>
                    <strong className="price">
                      ₹ {rewardDetail?.claimCoins + 100}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="rewardCheckoutDrawerFooter">
              <Button className="buttonCheckout" onClick={onPurchaseReward}>
                Confirm Purchase
              </Button>
            </div>
          </div>
        )}
      </RewardDrawer>
      <div style={{ display: "none" }} id="recaptcha-container"></div>
      <CustomChildModal
        open={purchaseModal}
        closable={false}
        onOk={() => {
          setPurchaseModal(false);
          setCheckoutStep(1);
        }}
        onCancel={() => {
          setPurchaseModal(false);
          setCheckoutStep(1);
        }}
        footer={null}
      >
        <div className="rewardFormSubmitStatus">
          <div className="submitStatusImage">
            <img src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1693509428156_iconsuccess.png" />
          </div>
          <strong className="title">Your purchase was successful!</strong>
          <span className="subtitle">
            Your purchase details have been mailed to you.
          </span>
        </div>
      </CustomChildModal>
    </div>
  );
};

export default RewardDetail;
