import React from "react";
import QRCode from "qrcode";
import { Image } from "antd";
export default function AppQrCode({ value, setUrl }) {
  const [qrCode, setQrCode] = React.useState(null);
  QRCode.toDataURL(value)
    .then((url) => {
      setQrCode(url);
      setUrl(url);
    })
    .catch((err) => {
      console.error(err);
    });
  return <Image src={qrCode} preview={false} />;
}
