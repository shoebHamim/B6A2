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
exports.bookingControllers = void 0;
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const booking_service_1 = require("./booking.service");
const vehicle_service_1 = require("../vehicle/vehicle.service");
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;
        const vehicleInfo = yield vehicle_service_1.vehicleService.getVehicleById(vehicle_id);
        vehicle_service_1.vehicleService.validateVehicleAvailability(vehicleInfo === null || vehicleInfo === void 0 ? void 0 : vehicleInfo.availability_status);
        const totalRent = booking_service_1.bookingServices.calculateTotalRent(rent_start_date, rent_end_date, vehicleInfo.daily_rent_price);
        const result = yield booking_service_1.bookingServices.createBooking({ customer_id, vehicle_id, rent_start_date, rent_end_date }, totalRent);
        if (result) {
            result["vehicle"] = {
                vehicle_name: vehicleInfo.vehicle_name,
                daily_rent_price: vehicleInfo.daily_rent_price,
            };
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: 201,
                message: "Booking created successfully",
                data: result,
            });
        }
        else {
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: 500,
                message: "Booking failed",
                errors: "Internal Server Error",
            });
        }
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 400,
            message: "Booking failed",
            errors: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
});
const getAllBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let userId = null;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "customer") {
            userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        }
        const result = yield booking_service_1.bookingServices.getAllBookings(userId);
        if (result)
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: 200,
                message: "Bookings retrieved successfully",
                data: result,
            });
        else {
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: 200,
                message: "No booking found",
                data: [],
            });
        }
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 500,
            message: "Failed to retrieve booking",
            errors: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
});
const updateBookingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const { bookingId } = req.params;
        const { result, message } = yield booking_service_1.bookingServices.updateBookingById(bookingId, status);
        if (result) {
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: 200,
                message: message || "Booking updated successfully",
                data: result,
            });
        }
        else {
            (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: 400,
                message: "Update failed or no vehicle found with the provided ID",
                data: {},
            });
        }
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 500,
            message: error instanceof Error ? error.message : "N/A",
            data: [],
        });
    }
});
exports.bookingControllers = {
    createBooking,
    getAllBookings,
    updateBookingById,
};
