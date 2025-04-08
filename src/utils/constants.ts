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
  NOTIFICATIONS: {
    LISTENER: {
      POST_LIKED: "liked_post",
      POST_COMMENT: "comment_on_post",
      COMMENT_LIKED: "comment_liked",
      COMMENT_REPLY: "replied_to_comment",
    },
    EMITTER: {
      LIKE_A_POST: "liked_a_post",
      COMMENT_ON_POST: "commented_on_post",
      LIKE_A_COMMENT: "liked_a_comment",
      REPLY_COMMENT: "replied_to_comment",
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
export const GROUP_CHAT_USER_ROLE = { MEMBER: "member", ADMIN: "admin" };

export const CONFIRM_DELETE = { ACCOUNT: "account", POST: "post" };
export const DELETE_DIALOG = {
  ACCOUNT: `Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.`,
  POST: `Are you sure you want to delete this post?`,
};

export const COMMENT_TYPE = {
  COMMENT: "comment",
  REPLY: "reply",
};
