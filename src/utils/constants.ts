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
      MARK_READ: "mark_read",
      TYPING: "typing",
    },
    EMITTER: {
      TYPING: "typing",
      PRIVATE_MSG: "private_message",
      MARK_READ: "mark_read",
      MESSAGE_SENT: "message_sent",
      USER_TYPING: "user_typing",
      MESSAGE_MARKED_READ: "message_marked_read",
    },
  },
  GROUP: {
    LISTENER: {
      GROUP_NEW_MESSAGE: "group_new_message",
      GROUP_JOINED: "group_joined",
      GROUP_LEFT: "group_left",
      GROUP_USER_TYPING: "group_user_typing",
      GROUP_MESSAGE_SENT: "group_message_sent",
      GROUP_MESSAGE_MARKED_READ: "group_message_marked_read",
    },
    EMITTER: {
      JOIN_GROUP: "join_group",
      LEAVE_GROUP: "leave_group",
      GROUP_MSG: "group_message",
      GROUP_MARK_READ: "group_mark_read",
      GROUP_TYPING: "group_typing",
    },
  },
};
export const CHAT_TYPE = {
  INDIVIDUAL: "individual",
  GROUP: "group",
};
export const CHAT_GROUP_DIALOG = {
  DELETE_CHAT: "DELETE_CHAT",
  LEAVE_GROUP: "LEAVE_GROUP",
  DELETE_CHAT_DESC: `The people who messaged you can still see the conversation and can message you again unles you block them`,
  LEAVE_GROUP_DESC: `When you leave, you will no longer be able to see the chat history. You won't be able to send or receive messanes unless someone add you back to the group. No one will be notified that you left the group.`,
};
