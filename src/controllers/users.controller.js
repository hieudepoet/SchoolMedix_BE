import { supabaseAdmin, supabaseClient } from "../config/supabase.js";
import multer from "multer";

import {
      createNewAdmin, createNewNurse, createNewParent, createNewStudent, getProfileOfAdminByID, getProfileOfNurseByID, getProfileOfParentByID, getProfileOfStudentByID,
      getAllAdmins,
      getAllNurses,
      getAllParents,
      getAllStudents,
      getAllStudentsByClassID,
      getAllStudentsByGradeID,
      linkParentsAndStudents,
      removeDadByStudentId,
      removeMomByStudentId,
      confirmEmailFor,
      editUserProfileByAdmin,
      uploadFileToSupabaseStorage,
      getProfileByUUID,
      deleteAuthUser, deleteUserByID,
      generateAdminImportTemplate,
      getSupabaseUIDOfAUser,
      unconfirmEmailFor,
      sendInviteLinkToEmails,
      generateImportTemplate,
      excelToJson,
      insertAdmin,
      exportExcelToBuffer,
      insertStudent,
      insertNurse,
      insertParent,
      addSheetToBuffer,
      sendOTPEmail,
      getUserByEmail,
      generateRecoveryLink,
      sendRecoveryLinkEmailForForgotPassword,
      updateLastInvitationAtByUUID,
      deleteAccount,
      createSupabaseAuthUserWithRole,
      updateEmailForSupabaseAuthUser,
      generateResetPasswordLink,
      sendResetPassMail,
      deleteAuthUsers,
      insertParentWithClient,
      insertStudentWithClient,
      updateLastInvitationAtByUUIDWithClient


} from "../services/index.js";

import ExcelJS from 'exceljs';
import { pool, query } from "../config/database.js";
import { hasUsingOTP, insertNewOTP, updateOTPHasBeenUsed, verifyOTP } from "../services/otp/index.js";
import { updateProfileFor } from "../services/users/userUtils.js";


export async function createAdmin(req, res) {
      try {
            const {
                  email,
                  name,
                  dob,
                  isMale,
                  address,
                  phone_number,
                  profile_img_url,
            } = req.body;

            // Validate bắt buộc
            if (!name) {
                  return res.status(400).json({ error: true, message: "Thiếu họ và tên." });
            }
            if (!dob) {
                  return res.status(400).json({ error: true, message: "Thiếu ngày sinh." });
            }
            if (!isMale) {
                  return res.status(400).json({
                        error: true,
                        message: "Thiếu giới tính.",
                  });
            }
            if (!address) {
                  return res.status(400).json({ error: true, message: "Thiếu địa chỉ." });
            }

            const newAdmin = await createNewAdmin(
                  email,
                  name,
                  dob,
                  isMale,
                  address,
                  phone_number,
                  profile_img_url || process.env.DEFAULT_AVATAR_URL
            );

            return res.status(201).json({
                  error: false,
                  message: "Tạo tài khoản admin thành công",
                  data: newAdmin,
            });
      } catch (err) {
            console.error("❌ Lỗi khi tạo admin:", err.message);
            return res.status(500).json({
                  error: true,
                  message: err.message
            });
      }
}

export async function createNurse(req, res) {
      try {
            const {
                  email,
                  name,
                  dob,
                  isMale,
                  address,
                  phone_number,
                  profile_img_url,
            } = req.body;

            // Validate bắt buộc
            if (!name) {
                  return res.status(400).json({ error: true, message: "Thiếu họ và tên." });
            }
            if (!dob) {
                  return res.status(400).json({ error: true, message: "Thiếu ngày sinh." });
            }
            if (!isMale) {
                  return res.status(400).json({
                        error: true,
                        message: "Thiếu giới tính.",
                  });
            }
            if (!address) {
                  return res.status(400).json({ error: true, message: "Thiếu địa chỉ." });
            }

            const newNurse = await createNewNurse(
                  email,
                  name,
                  dob,
                  isMale,
                  address,
                  phone_number,
                  profile_img_url
            );

            return res.status(201).json({
                  error: false,
                  message: "Tạo tài khoản nurse thành công",
                  data: newNurse,
            });
      } catch (err) {
            console.error("❌ Lỗi khi tạo nurse:", err.message);
            return res.status(500).json({
                  error: true,
                  message: err.message
            });
      }
}

export async function createParent(req, res) {
      try {
            const {
                  email,
                  name,
                  dob,
                  isMale,
                  address,
                  phone_number,
                  profile_img_url,
            } = req.body;

            // Validate bắt buộc
            if (!name) {
                  return res.status(400).json({ error: true, message: "Thiếu họ và tên." });
            }
            if (!dob) {
                  return res.status(400).json({ error: true, message: "Thiếu ngày sinh." });
            }
            if (!isMale) {
                  return res.status(400).json({
                        error: true,
                        message: "Thiếu giới tính.",
                  });
            }
            if (!address) {
                  return res.status(400).json({ error: true, message: "Thiếu địa chỉ." });
            }

            const newNurse = await createNewParent(
                  email,
                  name,
                  dob,
                  isMale,
                  address,
                  phone_number,
                  profile_img_url
            );

            return res.status(201).json({
                  error: false,
                  message: "Tạo tài khoản parent thành công",
                  data: newNurse,
            });
      } catch (err) {
            console.error("❌ Lỗi khi tạo parent:", err.message);
            return res.status(500).json({
                  error: true,
                  message: err.message
            });
      }
}

export async function createStudent(req, res) {
      try {
            const {
                  email,
                  name,
                  dob,
                  isMale,
                  address,
                  phone_number,
                  profile_img_url,
                  class_id,
                  year_of_enrollment,
                  mom_id,
                  dad_id
            } = req.body;

            // Validate bắt buộc
            if (!name) {
                  return res.status(400).json({ error: true, message: "Thiếu họ và tên." });
            }
            if (!dob) {
                  return res.status(400).json({ error: true, message: "Thiếu ngày sinh." });
            }
            if (!isMale) {
                  return res.status(400).json({
                        error: true,
                        message: "Thiếu giới tính.",
                  });
            }
            if (!address) {
                  return res.status(400).json({ error: true, message: "Thiếu địa chỉ." });
            }
            if (!year_of_enrollment) {
                  return res.status(400).json({ error: true, message: "Thiếu năm bắt đầu niên khóa." });
            }
            if (!class_id) {
                  return res.status(400).json({ error: true, message: "Thiếu id lớp." });
            }


            const newStudent = await createNewStudent(
                  email,
                  name,
                  dob,
                  isMale,
                  address,
                  phone_number,
                  profile_img_url,
                  class_id,
                  year_of_enrollment,
                  mom_id,
                  dad_id
            );

            return res.status(201).json({
                  error: false,
                  message: "Tạo tài khoản student thành công",
                  data: newStudent,
            });
      } catch (err) {
            console.error("❌ Lỗi khi tạo student:", err.message);
            return res.status(500).json({
                  error: true,
                  message: err.message
            });
      }
}

export async function getUserProfileByUUID(req, res) {
      const { supabase_uid, role } = req.params;

      if (!supabase_uid) {
            return res.status(400).json({ error: true, message: "Thiếu supabase_uid!" });
      }

      try {
            const profile = await getProfileByUUID(role, supabase_uid);

            if (!profile) {
                  return res.status(400).json({ error: true, message: "Không tìm thấy hồ sơ." });
            }

            return res.status(200).json({ error: false, data: profile });
      } catch (err) {
            console.error("Lỗi khi lấy thông tin user:", err);
            return res.status(500).json({ error: true, message: "Lỗi server!" });
      }
}

export async function getAdminProfileByID(req, res) {
      const { admin_id } = req.params;

      if (!admin_id) {
            return res
                  .status(400)
                  .json({ error: true, message: "Thiếu admin id!" });
      }

      try {
            const admin = await getProfileOfAdminByID(admin_id);
            if (!admin) {
                  return res
                        .status(400)
                        .json({ error: true, message: "Không tìm thấy admin!" });
            }

            return res
                  .status(200)
                  .json({ error: false, data: admin });
      } catch (err) {
            console.error("Lỗi khi lấy thông tin admin:", err);
            return res
                  .status(500)
                  .json({ error: true, message: "Lỗi server!" });
      }
}

