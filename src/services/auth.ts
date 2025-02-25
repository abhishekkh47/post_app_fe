import { LoginCredentials, SignupCredentials } from "../types";
import { AUTH, SIGNUP_LOGIN_SERVICE, POST_SERVICE } from "../utils";

class AuthService {
  getToken = () => {
    return `Bearer ${localStorage.getItem("token")}`;
  };

  async login(credentials: LoginCredentials) {
    try {
      const response = await SIGNUP_LOGIN_SERVICE(AUTH.LOGIN, credentials);

      if (!response.ok) {
        throw new Error("Login failed");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async signup(credentials: SignupCredentials) {
    try {
      const response = await SIGNUP_LOGIN_SERVICE(AUTH.SIGNUP, credentials);

      if (!response.ok) {
        throw new Error("Signup failed");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async refreshToken() {
    try {
      const response = await POST_SERVICE(AUTH.REFRESH_TOKEN, this.getToken());
      if (!response.ok) {
        throw new Error("Session expired");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export default new AuthService();
