import express from 'express';
import {
      createNurse, createAdmin, createParent, createStudent, getAdminProfileByID, getNurseProfileByID, getParentProfileByID, getStudentProfileByID, getUserProfileByUUID,
      listAdmins, listNurses, listStudents, listParents, listStudentsByClass, listStudentsByGrade,
      assignParents, removeMomFromStudent, removeDadFromStudent,
      editUserInfoByAdmin,
      handleUploadProfileImg,
      handleConfirmEmailForUser,
      handleUnconfirmEmailForUser,
      deleteAdmin, deleteNurse, deleteParent, deleteStudent,
      handleDownloadUsers,
      handleUploadStudent,
      handleUploadParent,
      handleUploadAdmin,
      handleUploadNurse,
      handleGetStudentImportSample,
      handleGetParentImportSample,
      handleGetNurseImportSample,
      handleGetAdminImportSample,
      handleSendingInvitationToEmails

} from '../controllers/users.controller.js';

const router = express.Router();

router.post('/parent', createParent);
router.post('/student', createStudent);
router.post('/admin', createAdmin);
router.post('/nurse', createNurse);

router.get("/user/:supabase_uid/role/:role/profile", getUserProfileByUUID);

router.get("/admin/:admin_id", getAdminProfileByID);
router.get("/nurse/:nurse_id", getNurseProfileByID);
router.get('/parent/:parent_id', getParentProfileByID); // contains self-info and array of their children's profiles
router.get('/student/:student_id', getStudentProfileByID); // contains self-info and array of their parent's profiles

// list all admin, user, or parent,...
router.get("/admin", listAdmins);
router.get("/nurse", listNurses);
router.get("/parent", listParents);
router.get("/student", listStudents);
router.get("/class/:class_id/student", listStudentsByClass); // list student in a class
router.get("/grade/:grade_id/student", listStudentsByGrade); // list student in a class

// link parent and student
router.patch('/parent/connect-students', assignParents); // link mom and dad to a list of students
router.delete("/student/:student_id/mom", removeMomFromStudent); // delete mom 
router.delete("/student/:student_id/dad", removeDadFromStudent); // delete dad 

// update thông tin cá nhân (chỉ có luồng cập nhật các trường thông tin bình thường, không cho cập nhật email)
router.patch("/admin/:admin_id/profile"); // chua
router.patch("/nurse/:nurse_id/profile"); // chua
router.patch("/student/:student_id/profile"); // chua
router.patch("/parent/:parent_id/profile"); // chua

// parent cập nhật email cho con thì sẽ cần phải xác thực email trước (bằng otp)
// chú ý nếu con đã có tài khoản thì sẽ khôgn cho cập nhật nữa
router.post("/register-email-for-student/:student_id"); // cần truyền vào otp, email sau đó hệ thống sẽ tạo tài khoản
// check otp và email

// update thông tin cá nhân cho các role với admin, được quyền cập nhật all info
router.patch("/admin/edit-user-profile", editUserInfoByAdmin); // chua


// delete một user
router.delete("/admin/:admin_id", deleteAdmin);
router.delete("/nurse/:nurse_id", deleteNurse);
router.delete("/parent/:parent_id", deleteParent);
router.delete("/student/:student_id", deleteStudent);
// note, please do not delete these user:
/*
    'mndkhanh@gmail.com',
    'mndkhanh3@gmail.com',
    'coccamco.fpthcm@gmail.com',
    'thuandntse150361@fpt.edu.vn',
    'dinhviethieu2910@gmail.com',
    'toannangcao3000@gmail.com',
    'phamthanhqb2005@gmail.com',
    'dathtse196321@gmail.com',
    'mndkhanh.alt3@gmail.com',
    'mndkhanh.alt@gmail.com'
 */

// xử lý upload ảnh và trả về profile_img_url, đầu vào là một form data img
router.post("/profile-img", handleUploadProfileImg);


// route để gửi link mời tham gia hệ thống
router.post("/send-invites", handleSendingInvitationToEmails);


router.patch("/role/:role/user/:user_id/confirm-email", handleConfirmEmailForUser); // lần đăng nhập đầu tiên sẽ xác thực
router.patch("/role/:role/user/:user_id/unconfirm-email", handleUnconfirmEmailForUser); // nếu admin có đổi email trên dashboard sẽ chuyển thành unconfirmed



// route để xuất nhập file excel
router.get("/download-users", handleDownloadUsers); // lấy toàn bộ admin, nurse, student, parent vào chung 1 file excel chia thành từng sheet
router.post("/upload-admin-excel", handleUploadAdmin); // trả về file result để xem trạng thái tạo user của từng dòng
router.post("/upload-nurse-excel", handleUploadNurse); // trả về file result để xem trạng thái tạo user của từng dòng
router.post("/upload-parent-excel", handleUploadParent); // trả về file result để xem trạng thái tạo user của từng dòng
router.post("/upload-student-excel", handleUploadStudent); // trả về file result để xem trạng thái tạo user của từng dòng
// route để lấy mẫu nhập liệu
router.get("/admin-import-sample", handleGetAdminImportSample); // lấy file excel mẫu để import admin, 
router.get("/nurse-import-sample", handleGetNurseImportSample); // lấy file excel mẫu để import nurse, 
router.get("/parent-import-sample", handleGetParentImportSample); // lấy file excel mẫu để import parent,
router.get("/student-import-sample", handleGetStudentImportSample); // lấy file excel mẫu để import student



export default router;
