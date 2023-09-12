import { Image, Typography } from "antd";
import { Footer } from "antd/lib/layout/layout";
import React from "react";
import { routeGenerator, suportedBrowsers } from "../../utility/config";

const BrowserDetecttor = () => {
  return (
    <div className="absolute h-screen w-screen bg-white z-50 flex items-center justify-center browserDetectScreen">
      <div className="flex flex-col items-center justify-center browserDetectScreenContainer">
        <div className="flex items-center justify-center browserDetectScreenLogo">
          <Image
            preview={false}
            alt="error-Slamitt"
            // src="https://rethink-competitions.s3.amazonaws.com/1666950535499_errorSlamitt.png"
            src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1666964982622_icoslamitt.png"
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <Typography.Text className="browserDetectScreenTitle">
            You can only experience Slamitt on one of these browsers
          </Typography.Text>
          <Typography.Text className="browserDetectScreenText">
            Copy and paste this link to access scoring on your choice of browser
          </Typography.Text>
        </div>
        <div className="browserDetectScreenContent">
          <Typography.Text className="browserDetectScreenCopy">
            <Typography.Text
              copyable={{
                tooltips: false,
              }}
            >
              {routeGenerator("", "", true)}
            </Typography.Text>
          </Typography.Text>
          <div className="browserDetectScreenBrowsers">
            {suportedBrowsers?.map((browser) => {
              return (
                <div className="browserDetectScreenBrowserBox" key={browser.name}>
                  <div className="">
                    <Image
                      preview={false}
                      alt="Browser-Photo"
                      src={browser.img}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer className="browserDetectScreenFooter">
        <Image
          preview={false}
          alt="Footer-Image"
          src={
            "https://rethink-competitions.s3.ap-south-1.amazonaws.com/1666955807827_slamitt.png"
          }
        />
      </Footer>
    </div>
  );
};

export default BrowserDetecttor;
