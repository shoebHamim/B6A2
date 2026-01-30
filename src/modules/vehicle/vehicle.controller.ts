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

const createNewVehicle = async (req: Request, res: Response) => {
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
      message: error instanceof Error ? error.message : "N/A",
      data: [],
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
    const { id } = req.params;
    const result = await vehicleService.updateVehicleById(id as string, {
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

const deleteVehicleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await vehicleService.deleteVehicleById(id as string);
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
        message: "Deletion failed or no vehicle found with the provided ID",
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

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await vehicleService.getVehicleById(id as string);
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

export const vehicleControllers = {
  getAllVehicles,
  createNewVehicle,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
};
