// routes/disease.routes.js
import express from "express";
import {
  createDisease,
  getAllDiseases,
  updateDisease,
  deleteDisease,
  createDiseaseRecord,
  updateDiseaseRecord,
  deleteDiseaseRecord,
  getAllDiseaseRecords,
  getDiseaseRecordsByCategory,
} from "../controllers/disease.controller.js";

const router = express.Router();

router.post("/disease", createDisease);
router.get("/diseases", getAllDiseases);
router.put("/disease/:id", updateDisease);
router.delete("/disease/:id", deleteDisease);
router.post("/disease-record", createDiseaseRecord);
router.put("/disease-record/:id", updateDiseaseRecord);
router.delete("/disease-record/:id", deleteDiseaseRecord);
router.get("/disease-records/:id", getAllDiseaseRecords);
router.get(
  "/disease-records/:id/:disease_category",
  getDiseaseRecordsByCategory
);

export default router;
