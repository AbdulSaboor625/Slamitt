import {
  EyeFilled,
  EyeInvisibleFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Collapse, Image, Row, Typography } from "antd";
import React, { useState } from "react";
import {
  ArrowViewIcon,
  EyeHideIcon,
  EyeIcon,
  LikeSVGIcon,
  SearchThickIcon,
} from "../../../utility/iconsLibrary";
import AppModal from "../../AppModal";
import EmptyProfileSection from "./emptyProfileSection";

const Card = ({ editable }) => {
  return (
    <div className="profileSynergiesBox">
      <ul className="profileSynergiesImagesList">
        {editable && (
          <li>
            <span className="profileSynergiesViewButton">
              <EyeIcon className="iconShow" />
              <EyeHideIcon className="iconHide" />
            </span>
          </li>
        )}
        <li>
          <Avatar src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663787017499_avatarimage01.png" />
        </li>
        <li>
          <Avatar src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663787038472_avatarimage02.png" />
        </li>
      </ul>
      <div className="profileSynergiesTextbox">
        <strong className="subtitle">Arihant Jain &amp; Shraman Siyal</strong>
        <span className="subtext">synergise well in these skills</span>
      </div>
      <ul className="profileSynergiesSkills">
        {[1, 2, 3, 4].map((s, i) => (
          <li key={i}>
            <Typography.Text>
              Collaboration <LikeSVGIcon />{" "}
            </Typography.Text>
          </li>
        ))}
      </ul>
      <div className="profileSynergiesPositionHolder">
        <strong className="title">As seen during these team competitions</strong>
        <ul>
          <li>
            <div className="profileSynergiesPositionBox">
              <Image
                preview={false}
                src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663778372680_Group_1876.png"
                alt=""
              />
              <div className="textbox">
                <Typography.Title level={5}>
                  <span className="subtitle">
                    Esprit
                  </span>
                  <span className="position">
                    <img src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1659038846845_crowngold.png" alt=""/>
                    <span className="text">WINNER</span>
                  </span>
                  </Typography.Title>
                <Typography.Text className="date">12 Oct, 2022</Typography.Text>
              </div>
            </div>
          </li>
          <li>
            <div className="profileSynergiesPositionBox">
              <Image
                preview={false}
                src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663788212930_crownsilver.png"
                alt=""
              />
              <div className="textbox">
                <Typography.Title level={5}>Samanvaya</Typography.Title>
                <Typography.Text className="date">12 Jun, 2022</Typography.Text>
              </div>
            </div>
          </li>
          <li>
            <div className="profileSynergiesPositionBox">
              <Image
                preview={false}
                src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663777406276_Ellipse_47.png"
                alt=""
              />
              <div className="textbox">
                <Typography.Title level={5}>
                  <span className="subtitle">Envision</span>
                  <span className="position second">
                    <img src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663788212930_crownsilver.png" alt=""/>
                    <span className="text">2nd Place</span>
                  </span>
                  </Typography.Title>
                <Typography.Text className="date">12 Jun, 2022</Typography.Text>
              </div>
            </div>
          </li>
          <li>
            <div className="profileSynergiesPositionBox">
              <Image
                preview={false}
                src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663788212930_crownsilver.png"
                alt=""
              />
              <div className="textbox">
                <Typography.Title level={5}>Precipice</Typography.Title>
                <Typography.Text className="date">12 Jun, 2022</Typography.Text>
              </div>
            </div>
          </li>
        </ul>
        <a className="linkMoreCompetitions" href="#">+4 more Competitions</a>
      </div>
    </div>
  );
};

const PrimarySynergies = () => {
  return (
    <div className="profileSynergiesBlock">
      {[1, 2, 3, 4].map((card, i) => (
        <div className="profileSynergiesColumn" key={i}>
          <Card />
        </div>
      ))}
    </div>
  );
};
const MoreSynergies = () => {
  return (
    <div className="profileSynergiesBlock">
      {[1, 2, 3, 4].map((card, i) => (
        <div className="profileSynergiesColumn" key={i}>
          <Card />
        </div>
      ))}
    </div>
  );
};

