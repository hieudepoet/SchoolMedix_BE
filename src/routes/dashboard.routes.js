import express from "express";
import {
  getSummary,
  getAccidentStats,
  getDiseaseStats,
  getHealthStats,
  getMedicalPlans,
  getHealthStatsByGradeID,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/dashboard/summary", getSummary);
router.get("/dashboard/accidents", getAccidentStats);
router.get("/dashboard/diseases", getDiseaseStats);
router.get("/dashboard/health-stats", getHealthStats);
router.get("/dashboard/upcoming-health-plans", getMedicalPlans);
router.get("/dashboard/height-weight/:grade_id?", getHealthStatsByGradeID);
export default router;