export async function getNurseProfileByID(req, res) {
      const { nurse_id } = req.params;

      if (!nurse_id) {
            return res
                  .status(400)
                  .json({ error: true, message: "Thiếu nurse id!" });
      }

      try {
            const nurse = await getProfileOfNurseByID(nurse_id);
            if (!nurse) {
                  return res
                        .status(400)
                        .json({ error: true, message: "Không tìm thấy nurse!" });
            }

            return res
                  .status(200)
                  .json({ error: false, data: nurse });
      } catch (err) {
            console.error("Lỗi khi lấy thông tin nurse:", err);
            return res
                  .status(500)
                  .json({ error: true, message: "Lỗi server!" });
      }
}

export async function getParentProfileByID(req, res) {
      const { parent_id } = req.params;

      if (!parent_id) {
            return res
                  .status(400)
                  .json({ error: true, message: "Thiếu parent id!" });
      }

      try {
            const parent = await getProfileOfParentByID(parent_id);
            if (!parent) {
                  return res
                        .status(404)
                        .json({ error: true, message: "Không tìm thấy phụ huynh!" });
            }

            return res
                  .status(200)
                  .json({ error: false, data: parent });
      } catch (err) {
            console.error("Lỗi khi lấy thông tin phụ huynh:", err);
            return res
                  .status(500)
                  .json({ error: true, message: "Lỗi server!" });
      }
}

export async function getStudentProfileByID(req, res) {
      const { student_id } = req.params;

      if (!student_id) {
            return res.status(400).json({ error: true, message: "Thiếu ID học sinh" });
      }

      try {
            // Lấy thông tin liên kết
            const student = await getProfileOfStudentByID(student_id);

            if (!student) {
                  return res
                        .status(404)
                        .json({ error: false, message: "Không tìm thấy học sinh với ID này" });
            }

            return res.status(200).json({
                  error: false,
                  message: "Lấy thông tin học sinh thành công",
                  data: student,
            });
      } catch (err) {
            console.error("Lỗi khi lấy thông tin học sinh:", err);
            return res
                  .status(500)
                  .json({ error: true, message: "Lỗi server khi lấy học sinh" });
      }
}

export async function listAdmins(req, res) {
      try {
            const admins = await getAllAdmins();
            res.status(200).json({ error: false, data: admins });
      } catch (err) {
            console.error("Lỗi khi lấy danh sách quản trị viên:", err);
            res.status(500).json({ error: true, message: "Lỗi máy chủ" });
      }
}

export async function listNurses(req, res) {
      try {
            const nurses = await getAllNurses();
            res.status(200).json({ error: false, data: nurses });
      } catch (err) {
            console.error("Lỗi khi lấy danh sách y tá:", err);
            res.status(500).json({ error: true, message: "Lỗi máy chủ" });
      }
}

export async function listParents(req, res) {
      try {
            const parents = await getAllParents();
            res.status(200).json({ error: false, data: parents });
      } catch (err) {
            console.error("Lỗi khi lấy danh sách phụ huynh:", err);
            res.status(500).json({ error: true, message: "Lỗi máy chủ" });
      }
}

export async function listStudents(req, res) {
      try {
            const students = await getAllStudents();
            res.status(200).json({ error: false, data: students });
      } catch (err) {
            console.error("Lỗi khi lấy danh sách học sinh:", err);
            res.status(500).json({ error: true, message: "Lỗi máy chủ" });
      }
}


export async function listStudentsByClass(req, res) {
      const { class_id } = req.params;

      if (!class_id) {
            return res.status(400).json({ error: true, message: "Thiếu id lớp." });
      }

      try {
            const students = await getAllStudentsByClassID(class_id);
            res.status(200).json({ error: false, data: students });
      } catch (err) {
            console.error("Lỗi khi lấy danh sách học sinh theo lớp:", err);
            res.status(500).json({ error: true, message: "Lỗi máy chủ" });
      }
}

export async function listStudentsByGrade(req, res) {
      const { grade_id } = req.params;

      if (!grade_id) {
            return res.status(400).json({ error: true, message: "Thiếu id khối." });
      }

      try {
            const students = await getAllStudentsByGradeID(grade_id);
            res.status(200).json({ error: false, data: students });
      } catch (err) {
            console.error("Lỗi khi lấy danh sách học sinh theo khối:", err);
            res.status(500).json({ error: true, message: "Lỗi máy chủ" });
      }
}



export async function assignParents(req, res) {
      const { mom_id, dad_id, student_ids } = req.body;

      try {
            const updated = await linkParentsAndStudents(mom_id, dad_id, student_ids);
            res.status(200).json({ error: false, data: updated });
      } catch (err) {
            console.error("Lỗi khi liên kết phụ huynh và học sinh:", err);
            res.status(500).json({ error: true, message: `Lỗi máy chủ: ${err}` });
      }
}


export async function removeMomFromStudent(req, res) {
      const { student_id } = req.params;
      if (!student_id) {
            return res.status(400).json({ error: true, message: "Thiếu student_id" });
      }

      try {
            const result = await removeMomByStudentId(student_id);
            if (result.rowCount === 0) {
                  return res.status(404).json({ error: true, message: "Không tìm thấy học sinh" });
            }

            return res.status(200).json({
                  error: false,
                  message: "Đã xoá mom_id khỏi học sinh",
                  data: result
            });
      } catch (err) {
            console.error("Lỗi khi xoá mom:", err);
            return res.status(500).json({ error: true, message: "Lỗi máy chủ" });
      }
}

export async function removeDadFromStudent(req, res) {
      const { student_id } = req.params;
      if (!student_id) {
            return res.status(400).json({ error: true, message: "Thiếu student_id" });
      }

      try {
            const result = await removeDadByStudentId(student_id);
            if (result.rowCount === 0) {
                  return res.status(404).json({ error: true, message: "Không tìm thấy học sinh" });
            }

            return res.status(200).json({
                  error: false,
                  message: "Đã xoá dad_id khỏi học sinh",
                  data: result
            });
      } catch (err) {
            console.error("Lỗi khi xoá dad:", err);
            return res.status(500).json({ error: true, message: "Lỗi máy chủ" });
      }
}

export async function handleUploadProfileImg(req, res) {
      const upload = multer({ storage: multer.memoryStorage() }).single('image');

      upload(req, res, async function (err) {
            if (err) {
                  return res.status(500).json({ error: true, message: 'Lỗi khi xử lý file.' });
            }

            const file = req.file;

            if (!file) {
                  return res.status(400).json({ error: true, message: 'Không có file ảnh nào được upload.' });
            }

            try {
                  const fileName = `${Date.now()}-${file.originalname}`;

                  const publicUrl = await uploadFileToSupabaseStorage(file, "avatars", fileName);

                  return res.status(200).json({
                        error: false,
                        message: "Upload ảnh thành công",
                        profile_img_url: publicUrl,
                  });

            } catch (err) {
                  console.log(err);
                  return res.status(500).json({
                        error: true,
                        message: `Lỗi hệ thống: ${err.message || err}`,
                  });
            }
      });
}

export async function handleSendResetPasswordLink(req, res) {
      const { email } = req.body;
      if (!email) {
            return res.status(400).json({ error: true, message: "Thiếu email." });
      }

      try {
            const link = await generateResetPasswordLink(email);

            await sendResetPassMail(email, link);

            return res.json({ error: false, message: "Gửi link thành công. Vui lòng check mail!" });
      } catch (err) {
            return res
                  .status(500)
                  .json({ error: true, message: err.message || "Lỗi hệ thống" });
      }
}


