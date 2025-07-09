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
  acceptDiseaseRecord,
  refuseDiseaseRecord,
  getAllDiseaseRecordsRequested,
  getDiseaseRecordsRequestedByStudentID,
  getDiseaseDeclarationsHistoryByStudentID,
  getDiseaseDeclarationsHistory,
} from "../controllers/diseaseRecord.controller.js";

const router = express.Router();

router.get("/infectious-record", getAllInfectiousDiseaseRecords); // lấy toàn bộ danh sách mắc bệnh truyền nhiễm
router.get(
  "/:student_id/infectious-record",
  getInfectiousDiseaseRecordsOfStudent
);

router.get("/chronic-record", getAllChronicDiseaseRecords); // lấy toàn bộ danh sách mắc bệnh mãn tính
router.get("/:student_id/chronic-record", getChronicDiseaseRecordsOfStudent);

router.get("/student/:student_id/disease-record", getDiseaseRecordsOfStudent); // list toàn bộ bệnh của một học sinh
router.get("/:student_id/disease-record", getDiseaseRecordsOfStudent); // parent list toàn bộ bệnh của một học sinh
router.get("/disease-record", getAllDiseaseRecords); // lấy toàn bộ danh sách bệnh của tất cả học sinh

router.post("/student/:student_id/disease-record", createDiseaseRecord); // tạo mới bệnh cho cả truyền nhiễm và mãn tính
router.patch("/disease-record/:id/accept", acceptDiseaseRecord);
router.patch("/disease-record/:id/refuse", refuseDiseaseRecord);
router.get("/disease-record/requests", getAllDiseaseRecordsRequested);
router.get(
  "/disease-record/:student_id/requests",
  getDiseaseRecordsRequestedByStudentID
);

router.get(
  "/disease-record/:student_id/requestsHistory", // lấy ra lịch sử khai báo bệnh của một học sinh xem đơn đã được duyệt hay chưa
  getDiseaseDeclarationsHistoryByStudentID
);

router.get(
  "/disease-record/requestsHistory", // lấy ra lịch sử khai báo bệnh của tất cả học sinh xem đơn đã được duyệt hay chưa
  getDiseaseDeclarationsHistory
);

// router.patch("/student/:id/disease-record", updateDiseaseRecord); // update disease record

export default router;
