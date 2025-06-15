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

router.post("/vaccination-campaign", createCampaign); // xong
router.get("/vaccination-campaign", getAllCampaigns); // xong
router.get("/vaccination-campaign/:campaign_id", getCampaignDetailByID); // xong
router.post("/vaccination-campaign/:campaign_id/register", createRegisterRequest); // xong

router.get("/student/:student_id/vaccination-record", getVaccinationRecordsByStudentID); // xong


router.patch("/vaccination-register/:id/accept", acceptRegister); // xong
router.patch("/vaccination-register/:id/refuse", refuseRegister); // xong

router.get("/vaccination-campaign/:campaign_id/student-eligible", getStudentEligibleForCampaign); // xong

router.post("/vaccination-record", createVaccinationRecord); // xong
router.post("/pre-vaccination-record/:campaign_id", createPreVaccinationRecord); // xong

router.patch("/vaccination-record/:student_id", updateVaccinationRecord);

router.get("/vaccination-record/:id", getVaccinationRecord);


export default router;
