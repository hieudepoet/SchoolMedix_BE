import express from 'express';
import {
      getInfoOfClasses,
      getInfoOfClassByID
}
      from '../controllers/student.controller.js';

const router = express.Router();


// router.get('/grade', getInfoOfGrades);
// router.get('/grade/:grade_id/class', getClassesInfoOfGradeByID);

router.get('/class', getInfoOfClasses);
router.get('/class/:id/student', getInfoOfClassByID);


export default router;
