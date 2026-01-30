import express, { Request, Response } from "express";
import { authRoutes } from "./modules/auth/auth.routes";
import initDB from "./config/db";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { userRoutes } from "./modules/user/user.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";

const app = express();
app.use(express.json());
try {
  initDB();
} catch (err) {
  throw new Error("error connection db" + err);
}
app.get("/", (req: Request, res: Response) => {
  res.send("hello world!");
});

app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/bookings", bookingRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "no route found",
  });
});

export default app;
