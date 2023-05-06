
import { Router } from "express";
import {
  userSignupController,
  userLoginController,
  fetchSingleUserController,
} from "../controllers/userController.js";

const router = Router();

router.post("/signup", userSignupController);

router.post("/login", userLoginController);

router.post("/update/:id", async (req, res) => {});

router.get("/user/:id", fetchSingleUserController);

export default router;
