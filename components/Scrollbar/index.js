import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import Measure from "react-measure";

export default function Scrollbar({ children, scrollRef, ...rest }) {
  const ref = useRef();

  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      ref?.current?.forceUpdate();
      scrollRef?.current?.forceUpdate();
    }, 700);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname, scrollRef?.current, ref?.current]);

  return (
    <Scrollbars {...rest} ref={scrollRef || ref}>
      <Measure
        bounds
        onResize={() => {
          ref?.current?.forceUpdate();
          scrollRef?.current?.forceUpdate();
        }}
      >
        {({ measureRef }) => (
          <div ref={measureRef} className="rc-scollbar">
            {children}
          </div>
        )}
      </Measure>
    </Scrollbars>
  );
}
