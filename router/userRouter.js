import express from "express";
import {
  Login,
  SingUp,
  userFind,
  Update,
} from "../controller/userController.js";
import protect from "../middleware/protect.js";

export const UserRouter = express.Router();

UserRouter.post("/auth/signup", SingUp);
UserRouter.post("/auth/login", Login);
UserRouter.get("/user/find", protect, userFind);
UserRouter.put("/user/update/", protect, Update);
