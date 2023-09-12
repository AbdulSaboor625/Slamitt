import { Button, Typography } from "antd";
import pack from "box-circle-packer";
import React from "react";
import { EditPencilIcon, PlusCircleIcon } from "../../../../utility/iconsLibrary";
import EmptyProfileSection from "../emptyProfileSection";
import { routes } from "../../../../utility/config";
import { useRouter } from "next/router";

const MyInterests = ({ editable, interests = [], isUserLoggedIn }) => {
  const router = useRouter();
  const isEmpty = !interests.length;
  const width = 385;
  const height = 300;
  const circles = 8;
  const min_r = 30;
  const max_r = 65;
  const radiuses = [];
  for (let i = 0; i !== circles; i++)
    radiuses.push(Math.random() * (max_r - min_r) + min_r);
  const list = pack(radiuses, width, height);

  const redirectToInterest = () => {
    router.push(routes.addInterest);
  };

  return isUserLoggedIn ? (
    <div className="profileInterestsBox hiddenMobile">
      <div className="profileSidebarHead">
        {!isEmpty && (
          <Typography.Title className="heading" level={3}>
            My Interests
          </Typography.Title>
        )}
        {!interests.length ? !isEmpty && (
          <Button
            icon={<PlusCircleIcon className="iconAdd" />}
            type="text"
            onClick={redirectToInterest}
          />
        )
        :
        (
          <Button
            icon={<EditPencilIcon />}
            type="text"
            onClick={redirectToInterest}
          />
        )
        }
      </div>
      {editable && (
        <Typography.Text className="profileInterestsText">
          Right click on any circle and select delete to remove existing
          interests
        </Typography.Text>
      )}
      {!isEmpty ? (
        <ul className="profileSynergiesSkills interestsItemsList">
          {interests.map((item) => (
            <li key={JSON.stringify(item)}>
              <Typography.Text>
                <span className="emojiIcon">
                  <img src={item?.imageUrl} />
                </span>
                {item?.subCategoryName}
              </Typography.Text>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyProfileSection
          section={"MYSKILLS"}
          redirectToInterest={redirectToInterest}
        />
      )}

      {/* <div className="profileInterestsPlaceholder">
        <img
          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1674675831410_Group_3620.png"
          alt=""
        />
      </div> */}
    </div>
  ) : (
    !isEmpty && (
      <div className="profileInterestsBox hiddenMobile">
        <div className="profileSidebarHead">
          <Typography.Title className="heading" level={3}>
            My Interests
          </Typography.Title>
        </div>

        <ul className="profileSynergiesSkills">
          {interests.map((item) => (
            <li key={JSON.stringify(item)}>
              <Typography.Text>
                <span className="emojiIcon">
                  <img src={item?.imageUrl} />
                </span>
                {item?.subCategoryName}
              </Typography.Text>
            </li>
          ))}
        </ul>
      </div>
    )
  );
};

const InterestCircles = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "260px",
        position: "relative",
        display: "none",
        // border: "solid 1px silver",
      }}
    >
      {list.map((item, i) => (
        <div
          className="profileInterestsCircle"
          key={`${i}`}
          style={{
            width: `${item.r * 1.9}px`,
            height: `${item.r * 1.9}px`,
            left: item.x,
            top: item.y,
            position: "absolute",
            background: "silver",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* {JSON.stringify(item)} */}
          <Typography.Text>Sales</Typography.Text>
        </div>
      ))}
    </div>
  );
};
export default MyInterests;
