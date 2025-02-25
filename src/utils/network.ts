import { AuthService } from "../services";
import { LoginCredentials } from "../types";

export const SIGNUP_LOGIN_SERVICE = async (
  path: string,
  credentials: LoginCredentials
) => {
  return await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
};

export const POST_SERVICE = async (path: string, body: string) => {
  return await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: AuthService.getToken(),
    },
    body,
  });
};

export const GET_SERVICE = async (path: string) => {
  return await fetch(path, {
    headers: {
      Authorization: AuthService.getToken(),
    },
  });
};

export const DELETE_SERVICE = async (path: string) => {
  return await fetch(path, {
    method: "DELETE",
    headers: {
      Authorization: AuthService.getToken(),
    },
  });
};

export const PUT_SERVICE = async (path: string, body: string) => {
  return await fetch(path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: AuthService.getToken(),
    },
    body,
  });
};
