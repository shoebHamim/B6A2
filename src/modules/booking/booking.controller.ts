import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { bookingServices } from "./booking.service";
import { vehicleService } from "../vehicle/vehicle.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      req.body;
    // fetch the vehicle
    const vehicleInfo = await vehicleService.getVehicleById(vehicle_id);
    if (!vehicleInfo) {
      return sendResponse(res, {
        success: false,
        statusCode: 404,
        message: "No Vehicle found to book!",
        data: [],
      });
    }
    if (vehicleInfo.availability_status !== "available") {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: "Vehicle is unavailable!",
        data: [],
      });
    }
    const dailyRent = vehicleInfo.daily_rent_price;

    const result = await bookingServices.createBooking(
      { customer_id, vehicle_id, rent_start_date, rent_end_date },
      dailyRent,
    );
    result["vehicle"] = {
      vehicle_name: vehicleInfo.vehicle_name,
      daily_rent_price: vehicleInfo.daily_rent_price,
    };
    if (result)
      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Booking created successfully",
        data: result,
      });
    else {
      sendResponse(res, {
        success: true,
        statusCode: 404,
        message: "No vehicle found",
        data: [],
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

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.getAllBookings();
    if (result)
      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Data fetched successfully",
        data: result,
      });
    else {
      sendResponse(res, {
        success: true,
        statusCode: 404,
        message: "No vehicle found",
        data: [],
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
const updateBookingById = async (req: Request, res: Response) => {
  try {
    const {
      status
    } = req.body;
    const { bookingId } = req.params;
    const result = await bookingServices.updateBookingById(bookingId as string, status );
    if (result) {
      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Booking updated successfully",
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
