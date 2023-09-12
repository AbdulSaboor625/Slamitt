import { List, Skeleton, Typography } from "antd";
import { icon, replyIcon } from "../../../../utility/imageConfig";
import { ArrowDownSmallSVGIcon } from "/utility/iconsLibrary";

const ChatBox = ({ value, by, role }) => {
  return (
    <List.Item className="chatMessagesItem">
      <div className="chatUserAvatar">
        <img src="https://joeschmoe.io/api/v1/random" alt="img description" />
      </div>
      <div className="chatMessagesBox">
        <div className="chatMessageHead">
          <strong className="userName">
            {`${by} - ${role}`}{" "}
            <span className="chatMessageRecent">Lasted for 19 min</span>
          </strong>
          <div className="chatMessageHeadRight">
            <div className="datetime">
              <span className="date">12/07/21</span>
              <span className="time">3:07 PM</span>
            </div>
            <ul className="chatMessageUsersList">
              <li>
                <img src={icon} alt="" />
              </li>
              <li>
                <img src={icon} alt="" />
              </li>
              <li>
                <img src={icon} alt="" />
              </li>
              <li className="lastItem">
                <img src={icon} alt="" />
                <span className="chatMessageUsersCounter">4+</span>
              </li>
            </ul>
          </div>
        </div>
        <Skeleton title={false} loading={false} active>
          <List.Item.Meta title={<Typography.Text>{value}</Typography.Text>} />
        </Skeleton>
        <div className="chatMessageReply">
          <span className="chatMessageReplyLink">
            <ArrowDownSmallSVGIcon />3 Replies from x, y, z
          </span>
        </div>
        <div className="chatMessageFoot">
          <span className="replyButton">
            <img src={replyIcon} alt="img" /> Reply
          </span>
        </div>
      </div>
    </List.Item>
  );
};

export default ChatBox;
