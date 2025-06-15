// routes/vaccination.routes.js
import express from "express";
import {
  createCampaign,
  createRegisterRequest,
  getStudentEligibleForCampaign,
  createVaccinationRecord,
  createPreVaccinationRecord,
  updateVaccinationRecord,
  getVaccinationRecord,
  getAllCampaigns,
  getCampaignDetailByID,
  getVaccinationRecordsByStudentID,
  acceptRegister,
  refuseRegister
} from "../controllers/vaccinationCampaign.controller.js";

const router = express.Router();

router.post("/vaccination-campaign", createCampaign);
router.get("/vaccination-campaign", getAllCampaigns);
router.get("/vaccination-campaign/:campaign_id", getCampaignDetailByID);
router.post("/vaccination-campaign/:campaign_id/register", createRegisterRequest);

router.get("/student/:student_id/vaccination-record", getVaccinationRecordsByStudentID);


router.patch("/vaccination-register/:id/accept", acceptRegister);
router.patch("/vaccination-register/:id/refuse", refuseRegister);

router.get("/vaccination-campaign/:campaign_id/student-eligible", getStudentEligibleForCampaign);

router.post("/vaccination-record", createVaccinationRecord);
router.post("/pre-vaccination-record/:campaign_id", createPreVaccinationRecord);

router.patch("/vaccination-record/:record_id", updateVaccinationRecord);

router.get("/vaccination-record/:id", getVaccinationRecord);


export default router;
