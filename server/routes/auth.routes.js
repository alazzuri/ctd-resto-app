const express = require("express");
const path = require("path");
const app = express();

app.use("/", express.static(path.join(__dirname, "../../public/login")));

app.use(
  "/register",
  express.static(path.join(__dirname, "../../public/register"))
);

module.exports = app;
