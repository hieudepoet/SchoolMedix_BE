// routes/vaccination.routes.js
import express from "express";
import {
  createVaccinationRecord,
  updateVaccinationRecord,
  getVaccinationRecordByID,
  getVaccinationRecordsByStudentID,
  getVaccinationRecordsOfAStudentBasedOnADisease,
  acceptVaccinationRecord,
  refuseVaccinationRecord,
  getAllVaccinationRecordsRequested,
  getAllMedicalRecordsRequested,
} from "../controllers/vaccinationRecord.controller.js";

const router = express.Router();

router.get(
  "/student/:student_id/vaccination-record",
  getVaccinationRecordsByStudentID
);
router.get(
  "/student/:student_id/disease/:disease_id/vaccination-record",
  getVaccinationRecordsOfAStudentBasedOnADisease // get detail of vaccination records of a student based on a disease
);
router.post("/vaccination-record", createVaccinationRecord);
router.patch("/vaccination-record/:record_id", updateVaccinationRecord);
router.get("/vaccination-record/:id", getVaccinationRecordByID);

export default router;
