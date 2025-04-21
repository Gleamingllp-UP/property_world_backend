require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { mongoDB } = require("./src/config/config");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

mongoose
  .connect(mongoDB.uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongodb is connected...");
  })
  .catch((err) => {
    console.log("Mongodb is not connected...", err);
  }); 

const adminRoutes = require("./src/routes/admin/adminRoutes");
app.use("/api/admin", adminRoutes);
 
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is Working",
    status: 200,
    success: true,
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
    success: false,
    status: 404,
  });
});
