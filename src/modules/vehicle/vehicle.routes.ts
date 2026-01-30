import { Router } from "express";
import auth from "../../middlewares/auth";
import { vehicleControllers } from "./vehicle.controller";

const router = Router();

router.get("/", auth("admin"), vehicleControllers.getAllVehicles);
router.post("/", auth("admin"), vehicleControllers.createNewVehicle);
router.get("/:id", auth("admin"), vehicleControllers.getVehicleById);
router.put("/:id", auth("admin"), vehicleControllers.updateVehicleById);
router.delete("/:id", auth("admin"), vehicleControllers.deleteVehicleById);

export const vehicleRoutes = router;
