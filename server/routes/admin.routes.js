const express = require("express");
const path = require("path");
const app = express();

app.use(
  "/admin/dashboard",
  express.static(path.join(__dirname, "../../public/admin"))
);

module.exports = app;
