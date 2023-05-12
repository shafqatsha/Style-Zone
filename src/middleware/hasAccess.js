
const { handleError } = require("../util/helpers.js");

module.exports = async (req, res, next, _access) => {
  try {
    if(req.user.user_type === 'admin') return next();
    if (req.user.access_type.some((access) => access === _access)) {
      next();
    } else {
      handleError({
        message: "You do not have required access rights",
        code: 401,
      });
    }
  } catch (error) {
    console.log(error);
    handleError({ error, code: 500, next });
  }
};
