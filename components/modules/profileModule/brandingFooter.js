import { Image } from "antd";
import React from "react";

const BrandingFooter = () => {
  return (
    <div className="flex justify-center items-end bg-black profilePageFooter">
      <h5 className="text-white">Powered by</h5>
      <Image
        preview={false}
        width={200}
        height={48}
        src="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1658548446800_slamittLogo.png"
        alt="slamitt"
      />
    </div>
  );
};

export default BrandingFooter;
