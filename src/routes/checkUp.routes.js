import express from 'express';
import {
        cancelRegister,
        closeRegister,
        createCampaign,
        getCheckupRegisterParent,
        updateHealthRecord,
        submitRegister,
        getCheckupRegisterStudent,
        getHealthRecordParent,
        getHealthRecordStudent,

}
        from '../controllers/checkUp.controller.js';

const router = express.Router();

router.post('/checkup', createCampaign); // admin tạo campaign
router.get('/checkup-register/parent/:id', getCheckupRegisterParent);   //Lấy các CheckUpRegister và speciallistexamrecord từ Student_id có status là PENDING
router.patch('/checkup-register/:id/submit', submitRegister);// Parent nhập form Register
router.patch('/checkup-register/:id/close', closeRegister);// Amdin đóng form Register
router.patch('/checkup-register/:id/cancel', cancelRegister) //Admin cancel form Register
router.patch('/checkup-register/record', updateHealthRecord) // Doctor or Nurse update Heatlh Record for Student
router.get('/checkup-register/student/:id', getCheckupRegisterStudent);  // Student lấy các lịch sử registers
router.get('/checkup/campaign/:campaign_id/health-record/parent/:parent_id/', getHealthRecordParent); //Parent xem HealthRecord của Student cần truyền vào parent_id và campaign_id
router.get('/health-record/campaign/:campaign_id/student/:student_id', getHealthRecordStudent);//Student view Health Record


export default router;
