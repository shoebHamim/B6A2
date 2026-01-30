import { Router } from "express";
import auth from "../../middlewares/auth";
import { bookingControllers } from "./booking.controller";

const router = Router();
router.post("/", auth("customer", "admin"), bookingControllers.createBooking);
router.get("/", auth("admin"), bookingControllers.getAllBookings);
router.put("/:bookingId", auth("customer", "admin"), bookingControllers.updateBookingById);

export const bookingRoutes = router;
