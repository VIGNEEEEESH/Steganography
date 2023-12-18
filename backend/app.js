const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const path = require("path");
const axios=require("axios")
const cors = require('cors');
const fileUpload=require("./middleware/file-upload")
const userRoutes=require("./Routes/User-Routes")
const messageRoutes=require("./Routes/Message-Routes")

app.use(bodyParser.json());
app.use(cors({ origin: '*' }));
app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/api/hiddenwhisper/user",userRoutes)
app.use("/api/hiddenwhisper/message",messageRoutes)

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});

mongoose
  .connect(
    `mongodb+srv://root:4444@cluster0.rw3waqy.mongodb.net/steganography?retryWrites=true&w=majority`
  )
  .then(app.listen(4444))
  .catch((err) => {
    console.log(err);
  });
