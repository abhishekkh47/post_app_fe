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
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to fetch profile");
      }
      return response.data.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getAllUsers() {
    try {
      const response = await GET_SERVICE(USER.GET_ALL_USERS);
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to load users");
      }
      return response.data.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async searchUserProfile(search: string) {
    try {
      const response = await GET_SERVICE(
        USER.SEARCH_USER.replace(PATH_SLUGS.SEARCH, search)
      );
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to load profile");
      }
      return response.data.data;
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
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to update");
      }
      return response.data.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async deleteAccount() {
    try {
      const response = await DELETE_SERVICE(USER.DELETE_ACCOUNT);
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Cannot complete action at the moment");
      }
      return response.data.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async updateProfilePicture(file: File) {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);
      const response = await PUT_SERVICE(USER.UPDATE_PROFILE_PICTURE, formData);
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Cannot complete action at the moment");
      }
      return response.data.data;
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
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Cannot complete action at the moment");
      }
      return response.data.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
export default new UserService();
