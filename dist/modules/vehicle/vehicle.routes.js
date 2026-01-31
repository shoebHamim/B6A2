"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const vehicle_controller_1 = require("./vehicle.controller");
const router = (0, express_1.Router)();
router.get("/", vehicle_controller_1.vehicleControllers.getAllVehicles);
router.post("/", (0, auth_1.default)("admin"), vehicle_controller_1.vehicleControllers.createVehicle);
router.get("/:vehicleId", vehicle_controller_1.vehicleControllers.getVehicleById);
router.put("/:vehicleId", (0, auth_1.default)("admin"), vehicle_controller_1.vehicleControllers.updateVehicleById);
router.delete("/:vehicleId", (0, auth_1.default)("admin"), vehicle_controller_1.vehicleControllers.deleteVehicleById);
exports.vehicleRoutes = router;
