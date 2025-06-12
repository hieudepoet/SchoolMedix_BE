import express from 'express';
import { createParent, createStudent, createAdmin, createNurse, getChildrenOfAParent, getParentByID, getStudentByID } from '../controllers/users.controller.js';

const router = express.Router();

router.post('/parent', createParent);
router.post('/student', createStudent);
router.post('/admin', createAdmin);
router.post('/nurse', createNurse);




router.get('/parent/:parent_id/student', getChildrenOfAParent);



router.get('/student/:student_id', getStudentByID);
router.get('/parent/:parent_id', getParentByID);


export default router;
