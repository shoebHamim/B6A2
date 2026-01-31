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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const config_1 = __importDefault(require("../config"));
const auth_interfaces_1 = require("../modules/auth/auth.interfaces");
const booking_service_1 = require("../modules/booking/booking.service");
const auth = (...allowedRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: 401,
                message: "No authorization token provided!",
                errors: [],
            });
        }
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.json_secret);
            if (!allowedRoles.includes(decoded.role)) {
                return (0, sendResponse_1.default)(res, {
                    statusCode: 403,
                    success: false,
                    message: "You are not authorized to access this!",
                    errors: [],
                });
            }
            if (decoded.role === auth_interfaces_1.roles.CUSTOMER) {
                const baseUrl = req.baseUrl;
                console.log(baseUrl);
                // user specific user details update check
                if (req.method === "PUT" && baseUrl === "/api/v1/users") {
                    const { userId } = req.params;
                    if (decoded.id !== userId) {
                        return (0, sendResponse_1.default)(res, {
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
                    const fetchedBooking = yield booking_service_1.bookingServices.getBookingById(bookingId);
                    console.log("fetched bookings", fetchedBooking);
                    console.log({ decoded });
                    if (!fetchedBooking) {
                        return (0, sendResponse_1.default)(res, {
                            success: false,
                            statusCode: 404,
                            message: "Failed to update booking",
                            errors: "Booking doesn't exist",
                        });
                    }
                    if (fetchedBooking.customer_id.toString() !== decoded.id) {
                        return (0, sendResponse_1.default)(res, {
                            success: false,
                            statusCode: 403,
                            message: "Booking update failed",
                            errors: "You are not allowed to update this resource!",
                        });
                    }
                }
            }
            req.user = decoded;
            next();
        }
        catch (err) {
            (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: 500,
                message: "Invalid token!",
                errors: err instanceof Error ? err.message : "Something went wrong",
            });
        }
    });
};
exports.default = auth;