export async function deleteAdmin(req, res) {
      try {
            const { admin_id } = req.params;

            const supabase_uid = await getSupabaseUIDOfAUser('admin', admin_id);

            // 1. Soft delete trong bảng admin
            await deleteUserByID('admin', admin_id);

            // 2. Xóa khỏi Supabase Auth
            if (supabase_uid) {
                  await deleteAuthUser(supabase_uid);
            }

            return res.status(200).json({ error: false, message: 'Xóa admin thành công.' });
      } catch (err) {
            console.error('❌ Lỗi khi xóa admin:', err.message);
            return res.status(500).json({ error: true, message: "Xóa admin thất bại!" });
      }

}
export async function deleteNurse(req, res) {
      try {
            const { nurse_id } = req.params;

            const supabase_uid = await getSupabaseUIDOfAUser('nurse', nurse_id);

            await deleteUserByID('nurse', nurse_id);
            if (supabase_uid) await deleteAuthUser(supabase_uid);

            return res.status(200).json({ error: false, message: 'Xóa nurse thành công.' });
      } catch (err) {
            console.error('❌ Lỗi khi xóa nurse:', err.message);
            return res.status(500).json({ error: true, message: "Xóa nurse thất bại!" });
      }
}

export async function deleteParent(req, res) {
      try {
            const { parent_id } = req.params;

            const supabase_uid = await getSupabaseUIDOfAUser('parent', parent_id);

            await deleteUserByID('parent', parent_id);
            if (supabase_uid) await deleteAuthUser(supabase_uid);

            return res.status(200).json({ error: false, message: 'Xóa parent thành công.' });
      } catch (err) {
            console.error('❌ Lỗi khi xóa parent:', err.message);
            return res.status(500).json({ error: true, message: "Xóa parent thất bại!" });
      }
}

export async function deleteStudent(req, res) {
      try {
            const { student_id } = req.params;

            const supabase_uid = await getSupabaseUIDOfAUser('student', student_id);

            await deleteUserByID('student', student_id);
            if (supabase_uid) await deleteAuthUser(supabase_uid);

            return res.status(200).json({ error: false, message: 'Xóa student thành công.' });
      } catch (err) {
            console.error('❌ Lỗi khi xóa student:', err.message);
            return res.status(500).json({ error: true, message: "Xóa student thất bại!" });
      }
}


export async function handleConfirmEmailForUser(req, res) {
      const { role, user_id } = req.params;
      if (!role || !user_id) {
            return res.status(400).json({
                  error: true,
                  message: "Thiếu role hoặc user_id.",
            });
      }
      try {
            const result = await confirmEmailFor(role, user_id,);

            if (!result) {
                  return res.status(404).json({
                        error: true,
                        message: "Không tìm thấy người dùng để xác thực email.",
                  });
            }

            return res.status(200).json({
                  error: false,
                  message: "Xác thực email thành công.",
                  data: result,
            });
      } catch (err) {
            console.error("❌ Lỗi xác thực email:", err.message);
            return res.status(500).json({
                  error: true,
                  message: "Đã xảy ra lỗi khi xác thực email.",
            });
      }
}

export async function handleSendingInvitationToEmails(req, res) {
      const { users } = req.body;

      if (!Array.isArray(users) || users.length === 0) {
            return res.status(400).json({
                  error: true,
                  message: 'Danh sách người dùng không hợp lệ.',
            });
      }

      try {
            const results = await sendInviteLinkToEmails(users);
            console.log(results);

            // lấy ra những user gửi thành công
            const updated_last_invite_at_users = results.filter((user_res) => user_res.error === false);
            console.log(updated_last_invite_at_users);
            await Promise.all(
                  updated_last_invite_at_users.map(({ supabase_uid, role }) =>
                        updateLastInvitationAtByUUID(supabase_uid, role)
                  )
            );

            return res.status(200).json({
                  error: false,
                  message: 'Đã gửi lời mời.',
                  results,
            });
      } catch (err) {
            console.error('❌ Lỗi khi gửi lời mời:', err.message);
            return res.status(500).json({
                  error: true,
                  message: 'Có lỗi xảy ra khi gửi lời mời.',
            });
      }
}

export async function handleUnconfirmEmailForUser(req, res) {
      const { role, user_id } = req.params;
      if (!role || !user_id) {
            return res.status(400).json({
                  error: true,
                  message: "Thiếu role hoặc user_id.",
            });
      }
      try {
            const result = await unconfirmEmailFor(role, user_id);

            if (!result) {
                  return res.status(404).json({
                        error: true,
                        message: "Không tìm thấy người dùng để hủy xác thực email.",
                  });
            }

            return res.status(200).json({
                  error: false,
                  message: "Hủy xác thực email thành công.",
                  data: result,
            });
      } catch (err) {
            console.error("❌ Lỗi hủy xác thực email:", err.message);
            return res.status(500).json({
                  error: true,
                  message: "Đã xảy ra lỗi khi hủy xác thực email.",
            });
      }
}

// get exel template
export async function getAdminExcelImportSample(req, res) {

}

export async function getNurseExcelImportSample(req, res) {

}

export async function getStudentParentExcelImportSample(req, res) {

}

// download all user - excel
export async function handleDownloadUsers(req, res) {
      try {
            const [admins, nurses, parents, students] = await Promise.all([
                  getAllAdmins(),
                  getAllNurses(),
                  getAllParents(),
                  getAllStudents()
            ]);

            const workbook = new ExcelJS.Workbook();

            // 🧑‍💼 Sheet: Admin
            const adminSheet = workbook.addWorksheet('admin');
            if (admins.length > 0) {
                  adminSheet.columns = Object.keys(admins[0]).map(key => ({ header: key, key }));
                  admins.forEach(admin => adminSheet.addRow(admin));
            }

            // 🧑‍⚕️ Sheet: Nurse
            const nurseSheet = workbook.addWorksheet('nurse');
            if (nurses.length > 0) {
                  nurseSheet.columns = Object.keys(nurses[0]).map(key => ({ header: key, key }));
                  nurses.forEach(nurse => nurseSheet.addRow(nurse));
            }

            // 👨‍👩‍👧‍👦 Sheet: Student + Parent Info
            const studentSheet = workbook.addWorksheet('student_parent');
            if (students.length > 0) {
                  const flattened = students.map(s => ({
                        id: s.id,
                        name: s.name,
                        email: s.email,
                        dob: s.dob,
                        age: s.age,
                        isMale: s.isMale,
                        address: s.address,
                        phone_number: s.phone_number,
                        profile_img_url: s.profile_img_url,
                        year_of_enrollment: s.year_of_enrollment,
                        email_confirmed: s.email_confirmed,
                        class_id: s.class_id,
                        class_name: s.class_name,
                        mom_id: s.mom_profile?.id || '',
                        mom_name: s.mom_profile?.name || '',
                        mom_email: s.mom_profile?.email || '',
                        dad_id: s.dad_profile?.id || '',
                        dad_name: s.dad_profile?.name || '',
                        dad_email: s.dad_profile?.email || ''
                  }));

                  studentSheet.columns = Object.keys(flattened[0]).map(key => ({ header: key, key }));
                  flattened.forEach(row => studentSheet.addRow(row));
            }

            // 📥 Sheet: Parent + Their Children Info
            const parentSheet = workbook.addWorksheet('parent');
            if (parents.length > 0) {
                  // Flatten each parent to a row with all fields + children (as JSON string for now)
                  const flattenedParents = parents.map(p => ({
                        id: p.id,
                        name: p.name,
                        email: p.email,
                        dob: p.dob,
                        age: p.age,
                        isMale: p.isMale,
                        address: p.address,
                        phone_number: p.phone_number,
                        profile_img_url: p.profile_img_url,
                        email_confirmed: p.email_confirmed,
                  }));

                  parentSheet.columns = Object.keys(flattenedParents[0]).map(key => ({ header: key, key }));
                  flattenedParents.forEach(row => parentSheet.addRow(row));
            }

            // 📦 Xuất ra buffer
            const buffer = await workbook.xlsx.writeBuffer();

            const fileName = `users-${Date.now()}.xlsx`;
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.send(buffer);

      } catch (error) {
            console.error('❌ Lỗi khi tạo file Excel:', error);
            res.status(500).json({ error: true, message: 'Không thể xuất file Excel' });
      }
}


