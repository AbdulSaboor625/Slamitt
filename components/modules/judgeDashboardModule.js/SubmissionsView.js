import { Button } from "antd";
import React from "react";
import { LinkIcon } from "../../../utility/iconsLibrary";

const SubmissionsView = ({ submissionLinks }) => {
  return (
    <div className="websiteLinksWrapper">
      <div className="websiteLinksWrapperRow">
        {submissionLinks?.length && (
          <div className="websiteLinksScroller">
            {submissionLinks?.map((l, i) => {
              return (
                <a className="siteLink" href={l} key={i} target="iframe_a">
                  <Button className="w-40 overflow-hidden" type="primary">
                    <LinkIcon key={i} className="pr-1" />
                    {l}
                  </Button>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionsView;
