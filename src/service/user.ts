import * as schema from "../db/schema";
import { handleServiceError } from "../lib/error";
import {
  createUser,
  getUserByEmailAndPassword,
  getUserById,
} from "../repository/user";
import { ServiceResponse } from "../type/general";

class UserService {
  async createUser(
    userData: schema.NewUser
  ): Promise<ServiceResponse<Awaited<ReturnType<typeof createUser>>>> {
    try {
      const user = await createUser(userData);
      if (user) {
        return { success: true, data: user };
      } else {
        return {
          success: false,
          statusCode: 404,
          message: "User creation failed",
        };
      }
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async getUserByEmailAndPassword(
    email: string,
    password: string
  ): Promise<
    ServiceResponse<Awaited<ReturnType<typeof getUserByEmailAndPassword>>>
  > {
    try {
      const user = await getUserByEmailAndPassword(email, password);
      if (user) {
        return { success: true, data: user };
      } else {
        return {
          success: false,
          statusCode: 404,
          message: "User not found",
        };
      }
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async getUserById(
    userId: string
  ): Promise<ServiceResponse<Awaited<ReturnType<typeof getUserById>>>> {
    try {
      const user = await getUserById(userId);
      if (user) {
        return { success: true, data: user };
      } else {
        return {
          success: false,
          statusCode: 404,
          message: "User not found",
        };
      }
    } catch (error) {
      return handleServiceError(error);
    }
  }
}

export default new UserService();
