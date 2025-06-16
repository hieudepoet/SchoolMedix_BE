import express from 'express';
import { createNurse, createAdmin, getChildrenProfilesOfAParent, getStudentProfileByID } from '../controllers/users.controller.js';

const router = express.Router();

// router.post('/parent', createParent);
// router.post('/student', createStudent);
router.post('/admin', createAdmin);
router.post('/nurse', createNurse);

// get parent that not have any managed kids in the system
// get student that not under supervision of any parent




router.get('/parent/:parent_id/student', getChildrenProfilesOfAParent); // contains only array of their children's profiles
router.get('/student/:student_id', getStudentProfileByID);


export default router;
