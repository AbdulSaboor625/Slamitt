import { Button } from "antd";
import {
  EditCertificatesIcon,
  EditPencilIcon,
  RewardSettingsIcon,
  RewardsImage,
  TitleCertificate,
} from "../../../../utility/iconsLibrary";
import { useRouter } from "next/router";

const Rewards = ({ competition, placements }) => {
  const router = useRouter();
  return (
    <div className="certificatesSettings">
      <div className="visibleTabletMobile certificatesMobileHead">
        {/* <RewardSettingsIcon /> */}
        <div className="certificatesSettingsIcon">
          <RewardsImage />
        </div>
        <span className="visibleTabletMobileText">Competition Rewards</span>
      </div>
      <div className="certificatesSettingsHeader">
        <div className="certificatesSettingsHeaderTitle">
          <div className="certificatesSettingsIcon rewardImg">
            <RewardsImage />
          </div>
          <strong className="certificatesSettingsTitle">
            Competition Rewards
          </strong>
        </div>
        {competition?.status !== "CONCLUDED" ? (
          <Button
            className="buttonConfigure"
            // onClick={() => setCheckConfihure(true)}
            onClick={() =>
              router.push(
                `/auth/competitions/r/${competition?.competitionCode}`
              )
            }
          >
            Configure
          </Button>
        ) : (
          <></>
        )}
      </div>
      {console.log(competition)}
      {/* {console.log(competition?.slamCoins?.distribution?.)} */}
      <div className="certificatesSettingsContent">
        <div className="competitionRewardsRow">
          <div className="competitionRewardsRowHead">
            <div className="competitionRewardsRowLeft">
              <div className="typeTag">
                <span className="typeTagImg">
                  <img
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694102573819_image_7.png"
                    alt=""
                  />
                </span>
                <span className="text">Placements</span>
              </div>
            </div>
            <div className="competitionRewardsRowRight">
              <strong className="subtitle">
                View <u>Leaderboard</u> to see Slam coin distribution
              </strong>
              <div className="coins">
                <img
                  src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694102994426_image_526.png"
                  alt=""
                />
                <span className="text">
                  {competition?.slamCoins?.distribution?.placements}
                </span>
              </div>
            </div>
          </div>
          <div className="competitionRewardsHolder">
            {(!!placements?.places?.[0]?.prizes?.length ||
              !!placements?.places?.[0]?.trophiesAndMedals?.length) && (
              <div className="placementRewardsRow">
                <div className="competitionRewardsRowLeft">
                  <strong className="title">First Place</strong>
                </div>
                <div className="competitionRewardsRowRight">
                  <ul className="placementRewardsList">
                    {placements?.places?.[0]?.prizes?.map((prize) => (
                      <li>
                        <div className="placementRewardsItem">
                          <div className="img-wrap">
                            {typeof prize?.image === "string" ? (
                              <img
                                // src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694106218177_image_529.png"
                                src={prize?.image}
                                alt={prize?.label}
                              />
                            ) : (
                              prize?.image?.emoji
                            )}
                          </div>
                          {typeof prize?.image === "string" &&
                            prize?.image ===
                              "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1687787350764_Group_238940.png" && (
                              <span className="amount">₹ {prize?.value}</span>
                            )}
                        </div>
                      </li>
                    ))}
                    {placements?.places?.[0]?.trophiesAndMedals?.map(
                      (trophy) => (
                        <li>
                          <div className="placementRewardsItem">
                            <div className="img-wrap">
                              {typeof trophy?.image === "string" ? (
                                <img
                                  // src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694106218177_image_529.png"
                                  src={trophy?.image}
                                  alt={trophy?.label}
                                />
                              ) : (
                                trophy?.image?.emoji
                              )}
                            </div>
                            {typeof trophy?.image === "string" &&
                              trophy?.image ===
                                "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1687787350764_Group_238940.png" && (
                                <span className="amount">
                                  ₹ {trophy?.value}
                                </span>
                              )}
                          </div>
                        </li>
                      )
                    )}
                    {/* <li>
                    <div className="placementRewardsItem">
                      <div className="img-wrap">
                        <img
                          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694106218177_image_529.png"
                          alt=""
                        />
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="placementRewardsItem cash">
                      <div className="img-wrap">
                        <img
                          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694106266843_image_530.png"
                          alt=""
                        />
                      </div>
                      <span className="amount">₹ 120K</span>
                    </div>
                  </li>
                  <li>
                    <div className="placementRewardsItem">
                      <div className="img-wrap">
                        <img
                          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694106450845_Rectangle_3337.png"
                          alt=""
                        />
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="placementRewardsItem">
                      <div className="img-wrap">
                        <img
                          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694106502941_image_369.png"
                          alt=""
                        />
                      </div>
                    </div>
                  </li> */}
                  </ul>
                  <div
                    className="editLink"
                    onClick={() =>
                      router.push(
                        `/auth/competitions/r/${competition?.competitionCode}`
                      )
                    }
                  >
                    <EditPencilIcon /> <span>Edit</span>
                  </div>
                </div>
              </div>
            )}
            {(!!placements?.places?.[1]?.prizes?.length ||
              !!placements?.places?.[1]?.trophiesAndMedals?.length) && (
              <div className="placementRewardsRow">
                <div className="competitionRewardsRowLeft">
                  <strong className="title">Second Place</strong>
                </div>
                <div className="competitionRewardsRowRight">
                  <ul className="placementRewardsList">
                    {placements?.places?.[1]?.prizes?.map((prize) => (
                      <li>
                        <div className="placementRewardsItem">
                          <div className="img-wrap">
                            {typeof prize?.image === "string" ? (
                              <img
                                // src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694106218177_image_529.png"
                                src={prize?.image}
                                alt={prize?.label}
                              />
                            ) : (
                              prize?.image?.emoji
                            )}
                          </div>
                          {typeof prize?.image === "string" &&
                            prize?.image ===
                              "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1687787350764_Group_238940.png" && (
                              <span className="amount">₹ {prize?.value}</span>
                            )}
                        </div>
                      </li>
                    ))}
                    {placements?.places?.[1]?.trophiesAndMedals?.map(
                      (trophy) => (
                        <li>
                          <div className="placementRewardsItem">
                            <div className="img-wrap">
                              {typeof trophy?.image === "string" ? (
                                <img
                                  // src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694106218177_image_529.png"
                                  src={trophy?.image}
                                  alt={trophy?.label}
                                />
                              ) : (
                                trophy?.image?.emoji
                              )}
                            </div>
                            {typeof trophy?.image === "string" &&
                              trophy?.image ===
                                "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1687787350764_Group_238940.png" && (
                                <span className="amount">
                                  ₹ {trophy?.value}
                                </span>
                              )}
                          </div>
                        </li>
                      )
                    )}
                    {/* <li>
                    <div className="placementRewardsItem">
                      <div className="img-wrap">
                        <img
                          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694107672029_Rectangle_3338.png"
                          alt=""
                        />
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="placementRewardsItem cash">
                      <div className="img-wrap">
                        <img
                          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694106266843_image_530.png"
                          alt=""
                        />
                      </div>
                      <span className="amount">₹ 60K</span>
                    </div>
                  </li>
                  <li>
                    <div className="placementRewardsItem">
                      <div className="img-wrap">
                        <img
                          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694107941666_Rectangle_3338.jpg"
                          alt=""
                        />
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="placementRewardsItem">
                      <div className="img-wrap">
                        <img
                          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694106502941_image_369.png"
                          alt=""
                        />
                      </div>
                    </div>
                  </li> */}
                  </ul>
                  <div className="editLink">
                    <EditPencilIcon /> <span>Edit</span>
                  </div>
                </div>
              </div>
            )}
            {(!!placements?.places?.[2]?.prizes?.length ||
              !!placements?.places?.[2]?.trophiesAndMedals?.length) && (
              <div className="placementRewardsRow">
                <div className="competitionRewardsRowLeft">
                  <strong className="title">Third Place</strong>
                </div>
                <div className="competitionRewardsRowRight">
                  <ul className="placementRewardsList">
                    {placements?.places?.[2]?.prizes?.map((prize) => (
                      <li>
                        <div className="placementRewardsItem">
                          <div className="img-wrap">
                            {typeof prize?.image === "string" ? (
                              <img
                                // src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694106218177_image_529.png"
                                src={prize?.image}
                                alt={prize?.label}
                              />
                            ) : (
                              prize?.image?.emoji
                            )}
                          </div>
                          {typeof prize?.image === "string" &&
                            prize?.image ===
                              "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1687787350764_Group_238940.png" && (
                              <span className="amount">₹ {prize?.value}</span>
                            )}
                        </div>
                      </li>
                    ))}
                    {placements?.places?.[2]?.trophiesAndMedals?.map(
                      (trophy) => (
                        <li>
                          <div className="placementRewardsItem">
                            <div className="img-wrap">
                              {typeof trophy?.image === "string" ? (
                                <img
                                  // src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694106218177_image_529.png"
                                  src={trophy?.image}
                                  alt={trophy?.label}
                                />
                              ) : (
                                trophy?.image?.emoji
                              )}
                            </div>
                            {typeof trophy?.image === "string" &&
                              trophy?.image ===
                                "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1687787350764_Group_238940.png" && (
                                <span className="amount">
                                  ₹ {trophy?.value}
                                </span>
                              )}
                          </div>
                        </li>
                      )
                    )}
                    {/* <li>
                    <div className="placementRewardsItem">
                      <div className="img-wrap">
                        <img
                          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694108119307_image_521.png"
                          alt=""
                        />
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="placementRewardsItem cash">
                      <div className="img-wrap">
                        <img
                          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694106266843_image_530.png"
                          alt=""
                        />
                      </div>
                      <span className="amount">₹ 30K</span>
                    </div>
                  </li>
                  <li>
                    <div className="placementRewardsItem">
                      <div className="img-wrap">
                        <img
                          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694106502941_image_369.png"
                          alt=""
                        />
                      </div>
                    </div>
                  </li> */}
                  </ul>
                  <div className="editLink">
                    <EditPencilIcon /> <span>Edit</span>
                  </div>
                </div>
              </div>
            )}
            {placements?.places
              ?.filter((item) => item?.type !== "placement")
              ?.map((data) => (
                <div className="placementRewardsRow">
                  <div className="competitionRewardsRowLeft">
                    <strong className="title">Special Mention</strong>
                  </div>
                  <div className="competitionRewardsRowRight">
                    <ul className="placementRewardsList">
                      {data?.prizes?.map((prize) => (
                        <li>
                          <div className="placementRewardsItem">
                            <div className="img-wrap">
                              {typeof prize?.image === "string" ? (
                                <img
                                  // src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694106218177_image_529.png"
                                  src={prize?.image}
                                  alt={prize?.label}
                                />
                              ) : (
                                prize?.image?.emoji
                              )}
                            </div>
                            {typeof prize?.image === "string" &&
                              prize?.image ===
                                "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1687787350764_Group_238940.png" && (
                                <span className="amount">₹ {prize?.value}</span>
                              )}
                          </div>
                        </li>
                      ))}
                      {data?.trophiesAndMedals?.map((trophy) => (
                        <li>
                          <div className="placementRewardsItem">
                            <div className="img-wrap">
                              {typeof trophy?.image === "string" ? (
                                <img
                                  // src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694106218177_image_529.png"
                                  src={trophy?.image}
                                  alt={trophy?.label}
                                />
                              ) : (
                                trophy?.image?.emoji
                              )}
                            </div>
                            {typeof trophy?.image === "string" &&
                              trophy?.image ===
                                "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1687787350764_Group_238940.png" && (
                                <span className="amount">
                                  ₹ {trophy?.value}
                                </span>
                              )}
                          </div>
                        </li>
                      ))}
                      {/* <li>
                        <div className="placementRewardsItem">
                          <div className="img-wrap">
                            <img
                              src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694106502941_image_369.png"
                              alt=""
                            />
                          </div>
                        </div>
                      </li> */}
                    </ul>
                    <div className="editLink">
                      <EditPencilIcon /> <span>Edit</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="competitionRewardsRow">
          <div className="competitionRewardsRowHead">
            <div className="competitionRewardsRowLeft">
              <div className="typeTag blackTag">
                <span className="typeTagImg">
                  <img
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694103080578_image_531.png"
                    alt=""
                  />
                </span>
                <span className="text">Participants</span>
              </div>
            </div>
            <div className="competitionRewardsRowRight">
              <strong className="subtitle">
                View <u>Leaderboard</u> to see Slam coin distribution
              </strong>
              <div className="coins">
                <img
                  src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1694102994426_image_526.png"
                  alt=""
                />
                <span className="text">
                  {competition?.slamCoins?.distribution?.participants}
                </span>
              </div>
            </div>
          </div>
          <div className="placementRewardsRow">
            <div className="competitionRewardsRowLeft">
              <strong className="title">Participant</strong>
            </div>
            <div className="competitionRewardsRowRight">
              <strong className="subtitle">12 Participants</strong>
              <div
                className="editLink"
                onClick={() =>
                  router.push(
                    `/auth/competitions/r/${competition?.competitionCode}`
                  )
                }
              >
                <EditPencilIcon /> <span>Edit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
