import express, { Request, Response, NextFunction } from "express";
import Routes from "./routes";
import connectDB from "./config/database";
import { config } from "./config/config";
import cors from "cors";

const app = express();
const PORT = config.port;
connectDB();

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use(cors());

app.use("/api", Routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
