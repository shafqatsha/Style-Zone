import Product, { PRODUCT_SCHEMA_PROTO_ } from "../models/Product.js";

export const createProductController = async (req, res) => {
  try {
    let productPayload = {};
    for (const productschemaprotoKey in PRODUCT_SCHEMA_PROTO_) {
      productPayload[productschemaprotoKey] = req.body[productschemaprotoKey];
    }
    productPayload.user_id = req.user._id;
    const product = new Product(productPayload);
    await product.save();
    res.status(200).send({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    throw error;
  }
};

export const findAllProductsController = async (req, res) => {
  try {
    const baseURL = "http://localhost:3000/product?page=";
    const totalItems = await Product.find({}).countDocuments();
    const page = req.query.page || 1;
    const page_size = req.query.page_size || 10;

    const nextPage = +page + 1;
    const next_page_url = totalItems > page_size ? baseURL + nextPage : null;
    const prevPage = +page - 1;
    const previous_page_url =
      totalItems > page_size && page > 1 ? baseURL + prevPage : null;

    const products = await Product.find({})
      .skip((page - 1) * page_size)
      .limit(page_size);
    res.send({
      message: "Items fetched successfully",
      result: {
        previous_page_url,
        next_page_url,
        totalItems,
        products,
      },
    });
  } catch (e) {
    res.status(402).send(e);
  }
};
export const singleProductController = async (req, res) => {
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
    res.status(402).send(e);
  }
};

export const updateProductController = async (req, res) => {
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

export const deleteProductController = async (req, res) => {
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
