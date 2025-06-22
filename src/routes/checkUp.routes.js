import express from 'express';
import {
        cancelRegister,
        closeRegister,
        createCampaign,
        getCheckupRegisterByParentID,
        updateHealthRecord,
        submitRegister,
        getCheckupRegisterStudent,
        getHealthRecordParent,
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
        getCampaignDetail
}
        from '../controllers/checkUp.controller.js';

const router = express.Router();
//Orther
router.get('/health-record',getALLHealthRecord);// Lấy tất cả DS Health Record có status DONE 
router.get('/special-record',getALLSpeciaListExamRecord); //Lấy tất cả SpeciaListExamRecord có status DONE
router.get('/checkup-register/:id',getALLRegisterByCampaignID);//Lấy tất cả các CheckUp register cần tuyền vào campaign_id 
router.get('/parent/:parent_id/checkup-register', getCheckupRegisterByParentID);   //Lấy các CheckUpRegister và speciallistexamrecord từ parent_id
router.get('/student/:student_id/checkup-register', getCheckupRegisterByStudentID);   //Lấy các CheckUpRegister và speciallistexamrecord từ Student_id 

router.get('/checkup-campaign/detail',getCampaignDetail);//Lấy Campain Detail truyền vào campaign_id (P)

//Admin
router.post('/checkup-campaign', createCampaign); // admin tạo campaign
router.get('/checkup-campaign', getAllCheckupCampaigns); // lấy tất cả DS campaign
router.patch('/checkup-campaign/:id/close', closeRegister);// Amdin đóng form Register
router.patch('/checkup-campaign/:id/cancel', cancelRegister) //Admin cancel form Register


router.patch('/checkup-campaign/start',startCampaig); // Admin start campaign ( status : ONGOING) truyền vào body campaign_id
router.patch('/checkup-campaign/finish',finishCampaign); //Admin finish Campaign ( status : DONE) truyền vào body campaign_id



//Parent
router.patch('/checkup-register/:id/submit', submitRegister);// Parent submit form Register

router.get('/checkup-health-record', getHealthRecordParent); //Parent xem tất cả Health Record của Student truyền vào body Student_id
router.get('/checkup-health-record/detail',getHealthRecordParentDetails);//Parenet xem chi tiết Health Record của Student truyền vào health_reocd_id

router.get('/checkup-special-record',getSpecialRecordParent); // Parent xem tất cả Special Record của Student truyền vào body Student_id
router.get('/checkup-special-record/detail',getSpecialRecordParentDetails); //paretn xem chi tiết Special Record  truyền vào register_id và spe_exam_id




//Nurse

//CHECK-IN
router.patch('/checkup-checkin/health-record',UpdateCheckinHealthRecord);//Nurse Checkin Khám Định kỳ cần truyền vào Student_id và Campain_id trong body
router.patch('/checkup-checkin/special-record',UpdateCheckinSpecialRecord); //Nurse Checkin Khám Chuyên khoa



router.patch('/checkup/:id/record', updateHealthRecord) // Doctor or Nurse update Heatlh Record for Student
router.get('/checkup-register/student/:id', getCheckupRegisterStudent);  // Student lấy các lịch sử registers
router.get('/health-record/campaign/:campaign_id/student/:student_id', getHealthRecordStudent);//Student view Health Record


export default router;
