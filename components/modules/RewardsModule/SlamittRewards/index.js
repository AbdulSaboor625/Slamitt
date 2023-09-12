import {
  FirstPlace,
  SecondPlace,
  SpecialMention,
  ThirdPlace,
} from "../../../../utility/iconsLibrary";

const SlamittRewards = ({}) => {
  const dummyData = [
    {
      image: <FirstPlace />,
      placeName: "1st Place",
      text: "Placing Team codes will show up on the leaderboard",
    },
    {
      image: <SecondPlace />,
      placeName: "1st Place",
      text: "Placing Team codes will show up on the leaderboard",
    },
    {
      image: <ThirdPlace />,
      placeName: "1st Place",
      text: "Placing Team codes will show up on the leaderboard",
    },
    {
      image: <SpecialMention />,
      placeName: "1st Place",
      text: "Placing Team codes will show up on the leaderboard",
    },
    {
      image: <SpecialMention />,
      placeName: "1st Place",
      text: "Placing Team codes will show up on the leaderboard",
    },
  ];
  return (
    <div>
      <div>
        {dummyData.map((data) => (
          <div>
            {data.image}
            <div>
              <div>{data.placeName}</div>
              <div>{data.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlamittRewards;
