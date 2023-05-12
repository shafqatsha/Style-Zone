const { User } = require("../models/User");
const { handleError } = require("../util/helpers");

exports.isAdminExists = async (req, res, next) => {
  try {
    const result = await User.findOne({ user_type: "admin" });
    res.send({
      is_admin_exists: result ? true : false,
    });
  } catch (error) {
    handleError({ error, code: 500, next});
  }
};

exports.adminGetAllUsers = async (req, res, next) => {
  try {
    const baseURL = process.env.BASE_URL + "/users?page=";
    const totalItems = await Product.find({}).countDocuments();
    const page = req.query.page || 1;
    const page_size = req.query.page_size || 10;

    const {next_page_url, previous_page_url} = paginate({baseURL, totalItems, page, page_size});


    const users = await User.find({})
      .skip((page - 1) * page_size)
      .limit(page_size);
    res.send({
      message: "Items fetched successfully",
      result: {
        previous_page_url,
        next_page_url,
        totalItems,
        totalPages,
        users,
      },
    });
  } catch (error) {
    handleError({ error, code: 500, next });
  }
};
