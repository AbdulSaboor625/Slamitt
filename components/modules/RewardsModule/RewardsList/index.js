import { useEffect, useState } from "react";
import RewardCard from "../RewardCard";
import { useRouter } from "next/router";
import {
  EyeViewIcon,
  HeartIcon,
  HeartOutlineIcon,
} from "../../../../utility/iconsLibrary";

const RewardsList = ({ rewardsList, handleLiked, likedRewards }) => {
  const router = useRouter();

  function splitArrayWithGrid(arrayOfObjects) {
    const grid4Elements = arrayOfObjects.filter(
      (obj) => obj.gridType === "4xGrid"
    );
    const grid2Elements = arrayOfObjects.filter(
      (obj) => obj.gridType === "2xGrid"
    );

    const splitArrays = [];
    const chunkSize = 6;

    while (grid4Elements.length > 0 || grid2Elements.length > 0) {
      const subArray = [];

      // Add up to 4 elements with grid = 4
      for (let i = 0; i < 4 && grid4Elements.length > 0; i++) {
        subArray.push(grid4Elements.shift());
      }

      // Add up to 2 elements with grid = 2
      for (let i = 0; i < 2 && grid2Elements.length > 0; i++) {
        subArray.push(grid2Elements.shift());
      }

      // if(subArray?.length === 6 || (!grid2Elements.length && !grid4Elements.length))
      splitArrays.push(subArray);

      // If the maximum length of 6 is reached, create a new subarray
      if (splitArrays.length === chunkSize) {
        splitArrays.push([]);
      }
    }

    // Remove any empty subarrays created at the end
    // if (splitArrays[splitArrays.length - 1].length === 0) {
    //   splitArrays.pop();
    // }

    return splitArrays;
  }

  function splitArray(array, chunkSize) {
    const splitArrays = [];

    for (let i = 0; i < array.length; i += chunkSize) {
      splitArrays.push(array.slice(i, i + chunkSize));
    }

    return splitArrays;
  }
  const [rewards, setRewards] = useState([]);
  useEffect(() => {
    setRewards(splitArrayWithGrid(rewardsList));
  }, [rewardsList]);
  return (
    <div className="rewardExploreListHolder">
      {rewards?.map((item, idx) => (
        <div className="rewardExploreListRow" key={idx}>
          <div className="rewardExploreListLeft">
            <div className="rewardExploreListItemsHolder">
              {item?.slice(0, 4)?.map((reward) => (
                <div
                  className="rewardExploreListItem"
                  onClick={(e) => {
                    router.push(
                      `/auth/reward-store?rewardId=${reward?.productCode}`
                    );
                  }}
                >
                  <div className="rewardImage">
                    <img src={reward?.cardImage} alt="Image Description" />
                  </div>
                  <div className="rewardImageCaption">
                    <div className="rewardInfoHead">
                      <span className="textViews">
                        <EyeViewIcon /> {reward?.views}
                      </span>
                      <strong className="itemTitle">{reward?.title}</strong>
                      <span className="itemType">{reward?.brand}</span>
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
              ))}
            </div>
          </div>
          <div className="rewardExploreListRight">
            <div className="rewardExploreListItemsHolder">
              {item?.slice(4, 6)?.map((reward) => (
                <div
                  className="rewardExploreListItem itemLarge textWhite textRight"
                  onClick={() =>
                    router.push(
                      `/auth/reward-store?rewardId=${reward?.productCode}`
                    )
                  }
                >
                  <div className="rewardImage">
                    <img src={reward?.cardImage} alt="Image Description" />
                  </div>
                  <div className="rewardImageCaption">
                    <div className="rewardInfoHead">
                      <span className="textViews">
                        <EyeViewIcon /> {reward?.views}
                      </span>
                      <strong className="itemTitle">{reward?.title}</strong>
                      <span className="itemType">{reward?.brand}</span>
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
              ))}
            </div>
          </div>
        </div>
      ))}
      {/* {rewardsList?.map((item, index) => (
        <RewardCard
          key={index}
          reward={item}
          handleLiked={handleLiked}
          likedRewards={likedRewards}
        />
      ))} */}
    </div>
  );
};

export default RewardsList;
