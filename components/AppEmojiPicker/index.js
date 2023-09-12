import React from "react";
const AppEmojiPicker = ({ getEmojiObject }) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    ref.current.addEventListener("emoji-click", (event) => {
      const obj = {
        unified: event.detail.emoji.unicode,
        emoji: event.detail.emoji.unicode,
        names: event.detail.emoji.shortcodes,
      };
      getEmojiObject(obj);
    });
    ref.current.skinToneEmoji = "👍";
  }, []);

  return React.createElement("emoji-picker", { ref, class: "light" });
};

export default AppEmojiPicker;
