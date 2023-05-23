import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../ContextApi/chatProvider";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "./config/ChatLogics";
import { Avatar, Tooltip } from "@chakra-ui/react";
import { m } from "framer-motion";
function Scrollablechat({ message }) {
  let { user } = ChatState();
  console.log(message);
  return (
    <ScrollableFeed>
      {message &&
        message.map((c, i) => (
          <div style={{ display: "flex" }} key={c._id}>
            {(isSameSender(message, c, i, user._id) ||
              isLastMessage(message, i, user._id)) && (
              <Tooltip label={c.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={c.sender.name}
                  src={c.sender.pic}
                />
              </Tooltip>
            )}
            <span
            style={{
                backgroundColor: `${
                  c.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(message, c, i, user._id),
                marginTop: isSameUser(message, c, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}>{c.content}</span>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default Scrollablechat;
