import { useEffect, useRef } from "react";
import { store } from "../../Redux/store";
import SegmentHandler from "../../analytics/segment";
import { useDispatch } from "react-redux";
import { initializeAnalytics } from "../../Redux/Actions/miscActions";
import { AnalyticsBrowser } from "@segment/analytics-next";

const IdentifyUserAnalytics = () => {
  const userIdentified = useRef(false);
  const dispatch = useDispatch();
  const { auth, judge } = store.getState();
  useEffect(() => {
    if (auth.user || judge) {
      const segment = AnalyticsBrowser.load({
        writeKey: process.env.NEXT_PUBLIC_SEGMENT_KEY,
      });
      const analytics = new SegmentHandler(segment);
      analytics.setUserActive();
      userIdentified.current = true;
      dispatch(initializeAnalytics(segment));
    }
  }, [auth.user, judge]);

  return <></>;
};

export default IdentifyUserAnalytics;
