import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User, { USER_SCHEMA_PROTO_ } from "../models/User.js";

export const userSignupController = async (req, res) => {
  try {
    let userPayload = {};
    for (const key in USER_SCHEMA_PROTO_) {
      if (req.body.hasOwnProperty.call(req.body, key)) {
        userPayload[key] = req.body[key];
      }
    }
    const user = new User(userPayload);
    await user.validate();
    const isExists = await User.findByEmail(req.body.email);
    if (isExists) {
      return res.send({ message: "Email already exists" });
    }

    await user.save();
    res.send({ message: "Signup successful", user });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const userLoginController = async (req, res) => {
  try {
    if (!req.body.email) {
      const error = new Error({
        message: "The email is required",
      });
      error.statusCode = 402;
      throw error;
    }

    if (!req.body.password) {
      const error = new Error({
        message: "The password is required",
      });
      error.statusCode = 402;
      throw error;
    }

    const user = await User.findByEmail(req.body.email);
    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }
    const isMatched = await bcrypt.compare(req.body.password, user.password);
    if (!isMatched) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
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
    res.json(error);
  }
};

export const fetchSingleUserController = async (req, res) => {
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
