import { User } from ".";

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profile_pic?: string;
  isPrivate?: boolean;
  contact: string;
  gender: "M" | "F";
  countryCode: string;
}
