import { userInterface } from "./auth.interfaces";
import { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const signIn = async (req: Request, res: Response) => {
  try {
    if (!req.body) throw new Error("Missing Payload!");
    const { email, password } = req.body;
    const result = await authService.signIn(email, password);
    if (!result) {
      sendResponse(res, {
        success: false,
        message: "Incorrect email or password",
        data: {},
        statusCode: 401,
      });
    }

    sendResponse(res, {
      success: true,
      message: "Login successful",
      data: {
        token: result.token,
        user: result.fetchedUser,
      },
      statusCode: 200,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: error instanceof Error ? error.message : "Internal Server Error",
      data: {},
    });
  }
};
const signUp = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      throw new Error("Missing Payload!");
    }
    const { password } = req.body;
    if (password?.length < 6) {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Password must be a minimum of 6 characters",
        data: {},
      });
    }
    const result = await authService.signUp(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: error instanceof Error ? error.message : "N/A",
      data: {},
    });
  }
};

export const authController = {
  signIn,
  signUp,
};
