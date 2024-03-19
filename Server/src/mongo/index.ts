const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/", {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to DB"));
// .catch((err: any) => console.error(err));