// upload user with each role
export async function handleUploadAdmin(req, res) {
      const upload = multer({ storage: multer.memoryStorage() }).single("file");

      upload(req, res, async function (err) {
            if (err) {
                  return res
                        .status(500)
                        .json({ error: true, message: "Lỗi khi xử lý file." });
            }

            const file = req.file;

            try {
                  // đưa file về json
                  const jsonData = await excelToJson(file.buffer);
                  //---- luồng xử lý tạo tài khoản trên supabase
                  await Promise.all(
                        jsonData.map(async (user) => {
                              user.is_success = false;
                              const email = typeof user.email === "object" ? user.email.text : user.email;
                              user.email = email || null;
                              if (!email) {
                                    user.create_log = `User không đăng ký email`;
                                    user.is_success = true;
                                    return;
                              };

                              const { data, error } = await supabaseAdmin.createUser({
                                    email,
                                    email_confirm: false,
                                    user_metadata: {},
                                    app_metadata: {
                                          role: "admin",
                                    },
                              });

                              if (error) {
                                    user.create_log = error.message;
                                    user.is_success = false;
                                    user.supabase_uid = null;
                              } else {
                                    user.create_log = "Tạo tài khoản thành công.";
                                    user.is_success = true;
                                    user.supabase_uid = data.user?.id;
                              }

                        })
                  );
                  //---- luồng xử lý insert vào db riêng
                  await Promise.all(
                        jsonData.map(async (user) => {
                              user.id = null;
                              if (!user.is_success) {
                                    return;
                              }
                              try {
                                    const { supabase_uid, email, name, dob, isMale, address, phone_number, profile_img_url } = user;
                                    const insert_data = await insertAdmin(supabase_uid, email, name, dob, isMale, address, phone_number, profile_img_url);
                                    user.id = insert_data.id;
                                    user.create_log += "Tạo user thành công.";
                                    user.is_success = true;
                              } catch (err) {
                                    user.create_log += `Insert thất bại: ${err.message}. Không thể tạo user.`;
                                    user.is_success = false;
                                    if (user.supabase_uid) {
                                          await deleteAuthUser(user.supabase_uid); // roll back xóa user trên supabase auth
                                    }
                                    user.supabase_uid = null;
                              }
                        })
                  )
                  console.log(jsonData);
                  //--- trả về tổng cộng số user cần xử lý + số dòng lỗi + file excel có log lỗi
                  const headers = [
                        "id",
                        "supabase_uid",
                        "email",
                        "name",
                        "dob",
                        "isMale",
                        "address",
                        "phone_number",
                        "is_success",
                        "create_log",
                  ];
                  const rows = jsonData.map((user) => [
                        user.id || "",
                        user.supabase_uid || "",
                        user.email || "",
                        user.name || "",
                        user.dob || "",
                        user.isMale ?? "",
                        user.address || "",
                        user.phone_number || "",
                        user.is_success ? "✅" : "❌",
                        user.create_log || "",
                  ]);

                  const buffer = await exportExcelToBuffer(headers, rows, "Admin Upload Log");

                  res.setHeader(
                        "Content-Disposition",
                        'attachment; filename="admin_upload_log.xlsx"'
                  );
                  res.setHeader(
                        "Content-Type",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  );

                  return res.send(buffer);
            } catch (err) {
                  console.error("Error:", err);
                  return res.status(500).json({
                        error: true,
                        message: `Lỗi hệ thống: ${err.message || err}`,
                  });
            }
      });
}

export async function handleUploadNurse(req, res) {
      const upload = multer({ storage: multer.memoryStorage() }).single("file");

      upload(req, res, async function (err) {
            if (err) return res.status(500).json({ error: true, message: "Lỗi xử lý file." });

            const file = req.file;
            try {
                  const jsonData = await excelToJson(file.buffer);

                  await Promise.all(jsonData.map(async (user) => {
                        user.is_success = false;
                        const email = typeof user.email === "object" ? user.email.text : user.email;
                        user.email = email || null;
                        if (!email) {
                              user.create_log = `User không đăng ký email`;
                              user.is_success = true;
                              return;
                        }

                        const { data, error } = await supabaseAdmin.createUser({
                              email,
                              email_confirm: false,
                              user_metadata: {},
                              app_metadata: { role: "nurse" },
                        });

                        if (error) {
                              user.create_log = error.message;
                              user.supabase_uid = null;
                        } else {
                              user.create_log = "Tạo tài khoản thành công.";
                              user.supabase_uid = data.user?.id;
                              user.is_success = true;
                        }
                  }));

                  await Promise.all(jsonData.map(async (user) => {
                        user.id = null;
                        if (!user.is_success) return;
                        try {
                              const { supabase_uid, email, name, dob, isMale, address, phone_number, profile_img_url } = user;
                              const inserted = await insertNurse(supabase_uid, email, name, dob, isMale, address, phone_number, profile_img_url);
                              user.id = inserted.id;
                              user.create_log += " Tạo user thành công.";
                        } catch (err) {
                              user.create_log += `Insert thất bại: ${err.message}. Không thể tạo user.`;
                              user.is_success = false;
                              if (user.supabase_uid) {
                                    await deleteAuthUser(user.supabase_uid); // roll back xóa user trên supabase auth
                              }
                              user.supabase_uid = null;
                        }
                  }));

                  const headers = ["id", "supabase_uid", "email", "name", "dob", "isMale", "address", "phone_number", "is_success", "create_log"];
                  const rows = jsonData.map((user) => [
                        user.id || "",
                        user.supabase_uid || "",
                        user.email || "",
                        user.name || "",
                        user.dob || "",
                        user.isMale ?? "",
                        user.address || "",
                        user.phone_number || "",
                        user.is_success ? "✅" : "❌",
                        user.create_log || "",
                  ]);

                  const buffer = await exportExcelToBuffer(headers, rows, "Nurse Upload Log");

                  res.setHeader("Content-Disposition", 'attachment; filename="nurse_upload_log.xlsx"');
                  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                  return res.send(buffer);
            } catch (err) {
                  console.error("Error:", err);
                  return res.status(500).json({ error: true, message: `Lỗi hệ thống: ${err.message || err}` });
            }
      });
}

export async function handleUploadParent(req, res) {
      const upload = multer({ storage: multer.memoryStorage() }).single("file");

      upload(req, res, async function (err) {
            if (err) return res.status(500).json({ error: true, message: "Lỗi xử lý file." });

            const file = req.file;
            try {
                  const jsonData = await excelToJson(file.buffer);

                  await Promise.all(jsonData.map(async (user) => {
                        user.is_success = false;
                        const email = typeof user.email === "object" ? user.email.text : user.email;
                        user.email = email || null;
                        if (!email) {
                              user.create_log = `User không đăng ký email`;
                              user.is_success = true;
                              return;
                        }

                        const { data, error } = await supabaseAdmin.createUser({
                              email,
                              email_confirm: false,
                              user_metadata: {},
                              app_metadata: { role: "parent" },
                        });

                        if (error) {
                              user.create_log = error.message;
                              user.supabase_uid = null;
                        } else {
                              user.create_log = "Tạo tài khoản thành công.";
                              user.supabase_uid = data.user?.id;
                              user.is_success = true;
                        }
                  }));

                  await Promise.all(jsonData.map(async (user) => {
                        user.id = null;
                        if (!user.is_success) return;
                        try {
                              const { supabase_uid, email, name, dob, isMale, address, phone_number, profile_img_url } = user;
                              const inserted = await insertParent(supabase_uid, email, name, dob, isMale, address, phone_number, profile_img_url);
                              user.id = inserted.id;
                              user.create_log += " Tạo user thành công.";
                        } catch (err) {
                              user.create_log += `Insert thất bại: ${err.message}. Không thể tạo user.`;
                              user.is_success = false;
                              if (user.supabase_uid) {
                                    await deleteAuthUser(user.supabase_uid); // roll back xóa user trên supabase auth
                              }
                              user.supabase_uid = null;
                        }
                  }));

                  const headers = ["id", "supabase_uid", "email", "name", "dob", "isMale", "address", "phone_number", "is_success", "create_log"];
                  const rows = jsonData.map((user) => [
                        user.id || "",
                        user.supabase_uid || "",
                        user.email || "",
                        user.name || "",
                        user.dob || "",
                        user.isMale ?? "",
                        user.address || "",
                        user.phone_number || "",
                        user.is_success ? "✅" : "❌",
                        user.create_log || "",
                  ]);

                  const buffer = await exportExcelToBuffer(headers, rows, "Parent Upload Log");

                  res.setHeader("Content-Disposition", 'attachment; filename="parent_upload_log.xlsx"');
                  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                  return res.send(buffer);
            } catch (err) {
                  console.error("Error:", err);
                  return res.status(500).json({ error: true, message: `Lỗi hệ thống: ${err.message || err}` });
            }
      });
}

