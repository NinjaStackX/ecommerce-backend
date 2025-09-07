import express from "express";

import { restrictTo } from "../middlewares/protect.js";
import { createAny, readAll } from "../controllers/admin.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router
  .route("/")
  .get(
    // restrictTo("admin user"),
    asyncHandler(readAll)
  )
  .post(asyncHandler(createAny));

export default router;
