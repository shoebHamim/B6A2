import { Request, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { bookingServices } from "../booking/booking.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await userServices.getAllUsers();
    if (allUsers) {
      return sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Users retrieved successfully",
        data: allUsers,
      });
    }
    return sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "No users found!",
      data: [],
    });
  } catch (error) {
    return sendResponse(res, {
      success: true,
      statusCode: 500,
      message: "Failed to retrieved users!",
      errors: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, email, phone, role } = req.body;
  try {
    const result = await userServices.updateUser(
      { name, email, phone, role },
      userId as string,
    );
    if (result) {
      return sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User updated successfully",
        data: result,
      });
    }
    return sendResponse(res, {
      success: true,
      statusCode: 404,
      message: "No user found with the id!",
      errors: [],
    });
  } catch (error) {
    return sendResponse(res, {
      success: true,
      statusCode: 500,
      message: error instanceof Error ? error.message : "Internal Server Error",
      data: [],
    });
  }
};
const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const activeBookings = await bookingServices.getActiveBookingsByUserId(
      userId as string,
    );
    if (activeBookings) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: "Failed to delete User",
        errors: "User has active booking",
      });
    }
    const result = await userServices.deleteUser(userId as string);
    if (result) {
      return sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Users deleted successfully",
      });
    }
    return sendResponse(res, {
      success: false,
      statusCode: 404,
      message: "Failed to delete User",
      errors: "No user found",
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Failed to delete User",
      errors: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const userControllers = {
  getAllUsers,
  updateUser,
  deleteUser,
};