export async function handleUploadStudent(req, res) {
      const upload = multer({ storage: multer.memoryStorage() }).single("file");

      upload(req, res, async function (err) {
            if (err) return res.status(500).json({ error: true, message: "Lỗi xử lý file." });

            const file = req.file;
            const client = await pool.connect();
            try {
                  client.query("BEGIN");
                  const auth_users = []; // email, name, role, supabase_uid
                  let overall_success = true;


                  // I. TAO PARENT trước
                  // xử lý dữ liệu thô trước --> chuyển thành map
                  let parentRawData = await excelToJson(file.buffer, "PARENT", 11);
                  parentRawData = parentRawData.filter(obj => Object.keys(obj).length > 0);

                  const parentMap = new Map();
                  parentRawData.forEach((parent) => {
                        const { parent_no, ...rest } = parent;
                        if (parent_no != null) {
                              parentMap.set(parent_no, {
                                    ...rest,
                                    is_success: false,
                                    create_log: "",
                                    id: null
                              });
                        }
                  });

                  // tao tai khoan cho bo me
                  await Promise.all([...parentMap.entries()].map(async ([parent_no, user]) => {
                        user.is_success = false;
                        user.create_log = "";
                        if (!user.email) {
                              user.create_log += `User không đăng ký email`;
                              user.is_success = true;
                              return;
                        }
                        const name = user?.name || "No name";
                        const email = typeof user.email === "object" ? user.email.text : user.email;
                        user.email = email || null;

                        const { data, error } = await supabaseAdmin.createUser({
                              email,
                              email_confirm: false,
                              user_metadata: {},
                              app_metadata: { role: "parent" },
                        });

                        if (error) {
                              user.is_success = false;
                              user.create_log += error.message;
                              user.supabase_uid = null;
                              overall_success = false;
                        } else {
                              user.is_success = true;
                              user.create_log = "Tạo tài khoản thành công. ";
                              user.supabase_uid = data.user?.id;
                              auth_users.push({ email, name, role: "parent", supabase_uid: data.user?.id });
                        }
                  }));

                  await Promise.all([...parentMap.entries()].map(async ([parent_no, user]) => {
                        if (!user.is_success) return;
                        try {
                              let { supabase_uid, email, name, dob, isMale, address, phone_number, profile_img_url } = user;
                              profile_img_url = typeof profile_img_url === "object" ? profile_img_url.text : profile_img_url;
                              const inserted = await insertParentWithClient(supabase_uid, email, name, dob, isMale, address, phone_number, profile_img_url, client);
                              user.id = inserted.id;
                              user.is_success = true;
                              user.create_log += "Tạo user trong cơ sở dữ liệu thành công. ";
                        } catch (err) {
                              user.supabase_uid = null;
                              user.is_success = false;
                              user.create_log += `Insert thất bại: ${err.message}. Không thể tạo user.`;
                              overall_success = false;
                        }
                  }));

                  // II. TẠO HOME
                  // lấy dữ liệu thô trước
                  let homeRawData = await excelToJson(file.buffer, "HOME", 10);
                  homeRawData = homeRawData.filter(obj => Object.keys(obj).length > 0);

                  const homeMap = new Map();
                  homeRawData.forEach((home) => {
                        const { home_no, ...rest } = home;
                        if (home_no != null) {
                              homeMap.set(home_no, {
                                    ...rest,
                                    is_success: false,
                                    create_log: "",
                                    id: null
                              });
                        }
                  });

                  await Promise.all([...homeMap.entries()].map(async ([home_no, home_info]) => {
                        try {
                              let { contact_email, contact_phone_number, dad_no, mom_no } = home_info;
                              contact_email = typeof contact_email === "object" ? contact_email.text : contact_email;
                              const inserted = await client.query(`
                                          insert into home (contact_email, contact_phone_number, dad_id, mom_id) values
                                          ($1, $2, $3, $4) returning *
                                    `, [contact_email, contact_phone_number, parentMap.get(dad_no).id, parentMap.get(mom_no).id]);
                              home_info.id = inserted.rows[0].id;
                              home_info.is_success = true;
                              home_info.create_log += "Tạo hộ gia đình thành công. ";
                        } catch (err) {
                              home_info.supabase_uid = null;
                              home_info.is_success = false;
                              home_info.create_log += `Insert thất bại: ${err.message}. Không thể tạo hộ gia đình. `;
                              overall_success = false;
                        }
                  }));

                  // III. TẠO STUDENT VÀ GẮN HOME ID VÀO
                  let studentRawData = await excelToJson(file.buffer, "STUDENT", 16);
                  studentRawData = studentRawData.filter(obj => Object.keys(obj).length > 0);

                  const studentMap = new Map();
                  studentRawData.forEach((student) => {
                        const { student_no, ...rest } = student;
                        if (student_no != null) {
                              studentMap.set(student_no, {
                                    ...rest,
                                    is_success: false,
                                    create_log: "",
                                    id: null
                              });
                        }
                  });

                  // tao tai khoan cho hs
                  await Promise.all([...studentMap.entries()].map(async ([student_no, user]) => {
                        user.is_success = false;
                        user.create_log = "";
                        if (!user.email) {
                              user.create_log += `User không đăng ký email`;
                              user.is_success = true;
                              return;
                        }
                        const name = user?.name || "No name";
                        const email = typeof user.email === "object" ? user.email.text : user.email;
                        user.email = email || null;

                        const { data, error } = await supabaseAdmin.createUser({
                              email,
                              email_confirm: false,
                              user_metadata: {},
                              app_metadata: { role: "student" },
                        });

                        if (error) {
                              user.is_success = false;
                              user.create_log += error.message;
                              user.supabase_uid = null;
                              overall_success = false;
                        } else {
                              user.is_success = true;
                              user.create_log = "Tạo tài khoản thành công. ";
                              user.supabase_uid = data.user?.id;
                              auth_users.push({ email, name, role: "student", supabase_uid: data.user?.id });
                        }
                  }));

                  await Promise.all([...studentMap.entries()].map(async ([student_no, user]) => {
                        if (!user.is_success) return;
                        try {
                              let { supabase_uid, email, name, dob, isMale, address, year_of_enrollment, class_id, phone_number, profile_img_url, home_no } = user;
                              profile_img_url = typeof profile_img_url === "object" ? profile_img_url.text : profile_img_url;
                              const inserted = await insertStudentWithClient(client, supabase_uid, email, name, dob, isMale, address, phone_number, profile_img_url, class_id, year_of_enrollment, homeMap.get(home_no).id);
                              user.id = inserted.id;
                              user.is_success = true;
                              user.create_log += "Tạo học sinh trong cơ sở dữ liệu thành công. ";
                        } catch (err) {
                              user.supabase_uid = null;
                              user.is_success = false;
                              user.create_log += `Insert thất bại: ${err.message}. Không thể tạo học sinh.`;
                              overall_success = false;
                        }
                  }));

                  // IV. CHỐT HẠ VÀ RESPONSE
                  if (overall_success === false) {
                        await deleteAuthUsers(auth_users);
                        await client.query("ROLLBACK");
                  } else {
                        const results = await sendInviteLinkToEmails(auth_users);
                        // lấy ra những user gửi thành công
                        const updated_last_invite_at_users = results.filter((user_res) => user_res.error === false);
                        await Promise.all(updated_last_invite_at_users.map(async ({ supabase_uid, role }) =>
                              await updateLastInvitationAtByUUIDWithClient(supabase_uid, role, client)
                        ));
                        await client.query("COMMIT");
                  }

                  const parentHeaders = [
                        "parent_no",
                        "id",
                        "email",
                        "name",
                        "dob",
                        "isMale",
                        "address",
                        "phone_number",
                        "profile_img_url",
                        "is_success",
                        "create_log",
                  ];

                  const parentRows = [...parentMap.entries()].map(([parent_no, user]) => [
                        parent_no || "",
                        user.id || "",
                        user.email || "",
                        user.name || "",
                        user.dob || "",
                        user.isMale ?? "",
                        user.address || "",
                        user.phone_number || "",
                        user.profile_img_url || "",
                        user.is_success ? "✅" : "❌",
                        user.create_log || "",
                  ]);

                  const homeHeaders = [
                        "home_no",
                        "id",
                        "contact_email",
                        "contact_phone_number",
                        "dad_no",
                        "dad_name",
                        "mom_no",
                        "mom_name",
                        "is_success",
                        "create_log"
                  ]

                  const homeRows = [...homeMap.entries()].map(([home_no, home_info]) => [
                        home_no || "",
                        home_info.id || "",
                        home_info.contact_email || "",
                        home_info.contact_phone_number || "",
                        home_info.dad_no || "",
                        home_info.dad_name ?? "",
                        home_info.mom_no || "",
                        home_info.mom_name || "",
                        home_info.is_success ? "✅" : "❌",
                        home_info.create_log || "",
                  ]);

                  const studentHeaders = [
                        "student_no",
                        "id",
                        "email",
                        "name",
                        "dob",
                        "isMale",
                        "address",
                        "year_of_enrollment",
                        "profile_img_url",
                        "phone_number",
                        "class_id",
                        "home_no",
                        "dad_name",
                        "mom_name",
                        "is_success",
                        "create_log"
                  ]
                  const studentRows = [...studentMap.entries()].map(([student_no, student]) => [
                        student_no || "",
                        student.id || "",
                        student.email || "",
                        student.name || "",
                        student.dob || "",
                        student.isMale ?? "",
                        student.address || "",
                        student.year_of_enrollment || "",
                        student.profile_img_url || "",
                        student.phone_number || "",
                        student.class_id || "",
                        student.home_no || "",
                        student.dad_name || "",
                        student.mom_name || "",
                        student.is_success ? "✅" : "❌",
                        student.create_log || "",
                  ]);


                  let buffer = await exportExcelToBuffer(parentHeaders, parentRows, "PARENT");
                  buffer = await addSheetToBuffer(buffer, "HOME", homeHeaders, homeRows);
                  buffer = await addSheetToBuffer(buffer, "STUDENT", studentHeaders, studentRows);

                  res.setHeader("Content-Disposition", 'attachment; filename="upload_log.xlsx"');
                  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                  return res.send(buffer);
            } catch (err) {
                  client.query("ROLLBACK");
                  console.error("Error:", err);
                  return res.status(500).json({ error: true, message: `Lỗi hệ thống: ${err.message || err}` });
            } finally {
                  client.release();
            }
      });
}

