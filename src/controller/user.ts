import { Request, Response } from "express";
import { sendJsonResponse } from "../lib/general"; // Assuming this is a utility function
import { generateToken, sendRefreshToken, validateToken } from "../lib/token";
import { validatePassword } from "../lib/validation";
import userService from "../service/user";
import { RequestWithId } from "../type/request";

class UserController {
  async register(req: Request, res: Response) {
    const { email, password, name } = req.body;

    if (!name || !email || !password) {
      return sendJsonResponse(res, {
        success: false,
        statusCode: 400,
        message: "Name, email, and password are required.",
      });
    }

    if (!validatePassword(password)) {
      return sendJsonResponse(res, {
        success: false,
        statusCode: 400,
        message:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const result = await userService.createUser({
      email,
      password,
      name,
    });

    if (result.success) {
      sendRefreshToken(res, result.data);
      sendJsonResponse(res, {
        ...result,
        data: {
          user: result.data,
          token: generateToken(result.data, "30m"),
        },
      });
    } else {
      sendJsonResponse(res, result);
    }
  }

  async login(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendJsonResponse(res, {
        success: false,
        statusCode: 400,
        message: "email and password are required.",
      });
    }
    const result = await userService.getUserByEmailAndPassword(email, password);
    if (result.success) {
      sendRefreshToken(res, result.data);
      sendJsonResponse(res, {
        ...result,
        data: {
          user: result.data,
          token: generateToken(result.data, "30m"),
        },
      });
    } else {
      sendJsonResponse(res, result);
    }
  }

  async refreshToken(req: RequestWithId, res: Response): Promise<any> {
    const refreshToken = req.cookies[process.env.REFRESH_TOKEN_NAME!];

    if (!refreshToken) {
      return sendJsonResponse(res, {
        success: false,
        statusCode: 401,
        message: "Refresh token doesn't exist",
      });
    }

    const payload: any = validateToken(refreshToken);
    if (!payload || typeof payload === "string" || !payload.data?.id) {
      return sendJsonResponse(res, {
        success: false,
        statusCode: 403,
        message: "Invalid refresh token",
      });
    }

    // Security Best Practice: Verify the user from the token still exists in the DB.
    const userCheck = await userService.getUserById(payload.data.id);
    if (!userCheck.success) {
      // Clear the invalid cookie and deny the request.
      res.clearCookie(process.env.REFRESH_TOKEN_NAME!);
      return sendJsonResponse(res, {
        success: false,
        statusCode: 403,
        message: "Account no longer exists.",
      });
    }

    // The account is valid, issue a new refresh token and a new access token.
    const newAccessToken = generateToken(userCheck.data, "30m");
    sendRefreshToken(res, userCheck.data);
    sendJsonResponse(res, {
      success: true,
      data: { token: newAccessToken },
    });
  }

  logout(_: Request, res: Response) {
    res.clearCookie(process.env.REFRESH_TOKEN_NAME!);
    sendJsonResponse(res, { success: true, data: "OK" });
  }

  async getUserProfile(req: RequestWithId, res: Response): Promise<any> {
    const result = await userService.getUserById(req.userId ?? "");
    sendJsonResponse(res, result);
  }
}

export default new UserController();
