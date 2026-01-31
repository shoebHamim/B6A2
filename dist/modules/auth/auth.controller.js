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
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body)
            throw new Error("Missing Payload!");
        const { email, password } = req.body;
        const result = yield auth_service_1.authService.signIn(email, password);
        if (!result) {
            (0, sendResponse_1.default)(res, {
                success: false,
                message: "Incorrect email or password",
                errors: [],
                statusCode: 401,
            });
        }
        (0, sendResponse_1.default)(res, {
            success: true,
            message: "Login successful",
            data: {
                token: result.token,
                user: result.fetchedUser,
            },
            statusCode: 200,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 500,
            message: "Signin failed!",
            errors: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
});
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            throw new Error("Missing Payload!");
        }
        const { password } = req.body;
        if ((password === null || password === void 0 ? void 0 : password.length) < 6) {
            (0, sendResponse_1.default)(res, {
                statusCode: 400,
                success: false,
                message: "Password must be a minimum of 6 characters",
                data: {},
            });
        }
        const result = yield auth_service_1.authService.signUp(req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: 201,
            success: true,
            message: "User registered successfully",
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 500,
            message: "User registration failed!",
            errors: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
});
exports.authController = {
    signIn,
    signUp,
};