// get sample to input data
export async function handleGetAdminImportSample(req, res) {
      try {
            const buffer = await generateAdminImportTemplate();

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=admin_import_template.xlsx');
            res.status(200).send(buffer);
      } catch (error) {
            console.error('Error generating admin import template:', error);
            res.status(500).json({ error: true, message: 'Failed to generate import template' });
      }
}

export async function handleGetNurseImportSample(req, res) {
      try {
            const buffer = await generateImportTemplate('import-nurse-template.xlsx');

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=nurse_import_template.xlsx');
            res.status(200).send(buffer);
      } catch (error) {
            console.error('Error generating nurse import template:', error);
            res.status(500).json({ error: true, message: 'Failed to generate import template' });
      }
}

export async function handleGetParentImportSample(req, res) {
      try {
            const buffer = await generateImportTemplate('import-parent-template.xlsx');

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=parent_import_template.xlsx');
            res.status(200).send(buffer);
      } catch (error) {
            console.error('Error generating parent import template:', error);
            res.status(500).json({ error: true, message: 'Failed to generate import template' });
      }
}

export async function handleGetStudentImportSample(req, res) {
      try {
            let buffer = await generateImportTemplate('import-student-template.xlsx');

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=student_import_template.xlsx');
            res.status(200).send(buffer);
      } catch (error) {
            console.error('Error generating student import template:', error);
            res.status(500).json({ error: true, message: 'Failed to generate import template' });
      }
}


// ---------------------------------------------------------------------------OTP

export async function handleCreateNewOTPForgotPassword(req, res) {
      const { email } = req.body;

      if (!email) {
            res.status(400).json({
                  error: true,
                  message: "Không nhận được email!"
            })
      }

      try {

            //check xem đã có otp chưa, rồi thì không tạo nữa
            const is_otp_using = await hasUsingOTP(email, "forgot_password");
            if (is_otp_using) {
                  return res.status(200).json({
                        error: true,
                        message: "OTP còn hiệu lực."
                  })
            }

            // tạo mới
            const newOTP = await insertNewOTP(email, "forgot_password");
            // gửi email
            await sendOTPEmail(email, newOTP);
            return res.status(200).json({
                  error: false,
                  message: "Gửi thành công."
            })
      } catch (err) {
            return res.status(500).json({
                  error: true,
                  message: "Lỗi hệ thống: " + err.message,
            })
      }
}

export async function handleCheckOTPForForgotPassword(req, res) {
      const { email, otp } = req.query;

      try {
            const isValid = await verifyOTP(email, otp, 'forgot_password');

            return res.status(200).json({
                  error: false,
                  is_valid_otp: isValid,
                  message: isValid ? "OTP hợp lệ." : "OTP không hợp lệ hoặc đã hết hạn."
            });

      } catch (err) {
            console.error('Lỗi khi kiểm tra OTP:', err);
            return res.status(500).json({
                  error: true,
                  message: 'Lỗi máy chủ khi xác minh OTP.',
            });
      }
}

export async function handleSendRecoveryLinkForForgotPassword(req, res) {
      const { email, otp } = req.body;

      try {
            const isValid = await verifyOTP(email, otp, 'forgot_password');
            if (!isValid) {
                  return res.status(400).json({ error: true, message: 'OTP không hợp lệ hoặc đã hết hạn.' });
            }

            const link = await generateRecoveryLink(email);
            await updateOTPHasBeenUsed(email, "forgot_password");
            await sendRecoveryLinkEmailForForgotPassword(email, link);
            return res.status(200).json({ error: false, message: 'Đặt lại mật khẩu thành công.' });
      } catch (err) {
            console.error('Lỗi khi reset mật khẩu:', err.message);
            return res.status(500).json({ error: true, message: 'Có lỗi xảy ra khi đặt lại mật khẩu.' });
      }
}


export async function handleExistEmail(req, res) {
      const { email } = req.query;

      if (!email) {
            return res.status(400).json({
                  error: true,
                  message: "Thiếu email",
            });
      }

      try {
            const user = await getUserByEmail(email);
            console.log(user);
            const email_existed = !!user;
            console.log(email_existed);

            return res.status(200).json({
                  error: false,
                  email_existed,
            });
      } catch (err) {
            console.error("❌ Lỗi kiểm tra email:", err.message);
            return res.status(500).json({
                  error: true,
                  message: "Lỗi hệ thống khi kiểm tra email.",
            });
      }
}

