import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/sendResponse";
import config from "../config";
import { roles } from "../modules/auth/auth.interfaces";
import { userServices } from "../modules/user/user.service";

const auth = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      return sendResponse(res, {
        success: false,
        statusCode: 401,
        message: "No authorization token provided!",
        data: [],
      });
    }
    try {
      const decoded: any = jwt.verify(token, config.json_secret as string);
      if (!allowedRoles.includes(decoded.role)) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "You are not authorized to access this!",
          data: [],
        });
      }
      if(decoded.role===roles.CUSTOMER){
        const {id}=req.params;
        if(decoded.id!==id){
           return sendResponse(res,{
            success:false,
            statusCode:403,
            message:'You are not allowed to update this resource!',
            data:[]
          })
        }
        req.body.role=decoded.role;
      }

      next();
    } catch (err) {
      sendResponse(res, {
        success: false,
        statusCode: 500,
        message: "Invalid token!",
        data: [],
      });
    }
  };
};

export default auth;
