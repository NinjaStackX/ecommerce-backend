import { restrictTo } from "../middlewares/protect.js";

import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { getAudioLog } from "../controllers/auditlog.controller.js";

const router = express.Router();
router.get("/", restrictTo("admin "), asyncHandler(getAudioLog));
export default router;
