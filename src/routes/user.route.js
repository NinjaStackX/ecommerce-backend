import express from "express";

import { restrictTo } from "../middlewares/protect.js";
import { getAll } from "../controllers/admin.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get(
  "/",
  //  restrictTo("user ".trim(), "admin"),
  asyncHandler(getAll)
);

export default router;
