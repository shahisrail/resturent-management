import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import restaurantRoutes from "./routes/restaurant.routes";
import restaurantMenuRoutes from "./routes/restaurantMenu.routes";
import publicRoutes from "./routes/publicMenu.routes";
import dotenv from "dotenv";
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

dotenv.config();

// Example route
app.get("/", (req, res) => {
  res.send(" FOOD API is running");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/restaurant", restaurantRoutes);
app.use("/api/v1/restaurant/menu", restaurantMenuRoutes);

app.use("/api/v1/public", publicRoutes);
export default app;
