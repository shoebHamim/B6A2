"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_controller_1 = require("./user.controller");
const auth_interfaces_1 = require("../auth/auth.interfaces");
const router = (0, express_1.Router)();
router.get("/", (0, auth_1.default)(auth_interfaces_1.roles.ADMIN), user_controller_1.userControllers.getAllUsers);
router.put("/:userId", (0, auth_1.default)(auth_interfaces_1.roles.ADMIN, auth_interfaces_1.roles.CUSTOMER), user_controller_1.userControllers.updateUser);
router.delete("/:userId", (0, auth_1.default)(auth_interfaces_1.roles.ADMIN), user_controller_1.userControllers.deleteUser);
exports.userRoutes = router;
