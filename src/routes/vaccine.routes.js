// routes/vaccination.routes.js
import express from "express";
import {
  createVaccine,
  createCampaign,
  createRegisterRequest,
  updateRegisterStatus,
  getStudentEligibleForCampaign,
  createVaccinationRecord,
  createPreVaccinationRecord,
  updateVaccinationRecord,
  getVaccinationRecord,
  getVaccinationRecords,
} from "../controllers/vaccine.controller.js";

const router = express.Router();

router.post("/vaccine", createVaccine);
router.post("/campaign", createCampaign);
router.post("/register-request", createRegisterRequest);
router.patch("/register-request/:id", updateRegisterStatus);
router.get("/student-eligible-for-campaign/:id", getStudentEligibleForCampaign);
router.post("/vaccination-record", createVaccinationRecord);
router.post("/pre-vaccination-record/:campaign_id", createPreVaccinationRecord);
router.patch("/vaccination-record/:student_id", updateVaccinationRecord);
router.get("/vaccination-record/:id", getVaccinationRecord);
router.get("/vaccination-records/:student_id", getVaccinationRecords);

export default router;
