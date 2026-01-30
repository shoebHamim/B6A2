import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/sendResponse";
import config from "../config";
import { roles } from "../modules/auth/auth.interfaces";
import { bookingServices } from "../modules/booking/booking.service";

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
        const baseUrl = req.baseUrl;
        console.log(baseUrl);
        // user specific user details update check
        if (req.method === "PUT" && baseUrl === "/api/v1/users") {
          const { userId } = req.params;
          if (decoded.id !== userId) {
            return sendResponse(res, {
              success: false,
              statusCode: 403,
              message: "User update failed",
              errors: "You are not allowed to update this resource!",
            });
          }
          req.body.role = decoded.role;
        } // user specific booking status update check
        else if (req.method === "PUT" && baseUrl === "/api/v1/bookings") {
          const { bookingId } = req.params;
          const fetchedBooking = await bookingServices.getBookingById(
            bookingId as string,
          );
          console.log("fetched bookings", fetchedBooking);
          console.log({ decoded });
          if (!fetchedBooking) {
            return sendResponse(res, {
              success: false,
              statusCode: 404,
              message: "Failed to update booking",
              errors: "Booking doesn't exist",
            });
          }
          if (fetchedBooking.customer_id.toString() !== decoded.id) {
            return sendResponse(res, {
              success: false,
              statusCode: 403,
              message: "Booking update failed",
              errors: "You are not allowed to update this resource!",
            });
          }
        }
      }

      req.user = decoded as JwtPayload;
      next();
    } catch (err) {
      sendResponse(res, {
        success: false,
        statusCode: 500,
        message: "Invalid token!",
        errors: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  };
};

export default auth;
