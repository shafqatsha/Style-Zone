import { Router } from "express";
import {
  userSignupController,
  userUpdateController,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import hasAccess from "../middleware/hasAccess.js";
import User from "../models/User.js";
import { ACCESS_TYPES } from "../util/constants.js";
import { handleError } from "../util/helpers.js";

const router = Router();

router.get("/is-admin-exist", async (req, res, next) => {
  try {
    const result = await User.findOne({ user_type: "admin" });
    res.send({
      message: "items fetched successfully",
      is_admin_exists: result ? true : false,
    });
  } catch (error) {
    handleError({ error, code: 500, next });
  }
});

router.post(
  "/create-user",
  auth,
  (req, res, next) => {
    hasAccess(req, res, next, ACCESS_TYPES.CREATE);
  },
  userSignupController
);

router.put(
  "/update-user/:id",
  auth,
  (req, res, next) => {
    hasAccess(req, res, next, ACCESS_TYPES.EDIT);
  },
  userUpdateController
);

router.get(
  "/users",
  auth,
  (req, res, next) => {
    hasAccess(req, res, next, ACCESS_TYPES.READ);
  },
  async (req, res, next) => {
    try {
      const baseURL = "http://localhost:3000/product?page=";
      const totalItems = await User.find({}).countDocuments();
      const page = req.query.page || 1;
      const page_size = req.query.page_size || 10;

      const nextPage = +page + 1;
      const next_page_url = totalItems > page_size ? baseURL + nextPage : null;
      const prevPage = +page - 1;
      const previous_page_url =
        totalItems > page_size && page > 1 ? baseURL + prevPage : null;

      const users = await User.find({})
        .skip((page - 1) * page_size)
        .limit(page_size);
      res.send({
        message: "Items fetched successfully",
        result: {
          previous_page_url,
          next_page_url,
          totalItems,
          users,
        },
      });
    } catch (error) {
      handleError({ error, code: 500, next });
    }
  }
);

router.post(
  "/create-admin",
  async (req, res, next) => {
    try {
      const result = await User.findOne({ user_type: "admin" });
      if (result) {
        return handleError({
          message: "There may be only one admin. Permission denied.",
          code: 500,
          next,
        });
      }
      req.body.user_type = "admin";
      next();
    } catch (error) {
      handleError({ error, code: 500, next });
    }
  },
  userSignupController
);

export default router;
