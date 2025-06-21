import express from 'express';
import { createNurse, createAdmin, createParent, createStudent, getAdminProfileByID, getNurseProfileByID, getParentProfileByID, getStudentProfileByID } from '../controllers/users.controller.js';

const router = express.Router();

router.post('/parent', createParent);
router.post('/student', createStudent);
router.post('/admin', createAdmin);
router.post('/nurse', createNurse);

// get parent that not have any managed kids in the system
// get student that not under supervision of any parent



router.get("/admin/:admin_id", getAdminProfileByID);
router.get("/nurse/:nurse_id", getNurseProfileByID);
router.get('/parent/:parent_id', getParentProfileByID); // contains self-info and array of their children's profiles
router.get('/student/:student_id', getStudentProfileByID); // contains self-info and array of their parent's profiles


export default router;