export async function handleCreateOTPForUpdateEmailByUser(req, res) {
      const { email } = req.body;

      if (!email) {
            res.status(400).json({
                  error: true,
                  message: "Không nhận được email!"
            })
      }

      try {

            //check xem đã có otp chưa, rồi thì không tạo nữa
            const is_otp_using = await hasUsingOTP(email, "update_email");
            if (is_otp_using) {
                  return res.status(200).json({
                        error: true,
                        message: "OTP còn hiệu lực."
                  })
            }

            // tạo mới
            const newOTP = await insertNewOTP(email, "update_email");
            // gửi email
            await sendOTPEmail(email, newOTP);
            return res.status(200).json({
                  error: false,
                  message: "Gửi thành công."
            })
      } catch (err) {
            return res.status(500).json({
                  error: true,
                  message: "Lỗi hệ thống: " + err.message,
            })
      }
}

export async function handleCheckOTPForUpdateEmailByUser(req, res) {
      const { email, otp } = req.query;

      try {
            const isValid = await verifyOTP(email, otp, 'update_email');

            return res.status(200).json({
                  error: false,
                  is_valid_otp: isValid,
                  message: isValid ? "OTP hợp lệ." : "OTP không hợp lệ hoặc đã hết hạn."
            });

      } catch (err) {
            console.error('Lỗi khi kiểm tra OTP:', err);
            return res.status(500).json({
                  error: true,
                  message: 'Lỗi máy chủ khi xác minh OTP.',
            });
      }
}

export async function handleUpdateEmailByUser(req, res) {
      const { email, otp, role, id } = req.body;

      try {
            const isValid = await verifyOTP(email, otp, 'update_email');
            if (!isValid) {
                  return res.status(400).json({ error: true, message: 'OTP không hợp lệ hoặc đã hết hạn.' });
            }

            await updateOTPHasBeenUsed(email, "update_email");
            const result = await query(`
                  update ${role} set email = $1 
                  where id = $2 returning *
            `, [email, id])

            console.log(result);

            await updateEmailForSupabaseAuthUser(result.rows[0].supabase_uid, email); // cap nhat email tren supabase

            return res.status(200).json({ error: false, message: 'Cập nhật email thành công.' });
      } catch (err) {
            console.error('Lỗi khi reset mật khẩu:', err.message);
            return res.status(500).json({ error: true, message: 'Có lỗi xảy ra khi cập nhật email.' });
      }
}

export async function handleParentRegisterEmailForStudent(req, res) {
      const { email, otp, role, student_id, name } = req.body;

      try {
            const isValid = await verifyOTP(email, otp, 'update_email');
            if (!isValid) {
                  return res.status(400).json({ error: true, message: 'OTP không hợp lệ hoặc đã hết hạn.' });
            }

            const { supabase_uid, invite_link } = await createSupabaseAuthUserWithRole(email, name, role);
            console.log(supabase_uid);

            const result = await query(
                  `
                        UPDATE ${role}
                        SET email_confirmed = false, last_invitation_at = now(), supabase_uid = $1, email = $2
                        WHERE id = $3 returning *
                        `,
                  [supabase_uid, email, student_id]
            );
            console.log(result.rows[0]);

            return res.status(200).json({ error: false, message: 'Cập nhật email thành công.' });
      } catch (err) {
            console.error('Lỗi khi reset mật khẩu:', err.message);
            return res.status(500).json({ error: true, message: 'Có lỗi xảy ra khi cập nhật email.' });
      }
}



// ------------------------------------------------------------------------ FLOW UPDATE AND ACCOUNT UPDATE
export async function editUserInfoByAdmin(req, res) {
      const { id, role, updates } = req.body;

      if (!id) {
            return res.status(400).json({
                  error: true,
                  message: "Thiếu ID người dùng."
            });
      }

      if (!role) {
            return res.status(400).json({
                  error: true,
                  message: "Thiếu vai trò người dùng (admin, nurse, parent, student)."
            });
      }

      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
            return res.status(400).json({
                  error: true,
                  message: "Trường 'updates' phải là một object chứa thông tin cần cập nhật."
            });
      }

      if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                  error: true,
                  message: "Không có trường nào để cập nhật."
            });
      }

      // khoong cho cập nhật supabase_uid, tự động sinh khi tạo mới tài khoản với email
      if (updates?.supabase_uid) {
            return res.status(400).json({
                  error: true,
                  message: "Không thể cập nhật trực tiếp supabase_uid (tự động sinh khi tạo mới tài khoản)."
            });
      }

      if (updates?.email) {
            return res.status(400).json({
                  error: true,
                  message: "Không thể cập nhật trực tiếp email."
            })
      }

      try {
            // ONLY EDIT THE NORMAL INFO OF USER
            const result = await editUserProfileByAdmin(id, role, updates);

            if (!result) {
                  return res.status(404).json({ error: true, message: "Không tìm thấy người dùng." });
            }

            return res.status(200).json({
                  error: false,
                  message: "Cập nhật thành công.",
                  data: result
            });

      } catch (err) {
            console.error("Lỗi khi cập nhật thông tin người dùng:", err);
            return res.status(500).json({ error: true, message: `Lỗi máy chủ: ${err}}` });
      }
}

export async function handleUpdateProfileByUser(req, res) {
      const { id, role, updates } = req.body;


      if (!id) {
            return res.status(400).json({
                  error: true,
                  message: "Thiếu ID người dùng."
            });
      }

      if (!role) {
            return res.status(400).json({
                  error: true,
                  message: "Thiếu vai trò người dùng (admin, nurse, parent, student)."
            });
      }

      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
            return res.status(400).json({
                  error: true,
                  message: "Trường 'updates' phải là một object chứa thông tin cần cập nhật."
            });
      }

      const { profile_img_url, phone_number, address } = updates;

      try {
            const result = await updateProfileFor(id, role, {
                  profile_img_url, phone_number, address
            });

            if (!result) {
                  return res.status(404).json({ error: true, message: "Không tìm thấy người dùng." });
            }

            return res.status(200).json({
                  error: false,
                  message: "Cập nhật thành công.",
                  data: result
            });

      } catch (err) {
            console.error("Lỗi khi cập nhật thông tin người dùng:", err);
            return res.status(500).json({ error: true, message: `Lỗi máy chủ: ${err}}` });
      }
}

export async function handleDeleteAccountByAdmin(req, res) {
      const { id, role } = req.body;
      if (!id) {
            return res.status(400).json({
                  error: true,
                  message: "Thiếu ID người dùng."
            });
      }

      if (!role) {
            return res.status(400).json({
                  error: true,
                  message: "Thiếu vai trò người dùng (admin, nurse, parent, student)."
            });
      }

      try {

            const supabase_uid = await getSupabaseUIDOfAUser(role, id);

            await deleteAuthUser(supabase_uid);

            await query(
                  `
                        update ${role} set supabase_uid = null, email = null, last_invitation_at = null WHERE id = $1;
                  `,
                  [id]
            )

            return res.status(200).json({
                  error: false,
                  message: "Xóa thành công tài khoản.",
            });

      } catch (err) {
            return res.status(500).json({ error: true, message: `Lỗi máy chủ: ${err}}` });
      }

}

