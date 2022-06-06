const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});

let connectionObj = mongoose.connection;

connectionObj.on("connected", () => {
  console.log("Mongo DB Connection Successfull");
});

connectionObj.on("error", () => {
  console.log("Mongo DB Connection Failed");
});
