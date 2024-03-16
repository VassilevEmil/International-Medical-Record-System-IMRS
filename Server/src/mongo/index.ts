const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error(err));
