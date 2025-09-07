import express from "express";
import { login, register } from "../controllers/shared/user.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router
  .post("/register", asyncHandler(register)) //
  .post("/login", asyncHandler(login));

export default router;
