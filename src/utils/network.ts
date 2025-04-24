import axios from "axios";
import { AuthService } from "../services";
import { LoginCredentials, SignupCredentials } from "../types";

export const SIGNUP_LOGIN_SERVICE = async (
  path: string,
  credentials: LoginCredentials | SignupCredentials
) => {
  try {
    const response = await axios.post(path, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error in SIGNUP_LOGIN_SERVICE:", error);
    throw error;
  }
};

export const POST_SERVICE = async (path: string, body: FormData | string) => {
  const isFormData = body instanceof FormData;
  const config = {
    headers: {
      Authorization: AuthService.getToken(),
      ...(isFormData ? {} : { "Content-Type": "application/json" }), // Don't set Content-Type for FormData
    },
  };

  try {
    const response = await axios.post(path, body, config);
    return response;
  } catch (error) {
    console.error("Error in POST_SERVICE:", error);
    throw error;
  }
};

export const GET_SERVICE = async (path: string) => {
  const config = {
    headers: {
      Authorization: AuthService.getToken(),
    },
  };

  try {
    const response = await axios.get(path, config);
    return response;
  } catch (error) {
    console.error("Error in GET_SERVICE:", error);
    throw error;
  }
};

export const DELETE_SERVICE = async (path: string) => {
  const config = {
    headers: {
      Authorization: AuthService.getToken(),
    },
  };

  try {
    const response = await axios.delete(path, config);
    return response;
  } catch (error) {
    console.error("Error in DELETE_SERVICE:", error);
    throw error;
  }
};

export const PUT_SERVICE = async (path: string, body: FormData | string) => {
  const isFormData = body instanceof FormData;
  const config = {
    headers: {
      Authorization: AuthService.getToken(),
      ...(isFormData ? {} : { "Content-Type": "application/json" }), // Don't set Content-Type for FormData
    },
  };

  try {
    const response = await axios.put(path, body || {}, config);
    return response;
  } catch (error) {
    console.error("Error in PUT_SERVICE:", error);
    throw error;
  }
};

export const PATCH_SERVICE = async (path: string) => {
  const config = {
    headers: {
      Authorization: AuthService.getToken(),
    },
  };

  try {
    const response = await axios.patch(path, {}, config);
    return response;
  } catch (error) {
    console.error("Error in PATCH_SERVICE:", error);
    throw error;
  }
};

export const GET_STATUS_SERVICE = async (path: string) => {
  try {
    const response = await axios.get(path);
    return response.data.data;
  } catch (error) {
    console.error("Error in GET_SERVICE:", error);
    throw error;
  }
};
