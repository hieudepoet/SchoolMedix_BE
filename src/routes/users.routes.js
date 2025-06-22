import express from 'express';
import {
      createNurse, createAdmin, createParent, createStudent, getAdminProfileByID, getNurseProfileByID, getParentProfileByID, getStudentProfileByID,
      listAdmins, listNurses, listStudents, listParents,
      assignParents, removeMomFromStudent, removeDadFromStudent,
      handleUpdatePassword, handleLogIn, handleLogOut

} from '../controllers/users.controller.js';

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

// list all admin, user, or parent,...
router.get("/admin", listAdmins);
router.get("/nurse", listNurses);
router.get("/parent", listParents);
router.get("/student", listStudents);

// link parent and student
router.patch('/parent/connect-students', assignParents); // link mom and dad to a list of students
router.delete("/student/:student_id/mom", removeMomFromStudent); // delete mom 
router.delete("/student/:student_id/dad", removeDadFromStudent); // delete dad

// update thông tin cá nhân
router.patch("/admin/:admin_id"); //
router.patch("/nurse/:nurse_id"); //
router.patch("/student/:student_id"); //
router.patch("/parent/:parent_id"); //


// delete một user
router.delete("/admin/:admin_id"); //
router.delete("/nurse/:nurse_id"); //
router.delete("/parent/:parent_id"); //
router.delete("/student/:student_id"); //


// handle account: login, logout, reset password,...
router.post("/update-password", handleUpdatePassword); //
router.post("/log-in", handleLogIn); //
router.post("/log-out", handleLogOut); //

export default router;
