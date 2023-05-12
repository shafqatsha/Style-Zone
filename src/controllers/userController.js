const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const  { USER_SCHEMA_PROTO_ } = require("../models/User.js");
const  {User} = require("../models/User.js");
 
const { handleError } = "../util/helpers.js";

exports.userSignupController = async (req, res, next) => {
  try {
    let userPayload = {};
    for (const key in USER_SCHEMA_PROTO_) {
      if (req.body.hasOwnProperty.call(req.body, key)) {
        userPayload[key] = req.body[key];
      }
    }
    const user = new User(userPayload);
    await user.validate();

    if (userPayload.password !== req.body.confirm_password) {
      return handleError({
        message: "Confirm password not matched!",
        code: 422,
      });
    }

    const isExists = await User.findByEmail(req.body.email);
    if (isExists) {
      return handleError({
        message: "The email you entered already exists",
        code: 422,
      });
    }

    await user.save();
    res.status(201).send({ message: "Signup successful", user });
  } catch (error) {
    console.log(error);
    error.statusCode = error.statusCode ?? 500;
    next(error);
  }
};

exports.userUpdateController = async (req, res, next) => {
  try {
    let user = {};
    if (req.user._id.toString() === req.params.id.toString()) {
      console.log("equals");
      user = req.user;
    } else {
     console.log('not equals');
      user = User.findById(req.params.id);
    }
    for (const key in USER_SCHEMA_PROTO_) {
      if (req.body.hasOwnProperty.call(req.body, key)) {
        user[key] = req.body[key];
      }
    }
    if (user.isModified("email")) {
      return handleError({
        message: "Email address can not be changed",
        code: 422,
      });
    }
    await user.validate();
    if (userPayload.password !== req.body.confirm_password) {
      return handleError({
        message: "Confirm password not matched!",
        code: 422,
      });
    }

    await user.save();
    res.status(200).send({ message: "User updated successful", user });
  } catch (error) {
    handleError({ error, code: 500 });
  }
};

exports.userLoginController = async (req, res, next) => {
  try {
    if (!req.body.email) {
      const error = new Error({
        message: "The email is required",
      });
      error.statusCode = 422;
      next(error);
    }

    if (!req.body.password) {
      const error = new Error({
        message: "The password is required",
      });
      error.statusCode = 422;
      next(error);
    }

    const user = await User.findByEmail(req.body.email);
     
    if (!user) {
      handleError({message:"Invalid email or password", code: 422,})
    }
    const isMatched = await bcrypt.compare(req.body.password, user.password);
    if (!isMatched) {
      handleError({message:"Invalid email or password", code: 500,})
    }
    const token = jwt.sign(
      {
        email: user.email,
        user_id: user._id.toString(),
      },
      "shafqat_-_sha_-_45",
      { expiresIn: "8h" }
    );

    return res.send({
      message: "Login Successful",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    handleError({error, code: 500, next})
  }
};

exports.fetchSingleUserController = async (req, res) => {
  try {
    const _id = req.params.id;
    if (!_id) {
      return res.send({ message: "The user id param is required" });
    }
    const user = await User.findById(_id);

    res.send({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    res.send(error);
  }
};
