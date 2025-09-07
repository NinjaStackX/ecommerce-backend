import express from "express";

import { restrictTo } from "../middlewares/protect.js";
import { createAny, readAll } from "../controllers/admin.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadImages } from "../middlewares/upload.js";

const router = express.Router();

router
  .route("/")
  .get(
    // restrictTo("admin user"),
    asyncHandler(readAll)
  )
  .post(uploadImages, asyncHandler(createAny));

export default router;
