import {
  DELETE_SERVICE,
  GET_SERVICE,
  PATH_SLUGS,
  PUT_SERVICE,
  USER,
} from "../utils";

class UserService {
  async fetchUserProfile(userId: string) {
    try {
      const response = await GET_SERVICE(
        USER.GET_PROFILE.replace(PATH_SLUGS.USERID, userId)
      );
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getAllUsers() {
    try {
      const response = await GET_SERVICE(USER.GET_ALL_USERS);
      if (!response.ok) {
        throw new Error("Failed to load users");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async searchUserProfile(search: string) {
    try {
      const response = await GET_SERVICE(
        USER.SEARCH_USER.replace(PATH_SLUGS.SEARCH, search)
      );
      if (!response.ok) {
        throw new Error("Failed to load profile");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async toggleProfileType(status: boolean) {
    try {
      const response = await PUT_SERVICE(
        USER.TOGGLE_PROFILE_TYPE,
        JSON.stringify({ status })
      );
      if (!response.ok) {
        throw new Error("Failed to update");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async deleteAccount() {
    try {
      const response = await DELETE_SERVICE(USER.DELETE_ACCOUNT);
      if (!response.ok) {
        throw new Error("Cannot complete action at the moment");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async updateProfilePicture(file: File) {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);
      const response = await PUT_SERVICE(USER.UPDATE_PROFILE_PICTURE, formData);
      if (!response.ok) {
        throw new Error("Cannot complete action at the moment");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async updateProfileDetails(firstName: string, lastName: string, bio: string) {
    try {
      const response = await PUT_SERVICE(
        USER.UPDATE_PROFILE_DETAILS,
        JSON.stringify({ firstName, lastName, bio })
      );
      if (!response.ok) {
        throw new Error("Cannot complete action at the moment");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
export default new UserService();
