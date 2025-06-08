import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
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

app.use("/api/auth", authRoutes);

export default app;
