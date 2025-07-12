import express from "express";
import { getSchedule } from "../controllers/schedule.controller.js";

const router = express.Router();

router.get("/schedule/:parent_id", getSchedule);

export default router;
