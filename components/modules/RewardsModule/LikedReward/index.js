import { Avatar, Button } from "antd";
import {
  EyeViewIcon,
  HeartIcon,
  BagIcon,
  LikedIcon,
} from "../../../../utility/iconsLibrary";
import { useRouter } from "next/router";

const LikedReward = ({ data, handleRemoveLiked }) => {
  const router = useRouter();
  return (
    <div className="likedDrawerItem">
      <div className="likedDrawerItemImage">
        {/* <image src={data?.image} alt={data?.name} /> */}
        <img src={data?.cardImage} alt={data?.name} />
        <span
          className="btnLiked"
          onClick={() => handleRemoveLiked(data?.productCode)}
        >
          <LikedIcon />
        </span>
      </div>
      <div className="likedDrawerItemTextbox">
        <div className="likedDrawerItemTextHead">
          <strong className="itemTitle">{data?.name}</strong>
          <span className="itemType">{data?.brand}</span>
          <div className="itemExploreInfoWrap">
            <div className="itemInfoStats">
              <span className="textViews">
                <EyeViewIcon /> {data?.views} Views
              </span>
              <span className="textlikes">
                <LikedIcon /> {data?.likes} Likes
              </span>
            </div>
            <span className="itemInfoStats">
              <BagIcon /> {data?.users?.length}/{data?.total} claimed
            </span>
          </div>
        </div>
        <div className="likedDrawerItemButton">
          <Button
            className="buttonClaim"
            onClick={() =>
              router.push(`/auth/reward-store?rewardId=${data?.productCode}`)
            }
          >
            Claim for{" "}
            <img
              src="https://rethink-competitions.s3.amazonaws.com/1692726095439_image_151.png"
              alt="Image Description"
            />{" "}
            {data?.claimCoins}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LikedReward;
