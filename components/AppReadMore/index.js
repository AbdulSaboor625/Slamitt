import React, { useState } from "react";

const ReadMore = ({ children }) => {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <p style={{ display: "inline", width: "100%", marginBottom: 0 }}>
      {isReadMore ? text.slice(0, 256) : text}
      {text.length > 256 && (
        <span className="showMoreLink" onClick={toggleReadMore} style={{ cursor: "pointer" }}>
          {isReadMore ? "... read more" : " show less"}
        </span>
      )}
    </p>
  );
};

export default ReadMore;
