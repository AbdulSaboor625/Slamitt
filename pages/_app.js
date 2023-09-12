import { HMSRoomProvider } from "@100mslive/react-sdk";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleLeft,
  faBuildingColumns,
  faCircleInfo,
  faCoffee,
  faCreditCard,
  faGavel,
  faGripVertical,
  faHourglass,
  faImage,
  faIndianRupeeSign,
  faPaperPlane,
  faReply,
  faStar,
  faThumbsUp,
  faUser,
  faUsers,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { Skeleton } from "antd";
import "antd/dist/antd.css";
import Pusher from "pusher-js";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../Redux/store";
import NotifyComponent from "../components/modules/NotifyComponent";
import "../styles/globals.css";
import "../styles/home.css";
import "../styles/reward.css";
import "../styles/registrations.css";

import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { validBrowser } from "../utility/common";
import Clarity from "../analytics/clarity";
import IdentifyUserAnalytics from "../components/IdentifyUserAnalytics";
library.add(
  faCoffee,
  faIndianRupeeSign,
  faUsers,
  faBuildingColumns,
  faPaperPlane,
  faReply,
  faGripVertical,
  faImage,
  faHourglass,
  faThumbsUp,
  faGavel,
  faStar,
  faCreditCard,
  faCircleInfo,
  faWallet,
  faAngleLeft,
  faUser
);

function MyApp({ Component, pageProps }) {
  const [pusher, setPusher] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const newPusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      channelAuthorization: {
        endpoint: `${process.env.NEXT_PUBLIC_BASE_URL}/pusher/auth`,
      },
    });
    setPusher(newPusher);
  }, [setPusher]);

  const isvalidBrowser = validBrowser();

  return (
    <React.StrictMode>
      <Head>
        <title>Slamitt - Built Different</title>
        <meta
          property="og:title"
          content="Slamitt - Build, showcase, and validate your skills in talent competitions"
        />
        <meta
          property="twitter:title"
          content="Slamitt - Build, showcase, and validate your skills in talent competitions"
        />
        <meta
          name="description"
          content="Slamitt is the ultimate tool for savvy competitors and organisers."
        />
        <meta
          property="og:description"
          content="Slamitt is the ultimate tool for savvy competitors and organisers."
        />
        <meta
          property="twitter:description"
          content="Slamitt is the ultimate tool for savvy competitors and organisers."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1680691154422_og_image.jpg"
        />
        <meta
          property="twitter:image"
          content="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1680691154422_og_image.jpg"
        />

        <link
          rel="icon"
          type="image/x-icon"
          href="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673336894722_favicon16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673336894722_favicon16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673336938901_favicon32x32.png"
        />
        <link
          rel="apple-touch-icon"
          type="image/png"
          href="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673337444444_appleicon.png"
        />
        <link
          rel="apple-touch-icon"
          type="image/png"
          sizes="192x192"
          href="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673337611345_appleicon180x180.png"
        />
        <link
          rel="apple-touch-icon"
          type="image/png"
          sizes="512x512"
          href="https://rethink-competitions.s3.ap-south-1.amazonaws.com/1673337660499_msicon310x310.png"
        />
        <Clarity />
      </Head>
      <Script
        type="module"
        src="https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js"
      ></Script>

      <HMSRoomProvider>
        <Provider store={store}>
          <PersistGate loading={<Skeleton active />} persistor={persistor}>
            {/* <Spinner /> */}
            {/* {!isvalidBrowser && !router.pathname.includes("judge") && (
              <BrowserDetecttor />
            )} */}

            <NotifyComponent />
            <IdentifyUserAnalytics />
            <Component pusher={pusher} {...pageProps} />
          </PersistGate>
        </Provider>
      </HMSRoomProvider>
    </React.StrictMode>
  );
}

export default MyApp;
