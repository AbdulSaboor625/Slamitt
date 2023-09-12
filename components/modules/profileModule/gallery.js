import { Col, Image, Row, Typography } from "antd";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ArrowViewIcon } from "../../../utility/iconsLibrary";

const Gallery = () => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 2,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <div className="profileGalleryBlock">
      <div className="profileMainBlockHead">
        <Typography.Title className="heading" level={3}>Gallery</Typography.Title>
        <Typography.Text className="mobileViewLink visibleMobile">View All <ArrowViewIcon/></Typography.Text>
      </div>
      <Carousel responsive={responsive}>
        <div className="profileGallery">
          <div className="profileGalleryWrap">
            <div className="profileGalleryImageLarge">
              <Image
                preview={false}
                width={"100%"}
                src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663784047795_imggallery01.jpg"
                alt=""
              />
            </div>
            <div className="profileGalleryThumbnails">
              <ul>
                <li>
                  <Image
                    preview={false}
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663784068824_imggallery02.jpg"
                    alt=""
                  />
                </li>
                <li>
                  <Image
                    preview={false}
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663784098536_imggallery03.jpg"
                    alt=""
                  />
                </li>
                <li>
                  <Image
                    preview={false}
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663784121502_imggallery04.jpg"
                    alt=""
                  />
                </li>
                <li>
                  <Image
                    preview={false}
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663784147513_imggallery05.jpg"
                    alt=""
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="profileGallery">
          <div className="profileGalleryWrap">
            <div className="profileGalleryImageLarge">
              <Image
                preview={false}
                width={"100%"}
                src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663784047795_imggallery01.jpg"
                alt=""
              />
            </div>
            <div className="profileGalleryThumbnails">
              <ul>
                <li>
                  <Image
                    preview={false}
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663784068824_imggallery02.jpg"
                    alt=""
                  />
                </li>
                <li>
                  <Image
                    preview={false}
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663784098536_imggallery03.jpg"
                    alt=""
                  />
                </li>
                <li>
                  <Image
                    preview={false}
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663784121502_imggallery04.jpg"
                    alt=""
                  />
                </li>
                <li>
                  <Image
                    preview={false}
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663784147513_imggallery05.jpg"
                    alt=""
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="profileGallery">
          <div className="profileGalleryWrap">
            <div className="profileGalleryImageLarge">
              <Image
                preview={false}
                width={"100%"}
                src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663784047795_imggallery01.jpg"
                alt=""
              />
            </div>
            <div className="profileGalleryThumbnails">
              <ul>
                <li>
                  <Image
                    preview={false}
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663784068824_imggallery02.jpg"
                    alt=""
                  />
                </li>
                <li>
                  <Image
                    preview={false}
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663784098536_imggallery03.jpg"
                    alt=""
                  />
                </li>
                <li>
                  <Image
                    preview={false}
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663784121502_imggallery04.jpg"
                    alt=""
                  />
                </li>
                <li>
                  <Image
                    preview={false}
                    src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1663784147513_imggallery05.jpg"
                    alt=""
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default Gallery;
