// routes/vaccination.routes.js
import express from "express";
import {
  createCampaign,
  createRegisterRequest,
  updateRegisterStatus,
  getStudentEligibleForCampaign,
  createVaccinationRecord,
  createPreVaccinationRecord,
  updateVaccinationRecord,
  getVaccinationRecord,
  getAllCampaigns,
  getCampaignDetailByID,
  getVaccinationRecordsByStudentID,
} from "../controllers/vaccinationCampaign.controller.js";

const router = express.Router();

router.post("/vaccination-campaign", createCampaign);
router.get("/vaccination-campaign", getAllCampaigns);
router.get("/vaccination-campaign/:campaign_id", getCampaignDetailByID);
// router.post("/register-request", createRegisterRequest);

router.get(
  "student/:student_id/vaccination-record",
  getVaccinationRecordsByStudentID
);

router.patch("/vaccination-register/:id/accept", updateRegisterStatus);
router.patch("/vaccination-register/:id/refuse", updateRegisterStatus);

router.get(
  "/campaign/:campaign_id/student-eligible",
  getStudentEligibleForCampaign
);

router.post("/vaccination-record", createVaccinationRecord);
router.post("/pre-vaccination-record/:campaign_id", createPreVaccinationRecord);

router.patch("/vaccination-record/:student_id", updateVaccinationRecord);

router.get("/vaccination-record/:id", getVaccinationRecord);

export default router;
