import { Router } from "express";
import auth from "../../middlewares/auth";
import { vehicleControllers } from "./vehicle.controller";

const router = Router();

router.get("/", vehicleControllers.getAllVehicles);
router.post("/", auth("admin"), vehicleControllers.createVehicle);
router.get("/:vehicleId", vehicleControllers.getVehicleById);
router.put("/:vehicleId", auth("admin"), vehicleControllers.updateVehicleById);
router.delete(
  "/:vehicleId",
  auth("admin"),
  vehicleControllers.deleteVehicleById,
);

export const vehicleRoutes = router;
