// import on library

import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";

//         <<<<<<<<<<<<<<<<------------------------------------<<<<<<<<<<<<<<<

// import  middlewares

import { limiter } from "./src/middlewares/limiter.js";

//         <<<<<<<<<<<<<<<<------------------------------------<<<<<<<<<<<<<<<

// Enable middlewares

dotenv.config();

const app = express();

app.use(express.json()); //Important
app.use(helmet());
app.use(hpp());
app.use(cors());

//         <<<<<<<<<<<<<<<<------------------------------------<<<<<<<<<<<<<<<

// import Routes

import authRoutes from "./src/routes/auth.route.js";
import adminRoutes from "./src/routes/admin.route.js";
import userRoutes from "./src/routes/user.route.js";
import sharedRoutes from "./src/routes/shared.route.js";
import { protect } from "./src/middlewares/protect.js";
import errorHandler from "./src/middlewares/errorHandler.js";

//         <<<<<<<<<<<<<<<<------------------------------------<<<<<<<<<<<<<<<

// Enable Routes
app.use("/api/auth", authRoutes);
//app.use(protect);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/shared", sharedRoutes);

app.use(errorHandler);
//         <<<<<<<<<<<<<<<<------------------------------------<<<<<<<<<<<<<<<

// main

app.get("/", (req, res) => {
  res.send("Bashar E-Commerce Backend is running ✅");
});

export default app;
