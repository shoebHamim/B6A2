import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { bookingServices } from "./booking.service";
import { vehicleService } from "../vehicle/vehicle.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      req.body;
    const vehicleInfo = await vehicleService.getVehicleById(vehicle_id);
    vehicleService.validateVehicleAvailability(
      vehicleInfo?.availability_status,
    );
    const totalRent = bookingServices.calculateTotalRent(
      rent_start_date,
      rent_end_date,
      vehicleInfo.daily_rent_price,
    );
    const result = await bookingServices.createBooking(
      { customer_id, vehicle_id, rent_start_date, rent_end_date },
      totalRent,
    );
    if (result) {
      result["vehicle"] = {
        vehicle_name: vehicleInfo.vehicle_name,
        daily_rent_price: vehicleInfo.daily_rent_price,
      };
      return sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Booking created successfully",
        data: result,
      });
    } else {
      sendResponse(res, {
        success: true,
        statusCode: 500,
        message: "Booking failed",
        errors: "Internal Server Error",
      });
    }
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Booking failed",
      errors: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    let userId = null;
    if (req.user?.role === "customer") {
      userId = req.user?.id;
    }
    const result = await bookingServices.getAllBookings(userId);
    if (result)
      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Bookings retrieved successfully",
        data: result,
      });
    else {
      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "No booking found",
        data: [],
      });
    }
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Failed to retrieve booking",
      errors: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};
const updateBookingById = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { bookingId } = req.params;
    const { result, message } = await bookingServices.updateBookingById(
      bookingId as string,
      status,
    );
    if (result) {
      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: message || "Booking updated successfully",
        data: result,
      });
    } else {
      sendResponse(res, {
        success: false,
        statusCode: 400,
        message: "Update failed or no vehicle found with the provided ID",
        data: {},
      });
    }
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: error instanceof Error ? error.message : "N/A",
      data: [],
    });
  }
};
export const bookingControllers = {
  createBooking,
  getAllBookings,
  updateBookingById,
};
