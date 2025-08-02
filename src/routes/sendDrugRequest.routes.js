import express from 'express';
import {
      createRequest,
      acceptRequest,
      refuseRequest,
      cancelRequest,
      receiveDrug,
      doneTakingMedicine,
      retrieveRequestByID,
      listRequests,
      getSendDrugRequestsOfStudent,
      handleUploadPrescriptionImgs,
      updateRequest,
      tickForSuccessMedicationTaking,
      untickForSuccessMedicationTaking,
      listMedicationScheduleDays,
      getMedicationScheduleByDay,
      getMedicationScheduleDaysByStudent,
      getStudentMedicationScheduleByDay
} from '../controllers/sendDrugRequest.controller.js';

const router = express.Router();

router.post('/send-drug-request', createRequest); // done mới tạo đơn gửi thuốc và các đơn vị thuốc cần uống, có thể update (nhưng mà chưa tạo lịch uống)
router.patch('/send-drug-request/:id/accept', acceptRequest); // done
router.patch('/send-drug-request/:id/refuse', refuseRequest); // done
router.patch('/send-drug-request/:id/cancel', cancelRequest); // done
router.patch('/send-drug-request/:id/receive', receiveDrug); // done thông báo đã nhận thuốc và bắt đầu tạo lịch uống
router.patch('/send-drug-request/:id/done', doneTakingMedicine); // done đã cho uống thành công (hết thuốc uống..)
router.get('/send-drug-request/:id', retrieveRequestByID); // done
router.get('/student/:student_id/send-drug-request', getSendDrugRequestsOfStudent); // done
router.post('/upload-prescription-imgs', handleUploadPrescriptionImgs); // done
router.get('/send-drug-request', listRequests); // done 
router.patch('/send-drug-request/:id', updateRequest); // done

// lich uong thuoc

// admin, nurse
router.get('/medication-schedule-days', listMedicationScheduleDays); // list những ngày nào cần cho uống thuốc + tổng số đơn thuốc + tổng số đơn thuốc đã cho uống 
router.get('/medication-schedule-by-day', getMedicationScheduleByDay); // xem toàn bộ các lịch cho uống thuốc trong ngày, chia và sắp xếp thành 3 key chính theo MORNING --> MIDDAY --> AFTERNOON + sort theo student_id

// parent
// --- list theo học sinh (lấy tất cả lịch của all đơn gửi)
router.get('/student/:id/medication-schedule-days', getMedicationScheduleDaysByStudent);
router.get('/student/:id/medication-schedule-by-day', getStudentMedicationScheduleByDay);

// admin, nurse cập nhật record uống thuốc
router.patch('/medication-schedule/:id/tick', tickForSuccessMedicationTaking); // done update thông tin record cho uống thuốc (cần có id, note và intake_time (timestamp))
router.patch('/medication-schedule/:id/untick', untickForSuccessMedicationTaking); // done update thông tin record cho uống thuốc set is_taken thanh false note/intake_time thafnh null ht

export default router;