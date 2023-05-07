import express from "express";
import mongoose from "mongoose";
//models
import User from "./src/models/User.js";

//routes
import productRoutes from "./src/routes/product.js";
import orderRoutes from "./src/routes/order.js";
import usersRoutes from "./src/routes/users.js";
import adminRoutes from "./src/routes/admin.js";

//routes

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods','OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/users", usersRoutes);
app.use("/admin", adminRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, error: error.stack, data,  });
});


const PORT = process.env.PORT || 3000;

mongoose
  .connect(
    "mongodb+srv://stylezone:StyleZone_45_@cluster0.mariis7.mongodb.net/stylezone?retryWrites=true&w=majority"
  )
  .then(() => {

    app.listen(PORT, () => {
      console.log("Server is up and running on port", PORT);
    });
  })
  .catch((e) => {
    console.log(e);
  });
