import express from 'express';
import {
      getInfoOfGrades,
      getClassesInfoOfGradeByID,
      getInfoOfClasses,
}
      from '../controllers/student.controller.js';

const router = express.Router();


router.get('/grade', getInfoOfGrades);
router.get('/grade/:grade_id/class', getClassesInfoOfGradeByID);

router.get('/class', getInfoOfClasses);


export default router;
