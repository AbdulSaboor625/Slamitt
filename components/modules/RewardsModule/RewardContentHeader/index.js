import { Button } from "antd";
import { useRouter } from "next/router";

const RewardContentHeader = ({}) => {
  const router = useRouter();
  return (
    <div className="attractParticipantsBox">
      <div className="attractParticipantsTextbox">
        <strong className="title">
          Attract participants with Reward Points
        </strong>
        <p>
          Incentivise participants to register and perform by recharging your
          competition with reward points.{" "}
        </p>
        <Button
          className="btn-reward"
          onClick={() => router.push("/auth/reward-store")}
        >
          Reward Store
        </Button>
      </div>
      <div className="attractParticipantsImage">
        <img
          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1687539198032_image.png"
          alt="Image"
        />
      </div>
    </div>
  );
};

export default RewardContentHeader;
