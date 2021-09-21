const express = require("express");
const CORS = require("cors");
const loginRoute = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");

(function main() {
  const server = express();
  server.use(express.json(), CORS());
  const port = process.env.PORT || 3000;

  // SET UP SERVER
  server.listen(port, () => {
    console.log(`Server started on port ${port} 🚀🚀🚀`);
  });

  // ROUTERS
  server.use(loginRoute);
  server.use(adminRoutes);
  server.use(userRoutes);
})();
