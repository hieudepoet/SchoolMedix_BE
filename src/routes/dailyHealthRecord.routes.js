import express from "express";
import {
  createDailyHealthRecord,
  getDailyHealthRecords,
  getDailyHealthRecordsByStudentId,
  getDailyHealthRecordById,
  updateDailyHealthRecordById,
  deleteDailyHealthRecordById,
} from "../controllers/dailyHealth.controller.js";

const router = express.Router();

router.post("/daily-health-record", createDailyHealthRecord);
router.get("/daily-health-record", getDailyHealthRecords);
router.get(
  "/:student_id/daily-health-record",
  getDailyHealthRecordsByStudentId
);
router.get("/daily-health-record/:id", getDailyHealthRecordById);
router.put("/daily-health-record/:id", updateDailyHealthRecordById);
router.delete("/daily-health-record/:id", deleteDailyHealthRecordById);
export default router;
