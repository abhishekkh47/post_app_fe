import Config from "../config";

const API_URL = Config.API_URL;
export const PATH_SLUGS = {
  USERID: "#userId",
  POSTID: "#postId",
  COMMENTID: "#commentId",
  SEARCH: "#search",
  NOTIFICATION_ID: "#notificationId",
  GROUP_ID: "#groupId",
  CHAT_ID: "#chatId",
  INVITE_TOKEN: "#inviteToken",
  PAGE: "#page",
};

export const AUTH = {
  SIGNUP: `${API_URL}/auth/v1/signup`,
  LOGIN: `${API_URL}/auth/v1/login`,
  REFRESH_TOKEN: `${API_URL}/auth/v1/refresh-token`,
};

export const CHAT = {
  GET_CONVERSATION: `${API_URL}/chat/v1/conversations`,
  GET_MESSAGE: `${API_URL}/chat/v1/messages/${PATH_SLUGS.USERID}`,
  CREATE_GROUP: `${API_URL}/chat/v1/create-chat-group`,
};
export const COMMENT = {
  CREATE_COMMENT: `${API_URL}/comment/v1/create-comment`,
  GET_POST_COMMENTS: `${API_URL}/comment/v1/get-post-comments/${PATH_SLUGS.POSTID}`,
  DELETE_COMMENT: `${API_URL}/comment/v1/delete-comment/${PATH_SLUGS.COMMENTID}`,
  LIKE_COMMENT: `${API_URL}/comment/v1/like-or-dislike-comment`,
  GET_NESTED_COMMENT: `${API_URL}/comment/v1//get-comment/${PATH_SLUGS.COMMENTID}`,
};
export const FOLLOW = {
  FOLLOW: `${API_URL}/follow/v1/follow-user`,
  UNFOLLOW: `${API_URL}/follow/v1/unfollow-user`,
  FOLLOWERS: `${API_URL}/follow/v1/followers/${PATH_SLUGS.USERID}`,
  FOLLOWING: `${API_URL}/follow/v1/following/${PATH_SLUGS.USERID}`,
  FRIENDS: `${API_URL}/follow/v1/my-friends`,
};
export const POSTS = {
  GET_FEED: `${API_URL}/post/v1/get-feed?page=${PATH_SLUGS.PAGE}`,
  CREATE_POST: `${API_URL}/post/v1/create-post`,
  DELETE_POST: `${API_URL}/post/v1/delete-post/${PATH_SLUGS.POSTID}`,
  UPDATE_POST: `${API_URL}/post/v1/edit-or-update-post`,
  LIKE_POST: `${API_URL}/post/v1/like-post`,
  DISLIKE_POST: `${API_URL}/post/v1/dislike-post`,
  GET_POST_BY_ID: `${API_URL}/post/v1/get-post/${PATH_SLUGS.POSTID}`,
};
export const USER = {
  GET_PROFILE: `${API_URL}/user/v1/get-profile/${PATH_SLUGS.USERID}`,
  SEARCH_USER: `${API_URL}/user/v1/search-user?search=${PATH_SLUGS.SEARCH}`,
  NOTIFY: `${API_URL}/user/v1/notify`,
  DELETE_ACCOUNT: `${API_URL}/user/v1/delete-user`,
  TOGGLE_PROFILE_TYPE: `${API_URL}/user/v1/toggle-profile-type`,
  GET_ALL_USERS: `${API_URL}/user/v1/get-all-users`,
  UPDATE_PROFILE_PICTURE: `${API_URL}/user/v1/update-profile-picture`,
  UPDATE_PROFILE_DETAILS: `${API_URL}/user/v1/update-my-details`,
  SEND_RESET_PASSWORD_LINK: `${API_URL}/user/v1/send-reset-link`,
  RESET_PASSWORD: `${API_URL}/user/v1/reset-password`,
};
export const NOTIFICATION = {
  GET_NOTIFICATIONS: `${API_URL}/notification/v1/get-notifications`,
  READ_NOTIFICATION: `${API_URL}/notification/v1/read-notification`,
  MARK_ALL_READ: `${API_URL}/notification/v1/mark-read-all-notifications`,
};
export const GROUP_CHAT = {
  GET_GROUPS: `${API_URL}/group/v1/`,
  CREATE_GROUP: `${API_URL}/group/v1/create-group`,
  DELETE_GROUP: `${API_URL}/group/v1/${PATH_SLUGS.GROUP_ID}`,
  GET_GROUP_BY_ID: `${API_URL}/group/v1/${PATH_SLUGS.GROUP_ID}`,
  UPDATE_GROUP: `${API_URL}/group/v1/${PATH_SLUGS.GROUP_ID}`,
  ADD_GROUP_MEMBERS: `${API_URL}/group/v1/${PATH_SLUGS.GROUP_ID}/members`,
  REMOVE_GROUP_MEMBER: `${API_URL}/group/v1/${PATH_SLUGS.GROUP_ID}/members/${PATH_SLUGS.USERID}`,
  GET_GROUP_MESSAGE: `${API_URL}/group/v1/${PATH_SLUGS.GROUP_ID}/messages`,
  GET_GROUP_DETAILS: `${API_URL}/group/v1/get-details/${PATH_SLUGS.GROUP_ID}`,
  UPDATE_USER_ROLE: `${API_URL}/group/v1/update-user-role/${PATH_SLUGS.GROUP_ID}/${PATH_SLUGS.USERID}`,
  UPDATE_PROFILE_PICTURE: `${API_URL}/group/v1/update-profile-picture/${PATH_SLUGS.GROUP_ID}`,
  JOIN_GROUP_USING_INVITE_LINK: `${API_URL}/group/v1/members/join/${PATH_SLUGS.INVITE_TOKEN}`,
  GET_GROUP_DETAILS_USING_INVITE_LINK: `${API_URL}/group/v1/get-invite-link-details/${PATH_SLUGS.INVITE_TOKEN}`,
  RESET_GROUP_INVITE_LINK: `${API_URL}/group/v1/reset-invite-link/${PATH_SLUGS.GROUP_ID}`,
};
export const CHAT_MEDIA = {
  UPLOAD_FILE: `${API_URL}/common/v1/upload-chat-multimedia/${PATH_SLUGS.CHAT_ID}`,
};
export const COMMON = {
  UPLOAD_FILE: `${API_URL}/common/v1/upload-chat-multimedia/${PATH_SLUGS.CHAT_ID}`,
  APP_STATUS: `${API_URL}/common/v1/status`,
  SUBSCRIBE_NOTIFICATIONS: `${API_URL}/common/v1/subscribe`,
};
