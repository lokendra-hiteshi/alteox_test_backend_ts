import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/dbConfig";
import apiRoutes from "./routes/index";

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database connected and synchronized");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error("Database connection error:", err);
  });
