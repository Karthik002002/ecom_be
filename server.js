import express from "express";
import dotenv from "dotenv";
import { connectDB, sequelize } from "./db/Config.js";
import { MainRoute } from "./Routes/MainRoute.js";
import { Token } from "./Model/TokenModel.js";
import cors from "cors";
import { Product } from "./Model/ProductModel.js";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests manually (if needed)
app.options("*", cors());
connectDB();

MainRoute.map((route) => {
  app.use(route.path, route.route);
});
// Sync Database
sequelize.sync().then(() => {
  console.log("Database synchronized.");
});

app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    // If it's a route middleware
    console.log(
      `${Object.keys(middleware.route.methods).join(", ").toUpperCase()} ${
        middleware.route.path
      }`
    );
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
