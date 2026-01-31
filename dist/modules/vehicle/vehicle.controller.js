"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleControllers = void 0;
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const vehicle_service_1 = require("./vehicle.service");
const booking_service_1 = require("../booking/booking.service");
const getAllVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield vehicle_service_1.vehicleService.getAllVehicles();
        if (result)
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: 200,
                message: "Vehicles retrieved successfully",
                data: result,
            });
        else {
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: 200,
                message: "No vehicles found",
                data: [],
            });
        }
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 500,
            message: "Failed to retrieve vehicles",
            errors: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
});
const createVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vehicle_name, type, registration_number, daily_rent_price, availability_status, } = req.body;
        const result = yield vehicle_service_1.vehicleService.createNewVehicle({
            vehicle_name,
            type,
            registration_number,
            daily_rent_price,
            availability_status,
        });
        if (result) {
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: 201,
                message: "Vehicle created successfully",
                data: result,
            });
        }
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 500,
            message: "Vehicle creation failed!",
            errors: error instanceof Error ? error.message : "Internal Server error",
        });
    }
});
const updateVehicleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vehicle_name, type, registration_number, daily_rent_price, availability_status, } = req.body;
        const { vehicleId } = req.params;
        const result = yield vehicle_service_1.vehicleService.updateVehicleById(vehicleId, {
            vehicle_name,
            type,
            registration_number,
            daily_rent_price,
            availability_status,
        });
        if (result) {
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: 201,
                message: "Vehicle updated successfully",
                data: result,
            });
        }
        else {
            (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: 400,
                message: "Update failed or no vehicle found with the provided Id",
                errors: [],
            });
        }
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 500,
            message: "Update failed!",
            errors: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
});
const deleteVehicleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vehicleId } = req.params;
        const activeBookings = yield booking_service_1.bookingServices.getActiveBookingsByVehicleId(vehicleId);
        if (activeBookings) {
            (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: 400,
                message: "Vehicle deletion failed",
                errors: "This vehicle has active booking",
            });
        }
        const result = yield vehicle_service_1.vehicleService.deleteVehicleById(vehicleId);
        if (result) {
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: 201,
                message: "Vehicle deleted successfully",
                data: [],
            });
        }
        else {
            (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: 404,
                message: "Deletion Failed",
                errors: "No vehicle found with the provided Id",
            });
        }
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 500,
            message: "Deletion Failed",
            errors: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
});
const getVehicleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vehicleId } = req.params;
        const result = yield vehicle_service_1.vehicleService.getVehicleById(vehicleId);
        if (result)
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: 200,
                message: "Vehicle retrieved successfully",
                data: result,
            });
        else {
            (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: 404,
                message: "No vehicle found!",
                errors: [],
            });
        }
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 500,
            message: "Failed to retrieve vehicle",
            errors: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
});
exports.vehicleControllers = {
    getAllVehicles,
    createVehicle,
    getVehicleById,
    updateVehicleById,
    deleteVehicleById,
};
