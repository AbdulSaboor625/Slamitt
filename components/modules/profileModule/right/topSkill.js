import { Typography, Image } from "antd";
import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import React from "react";
import { Radar } from "react-chartjs-2";
import { ExpandIcon } from "../../../../utility/iconsLibrary";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const TopSkill = () => {
  const data = {
    labels: [
      "Comunication",
      "Creativity",
      "Presentation",
      "Team Management",
      "Content",
      "Team Work",
    ],
    datasets: [
      {
        data: [20, 19, 17, 18, 19, 20],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="profileTopSkills">
      <div className="profileSidebarHead">
        <Typography.Title className="heading" level={3}>Top Skills</Typography.Title>
        <ExpandIcon className="iconExpand" />
      </div>
      <div className="profileStatsHolder blurState">
        {/* Hidden Profile item state */}
        <div className="profileStatsPlaceholderText hiddenMobile">
        Finish setting up your account to access your top skills
        </div>
        <div className="profileStatsPlaceholderText visibleMobile">
          Complete adding Account Info to preview your profile
        </div>
        {/* Top Skills Empty State */}
        <div className="profileEmptyStateBox">
          <Image
            preview={false}
            alt=""
            src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1675101668381_image_365.png"
          />
          <Typography.Text className="profileEmptyStateBoxText">Track, build and validate your skills</Typography.Text>
        </div>
        <div className="profileTopSkillsChart">
          {/* <Radar data={data} /> */}
          {/* <img src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663782123828_graphimage.png" alt="" /> */}
          <ul className="profileSynergiesSkills">
              <li>
                <Typography.Text>
                  <span className="emojiIcon">
                    <img src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1674676137912_image_116.png"/>
                  </span>
                  Creativity
                </Typography.Text>
              </li>
              <li>
                <Typography.Text>
                  <span className="emojiIcon">
                    <img src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1674676160394_image_115.png"/>
                  </span>
                  Negotiation
                </Typography.Text>
              </li>
              <li>
                <Typography.Text>
                  <span className="emojiIcon">
                    <img src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1674676172933_image_114.png"/>
                  </span>
                  Communication
                </Typography.Text>
              </li>
              <li>
                <Typography.Text>
                  <span className="emojiIcon">
                    <img src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1674676172933_image_114.png"/>
                  </span>
                  Critical Thinking
                </Typography.Text>
              </li>
              <li>
                <Typography.Text>
                  <span className="emojiIcon">
                    <img src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1674676172933_image_114.png"/>
                  </span>
                  Teamwork
                </Typography.Text>
              </li>
              <li>
                <Typography.Text>
                  <span className="emojiIcon">
                    <img src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1674676172933_image_114.png"/>
                  </span>
                  Strategy
                </Typography.Text>
              </li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default TopSkill;
