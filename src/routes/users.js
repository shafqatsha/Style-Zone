const { Router } = require("express");
const {
  userSignupController,
  userLoginController,
  fetchSingleUserController,
  userUpdateController,
  fetchMeUserController,
} = require("../controllers/userController.js");
const auth = require("../middleware/auth.js");

const router = Router();

router.post("/signup",userSignupController);

router.post("/login", userLoginController);
router.get("/me",auth, fetchMeUserController);

router.put("/update/:id",auth, userUpdateController);


router.get("/user/:id",auth, fetchSingleUserController);


module.exports = router;
