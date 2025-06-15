import express from 'express';
import {
      

}
        from '../controllers/diseaseRecord.controller.js';

const router = express.Router();

router.post('/student/:student_id/disease-record', ); // tạo mới bệnh
router.get("/student/:student_id/disease-record", ); // list toàn bộ bệnh của một học sinh

export default router;
