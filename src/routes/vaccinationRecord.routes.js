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
  getVaccinationRecordsRequestedByStudentID,
  getAllVaccinationRecordsRequested,
  getAllMedicalRecordsRequestedBuStudentID,
  getAllMedicalRecordsRequested,
  getVaccinationDeclarationsHistoryByStudentID,
  getVaccinationDeclarationsHistory,
} from "../controllers/vaccinationRecord.controller.js";

const router = express.Router();

router.get(
  "/student/:student_id/vaccination-record",
  getVaccinationRecordsByStudentID
);
router.get("/student/:student_id/disease/vaccination-record", (req, res) => {
  const { student_id } = req.params;
  const { diseaseId } = req.query; // diseaseId sẽ là mảng ["1", "2", "3"] hoặc chuỗi nếu chỉ có một giá trị

  // Chuyển đổi thành mảng nếu cần
  const diseaseIds = Array.isArray(diseaseId)
    ? diseaseId.map((id) => parseInt(id))
    : [parseInt(diseaseId)];

  // Xử lý logic
  getVaccinationRecordsOfAStudentBasedOnADisease(req, res, diseaseIds);
});
router.post("/vaccination-record", createVaccinationRecord);
// router.patch("/vaccination-record/:record_id", updateVaccinationRecord);
router.get("/vaccination-record/:id", getVaccinationRecordByID);

router.patch("/vaccination-record/:id/accept", acceptVaccinationRecord);
router.patch("/vaccination-record/:id/refuse", refuseVaccinationRecord);
router.get(
  "/parent/vaccination-record/:student_id/requests", // Lấy ra tất cả các khai báo vaccine chưa được duyệt của một học sinh
  getVaccinationRecordsRequestedByStudentID
);
router.get("/vaccination-record/requests", getAllVaccinationRecordsRequested); // Lấy ra tất cả các khai báo vaccine chưa được duyệt của một học sinh
router.get("/:student_id/requests", getAllMedicalRecordsRequestedBuStudentID);
router.get("/requests", getAllMedicalRecordsRequested);
router.get(
  "/vaccination-record/:student_id/requests/history", // lấy ra lịch sử khai báo vaccine của một học sinh xem đơn đã được duyệt hay chưa
  getVaccinationDeclarationsHistoryByStudentID
);
router.get(
  "/vaccination-record/requests/history", // lấy ra lịch sử khai báo vaccine của tất cả học sinh xem đơn đã được duyệt hay chưa
  getVaccinationDeclarationsHistory
);
export default router;