const Synergies = ({ editable }) => {
  const [visible, setVisible] = useState(false);
  const synergies = [1, 2, 3];

  const SynergiesModal = () => {
    const { Panel } = Collapse;
    const genExtra = () => (
      <ul className="profileCompetitionsViews">
        <li className="active">
          <EyeIcon />
          <Typography.Text className="viewCount">12</Typography.Text>
        </li>
        <li>
          <EyeHideIcon />
          <Typography.Text className="viewCount">06</Typography.Text>
        </li>
        <li>
          <SearchThickIcon className="searchIcon" />
        </li>
      </ul>
    );
    return (
      <AppModal className="moreProfileModal" isVisible={visible} onCancel={() => setVisible(false)}>
        <div className="moreProfileModalContent">
          <Typography.Text className="heading">
            Synergies
          </Typography.Text>
          <Collapse defaultActiveKey={1}>
            <Panel header="Primary" key={1}>
              <PrimarySynergies />
            </Panel>
            <Panel header="More" key={2} extra={genExtra()}>
              <MoreSynergies />
            </Panel>
          </Collapse>
          <div className="text-center">
            <Button className="buttonCancle" onClick={() => setVisible(false)}>Cancel</Button>
          </div>
        </div>
      </AppModal>
    );
  };
  return (
    <div className="mt-6">
      <div className="profileSidebarHead">
        <Typography.Title className="heading" level={3}>
          Synergy (2)
        </Typography.Title>
        {editable && (
          <ul className="profileCompetitionsViews">
            <li>
              <EyeIcon />
              <Typography.Text className="viewCount">12</Typography.Text>
            </li>
            <li>
              <EyeHideIcon />
              <Typography.Text className="viewCount">06</Typography.Text>
            </li>
          </ul>
        )}
        <Typography.Text
          className="mobileViewLink visibleMobile"
          onClick={() => setVisible(true)}
        >
          View All <ArrowViewIcon />
        </Typography.Text>
      </div>
      <div className="profileStatsHolder blurState">
        {/* Hidden Profile item state */}
        <div className="profileStatsPlaceholderText hiddenMobile">
          Finish setting up your account to access synergy with your team mates
        </div>
        <div className="profileStatsPlaceholderText visibleMobile">
          Complete adding Account Info to preview your profile
        </div>
        {/* Synergy Empty State */}
        <div className="profileEmptyStateBox">
          <Image
            preview={false}
            alt=""
            src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1675102471841_image_281.png"
          />
          <Typography.Text className="profileEmptyStateBoxText">Participate as a team and collect<br/> endorsements to build synergies</Typography.Text>
        </div>
        {synergies && synergies.length ? (
          <div className="profileSynergiesBlock">
            {/* {synergies.map((s, i) => (
              <div className="profileSynergiesColumn" key={i}>
                <Card editable={editable} />
              </div>
            ))} */}
            <div className="profileSynergiesColumn">
              <div className="profileSynergiesBox">
                <ul className="profileSynergiesImagesList">
                  {editable && (
                    <li>
                      <span className="profileSynergiesViewButton">
                        <EyeIcon className="iconShow" />
                        <EyeHideIcon className="iconHide" />
                      </span>
                    </li>
                  )}
                  <li>
                    <Avatar src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663787017499_avatarimage01.png" />
                  </li>
                  <li>
                    <Avatar src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663787038472_avatarimage02.png" />
                  </li>
                </ul>
                <div className="profileSynergiesTextbox">
                  <strong className="subtitle">Arihant Jain &amp; Shraman Siyal</strong>
                  <span className="subtext">synergise well in these skills</span>
                </div>
                <ul className="profileSynergiesSkills">
                  {/* {[1, 2, 3, 4].map((s, i) => (
                    <li key={i}>
                      <Typography.Text>
                        Collaboration <LikeSVGIcon />{" "}
                      </Typography.Text>
                    </li>
                  ))} */}
                  <li>
                    <Typography.Text>
                      Collaboration <LikeSVGIcon />{" "}
                    </Typography.Text>
                  </li>
                  <li>
                    <Typography.Text>
                      Communication <LikeSVGIcon />{" "}
                    </Typography.Text>
                  </li>
                  <li>
                    <Typography.Text>
                      Team management <LikeSVGIcon />{" "}
                    </Typography.Text>
                  </li>
                  <li>
                    <Typography.Text>
                      Technical Jargon <LikeSVGIcon />{" "}
                    </Typography.Text>
                  </li>
                </ul>
                <div className="profileSynergiesPositionHolder">
                  <strong className="title">As seen during these team competitions</strong>
                  <ul>
                    <li>
                      <div className="profileSynergiesPositionBox">
                        <Image
                          preview={false}
                          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663778372680_Group_1876.png"
                          alt=""
                        />
                        <div className="textbox">
                          <Typography.Title level={5}>
                            <span className="subtitle">
                              Esprit
                            </span>
                            <span className="position">
                              <img src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1659038846845_crowngold.png" alt=""/>
                              <span className="text">WINNER</span>
                            </span>
                            </Typography.Title>
                          <Typography.Text className="date">12 Oct, 2022</Typography.Text>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="profileSynergiesPositionBox">
                        <Image
                          preview={false}
                          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663779251476_Ellipse_46.png"
                          alt=""
                        />
                        <div className="textbox">
                          <Typography.Title level={5}>
                            <span className="subtitle">Samanvaya</span>
                            <span className="position special">
                              <img src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1675274295356_special.png" alt=""/>
                              <span className="text">Special Mention</span>
                            </span>
                            </Typography.Title>
                          <Typography.Text className="date">12 Jun, 2022</Typography.Text>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="profileSynergiesPositionBox">
                        <Image
                          preview={false}
                          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663777406276_Ellipse_47.png"
                          alt=""
                        />
                        <div className="textbox">
                          <Typography.Title level={5}>
                            <span className="subtitle">Envision</span>
                            <span className="position second">
                              <img src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663788212930_crownsilver.png" alt=""/>
                              <span className="text">2nd Place</span>
                            </span>
                            </Typography.Title>
                          <Typography.Text className="date">12 Jun, 2022</Typography.Text>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="profileSynergiesPositionBox">
                        <Image
                          preview={false}
                          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663779251476_Ellipse_46.png"
                          alt=""
                        />
                        <div className="textbox">
                          <Typography.Title level={5}>
                            <span className="subtitle">Precipice</span>
                            <span className="position third">
                              <img src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1675274115449_bronze.png" alt=""/>
                              <span className="text">3rd Place</span>
                            </span>
                            </Typography.Title>
                          <Typography.Text className="date">12 Jun, 2022</Typography.Text>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <a className="linkMoreCompetitions" href="#">+4 more Competitions</a>
                </div>
              </div>
            </div>
            <div className="profileSynergiesColumn">
              <div className="profileSynergiesBox">
                <ul className="profileSynergiesImagesList">
                  {editable && (
                    <li>
                      <span className="profileSynergiesViewButton">
                        <EyeIcon className="iconShow" />
                        <EyeHideIcon className="iconHide" />
                      </span>
                    </li>
                  )}
                  <li>
                    <Avatar src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663787017499_avatarimage01.png" />
                  </li>
                  <li>
                    <Avatar src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663791946376_avatarimage03.png" />
                  </li>
                  <li>
                    <Avatar src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663791976555_avatarimage04.png" />
                  </li>
                </ul>
                <div className="profileSynergiesTextbox">
                  <strong className="subtitle">Arihant Jain, Rishi Sandil &amp; Jaynesh Kaasliwaal</strong>
                  <span className="subtext">synergise well in these skills</span>
                </div>
                <ul className="profileSynergiesSkills">
                  {/* {[1, 2, 3, 4].map((s, i) => (
                    <li key={i}>
                      <Typography.Text>
                        Collaboration <LikeSVGIcon />{" "}
                      </Typography.Text>
                    </li>
                  ))} */}
                  <li>
                    <Typography.Text>
                      Corporate Affairs &amp; Intelligence <LikeSVGIcon />{" "}
                    </Typography.Text>
                  </li>
                  <li>
                    <Typography.Text>
                      PR <LikeSVGIcon />{" "}
                    </Typography.Text>
                  </li>
                </ul>
                <div className="profileSynergiesPositionHolder">
                  <strong className="title">As seen during these team competitions</strong>
                  <ul>
                    <li>
                      <div className="profileSynergiesPositionBox">
                        <Image
                          preview={false}
                          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663778372680_Group_1876.png"
                          alt=""
                        />
                        <div className="textbox">
                          <Typography.Title level={5}>
                            <span className="subtitle">Cresentia</span>
                            <span className="position">
                              <img src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1659038846845_crowngold.png" alt=""/>
                              <span className="text">WINNER</span>
                            </span>
                            </Typography.Title>
                          <Typography.Text className="date">19 Sept, 2022</Typography.Text>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="profileSynergiesPositionBox">
                        <Image
                          preview={false}
                          src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663777406276_Ellipse_47.png"
                          alt=""
                        />
                        <div className="textbox">
                          <Typography.Title level={5}><span className="subtitle">Esprit</span></Typography.Title>
                          <Typography.Text className="date">12 Oct, 2022</Typography.Text>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="profileMainBlockLinkWrap" style={{display: 'none'}}>
              <Typography.Text underline={true} onClick={() => setVisible(true)}>
                View All
              </Typography.Text>
            </div>
          </div>
        ) : (
          <EmptyProfileSection section={"SYNERGIES"} />
        )}
      </div>
      <SynergiesModal />
    </div>
  );
};

export default Synergies;
