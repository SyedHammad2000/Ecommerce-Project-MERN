import express from "express";
import color from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import ConnectDb from "./config/db.js";
// import authRoutes from "./routes/authRouter.js"
import authRoute from "./routes/authRouter.js";
import categoryRoute from "./routes/categoryRouter.js";
import productRoute from "./routes/productRouter.js";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// configure env
dotenv.config();
// database connect
ConnectDb();
const app = express();
// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../client/build")));

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);

//rest api
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
const port = process.env.PORT || 4000;
console.log(port);

app.listen(port, () => {
  console.log("Server is running on port", `${port}`.bgRed);
});
