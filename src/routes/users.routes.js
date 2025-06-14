import express from 'express';
import { getStudentProfileByUUID, getChildrenProfilesOfAParent, getParentProfileByID, getStudentProfileByID } from '../controllers/users.controller.js';

const router = express.Router();

// router.post('/parent', createParent);
// router.post('/student', createStudent);
// router.post('/admin', createAdmin);
// router.post('/nurse', createNurse);




router.get('/parent/:parent_id/student', getChildrenProfilesOfAParent);
router.get('/student/:student_id', getStudentProfileByID);
router.get('/student/uuid/:supabase_student_uid', getStudentProfileByUUID);
router.get('/parent/:parent_id', getParentProfileByID);


export default router;
