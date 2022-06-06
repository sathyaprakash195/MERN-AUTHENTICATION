require("dotenv").config();
const express = require("express");
const mongoDbConfig = require("./config/dbConfig");
const app = express();
app.use(express.json());
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
const port = 5000;

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Node Express Server Started at ${port}!`));
