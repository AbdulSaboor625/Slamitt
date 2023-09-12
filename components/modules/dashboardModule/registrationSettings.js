import { CheckCircleFilled } from "@ant-design/icons";
import { Divider, Image, Typography } from "antd";
import React from "react";
import { IndianRupeeSignIcon } from "../../../utility/iconsLibrary";
import { free, paid } from "../../../utility/imageConfig";

const RegistrationSettings = () => {
  return (
    <section className="regSettingsRow">
      <div className="regSettingsHeader">
        <Typography.Title level={3}>Registration Fees</Typography.Title>
      </div>
      <div className="regSettingsHolder">
        <Image src={free} alt="solo" height={50} width={500} preview={false} />
        <div className="textHolder">
          <Typography.Text className="infoText">
            Allowing participants to register for free
          </Typography.Text>
        </div>
      </div>
      <div className="regSettingsHolder">
        <div className="regPaidInformation">
          <div className="regPaidInfoLeft">
            <div className="regPaidInfoQuoteWrap">
              <Image
                src={paid}
                alt="solo"
                height={50}
                width={500}
                preview={false}
              />
              <Typography.Text className="regPaidInfoQuote">
                | <IndianRupeeSignIcon /> 100
              </Typography.Text>
            </div>
            <Typography.Text className="textPaidNote">
              <CheckCircleFilled
                style={{
                  color: "#1DDB8B",
                }}
              />{" "}
              Service fees of <IndianRupeeSignIcon /> 10 will be deducted
            </Typography.Text>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationSettings;
