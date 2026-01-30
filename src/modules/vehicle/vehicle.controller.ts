import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { vehicleService } from "./vehicle.service";

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getAllVehicles();
    if (result)
      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Vehicles retrieved successfully",
        data: result,
      });
    else {
      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "No vehicles found",
        data: [],
      });
    }
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Failed to retrieve vehicles",
      errors: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

const createVehicle = async (req: Request, res: Response) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;
    const result = await vehicleService.createNewVehicle({
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    });
    if (result) {
      sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Vehicle created successfully",
        data: result,
      });
    }
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Vehicle creation failed!",
      errors: error instanceof Error ? error.message : "Internal Server error",
    });
  }
};

const updateVehicleById = async (req: Request, res: Response) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;
    const { vehicleId } = req.params;
    const result = await vehicleService.updateVehicleById(vehicleId as string, {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    });
    if (result) {
      sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Vehicle updated successfully",
        data: result,
      });
    } else {
      sendResponse(res, {
        success: false,
        statusCode: 400,
        message: "Update failed or no vehicle found with the provided Id",
        errors: [],
      });
    }
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Update failed!",
      errors: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

const deleteVehicleById = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const result = await vehicleService.deleteVehicleById(vehicleId as string);
    if (result) {
      sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Vehicle deleted successfully",
        data: [],
      });
    } else {
      sendResponse(res, {
        success: false,
        statusCode: 400,
        message: "Deletion Failed",
        errors: "No vehicle found with the provided ID",
      });
    }
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Deletion Failed",
      errors: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const result = await vehicleService.getVehicleById(vehicleId as string);
    if (result)
      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Vehicle retrieved successfully",
        data: result,
      });
    else {
      sendResponse(res, {
        success: false,
        statusCode: 404,
        message: "No vehicle found!",
        errors: [],
      });
    }
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Failed to retrieve vehicle",
      errors: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const vehicleControllers = {
  getAllVehicles,
  createVehicle,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
};