export async function handleUpdateAccountByAdmin(req, res) {
      const { id, role, email, name } = req.body;
      if (!id) {
            return res.status(400).json({
                  error: true,
                  message: "Thiếu ID người dùng."
            });
      }

      if (!role) {
            return res.status(400).json({
                  error: true,
                  message: "Thiếu vai trò người dùng (admin, nurse, parent, student)."
            });
      }

      if (!email) {
            return res.status(400).json({
                  error: true,
                  message: "Thiếu email."
            });
      }


      try {
            const old_supabase_uid = await getSupabaseUIDOfAUser(role, id);

            const { supabase_uid, invite_link } = await createSupabaseAuthUserWithRole(email, name, role);


            const result = await query(
                  `
                        update ${role}
                        set email_confirmed = false, last_invitation_at = now(), supabase_uid = $1, email = $2
                        where id = $3
                        `,
                  [supabase_uid, email, id]
            )

            await deleteAuthUser(old_supabase_uid);
            return res.status(200).json({
                  error: false,
                  message: `Cập nhật thành công tài khoản: email ${email}. Đã gửi email mời tham gia hệ thống.`,
            });

      } catch (err) {
            return res.status(500).json({ error: true, message: `Lỗi máy chủ: ${err}}` });
      }
}

export async function getHomeInfoByID(req, res) {
      const { id } = req.params;

      if (!id) {
            return res.status(400).json({
                  error: true,
                  message: "Thiếu ID."
            });
      }

      try {
            const result = await query(
                  `
      SELECT 
        h.*,
        row_to_json(mom) AS mom,
        row_to_json(dad) AS dad,
        COALESCE(json_agg(row_to_json(stu)) FILTER (WHERE stu.id IS NOT NULL), '[]') AS students
      FROM home h 
      LEFT JOIN parent mom ON mom.id = h.mom_id
      LEFT JOIN parent dad ON dad.id = h.dad_id
      LEFT JOIN student stu ON stu.home_id = h.id
      WHERE h.id = $1
      GROUP BY h.id, mom.id, dad.id
      `,
                  [id]
            );

            if (result.rows.length === 0) {
                  return res.status(404).json({
                        error: true,
                        message: "Không tìm thấy bản ghi home tương ứng."
                  });
            }

            return res.status(200).json({
                  error: false,
                  data: result.rows[0]
            });

      } catch (err) {
            console.error("❌ Lỗi khi lấy thông tin home:", err);
            return res.status(500).json({
                  error: true,
                  message: `Lỗi máy chủ: ${err.message}`
            });
      }
}

export async function getAllHomes(req, res) {
      try {
            const result = await query(`
      SELECT 
        h.*,
        mom.name AS mom_name,
        dad.name AS dad_name,
		count(stu.id) as students
      FROM home h
      LEFT JOIN parent mom ON mom.id = h.mom_id
      LEFT JOIN parent dad ON dad.id = h.dad_id
	  LEFT JOIN student stu on stu.home_id = h.id
	  group by h.id, mom.name, dad.name
      ORDER BY h.id DESC
    `);

            return res.status(200).json({
                  error: false,
                  data: result.rows
            });

      } catch (err) {
            console.error("❌ Lỗi khi lấy danh sách homes:", err);
            return res.status(500).json({
                  error: true,
                  message: `Lỗi máy chủ: ${err.message}`
            });
      }
}



export async function updateUsersForHome(req, res) {
      const { id } = req.params;
      const { mom_id, dad_id, student_ids, contact_phone_number, contact_email } = req.body;

      if (!id) {
            return res.status(400).json({
                  error: true,
                  message: "Thiếu ID."
            });
      }

      if (student_ids && !Array.isArray(student_ids)) {
            return res.status(400).json({
                  error: true,
                  message: "student_ids phải là một array."
            });
      }

      const client = await pool.connect();

      try {
            await client.query("BEGIN");

            // Cập nhật home
            await client.query(`
      UPDATE home
      SET mom_id = $2,
          dad_id = $3,
          contact_phone_number = $4,
          contact_email = $5
      WHERE id = $1
    `, [id, mom_id, dad_id, contact_phone_number, contact_email]);

            // Gỡ liên kết tất cả học sinh khỏi home này
            await client.query(`UPDATE student SET home_id = NULL WHERE home_id = $1`, [id]);

            // Gán lại học sinh
            for (const student_id of student_ids || []) {
                  await client.query(`
        UPDATE student
        SET home_id = $1
        WHERE id = $2
      `, [id, student_id]);
            }

            await client.query("COMMIT");

            return res.status(200).json({
                  error: false,
                  message: "Cập nhật thông tin home và học sinh thành công."
            });

      } catch (err) {
            await client.query("ROLLBACK");
            console.error("❌ Lỗi khi cập nhật home:", err);
            return res.status(500).json({
                  error: true,
                  message: "Lỗi hệ thống khi cập nhật thông tin."
            });

      } finally {
            client.release();
      }
}


export async function createNewHome(req, res) {
      const { mom_id, dad_id, student_ids, contact_phone_number, contact_email } = req.body;

      if (student_ids && !Array.isArray(student_ids)) {
            return res.status(400).json({
                  error: true,
                  message: "student_ids không hợp lệ."
            });
      }

      const client = await pool.connect();

      try {
            await client.query("BEGIN");

            // Tạo home mới
            const result = await client.query(`
      INSERT INTO home (mom_id, dad_id, contact_phone_number, contact_email)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, [mom_id || null, dad_id || null, contact_phone_number || null, contact_email || null]);

            const home_id = result.rows[0].id;

            // Gán học sinh vào home mới
            for (const student_id of student_ids) {
                  await client.query(`
        UPDATE student
        SET home_id = $1
        WHERE id = $2
      `, [home_id, student_id]);
            }

            await client.query("COMMIT");

            return res.status(200).json({
                  error: false,
                  message: "Tạo home thành công.",
                  home_id
            });

      } catch (err) {
            await client.query("ROLLBACK");
            console.error("❌ Lỗi khi tạo home:", err);
            return res.status(500).json({
                  error: true,
                  message: "Lỗi hệ thống khi tạo home."
            });

      } finally {
            client.release();
      }
}

export async function getStudentsWithoutHome(req, res) {
      try {
            const result = await query(`
      SELECT 
        s.*, 
        c.name AS class_name
      FROM student s
      LEFT JOIN class c ON c.id = s.class_id
      WHERE s.home_id IS NULL
      ORDER BY s.id
    `);

            return res.status(200).json({
                  error: false,
                  data: result.rows
            });

      } catch (err) {
            console.error("❌ Lỗi khi lấy học sinh chưa có home:", err);
            return res.status(500).json({
                  error: true,
                  message: `Lỗi máy chủ: ${err.message}`
            });
      }
}

export async function getParentsWithoutHome(req, res) {
      try {
            const result = await query(`
      SELECT p.*
      FROM parent p
      WHERE NOT EXISTS (
        SELECT 1 FROM home h WHERE h.mom_id = p.id OR h.dad_id = p.id
      )
      ORDER BY p.id
    `);

            return res.status(200).json({
                  error: false,
                  data: result.rows
            });

      } catch (err) {
            console.error("❌ Lỗi khi lấy danh sách phụ huynh chưa có home:", err);
            return res.status(500).json({
                  error: true,
                  message: `Lỗi máy chủ: ${err.message}`
            });
      }
}

export async function deleteHome(req, res) {
      const { id } = req.params;

      if (!id) {
            return res.status(400).json({
                  error: true,
                  message: "Thiếu ID."
            });
      }

      const client = await pool.connect();
      try {
            await client.query('BEGIN');

            // Bước 1: Gỡ liên kết học sinh trước
            await client.query(
                  `UPDATE student SET home_id = NULL WHERE home_id = $1`,
                  [id]
            );

            // Bước 2: Xóa home
            const deleteRes = await client.query(
                  `DELETE FROM home WHERE id = $1 RETURNING *`,
                  [id]
            );

            await client.query('COMMIT');

            if (deleteRes.rows.length === 0) {
                  return res.status(404).json({
                        error: true,
                        message: "Không tìm thấy home để xóa."
                  });
            }

            return res.status(200).json({
                  error: false,
                  message: "Đã xóa home thành công.",
                  data: deleteRes.rows[0]
            });

      } catch (err) {
            await client.query('ROLLBACK');
            console.error("❌ Lỗi khi xóa home:", err);
            return res.status(500).json({
                  error: true,
                  message: `Lỗi máy chủ: ${err.message}`
            });
      } finally {
            client.release?.();
      }
}
