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

export const POST_SERVICE = async (path: string, body: FormData | string) => {
  const isFormData = body instanceof FormData;
  const headers: HeadersInit = {
    Authorization: AuthService.getToken(),
    ...(isFormData ? {} : { "Content-Type": "application/json" }), // Don't set Content-Type for FormData
  };
  return await fetch(path, {
    method: "POST",
    headers,
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

export const PUT_SERVICE = async (path: string, body: FormData | string) => {
  const isFormData = body instanceof FormData;
  const headers: HeadersInit = {
    Authorization: AuthService.getToken(),
    ...(isFormData ? {} : { "Content-Type": "application/json" }), // Don't set Content-Type for FormData
  };
  return await fetch(path, {
    method: "PUT",
    headers,
    body,
  });
};
