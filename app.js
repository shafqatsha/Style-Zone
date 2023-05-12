require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
 
//routes
const productRoutes = require("./src/routes/product.js");
const orderRoutes = require("./src/routes/order.js");
const usersRoutes = require("./src/routes/users.js");
const adminRoutes = require("./src/routes/admin.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
 
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.use('/medias', express.static(path.join(__dirname, 'medias')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods','OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})
 
app.use("/admin", adminRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/users", usersRoutes);

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
