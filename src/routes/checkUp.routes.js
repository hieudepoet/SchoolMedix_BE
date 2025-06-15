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

}
        from '../controllers/checkUp.controller.js';

const router = express.Router();

router.post('/checkup-campaign', createCampaign); // admin tạo campaign

router.get('/parent/:parent_id/checkup-register', getCheckupRegisterByParentID);   //Lấy các CheckUpRegister và speciallistexamrecord từ parent_id
router.get('/student/:student_id/checkup-register', getCheckupRegisterByStudentID);   //Lấy các CheckUpRegister và speciallistexamrecord từ Student_id 

router.patch('/checkup-register/:id/submit', submitRegister);// Parent nhập form Register
router.patch('/checkup-register/:id/close', closeRegister);// Amdin đóng form Register
router.patch('/checkup-register/:id/cancel', cancelRegister) //Admin cancel form Register

router.patch('/checkup-register/register_id/record', updateHealthRecord) // Doctor or Nurse update Heatlh Record for Student
router.get('/checkup-register/student/:id', getCheckupRegisterStudent);  // Student lấy các lịch sử registers
router.get('/checkup-campaign/:campaign_id/health-record/parent/:parent_id/', getHealthRecordParent); //Parent xem HealthRecord của Student cần truyền vào parent_id và campaign_id
router.get('/health-record/campaign/:campaign_id/student/:student_id', getHealthRecordStudent);//Student view Health Record


export default router;
