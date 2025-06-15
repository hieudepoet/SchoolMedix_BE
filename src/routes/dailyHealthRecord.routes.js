import express from "express";
import {
  createDailyHealthRecord,
  getDailyHealthRecords,
  getDailyHealthRecordsByStudentId,
  getDailyHealthRecordById,
} from "../controllers/dailyHealth.controller.js";

const router = express.Router();

router.post("/daily-health-record", createDailyHealthRecord);
router.get("/daily-health-records", getDailyHealthRecords);
router.get(
  "/student/:student_id/daily-health-record",
  getDailyHealthRecordsByStudentId
);
router.get("/daily-health-record/:id", getDailyHealthRecordById);

export default router;
