import LikedReward from "../LikedReward";

const LikedRewards = ({ data, handleRemoveLiked }) => {
  return (
    <div className="likedDrawerItemWrapper">
      {data?.map((item, idx) => (
        <LikedReward
          key={idx}
          data={item?.product}
          handleRemoveLiked={handleRemoveLiked}
        />
      ))}
    </div>
  );
};

export default LikedRewards;
