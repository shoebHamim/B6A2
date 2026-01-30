import { Router } from "express";
import auth from "../../middlewares/auth";
import { userControllers } from "./user.controller";
import { roles } from "../auth/auth.interfaces";

const router = Router();

router.get("/", auth(roles.ADMIN), userControllers.getAllUsers);
router.put(
  "/:id",
  auth(roles.ADMIN, roles.CUSTOMER),
  userControllers.updateUser,
);
router.delete(
  "/:id",
  auth(roles.ADMIN, roles.CUSTOMER),
  userControllers.deleteUser,
);

export const userRoutes = router;
