const express = require("express");
const path = require("path");
const app = express();

app.use(
  "/user/home",
  express.static(path.join(__dirname, "../../public/user"))
);

module.exports = app;
