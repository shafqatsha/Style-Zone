const { Product } = require("../models/Product.js");
const { PRODUCT_SCHEMA_PROTO_ } = require("../models/Product.js");
const { handleError, paginate } = require("../util/helpers.js");

exports.createProductController = async (req, res, next) => {
  try {
    let productPayload = {};
    for (const productschemaprotoKey in PRODUCT_SCHEMA_PROTO_) {
      productPayload[productschemaprotoKey] = req.body[productschemaprotoKey];
    }
    productPayload.user_id = req.user._id;

    if (!req.file) {
      return handleError({
        message: "Please provide media file",
        code: 422,
        next,
      });
    }
    console.log(req.file);
    productPayload.medias = [
      {
        media: req.file.path,
        media_url: process.env.BASE_URL + "/" + req.file.path,
      },
    ];

    // if(!req.body.sizes) {
    //   return handleError({message: 'The product sizes field is required!!!', code: 422, next})
    // }
    // productPayload.sizes = JSON.parse(req.body.sizes);

    const product = new Product(productPayload);

    await product.save();
    res.status(200).send({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return handleError({ error, next });
  }
};

exports.findAllProductsController = async (req, res, next) => {
  try {

    const baseURL = process.env.BASE_URL + "/product?page=";
    const totalItems = await Product.find({}).countDocuments();
    const page = req.query.page || 1;
    const page_size = req.query.page_size || 10;

    const {next_page_url, previous_page_url} = paginate({baseURL, totalItems, page, page_size});

    const products = await Product.find({})
      .skip((page - 1) * page_size)
      .limit(page_size);

    res.send({
      message: "Items fetched successfully",
      result: {
        previous_page_url,
        next_page_url: products.length ? next_page_url : null,
        totalItems,
        products,
      },
    });
  } catch (error) {
    handleError({ error, code: 500, next });
  }
};
exports.singleProductController = async (req, res) => {
  try {
    const id = req.params.id;
    if (id) {
      let product = await Product.findById(id).exec();
      product = product
        ? { message: "Product fetched successfully", product }
        : { message: "No product found" };
      return res.status(200).send(product);
    }
    return res.status(401).send("Please provide an id");
  } catch (e) {
    res.status(422).send(e);
  }
};

exports.updateProductController = async (req, res) => {
  try {
    const id = req.params.id;
    if (id) {
      let product = await Product.findById(id).exec();
      if (product) {
        for (const productKey in PRODUCT_SCHEMA_PROTO_) {
          product[productKey] = req.body[productKey];
        }
        await product.save();
        return res.status(200).send({
          message: "Product updated successfully",
          product,
        });
      }
    }
    return res.status(401).send("Please provide an id");
  } catch (e) {
    res.send(e);
  }
};

exports.deleteProductController = async (req, res) => {
  try {
    const id = req.params.id;
    if (id) {
      let response = await Product.findByIdAndDelete(id).exec();
      response = response
        ? { message: "Product deleted successfully", response }
        : { message: "No product found" };
      return res.status(200).send(response);
    }
    return res.status(401).send("Please provide an id");
  } catch (e) {
    res.status(402).send(e);
  }
};
