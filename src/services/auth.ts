import { LoginCredentials, SignupCredentials } from "../types";
import { AUTH, SIGNUP_LOGIN_SERVICE, POST_SERVICE } from "../utils";

class AuthService {
  getToken = () => {
    return `Bearer ${localStorage.getItem("token")}`;
  };
  getRefreshToken = () => {
    return `${localStorage.getItem("refreshToken")}`;
  };

  async login(credentials: LoginCredentials) {
    try {
      const response = await SIGNUP_LOGIN_SERVICE(AUTH.LOGIN, credentials);

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Login failed");
      }
      return response.data.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async signup(credentials: SignupCredentials) {
    try {
      const response = await SIGNUP_LOGIN_SERVICE(AUTH.SIGNUP, credentials);

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Signup failed");
      }
      return response.data.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async refreshToken() {
    try {
      const response = await POST_SERVICE(
        AUTH.REFRESH_TOKEN,
        JSON.stringify({ refreshToken: this.getRefreshToken() })
      );
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Session expired");
      }
      return response.data.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export default new AuthService();
