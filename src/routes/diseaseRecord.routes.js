import express from "express";
import {
  createDiseaseRecord,
  getDiseaseRecordsOfStudent,
  getChronicDiseaseRecordsOfStudent,
  getInfectiousDiseaseRecordsOfStudent,
  getAllInfectiousDiseaseRecords,
  getAllChronicDiseaseRecords,
  updateDiseaseRecord,
  getAllDiseaseRecords,
} from "../controllers/diseaseRecord.controller.js";

const router = express.Router();

router.get("/infectious-record", getAllInfectiousDiseaseRecords); // lấy toàn bộ danh sách mắc bệnh truyền nhiễm
router.get(
  "/:student_id/infectious-record",
  getInfectiousDiseaseRecordsOfStudent
);

router.get("/chronic-record", getAllChronicDiseaseRecords); // lấy toàn bộ danh sách mắc bệnh mãn tính
router.get("/:student_id/chronic-record", getChronicDiseaseRecordsOfStudent);

router.post("/student/:student_id/disease-record", createDiseaseRecord); // tạo mới bệnh cho cả truyền nhiễm và mãn tính
router.patch("/student/:student_id/disease-record", updateDiseaseRecord); // update disease record
router.get("/student/:student_id/disease-record", getDiseaseRecordsOfStudent); // list toàn bộ bệnh của một học sinh
router.get("/:student_id/disease-record", getDiseaseRecordsOfStudent); // parent list toàn bộ bệnh của một học sinh
router.get("/disease-record", getAllDiseaseRecords); // lấy toàn bộ danh sách bệnh của tất cả học sinh

export default router;
