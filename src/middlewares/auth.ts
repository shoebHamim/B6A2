import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/sendResponse";
import config from "../config";
import { roles } from "../modules/auth/auth.interfaces";
import { userServices } from "../modules/user/user.service";

const auth = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendResponse(res, {
        success: false,
        statusCode: 401,
        message: "No authorization token provided!",
        errors: [],
      });
    }
    const token = authHeader.split(" ")[1] as string;
    try {
      const decoded: any = jwt.verify(token, config.json_secret as string);
      if (!allowedRoles.includes(decoded.role)) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "You are not authorized to access this!",
          errors: [],
        });
      }
      if (decoded.role === roles.CUSTOMER) {
        const id = req.params.id || req.params.bookingId;
        const fullRoute = req.baseUrl + req.path;
        if (
          req.method === "PUT" &&
          (fullRoute === `/api/v1/users/${id}` ||
            fullRoute === `/api/v1/bookings/${id}`)
        ) {
          if (decoded.id !== id) {
            return sendResponse(res, {
              success: false,
              statusCode: 403,
              message: "You are not allowed to update this resource!",
              errors: [],
            });
          }
        }
        req.body.role = decoded.role;
      }

      next();
    } catch (err) {
      sendResponse(res, {
        success: false,
        statusCode: 500,
        message: "Invalid token!",
        errors: [],
      });
    }
  };
};

export default auth;
