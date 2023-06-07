const { Router } = require("express");
const { isAdminExists, adminGetAllUsers } = require("../controllers/admin.js");
const {
  userSignupController,
  userUpdateController,
} = require("../controllers/userController.js");
const auth = require("../middleware/auth.js");
const hasAccess = require("../middleware/hasAccess.js");
const { User } = require("../models/User.js");
const { ACCESS_TYPES } = require("../util/constants.js");
const { handleError } = require("../util/helpers.js");
const mediaUpload = require("../util/composables/multer.js");

const router = Router();

router.get("/is-admin-exists", isAdminExists);

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

router.get("/users", auth, (req, res, next) => {
  hasAccess(req, res, next, ACCESS_TYPES.READ);
}, adminGetAllUsers);

router.post(
  "/create-admin", mediaUpload.single('image'),async (req, res, next) => {
    try {
      const result = await User.findOne({ user_type: "admin" });
      if (result) {
        return handleError({
          message: "There may be only one admin. Permission denied.",
          code: 500,
          next,
        });
      }
      req.body['user_type'] = "admin";
      req.body['access_type'] = [
        ACCESS_TYPES.CREATE,
        ACCESS_TYPES.EDIT,
        ACCESS_TYPES.READ,
        ACCESS_TYPES.DELETE,
      ];

      next();
    } catch (error) {
      handleError({ error, code: 500, next });
    }
  },
  userSignupController);

module.exports = router;