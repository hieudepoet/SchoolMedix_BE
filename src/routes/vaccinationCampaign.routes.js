// routes/vaccination.routes.js
import express from "express";
import {
  createCampaign,
  getStudentEligibleForCampaign,
  createRegisterRequest,
  createPreVaccinationRecord,
  updateCampaignDetail,
  getAllCampaigns,
  getCampaignDetailByID,
  acceptRegister,
  refuseRegister,
  closeRegisterByCampaignID,
  cancelCampaignByID,
  startCampaign,
  completeCampaign,
  startRegistrationForCampaign,
  getAllRegistersOfAStudentWithCampaignID,
  getAllRegisteredRecords,
  completeRecord,
  getCompletedDosesMergedByDisease,
  getAcceptedRegisteredRecords,
} from "../controllers/vaccinationCampaign.controller.js";

const router = express.Router();

router.post("/vaccination-campaign", createCampaign);
router.post(
  "/vaccination-campaign/:campaign_id/send-register",
  createRegisterRequest
);
router.patch("/vaccination-campaign/:campaign_id", updateCampaignDetail);
router.get("/vaccination-campaign", getAllCampaigns);
router.get("/vaccination-campaign/:campaign_id", getCampaignDetailByID);

router.patch(
  "/vaccination-campaign/:campaign_id/close-register",
  closeRegisterByCampaignID
);
router.patch("/vaccination-campaign/:campaign_id/cancel", cancelCampaignByID);
router.patch("/vaccination-campaign/:campaign_id/start", startCampaign);
router.patch("/vaccination-campaign/:campaign_id/complete", completeCampaign);
router.patch(
  "/vaccination-campaign/:campaign_id/start-register",
  startRegistrationForCampaign
);

router.get(
  "/student/:student_id/completed-doses",
  getCompletedDosesMergedByDisease
);

router.patch("/vaccination-register/:id/accept", acceptRegister);
router.patch("/vaccination-register/:id/refuse", refuseRegister);

router.get(
  "/vaccination-campaign/:campaign_id/student-eligible",
  getStudentEligibleForCampaign
);

router.post("/pre-vaccination-record/:campaign_id", createPreVaccinationRecord);

router.patch("/vaccination-record/:record_id/complete", completeRecord);

router.get(
  "/student/:student_id/vaccination-campaign/:campaign_id/register",
  getAllRegistersOfAStudentWithCampaignID
);
router.get(
  "/vaccination-campaign/:campaign_id/registered-record",
  getAllRegisteredRecords
);

router.get(
  "/vaccination-campaign/:campaign_id/registered-record/accpeted",
  getAcceptedRegisteredRecords
);

export default router;
