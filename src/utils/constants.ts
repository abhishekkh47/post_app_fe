export const FRIENDS = { FOLLOWERS: "followers", FOLLOWING: "following" };
export const NOTIFICATION_TAB = { ALL: "All", UNREAD: "Unread" };

export const WS_EVENTS = {
  CHAT: {
    LISTENER: {
      NEW_MESSAGE: "new_message",
      MESSAGE_SENT: "message_sent",
      MESSAGE_READ: "message_read", // not used
      MESSAGE_MARKED_READ: "message_marked_read",
      USER_TYPING: "user_typing",
    },
    EMITTER: {
      TYPING: "typing",
      PRIVATE_MSG: "private_message",
      MARK_READ: "mark_read",
    },
  },
};
