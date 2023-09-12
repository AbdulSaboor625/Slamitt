import { Avatar, Button, Image, Input } from "antd";
import Carousel from "react-multi-carousel";
import StoreCategoriesList from "../StoreCategoriesList";
import RewardsList from "../RewardsList";
import { useEffect, useState } from "react";
import RewardDrawer from "../../../RewardDrawer";
import { useRouter } from "next/router";
import {
  ArrowBackIcon,
  HeartIcon,
  LikedIcon,
  SearchIcon,
  WalletCoinIcon,
} from "../../../../utility/iconsLibrary";
import LikedRewards from "../LikedRewards";
import LikedReward from "../LikedReward";
import RewardDetail from "../RewardDetail";
import Api from "../../../../services";
import { useDispatch, useSelector } from "react-redux";
import { notify, refreshToken } from "../../../../Redux/Actions";

// [
//   {
//   id: 1,
//   image: "",
//   name: "Vision Pro 1",
//   brand: "Apple",
//   view: 120,
//   coins: 1200,
//   isLiked: false,
// },
// {
//   id: 2,
//   image: "",
//   name: "Vision Pro 2",
//   brand: "Apple",
//   view: 120,
//   coins: 1200,
//   isLiked: false,
// },
// {
//   id: 3,
//   image: "",
//   name: "Vision Pro 3",
//   brand: "Apple",
//   view: 120,
//   coins: 1200,
//   isLiked: false,
// },
// {
//   id: 4,
//   image: "",
//   name: "Vision Pro 4",
//   brand: "Apple",
//   view: 120,
//   coins: 12001,
//   isLiked: false,
// },
// {
//   id: 5,
//   image: "",
//   name: "Vision Pro 5",
//   brand: "Apple",
//   view: 120,
//   coins: 120011,
//   isLiked: false,
// },
// {
//   id: 6,
//   image: "",
//   name: "Vision Pro 6",
//   brand: "Apple",
//   view: 120,
//   coins: 1200,
//   isLiked: false,
// },
// {
//   id: 7,
//   image: "",
//   name: "Vision Pro 7",
//   brand: "Apple",
//   view: 120,
//   coins: 120022,
//   isLiked: false,
// },
// {
//   id: 8,
//   image: "",
//   name: "Vision Pro 8",
//   brand: "Apple",
//   view: 120,
//   coins: 1200,
//   isLiked: false,
// },
// {
//   id: 9,
//   image: "",
//   name: "Vision Pro 9",
//   brand: "Apple",
//   view: 120,
//   coins: 1200,
//   isLiked: false,
// },
// {
//   id: 10,
//   image: "",
//   name: "Vision Pro 10",
//   brand: "Apple",
//   view: 120,
//   coins: 1200,
//   isLiked: false,
// },
// {
//   id: 11,
//   image: "",
//   name: "Vision Pro 11",
//   brand: "Apple",
//   view: 120,
//   coins: 12004,
//   isLiked: false,
// },
// {
//   id: 12,
//   image: "",
//   name: "Vision Pro 12",
//   brand: "Apple",
//   view: 120,
//   coins: 12005,
//   isLiked: false,
// },]

