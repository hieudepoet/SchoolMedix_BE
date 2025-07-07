import { supabaseAdmin } from "../config/supabase.js";
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
      sendRecoveryLinkEmailForForgotPassword


} from "../services/index.js";

import ExcelJS from 'exceljs';
import { query } from "../config/database.js";
import { hasUsingOTP, insertNewOTP, updateOTPHasBeenUsed, verifyOTP } from "../services/otp/index.js";


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



export async function deleteAdmin(req, res) {
      try {
            const { admin_id } = req.params;

            // 1. Soft delete trong bảng admin
            const supabase_uid = await deleteUserByID('admin', admin_id);

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

            const supabase_uid = await deleteUserByID('nurse', nurse_id);
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

            const supabase_uid = await deleteUserByID('parent', parent_id);
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

            const supabase_uid = await deleteUserByID('student', student_id);
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
                        mom_name: s.mom_profile?.name || '',
                        mom_email: s.mom_profile?.email || '',
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
                        children: JSON.stringify(p.students || [])
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
            try {
                  let jsonData = await excelToJson(file.buffer, 10);
                  jsonData = jsonData.filter(obj => Object.keys(obj).length > 0);
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
                              app_metadata: { role: "student" },
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
                              const { supabase_uid, email, name, dob, isMale, address, phone_number, profile_img_url, class_id, year_of_enrollment, mom_id, dad_id } = user;
                              const inserted = await insertStudent(supabase_uid, email, name, dob, isMale, address, phone_number, profile_img_url, class_id, year_of_enrollment, mom_id, dad_id);
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

                  const headers = ["id", "supabase_uid", "email", "name", "dob", "isMale", "address", "phone_number", "class_id", "year_of_enrollment", "mom_id", "dad_id", "is_success", "create_log"];
                  const rows = jsonData.map((user) => [
                        user.id || "",
                        user.supabase_uid || "",
                        user.email || "",
                        user.name || "",
                        user.dob || "",
                        user.isMale ?? "",
                        user.address || "",
                        user.phone_number || "",
                        user.class_id || "",
                        user.year_of_enrollment || "",
                        user.mom_id || "",
                        user.dad_id || "",
                        user.is_success ? "✅" : "❌",
                        user.create_log || "",
                  ]);

                  let buffer = await exportExcelToBuffer(headers, rows, "Student Upload Log");

                  res.setHeader("Content-Disposition", 'attachment; filename="student_upload_log.xlsx"');
                  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                  return res.send(buffer);
            } catch (err) {
                  console.error("Error:", err);
                  return res.status(500).json({ error: true, message: `Lỗi hệ thống: ${err.message || err}` });
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

            const result = await query(`SELECT * FROM parent WHERE is_deleted = false`);
            const parents = result.rows;

            const parent_headers = ["id", "email", "name", "dob", "isMale", "address", "phone_number"];

            const parent_rows = parents.map(parent => [
                  parent.id,
                  parent.email,
                  parent.name,
                  parent.dob,
                  parent.ismale,
                  parent.address,
                  parent.phone_number,
            ]);

            buffer = await addSheetToBuffer(buffer, "CURRENT_PARENT", parent_headers, parent_rows);

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

      try {
            // nếu profile chưa đăng ký tài khoản mà cập nhật mới email thì sẽ tạo mới tài khoản (gửi qua mail acc + pass) rồi gắn supabase_uid vào user_profile
            // nếu profile đăng ký tài khoản rồi mà cập nhật email mới thì gửi lại
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