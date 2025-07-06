import express from "express";
import {
        cancelRegister,
        closeRegister,
        createCampaign,
        getCheckupRegisterByParentID,
        updateHealthRecord,
        submitRegister,
        getCheckupRegisterStudent,
        getHealthRecordsOfAStudent,
        getHealthRecordStudent,
        getCheckupRegisterByStudentID,
        getAllCheckupCampaigns,
        getALLHealthRecord,
        getALLRegisterByCampaignID,
        getALLSpeciaListExamRecord,
        UpdateCheckinHealthRecord,
        UpdateCheckinSpecialRecord,
        getHealthRecordParentDetails,
        getSpecialRecordParent,
        getSpecialRecordParentDetails,
        startCampaig,
        finishCampaign,
        getCampaignDetail,
        getRegisterID,
        getRegisterStatus,
        getALLHealthRecordOfACampaign,
        completeAHealthRecordForStudent,
        getALLSpeciaListExams,
        getAllRecordsOfEachSpeExamInACampaign,
        completeARecordForSpeExam,
        handleUploadHealthRecordResult,
        handleRetrieveHealthRecordResultByCampaignID,
        handleRetrieveSampleImportHealthRecordForm,
        getSpecialRecordsOfAStudent,
        getFullHealthAndSpecialRecordsOfAStudent,
        sendRegister,
        updateCampaign,
        getAllHealthRecordOfStudent
} from "../controllers/checkUp.controller.js";

const router = express.Router();
//Orther


router.post('/checkup/:campaign_id/send-register', sendRegister);//Truyền vào ID Campaign để gửi Register cho phụ huynh
router.put('/checkup/:campaign_id/update-info', updateCampaign);//Truyền vào ID Campaign để Update thông tin Campaign

router.get('/health-record/:student_id',getAllHealthRecordOfStudent); //Truyền vào Student_id lấy tất cả ds healthrecord của Student


router.get('/checkup/campaign_id/:campaign_id/student_id/:student_id', getRegisterID); //Lấy Register ID 
router.get('/checkup/survey/status', getRegisterStatus);//Lay Register Status

router.get("/health-record", getALLHealthRecord); // Lấy tất cả DS Health Record có status DONE // bỏ cái check done đi anh ui
router.get("/special-record", getALLSpeciaListExamRecord); //Lấy tất cả SpeciaListExamRecord có status DONE // bỏ cái check done đi anh ui

router.get("/health-record/campaign/:campaign_id", getALLHealthRecordOfACampaign); // Lấy tất cả DS Health Record có status DONE // bỏ cái check done đi anh ui
router.patch("/health-record/:id/done", completeAHealthRecordForStudent)

router.get('/checkup-register/:id', getALLRegisterByCampaignID);//Lấy tất cả các CheckUp register cần tuyền vào campaign_id 

router.get('/checkup-register/parent/:id', getCheckupRegisterByParentID);   //Lấy các CheckUpRegister và speciallistexamrecord từ parent_id
router.get('/checkup-register/student/:id', getCheckupRegisterByStudentID);   //Lấy các CheckUpRegister và speciallistexamrecord từ Student_id 

router.get("/parent/:parent_id/checkup-register", getCheckupRegisterByParentID); //Lấy các CheckUpRegister và speciallistexamrecord từ parent_id
router.get("/student/:student_id/checkup-register", getCheckupRegisterByStudentID
); //Lấy các CheckUpRegister và speciallistexamrecord từ Student_id

router.get("/checkup-campaign-detail/:id", getCampaignDetail); //Lấy Campain Detail truyền vào campaign_id (P)

//Admin
router.post("/checkup-campaign", createCampaign); // admin tạo campaign
router.get("/checkup-campaign", getAllCheckupCampaigns); // lấy tất cả DS campaign
router.patch("/checkup-campaign/:id/close", closeRegister); // Amdin đóng form Register
router.patch("/checkup-campaign/:id/cancel", cancelRegister); //Admin cancel form Register

router.patch("/checkup-campaign/:id/start", startCampaig); // Admin start campaign ( status : ONGOING) truyền vào body campaign_id
router.patch("/checkup-campaign/:id/finish", finishCampaign); //Admin finish Campaign ( status : DONE) truyền vào body campaign_id

//Parent
router.patch("/checkup-register/:id/submit", submitRegister); // Parent submit form Register

router.get("/student/:id/checkup-health-record", getHealthRecordsOfAStudent);
router.get("/student/:id/specialist-record", getSpecialRecordsOfAStudent);
router.get("/student/:id/full-record", getFullHealthAndSpecialRecordsOfAStudent);
router.get("/checkup-health-record/detail", getHealthRecordParentDetails); //Parenet xem chi tiết Health Record của Student truyền vào health_reocd_id

router.get("/checkup-special-record", getSpecialRecordParent); // Parent xem tất cả Special Record của Student truyền vào body Student_id
router.get("/checkup-special-record/detail", getSpecialRecordParentDetails); //paretn xem chi tiết Special Record  truyền vào register_id và spe_exam_id

//Nurse

//CHECK-IN
router.patch('/checkup-checkin/register_id/:register_id/campaign/:campaign_id/', UpdateCheckinHealthRecord);//Nurse Checkin Khám Định kỳ cần truyền vào Student_id và Campain_id trong body
router.patch('/checkup-checkin/special-record', UpdateCheckinSpecialRecord); //Nurse Checkin Khám Chuyên khoa truyền vào student_id,campaign_id,spex_exam_id

router.patch('/checkup/:id/record', updateHealthRecord) // Doctor or Nurse update Heatlh Record for Student
router.get('/checkup-register/student/:id', getCheckupRegisterStudent);  // Student lấy các lịch sử registers
router.get('/health-record/campaign/:campaign_id/student/:student_id', getHealthRecordStudent);//Student view Health Record

router.get("/specialist-exam", getALLSpeciaListExams); // lất toàn bộ các chuyên môn khám có sẵn

router.get("/campaign/:campaign_id/specialist-exam/record", getAllRecordsOfEachSpeExamInACampaign); //

router.patch("/checkup-register/:register_id/specialist-exam/:spe_exam_id/done", completeARecordForSpeExam);

// duy khanh
router.post("/campaign/:campaign_id/upload-health-record-result", handleUploadHealthRecordResult); //excel upload file then retrieve each row to update record result_url
router.get("/campaign/:campaign_id/import-health-record-form", handleRetrieveSampleImportHealthRecordForm); // trả về form gồm tất cả các record của một chiến dịch để làm smaple mẫu cho nurse cập nhật thông tin khám
router.get("/campaign/:campaign_id/download-health-record-result", handleRetrieveHealthRecordResultByCampaignID);


export default router;