const StoreModule = ({ pusher }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [rewardsList, setRewardsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openLiked, setOpenLiked] = useState(false);
  const [rewardDetail, setRewardDetail] = useState(null);
  const [likedRewards, setLikedRewards] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const getAllRewards = async () => {
    const res = await Api.get("/rewardStore/products");
    if (res?.code && !!res?.result?.length) setRewardsList(res?.result);
  };

  const getAllCategories = async () => {
    const res = await Api.get("/rewardStore/categories");
    if (res?.code && !!res?.result?.length) {
      setCategories(res?.result);
    }
  };

  const getAllLikedRewards = async (userCode) => {
    const res = await Api.get(`/rewardStore/products/liked/${userCode}`);
    if (res?.code && !!res?.result?.length) {
      setLikedRewards(res?.result);
    }
  };

  useEffect(() => {
    const channel = pusher.subscribe("NEW_REWARD_ADDED");

    channel.bind("receive_message", (payload) => {
      getAllRewards();
    });
  }, []);

  useEffect(() => {
    const channel = pusher.subscribe("SLAMCOINS_UPDATED");

    channel.bind("receive_message", (payload) => {
      dispatch(refreshToken());
    });
  }, []);

  useEffect(() => {
    getAllCategories();
    getAllRewards();
  }, []);

  useEffect(() => {
    if (user?.userCode) {
      getAllLikedRewards(user?.userCode);
    }
  }, [user]);

  const getSingReward = async (productCode) => {
    const res = await Api.get(`/rewardStore/products/${productCode}`);
    if (res?.code && res?.result) {
      setRewardDetail(res?.result);
    }
  };

  useEffect(() => {
    if (rewardDetail?.productCode) {
      const channel = pusher.subscribe(rewardDetail?.productCode);

      channel.bind("receive_message", (payload) => {
        if (
          payload?.event === "PRODUCT_CLAIMED" &&
          payload?.productCode === rewardDetail?.productCode
        ) {
          getSingReward(payload?.productCode);
        }
      });
    }
  }, [rewardDetail]);

  useEffect(() => {
    if (rewardDetail?.productCode) {
      const channel = pusher.subscribe(rewardDetail?.productCode);

      channel.bind("receive_message", (payload) => {
        if (
          payload?.event === "PRODUCT_CLAIMED" &&
          payload?.productCode === rewardDetail?.productCode
        ) {
          getSingReward(payload?.productCode);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (router.query.rewardId) getSingReward(router.query.rewardId);
    else setRewardDetail(null);
  }, [router]);

  const handleLiked = async (productCode) => {
    if (
      !likedRewards?.filter((item) => item?.productCode === productCode)?.length
    ) {
      const res = await Api.get(`/rewardStore/products/${productCode}/like`);
      if (res?.code && res?.result) {
        setRewardsList((prev) =>
          prev.map((item) =>
            item?.productCode === productCode
              ? { ...item, isLiked: true }
              : item
          )
        );
        setLikedRewards((prev) => [
          ...prev,
          ...rewardsList.filter((item) => item?.productCode === productCode),
        ]);
        dispatch(
          notify({
            type: "success",
            message: "Product has been added to favourites successfully",
          })
        );
      }
    } else {
      handleRemoveLiked(productCode);
    }
  };

  const handleRemoveLiked = async (productCode) => {
    const res = await Api.get(`/rewardStore/products/${productCode}/like`);
    if (res?.code && res?.result) {
      setLikedRewards((prev) =>
        prev.filter((item) => item?.productCode !== productCode)
      );
      setRewardsList((prev) =>
        prev.map((item) =>
          item?.productCode === productCode ? { ...item, isLiked: false } : item
        )
      );
      dispatch(
        notify({
          type: "success",
          message: "Product has been removed from favourites successfully",
        })
      );
    }
  };

  const onCategorySelected = async (categoryCode) => {
    if (categoryCode !== "all") {
      const res = await Api.get(`/rewardStore/products/all/${categoryCode}`);
      if (res?.code && !!res?.result?.length) setRewardsList(res?.result);
    } else {
      getAllRewards();
    }
  };

  const handleSearch = async () => {
    if (search) {
      const res = await Api.post("/rewardStore/products/search", { search });
      if (res?.code && res?.result) {
        setRewardsList(res?.result);
      }
    } else {
      getAllRewards();
    }
  };

  return (
    <div className="rewardExplorePageContent">
      <div className="rewardExplorePriHeader">
        <div className="rewardExplorePriHeaderLeft">
          {!rewardDetail ? (
            <strong className="rewardExplorePriHeaderTitle">Explore</strong>
          ) : (
            <div className="rewardDetailsBackHead">
              <span
                className="rewardDetailsBackButton"
                onClick={() => router.push("/auth/reward-store")}
              >
                {" "}
                <ArrowBackIcon />{" "}
              </span>{" "}
              <strong className="titleRewards">Rewards</strong>
            </div>
          )}
        </div>
        <div className="rewardExplorePriHeaderRight">
          <div className="rewardExploreWallet">
            <WalletCoinIcon />
            <span className="text">{user?.coins || 0}</span>
          </div>
          {!rewardDetail && (
            <div
              className="rewardExploreLiked"
              onClick={() => {
                setOpenLiked(true);
              }}
            >
              <LikedIcon /> <span className="text">{likedRewards.length}</span>
            </div>
          )}
        </div>
      </div>
      {!rewardDetail ? (
        <div>
          <div className="rewardExploreSecHeader">
            <div className="rewardExploreSecHeaderSlider">
              <StoreCategoriesList
                categories={categories}
                onCategorySelected={onCategorySelected}
              />
            </div>
            <div className="rewardExploreSecHeaderSearch">
              <SearchIcon />
              <Input
                name="search"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                onPressEnter={handleSearch}
                onBlur={handleSearch}
                placeholder="Search Items"
              />
            </div>
          </div>
          <div className="rewardExploreListWrapper">
            <RewardsList
              rewardsList={rewardsList}
              likedRewards={likedRewards}
              handleLiked={handleLiked}
            />
          </div>
        </div>
      ) : (
        <RewardDetail
          userCoins={user?.coins ? user?.coins : 0}
          rewardDetail={rewardDetail}
          handleLiked={handleLiked}
        />
      )}
      <RewardDrawer
        title={`Liked Products (${likedRewards?.length})`}
        closeIcon={<ArrowBackIcon />}
        open={openLiked}
        onClose={() => setOpenLiked(false)}
      >
        <LikedRewards
          data={likedRewards}
          handleRemoveLiked={handleRemoveLiked}
        />
      </RewardDrawer>
    </div>
  );
};
export default StoreModule;
