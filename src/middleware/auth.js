const jwt = require("jsonwebtoken");
const {User} = require("../models/User.js");

module.exports= async (req, res, next) => {
  let token = req.get("Authorization");
  if (token && token?.indexOf("Bearer") > -1) {
    token = token.split(" ")[1];
 
    try {
      const decodedToken = jwt.verify(token, "shafqat_-_sha_-_45");
      if (!decodedToken) {
        const error = new Error("Unauthorized.");
        error.statusCode = 401;
        next(error);
      }
      const user = await User.findById(decodedToken.user_id);
      if (!user) {
        const error = new Error("Unauthorized.");
        error.statusCode = 401;
        next(error);
      }
      req.user = user;
      next();
    } catch (error) {
      error.statusCode = 500;
      next(error);
    }
  } else {
    const error = new Error("Unauthorized.");
    error.statusCode = 401;
    next(error);
  }
};