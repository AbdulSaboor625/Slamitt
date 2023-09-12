import { useRouter } from "next/router";
import {
  EyeViewIcon,
  HeartIcon,
  HeartOutlineIcon,
} from "../../../../utility/iconsLibrary";

const RewardCard = ({ reward, likedRewards, handleLiked }) => {
  const router = useRouter();
  return (
    <div className="rewardExploreListLeft">
      <div className="rewardExploreListItemsHolder">
        <div
          className="rewardExploreListItem"
          onClick={(e) => {
            router.push(`/auth/reward-store?rewardId=${reward?.productCode}`);
          }}
        >
          <div className="rewardImage">
            <img src={reward?.cardImage} alt="Image Description" />
          </div>
          <div className="rewardImageCaption">
            <div className="rewardInfoHead">
              <span className="textViews" style={{ color: "white" }}>
                <EyeViewIcon /> {reward?.views}
              </span>
              <strong className="itemTitle" style={{ color: "white" }}>
                {reward?.title}
              </strong>
              <span className="itemType" style={{ color: "white" }}>
                {reward?.brand}
              </span>
            </div>
            <div className="rewardInfoFoot">
              <div className="rewardPoints">
                <img
                  src="https://rethink-competitions.s3.amazonaws.com/1692726095439_image_151.png"
                  alt="Image Description"
                />
                {reward?.claimCoins}
              </div>
              <div
                className="buttonLiked"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLiked(reward?.productCode);
                }}
              >
                {!likedRewards?.filter(
                  (item) => item?.productCode === reward?.productCode
                ).length ? (
                  <HeartOutlineIcon />
                ) : (
                  <HeartIcon />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;
