import express from "express";
import {
  createDiseaseRecord,
  getDiseaseOfStudent,
  getAllInfectiousDiseaseRecords,
  getAllChronicDiseaseRecords,
  updateDiseaseRecord,
  getAllDiseaseRecords,
} from "../controllers/diseaseRecord.controller.js";

const router = express.Router();

router.get("/infectious-record", getAllInfectiousDiseaseRecords); // lấy toàn bộ danh sách mắc bệnh truyền nhiễm
router.get("/chronic-record", getAllChronicDiseaseRecords); // lấy toàn bộ danh sách mắc bệnh mãn tính

router.post("/student/:student_id/disease-record", createDiseaseRecord); // tạo mới bệnh cho cả truyền nhiễm và mãn tính
router.patch("/student/:student_id/disease-record", updateDiseaseRecord); // update disease record
router.get("/student/:student_id/disease-record", getDiseaseOfStudent); // list toàn bộ bệnh của một học sinh
router.get("/disease-record", getAllDiseaseRecords); // lấy toàn bộ danh sách bệnh của tất cả học sinh

export default router;
