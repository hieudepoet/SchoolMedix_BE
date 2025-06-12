// routes/disease.routes.js
import express from "express";
import {
  createDisease,
  getAllDiseases,
  updateDisease,
  deleteDisease,
  createDiseaseRecord,
  updateDiseaseRecord,
  getAllDiseaseRecords,
  getDiseaseRecordsByCategory,
  deleteDiseaseRecord,
} from "../controllers/disease.controller.js";

const router = express.Router();

router.post("/disease", createDisease);
router.get("/diseases", getAllDiseases);
router.put("/disease/:id", updateDisease);
router.delete("/disease/:id", deleteDisease);
router.post("/disease-record", createDiseaseRecord);
router.put("/disease-record/:id", updateDiseaseRecord);
router.get("/disease-records", getAllDiseaseRecords);
router.get(
  "/disease-records/:student_id/:disease_category",
  getDiseaseRecordsByCategory
);
router.delete("/disease-record/:id", deleteDiseaseRecord);

export default router;
