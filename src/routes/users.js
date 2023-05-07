import { Router } from "express";
import {
  userSignupController,
  userLoginController,
  fetchSingleUserController,
  userUpdateController,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = Router();

router.post("/signup",userSignupController);

router.post("/login", userLoginController);

router.put("/update/:id",auth, userUpdateController);

router.get("/user/:id",auth, fetchSingleUserController);

export default router;
