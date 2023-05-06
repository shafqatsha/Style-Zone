import bcrypt from "bcryptjs";

import { Schema, model } from "mongoose";
import isEmail from "validator/lib/isEmail.js";

const USER_SCHEMA_PROTO_ = {
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (v) => isEmail(v),
      message: (props) => "Please provide a valid email",
    },
  },
  password: { type: String, required: true, minLength: 8, trim: true },
  user_type: { type: String, required: true },
};

const CART_PROTO = {
  items: [
    {
      product_id: { type: Schema.Types.ObjectId, ref: "Product" },
      color: { type: String, required: true },
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
};

const userSchema = new Schema({ ...USER_SCHEMA_PROTO_, cart: CART_PROTO });

userSchema.methods.addToCart = function (product) {
  try {
    // check if product already exists
    const cartProduct = this.cart.items.find((cp) => {
      return cp.product_id.toString() === product._id.toString();
    });

    if (cartProduct) {
      if (
        cartProduct.color === product.color &&
        cartProduct.size === product.size
      ) {
        cartProduct.quantity += 1;
      } else {
        pushToCart(this, product);
      }
    } else {
      pushToCart(this, product);
    }

    function pushToCart(self, productToPush) {
      self.cart.items.push({
        product_id: productToPush._id,
        color: productToPush.selected_color,
        size: productToPush.selected_size,
        quantity: productToPush.selected_quantity,
      });
    }

    this.save();
  } catch (e) {
    console.log(e);
  }
};

userSchema.statics.findByEmail = async function (email) {
  try {
    return await this.findOne({ email });
  } catch (error) {
    throw new Error("In error occured", error);
  }
};

userSchema.pre("save", function (cb) {
  return new Promise((resolve, reject) => {
    if (this.isModified("password")) {
      bcrypt.hash(this.password, 12, (error, hashedPassword) => {
        if (error) {
          reject(error);
        }
        this.password = hashedPassword;
        resolve();
      });
    }
  });
});

export default model("User", userSchema);
export { USER_SCHEMA_PROTO_ };
