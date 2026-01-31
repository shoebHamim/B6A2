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
exports.userControllers = void 0;
const user_service_1 = require("./user.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const booking_service_1 = require("../booking/booking.service");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield user_service_1.userServices.getAllUsers();
        if (allUsers) {
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: 200,
                message: "Users retrieved successfully",
                data: allUsers,
            });
        }
        return (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: 200,
            message: "No users found!",
            data: [],
        });
    }
    catch (error) {
        return (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: 500,
            message: "Failed to retrieved users!",
            errors: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { name, email, phone, role } = req.body;
    try {
        const result = yield user_service_1.userServices.updateUser({ name, email, phone, role }, userId);
        if (result) {
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: 200,
                message: "User updated successfully",
                data: result,
            });
        }
        return (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: 404,
            message: "No user found with the id!",
            errors: [],
        });
    }
    catch (error) {
        return (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: 500,
            message: error instanceof Error ? error.message : "Internal Server Error",
            data: [],
        });
    }
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const activeBookings = yield booking_service_1.bookingServices.getActiveBookingsByUserId(userId);
        if (activeBookings) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: 400,
                message: "Failed to delete User",
                errors: "User has active booking",
            });
        }
        const result = yield user_service_1.userServices.deleteUser(userId);
        if (result) {
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: 200,
                message: "Users deleted successfully",
            });
        }
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 404,
            message: "Failed to delete User",
            errors: "No user found",
        });
    }
    catch (error) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 500,
            message: "Failed to delete User",
            errors: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
});
exports.userControllers = {
    getAllUsers,
    updateUser,
    deleteUser,
};
